# Comprehensive Test Script for RAG Chatbot System
# Tests: Backend API, Frontend Build, RAG Functionality, Connectivity
# Output: test_logs.txt

$LogFile = "test_logs.txt"
$Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Initialize log file
@"
================================================================================
RAG CHATBOT SYSTEM - COMPREHENSIVE TEST LOG
================================================================================
Test Started: $Timestamp
Test Location: $PWD
================================================================================

"@ | Out-File -FilePath $LogFile -Encoding UTF8

function Write-TestLog {
    param([string]$Message)
    $TimestampedMsg = "[$(Get-Date -Format 'HH:mm:ss')] $Message"
    Write-Host $TimestampedMsg
    $TimestampedMsg | Out-File -FilePath $LogFile -Append -Encoding UTF8
}

function Write-TestSection {
    param([string]$Title)
    $Section = @"

================================================================================
$Title
================================================================================
"@
    Write-Host $Section -ForegroundColor Cyan
    $Section | Out-File -FilePath $LogFile -Append -Encoding UTF8
}

# ============================================================================
# TEST 1: BACKEND API HEALTH CHECK
# ============================================================================
Write-TestSection "TEST 1: BACKEND API HEALTH CHECK (Hugging Face)"

Write-TestLog "Testing backend endpoint: https://salman-giaic-rag.hf.space"

try {
    $BackendHealth = Invoke-RestMethod -Uri "https://salman-giaic-rag.hf.space/" -Method Get -TimeoutSec 30
    Write-TestLog "✓ PASS: Backend is accessible"
    Write-TestLog "Response: $($BackendHealth | ConvertTo-Json -Depth 5)"

    if ($BackendHealth.status -eq "ok" -or $BackendHealth.status -eq "running") {
        Write-TestLog "✓ PASS: Backend status is healthy"
    } else {
        Write-TestLog "✗ WARNING: Backend status is unexpected: $($BackendHealth.status)"
    }
} catch {
    Write-TestLog "✗ FAIL: Backend health check failed"
    Write-TestLog "Error: $($_.Exception.Message)"
}

# ============================================================================
# TEST 2: BACKEND API DOCUMENTATION
# ============================================================================
Write-TestSection "TEST 2: BACKEND API DOCUMENTATION ENDPOINT"

Write-TestLog "Testing API docs: https://salman-giaic-rag.hf.space/docs"

try {
    $ApiDocs = Invoke-WebRequest -Uri "https://salman-giaic-rag.hf.space/docs" -Method Get -TimeoutSec 30
    if ($ApiDocs.StatusCode -eq 200) {
        Write-TestLog "✓ PASS: API documentation is accessible"
        Write-TestLog "Status Code: $($ApiDocs.StatusCode)"
        Write-TestLog "Content Length: $($ApiDocs.Content.Length) bytes"
    }
} catch {
    Write-TestLog "✗ FAIL: API documentation not accessible"
    Write-TestLog "Error: $($_.Exception.Message)"
}

# ============================================================================
# TEST 3: RAG CHATBOT QUERY ENDPOINT
# ============================================================================
Write-TestSection "TEST 3: RAG CHATBOT QUERY FUNCTIONALITY"

Write-TestLog "Testing RAG query endpoint: /chat"

$TestQueries = @(
    @{ query = "What is ROS 2?"; description = "Basic ROS 2 query" },
    @{ query = "Explain VSLAM"; description = "VSLAM technical query" },
    @{ query = "What is a digital twin?"; description = "Digital twin concept query" }
)

foreach ($TestQuery in $TestQueries) {
    Write-TestLog ""
    Write-TestLog "--- Testing: $($TestQuery.description) ---"
    Write-TestLog "Query: '$($TestQuery.query)'"

    try {
        $QueryBody = @{
            query = $TestQuery.query
            mode = "rag"
            conversation_history = @()
        } | ConvertTo-Json

        $Response = Invoke-RestMethod -Uri "https://salman-giaic-rag.hf.space/chat" `
            -Method Post `
            -ContentType "application/json" `
            -Body $QueryBody `
            -TimeoutSec 60

        if ($Response.success) {
            Write-TestLog "✓ PASS: Query successful"
            Write-TestLog "Response Preview: $($Response.data.response_text.Substring(0, [Math]::Min(200, $Response.data.response_text.Length)))..."

            if ($Response.data.retrieved_chunks) {
                Write-TestLog "✓ PASS: Retrieved $($Response.data.retrieved_chunks.Count) chunks"
                Write-TestLog "Source Chapters: $($Response.data.retrieved_chunks.chapter_title -join ', ')"
            } else {
                Write-TestLog "✗ WARNING: No chunks retrieved"
            }

            if ($Response.data.token_usage) {
                Write-TestLog "Token Usage: $($Response.data.token_usage | ConvertTo-Json -Compress)"
            }
        } else {
            Write-TestLog "✗ FAIL: Query returned success=false"
            Write-TestLog "Error: $($Response.error)"
        }
    } catch {
        Write-TestLog "✗ FAIL: Query failed"
        Write-TestLog "Error: $($_.Exception.Message)"
    }
}

