#!/bin/bash

# Production Deployment Script for Trips Dashboard
# Usage: ./deploy-production.sh

set -e

echo "🚀 Trips Dashboard - Production Deployment"
echo "=========================================="
echo ""

# Check if running on the server
if [ ! -d "/root/trips-dashboard" ]; then
    echo "❌ Error: This script must be run on the production server"
    echo "   Expected directory: /root/trips-dashboard"
    exit 1
fi

cd /root/trips-dashboard

# Check if .env exists
if [ -f ".env" ]; then
    echo "✓ .env file already exists"
else
    echo "❌ Error: .env file not found"
    echo "   Please create .env file with production configuration"
    exit 1
fi

echo ""
echo "📦 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed"
    exit 1
fi
echo "✓ Docker version: $(docker --version)"

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed"
    exit 1
fi
echo "✓ Docker Compose version: $(docker-compose --version)"

echo ""
echo "🔐 Generating SSL certificates..."
if [ ! -f "nginx/ssl/cert.pem" ] || [ ! -f "nginx/ssl/key.pem" ]; then
    mkdir -p nginx/ssl
    ./nginx/generate-cert.sh
    echo "✓ Self-signed certificates generated (for testing)"
    echo "  For production, use Let's Encrypt:"
    echo "  ./nginx/init-letsencrypt.sh paragurudash.blubs.ru zamchalov@gmail.com"
else
    echo "✓ SSL certificates already exist"
fi

echo ""
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Starting containers..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

echo ""
echo "✓ Checking container status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec -T app pnpm db:push || true

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Check if services are running: docker-compose -f docker-compose.prod.yml ps"
echo "2. View logs: docker-compose -f docker-compose.prod.yml logs -f app"
echo "3. For HTTPS with Let's Encrypt:"
echo "   ./nginx/init-letsencrypt.sh paragurudash.blubs.ru zamchalov@gmail.com"
echo ""
echo "🌐 Application URL: https://paragurudash.blubs.ru"
echo ""
