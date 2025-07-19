# Deployment

## Quick Start

```bash
# Clone and start
git clone https://github.com/amitEt25/aiven-auth-assigment.git
cd aiven-auth-assigment
docker-compose up -d

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
# Database: localhost:5432
```

## Production

**Before deploying:**

1. **Change passwords:**

   ```yaml
   # docker-compose.yml
   DB_PASSWORD: your-secure-password
   JWT_SECRET: your-secure-jwt-secret
   ```

2. **Use HTTPS** - Set up nginx with SSL

3. **Use managed database** - PostgreSQL service

4. **Set up monitoring** - Logs and health checks

## Troubleshooting

**Common issues:**

```bash
# Check logs
docker-compose logs

# Reset everything
docker-compose down -v
docker-compose up -d

# Check ports
lsof -i :3000
lsof -i :3001
```

## Monitoring

**Health checks:**

- Backend: http://localhost:3001/health

**Logs:**

```bash
docker-compose logs -f
docker stats
```

## Updates

```bash
git pull
docker-compose down
docker-compose up -d --build
```
