# Deploying RAG Chatbot Backend to Hugging Face Spaces

**Complete Step-by-Step Guide**

This guide will walk you through deploying your RAG chatbot backend (FastAPI) to Hugging Face Spaces, making it publicly accessible for your Docusaurus frontend.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Why Hugging Face Spaces?](#why-hugging-face-spaces)
3. [Prepare Backend for Deployment](#prepare-backend-for-deployment)
4. [Create Hugging Face Space](#create-hugging-face-space)
5. [Configure Deployment Files](#configure-deployment-files)
6. [Deploy to Hugging Face](#deploy-to-hugging-face)
7. [Configure Environment Variables](#configure-environment-variables)
8. [Test Deployment](#test-deployment)
9. [Update Frontend](#update-frontend)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Hugging Face Account** - Sign up at [huggingface.co](https://huggingface.co/join)
- ✅ **Git Installed** - For pushing code to Hugging Face
- ✅ **Working RAG Backend** - Your FastAPI backend running locally
- ✅ **API Keys**:
  - Cohere API key ([cohere.com](https://cohere.com/))
  - Qdrant API key ([qdrant.tech](https://qdrant.tech/))
  - Neon Database URL ([neon.tech](https://neon.tech/))

---

## Why Hugging Face Spaces?

**Advantages**:
- ✅ **Free Tier**: 2 vCPU, 16GB RAM (sufficient for RAG backend)
- ✅ **Docker Support**: Full control over environment
- ✅ **GPU Access**: Upgrade option for faster embeddings
- ✅ **Git-Based**: Easy deployment via git push
- ✅ **Auto SSL**: HTTPS enabled by default
- ✅ **Public URL**: Get a permanent URL (e.g., `username-spacename.hf.space`)
- ✅ **Environment Variables**: Secure secret management

**Limitations**:
- ❌ **Slower Cold Starts**: ~30-60 seconds after inactivity
- ❌ **Resource Limits**: Free tier has CPU/RAM limits
- ❌ **No Persistent Storage**: Use external databases (Qdrant Cloud, Neon)

---

## Prepare Backend for Deployment

### Step 1: Create Deployment Directory

```bash
cd backend
mkdir deployment
```

### Step 2: Create `Dockerfile`

Create `backend/Dockerfile`:

```dockerfile
# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port 7860 (required by Hugging Face Spaces)
EXPOSE 7860

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=7860

# Run the application
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### Step 3: Create `.dockerignore`

Create `backend/.dockerignore`:

```
# Python
__pycache__
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Git
.git/
.gitignore

# Testing
.pytest_cache/
.coverage
htmlcov/

# Documentation
docs/
*.md
!README.md

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Other
.DS_Store
Thumbs.db
```

### Step 4: Create `README.md` for Hugging Face

Create `backend/README.md`:

```markdown
---
title: Physical AI RAG Chatbot
emoji: 🤖
colorFrom: blue
colorTo: cyan
sdk: docker
pinned: false
license: mit
---

# Physical AI RAG Chatbot Backend

RAG (Retrieval-Augmented Generation) chatbot backend for the Physical AI & Humanoid Robotics book.

## Features

- FastAPI backend with vector search
- Cohere embeddings (embed-english-v3.0)
- Cohere LLM generation (Command)
- Qdrant vector database
- Neon PostgreSQL metadata storage

## API Endpoints

- `GET /` - Health check
- `POST /api/chatbot/query` - Chat query endpoint
- `GET /api/rag/stats` - RAG statistics
- `GET /docs` - Interactive API documentation

## Usage

```bash
# Example query
curl -X POST https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```

## Environment Variables

Configure these in your Space settings:

- `COHERE_API_KEY` - Cohere API key
- `QDRANT_URL` - Qdrant cluster URL
- `QDRANT_API_KEY` - Qdrant API key
- `NEON_DATABASE_URL` - Neon PostgreSQL connection string
- `CORS_ORIGINS` - Allowed CORS origins (comma-separated)

## Tech Stack

- **Framework**: FastAPI
- **Embeddings**: Cohere embed-english-v3.0
- **LLM**: Cohere Command
- **Vector DB**: Qdrant Cloud
- **Metadata DB**: Neon PostgreSQL
```

### Step 5: Update `requirements.txt`

Ensure `backend/requirements.txt` includes all dependencies:

```txt
fastapi==0.115.5
uvicorn[standard]==0.32.1
python-dotenv==1.0.1
cohere==5.11.4
qdrant-client==1.12.1
psycopg2-binary==2.9.10
sqlalchemy==2.0.36
pydantic==2.10.3
pydantic-settings==2.6.1
tiktoken==0.8.0
```

### Step 6: Verify Backend Port Configuration

Edit `backend/src/main.py` to support dynamic port:

```python
import os

# At the end of the file, add:
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("src.main:app", host="0.0.0.0", port=port, reload=False)
```

---

## Create Hugging Face Space

### Step 1: Create New Space

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click **"Create new Space"**
3. Fill in details:
   - **Space name**: `rag-chatbot` (or your preferred name)
   - **License**: MIT
   - **Space SDK**: **Docker**
   - **Space hardware**: CPU basic (free tier)
   - **Visibility**: Public or Private

4. Click **"Create Space"**

### Step 2: Clone the Space Repository

```bash
# Get your Space's git URL from the Space page
git clone https://huggingface.co/spaces/YOUR-USERNAME/rag-chatbot
cd rag-chatbot
```

---

## Configure Deployment Files

### Step 1: Copy Backend Files

```bash
# Copy all backend files to the Space repo
cp -r ../backend/* .

# Verify structure
ls -la
# Should see: src/, scripts/, Dockerfile, requirements.txt, README.md, etc.
```

### Step 2: Create `.gitignore`

Create `.gitignore` in the Space repo:

```
# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv/

# Environment variables (NEVER commit secrets!)
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# Testing
.pytest_cache/
.coverage
htmlcov/

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# OS
.DS_Store
Thumbs.db
```

### Step 3: Update CORS Configuration

Edit `backend/src/config.py` to allow your frontend domain:

```python
def get_cors_origins(self) -> list:
    """Get CORS origins from environment variable."""
    origins_str = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,https://YOUR-USERNAME.github.io"  # Add your frontend URL
    )
    return [origin.strip() for origin in origins_str.split(",")]
```

---

## Deploy to Hugging Face

### Step 1: Add Files to Git

```bash
git add .
git commit -m "Initial deployment of RAG chatbot backend"
```

### Step 2: Push to Hugging Face

```bash
git push
```

**Note**: On first push, you'll be prompted for credentials:
- **Username**: Your Hugging Face username
- **Password**: Use a Hugging Face **Access Token** (not your account password)
  - Create token at: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
  - Select **"Write"** permission

### Step 3: Monitor Build

1. Go to your Space page: `https://huggingface.co/spaces/YOUR-USERNAME/rag-chatbot`
2. Watch the build logs in the **"Logs"** tab
3. Build typically takes **3-5 minutes**

**Expected Log Output**:
```
Building Docker image...
Successfully built image
Starting container...
Running on http://0.0.0.0:7860
Application startup complete
```

---

## Configure Environment Variables

### Step 1: Access Space Settings

1. Go to your Space: `https://huggingface.co/spaces/YOUR-USERNAME/rag-chatbot`
2. Click **"Settings"** tab
3. Scroll to **"Variables and secrets"** section

### Step 2: Add Secrets

Click **"New secret"** and add each of the following:

| Name | Value | Example |
|------|-------|---------|
| `COHERE_API_KEY` | Your Cohere API key | `abc123...` |
| `QDRANT_URL` | Your Qdrant cluster URL | `https://xyz.qdrant.io` |
| `QDRANT_API_KEY` | Your Qdrant API key | `def456...` |
| `NEON_DATABASE_URL` | Your Neon Postgres URL | `postgresql://user:pass@host/db` |
| `CORS_ORIGINS` | Allowed frontend origins | `https://yourusername.github.io` |

**Important**:
- Use **"Secret"** for sensitive values (API keys, database URLs)
- Use **"Variable"** for non-sensitive values (CORS origins)
- Secrets are encrypted and hidden from logs

### Step 3: Restart Space

After adding secrets:
1. Click **"Factory reboot"** button
2. Wait for Space to restart (~30 seconds)

---

## Test Deployment

### Step 1: Check Health Endpoint

```bash
curl https://YOUR-USERNAME-rag-chatbot.hf.space/
```

**Expected Response**:
```json
{
  "status": "ok",
  "service": "Physical AI Textbook API",
  "version": "1.0.0",
  "timestamp": "2025-12-23T20:00:00"
}
```

### Step 2: Test Chat Endpoint

```bash
curl -X POST https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "query_id": "...",
    "response_text": "ROS 2 (Robot Operating System 2) is...",
    "retrieved_chunks": [
      {
        "chapter_title": "Module 1: The Robotic Nervous System",
        "section_heading": "ROS 2 Architecture",
        "snippet": "...",
        "score": 0.85
      }
    ]
  }
}
```

### Step 3: Check API Documentation

Open in browser:
```
https://YOUR-USERNAME-rag-chatbot.hf.space/docs
```

You should see the interactive Swagger UI with all endpoints.

---

## Update Frontend

### Step 1: Update Chat Widget API Endpoint

Edit `physical-ai-book/src/theme/Root.tsx`:

```typescript
export default function Root({ children }) {
  // Update with your Hugging Face Space URL
  const apiEndpoint = 'https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query';

  return (
    <>
      {children}
      <ChatWidget apiEndpoint={apiEndpoint} />
    </>
  );
}
```

### Step 2: Test Frontend Locally

```bash
cd physical-ai-book
npm start
```

Open `http://localhost:3000/physical-ai-humanoid-robotics-book/` and test the chat widget.

### Step 3: Deploy Frontend to GitHub Pages

```bash
npm run build
npm run deploy
```

---

## Troubleshooting

### Issue 1: Space Build Fails

**Symptoms**: Build logs show errors during `docker build`

**Solutions**:
1. Check `requirements.txt` for invalid packages
2. Verify `Dockerfile` syntax
3. Check build logs for specific error messages
4. Ensure all files are committed: `git status`

### Issue 2: Space Runs but Shows 404

**Symptoms**: Space is running but all endpoints return 404

**Solutions**:
1. Verify port is set to **7860** in Dockerfile
2. Check `CMD` in Dockerfile: `--port 7860`
3. Ensure FastAPI app is named `app` in `src/main.py`
4. Check logs for startup errors

### Issue 3: CORS Errors in Frontend

**Symptoms**: Chat widget shows "CORS policy" error in browser console

**Solutions**:
1. Add your frontend URL to `CORS_ORIGINS` secret
2. Include both HTTP and HTTPS versions if needed
3. Restart Space after updating CORS_ORIGINS
4. Example: `https://yourusername.github.io,http://localhost:3000`

### Issue 4: No Context Retrieved

**Symptoms**: Chat returns "Cannot answer: No context chunks retrieved"

**Solutions**:
1. Verify Qdrant URL and API key in secrets
2. Check Qdrant collection exists and has data:
   ```bash
   curl https://YOUR-USERNAME-rag-chatbot.hf.space/api/rag/stats
   ```
3. Re-index content if needed (run locally, then redeploy)

### Issue 5: Slow Cold Starts

**Symptoms**: First request after inactivity takes 30-60 seconds

**Solutions**:
1. This is normal for Hugging Face Spaces free tier
2. Consider upgrading to **persistent** Space (paid)
3. Implement health check pings every 5 minutes
4. Add loading indicator in frontend for first query

### Issue 6: Environment Variables Not Working

**Symptoms**: App can't find API keys or database URLs

**Solutions**:
1. Verify secrets are added in Space settings
2. Use **exact names** (case-sensitive): `COHERE_API_KEY`
3. Click "Factory reboot" after adding secrets
4. Check logs for "WARNING: Configuration warnings"

### Issue 7: Database Connection Errors

**Symptoms**: Logs show "Connection refused" or "SSL error"

**Solutions**:
1. Verify Neon database URL includes `?sslmode=require`
2. Check Qdrant URL uses HTTPS: `https://xyz.qdrant.io`
3. Ensure Neon database is not paused (auto-pauses after inactivity)
4. Test connections locally first

---

## Performance Optimization

### 1. Enable Persistent Space (Paid)

- **Cost**: ~$5/month
- **Benefits**: No cold starts, always-on
- **How**: Space Settings → Hardware → Upgrade to Persistent

### 2. Use GPU for Embeddings (Optional)

If using local embeddings instead of Cohere API:

- **Cost**: ~$0.60/hour (only while running)
- **Benefits**: 10x faster embeddings
- **How**: Space Settings → Hardware → GPU

### 3. Optimize Docker Image

Add to `Dockerfile`:

```dockerfile
# Multi-stage build to reduce image size
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
EXPOSE 7860
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860", "--workers", "2"]
```

### 4. Add Health Check Endpoint

Keep Space warm with external ping service (e.g., UptimeRobot):

- Ping URL: `https://YOUR-USERNAME-rag-chatbot.hf.space/api/health`
- Interval: Every 5 minutes

---

## Monitoring and Maintenance

### Check Space Status

```bash
# Health check
curl https://YOUR-USERNAME-rag-chatbot.hf.space/api/health

# RAG stats
curl https://YOUR-USERNAME-rag-chatbot.hf.space/api/rag/stats
```

### View Logs

1. Go to Space page
2. Click **"Logs"** tab
3. Monitor real-time application logs

### Update Deployment

```bash
# Make changes to code
git add .
git commit -m "Update: description"
git push

# Space will auto-rebuild and redeploy
```

### Rollback to Previous Version

```bash
git log  # Find commit hash
git revert <commit-hash>
git push
```

---

## Cost Breakdown

### Free Tier (Recommended for Development)

| Resource | Allocation | Cost |
|----------|-----------|------|
| CPU | 2 vCPU | Free |
| RAM | 16 GB | Free |
| Storage | 50 GB | Free |
| Bandwidth | Unlimited | Free |
| **Total** | | **$0/month** |

**Limitations**:
- Cold starts after 15 minutes of inactivity
- Shared CPU resources
- May pause during high platform load

### Paid Tier (For Production)

| Resource | Allocation | Cost |
|----------|-----------|------|
| CPU Persistent | 2 vCPU | ~$5/month |
| GPU Basic | 1x T4 | ~$0.60/hour |
| GPU Premium | 1x A10G | ~$1.50/hour |

---

## Alternative Deployment Options

If Hugging Face Spaces doesn't meet your needs:

### 1. **Railway** (Recommended Alternative)
- **Pros**: Persistent by default, $5/month free tier, auto-scaling
- **Cons**: Requires credit card for free tier
- **Setup**: Connect GitHub repo, auto-deploys

### 2. **Render**
- **Pros**: Free tier, persistent, auto-deploys from GitHub
- **Cons**: Cold starts on free tier, slower build times
- **Setup**: Web service from Docker

### 3. **Vercel** (Functions)
- **Pros**: Edge network, fast, free tier generous
- **Cons**: 10-second timeout, requires serverless adaptation
- **Setup**: Convert to serverless functions

### 4. **Google Cloud Run**
- **Pros**: Pay-per-use, auto-scales to zero, fast
- **Cons**: Requires GCP account, more complex setup
- **Setup**: Deploy Docker container

---

## Security Best Practices

1. **Never commit secrets**: Use Hugging Face secrets, not `.env` files
2. **Use HTTPS only**: Hugging Face provides SSL automatically
3. **Limit CORS origins**: Only allow your frontend domains
4. **Rotate API keys**: Regularly update Cohere, Qdrant, Neon keys
5. **Monitor logs**: Check for suspicious activity
6. **Rate limiting**: Add to prevent abuse (see below)

### Add Rate Limiting (Optional)

Install:
```bash
pip install slowapi
```

Update `backend/src/main.py`:
```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/chatbot/query")
@limiter.limit("10/minute")  # 10 requests per minute per IP
async def chat_query(request: Request, query: ChatQuery):
    # ... existing code
```

---

## Complete Deployment Checklist

### Pre-Deployment
- [ ] Hugging Face account created
- [ ] All API keys obtained (Cohere, Qdrant, Neon)
- [ ] Backend tested locally
- [ ] Content indexed in Qdrant
- [ ] `Dockerfile` created
- [ ] `.dockerignore` created
- [ ] `README.md` created for Space

### Deployment
- [ ] Hugging Face Space created (Docker SDK)
- [ ] Backend files copied to Space repo
- [ ] `.gitignore` configured
- [ ] CORS origins updated
- [ ] Code committed and pushed
- [ ] Build completed successfully
- [ ] Environment secrets added
- [ ] Space restarted

### Testing
- [ ] Health endpoint responds
- [ ] Chat endpoint works
- [ ] API docs accessible
- [ ] RAG stats show indexed chunks
- [ ] CORS allows frontend access
- [ ] Frontend connects successfully

### Post-Deployment
- [ ] Frontend updated with Space URL
- [ ] Frontend deployed to GitHub Pages
- [ ] End-to-end chat tested
- [ ] Monitoring set up (optional)
- [ ] Documentation updated

---

## Next Steps After Deployment

1. **Monitor Performance**
   - Track response times
   - Monitor error rates
   - Check resource usage

2. **Optimize Costs**
   - Upgrade to persistent if needed
   - Consider GPU for faster responses
   - Implement caching

3. **Add Features**
   - Rate limiting
   - Analytics tracking
   - User feedback collection
   - Conversation history

4. **Scale**
   - Add load balancing
   - Implement CDN
   - Database read replicas

---

## Support Resources

- **Hugging Face Docs**: [huggingface.co/docs/hub/spaces](https://huggingface.co/docs/hub/spaces)
- **Community Forum**: [discuss.huggingface.co](https://discuss.huggingface.co/)
- **Discord**: [hf.co/join/discord](https://hf.co/join/discord)
- **GitHub Issues**: For this project

---

## Conclusion

Your RAG chatbot backend is now deployed to Hugging Face Spaces! Users can interact with your Physical AI book through the chat widget, powered by a scalable, cloud-hosted backend.

**Your Deployment URLs**:
- Backend: `https://YOUR-USERNAME-rag-chatbot.hf.space`
- API Docs: `https://YOUR-USERNAME-rag-chatbot.hf.space/docs`
- Frontend: `https://YOUR-USERNAME.github.io/physical-ai-humanoid-robotics-book/`

**Final Deployment**: 2025-12-23
