# Deploy the personal finance tracker application
$ErrorActionPreference = "Stop"

Write-Host "Deploying Personal Finance Tracker..." -ForegroundColor Green

# Check if Docker and Docker Compose are installed
try {
    docker --version
    docker-compose --version
} catch {
    Write-Host "Docker and/or Docker Compose not found. Please install them first." -ForegroundColor Red
    exit 1
}

# Navigate to project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Push-Location -Path $projectRoot

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Yellow
docker-compose up -d --build

# Check if containers are running
Write-Host "Checking container status..." -ForegroundColor Yellow
docker-compose ps

# Display access information
Write-Host "`n✅ Deployment complete!" -ForegroundColor Green
Write-Host "Your application is running at:" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Backend API: http://localhost:8000/api" -ForegroundColor Cyan
Write-Host "API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nDemo login:" -ForegroundColor Cyan
Write-Host "Email: demo@example.com" -ForegroundColor Cyan
Write-Host "Password: password123" -ForegroundColor Cyan

Write-Host "`nTo stop the application, run:" -ForegroundColor Yellow
Write-Host "docker-compose down" -ForegroundColor White

Pop-Location
