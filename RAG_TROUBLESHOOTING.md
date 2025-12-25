# RAG Chatbot Troubleshooting Checklist

Based on test log analysis (test_logs.txt), this checklist will help you resolve the RAG query functionality issue.

## Current Status

✅ **PASSING (9/10)**:
- Backend API Health
- API Documentation
- Frontend Accessibility
- Frontend Build
- Frontend-Backend Connectivity
- Backend Dependencies
- Frontend Dependencies
- Git Repository
- Deployment Configuration

❌ **FAILING (1/10)**:
- RAG Query Functionality

---

## Root Cause Analysis

The RAG endpoint is **not a code issue** - it's a **configuration issue**. The backend code is correct, but it cannot function without:

1. **API Keys** for external services (Cohere, OpenRouter)
2. **Vector Database** connection (Qdrant)
3. **Indexed Content** in the vector database

---

## Step-by-Step Resolution

### ☑️ Step 1: Verify Hugging Face Environment Variables

**Action**: Check all required secrets are configured

1. Go to: https://huggingface.co/spaces/salman-giaic-hackathon/settings
2. Navigate to **Variables and secrets**
3. Verify the following exist:

| Variable Name | Status | How to Check |
|---------------|--------|--------------|
| `COHERE_API_KEY` | ⬜ | Should be 40+ characters |
| `OPENROUTER_API_KEY` | ⬜ | Should start with `sk-or-` |
| `QDRANT_URL` | ⬜ | Should be `https://...qdrant.io:6333` |
| `QDRANT_API_KEY` | ⬜ | Should be a long alphanumeric string |
| `CORS_ORIGINS` | ⬜ | Should be `https://salmansiddiqui-99.github.io` |

**If any are missing**: See HUGGINGFACE_SETUP_GUIDE.md for how to get them

---

### ☑️ Step 2: Check Hugging Face Build Logs

**Action**: Verify the Space started without errors

1. Go to: https://huggingface.co/spaces/salman-giaic-hackathon
2. Click **"Logs"** tab
3. Look for startup message

**Expected (Good)**:
```
SUCCESS: Physical AI Book RAG Chatbot v1.0.0 started successfully
```

**Warning (Bad)**:
```
WARNING: Configuration warnings:
  - Missing COHERE_API_KEY
  - Missing QDRANT_URL
```

**Action if warnings found**:
- Add the missing environment variables
- Click "Factory reboot"
- Wait 3-5 minutes
- Check logs again

---

### ☑️ Step 3: Verify API Keys Are Valid

**Test Cohere API Key**:
```bash
curl https://api.cohere.ai/v1/models \
  -H "Authorization: Bearer YOUR_COHERE_API_KEY"
```

**Expected**: List of models (should include `embed-english-v3.0`)

**Test OpenRouter API Key**:
```bash
curl https://openrouter.ai/api/v1/models \
  -H "Authorization: Bearer YOUR_OPENROUTER_API_KEY"
```

**Expected**: List of models

**If either fails**:
- Check the API key is copied correctly (no extra spaces)
- Verify the API key is active (not expired)
- For OpenRouter: Confirm you have credits added

---

### ☑️ Step 4: Verify Qdrant Connection

**Test Qdrant Connection**:
```bash
curl https://YOUR-CLUSTER-ID.aws.cloud.qdrant.io:6333/collections \
  -H "api-key: YOUR_QDRANT_API_KEY"
```

**Expected**:
```json
{
  "result": {
    "collections": [...]
  }
}
```

**If fails**:
- Verify Qdrant cluster is running in dashboard
- Check URL includes `:6333` port
- Confirm API key is correct

---

### ☑️ Step 5: Check if Book Content is Indexed

**Test Collection Exists**:
```bash
curl https://YOUR-CLUSTER-ID.aws.cloud.qdrant.io:6333/collections/physical_ai_book \
  -H "api-key: YOUR_QDRANT_API_KEY"
```

**Expected**:
```json
{
  "result": {
    "status": "green",
    "vectors_count": 87,
    ...
  }
}
```

**If collection doesn't exist or vectors_count is 0**:
→ You need to run the ingestion script (Step 6)

---

### ☑️ Step 6: Ingest Book Content

**Option A: Via Hugging Face API (Recommended)**

1. Go to: https://salman-giaic-hackathon.hf.space/docs
2. Find **POST /ingest** endpoint
3. Click "Try it out"
4. Use this request body:
   ```json
   {
     "content_path": "../physical-ai-book/docs"
   }
   ```
