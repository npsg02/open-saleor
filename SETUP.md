# Detailed Setup Guide

This guide provides step-by-step instructions for setting up the Open Saleor ecommerce website.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Installation Steps](#installation-steps)
3. [Configuration](#configuration)
4. [Troubleshooting](#troubleshooting)
5. [Next Steps](#next-steps)

## System Requirements

### Minimum Requirements

- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 10GB free space
- **OS**: Linux, macOS, or Windows with WSL2

### Software Requirements

- Docker Engine 20.10+
- Docker Compose 2.0+
- Node.js 18+
- npm 9+ or yarn 1.22+

## Installation Steps

### Step 1: Install Docker

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose-plugin
sudo usermod -aG docker $USER
```

#### macOS
Download and install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)

#### Windows
Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

### Step 2: Install Node.js

#### Using nvm (recommended)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Direct Installation
Download from [nodejs.org](https://nodejs.org/)

### Step 3: Clone and Configure

```bash
# Clone the repository
git clone https://github.com/npsg02/open-saleor.git
cd open-saleor

# Create environment file
cp .env.example .env

# Edit configuration (optional for development)
nano .env
```

### Step 4: Start Backend Services

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

Wait for services to be healthy (about 30-60 seconds).

### Step 5: Initialize Database

```bash
# Run migrations (usually automatic)
docker-compose exec api python manage.py migrate

# Create superuser
docker-compose exec api python manage.py createsuperuser

# Populate with sample data
docker-compose exec api python manage.py populatedb
```

### Step 6: Setup Storefront

```bash
cd storefront

# Install dependencies
npm install

# Start development server
npm run dev
```

## Configuration

### Environment Variables

Edit `.env` file to customize:

```bash
# Django Settings
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1,yourdomain.com

# Database
DATABASE_URL=postgres://saleor:saleor@db:5432/saleor

# Email (Production)
EMAIL_URL=smtp://user:pass@smtp.example.com:587
DEFAULT_FROM_EMAIL=noreply@example.com

# Storefront
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/
```

### Docker Compose Override

Create `docker-compose.override.yml` for local customization:

```yaml
version: '3.8'
services:
  api:
    ports:
      - "8001:8000"  # Change port
```

## Troubleshooting

### Common Issues

#### Port Already in Use

```bash
# Check what's using the port
sudo lsof -i :8000

# Stop the conflicting service or change port in docker-compose.yml
```

#### Database Connection Failed

```bash
# Check database status
docker-compose logs db

# Restart database
docker-compose restart db
```

#### API Not Responding

```bash
# Check API logs
docker-compose logs api

# Restart API
docker-compose restart api

# Rebuild if needed
docker-compose up -d --build api
```

#### Storefront Build Errors

```bash
cd storefront

# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

#### Permission Issues (Linux)

```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker
```

### Getting Help

If you encounter issues:

1. Check logs: `docker-compose logs -f [service]`
2. Verify all services are running: `docker-compose ps`
3. Check GitHub issues
4. Join Saleor Discord community

## Next Steps

### 1. Access the Dashboard

Navigate to http://localhost:9000 and:
- Log in with superuser credentials
- Configure your store settings
- Add products and categories
- Set up payment methods
- Configure shipping options

### 2. Customize the Storefront

Edit files in `storefront/src/`:
- `app/page.tsx` - Homepage
- `components/` - Reusable components
- `app/globals.css` - Global styles
- `tailwind.config.js` - Theme configuration

### 3. Configure Payment Gateways

Saleor supports multiple payment providers:
- Stripe
- Braintree
- PayPal
- Adyen

Add payment credentials to `.env`:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

### 4. Set Up Email

For production, configure a real email service:

```bash
# Using SendGrid
EMAIL_URL=smtp://apikey:YOUR_API_KEY@smtp.sendgrid.net:587/?tls=True

# Using AWS SES
EMAIL_URL=smtp://USERNAME:PASSWORD@email-smtp.region.amazonaws.com:587/?tls=True
```

### 5. Enable Features

Edit Saleor settings by accessing the Django admin:

```bash
docker-compose exec api python manage.py createsuperuser
```

Visit http://localhost:8000/admin/

### 6. Deploy to Production

See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment guide.

## Development Workflow

### Making Changes

1. **Backend Changes**: Modify Saleor settings via dashboard or Django admin
2. **Storefront Changes**: Edit files in `storefront/src/`, changes auto-reload
3. **Database Changes**: Create migrations if using custom models

### Testing

```bash
# Test storefront
cd storefront
npm run lint
npm run type-check
npm run build

# Test backend
docker-compose exec api python manage.py test
```

### Version Control

```bash
# Commit changes
git add .
git commit -m "Description of changes"
git push
```

## Maintenance

### Backup Database

```bash
# Backup
docker-compose exec db pg_dump -U saleor saleor > backup.sql

# Restore
docker-compose exec -T db psql -U saleor saleor < backup.sql
```

### Update Saleor

```bash
# Update to latest version
docker-compose pull
docker-compose up -d
docker-compose exec api python manage.py migrate
```

### Monitor Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
```

## Additional Resources

- [Saleor Documentation](https://docs.saleor.io/)
- [GraphQL API Reference](https://docs.saleor.io/docs/3.x/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Documentation](https://docs.docker.com/)
