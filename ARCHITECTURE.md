# Architecture Overview

This document describes the architecture of the Open Saleor ecommerce platform.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
├─────────────────────────────────────────────────────────────┤
│  Web Browser ──► Next.js Storefront (Port 3000)             │
│  Admin User  ──► Saleor Dashboard (Port 9000)               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  Saleor API (Port 8000)                                     │
│  ├─ Django/Python Backend                                    │
│  ├─ GraphQL API Endpoint                                     │
│  └─ Gunicorn ASGI Server                                     │
│                                                              │
│  Celery Worker                                               │
│  └─ Background Task Processing                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        Data Layer                            │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL (Port 5432)                                      │
│  └─ Primary Database                                         │
│                                                              │
│  Redis (Port 6379)                                           │
│  ├─ Cache (DB 0)                                            │
│  └─ Message Broker (DB 1)                                   │
│                                                              │
│  Media Storage                                               │
│  └─ Local Volume or S3                                       │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Storefront (Next.js)
**Technology**: Next.js 14, React 18, TypeScript, Tailwind CSS, Apollo Client

**Responsibilities**:
- Customer-facing web interface
- Product browsing and search
- Shopping cart management
- Checkout process
- User account management
- Server-side rendering for SEO

**Key Files**:
- `storefront/src/app/` - Page routes
- `storefront/src/components/` - React components
- `storefront/src/lib/` - Utilities and API client
- `storefront/src/types/` - TypeScript definitions

### 2. Saleor API
**Technology**: Django, Python, GraphQL, Gunicorn

**Responsibilities**:
- Business logic
- Data validation
- Authentication and authorization
- GraphQL API endpoint
- Order processing
- Payment integration
- Email notifications

**API Endpoint**: `http://localhost:8000/graphql/`

**Key Features**:
- Complete GraphQL API
- Webhook support
- Plugin system
- Multi-channel support
- Multi-currency support

### 3. Saleor Dashboard
**Technology**: React, TypeScript

**Responsibilities**:
- Admin interface
- Product management
- Order management
- Customer management
- Store configuration
- Analytics and reports

**Access**: `http://localhost:9000`

### 4. PostgreSQL Database
**Technology**: PostgreSQL 15

**Responsibilities**:
- Persistent data storage
- Product catalog
- Order data
- Customer information
- Inventory tracking

**Schema**: Managed by Django ORM migrations

### 5. Redis
**Technology**: Redis 7

**Responsibilities**:
- Application caching
- Session storage
- Celery message broker
- Rate limiting

**Databases**:
- DB 0: Cache
- DB 1: Celery broker

### 6. Celery Worker
**Technology**: Celery, Python

**Responsibilities**:
- Asynchronous task processing
- Email sending
- Inventory updates
- Order fulfillment
- Scheduled tasks

### 7. MailHog (Development)
**Technology**: MailHog

**Responsibilities**:
- Email testing in development
- SMTP server simulation
- Email inspection interface

**Access**: `http://localhost:8025`

## Data Flow

### Product Browsing Flow
```
User ──► Storefront ──► GraphQL Query ──► Saleor API ──► PostgreSQL
                                                         ──► Redis Cache
     ◄── React UI ◄── JSON Response ◄── GraphQL ◄─────────┘
```

### Order Placement Flow
```
User ──► Storefront ──► GraphQL Mutation ──► Saleor API ──► PostgreSQL
                                                         ──► Celery Task
                                                         ──► Payment Gateway
                                                         ──► Email via SMTP
```

### Admin Management Flow
```
Admin ──► Dashboard ──► GraphQL Mutation ──► Saleor API ──► PostgreSQL
                                                         ──► Redis Cache Clear
```

## API Structure

### GraphQL Schema

**Main Types**:
- `Product` - Product information
- `ProductVariant` - Product variants (size, color, etc.)
- `Category` - Product categories
- `Collection` - Product collections
- `Order` - Customer orders
- `User` - User accounts
- `Checkout` - Shopping cart and checkout

**Key Queries**:
```graphql
products(first: Int!, channel: String!)
product(slug: String!, channel: String!)
categories(first: Int!)
checkout(id: ID!)
```

**Key Mutations**:
```graphql
checkoutCreate(input: CheckoutCreateInput!)
checkoutLinesAdd(checkoutId: ID!, lines: [CheckoutLineInput!]!)
checkoutComplete(checkoutId: ID!)
```

## Security

### Authentication
- JWT tokens for API authentication
- Session-based for dashboard
- OAuth support for social login

### Authorization
- Permission-based access control
- Role-based admin permissions
- Customer data isolation

### Data Protection
- HTTPS in production (recommended)
- Encrypted database connections
- Secure password hashing
- CSRF protection
- XSS prevention

## Scalability

### Horizontal Scaling
- Multiple API instances behind load balancer
- Multiple Celery workers
- Database read replicas
- Redis cluster

### Caching Strategy
- GraphQL query caching in Apollo Client
- Server-side caching in Redis
- CDN for static assets
- Browser caching for images

### Performance Optimization
- Database query optimization
- GraphQL query batching
- Image optimization
- Code splitting in Next.js
- Server-side rendering

## Deployment Architecture

### Development
```
Local Machine
├─ Docker Compose (all services)
└─ Node.js (storefront dev server)
```

### Production
```
Load Balancer (Nginx/Cloudflare)
├─ Storefront Instances (Vercel/AWS)
├─ API Instances (ECS/Kubernetes)
├─ Database (RDS/Cloud SQL)
├─ Redis (ElastiCache/Cloud Memorystore)
└─ Media Storage (S3/Cloud Storage)
```

## Monitoring and Logging

### Logs
- API logs: `docker-compose logs api`
- Worker logs: `docker-compose logs worker`
- Database logs: `docker-compose logs db`

### Metrics
- API response times
- Database query performance
- Cache hit rates
- Order conversion rates

### Error Tracking
- Sentry integration (recommended)
- Application logs
- Database error logs

## Backup Strategy

### Database Backup
```bash
# Daily automated backup
docker-compose exec -T db pg_dump -U saleor saleor > backup.sql
```

### Media Backup
- Use S3 versioning
- Regular snapshots
- Cross-region replication

## Technology Stack Summary

| Component | Technology | Version |
|-----------|-----------|---------|
| Frontend | Next.js | 14.x |
| UI Library | React | 18.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 3.x |
| API Client | Apollo Client | 3.x |
| Backend | Saleor/Django | 3.19 |
| API | GraphQL | 16.x |
| Database | PostgreSQL | 15 |
| Cache | Redis | 7 |
| Task Queue | Celery | Latest |
| Container | Docker | 20.10+ |
| Orchestration | Docker Compose | 2.0+ |

## Extension Points

### Plugin System
Saleor supports plugins for:
- Payment gateways
- Shipping methods
- Tax calculation
- Inventory management
- Analytics

### Webhooks
Configure webhooks for:
- Order events
- Product updates
- Customer events
- Payment events

### Custom API Extensions
- Extend GraphQL schema
- Add custom mutations
- Custom business logic

## Best Practices

1. **Always use environment variables** for configuration
2. **Enable caching** in production
3. **Use CDN** for static assets
4. **Implement monitoring** and alerting
5. **Regular backups** of database and media
6. **Keep dependencies updated**
7. **Use HTTPS** in production
8. **Implement rate limiting**
9. **Regular security audits**
10. **Load testing** before launch

## Resources

- [Saleor Documentation](https://docs.saleor.io/)
- [GraphQL API Reference](https://docs.saleor.io/docs/3.x/api-reference)
- [Next.js Documentation](https://nextjs.org/docs)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
