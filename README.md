# SaaS Registration & Login System

A full-stack web application demonstrating user registration, authentication, and user management functionality without external authentication libraries.

---

## Quick Start (Docker Desktop v24+)

```bash
git clone https://github.com/amitEt25/aiven-auth-assigment.git
cd aiven-auth-assigment
docker compose up -d --build
```

| Service   | URL                                            | Default creds               |
| --------- | ---------------------------------------------- | --------------------------- |
| Frontend  | [http://localhost:3000](http://localhost:3000) | —                           |
| API       | [http://localhost:3001](http://localhost:3001) | —                           |
| pgAdmin\* | [http://localhost:5050](http://localhost:5050) | `admin@admin.com` / `admin` |

\*Optional PostgreSQL administration interface.

### Verification

```bash
curl -f http://localhost:3001/health          # Expected: {"status":"ok"}
```



## Application Workflow

1. Navigate to `/register` to create a new account
2. The application will redirect to `/dashboard` after successful registration
3. Click **"View Users"** to access `/users` (JWT-protected endpoint)

---

## API Reference

```bash
# register
curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@demo.com","password":"Secret123","first_name":"Alice","last_name":"Demo"}'

# login (returns JWT)
curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"alice@demo.com","password":"Secret123"}'

# Retrieve all users (replace <token> with actual JWT)
curl http://localhost:3001/api/users \
     -H "Authorization: Bearer <token>"
```

**Routes:**

| Method | Path                 | Protected |
| ------ | -------------------- | --------- |
| POST   | `/api/auth/register` | ❌        |
| POST   | `/api/auth/login`    | ❌        |
| GET    | `/api/auth/profile`  | ✅        |
| GET    | `/api/users`         | ✅        |

---

## Security Overview

The application implements comprehensive security measures including password hashing with scrypt and 32-byte salt. JWT tokens expire after 24 hours. Rate limiting allows 60 authentication attempts per hour. Additional protection includes security headers and server-side input validation.

For detailed security implementation information, see **SECURITY.md**.

---

## Production Deployment

### Prerequisites

1. **Update security credentials** in `docker-compose.yml`:

   ```yaml
   DB_PASSWORD: <secure-database-password>
   JWT_SECRET: <secure-jwt-secret>
   ```

2. **Implement HTTPS** using nginx with SSL/TLS certificates

3. **Consider managed services** for PostgreSQL and Redis-based rate limiting

4. **Implement monitoring** using tools such as Prometheus, Grafana, or Loki

### Scaling Example

```bash
# Deploy with 3 backend replicas (requires load balancer setup)
# Note: This requires additional configuration for port mapping
docker compose up -d --scale backend=3
```

**Note**: The scaling example requires a load balancer (like nginx) to distribute traffic across multiple backend instances, as Docker Compose cannot map multiple containers to the same external port. The backend is stateless with no user uploads saved locally.

---

## Troubleshooting and Monitoring

### Service Status

```bash
docker compose ps                # Check service status
docker compose logs -f backend   # Monitor backend logs
docker compose logs -f frontend  # Monitor frontend logs
docker compose logs -f postgres  # Monitor database logs
docker stats                     # Monitor container resources
lsof -i :3000                   # Check frontend port
lsof -i :3001                   # Check backend port
```

### Reset Environment

```bash
docker compose down -v --rmi all && docker compose up -d
```

---

## Tech Stack

- **Backend** Node.js 18 • Express • TypeScript
- **Frontend** React + Vite • Material‑UI
- **DB** PostgreSQL 15
- **Dev/Ops** Docker • Docker Compose

---

### License

[MIT License](LICENSE) - Please ensure proper security measures are implemented in production environments.
