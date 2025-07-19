# Security Overview

## What's Protected

**Authentication:**

- Custom JWT tokens (24h expiry)
- Password hashing with scrypt + 32-byte salt
- Rate limiting: 60 attempts/hour per IP
- Input validation on all forms

**Network:**

- Security headers (XSS, clickjacking protection)
- CORS: localhost:3000 only
- No sensitive data in logs

**Data:**

- SQL injection prevention (parameterized queries)
- Email/password validation
- Required fields: first_name, last_name, email, password

## Production Checklist

**Before deploying:**

- [ ] Change JWT_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS
- [ ] Set up monitoring
- [ ] Keep dependencies updated

## Environment Variables

```env
JWT_SECRET=my-very-secret-jwt-key-you-will-never-guess
DB_PASSWORD=password  # Change in production
```

## Testing

**Quick tests:**

```bash
# Check headers
curl -I http://localhost:3001/api/auth/login

# Test rate limiting
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrong"}'

# Test validation
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","password":"123"}'
```

## Future Improvements

- Redis for rate limiting
- Password reset functionality
- Two-factor authentication
- Account lockout after failed attempts
- HTTPS/HSTS headers in production
- CSRF protection for forms
