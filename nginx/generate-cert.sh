#!/bin/bash

# Generate self-signed SSL certificate for development/testing
# For production, use Let's Encrypt with certbot

CERT_DIR="./nginx/ssl"
CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"

# Create directory if it doesn't exist
mkdir -p "$CERT_DIR"

# Check if certificate already exists
if [ -f "$CERT_FILE" ] && [ -f "$KEY_FILE" ]; then
    echo "SSL certificates already exist at $CERT_DIR"
    exit 0
fi

echo "Generating self-signed SSL certificate..."

# Generate private key and certificate
openssl req -x509 -newkey rsa:4096 -nodes \
    -out "$CERT_FILE" \
    -keyout "$KEY_FILE" \
    -days 365 \
    -subj "/C=RU/ST=Moscow/L=Moscow/O=Trips Dashboard/CN=localhost"

if [ $? -eq 0 ]; then
    echo "✓ SSL certificate generated successfully"
    echo "  Certificate: $CERT_FILE"
    echo "  Private key: $KEY_FILE"
    echo ""
    echo "⚠️  This is a self-signed certificate for development/testing only."
    echo "   For production, use Let's Encrypt with certbot."
else
    echo "✗ Failed to generate SSL certificate"
    exit 1
fi
