# Cloud VM Deployment Script for Personal Finance Tracker
# Usage: .\deploy-vm.ps1 -VMIp "YOUR_VM_IP"

param(
    [Parameter(Mandatory=$true)]
    [string]$VMIp
)

Write-Host "🚀 Deploying Personal Finance Tracker to Cloud VM..." -ForegroundColor Green
Write-Host "📍 VM IP: $VMIp" -ForegroundColor Cyan

# Set environment variables for cloud deployment
$env:REACT_APP_API_URL = "http://$VMIp:8000/api"
$env:ORIGINS = "http://$VMIp:3000,http://$VMIp,https://$VMIp"

Write-Host "🔧 Environment Configuration:" -ForegroundColor Yellow
Write-Host "   - API URL: $($env:REACT_APP_API_URL)" -ForegroundColor White
Write-Host "   - CORS Origins: $($env:ORIGINS)" -ForegroundColor White

try {
    # Stop existing containers
    Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
    docker compose down --volumes 2>$null

    # Remove old images to force rebuild
    Write-Host "🗑️  Removing old images..." -ForegroundColor Yellow
    docker compose build --no-cache

    # Start services
    Write-Host "🏗️  Building and starting services..." -ForegroundColor Yellow
    docker compose up -d

    # Wait for services to be ready
    Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30

    # Check service health
    Write-Host "🔍 Checking service health..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -UseBasicParsing -TimeoutSec 10
        Write-Host "✅ Backend is healthy" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend health check failed" -ForegroundColor Red
        docker compose logs backend
    }

    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 10
        Write-Host "✅ Frontend is accessible" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Frontend accessibility check failed" -ForegroundColor Red
        docker compose logs frontend
    }

    Write-Host ""
    Write-Host "🎉 Deployment completed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Access your application:" -ForegroundColor Cyan
    Write-Host "   Frontend: http://$VMIp:3000" -ForegroundColor White
    Write-Host "   Backend API: http://$VMIp:8000/api" -ForegroundColor White
    Write-Host "   Health Check: http://$VMIp:8000/api/health" -ForegroundColor White
    Write-Host ""
    Write-Host "📊 View logs:" -ForegroundColor Cyan
    Write-Host "   All services: docker compose logs" -ForegroundColor White
    Write-Host "   Backend only: docker compose logs backend" -ForegroundColor White
    Write-Host "   Frontend only: docker compose logs frontend" -ForegroundColor White
    Write-Host ""
    Write-Host "🔧 Troubleshooting:" -ForegroundColor Cyan
    Write-Host "   Check container status: docker compose ps" -ForegroundColor White
    Write-Host "   Restart services: docker compose restart" -ForegroundColor White
    Write-Host "   View real-time logs: docker compose logs -f" -ForegroundColor White
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "📋 Container status:" -ForegroundColor Yellow
    docker compose ps
    Write-Host "📋 Recent logs:" -ForegroundColor Yellow
    docker compose logs --tail=50
    exit 1
}
