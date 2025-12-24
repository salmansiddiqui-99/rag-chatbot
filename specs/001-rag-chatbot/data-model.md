# Data Model: RAG Chatbot

**Feature**: Integrated RAG Chatbot for Physical AI Book
**Date**: 2025-12-22
**Purpose**: Define entities, validation rules, and state transitions for RAG chatbot system

---

## Entity Definitions

### 1. ContentChunk

**Description**: Represents a 512-token segment of book content stored in Qdrant vector database for semantic search.

**Storage**: Qdrant Cloud collection `physical_ai_book`

**Fields**:
- `chunk_id` (UUID, primary key): Unique identifier for the chunk
- `text` (string, required): Full text content of the chunk (512 tokens)
- `embedding` (vector[1024], required): Cohere embed-english-v3.0 embedding vector
- `chapter_title` (string, required): Title of the source book chapter
- `section_heading` (string, optional): Nearest section heading (extracted from `##` or `###` in MDX)
- `chunk_index` (integer, required): Sequential position of chunk within chapter (0-indexed)
- `source_file_path` (string, required): Relative path to source MDX file (e.g., `chapters/03-actuators.mdx`)

**Relationships**:
- Belongs to one **Book Chapter** (via `source_file_path`)
- Referenced by **DocumentMetadata** (via `source_file_path`, one-to-many)

**Indexes**:
- Vector index: HNSW on `embedding` field (cosine similarity)
- Metadata filter: `chapter_title`, `source_file_path` for scoped retrieval

**Example**:
```json
{
  "chunk_id": "a3f5c7d9-1234-5678-9abc-def012345678",
  "text": "Hydraulic actuators use pressurized fluid to generate mechanical force. They offer high power-to-weight ratios, making them suitable for heavy-duty humanoid applications. The main components include a pump, valves, and cylinders...",
  "embedding": [0.023, -0.145, 0.678, ...],  // 1024-dimensional vector
  "chapter_title": "Chapter 3: Actuators",
  "section_heading": "Hydraulic Systems",
  "chunk_index": 5,
  "source_file_path": "chapters/03-actuators.mdx"
}
```

---

### 2. DocumentMetadata

**Description**: Tracks indexed book chapters in Neon Postgres for change detection and re-indexing triggers.

**Storage**: Neon Serverless Postgres, table `document_metadata`

**Fields**:
- `id` (integer, primary key, auto-increment): Unique identifier
- `file_path` (string, unique, required): Relative path to MDX file
- `content_hash` (string, required): SHA-256 hash of file content for change detection
- `last_indexed_at` (timestamp, required): Last successful indexing timestamp
- `chunk_count` (integer, required): Number of chunks created from this document

**Relationships**:
- References multiple **ContentChunk** (via `file_path`, one-to-many)

**State Transitions**:
1. **Unindexed**: File exists but not in database
2. **Indexing**: Ingestion in progress (temporary state, not persisted)
3. **Indexed**: Successfully indexed, `content_hash` matches file
4. **Stale**: `content_hash` mismatch detected (file modified since last index)
5. **Re-indexing**: Stale document being re-indexed

**SQL Schema**:
```sql
CREATE TABLE document_metadata (
    id SERIAL PRIMARY KEY,
    file_path VARCHAR(512) UNIQUE NOT NULL,
    content_hash CHAR(64) NOT NULL,  -- SHA-256 hex string
    last_indexed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    chunk_count INTEGER NOT NULL CHECK (chunk_count >= 0)
);

CREATE INDEX idx_file_path ON document_metadata(file_path);
CREATE INDEX idx_last_indexed ON document_metadata(last_indexed_at DESC);
```

**Example**:
```json
{
  "id": 3,
  "file_path": "chapters/03-actuators.mdx",
  "content_hash": "a3c5f7d9e1b2c4f6e8a0b2d4f6e8c0a2b4d6f8e0c2a4b6d8f0e2c4a6b8d0f2e4",
  "last_indexed_at": "2025-12-22T10:30:00Z",
  "chunk_count": 42
}
```

