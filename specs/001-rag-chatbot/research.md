# Research: RAG Chatbot Technical Discovery

**Feature**: Integrated RAG Chatbot for Physical AI Book
**Date**: 2025-12-22
**Purpose**: Document technical research findings and design decisions for RAG implementation

---

## 1. RAG Pipeline Architecture

### Research Question
What are the best practices for RAG systems in educational contexts, and what chunking strategies should we use?

### Decision: 512-token chunks with 50-token overlap, fixed-size strategy

**Rationale**:
- **Chunk Size**: 512 tokens balances context granularity with retrieval precision. Smaller chunks (256 tokens) risk fragmenting coherent explanations, while larger chunks (1024+ tokens) dilute relevance scores by including unrelated content.
- **Overlap**: 50-token overlap (10%) ensures continuity across chunk boundaries, preventing loss of context when concepts span multiple chunks.
- **Fixed-Size Strategy**: Semantic chunking (by headings) was considered but rejected due to variable chapter structure in MDX files. Fixed-size ensures consistent embedding quality and predictable retrieval.

**Alternatives Considered**:
- **256-token chunks**: Too granular; would require retrieving 10+ chunks for complex queries, increasing latency and noise.
- **1024-token chunks**: Better for narrative coherence but degrades retrieval precision; relevant sentences get buried in irrelevant context.
- **Semantic chunking (by headings)**: Ideal for well-structured content but fails with nested headings, lists, and code blocks common in technical books.

