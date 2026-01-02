"""
Ingestion endpoint for triggering content indexing.
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import Optional, List
import subprocess
import os
import time
import hashlib
import uuid
import xml.etree.ElementTree as ET
import requests
from bs4 import BeautifulSoup
import re

from src.config import config
from src.utils.chunking import chunk_text
from src.services.embedding_service import embedding_service
from src.services.vector_service import vector_service
from src.services.db_service import db_service

router = APIRouter()


class IngestRequest(BaseModel):
    """Request model for /ingest endpoint."""
    content_dir: str


class WebIngestRequest(BaseModel):
    """Request model for /ingest-web endpoint."""
    sitemap_url: str = "https://salmansiddiqui-99.github.io/rag-chatbot/sitemap.xml"


class IngestResponse(BaseModel):
    """Response model for /ingest endpoint."""
    indexed_files: int
    total_chunks: int
    duration_seconds: float
    status: str


class WebIngestResponse(BaseModel):
    """Response model for /ingest-web endpoint."""
    indexed_pages: int
    total_chunks: int
    duration_seconds: float
    status: str
    pages: List[str]


@router.post("/ingest", response_model=IngestResponse)
async def trigger_ingestion(request: IngestRequest):
    """
    Trigger content ingestion from MDX files.

    This endpoint runs the ingestion script to index book content.

    Args:
        request: IngestRequest with content_dir path

    Returns:
        IngestResponse with ingestion statistics

    Raises:
        HTTPException 400: If content directory is invalid
        HTTPException 500: If ingestion fails
    """
    content_dir = request.content_dir

    # Validate content directory exists
    if not os.path.exists(content_dir):
        raise HTTPException(
            status_code=400,
            detail=f"Content directory not found: {content_dir}"
        )

    try:
        # Run ingestion script
        script_path = os.path.join(
            os.path.dirname(__file__),
            "..",
            "..",
            "scripts",
            "ingest.py"
        )

        result = subprocess.run(
            ["python", script_path, "--content-dir", content_dir],
            capture_output=True,
            text=True,
            timeout=600  # 10 minute timeout
        )

        if result.returncode != 0:
            raise Exception(f"Ingestion script failed: {result.stderr}")

        # Parse output for statistics
        # TODO: Enhance ingestion script to output JSON for easier parsing
        # For now, return success with placeholder stats
        return IngestResponse(
            indexed_files=0,  # Will be populated from script output
            total_chunks=0,   # Will be populated from script output
            duration_seconds=0.0,  # Will be populated from script output
            status="success"
        )

    except subprocess.TimeoutExpired:
        raise HTTPException(
            status_code=500,
            detail="Ingestion timed out after 10 minutes"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Ingestion failed: {str(e)}"
        )


def fetch_sitemap_urls(sitemap_url: str) -> List[str]:
    """Fetch and parse sitemap XML to extract all URLs."""
    response = requests.get(sitemap_url, timeout=30)
    response.raise_for_status()

    root = ET.fromstring(response.content)
    namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

    urls = []
    for url_element in root.findall('.//ns:loc', namespace):
        urls.append(url_element.text)

    if not urls:
        for url_element in root.findall('.//loc'):
            urls.append(url_element.text)

    return urls


def extract_main_content(html: str, url: str) -> dict:
    """Extract main content from HTML page."""
    soup = BeautifulSoup(html, 'html.parser')

    for element in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe']):
        element.decompose()

    title = None
    title_tag = soup.find('title')
    if title_tag:
        title = title_tag.get_text().strip()
        if '|' in title:
            title = title.split('|')[0].strip()

    main_content = None
    selectors = ['article', 'main', '.markdown', '[class*="docPage"]', '.main-wrapper']

    for selector in selectors:
        main_content = soup.select_one(selector)
        if main_content:
            break

    if not main_content:
        main_content = soup.find('body')

    if not main_content:
        return {'title': title or 'Unknown', 'text': ''}

    h1 = main_content.find('h1')
    if h1 and not title:
        title = h1.get_text().strip()

    text = main_content.get_text(separator='\n', strip=True)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    text = text.strip()

    if not title:
        path = url.rstrip('/').split('/')[-1]
        title = path.replace('-', ' ').replace('_', ' ').title()

    return {'title': title, 'text': text}


def process_page(url: str) -> List[dict]:
    """Fetch a web page and process it into chunks with embeddings."""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()

        content = extract_main_content(response.text, url)
        title = content['title']
        text = content['text']

        if not text or len(text) < 50:
            return []

        chunks = chunk_text(
            text,
            chunk_size=config.CHUNK_SIZE,
            overlap=config.CHUNK_OVERLAP
        )

        embeddings = embedding_service.embed_batch(chunks)

        chunk_objects = []
        for idx, (chunk_text_str, embedding) in enumerate(zip(chunks, embeddings)):
            chunk_obj = {
                "chunk_id": str(uuid.uuid4()),
                "text": chunk_text_str,
                "embedding": embedding,
                "chapter_title": title,
                "section_heading": None,
                "chunk_index": idx,
                "source_file_path": url
            }
            chunk_objects.append(chunk_obj)

        return chunk_objects
    except Exception:
        return []


@router.post("/ingest-web", response_model=WebIngestResponse)
async def trigger_web_ingestion(request: WebIngestRequest):
    """
    Trigger content ingestion from a sitemap URL.

    This endpoint fetches pages from the sitemap, extracts content,
    generates embeddings, and stores them in the vector database.

    Args:
        request: WebIngestRequest with sitemap_url

    Returns:
        WebIngestResponse with ingestion statistics
    """
    start_time = time.time()

    try:
        # Fetch URLs from sitemap
        urls = fetch_sitemap_urls(request.sitemap_url)

        if not urls:
            raise HTTPException(
                status_code=400,
                detail=f"No URLs found in sitemap: {request.sitemap_url}"
            )

        # Filter out non-content pages
        content_urls = [
            url for url in urls
            if '/search' not in url and '/markdown-page' not in url
        ]

        # Ensure Qdrant collection exists
        vector_service.create_collection()

        # Process each URL
        all_chunks = []
        processed_urls = []

        for url in content_urls:
            try:
                chunks = process_page(url)

                if chunks:
                    all_chunks.extend(chunks)

                    content_hash = hashlib.sha256(url.encode()).hexdigest()
                    db_service.upsert_document_metadata(
                        file_path=url,
                        content_hash=content_hash,
                        chunk_count=len(chunks)
                    )

                    processed_urls.append(url)

                time.sleep(0.3)  # Rate limiting

            except Exception:
                continue

        # Upsert all chunks to Qdrant
        if all_chunks:
            vector_service.upsert_chunks(all_chunks)

        duration = time.time() - start_time

        return WebIngestResponse(
            indexed_pages=len(processed_urls),
            total_chunks=len(all_chunks),
            duration_seconds=round(duration, 2),
            status="success",
            pages=processed_urls
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Web ingestion failed: {str(e)}"
        )