5. Click "Execute"
6. Wait for completion (2-3 minutes)

**Expected Response**:
```json
{
  "success": true,
  "message": "Ingested 87 chunks from 23 files",
  "chunks_created": 87,
  "collection": "physical_ai_book"
}
```

**Option B: Run Locally**

```bash
cd backend

# Create .env with your keys
cat > .env << EOF
COHERE_API_KEY=your-key
QDRANT_URL=your-url
QDRANT_API_KEY=your-key
EOF

# Run ingestion
python scripts/ingest.py
```

---

### ☑️ Step 7: Test RAG Endpoint

**Test via Swagger UI**:

1. Go to: https://salman-giaic-hackathon.hf.space/docs
2. Find **POST /chat** endpoint
3. Click "Try it out"
4. Use this request:
   ```json
   {
     "query": "What is ROS 2?",
     "conversation_history": []
   }
   ```
5. Click "Execute"

**Expected Success (HTTP 200)**:
```json
{
  "response": "ROS 2 (Robot Operating System 2) is a middleware framework...",
  "source_chunks": [
    {
      "chapter": "Module 1: ROS 2",
      "section": "Introduction",
      "snippet": "ROS 2 is designed for..."
    }
  ],
  "mode": "rag",
  "timestamp": "2025-12-25T16:00:00Z"
}
```

**If HTTP 500 Error**:
```json
{
  "detail": "Chat processing failed: ..."
}
```
→ Check the error message:
- "API key invalid" → Fix API key
- "Collection not found" → Run ingestion script
- "Rate limit exceeded" → Add OpenRouter credits

---

### ☑️ Step 8: Test on Live Frontend

1. Go to: https://salmansiddiqui-99.github.io/rag-chatbot/
2. Click chat button (💬)
3. Type: "What is ROS 2?"
4. Press Enter

**Expected**:
- Loading indicator (Thinking...)
- Response appears with answer
- Sources section shows citations

**If not working**:
- Open DevTools (F12)
- Go to Console tab
- Look for errors
- Go to Network tab
- Check the `/chat` request
- Look at response status and body

---

## Common Error Messages

### Error: "Missing API key: COHERE_API_KEY"
**Solution**: Add `COHERE_API_KEY` to Hugging Face secrets, restart Space

### Error: "Collection 'physical_ai_book' not found"
**Solution**: Run the ingestion script (Step 6)

### Error: "Rate limit exceeded"
**Solution**: Add credits to OpenRouter account ($5 minimum)

### Error: "Failed to connect to Qdrant"
**Solution**:
- Verify Qdrant cluster is running
- Check `QDRANT_URL` includes `:6333` port
- Confirm `QDRANT_API_KEY` is correct

### Error: "CORS policy blocked"
**Solution**:
- Verify `CORS_ORIGINS=https://salmansiddiqui-99.github.io`
- No trailing slash
- Restart Space after adding

---

## Verification Checklist

Once you complete all steps above, verify:

- [ ] All 5 environment variables are set in Hugging Face
- [ ] Hugging Face logs show "SUCCESS" (no warnings)
- [ ] All API keys are valid (tested with curl)
- [ ] Qdrant collection exists with ~87 vectors
- [ ] POST /chat endpoint returns HTTP 200 in Swagger UI
- [ ] Chat widget on live site responds to queries
- [ ] Sources/citations appear in responses

---

## Still Not Working?

If you've completed all steps and it's still not working:

1. **Check Hugging Face logs** for specific error messages
2. **Verify each service independently**:
   - Test Cohere API directly
   - Test OpenRouter API directly
   - Test Qdrant API directly
3. **Review costs/limits**:
   - Cohere free tier: 100 calls/month
   - OpenRouter: Requires credits ($5 minimum)
   - Qdrant free tier: 1GB storage
4. **Contact support**:
   - Hugging Face: https://discuss.huggingface.co/
   - Qdrant: https://qdrant.tech/support/
   - OpenRouter: https://openrouter.ai/support

---

## Success Criteria

✅ **RAG is working when**:
1. Hugging Face logs show "SUCCESS"
2. POST /chat returns HTTP 200 with `source_chunks`
3. Live site chatbot responds to queries
4. Sources/citations are displayed

🎉 **Congratulations!** Your RAG chatbot system is fully operational.

---

**Last Updated**: 2025-12-25
**Related Docs**: HUGGINGFACE_SETUP_GUIDE.md, test_logs.txt
