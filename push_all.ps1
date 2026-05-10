# Push all remaining folders one by one to GitHub
$ErrorActionPreference = "Continue"
$repo = "c:\Users\Shaik.AbdulRazak\OneDrive\Desktop\New-projects"
Set-Location $repo

function Push-WithRetry {
    param($folderName)
    $maxRetries = 3
    for ($i = 1; $i -le $maxRetries; $i++) {
        git push origin main 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ SUCCESS: '$folderName' pushed!" -ForegroundColor Green
            return $true
        }
        Write-Host "⚠️  Push attempt $i failed. Retrying in 10s..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
    Write-Host "❌ FAILED to push '$folderName' after $maxRetries attempts." -ForegroundColor Red
    return $false
}

$folders = @(
    "SIH_FINAL",
    "Tech-titans",
    "TechTitansAImitigatedChildhealth",
    "UIDAI_PROJECT",
    "Unbiased AI",
    "University_data_dashboard",
    "medicine-authenticity-system",
    "ml-neural-network-checker",
    "neuro-glyph-project-execution",
    "portfolio-Ankitha",
    "proffesional system",
    "thesis-management-system",
    "voice0sAi-main"
)

# First update .gitignore commit
Write-Host "=== Updating .gitignore ===" -ForegroundColor Cyan
git add .gitignore push_all.ps1
$status = git status --short
if ($status) {
    git commit -m "Update .gitignore to exclude large datasets"
    Push-WithRetry ".gitignore update"
}

foreach ($folder in $folders) {
    Write-Host ""
    Write-Host "=== Processing: $folder ===" -ForegroundColor Cyan

    git add "$folder"
    $status = git status --short
    if (-not $status) {
        Write-Host "⏭️  Nothing new to commit for '$folder', skipping..." -ForegroundColor Yellow
        continue
    }

    git commit -m "Add $folder"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ ERROR committing '$folder'" -ForegroundColor Red
        continue
    }

    Push-WithRetry $folder
    Start-Sleep -Seconds 3
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "All done! Final git log:" -ForegroundColor Cyan
git log --oneline
