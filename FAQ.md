# Frequently Asked Questions (FAQ)

## General Questions

### What is Saleor?
Saleor is a modern, open-source, headless ecommerce platform built with Python, Django, and GraphQL. It provides a complete backend API for building custom storefronts.

### What is included in this project?
This project includes:
- Complete Saleor backend with GraphQL API
- Admin dashboard for managing the store
- Modern Next.js storefront
- PostgreSQL database
- Redis caching
- Docker setup for easy deployment
- Comprehensive documentation

### Is this production-ready?
Yes! This setup includes everything needed for production deployment, but you should:
- Configure proper environment variables
- Set up SSL/HTTPS
- Use managed database services
- Configure proper email service
- Set up payment gateways
- Enable monitoring and backups

## Setup Questions

### Do I need Docker?
For the backend, yes. Docker Compose is the recommended way to run Saleor and its dependencies. For the storefront, you can run it separately with Node.js.

### What are the minimum system requirements?
- 4GB RAM minimum (8GB recommended)
- 2 CPU cores minimum
- 10GB free disk space
- Docker 20.10+
- Node.js 18+

### How do I start the project?
1. Run `./start.sh` or `make setup`
2. Create admin user: `make create-user`
3. Install storefront: `cd storefront && npm install`
4. Start storefront: `npm run dev`

### The API is not responding. What should I do?
1. Check if services are running: `docker-compose ps`
2. View logs: `docker-compose logs api`
3. Restart services: `docker-compose restart`
4. Check if ports are already in use
5. Wait 30-60 seconds after starting for services to be ready

### How do I add products?
1. Access the dashboard at http://localhost:9000
2. Log in with your admin credentials
3. Navigate to "Catalog" → "Products"
4. Click "Add Product"
5. Fill in product details and save

## Development Questions

### How do I customize the storefront?
The storefront is built with Next.js and React. Edit files in:
- `storefront/src/app/` - Pages and routes
- `storefront/src/components/` - UI components
- `storefront/src/app/globals.css` - Global styles
- `storefront/tailwind.config.js` - Theme configuration

### Can I use a different frontend?
Yes! Saleor is headless, so you can build your frontend with any technology:
- React
- Vue.js
- Angular
- Mobile apps (React Native, Flutter)
- Any framework that can consume GraphQL APIs

### How do I add a payment gateway?
1. Install the payment plugin in Saleor
2. Configure it in the dashboard under "Configuration" → "Plugins"
3. Add your API keys to the `.env` file
4. Test the integration

Popular payment gateways:
- Stripe
- PayPal
- Braintree
- Adyen

### How do I configure email?
For development, MailHog is included at http://localhost:8025

