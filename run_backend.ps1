# Running the backend in development mode with database setup
$ErrorActionPreference = "Stop"

Write-Host "Setting up personal finance tracker backend..." -ForegroundColor Green

# Navigate to the backend directory
Push-Location -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)/backend"

# Check for virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
. .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt

# Set up database and seed data
Write-Host "Setting up database..." -ForegroundColor Yellow
python scripts/setup_database.py

# Run the FastAPI server
Write-Host "Starting FastAPI server..." -ForegroundColor Green
uvicorn main:app --reload

# Deactivate virtual environment when done
deactivate
Pop-Location
