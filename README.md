# Open Saleor - Full Ecommerce Website

A complete, production-ready ecommerce website built with Saleor - the modern, open-source headless commerce platform.

## 🚀 Features

- **Full Ecommerce Backend**: Powered by Saleor API with GraphQL
- **Modern Storefront**: Built with Next.js 14, React 18, and TypeScript
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Product Management**: Complete product catalog with categories
- **Shopping Cart**: Add to cart functionality with checkout flow
- **Admin Dashboard**: Saleor Dashboard for managing products, orders, and customers
- **Database**: PostgreSQL for reliable data storage
- **Caching**: Redis for improved performance
- **Email Testing**: MailHog for development email testing
- **Docker Support**: Easy deployment with Docker Compose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Docker](https://docs.docker.com/get-docker/) (v20.10 or higher)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0 or higher)
- [Node.js](https://nodejs.org/) (v18 or higher) - for storefront development
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🛠️ Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/npsg02/open-saleor.git
cd open-saleor
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and update the configuration as needed. For development, the default values work fine.

### 3. Start the Backend Services

```bash
docker-compose up -d
```

This will start:
- **PostgreSQL** (port 5432): Database
- **Redis** (port 6379): Cache and message broker
- **Saleor API** (port 8000): GraphQL API
- **Celery Worker**: Background task processing
- **Saleor Dashboard** (port 9000): Admin panel
- **MailHog** (port 8025): Email testing interface

### 4. Create Admin User

Wait for the services to start (about 30 seconds), then create an admin user:

```bash
docker-compose exec api python manage.py createsuperuser
```

Follow the prompts to set up your admin credentials.

### 5. Populate Sample Data (Optional)

```bash
docker-compose exec api python manage.py populatedb
```

This will create sample products, categories, and other data for testing.

### 6. Set Up the Storefront

```bash
cd storefront
npm install
npm run dev
```

The storefront will be available at http://localhost:3000

## 🌐 Access Points

Once everything is running, you can access:

- **Storefront**: http://localhost:3000 - Customer-facing online store
- **API Playground**: http://localhost:8000/graphql/ - GraphQL API explorer
- **Admin Dashboard**: http://localhost:9000 - Product and order management
- **MailHog**: http://localhost:8025 - Email testing interface

## 📚 Project Structure

```
open-saleor/
├── docker-compose.yml          # Docker services configuration
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # This file
└── storefront/                 # Next.js storefront application
    ├── src/
    │   ├── app/                # Next.js app directory
    │   │   ├── layout.tsx      # Root layout
    │   │   ├── page.tsx        # Homepage
    │   │   ├── products/       # Product pages
    │   │   ├── categories/     # Category pages
    │   │   └── cart/           # Shopping cart
    │   ├── components/         # React components
    │   │   ├── Header.tsx
    │   │   ├── Footer.tsx
    │   │   └── ProductCard.tsx
    │   ├── lib/                # Utilities and configurations
    │   │   ├── apollo-client.ts
    │   │   └── queries.ts
    │   └── types/              # TypeScript type definitions
    ├── package.json
    ├── tsconfig.json
    ├── next.config.js
    └── tailwind.config.js
```

## 🔧 Development

### Backend Development

The Saleor backend runs in Docker. To make changes:

1. **View logs**: `docker-compose logs -f api`
2. **Run migrations**: `docker-compose exec api python manage.py migrate`
3. **Access Django shell**: `docker-compose exec api python manage.py shell`
4. **Restart services**: `docker-compose restart`

### Storefront Development

```bash
cd storefront
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run type-check # Run TypeScript compiler
```

## 📝 API Usage

The Saleor API uses GraphQL. Here are some example queries:

### Get Products

```graphql
query GetProducts {
  products(first: 10, channel: "default-channel") {
    edges {
      node {
        id
        name
        description
        thumbnail {
          url
        }
        pricing {
          priceRange {
            start {
              gross {
                amount
                currency
              }
            }
          }
        }
      }
    }
  }
}
```

### Get Categories

```graphql
query GetCategories {
  categories(first: 10) {
    edges {
      node {
        id
        name
        slug
      }
    }
  }
}
```

Visit http://localhost:8000/graphql/ to explore the full API.

## 🚢 Deployment

### Production Considerations

1. **Environment Variables**: Update `.env` with production values
   - Generate a secure `SECRET_KEY`
   - Set `DEBUG=False`
   - Configure proper `ALLOWED_HOSTS`
   - Set up email service (replace MailHog)

2. **Database**: Use managed PostgreSQL for reliability
   - Update `DATABASE_URL` in `.env`

3. **Media Storage**: Configure AWS S3 or similar
   - Uncomment and set AWS variables in `.env`

4. **Domain and SSL**: 
   - Configure your domain name
   - Set up SSL certificates (Let's Encrypt recommended)

5. **Build Storefront**:
   ```bash
   cd storefront
   npm run build
   npm run start
   ```

### Docker Production Build

For production deployment, you may want to create optimized Docker images:

```bash
# Build storefront
cd storefront
docker build -t saleor-storefront .

# Use production docker-compose
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🛡️ Security

- Always use strong passwords
- Keep dependencies updated: `npm audit` and `docker-compose pull`
- Enable HTTPS in production
- Configure CORS properly
- Use environment variables for sensitive data
- Regularly backup your database

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Resources

- [Saleor Documentation](https://docs.saleor.io/)
- [Saleor GitHub](https://github.com/saleor/saleor)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Apollo Client](https://www.apollographql.com/docs/react/)

## 💬 Support

For issues and questions:
- Check the [Saleor Documentation](https://docs.saleor.io/)
- Visit [Saleor Discord](https://discord.gg/saleor)
- Open an issue on GitHub

## 🎉 Getting Started Checklist

- [ ] Clone the repository
- [ ] Copy `.env.example` to `.env`
- [ ] Start Docker services with `docker-compose up -d`
- [ ] Create admin user
- [ ] Populate sample data (optional)
- [ ] Install storefront dependencies
- [ ] Start storefront with `npm run dev`
- [ ] Access dashboard at http://localhost:9000
- [ ] Add products through dashboard
- [ ] Visit storefront at http://localhost:3000
- [ ] Start building your ecommerce empire! 🚀