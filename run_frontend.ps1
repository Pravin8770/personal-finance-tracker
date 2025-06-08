# Running the frontend in development mode
$ErrorActionPreference = "Stop"

Write-Host "Setting up personal finance tracker frontend..." -ForegroundColor Green

# Navigate to the frontend directory
Push-Location -Path "$(Split-Path -Parent $MyInvocation.MyCommand.Path)/frontend"

# Install dependencies if node_modules does not exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Run the React development server
Write-Host "Starting React development server..." -ForegroundColor Green
npm start

Pop-Location
