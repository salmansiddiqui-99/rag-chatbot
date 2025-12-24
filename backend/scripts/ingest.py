"""
Content ingestion script for indexing MDX book chapters.

Parses MDX files, chunks content, generates embeddings, and stores in Qdrant + Neon.
"""
import sys
import os
import hashlib
import argparse
from pathlib import Path
from typing import List, Dict, Any
import uuid

# Add parent directory to path for imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.config import config
from src.utils.mdx_parser import parse_mdx
from src.utils.chunking import chunk_text
from src.services.embedding_service import embedding_service
from src.services.vector_service import vector_service
from src.services.db_service import db_service


def compute_file_hash(file_path: str) -> str:
    """
    Compute SHA-256 hash of file content for change detection.

    Args:
        file_path: Path to file

    Returns:
        Hexadecimal hash string
    """
    sha256 = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(8192), b''):
            sha256.update(chunk)
    return sha256.hexdigest()


def process_document(file_path: str) -> List[Dict[str, Any]]:
    """
    Process a single MDX document into chunks with embeddings.

    Args:
        file_path: Path to MDX file

    Returns:
        List of chunk dictionaries ready for Qdrant upsert
    """
    print(f"  Processing: {file_path}")

    # Parse MDX
    parsed = parse_mdx(file_path)
    text = parsed['text']
    chapter_title = parsed['chapter_title']
    headings = parsed['headings']

    # Chunk text
    chunks = chunk_text(
        text,
        chunk_size=config.CHUNK_SIZE,
        overlap=config.CHUNK_OVERLAP
    )

    print(f"    Created {len(chunks)} chunks from {len(text)} characters")

    # Generate embeddings and create chunk objects
    chunk_objects = []

    # Batch embed for efficiency
    print(f"    Generating embeddings...")
    embeddings = embedding_service.embed_batch(chunks)

    for idx, (chunk_text_str, embedding) in enumerate(zip(chunks, embeddings)):
        # Determine section heading for this chunk
        # Simple approach: use first heading if available
        section_heading = headings[0] if headings else None

        chunk_obj = {
            "chunk_id": str(uuid.uuid4()),
            "text": chunk_text_str,
            "embedding": embedding,
            "chapter_title": chapter_title,
            "section_heading": section_heading,
            "chunk_index": idx,
            "source_file_path": str(file_path)
        }
        chunk_objects.append(chunk_obj)

    return chunk_objects


def ingest_directory(content_dir: str) -> Dict[str, Any]:
    """
    Ingest all MDX files from a directory.

    Args:
        content_dir: Path to directory containing MDX files

    Returns:
        Dictionary with ingestion statistics
    """
    import time
    start_time = time.time()

    content_path = Path(content_dir)
    if not content_path.exists():
        raise ValueError(f"Content directory not found: {content_dir}")

    # Find all MDX files
    mdx_files = list(content_path.glob("**/*.mdx")) + list(content_path.glob("**/*.md"))

    if not mdx_files:
        raise ValueError(f"No MDX/MD files found in {content_dir}")

    print(f"Found {len(mdx_files)} files to process")

    # Ensure Qdrant collection exists
    print("\nInitializing Qdrant collection...")
    vector_service.create_collection()

    # Process each file
    all_chunks = []
    processed_files = []

    for mdx_file in mdx_files:
        try:
            # Compute file hash
            file_hash = compute_file_hash(str(mdx_file))

            # Process document
            chunks = process_document(str(mdx_file))
            all_chunks.extend(chunks)

            # Store metadata
            db_service.upsert_document_metadata(
                file_path=str(mdx_file),
                content_hash=file_hash,
                chunk_count=len(chunks)
            )

            processed_files.append(str(mdx_file))

        except Exception as e:
            print(f"  ERROR processing {mdx_file}: {e}")
            continue

    # Upsert all chunks to Qdrant
    if all_chunks:
        print(f"\nUploading {len(all_chunks)} chunks to Qdrant...")
        vector_service.upsert_chunks(all_chunks)
        print("  Upload complete!")

    duration = time.time() - start_time

    return {
        "indexed_files": len(processed_files),
        "total_chunks": len(all_chunks),
        "duration_seconds": round(duration, 2),
        "files": processed_files
    }


def main():
    """Main ingestion script entry point."""
    parser = argparse.ArgumentParser(description="Ingest MDX book content into vector database")
    parser.add_argument(
        "--content-dir",
        type=str,
        required=True,
        help="Directory containing MDX files"
    )
    args = parser.parse_args()

    print("=" * 60)
    print("RAG CHATBOT CONTENT INGESTION")
    print("=" * 60)
    print(f"Content directory: {args.content_dir}\n")

    try:
        result = ingest_directory(args.content_dir)

        print("\n" + "=" * 60)
        print("INGESTION COMPLETE")
        print("=" * 60)
        print(f"Files indexed: {result['indexed_files']}")
        print(f"Total chunks: {result['total_chunks']}")
        print(f"Duration: {result['duration_seconds']}s")
        print("\nIndexed files:")
        for file_path in result['files']:
            print(f"  - {file_path}")

    except Exception as e:
        print(f"\nERROR: Ingestion failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
