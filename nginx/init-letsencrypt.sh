#!/bin/bash

# Initialize Let's Encrypt SSL certificate using certbot
# Usage: ./nginx/init-letsencrypt.sh your-domain.com your-email@example.com

if [ -z "$1" ] || [ -z "$2" ]; then
    echo "Usage: $0 <domain> <email>"
    echo "Example: $0 trips-dashboard.example.com admin@example.com"
    exit 1
fi

DOMAIN=$1
EMAIL=$2
CERT_DIR="./nginx/ssl"

echo "Initializing Let's Encrypt certificate for $DOMAIN..."

# Create directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Check if certificate already exists
if [ -f "$CERT_DIR/live/$DOMAIN/fullchain.pem" ]; then
    echo "✓ Certificate already exists for $DOMAIN"
    exit 0
fi

# Create a temporary self-signed certificate for initial setup
echo "Creating temporary self-signed certificate..."
openssl req -x509 -newkey rsa:4096 -nodes \
    -out "$CERT_DIR/cert.pem" \
    -keyout "$CERT_DIR/key.pem" \
    -days 1 \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=Trips Dashboard/CN=$DOMAIN"

if [ $? -ne 0 ]; then
    echo "✗ Failed to create temporary certificate"
    exit 1
fi

echo "✓ Temporary certificate created"
echo ""
echo "Starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for nginx to start
echo "Waiting for Nginx to start..."
sleep 10

echo ""
echo "Requesting Let's Encrypt certificate for $DOMAIN..."
docker-compose -f docker-compose.prod.yml exec -T certbot certbot certonly \
    --webroot \
    -w /var/www/certbot \
    --email "$EMAIL" \
    --agree-tos \
    --no-eff-email \
    -d "$DOMAIN"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Let's Encrypt certificate obtained successfully!"
    echo "  Certificate: $CERT_DIR/live/$DOMAIN/fullchain.pem"
    echo "  Private key: $CERT_DIR/live/$DOMAIN/privkey.pem"
    echo ""
    echo "Reloading Nginx..."
    docker-compose -f docker-compose.prod.yml exec -T nginx nginx -s reload
    echo "✓ Nginx reloaded with new certificate"
else
    echo "✗ Failed to obtain Let's Encrypt certificate"
    echo "Please check the error messages above"
    exit 1
fi
