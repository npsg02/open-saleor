# Deployment Guide

This guide covers deploying Open Saleor to production environments.

## Table of Contents

1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Deployment Options](#deployment-options)
4. [Post-deployment](#post-deployment)

## Pre-deployment Checklist

Before deploying to production, ensure:

- [ ] All tests pass
- [ ] Environment variables are configured
- [ ] Database is backed up
- [ ] SSL/TLS certificates are ready
- [ ] Domain name is configured
- [ ] Email service is configured
- [ ] Payment gateways are configured
- [ ] Media storage is configured (S3/CloudFront)

## Environment Configuration

### Required Environment Variables

Create a production `.env` file with:

```bash
# Django Settings
SECRET_KEY=your-very-secure-random-secret-key
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DATABASE_URL=postgres://user:password@your-db-host:5432/saleor

# Redis
REDIS_URL=redis://your-redis-host:6379/0
CELERY_BROKER_URL=redis://your-redis-host:6379/1

# Email
EMAIL_URL=smtp://user:password@smtp.provider.com:587/?tls=True
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Media Storage (AWS S3)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_STORAGE_BUCKET_NAME=your-bucket-name
AWS_S3_REGION_NAME=us-east-1

# Payment Gateways
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLIC_KEY=pk_live_...

# Storefront
NEXT_PUBLIC_API_URL=https://api.yourdomain.com/graphql/
```

### Security Best Practices

1. **Generate Strong Secret Key**:
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

2. **Set DEBUG to False**: Never run production with DEBUG=True

3. **Configure ALLOWED_HOSTS**: List all domains that can access your site

4. **Use HTTPS**: Always use SSL/TLS certificates in production

5. **Secure Database**: Use managed database services with encryption

## Deployment Options

### Option 1: Docker Compose on VPS

#### 1. Setup VPS (DigitalOcean, AWS EC2, etc.)

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt-get install docker-compose-plugin
```

#### 2. Clone and Configure

```bash
git clone https://github.com/npsg02/open-saleor.git
cd open-saleor

# Copy and edit environment file
cp .env.example .env
nano .env
```

#### 3. Deploy

```bash
# Build and start services
docker-compose up -d

# Create superuser
docker-compose exec api python manage.py createsuperuser

# Collect static files
docker-compose exec api python manage.py collectstatic --noinput
```

#### 4. Setup Nginx (Reverse Proxy)

Install Nginx:
```bash
sudo apt-get install nginx
```

Create configuration `/etc/nginx/sites-available/saleor`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /graphql/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /media/ {
        proxy_pass http://localhost:8000;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/saleor /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 5. Setup SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Kubernetes

#### 1. Create Kubernetes Manifests

Create `k8s/` directory with:
- `deployment.yaml` - Application deployments
- `service.yaml` - Services
- `ingress.yaml` - Ingress configuration
- `configmap.yaml` - Configuration
- `secret.yaml` - Secrets

#### 2. Deploy to Kubernetes

```bash
kubectl apply -f k8s/
```

### Option 3: Platform as a Service (PaaS)

#### Heroku

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Create app
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Add Redis
heroku addons:create heroku-redis:hobby-dev

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set DEBUG=False

# Deploy
git push heroku main
```

#### Railway/Render

These platforms support automatic deployments from GitHub:
1. Connect your repository
2. Configure environment variables
3. Deploy automatically on push

### Option 4: Serverless (Frontend)

#### Deploy Storefront to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from storefront directory
cd storefront
vercel
```

#### Deploy Backend to AWS/GCP

Use managed services:
- AWS ECS/Fargate for containers
- AWS RDS for PostgreSQL
- AWS ElastiCache for Redis
- AWS S3 for media storage

## Post-deployment

### 1. Verify Services

Check all services are running:
```bash
curl https://yourdomain.com
curl https://api.yourdomain.com/graphql/
```

### 2. Monitor Performance

Setup monitoring:
- Application monitoring (New Relic, DataDog)
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)

### 3. Setup Backups

#### Database Backup
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T db pg_dump -U saleor saleor > backup_$DATE.sql
# Upload to S3 or backup service
```

#### Media Backup
If using S3, enable versioning and lifecycle policies.

### 4. Configure CDN

Use CloudFront (AWS) or Cloudflare for:
- Static file delivery
- Media file delivery
- DDoS protection
- SSL/TLS

### 5. Setup Monitoring

```bash
# Check logs
docker-compose logs -f api
docker-compose logs -f worker

# Monitor resources
docker stats
```

## Scaling

### Horizontal Scaling

1. **Load Balancer**: Add load balancer for multiple instances
2. **Database**: Use read replicas
3. **Redis**: Use Redis cluster
4. **Media**: Use CDN for static/media files

### Performance Optimization

1. **Enable Caching**: Configure Redis caching
2. **Database Indexing**: Add indexes to frequently queried fields
3. **CDN**: Use CDN for all static assets
4. **Image Optimization**: Use image optimization service
5. **Query Optimization**: Optimize GraphQL queries

## Maintenance

### Regular Updates

```bash
# Update Docker images
docker-compose pull
docker-compose up -d

# Run migrations
docker-compose exec api python manage.py migrate
```

### Security Updates

- Regularly update dependencies
- Monitor security advisories
- Apply security patches promptly

## Troubleshooting

### Check Logs
```bash
docker-compose logs -f
```

### Database Issues
```bash
docker-compose exec api python manage.py dbshell
```

### Clear Cache
```bash
docker-compose exec api python manage.py clear_cache
```

## Support

For deployment assistance:
- Check [Saleor Cloud](https://saleor.io/cloud/) for managed hosting
- Join [Saleor Discord](https://discord.gg/saleor)
- Consult [Saleor Documentation](https://docs.saleor.io/)