---

### 3. ChatQuery

**Description**: Represents a user's question submitted to the chatbot. Not persisted in backend; used as API request model only.

**Storage**: None (request DTO only)

**Fields**:
- `query` (string, required): User's question text
- `selected_text` (string, optional): User-selected text for context-limited mode
- `conversation_history` (array of objects, optional): Previous messages for context

**Validation Rules**:
- `query`: Must not be empty; max 1000 tokens (validated using tiktoken)
- `selected_text`: Max 5000 characters (reasonable browser limit)
- `conversation_history`: Max 10 messages (prevent excessive context)
- At least one of `query` or `selected_text` must be provided

**Pydantic Model**:
```python
from pydantic import BaseModel, Field, validator
from typing import Optional, List, Dict

class ChatQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=4000, description="User's question")
    selected_text: Optional[str] = Field(None, max_length=5000, description="Selected text for context")
    conversation_history: Optional[List[Dict[str, str]]] = Field(None, max_items=10, description="Previous messages")

    @validator('query')
    def validate_token_count(cls, v):
        import tiktoken
        enc = tiktoken.get_encoding("cl100k_base")
        token_count = len(enc.encode(v))
        if token_count > 1000:
            raise ValueError(f"Query exceeds 1000 tokens ({token_count} tokens)")
        return v

    @validator('conversation_history')
    def validate_history_format(cls, v):
        if v is None:
            return v
        for msg in v:
            if 'role' not in msg or 'content' not in msg:
                raise ValueError("Each message must have 'role' and 'content'")
            if msg['role'] not in ['user', 'assistant']:
                raise ValueError("Role must be 'user' or 'assistant'")
        return v
```

**Example**:
```json
{
  "query": "What are the advantages of hydraulic actuators over electric motors?",
  "selected_text": null,
  "conversation_history": [
    {"role": "user", "content": "What is an actuator?"},
    {"role": "assistant", "content": "An actuator is a device that converts energy into mechanical motion..."}
  ]
}
```

---

### 4. ChatResponse

**Description**: Represents the chatbot's generated answer. Not persisted in backend; used as API response model only.

**Storage**: None (response DTO only)

**Fields**:
- `response` (string, required): Generated answer text
- `source_chunks` (array of objects, required): Citations for retrieved content
- `mode` (string enum, required): Query mode used ("rag" or "selected_text")
- `timestamp` (string ISO 8601, required): Response generation time

**Source Chunk Format**:
- `chapter` (string): Chapter title
- `section` (string, optional): Section heading
- `snippet` (string): Relevant excerpt from chunk (max 200 chars)

**Pydantic Model**:
```python
from enum import Enum
from datetime import datetime

class QueryMode(str, Enum):
    RAG = "rag"
    SELECTED_TEXT = "selected_text"

class SourceChunk(BaseModel):
    chapter: str
    section: Optional[str]
    snippet: str = Field(..., max_length=200)

class ChatResponse(BaseModel):
    response: str = Field(..., min_length=1, description="Generated answer")
    source_chunks: List[SourceChunk] = Field(default_factory=list, description="Citations")
    mode: QueryMode
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
```

**Example**:
```json
{
  "response": "Hydraulic actuators offer several advantages over electric motors: (1) Higher power-to-weight ratio, making them suitable for heavy-duty applications. (2) Better force control in dynamic environments. (3) Natural compliance that absorbs shocks. However, they require complex fluid management systems.",
  "source_chunks": [
    {
      "chapter": "Chapter 3: Actuators",
      "section": "Hydraulic Systems",
      "snippet": "Hydraulic actuators use pressurized fluid to generate mechanical force. They offer high power-to-weight ratios..."
    },
    {
      "chapter": "Chapter 3: Actuators",
      "section": "Comparison of Actuator Types",
      "snippet": "Electric motors excel in precision positioning, while hydraulic actuators provide superior force output..."
    }
  ],
  "mode": "rag",
  "timestamp": "2025-12-22T10:45:23.123Z"
}
```