For production, update `.env`:
```bash
EMAIL_URL=smtp://username:password@smtp.example.com:587/?tls=True
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

Recommended services:
- SendGrid
- AWS SES
- Mailgun
- Postmark

## Database Questions

### How do I backup the database?
```bash
docker-compose exec -T db pg_dump -U saleor saleor > backup.sql
```

Or use: `make backup-db`

### How do I restore from backup?
```bash
docker-compose exec -T db psql -U saleor saleor < backup.sql
```

Or use: `make restore-db FILE=backup.sql`

### Can I use a different database?
Saleor requires PostgreSQL. You can use:
- Local PostgreSQL (via Docker)
- Managed PostgreSQL (AWS RDS, Google Cloud SQL)
- Any PostgreSQL-compatible database

### How do I connect to the database?
```bash
docker-compose exec db psql -U saleor saleor
```

Or use: `make dbshell`

## API Questions

### Where is the API documentation?
- GraphQL Playground: http://localhost:8000/graphql/
- Official API docs: https://docs.saleor.io/docs/3.x/api-reference

### How do I test API queries?
Visit http://localhost:8000/graphql/ to use the interactive GraphQL playground.

Example query:
```graphql
query {
  products(first: 10, channel: "default-channel") {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}
```

### What is a channel?
Channels allow you to run multiple storefronts from one Saleor instance. The default channel is `"default-channel"`.

### How do I authenticate API requests?
Use JWT tokens:
1. Get token: `tokenCreate` mutation
2. Include in headers: `Authorization: JWT <token>`

## Deployment Questions

### How do I deploy to production?
See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions. Quick options:
- Docker Compose on VPS (DigitalOcean, Linode)
- Kubernetes
- Heroku
- AWS/GCP
- Saleor Cloud (managed hosting)

### Do I need HTTPS?
Yes, for production. Use:
- Let's Encrypt (free SSL)
- Cloudflare (free SSL + CDN)
- AWS Certificate Manager
- Your hosting provider's SSL

### Where should I host media files?
For production, use cloud storage:
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudinary

Configure in `.env`:
```bash
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
```

### How do I scale the application?
1. Use load balancer for multiple API instances
2. Use database read replicas
3. Use Redis cluster
4. Use CDN for static files
5. Enable caching

## Troubleshooting

### Port already in use
Change ports in `docker-compose.yml`:
```yaml
services:
  api:
    ports:
      - "8001:8000"  # Change 8000 to 8001
```

### Out of memory errors
Increase Docker memory limit:
- Docker Desktop: Settings → Resources → Memory (increase to 4GB+)
- Linux: Configure Docker daemon

### Storefront not connecting to API
1. Verify API is running: `curl http://localhost:8000/graphql/`
2. Check `.env.local` in storefront
3. Verify CORS settings in Saleor
4. Check browser console for errors

### Products not showing
1. Add products via dashboard at http://localhost:9000
2. Ensure products are published
3. Check products are in "default-channel"
4. Verify GraphQL query is correct

### Images not loading
1. Check media volume is mounted
2. Verify image URLs in API response
3. Check Next.js image domains in `next.config.js`
4. For production, configure S3/CDN

## Performance Questions

### How do I improve performance?
1. Enable Redis caching
2. Use CDN for static assets
3. Optimize images
4. Enable Next.js caching
5. Use database indexes
6. Configure connection pooling

### How many products can Saleor handle?
Saleor can handle:
- Thousands of products easily
- Hundreds of thousands with optimization
- Millions with proper infrastructure and caching

## Payment Questions

### Which payment gateways are supported?
Out of the box:
- Stripe
- Braintree
- Dummy (for testing)

Via plugins:
- PayPal
- Adyen
- Square
- Custom gateways via plugin system

### How do I test payments?
Use the Dummy payment gateway in development, or use test mode with Stripe/PayPal test keys.

## Security Questions

### Is it secure?
Yes, when properly configured:
- Use HTTPS in production
- Set strong SECRET_KEY
- Set DEBUG=False
- Keep dependencies updated
- Use secure passwords
- Configure CORS properly
- Enable rate limiting

### How do I secure the admin?
1. Use strong admin passwords
2. Enable two-factor authentication
3. Limit admin access by IP (firewall)
4. Regular security audits
5. Keep Saleor updated

## Updating Questions

### How do I update Saleor?
```bash
docker-compose pull
docker-compose up -d
docker-compose exec api python manage.py migrate
```

Or use: `make update`

### How do I update the storefront?
```bash
cd storefront
npm update
npm run build
```

## Support Questions

### Where can I get help?
- [Saleor Documentation](https://docs.saleor.io/)
- [Saleor Discord](https://discord.gg/saleor)
- [GitHub Issues](https://github.com/saleor/saleor/issues)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/saleor)

### How do I report bugs?
1. Check existing issues on GitHub
2. Provide detailed description
3. Include error logs
4. Steps to reproduce
5. Environment details

### Is there commercial support?
Yes, through [Saleor Cloud](https://saleor.io/cloud/) - managed hosting with support.

## License Questions

### What is the license?
This project is MIT licensed. Saleor itself is BSD-3-Clause licensed.

### Can I use this for commercial projects?
Yes! Both Saleor and this project can be used commercially without restrictions.

### Do I need to credit Saleor?
Not required, but appreciated! Saleor is open source and benefits from community contributions.

## More Questions?

If your question isn't answered here:
1. Check the [README.md](README.md)
2. Read [SETUP.md](SETUP.md) for detailed setup
3. See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment
4. Visit [Saleor Documentation](https://docs.saleor.io/)
5. Ask in [Saleor Discord](https://discord.gg/saleor)