# ============================================================================
# TEST 4: FRONTEND ACCESSIBILITY
# ============================================================================
Write-TestSection "TEST 4: FRONTEND ACCESSIBILITY (GitHub Pages)"

Write-TestLog "Testing frontend: https://salmansiddiqui-99.github.io/rag-chatbot/"

try {
    $Frontend = Invoke-WebRequest -Uri "https://salmansiddiqui-99.github.io/rag-chatbot/" -Method Get -TimeoutSec 30
    if ($Frontend.StatusCode -eq 200) {
        Write-TestLog "✓ PASS: Frontend is accessible"
        Write-TestLog "Status Code: $($Frontend.StatusCode)"
        Write-TestLog "Content Type: $($Frontend.Headers.'Content-Type')"
        Write-TestLog "Content Length: $($Frontend.Content.Length) bytes"

        # Check for key elements
        if ($Frontend.Content -match "Physical AI") {
            Write-TestLog "✓ PASS: Page contains expected content ('Physical AI')"
        }

        if ($Frontend.Content -match "Docusaurus") {
            Write-TestLog "✓ PASS: Docusaurus framework detected"
        }
    }
} catch {
    Write-TestLog "✗ FAIL: Frontend not accessible"
    Write-TestLog "Error: $($_.Exception.Message)"
}

# ============================================================================
# TEST 5: FRONTEND BUILD VERIFICATION
# ============================================================================
Write-TestSection "TEST 5: FRONTEND BUILD VERIFICATION (Local)"

Write-TestLog "Checking frontend build artifacts..."

$BuildDir = "physical-ai-book\build"
if (Test-Path $BuildDir) {
    Write-TestLog "✓ PASS: Build directory exists"

    $BuildFiles = Get-ChildItem -Path $BuildDir -Recurse -File
    Write-TestLog "Build contains $($BuildFiles.Count) files"

    # Check for essential files
    $EssentialFiles = @("index.html", "sitemap.xml", ".nojekyll")
    foreach ($File in $EssentialFiles) {
        $FilePath = Join-Path $BuildDir $File
        if (Test-Path $FilePath) {
            Write-TestLog "✓ PASS: Essential file exists: $File"
        } else {
            Write-TestLog "✗ FAIL: Essential file missing: $File"
        }
    }
} else {
    Write-TestLog "✗ WARNING: Build directory not found (run 'npm run build' in physical-ai-book/)"
}

# ============================================================================
# TEST 6: FRONTEND-BACKEND CONNECTIVITY
# ============================================================================
Write-TestSection "TEST 6: FRONTEND-BACKEND CONNECTIVITY"

Write-TestLog "Verifying chat widget configuration..."

$RootTsxPath = "physical-ai-book\src\theme\Root.tsx"
if (Test-Path $RootTsxPath) {
    $RootTsxContent = Get-Content $RootTsxPath -Raw

    if ($RootTsxContent -match "https://salman-giaic-hackathon\.hf\.space") {
        Write-TestLog "✓ PASS: Chat widget configured with production Hugging Face URL"
    } elseif ($RootTsxContent -match "localhost:8000") {
        Write-TestLog "✗ FAIL: Chat widget still pointing to localhost (needs update)"
    } else {
        Write-TestLog "✗ WARNING: Could not determine API endpoint configuration"
    }

    # Extract the actual endpoint
    if ($RootTsxContent -match "apiEndpoint\s*=\s*'([^']+)'") {
        Write-TestLog "Configured endpoint: $($Matches[1])"
    }
} else {
    Write-TestLog "✗ FAIL: Root.tsx not found"
}

# ============================================================================
# TEST 7: BACKEND DEPENDENCIES CHECK
# ============================================================================
Write-TestSection "TEST 7: BACKEND DEPENDENCIES VERIFICATION"

Write-TestLog "Checking backend requirements.txt..."

$RequirementsPath = "backend\requirements.txt"
if (Test-Path $RequirementsPath) {
    $Requirements = Get-Content $RequirementsPath
    Write-TestLog "✓ PASS: requirements.txt exists"
    Write-TestLog "Total lines: $($Requirements.Count)"

    # Check for critical packages
    $CriticalPackages = @("fastapi", "uvicorn", "pydantic", "qdrant", "cohere")
    foreach ($Package in $CriticalPackages) {
        if ($Requirements -match $Package) {
            Write-TestLog "✓ PASS: Critical package found: $Package"
        } else {
            Write-TestLog "✗ WARNING: Critical package not found: $Package"
        }
    }
} else {
    Write-TestLog "✗ FAIL: requirements.txt not found"
}

