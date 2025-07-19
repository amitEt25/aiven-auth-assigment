#!/bin/bash

echo "🚀 Setting up SaaS Auth System..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create .env files if they don't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cp backend/env.example backend/.env
fi

# Install dependencies for local development
echo "📦 Installing dependencies..."
npm install

echo "✅ Setup complete!"
echo ""
echo "🎯 To start the application:"
echo "   docker-compose up -d"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:3001"
echo ""
echo "🛑 To stop the application:"
echo "   docker-compose down"
echo ""
echo "📚 For more information, see README.md" 