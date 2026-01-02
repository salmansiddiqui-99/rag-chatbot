# RAG Chatbot System - Comprehensive Test Suite
# Generates: test_logs.txt

$LogFile = "test_logs.txt"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

# Initialize log
"" | Out-File -FilePath $LogFile
"================================================================================" | Out-File -FilePath $LogFile -Append
"RAG CHATBOT SYSTEM - COMPREHENSIVE TEST LOG" | Out-File -FilePath $LogFile -Append
"================================================================================" | Out-File -FilePath $LogFile -Append
"Test Started: $timestamp" | Out-File -FilePath $LogFile -Append
"Test Location: $PWD" | Out-File -FilePath $LogFile -Append
"================================================================================" | Out-File -FilePath $LogFile -Append
"" | Out-File -FilePath $LogFile -Append

function Log {
    param([string]$msg)
    $ts = Get-Date -Format 'HH:mm:ss'
    $line = "[$ts] $msg"
    Write-Host $line
    $line | Out-File -FilePath $LogFile -Append
}

function Section {
    param([string]$title)
    "" | Out-File -FilePath $LogFile -Append
    "================================================================================" | Out-File -FilePath $LogFile -Append
    $title | Out-File -FilePath $LogFile -Append
    "================================================================================" | Out-File -FilePath $LogFile -Append
    Write-Host "`n$title" -ForegroundColor Cyan
}

# TEST 1: Backend Health
Section "TEST 1: BACKEND API HEALTH CHECK"
Log "Testing: https://salman-giaic-rag.hf.space"

try {
    $health = Invoke-RestMethod -Uri "https://salman-giaic-rag.hf.space/" -Method Get -TimeoutSec 30 -ErrorAction Stop
    Log "PASS: Backend accessible"
    Log "Response: $($health | ConvertTo-Json -Compress -Depth 3)"

    if ($health.status) {
        Log "PASS: Status = $($health.status)"
    }
} catch {
    Log "FAIL: Backend health check failed"
    Log "Error: $($_.Exception.Message)"
}

# TEST 2: API Documentation
Section "TEST 2: API DOCUMENTATION ENDPOINT"
Log "Testing: https://salman-giaic-rag.hf.space/docs"

try {
    $docs = Invoke-WebRequest -Uri "https://salman-giaic-rag.hf.space/docs" -Method Get -TimeoutSec 30 -ErrorAction Stop
    Log "PASS: API docs accessible (Status: $($docs.StatusCode))"
    Log "Content-Length: $($docs.Content.Length) bytes"
} catch {
    Log "FAIL: API documentation not accessible"
    Log "Error: $($_.Exception.Message)"
}

# TEST 3: RAG Chat Endpoint
Section "TEST 3: RAG CHATBOT QUERY FUNCTIONALITY"

$queries = @(
    @{q="What is ROS 2?"; desc="Basic ROS 2 query"},
    @{q="Explain VSLAM"; desc="VSLAM query"},
    @{q="What is a digital twin?"; desc="Digital twin query"}
)