---

### 5. ConversationSession

**Description**: Represents a user's chat session within a single browser session. Stored in frontend sessionStorage only (not persisted in backend).

**Storage**: Browser sessionStorage (key: `chatbot_session`)

**Fields**:
- `session_id` (UUID, required): Unique session identifier (generated on first message)
- `messages` (array of objects, required): Full conversation history
- `created_at` (timestamp, required): Session start time

**Message Format**:
- `role` (string enum): "user" or "assistant"
- `content` (string): Message text
- `timestamp` (string ISO 8601): Message time
- `mode` (string enum, optional): Query mode for assistant messages ("rag" or "selected_text")

**TypeScript Interface**:
```typescript
interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode?: 'rag' | 'selected_text';
}

interface ConversationSession {
  session_id: string;
  messages: Message[];
  created_at: string;
}
```

**Storage Management**:
- Save to sessionStorage after each message
- Load on chatbot widget mount
- Clear on browser tab close (sessionStorage behavior)
- Max 50 messages per session (prevent storage overflow)

**Example**:
```json
{
  "session_id": "f2a4c6e8-1234-5678-9abc-def012345678",
  "messages": [
    {
      "role": "user",
      "content": "What is ROS 2?",
      "timestamp": "2025-12-22T10:40:00.000Z"
    },
    {
      "role": "assistant",
      "content": "ROS 2 (Robot Operating System 2) is a flexible framework for writing robot software...",
      "timestamp": "2025-12-22T10:40:02.500Z",
      "mode": "rag"
    }
  ],
  "created_at": "2025-12-22T10:40:00.000Z"
}
```

---

## Validation Rules Summary

| Entity | Field | Validation Rule |
|--------|-------|-----------------|
| ContentChunk | text | Required, non-empty |
| ContentChunk | embedding | Required, exactly 1024 dimensions |
| ContentChunk | chunk_index | Required, non-negative integer |
| DocumentMetadata | file_path | Required, unique, max 512 chars |
| DocumentMetadata | content_hash | Required, exactly 64 hex chars (SHA-256) |
| DocumentMetadata | chunk_count | Required, non-negative integer |
| ChatQuery | query | Required, 1-4000 chars, max 1000 tokens |
| ChatQuery | selected_text | Optional, max 5000 chars |
| ChatQuery | conversation_history | Optional, max 10 messages, valid format |
| ChatResponse | response | Required, non-empty |
| ChatResponse | mode | Required, enum ("rag" or "selected_text") |
| ConversationSession | messages | Required, max 50 messages |

---

## State Transition Diagrams

### Document Indexing State Machine

```
[Unindexed] --(ingestion triggered)--> [Indexing]
    |                                       |
    |                                       v
    |                               [Indexed] <--(re-index)-- [Re-indexing]
    |                                       |                       ^
    |                                       v                       |
    +--------------------------------> [Stale] ---(hash mismatch)---+
```

**State Definitions**:
- **Unindexed**: MDX file exists but not in `document_metadata` table
- **Indexing**: Temporary state during ingestion (not persisted; inferred from process status)
- **Indexed**: Entry in `document_metadata` with matching `content_hash`
- **Stale**: Entry exists but `content_hash` doesn't match current file (detected on next ingestion trigger)
- **Re-indexing**: Stale document being processed (delete old chunks, create new ones)

### Query Processing Flow

