#!/bin/bash

# Simplified deployment script for trips-dashboard
# This script uses pre-built dist files instead of building on the server

set -e

echo "=========================================="
echo "Trips Dashboard - Simple Deployment"
echo "=========================================="

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file with required environment variables"
    exit 1
fi

echo "✓ .env file found"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ Error: dist folder not found!"
    echo "Please build the project locally first: pnpm run build"
    exit 1
fi

echo "✓ dist folder found"

# Check if client/dist folder exists
if [ ! -d "client/dist" ]; then
    echo "❌ Error: client/dist folder not found!"
    echo "Please build the client first: pnpm run build"
    exit 1
fi

echo "✓ client/dist folder found"

# Create required directories
echo "Creating required directories..."
mkdir -p nginx/ssl
mkdir -p nginx/conf.d

# Create default nginx conf.d if not exists
if [ ! -f "nginx/conf.d/default.conf" ]; then
    cat > nginx/conf.d/default.conf << 'EOF'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://app:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOF
    echo "✓ Created default nginx config"
fi

# Stop existing containers
echo "Stopping existing containers..."
docker-compose -f docker-compose-simple.yml down 2>/dev/null || true

# Pull latest images
echo "Pulling latest Docker images..."
docker-compose -f docker-compose-simple.yml pull

# Start services
echo "Starting services..."
docker-compose -f docker-compose-simple.yml up -d

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Check service status
echo ""
echo "=========================================="
echo "Service Status:"
echo "=========================================="
docker-compose -f docker-compose-simple.yml ps

echo ""
echo "=========================================="
echo "✓ Deployment completed!"
echo "=========================================="
echo ""
echo "Application should be available at:"
echo "  - http://localhost:80"
echo "  - http://$(hostname -I | awk '{print $1}'):80"
echo ""
echo "Database:"
echo "  - Host: db"
echo "  - Port: 3306"
echo ""
echo "Useful commands:"
echo "  - View logs: docker-compose -f docker-compose-simple.yml logs -f"
echo "  - Stop services: docker-compose -f docker-compose-simple.yml down"
echo "  - Restart services: docker-compose -f docker-compose-simple.yml restart"
echo ""
