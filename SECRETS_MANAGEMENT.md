# Secrets Management Strategy

## Overview
This document outlines the strategy for managing sensitive information (API keys, database credentials, JWT secrets, etc.) in the Global Analytics & Situation Awareness platform.

## Environment Variables
All secrets should be stored in environment variables and never committed to version control.

### Required Environment Variables

#### Database
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<strong_password>
DB_NAME=global_analytics
DB_PORT=3306
```

#### JWT
```
JWT_SECRET=<long_random_string>
JWT_REFRESH_SECRET=<long_random_string>
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
```

#### SMTP (Email)
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>@gmail.com
SMTP_PASS=<app_password>
SMTP_FROM=noreply@global-analytics.local
SMTP_SECURE=false
```

#### Redis (Optional)
```
REDIS_URL=redis://localhost:6379
```

#### Node Environment
```
NODE_ENV=production
PORT=5000
CORS_ORIGIN=https://analytics.example.com
```

#### API Keys (Third-party services)
```
MAPTILER_API_KEY=<your_maptiler_key>
TWILIO_SID=<twilio_account_sid>
TWILIO_TOKEN=<twilio_auth_token>
TWILIO_PHONE=<twilio_phone_number>
```

## Development vs Production

### Development (.env.development)
- Use development database credentials
- Use self-signed JWT secrets
- Use localhost for API endpoints
- Enable debug logging

### Production (.env.production)
- Use strong database credentials
- Use cryptographically secure JWT secrets
- Use proper SSL certificates
- Disable debug logging
- Use environment-specific URLs

## Generating Secrets

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Generate Database Password
```bash
openssl rand -base64 32
```

## Deployment to Cloud

### AWS Secrets Manager
```bash
aws secretsmanager create-secret --name global-analytics/db-password --secret-string "password"
aws secretsmanager create-secret --name global-analytics/jwt-secret --secret-string "secret"
```

### Docker with Secrets
```bash
docker secret create db_password <password_file>
docker service create \
  --secret db_password \
  --env DB_PASSWORD_FILE=/run/secrets/db_password \
  global-analytics-backend
```

### Kubernetes with Secrets
```bash
kubectl create secret generic global-analytics-secrets \
  --from-literal=DB_PASSWORD=password \
  --from-literal=JWT_SECRET=secret
```

## .gitignore
Ensure these files are in .gitignore:
```
.env
.env.local
.env.*.local
*.key
*.pem
secrets/
```

## Rotation Strategy
- JWT secrets: Rotate quarterly
- Database passwords: Rotate quarterly
- SMTP credentials: Rotate on API provider updates
- Third-party API keys: Rotate according to provider guidelines

## Audit Logging
All secret access should be logged (without exposing the actual values):
```javascript
logger.info('Secret accessed', { type: 'jwt_secret', timestamp: new Date() });
```

## Security Checklist
- [ ] All secrets are in environment variables, not in code
- [ ] .env files are in .gitignore
- [ ] Secrets are backed up securely
- [ ] Rotation schedule is documented
- [ ] Access to production secrets is logged
- [ ] Least privilege principle for service accounts
- [ ] HTTPS/TLS enabled for all external communications
