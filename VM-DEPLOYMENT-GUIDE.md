# Cloud VM Deployment Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. **Cannot Access Application from External IP**

**Problem**: API calls work locally on VM but not from external IP.

**Solutions**:
```bash
# 1. Check if containers are running
docker compose ps

# 2. Check if ports are properly bound to 0.0.0.0
docker compose ps --format "table {{.Name}}\t{{.Ports}}"

# 3. Check VM firewall rules
sudo ufw status
sudo ufw allow 3000
sudo ufw allow 8000

# 4. Check cloud provider security groups
# Ensure ports 3000 and 8000 are open for inbound traffic

# 5. Test connectivity from VM
curl http://localhost:3000
curl http://localhost:8000/api/health
```

### 2. **CORS Issues**

**Problem**: Frontend loads but API calls fail with CORS errors.

**Solutions**:
```bash
# 1. Set proper ORIGINS environment variable
export ORIGINS="http://YOUR_VM_IP:3000,http://YOUR_VM_IP,https://YOUR_VM_IP"

# 2. Rebuild with new environment
docker compose down
docker compose up --build -d

# 3. Check backend logs for CORS errors
docker compose logs backend | grep -i cors
```

### 3. **Frontend Not Loading**

**Problem**: Frontend container runs but shows empty page or 404.

**Solutions**:
```bash
# 1. Check if React build succeeded
docker compose logs frontend

# 2. Check if API_URL is correctly set
docker compose exec frontend env | grep REACT_APP_API_URL

# 3. Rebuild frontend with correct API URL
export REACT_APP_API_URL="http://YOUR_VM_IP:8000/api"
docker compose build --no-cache frontend
docker compose up -d frontend
```

### 4. **Database Issues**

**Problem**: Backend starts but database operations fail.

**Solutions**:
```bash
# 1. Check if database volume is mounted
docker compose exec backend ls -la /app/data/

# 2. Initialize database
docker compose exec backend python scripts/setup_database.py

# 3. Check database permissions
docker compose exec backend ls -la /app/data/finance_tracker.db
```

### 5. **Health Check Failures**

**Problem**: Backend container keeps restarting.

**Solutions**:
```bash
# 1. Check detailed logs
docker compose logs backend --tail=100

# 2. Test health endpoint manually
docker compose exec backend curl http://localhost:8000/api/health

# 3. Check if all dependencies are installed
docker compose exec backend pip list | grep -E "(fastapi|uvicorn|sqlalchemy)"
```

## 🔧 **VM-Specific Commands**

### On Your Cloud VM:

```bash
# 1. Pull latest code
git pull origin main

# 2. Set environment variables for your VM IP
export VM_IP="YOUR_ACTUAL_VM_IP"
export REACT_APP_API_URL="http://$VM_IP:8000/api"
export ORIGINS="http://$VM_IP:3000,http://$VM_IP"

# 3. Deploy with environment
docker compose -f docker-compose-vm.yml down
docker compose -f docker-compose-vm.yml up --build -d

# 4. Monitor deployment
docker compose -f docker-compose-vm.yml logs -f
```

### Quick Deployment Test:

```bash
# Test from VM (should work)
curl http://localhost:8000/api/health
curl http://localhost:3000

# Test from external (replace with your VM IP)
curl http://YOUR_VM_IP:8000/api/health
curl http://YOUR_VM_IP:3000
```

## 📋 **Deployment Checklist**

- [ ] VM has Docker and Docker Compose installed
- [ ] Firewall allows ports 3000 and 8000
- [ ] Cloud security groups allow inbound traffic on ports 3000 and 8000
- [ ] Environment variables are set with correct VM IP
- [ ] Containers are bound to 0.0.0.0, not localhost
- [ ] CORS is configured to allow external origins
- [ ] Database volume is properly mounted
- [ ] Health checks pass for both services

## 🌐 **Access URLs**

Replace `YOUR_VM_IP` with your actual cloud VM public IP:

- **Frontend**: `http://YOUR_VM_IP:3000`
- **Backend API**: `http://YOUR_VM_IP:8000/api`
- **Health Check**: `http://YOUR_VM_IP:8000/api/health`
- **API Docs**: `http://YOUR_VM_IP:8000/docs`