# ============================================================================
# TEST 8: FRONTEND DEPENDENCIES CHECK
# ============================================================================
Write-TestSection "TEST 8: FRONTEND DEPENDENCIES VERIFICATION"

Write-TestLog "Checking frontend package.json..."

$PackageJsonPath = "physical-ai-book\package.json"
if (Test-Path $PackageJsonPath) {
    $PackageJson = Get-Content $PackageJsonPath -Raw | ConvertFrom-Json
    Write-TestLog "✓ PASS: package.json exists"
    Write-TestLog "Project: $($PackageJson.name)"
    Write-TestLog "Version: $($PackageJson.version)"

    # Check for Docusaurus
    if ($PackageJson.dependencies."@docusaurus/core") {
        Write-TestLog "✓ PASS: Docusaurus core: $($PackageJson.dependencies.'@docusaurus/core')"
    }

    # Check for search plugin
    if ($PackageJson.dependencies."@easyops-cn/docusaurus-search-local") {
        Write-TestLog "✓ PASS: Search plugin installed"
    }
} else {
    Write-TestLog "✗ FAIL: package.json not found"
}

# ============================================================================
# TEST 9: GIT REPOSITORY STATUS
# ============================================================================
Write-TestSection "TEST 9: GIT REPOSITORY STATUS"

Write-TestLog "Checking git repository..."

try {
    $GitStatus = git status --porcelain 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-TestLog "✓ PASS: Git repository initialized"

        if ($GitStatus) {
            Write-TestLog "Working tree status:"
            $GitStatus | Out-File -FilePath $LogFile -Append -Encoding UTF8
        } else {
            Write-TestLog "✓ PASS: Working tree is clean"
        }

        # Check remote
        $GitRemote = git remote -v 2>&1
        if ($GitRemote -match "github.com") {
            Write-TestLog "✓ PASS: GitHub remote configured"
            Write-TestLog "Remote: $($GitRemote -split "`n" | Select-Object -First 1)"
        }
    }
} catch {
    Write-TestLog "✗ WARNING: Git not available or not a git repository"
}

# ============================================================================
# TEST 10: DEPLOYMENT VERIFICATION
# ============================================================================
Write-TestSection "TEST 10: DEPLOYMENT VERIFICATION"

Write-TestLog "Checking deployment configuration..."

# Check GitHub Actions workflow
$WorkflowPath = ".github\workflows\deploy-book.yml"
if (Test-Path $WorkflowPath) {
    Write-TestLog "✓ PASS: GitHub Actions workflow exists"

    $Workflow = Get-Content $WorkflowPath -Raw
    if ($Workflow -match "physical-ai-book") {
        Write-TestLog "✓ PASS: Workflow configured for physical-ai-book directory"
    }
} else {
    Write-TestLog "✗ WARNING: GitHub Actions workflow not found"
}

# Check Dockerfile
$DockerfilePath = "backend\Dockerfile"
if (Test-Path $DockerfilePath) {
    Write-TestLog "✓ PASS: Backend Dockerfile exists"

    $Dockerfile = Get-Content $DockerfilePath -Raw
    if ($Dockerfile -match "7860") {
        Write-TestLog "✓ PASS: Dockerfile configured for Hugging Face (port 7860)"
    }
} else {
    Write-TestLog "✗ WARNING: Backend Dockerfile not found"
}

# ============================================================================
# TEST SUMMARY
# ============================================================================
Write-TestSection "TEST SUMMARY"

$EndTimestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-TestLog "Test Completed: $EndTimestamp"
Write-TestLog ""
Write-TestLog "All test results have been logged to: test_logs.txt"
Write-TestLog ""
Write-TestLog "Key URLs:"
Write-TestLog "  - Backend API: https://salman-giaic-rag.hf.space"
Write-TestLog "  - API Docs: https://salman-giaic-rag.hf.space/docs"
Write-TestLog "  - Frontend: https://salmansiddiqui-99.github.io/rag-chatbot/"
Write-TestLog ""
Write-TestLog "Next Steps:"
Write-TestLog "  1. Review test_logs.txt for detailed results"
Write-TestLog "  2. Address any FAIL or WARNING messages"
Write-TestLog "  3. Test chatbot functionality manually on the live site"
Write-TestLog "  4. Monitor GitHub Actions for successful deployments"

Write-Host "`n✓ Test execution complete! Results saved to test_logs.txt" -ForegroundColor Green
