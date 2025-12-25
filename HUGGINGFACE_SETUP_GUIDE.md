# Hugging Face Spaces - Complete Setup Guide

This guide will help you configure the required environment variables and resolve the RAG query functionality issue identified in the test logs.

## Issue Summary

**Status**: Backend is running ✓, but RAG queries are failing ❌

**Root Cause**: Missing environment variables and/or unpopulated vector database

**Impact**: The chatbot cannot answer questions because it lacks:
- API keys for embedding service (Cohere)
- API keys for AI generation (OpenRouter)
- Connection to vector database (Qdrant)
- Indexed book content in the database

---

## Step-by-Step Setup

### 1. Access Your Hugging Face Space

1. Go to: https://huggingface.co/spaces/salman-giaic-hackathon
2. Click **Settings** (gear icon)
3. Navigate to **Variables and secrets** section

---

### 2. Required Environment Variables

You need to add the following secrets. Click **"New secret"** for each:

#### A. COHERE_API_KEY (Required for Embeddings)

**Purpose**: Converts text into vector embeddings for semantic search

**How to Get**:
1. Go to: https://cohere.com/
2. Sign up for free account
3. Navigate to Dashboard → API Keys
4. Copy your API key

**Add to Hugging Face**:
- Name: `COHERE_API_KEY`
- Value: `your-cohere-api-key-here`

---

#### B. OPENROUTER_API_KEY (Required for AI Generation)

**Purpose**: Generates AI responses using Mistral Devstral model

**How to Get**:
1. Go to: https://openrouter.ai/
2. Sign up for account
3. Navigate to Keys section
4. Create a new API key
5. **Add credits** (minimum $5 recommended)

**Add to Hugging Face**:
- Name: `OPENROUTER_API_KEY`
- Value: `your-openrouter-api-key-here`

---

#### C. QDRANT_URL (Required for Vector Database)

**Purpose**: URL of your Qdrant vector database cluster

**How to Get**:
1. Go to: https://qdrant.tech/
2. Sign up for free tier (1GB free)
3. Create a new cluster
4. Copy the cluster URL (format: `https://xxxxx-xxxx-xxxx.aws.cloud.qdrant.io:6333`)

**Add to Hugging Face**:
- Name: `QDRANT_URL`
- Value: `https://your-cluster-id.aws.cloud.qdrant.io:6333`

---

#### D. QDRANT_API_KEY (Required for Vector Database)

**Purpose**: Authentication key for Qdrant cluster

**How to Get**:
1. In Qdrant Cloud dashboard
2. Go to your cluster settings
3. Copy the API key

**Add to Hugging Face**:
- Name: `QDRANT_API_KEY`
- Value: `your-qdrant-api-key-here`

---

#### E. CORS_ORIGINS (Required for Frontend Access)

**Purpose**: Allows your GitHub Pages frontend to call the backend API

**Add to Hugging Face**:
- Name: `CORS_ORIGINS`
- Value: `https://salmansiddiqui-99.github.io`

**Note**: This is your GitHub Pages domain (without /rag-chatbot/ path)

---

#### F. NEON_DATABASE_URL (Optional - for conversation history)

**Purpose**: PostgreSQL database for storing conversation history

**If you want conversation persistence**:
1. Go to: https://neon.tech/
2. Create free tier account
3. Create a database
4. Copy the connection string

**Add to Hugging Face**:
- Name: `NEON_DATABASE_URL`
- Value: `postgresql://user:password@host/dbname`

**If you don't need persistence**: Skip this variable (the app will work without it)

---

### 3. Ingest Book Content into Qdrant

After setting up environment variables, you need to populate the vector database with book content.

#### Option A: Run Ingestion Script Locally

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Create .env file with your credentials
cat > .env << EOF
COHERE_API_KEY=your-cohere-api-key
QDRANT_URL=https://your-cluster-id.aws.cloud.qdrant.io:6333
QDRANT_API_KEY=your-qdrant-api-key
EOF

# Run ingestion script
python scripts/ingest.py
```

**Expected Output**:
```
Processing module-1-ros2...
✓ Indexed 15 chunks from module-1-ros2
Processing module-2-digital-twin...
✓ Indexed 12 chunks from module-2-digital-twin
...
✓ Successfully ingested 87 chunks total
```

#### Option B: Run Ingestion via Hugging Face API

After configuring environment variables:

1. Go to: https://salman-giaic-hackathon.hf.space/docs
2. Find the **POST /ingest** endpoint
3. Click "Try it out"
4. Enter request body:
   ```json
   {
     "content_path": "../physical-ai-book/docs"
   }
   ```
5. Click "Execute"
6. Wait for completion (may take 2-3 minutes)

**Expected Response**:
```json
{
  "success": true,
  "message": "Ingested 87 chunks",
  "collection": "physical_ai_book"
}
```

---

### 4. Restart Your Hugging Face Space

After adding all environment variables:

1. Go to Space settings
2. Click **"Factory reboot"**
3. Wait 3-5 minutes for rebuild
4. Check build logs for any errors

**Look for this in logs**:
```
SUCCESS: Physical AI Book RAG Chatbot v1.0.0 started successfully
```

**If you see warnings**:
```
WARNING: Configuration warnings:
  - Missing COHERE_API_KEY
  - Missing QDRANT_URL
