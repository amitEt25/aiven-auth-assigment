# SaaS Registration & Login System

A simple web application with user registration, login, and user listing functionality.

## Features
- User registration and login
- JWT-based authentication
- View list of all registered users
- PostgreSQL database
- Docker containerized

## Tech Stack
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Frontend**: React, TypeScript, Material-UI
- **Database**: PostgreSQL

## Setup Instructions

### Using Docker (Recommended)
1. Clone the repository
2. Make sure Docker and Docker Compose are installed
3. Run the application:
```bash
docker-compose up --build
```
4. Wait for all services to start (about 30-60 seconds)
5. Access the application:
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:3001
   - **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

### Database Access
- **PostgreSQL**: localhost:5432 (postgres/password)
- **pgAdmin**: http://localhost:5050 (admin@admin.com / admin)

### Quick Test
Test that everything is working:
```bash
# Test backend health
curl http://localhost:3001/health

# Test frontend
curl http://localhost:3000
```

### Manual Setup

#### Backend
1. Navigate to backend directory:
```bash
cd backend
npm install
```

2. Create `.env.local` file with:
```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=saas_auth
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-secret-key
```

3. Setup PostgreSQL database and run the schema
4. Start the server:
```bash
npm run dev
```

#### Frontend
1. Navigate to frontend directory:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:3001/api
```

3. Start the development server:
```bash
npm run dev
```

## Usage
1. Register a new account at `/register`
2. Login at `/login`
3. View dashboard after successful login
4. Click "View Users" to see all registered users

## API Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/users` - Get all users (protected) 