foreach ($test in $queries) {
    Log ""
    Log "--- $($test.desc) ---"
    Log "Query: '$($test.q)'"

    try {
        $body = @{query=$test.q; mode="rag"; conversation_history=@()} | ConvertTo-Json
        $resp = Invoke-RestMethod -Uri "https://salman-giaic-rag.hf.space/chat" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 60 `
            -ErrorAction Stop

        if ($resp.success) {
            Log "PASS: Query successful"
            $preview = $resp.data.response_text.Substring(0, [Math]::Min(150, $resp.data.response_text.Length))
            Log "Response: $preview..."

            if ($resp.data.retrieved_chunks) {
                Log "PASS: Retrieved $($resp.data.retrieved_chunks.Count) chunks"
            }
        } else {
            Log "FAIL: Query returned success=false"
        }
    } catch {
        Log "FAIL: Query exception"
        Log "Error: $($_.Exception.Message)"
    }
}

# TEST 4: Frontend Accessibility
Section "TEST 4: FRONTEND ACCESSIBILITY (GitHub Pages)"
Log "Testing: https://salmansiddiqui-99.github.io/rag-chatbot/"

try {
    $frontend = Invoke-WebRequest -Uri "https://salmansiddiqui-99.github.io/rag-chatbot/" -Method Get -TimeoutSec 30 -ErrorAction Stop
    Log "PASS: Frontend accessible (Status: $($frontend.StatusCode))"
    Log "Content-Type: $($frontend.Headers.'Content-Type')"
    Log "Content-Length: $($frontend.Content.Length) bytes"

    if ($frontend.Content -match "Physical AI") {
        Log "PASS: Contains 'Physical AI' content"
    }

    if ($frontend.Content -match "Docusaurus") {
        Log "PASS: Docusaurus framework detected"
    }
} catch {
    Log "FAIL: Frontend not accessible"
    Log "Error: $($_.Exception.Message)"
}

# TEST 5: Frontend Build
Section "TEST 5: FRONTEND BUILD ARTIFACTS"

$buildDir = "physical-ai-book\build"
if (Test-Path $buildDir) {
    Log "PASS: Build directory exists"
    $files = Get-ChildItem -Path $buildDir -Recurse -File
    Log "Build contains $($files.Count) files"

    $essential = @("index.html", "sitemap.xml", ".nojekyll")
    foreach ($file in $essential) {
        if (Test-Path "$buildDir\$file") {
            Log "PASS: Essential file exists: $file"
        } else {
            Log "FAIL: Missing essential file: $file"
        }
    }
} else {
    Log "WARNING: Build directory not found"
}

# TEST 6: Chat Widget Configuration
Section "TEST 6: FRONTEND-BACKEND CONNECTIVITY"

$rootTsx = "physical-ai-book\src\theme\Root.tsx"
if (Test-Path $rootTsx) {
    $content = Get-Content $rootTsx -Raw

    if ($content -match "salman-giaic-hackathon\.hf\.space") {
        Log "PASS: Chat widget uses production Hugging Face URL"
    } elseif ($content -match "localhost:8000") {
        Log "FAIL: Chat widget still points to localhost"
    }

    if ($content -match "apiEndpoint\s*=\s*'([^']+)'") {
        Log "Configured endpoint: $($Matches[1])"
    }
} else {
    Log "FAIL: Root.tsx not found"
}

# TEST 7: Backend Dependencies
Section "TEST 7: BACKEND DEPENDENCIES"

$reqs = "backend\requirements.txt"
if (Test-Path $reqs) {
    Log "PASS: requirements.txt exists"
    $lines = Get-Content $reqs
    Log "Total lines: $($lines.Count)"

    $critical = @("fastapi", "uvicorn", "pydantic", "qdrant", "cohere")
    foreach ($pkg in $critical) {
        if ($lines -match $pkg) {
            Log "PASS: Found $pkg"
        } else {
            Log "WARNING: Missing $pkg"
        }
    }
} else {
    Log "FAIL: requirements.txt not found"
}

# TEST 8: Frontend Dependencies
Section "TEST 8: FRONTEND DEPENDENCIES"

$pkgJson = "physical-ai-book\package.json"
if (Test-Path $pkgJson) {
    $pkg = Get-Content $pkgJson -Raw | ConvertFrom-Json
    Log "PASS: package.json exists"
    Log "Project: $($pkg.name) v$($pkg.version)"

    if ($pkg.dependencies.PSObject.Properties.Name -contains "@docusaurus/core") {
        Log "PASS: Docusaurus core installed"
    }

    if ($pkg.dependencies.PSObject.Properties.Name -contains "@easyops-cn/docusaurus-search-local") {
        Log "PASS: Search plugin installed"
    }
} else {
    Log "FAIL: package.json not found"
}

# TEST 9: Git Repository
Section "TEST 9: GIT REPOSITORY STATUS"

try {
    $gitCheck = git rev-parse --git-dir 2>&1
    if ($LASTEXITCODE -eq 0) {
        Log "PASS: Git repository initialized"

        $status = git status --porcelain 2>&1
        if (-not $status) {
            Log "PASS: Working tree clean"
        } else {
            Log "INFO: Working tree has changes"
            $status | Out-File -FilePath $LogFile -Append
        }

        $remote = git remote -v 2>&1 | Select-Object -First 1
        if ($remote -match "github.com") {
            Log "PASS: GitHub remote configured"
            Log "Remote: $remote"
        }
    }
} catch {
    Log "WARNING: Git check failed"
}

# TEST 10: Deployment Configuration
Section "TEST 10: DEPLOYMENT VERIFICATION"

$workflow = ".github\workflows\deploy-book.yml"
if (Test-Path $workflow) {
    Log "PASS: GitHub Actions workflow exists"
    $wf = Get-Content $workflow -Raw
    if ($wf -match "physical-ai-book") {
        Log "PASS: Workflow configured for physical-ai-book"
    }
} else {
    Log "WARNING: Workflow not found"
}

$dockerfile = "backend\Dockerfile"
if (Test-Path $dockerfile) {
    Log "PASS: Backend Dockerfile exists"
    $df = Get-Content $dockerfile -Raw
    if ($df -match "7860") {
        Log "PASS: Configured for Hugging Face (port 7860)"
    }
} else {
    Log "WARNING: Dockerfile not found"
}

# SUMMARY
Section "TEST SUMMARY"

$endTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Log "Test Completed: $endTime"
Log ""
Log "Results saved to: test_logs.txt"
Log ""
Log "Key URLs:"
Log "  Backend API: https://salman-giaic-rag.hf.space"
Log "  API Docs: https://salman-giaic-rag.hf.space/docs"
Log "  Frontend: https://salmansiddiqui-99.github.io/rag-chatbot/"

Write-Host "`nTest execution complete! Check test_logs.txt for details." -ForegroundColor Green
