# Hugging Face Deployment - Quick Checklist

**Before you start**: Read [HUGGINGFACE_DEPLOYMENT_GUIDE.md](../HUGGINGFACE_DEPLOYMENT_GUIDE.md) for complete instructions.

## ✅ Pre-Deployment Checklist

### 1. Prerequisites
- [ ] Hugging Face account created ([huggingface.co/join](https://huggingface.co/join))
- [ ] Cohere API key ([cohere.com](https://cohere.com/))
- [ ] Qdrant Cloud setup ([qdrant.tech](https://qdrant.tech/))
- [ ] Neon database created ([neon.tech](https://neon.tech/))
- [ ] Content indexed locally (50 chunks from Physical AI book)

### 2. Required Files
- [ ] `Dockerfile` exists in `backend/`
- [ ] `.dockerignore` exists in `backend/`
- [ ] `README.md` exists in `backend/`
- [ ] `requirements.txt` up to date
- [ ] All backend code committed

### 3. Configuration
- [ ] CORS origins include your frontend URL
- [ ] Port set to 7860 in Dockerfile
- [ ] No hardcoded secrets in code

## 🚀 Deployment Steps

### 1. Create Hugging Face Space
```bash
# Go to: https://huggingface.co/spaces
# Click "Create new Space"
# Name: rag-chatbot
# SDK: Docker
# Hardware: CPU basic (free)
```

### 2. Clone and Setup
```bash
git clone https://huggingface.co/spaces/YOUR-USERNAME/rag-chatbot
cd rag-chatbot
cp -r ../backend/* .
git add .
git commit -m "Initial deployment"
git push
```

### 3. Configure Secrets
Go to Space Settings → Variables and secrets

Add these **secrets**:
- [ ] `COHERE_API_KEY`
- [ ] `QDRANT_URL`
- [ ] `QDRANT_API_KEY`
- [ ] `NEON_DATABASE_URL`
- [ ] `CORS_ORIGINS`

### 4. Restart Space
- [ ] Click "Factory reboot"
- [ ] Wait for build to complete (3-5 min)

## 🧪 Testing

### 1. Health Check
```bash
curl https://YOUR-USERNAME-rag-chatbot.hf.space/
```
Expected: `{"status": "ok", ...}`

### 2. Chat Endpoint
```bash
curl -X POST https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ROS 2?"}'
```
Expected: JSON response with AI answer

### 3. API Docs
Open: `https://YOUR-USERNAME-rag-chatbot.hf.space/docs`

### 4. RAG Stats
```bash
curl https://YOUR-USERNAME-rag-chatbot.hf.space/api/rag/stats
```
Expected: `{"total_chunks_indexed": 50, ...}`

## 🔗 Update Frontend

### 1. Update Root.tsx
```typescript
// physical-ai-book/src/theme/Root.tsx
const apiEndpoint = 'https://YOUR-USERNAME-rag-chatbot.hf.space/api/chatbot/query';
```

### 2. Test Locally
```bash
cd physical-ai-book
npm start
# Open http://localhost:3000/physical-ai-humanoid-robotics-book/
# Test chat widget
```

### 3. Deploy Frontend
```bash
npm run build
npm run deploy
```

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Build fails | Check Dockerfile syntax, requirements.txt |
| 404 on all endpoints | Verify port 7860, check CMD in Dockerfile |
| CORS errors | Add frontend URL to CORS_ORIGINS secret |
| No chunks retrieved | Verify Qdrant credentials, check /api/rag/stats |
| Slow first request | Normal for free tier (cold start ~30s) |

## 📋 Post-Deployment

- [ ] Frontend updated with Space URL
- [ ] End-to-end chat tested
- [ ] Documentation updated
- [ ] Space URL shared with users

## 🔗 Your URLs

- **Backend**: `https://YOUR-USERNAME-rag-chatbot.hf.space`
- **API Docs**: `https://YOUR-USERNAME-rag-chatbot.hf.space/docs`
- **Frontend**: `https://YOUR-USERNAME.github.io/physical-ai-humanoid-robotics-book/`

---

**Need help?** See [HUGGINGFACE_DEPLOYMENT_GUIDE.md](../HUGGINGFACE_DEPLOYMENT_GUIDE.md)