```
→ Go back and add the missing variables

---

### 5. Verify RAG Functionality

#### Test 1: Health Check
```bash
curl https://salman-giaic-hackathon.hf.space/
```

**Expected**:
```json
{
  "name": "Physical AI Book RAG Chatbot",
  "version": "1.0.0",
  "status": "running",
  "docs": "/docs"
}
```

#### Test 2: Chat Query
```bash
curl -X POST https://salman-giaic-hackathon.hf.space/chat \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is ROS 2?",
    "conversation_history": []
  }'
```

**Expected Success Response**:
```json
{
  "response": "ROS 2 (Robot Operating System 2) is...",
  "source_chunks": [
    {
      "chapter": "Module 1: ROS 2",
      "section": "Introduction",
      "snippet": "ROS 2 is a middleware framework..."
    }
  ],
  "mode": "rag",
  "timestamp": "2025-12-25T16:00:00Z"
}
```

**If you get HTTP 500 error**:
- Check Hugging Face logs for specific error message
- Verify all API keys are correct
- Confirm Qdrant database has been populated

---

### 6. Test on Live Site

1. Go to: https://salmansiddiqui-99.github.io/rag-chatbot/
2. Click the chat button (💬)
3. Type: "What is ROS 2?"
4. Press Enter

**Expected Behavior**:
- Loading indicator appears
- Response appears with citations
- Sources are expandable

**If not working**:
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests
- Verify the request goes to: `https://salman-giaic-hackathon.hf.space/chat`

---

## Troubleshooting

### Issue: "Rate limit exceeded"

**Solution**:
- Add credits to OpenRouter account
- Or switch to a different model in `backend/src/config.py`

### Issue: "No chunks retrieved"

**Solution**:
- Run the ingestion script again
- Verify Qdrant collection exists:
  ```python
  from qdrant_client import QdrantClient
  client = QdrantClient(url="your-url", api_key="your-key")
  collections = client.get_collections()
  print(collections)  # Should include "physical_ai_book"
  ```

### Issue: "CORS error" (still happening)

**Solution**:
- Verify `CORS_ORIGINS` environment variable is set
- Make sure it's `https://salmansiddiqui-99.github.io` (no trailing slash)
- Restart the Space after adding

### Issue: "Connection refused"

**Solution**:
- Check Qdrant cluster is running in Qdrant Cloud dashboard
- Verify `QDRANT_URL` includes `:6333` port
- Confirm `QDRANT_API_KEY` is correct

---

## Cost Breakdown

### Free Tier Usage:
- **Hugging Face Spaces**: Free (CPU basic)
- **Qdrant**: Free tier (1GB storage, ~10K vectors)
- **Cohere**: Free tier (100 API calls/month)
- **Neon**: Free tier (0.5GB storage)

### Paid Requirements:
- **OpenRouter**: Requires credits ($5 minimum)
  - Mistral Devstral: ~$0.05 per 1000 tokens
  - Estimated cost: $0.10-0.50 per day with moderate usage

**Total Initial Cost**: ~$5 (OpenRouter credits only)

---

## Environment Variables Summary

| Variable | Required | Purpose | Where to Get |
|----------|----------|---------|--------------|
| `COHERE_API_KEY` | ✅ Yes | Embeddings | https://cohere.com/ |
| `OPENROUTER_API_KEY` | ✅ Yes | AI Generation | https://openrouter.ai/ |
| `QDRANT_URL` | ✅ Yes | Vector DB URL | https://qdrant.tech/ |
| `QDRANT_API_KEY` | ✅ Yes | Vector DB Auth | https://qdrant.tech/ |
| `CORS_ORIGINS` | ✅ Yes | Frontend Access | Your GitHub Pages URL |
| `NEON_DATABASE_URL` | ❌ Optional | Conversation History | https://neon.tech/ |

---

## Next Steps After Setup

1. **Add environment variables** to Hugging Face Spaces
2. **Restart the Space** (Factory reboot)
3. **Run ingestion script** to populate Qdrant
4. **Test using Swagger UI** (/docs endpoint)
5. **Test on live site** (GitHub Pages)
6. **Monitor usage** and add credits as needed

---

## Support

If you encounter issues:
1. Check Hugging Face build logs
2. Review Qdrant dashboard for connection errors
3. Verify API keys are valid and have available quota
4. Test each service independently using curl/Postman

---

**Last Updated**: 2025-12-25
**Guide Version**: 1.0
