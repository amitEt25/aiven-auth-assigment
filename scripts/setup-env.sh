#!/bin/bash

# SaaS Auth System Environment Setup Script

echo "🚀 SaaS Auth System Environment Setup"
echo "======================================"

# Function to setup for Docker deployment
setup_docker() {
    echo "📦 Setting up for Docker deployment..."
    cd backend
    echo -e "# Server Configuration\nPORT=3001\nNODE_ENV=production\n\n# Database Configuration\nDB_HOST=postgres\nDB_PORT=5432\nDB_NAME=saas_auth\nDB_USER=postgres\nDB_PASSWORD=password\n\n# JWT Configuration\nJWT_SECRET=your-super-secret-jwt-key-change-this-in-production\n\n# Frontend URL for CORS\nFRONTEND_URL=http://localhost:3000\n" > .env
    echo "✅ Docker environment configured"
    echo "   - DB_HOST=postgres (Docker service name)"
    echo "   - Ready for: docker-compose up --build"
}

# Function to setup for local development
setup_local() {
    echo "💻 Setting up for local development..."
    cd backend
    echo -e "# Server Configuration\nPORT=3001\nNODE_ENV=development\n\n# Database Configuration\nDB_HOST=localhost\nDB_PORT=5432\nDB_NAME=saas_auth\nDB_USER=postgres\nDB_PASSWORD=password\n\n# JWT Configuration\nJWT_SECRET=your-super-secret-jwt-key-change-this-in-production\n\n# Frontend URL for CORS\nFRONTEND_URL=http://localhost:3000\n" > .env.local
    echo "✅ Local development environment configured"
    echo "   - DB_HOST=localhost"
    echo "   - Ready for: npm run dev"
}

# Function to start database only
start_db() {
    echo "🗄️  Starting PostgreSQL and pgAdmin..."
    docker-compose -f docker-compose.db.yml up -d
    echo "✅ Database services started"
    echo "   - PostgreSQL: localhost:5432"
    echo "   - pgAdmin: http://localhost:5050"
    echo "   - pgAdmin credentials: admin@admin.com / admin"
}

# Function to start everything in Docker
start_docker() {
    echo "🐳 Starting complete Docker stack..."
    docker-compose up --build -d
    echo "✅ All services started"
    echo "   - Frontend: http://localhost:3000"
    echo "   - Backend: http://localhost:3001"
    echo "   - pgAdmin: http://localhost:5050"
}

# Function to stop all services
stop_all() {
    echo "🛑 Stopping all services..."
    docker-compose down
    docker-compose -f docker-compose.db.yml down
    echo "✅ All services stopped"
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    echo "=================="
    
    # Check Docker containers
    if docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q "saas-auth"; then
        echo "🐳 Docker containers:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "saas-auth"
    else
        echo "🐳 No Docker containers running"
    fi
    
    # Check local services
    echo ""
    echo "💻 Local services:"
    if curl -s http://localhost:3001/health > /dev/null 2>&1; then
        echo "✅ Backend: http://localhost:3001 (running)"
    else
        echo "❌ Backend: http://localhost:3001 (not running)"
    fi
    
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend: http://localhost:3000 (running)"
    else
        echo "❌ Frontend: http://localhost:3000 (not running)"
    fi
}

# Main script logic
case "${1:-help}" in
    "docker")
        setup_docker
        ;;
    "local")
        setup_local
        ;;
    "start-db")
        start_db
        ;;
    "start-docker")
        setup_docker
        start_docker
        ;;
    "stop")
        stop_all
        ;;
    "status")
        show_status
        ;;
    "help"|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  docker        - Setup environment for Docker deployment"
        echo "  local         - Setup environment for local development"
        echo "  start-db      - Start PostgreSQL and pgAdmin only"
        echo "  start-docker  - Setup and start complete Docker stack"
        echo "  stop          - Stop all Docker services"
        echo "  status        - Show status of all services"
        echo "  help          - Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 local      # Setup for local development"
        echo "  $0 start-db   # Start database for local dev"
        echo "  $0 start-docker # Start everything in Docker"
        ;;
esac 