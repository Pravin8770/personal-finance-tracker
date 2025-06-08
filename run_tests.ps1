# Run all tests for the personal finance tracker
$ErrorActionPreference = "Stop"

Write-Host "Running tests for personal finance tracker..." -ForegroundColor Green

# Run backend tests
Write-Host "`n🧪 Running backend tests..." -ForegroundColor Yellow
Push-Location -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)/backend"

# Activate virtual environment if it exists
if (Test-Path "venv") {
    . .\venv\Scripts\Activate.ps1
    pytest -vx
    $backendTestsStatus = $LASTEXITCODE
    deactivate
} else {
    Write-Host "Virtual environment not found. Please run run_backend.ps1 first." -ForegroundColor Red
    $backendTestsStatus = 1
}
Pop-Location

# Run frontend tests
Write-Host "`n🧪 Running frontend tests..." -ForegroundColor Yellow
Push-Location -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)/frontend"
npm test -- --watchAll=false
$frontendTestsStatus = $LASTEXITCODE
Pop-Location

# Display overall status
if ($backendTestsStatus -eq 0 -and $frontendTestsStatus -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Some tests failed. Check the output above for details." -ForegroundColor Red
}

exit ($backendTestsStatus -bor $frontendTestsStatus)
