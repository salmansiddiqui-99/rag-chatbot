# Hugging Face Deployment Guide for RAG Chatbot Backend

This guide provides step-by-step instructions for deploying your RAG chatbot backend on Hugging Face Spaces. This will allow your backend to be accessible via the internet and connect with your frontend deployed on GitHub Pages.

## Prerequisites

Before deploying to Hugging Face, ensure you have:

1. A Hugging Face account (sign up at [huggingface.co](https://huggingface.co))
2. Git installed on your system
3. Your GitHub repository ready with the backend code
4. All required API keys and configuration values ready

## Step 1: Prepare Your Repository for Hugging Face

### 1.1 Update Your Dockerfile (if needed)

Your current Dockerfile is already configured for Hugging Face deployment (using port 7860), which is correct. The Dockerfile should look like this:

```dockerfile
# Dockerfile for RAG Chatbot Backend (Hugging Face Spaces deployment)

FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
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

# Run FastAPI with Uvicorn on port 7860
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

### 1.2 Create a Space Configuration File

Create a `README.md` file in your repository root (or update the existing one) with Hugging Face Space configuration:

```markdown
---
title: RAG Chatbot Backend
emoji: 🤖
colorFrom: purple
colorTo: red
sdk: docker
app_port: 7860
pinned: false
license: mit
---

# RAG Chatbot Backend

This is a RAG (Retrieval-Augmented Generation) chatbot backend for Physical AI & Humanoid Robotics Book.

## API Endpoints

- `/`: Root endpoint
- `/docs`: API documentation
- `/health`: Health check
- `/chat`: Chat endpoint
- `/ingest`: Ingestion endpoint

## Environment Variables

This space requires the following environment variables to be set:

- `OPENROUTER_API_KEY`: Your OpenRouter API key
- `QDRANT_API_KEY`: Your Qdrant API key
- `QDRANT_HOST`: Your Qdrant host URL
- `COHERE_API_KEY`: Your Cohere API key (optional)
- `OPENAI_API_KEY`: Your OpenAI API key (optional)
```

### 1.3 Update .env.example for Hugging Face

Create or update your `.env.example` file to clearly document required environment variables:

```env
# API Keys
OPENROUTER_API_KEY=your_openrouter_api_key_here
QDRANT_API_KEY=your_qdrant_api_key_here
QDRANT_HOST=your_qdrant_host_url_here
COHERE_API_KEY=your_cohere_api_key_here  # Optional
OPENAI_API_KEY=your_openai_api_key_here  # Optional

# Qdrant Configuration
QDRANT_COLLECTION_NAME=your_collection_name

# Application Configuration
APP_NAME=RAG Chatbot
APP_VERSION=1.0.0
DEBUG=false

# CORS Configuration (update to match your frontend URL)
CORS_ORIGINS=["https://your-username.github.io", "http://localhost:3000"]
```

## Step 2: Prepare Your Repository

### 2.1 Create a Dedicated Branch for Hugging Face Deployment

```bash
git checkout -b huggingface-deployment
```

### 2.2 Update Requirements (if needed)

Your current requirements.txt looks good, but make sure it includes all necessary dependencies:

```txt
# Core FastAPI Framework
fastapi>=0.104.1
uvicorn[standard]>=0.24.0
pydantic>=2.5.0

# Vector Database & AI Services
qdrant-client>=1.7.0
cohere>=4.37
openai>=1.6.1
openai-agents>=0.6.4

# Database (PostgreSQL with pgvector)
sqlalchemy>=2.0.0
psycopg2-binary>=2.9.0
pgvector>=0.2.0

# Utilities
python-dotenv>=1.0.0
tiktoken>=0.5.0
beautifulsoup4>=4.12.0
requests>=2.31.0

# Development & Testing
pytest>=7.4.0
pytest-cov>=4.1.0
pytest-asyncio>=0.21.0
httpx>=0.25.0
```

## Step 3: Create Hugging Face Space

### 3.1 Create Space via Hugging Face Interface

1. Go to [huggingface.co/spaces](https://huggingface.co/spaces)
2. Click "Create new Space"
3. Fill in the details:
   - **Space ID**: Choose a unique name (e.g., `your-username/rag-chatbot-backend`)
   - **SDK**: Select "Docker"
   - **Hardware**: Choose appropriate hardware (CPU Basic is usually sufficient for most use cases)
   - **Repository**: Choose "Create from scratch" or "Import from URL" if you want to import from GitHub
   - **Visibility**: Public or Private (as per your preference)

### 3.2 Or Import from GitHub

Alternatively, you can import your GitHub repository directly:

1. On the Space creation page, select "Import from GitHub"
2. Enter your GitHub repository URL
3. Make sure your repository has the proper Dockerfile and configuration files

## Step 4: Configure Environment Variables

### 4.1 Add Secrets to Your Hugging Face Space

1. Go to your Space page on Hugging Face
2. Click on "Files and versions" tab
3. Click on "Add Secret"
4. Add all required environment variables:

```
OPENROUTER_API_KEY: [your_openrouter_api_key]
QDRANT_API_KEY: [your_qdrant_api_key]
QDRANT_HOST: [your_qdrant_host_url]
COHERE_API_KEY: [your_cohere_api_key] (optional)
OPENAI_API_KEY: [your_openai_api_key] (optional)
```

### 4.2 Update CORS Settings

Make sure your CORS settings in the config allow your GitHub Pages domain:

```python
# In your config.py or .env file
CORS_ORIGINS = [
    "https://your-username.github.io",  # Your GitHub Pages URL
    "http://localhost:3000",           # Local development
    "http://localhost:8080",           # Alternative local dev
    # Add other domains as needed
]
```

## Step 5: Deploy and Test

### 5.1 Push Your Changes

If you made any changes to your repository, push them:

```bash
git add .
git commit -m "Prepare for Hugging Face deployment"
git push origin huggingface-deployment
```

### 5.2 Monitor the Build Process

1. Go to your Space page on Hugging Face
2. Click on "Logs" to monitor the build and deployment process
3. Wait for the build to complete successfully

### 5.3 Test Your Deployment

1. Once deployed, your backend will be available at: `https://your-username-namespace.hf.space`
2. Test the health endpoint: `https://your-username-namespace.hf.space/health`
3. Test the API documentation: `https://your-username-namespace.hf.space/docs`

## Step 6: Update Your Frontend Configuration

### 6.1 Update API Endpoint in Frontend

In your frontend application (deployed on GitHub Pages), update the API endpoint to point to your Hugging Face Space:

```javascript
// Example: Update your API base URL
const API_BASE_URL = 'https://your-username-namespace.hf.space';

// Or if you have a config file in your frontend
const config = {
  apiBaseUrl: 'https://your-username-namespace.hf.space',
  chatEndpoint: '/chat',
  healthEndpoint: '/health'
};
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Build Failures
- **Issue**: Docker build fails due to missing dependencies
- **Solution**: Check that all system dependencies are installed in the Dockerfile

#### 2. Port Issues
- **Issue**: Application doesn't start correctly
- **Solution**: Ensure you're using port 7860 and that the CMD in Dockerfile matches

#### 3. Environment Variables Not Loading
- **Issue**: API keys not available in the deployed app
- **Solution**: Verify that secrets are properly added in the Hugging Face Space settings

#### 4. CORS Errors
- **Issue**: Frontend can't connect to backend
- **Solution**: Ensure CORS settings include your GitHub Pages domain

#### 5. Resource Limits
- **Issue**: App crashes due to memory/CPU limits
- **Solution**: Consider upgrading hardware tier or optimizing your application

## Performance Optimization Tips

### 1. Optimize Docker Image Size
- Use multi-stage builds if needed
- Remove unnecessary files from the final image
- Use specific dependency versions for better caching

### 2. Caching Strategies
- Leverage FastAPI's built-in caching mechanisms
- Consider using Redis for session storage if needed
- Implement proper response caching for expensive operations

### 3. Hardware Selection
- Start with CPU Basic for testing
- Upgrade to GPU if you need model inference
- Consider T4 or A10g for GPU-accelerated tasks

## Security Best Practices

### 1. API Key Management
- Never hardcode API keys in your source code
- Use environment variables exclusively
- Rotate API keys regularly

### 2. Rate Limiting
- Implement rate limiting to prevent abuse
- Consider using middleware for request throttling

### 3. Input Validation
- Validate all incoming requests
- Implement proper error handling
- Sanitize user inputs

## Monitoring and Maintenance

### 1. Logging
- Implement proper logging in your application
- Monitor logs in the Hugging Face Space interface
- Set up alerts for critical errors

### 2. Health Checks
- Implement comprehensive health check endpoints
- Monitor uptime and performance
- Set up external monitoring if needed

### 3. Updates
- Regularly update dependencies
- Test updates in a separate branch first
- Monitor for security vulnerabilities

## Scaling Considerations

### 1. Traffic Management
- Hugging Face Spaces have resource limits
- Consider the number of concurrent users
- Plan for traffic spikes

### 2. Database Connection Pooling
- Optimize database connections
- Use connection pooling for better performance
- Monitor database performance

## Alternative: Using Hugging Face Inference API

If you prefer a serverless approach, you can also consider using Hugging Face's Inference API, though this would require significant architectural changes to your application.

## Support and Resources

- [Hugging Face Documentation](https://huggingface.co/docs/hub/spaces)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Hugging Face Discord](https://discord.gg/MUwsGf4J4Y)
- [GitHub Issues](https://github.com/huggingface/hub-docs/issues)

## Conclusion

Your RAG chatbot backend should now be successfully deployed on Hugging Face Spaces and accessible to your frontend deployed on GitHub Pages. The backend will be available at `https://your-username-namespace.hf.space` and can be integrated with your frontend application.

Remember to monitor your deployment and update environment variables as needed. The Hugging Face Space will automatically restart when you update your repository or environment variables.