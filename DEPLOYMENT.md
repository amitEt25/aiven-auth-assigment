# Deployment Guide

This guide provides step-by-step instructions for deploying the SaaS Auth System.

## Prerequisites

- Docker and Docker Compose installed
- Git installed
- At least 2GB of available RAM
- Ports 3000, 3001, and 5432 available

## Quick Deployment

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd saas-auth-system

# Run the setup script
./setup.sh
```

### 2. Start the Application

```bash
# Start all services
docker-compose up -d

# Check if all services are running
docker-compose ps
```

### 3. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

### 4. Test the Application

1. Open http://localhost:3000 in your browser
2. Click "Create a new account" to register
3. Fill in the registration form
4. You'll be automatically logged in and redirected to the dashboard
5. Click "View Users" to see all registered users

## Production Deployment

### Environment Variables

For production, update the environment variables in `docker-compose.yml`:

```yaml
environment:
  NODE_ENV: production
  JWT_SECRET: your-super-secret-production-key
  DB_PASSWORD: your-secure-database-password
```

### Security Considerations

1. **Change default passwords**:
   - Update `DB_PASSWORD` in docker-compose.yml
   - Update `JWT_SECRET` with a strong secret

2. **Use HTTPS in production**:
   - Set up a reverse proxy (nginx) with SSL certificates
   - Update `FRONTEND_URL` to use HTTPS

3. **Database security**:
   - Use a managed PostgreSQL service in production
   - Enable SSL connections
   - Set up proper backup strategies

### Scaling

For horizontal scaling:

```bash
# Scale backend services
docker-compose up -d --scale backend=3

# Use a load balancer for the frontend
# Consider using Docker Swarm or Kubernetes
```

## Troubleshooting

### Common Issues

1. **Port conflicts**:
   ```bash
   # Check what's using the ports
   lsof -i :3000
   lsof -i :3001
   lsof -i :5432
   ```

2. **Database connection issues**:
   ```bash
   # Check database logs
   docker-compose logs postgres
   ```

3. **Backend not starting**:
   ```bash
   # Check backend logs
   docker-compose logs backend
   ```

4. **Frontend not loading**:
   ```bash
   # Check frontend logs
   docker-compose logs frontend
   ```

### Reset Everything

```bash
# Stop and remove all containers
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d
```

## Monitoring

### Health Checks

- Frontend: http://localhost:3000/health
- Backend: http://localhost:3001/health

### Logs

```bash
# View all logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres

# Follow logs in real-time
docker-compose logs -f
```

### Resource Usage

```bash
# Check container resource usage
docker stats
```

## Backup and Restore

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U postgres saas_auth > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres saas_auth < backup.sql
```

## Updates

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose up -d --build
```

### Database Migrations

The database schema is automatically applied when the PostgreSQL container starts for the first time. For schema updates:

1. Update the schema file: `backend/src/database/schema.sql`
2. Restart the database container:
   ```bash
   docker-compose restart postgres
   ```

## Support

For issues or questions:

1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check network connectivity between containers
4. Review the README.md for detailed documentation 