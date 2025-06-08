#!/bin/bash

# Cloud VM Deployment Script for Personal Finance Tracker
# Usage: ./deploy-vm.sh <VM_PUBLIC_IP>

set -e

VM_IP=${1:-"YOUR_VM_IP_HERE"}

if [ "$VM_IP" = "YOUR_VM_IP_HERE" ]; then
    echo "❌ Error: Please provide your VM's public IP address"
    echo "Usage: ./deploy-vm.sh <VM_PUBLIC_IP>"
    exit 1
fi

echo "🚀 Deploying Personal Finance Tracker to Cloud VM..."
echo "📍 VM IP: $VM_IP"

# Set environment variables for cloud deployment
export REACT_APP_API_URL="http://$VM_IP:8000/api"
export ORIGINS="http://$VM_IP:3000,http://$VM_IP,https://$VM_IP"

echo "🔧 Environment Configuration:"
echo "   - API URL: $REACT_APP_API_URL"
echo "   - CORS Origins: $ORIGINS"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker compose down --volumes || true

# Remove old images to force rebuild
echo "🗑️  Removing old images..."
docker compose build --no-cache

# Start services
echo "🏗️  Building and starting services..."
docker compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
if curl -f "http://localhost:8000/api/health" > /dev/null 2>&1; then
    echo "✅ Backend is healthy"
else
    echo "❌ Backend health check failed"
    docker compose logs backend
fi

if curl -f "http://localhost:3000" > /dev/null 2>&1; then
    echo "✅ Frontend is accessible"
else
    echo "❌ Frontend accessibility check failed"
    docker compose logs frontend
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "🌐 Access your application:"
echo "   Frontend: http://$VM_IP:3000"
echo "   Backend API: http://$VM_IP:8000/api"
echo "   Health Check: http://$VM_IP:8000/api/health"
echo ""
echo "📊 View logs:"
echo "   All services: docker compose logs"
echo "   Backend only: docker compose logs backend"
echo "   Frontend only: docker compose logs frontend"
echo ""
echo "🔧 Troubleshooting:"
echo "   Check container status: docker compose ps"
echo "   Restart services: docker compose restart"
echo "   View real-time logs: docker compose logs -f"