**Implementation Details**:
- Use tiktoken library for accurate token counting (matches OpenAI's tokenization)
- Chunk algorithm: Sliding window with 512-token size, 50-token stride (overlaps previous chunk by 50 tokens)
- Preserve paragraph boundaries where possible (split on `\n\n` within token limit)
- Store chunk metadata: chapter title, section heading (extracted from nearest `##` or `###` in MDX), chunk_index

**Prompt Engineering for Grounding**:
- System prompt template:
  ```
  You are a helpful assistant answering questions about the Physical AI and Humanoid Robotics book.
  Use ONLY the provided context below to answer. If the answer is not in the context, say "I couldn't find information about this in the book."
  ALWAYS cite the source chapter and section when quoting or paraphrasing.

  Context:
  {retrieved_chunks}

  Question: {user_query}
  ```
- For selected-text mode, replace `{retrieved_chunks}` with `Selected text: {user_selected_text}`
- Add conversation history to prompt for follow-up questions: `Previous conversation: {history}`

**References**:
- LangChain chunking strategies: https://python.langchain.com/docs/modules/data_connection/document_transformers/
- OpenAI RAG best practices: https://platform.openai.com/docs/guides/retrieval-augmented-generation
- Pinecone chunking guide: https://www.pinecone.io/learn/chunking-strategies/

---

## 2. MDX Parsing and Content Extraction

### Research Question
How should we parse MDX files and handle frontmatter, code blocks, and images?

### Decision: Use `unified` + `remark` ecosystem; strip code blocks and images

**Rationale**:
- **MDX Parsing**: The `unified` + `remark-mdx` pipeline is the standard for MDX processing, with robust support for frontmatter, JSX, and custom components.
- **Code Blocks**: Strip code blocks from embeddings to avoid noise in semantic search. Code syntax rarely matches user queries about concepts. Store code as metadata if needed for future features.
- **Images**: Strip images and alt text; semantic search on visual content is out of scope. Future feature could embed alt text separately.
- **Frontmatter**: Parse and strip frontmatter (title, date, tags); use title as chapter metadata.

**Alternatives Considered**:
- **gray-matter + custom regex**: Simpler but brittle for complex MDX with JSX components; would fail on edge cases like nested code blocks or inline JSX.
- **Include code blocks in embeddings**: Tested with sample chapters; code syntax creates semantic noise (e.g., "import React" matches unrelated queries about importing data).

**Implementation Details**:
- Pipeline: `unified().use(remarkParse).use(remarkMdx).use(remarkFrontmatter).use(remarkStringify)`
- Transformers:
  - Extract frontmatter (title → chapter_title metadata)
  - Remove code blocks (match fenced blocks ` ```lang ... ``` `)
  - Remove images (match `![alt](url)` and MDX `<img>` tags)
  - Extract headings (## Section → section_heading metadata for nearest chunks)
  - Normalize whitespace (collapse multiple newlines, trim)
- Output: Clean plain text string for chunking + metadata dict

**Libraries**:
- `unified`: Core parser framework
- `remark-parse`: Markdown → AST
- `remark-mdx`: MDX syntax support
- `remark-frontmatter`: YAML frontmatter extraction
- `remark-stringify`: AST → text

**References**:
- unified docs: https://unifiedjs.com/
- remark-mdx: https://github.com/mdx-js/mdx/tree/main/packages/remark-mdx
- gray-matter (alternative): https://github.com/jonschlinkert/gray-matter

---

## 3. Qdrant Collection Configuration

### Research Question
What Qdrant collection settings should we use, and which Cohere embedding model?

### Decision: Cohere embed-english-v3.0 (1024 dims), cosine similarity

**Rationale**:
- **Embedding Model**: Cohere `embed-english-v3.0` is optimized for semantic search with 1024 dimensions, free tier supports 100 requests/min (sufficient for MVP). Outperforms older models (embed-english-light-v2.0) on retrieval benchmarks.
- **Vector Dimensions**: 1024 (fixed by model)
- **Distance Metric**: Cosine similarity is standard for text embeddings (measures semantic similarity regardless of vector magnitude).
- **Indexing Strategy**: Use HNSW (Hierarchical Navigable Small World) index for fast approximate nearest neighbor search; default in Qdrant.

**Alternatives Considered**:
- **OpenAI embeddings (text-embedding-3-small)**: Better accuracy but no free tier; would exceed budget constraint.
- **Sentence-Transformers (all-MiniLM-L6-v2)**: Free but lower quality; 384 dimensions reduce semantic richness for technical content.
- **Euclidean distance**: Less effective for high-dimensional embeddings; cosine similarity is domain standard.

**Implementation Details**:
- Qdrant collection config:
  ```python
  from qdrant_client.models import Distance, VectorParams

  client.create_collection(
      collection_name="physical_ai_book",
      vectors_config=VectorParams(size=1024, distance=Distance.COSINE),
  )
  ```
- Metadata payload for each point:
  ```json
  {
    "chunk_id": "uuid",
    "text": "full chunk text",
    "chapter_title": "Chapter 3: Actuators",
    "section_heading": "Hydraulic Systems",
    "chunk_index": 5,
    "source_file_path": "chapters/03-actuators.mdx"
  }
  ```
- Retrieval query:
  ```python
  results = client.search(
      collection_name="physical_ai_book",
      query_vector=query_embedding,
      limit=5,  # top-5 chunks
      with_payload=True,  # return metadata for citations
  )
  ```

**References**:
- Cohere embeddings: https://docs.cohere.com/docs/embeddings
- Qdrant collections: https://qdrant.tech/documentation/concepts/collections/
- HNSW index: https://arxiv.org/abs/1603.09320

---

## 4. Docusaurus Plugin Integration

### Research Question
How should we integrate the chatbot widget into Docusaurus, and how to capture text selection?

### Decision: Custom React component in swizzled Root.tsx; window.getSelection() + context menu

**Rationale**:
- **Integration Method**: Swizzle Docusaurus theme's `Root.tsx` to inject chatbot widget globally on all pages. This is the standard approach for global UI components (confirmed by Docusaurus docs).
- **Widget Placement**: Floating button (bottom-right corner) that expands to chat panel. Sidebar placement considered but rejected to avoid layout conflicts with existing navigation.
- **Text Selection**: Use `window.getSelection()` API with custom context menu (right-click or button) to trigger selected-text mode. Browser-native API, widely supported in modern browsers.

**Alternatives Considered**:
- **Custom Docusaurus plugin**: More complex; requires ejecting config and managing plugin lifecycle. Swizzling Root is simpler for UI-only features.
- **Sidebar widget**: Conflicts with existing table of contents; would require theme overrides that break on Docusaurus updates.
- **Selection via double-click**: Less discoverable; users expect right-click context menus for text actions.

**Implementation Details**:
- Swizzle Root component:
  ```bash
  npm run swizzle @docusaurus/theme-classic Root -- --wrap
  ```
- Wrap existing Root with ChatbotWidget provider:
  ```tsx
  // src/theme/Root.tsx
  import ChatbotWidget from '@site/src/components/ChatbotWidget';

  export default function Root({children}) {
    return (
      <>
        {children}
        <ChatbotWidget />
      </>
    );
  }
  ```
- Text selection capture:
  ```tsx
  const handleTextSelection = () => {
    const selectedText = window.getSelection()?.toString().trim();
    if (selectedText) {
      setSelectedContext(selectedText);
      openChatbot();  // expand widget
    }
  };

  // Add listener to document
  useEffect(() => {
    document.addEventListener('mouseup', handleTextSelection);
    return () => document.removeEventListener('mouseup', handleTextSelection);
  }, []);
  ```
- Show "Ask about selection" button when text is selected (positioned near selection using `getBoundingClientRect()`)

**Browser Compatibility**:
- `window.getSelection()`: Supported in Chrome 1+, Firefox 1+, Safari 1+, Edge 12+
- No polyfills needed for target browsers (Chrome, Firefox, Edge latest 2 versions)

**References**:
- Docusaurus swizzling: https://docusaurus.io/docs/swizzling
- window.getSelection(): https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection
- React selection hooks: https://github.com/juliankrispel/use-text-selection

---

## 5. OpenRouter API Configuration

### Research Question
How to configure OpenAI SDK for OpenRouter, and should we use streaming?

### Decision: OpenAI SDK with custom base_url; full response (no streaming for MVP)

**Rationale**:
- **OpenAI SDK Configuration**: OpenRouter is OpenAI API-compatible; simply override `base_url` and use OpenRouter API key. No custom client needed.
- **Streaming**: Deferred to future iteration. Full response generation simplifies error handling and frontend state management for MVP. Streaming adds complexity (managing partial responses, error recovery mid-stream).
- **Model**: `mistralai/devstral-2512:free` as specified by user; free tier, suitable for RAG tasks.

**Alternatives Considered**:
- **Streaming responses**: Better UX for long responses but adds complexity:
  - Frontend must handle SSE (Server-Sent Events) or WebSocket
  - Backend must stream FastAPI response (`StreamingResponse`)
  - Error handling mid-stream is brittle
  - Deferred to post-MVP based on user feedback
- **Custom OpenRouter client**: Unnecessary; OpenAI SDK handles custom base URLs natively.

**Implementation Details**:
- Backend service (`generation_service.py`):
  ```python
  from openai import OpenAI

  client = OpenAI(
      base_url="https://openrouter.ai/api/v1",
      api_key=os.getenv("OPENROUTER_API_KEY"),
  )

  def generate_response(prompt: str, context: str) -> str:
      response = client.chat.completions.create(
          model="mistralai/devstral-2512:free",
          messages=[
              {"role": "system", "content": "You are a helpful assistant..."},
              {"role": "user", "content": f"Context: {context}\n\nQuestion: {prompt}"}
          ],
          temperature=0.7,
          max_tokens=500,
      )
      return response.choices[0].message.content
  ```
- Error handling: Catch `openai.RateLimitError` and return 429 status to frontend

**Rate Limits**:
- OpenRouter free tier: ~10 requests/min for Devstral model
- Mitigation: Display rate limit message to user; implement exponential backoff in frontend (retry after 60s)

**References**:
- OpenRouter docs: https://openrouter.ai/docs
- OpenAI SDK custom base_url: https://github.com/openai/openai-python#usage-with-azure-openai

---

## 6. Error Handling and Rate Limiting

### Research Question
How to handle rate limits and implement graceful error degradation?

### Decision: Exponential backoff (client-side), user-friendly fallback messages, no backend rate limiting for MVP

**Rationale**:
- **Rate Limiting**: Backend rate limiting (per-IP/session) deferred to post-MVP. Free-tier API limits are the primary bottleneck; backend limiting adds complexity without addressing root cause. Frontend should handle 429 errors gracefully.
- **Exponential Backoff**: Implement in frontend for 429 errors from OpenRouter/Cohere. Retry after 60s, then 120s, max 3 retries.
- **Fallback Messages**: Replace generic errors with user-friendly messages:
  - Rate limit: "The chatbot is experiencing high demand. Please try again in a moment."
  - No results: "I couldn't find information about this topic in the book. Try rephrasing your question."
  - Server error: "The chatbot is temporarily unavailable. Please try again later."

**Alternatives Considered**:
- **Backend rate limiting**: Adds complexity (Redis for distributed state, per-IP tracking). Free-tier API limits are sufficient constraint for MVP; defer to production deployment if abuse occurs.
- **Request queuing**: Considered for handling bursts but rejected; adds latency and complexity. Better to show rate limit message and retry.

**Implementation Details**:
- Frontend error handling (`chatbotApi.ts`):
  ```typescript
  async function sendQuery(query: string, retries = 3): Promise<ChatResponse> {
    try {
      const response = await axios.post('/chat', {query});
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && retries > 0) {
        await sleep(60000 * (4 - retries));  // exponential backoff: 60s, 120s, 180s
        return sendQuery(query, retries - 1);
      }
      throw new UserFriendlyError(mapErrorMessage(error));
    }
  }

  function mapErrorMessage(error): string {
    const status = error.response?.status;
    if (status === 429) return "High demand. Retrying...";
    if (status === 404) return "No information found in the book.";
    return "Chatbot unavailable. Try again later.";
  }
  ```
- Backend error responses:
  ```python
  # In generation_service.py
  try:
      response = client.chat.completions.create(...)
  except openai.RateLimitError:
      raise HTTPException(status_code=429, detail="Rate limit exceeded")
  except openai.APIError as e:
      raise HTTPException(status_code=500, detail="AI service error")
  ```

**Monitoring**:
- Log all 429 errors to track free-tier quota usage
- Consider Sentry (free tier) for error tracking in production

**References**:
- Exponential backoff: https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/
- HTTP status codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status

---

## Summary of Decisions

| Decision Area | Choice | Rationale |
|---------------|--------|-----------|
| Chunk Size | 512 tokens, 50-token overlap | Balances granularity and coherence |
| Chunking Strategy | Fixed-size (sliding window) | Consistent quality; handles variable MDX structure |
| MDX Parsing | unified + remark, strip code/images | Standard tooling; reduces semantic noise |
| Embedding Model | Cohere embed-english-v3.0 (1024 dims) | Best free-tier option; optimized for search |
| Vector Database | Qdrant Cloud (cosine similarity) | Free tier, HNSW index for fast retrieval |
| Widget Integration | Swizzled Root.tsx, floating button | Standard Docusaurus pattern; global availability |
| Text Selection | window.getSelection() + context menu | Native API, broad browser support |
| AI API | OpenAI SDK + OpenRouter base_url | OpenAI-compatible, free Devstral model |
| Response Mode | Full (no streaming) | Simpler for MVP; streaming deferred |
| Rate Limiting | Client-side backoff, no backend limit | Addresses API limits; avoids backend complexity |
| Error Handling | User-friendly fallback messages | Improves UX; clear actionable guidance |

**Next Steps**: Proceed to Phase 1 (Data Model, API Contracts, Quickstart) with these decisions implemented.
