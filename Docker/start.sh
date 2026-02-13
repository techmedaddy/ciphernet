#!/bin/bash

# CipherNet Docker Startup Script
# Finds available random ports and starts all services

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Function to find an available port
find_available_port() {
    local start_port=$1
    local port=$start_port
    while netstat -tuln 2>/dev/null | grep -q ":$port " || ss -tuln 2>/dev/null | grep -q ":$port "; do
        port=$((port + 1))
        if [ $port -gt 65535 ]; then
            echo "No available ports found starting from $start_port" >&2
            exit 1
        fi
    done
    echo $port
}

# Find available ports starting from random high numbers
echo "🔍 Finding available ports..."
BACKEND_PORT=$(find_available_port 43001)
FRONTEND_PORT=$(find_available_port 48080)
MONGO_PORT=$(find_available_port 47017)

echo "📦 Using ports:"
echo "   Backend:  $BACKEND_PORT"
echo "   Frontend: $FRONTEND_PORT"
echo "   MongoDB:  $MONGO_PORT"

# Export for docker-compose
export BACKEND_PORT
export FRONTEND_PORT
export MONGO_PORT

# Generate a random JWT secret if not set
if [ -z "$JWT_SECRET" ]; then
    export JWT_SECRET=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | xxd -p | tr -d '\n' | head -c 64)
fi

# Generate a random encryption key if not set
if [ -z "$ENCRYPTION_KEY" ]; then
    export ENCRYPTION_KEY=$(openssl rand -hex 32 2>/dev/null || head -c 64 /dev/urandom | xxd -p | tr -d '\n' | head -c 64)
fi

echo ""
echo "🚀 Starting CipherNet..."
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be healthy..."
sleep 5

# Check if services are running
if docker compose ps | grep -q "healthy"; then
    echo ""
    echo "✅ CipherNet is running!"
    echo ""
    echo "🌐 Access the application:"
    echo "   Frontend: http://localhost:$FRONTEND_PORT"
    echo "   Backend:  http://localhost:$BACKEND_PORT"
    echo "   MongoDB:  mongodb://localhost:$MONGO_PORT/ciphernet"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    docker compose logs -f"
    echo "   Stop:         docker compose down"
    echo "   Restart:      docker compose restart"
    echo ""
else
    echo ""
    echo "⚠️  Services may still be starting. Check status with:"
    echo "   docker compose ps"
    echo "   docker compose logs"
fi
