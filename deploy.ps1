# ============================================
# SIMPLIFIED FIXED SCRIPT
# ============================================

param(
    [Parameter(Mandatory=$true)]
    [string]$CommitMessage,
    
    [Parameter(Mandatory=$true)]
    [string]$GitHubRepoName,
    
    [Parameter(Mandatory=$true)]
    [string]$NetlifySiteName
)

$ErrorActionPreference = "Stop"

function Write-Success { Write-Host "✓ $args" -ForegroundColor Green }
function Write-Error { Write-Host "✗ $args" -ForegroundColor Red }
function Write-Info { Write-Host "→ $args" -ForegroundColor Cyan }

Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host "   DEPLOYMENT SCRIPT" -ForegroundColor Magenta
Write-Host "============================================`n" -ForegroundColor Magenta

# STEP 1: BUILD
Write-Info "Building project..."
npm run build
Write-Success "Build complete"

# STEP 2: GIT SETUP
Write-Info "Setting up Git..."

# Initialize git if needed
if (-not (Test-Path ".git")) {
    git init
    Write-Success "Git initialized"
}

# Get GitHub username
$currentUser = gh api user --jq '.login'
$githubUrl = "https://github.com/$currentUser/$GitHubRepoName.git"

# Create repo on GitHub if it doesn't exist
$repoExists = gh repo view $GitHubRepoName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Info "Creating GitHub repository..."
    gh repo create $GitHubRepoName --public
    Write-Success "Repository created"
}

# Add remote origin (FIXED: only add if doesn't exist)
$remoteExists = git remote get-url origin 2>$null
if (-not $remoteExists) {
    Write-Info "Adding remote origin..."
    git remote add origin $githubUrl
    Write-Success "Remote added"
} else {
    Write-Success "Remote already exists"
}

# Add and commit files
Write-Info "Adding files..."
git add .
git commit -m "$CommitMessage" 2>$null
Write-Success "Files committed"

# Push to GitHub (FIXED: properly handle branch)
Write-Info "Pushing to GitHub..."
try {
    git push -u origin main
} catch {
    Write-Info "Main branch not found, trying master..."
    git push -u origin master
}
Write-Success "Pushed to GitHub"

# STEP 3: NETLIFY DEPLOY
Write-Info "Deploying to Netlify..."

$publishDir = if (Test-Path "dist") { "dist" } else { "build" }

# Check if site exists
$siteExists = netlify sites:get $NetlifySiteName 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Info "Creating Netlify site..."
    netlify sites:create --name $NetlifySiteName
}

# Deploy
netlify deploy --prod --dir $publishDir
Write-Success "Deployed to Netlify"

$siteUrl = "https://$NetlifySiteName.netlify.app"
Write-Host "`n✅ SUCCESS! Site live at: $siteUrl" -ForegroundColor Green