```
[User Input] --> [Validate] --> [Determine Mode]
                                     |
                     +---------------+---------------+
                     |                               |
                     v                               v
              [RAG Mode]                     [Selected-Text Mode]
                     |                               |
                     v                               |
            [Embed Query] --> [Qdrant Search]       |
                     |                               |
                     v                               v
            [Retrieve Chunks]              [Use Selected Text]
                     |                               |
                     +---------------+---------------+
                                     |
                                     v
                           [Build Prompt] --> [Generate Response]
                                                      |
                                                      v
                                             [Return ChatResponse]
```

**Decision Logic**:
- **Mode Determination**: If `selected_text` is provided → Selected-Text Mode; else → RAG Mode
- **Context Construction**:
  - RAG Mode: Concatenate top-5 chunk texts with chapter/section headers
  - Selected-Text Mode: Use `selected_text` directly as context
- **Conversation History**: Append last 5 messages to prompt for both modes

---

## Entity Relationships

```
DocumentMetadata (1) ----< (N) ContentChunk
    |                             |
    | (file_path)                 | (chapter_title, source_file_path)
    |                             |
    v                             v
  [MDX File] <----------> [Qdrant Collection]

ChatQuery (API Request)
    |
    | (processed by)
    v
[RAG Pipeline] --> ChatResponse (API Response)
    |
    | (references)
    v
ContentChunk (for citations)

ConversationSession (Frontend Only)
    |
    | (stores)
    v
[ChatQuery, ChatResponse] (as messages)
```

**Key Relationships**:
- `DocumentMetadata` → `ContentChunk`: One document produces many chunks
- `ChatQuery` → `ContentChunk`: Query retrieves multiple relevant chunks (RAG mode)
- `ConversationSession` → `ChatQuery` + `ChatResponse`: Session stores message history

**Data Flow**:
1. **Ingestion**: MDX File → Parse → Chunk → Embed → ContentChunk (Qdrant) + DocumentMetadata (Postgres)
2. **Query (RAG)**: ChatQuery → Embed → Qdrant Search → ContentChunk → Generate → ChatResponse
3. **Query (Selected-Text)**: ChatQuery (with selected_text) → Generate → ChatResponse
4. **Session Management**: ChatQuery + ChatResponse → ConversationSession (sessionStorage)

---

## Implementation Notes

### Change Detection Algorithm
```python
import hashlib

def compute_file_hash(file_path: str) -> str:
    """Compute SHA-256 hash of file content."""
    with open(file_path, 'rb') as f:
        return hashlib.sha256(f.read()).hexdigest()

def is_stale(file_path: str, db_session) -> bool:
    """Check if file has changed since last indexing."""
    metadata = db_session.query(DocumentMetadata).filter_by(file_path=file_path).first()
    if not metadata:
        return False  # Unindexed, not stale
    current_hash = compute_file_hash(file_path)
    return current_hash != metadata.content_hash
```

### Token Counting
```python
import tiktoken

def count_tokens(text: str) -> int:
    """Count tokens using OpenAI's tiktoken (cl100k_base encoding)."""
    enc = tiktoken.get_encoding("cl100k_base")
    return len(enc.encode(text))
```

### Session Storage Helper (Frontend)
```typescript
const SESSION_KEY = 'chatbot_session';
const MAX_MESSAGES = 50;

export function saveSession(session: ConversationSession): void {
  // Trim to last 50 messages if overflow
  if (session.messages.length > MAX_MESSAGES) {
    session.messages = session.messages.slice(-MAX_MESSAGES);
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): ConversationSession | null {
  const data = sessionStorage.getItem(SESSION_KEY);
  return data ? JSON.parse(data) : null;
}
```

---

## Next Steps

This data model provides the foundation for:
1. **Backend Services**: Implement models as Pydantic (API) and SQLAlchemy (database) classes
2. **API Contracts**: Define OpenAPI schemas based on ChatQuery/ChatResponse models
3. **Frontend Types**: Generate TypeScript interfaces from Pydantic models for type safety
4. **Testing**: Create fixtures using example entities for unit/integration tests

**Ready for**: API contract generation (`contracts/openapi.yaml`) and quickstart guide.
