# Quick Start Guide

Get your Saleor ecommerce website up and running in 5 minutes!

## Prerequisites

✅ Docker and Docker Compose installed  
✅ Node.js 18+ and npm installed  
✅ 4GB RAM available  
✅ Port 3000, 8000, 9000 available  

## 🚀 Start in 5 Steps

### Step 1: Clone the Repository
```bash
git clone https://github.com/npsg02/open-saleor.git
cd open-saleor
```

### Step 2: Configure Environment
```bash
cp .env.example .env
# The defaults work fine for development
```

### Step 3: Start Backend Services
```bash
# Option A: Using the start script (recommended)
./start.sh

# Option B: Using make
make setup

# Option C: Using docker-compose directly
docker-compose up -d
```

Wait 30-60 seconds for services to start.

### Step 4: Create Admin User
```bash
docker-compose exec api python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### Step 5: Start the Storefront
```bash
cd storefront
npm install
npm run dev
```

## 🎉 You're Done!

Access your new ecommerce website:

- **Storefront**: http://localhost:3000 - Your online store
- **Dashboard**: http://localhost:9000 - Admin panel (use credentials from Step 4)
- **API Playground**: http://localhost:8000/graphql/ - Test GraphQL queries
- **MailHog**: http://localhost:8025 - View test emails

## 🛍️ Add Your First Product

1. Go to http://localhost:9000
2. Login with your admin credentials
3. Click "Catalog" → "Products"
4. Click "Add Product"
5. Fill in:
   - Product name
   - Description
   - Price
   - Upload an image
6. Click "Save"
7. Make sure product is "Published"
8. Visit http://localhost:3000 to see your product!

## 📝 Next Steps

### Populate Sample Data (Optional)
```bash
docker-compose exec api python manage.py populatedb
```

This adds sample products, categories, and more for testing.

### Customize Your Store

1. **Change Colors**: Edit `storefront/tailwind.config.js`
2. **Modify Homepage**: Edit `storefront/src/app/page.tsx`
3. **Update Store Name**: Edit `storefront/src/components/Header.tsx`
4. **Add Logo**: Add your logo to `storefront/public/`

### Configure Payment Gateway

For Stripe:
```bash
# Add to .env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
```

Then configure in Dashboard → Configuration → Plugins

### Set Up Email

For production email:
```bash
# Add to .env
EMAIL_URL=smtp://user:pass@smtp.example.com:587/?tls=True
DEFAULT_FROM_EMAIL=noreply@yourdomain.com
```

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Restart services
docker-compose restart

# Stop everything
docker-compose down

# Backup database
make backup-db

# Update Saleor
make update
```

## ❓ Need Help?

- **Documentation**: Check [README.md](README.md), [SETUP.md](SETUP.md), [FAQ.md](FAQ.md)
- **Issues**: Something not working? Check logs: `docker-compose logs -f`
- **Support**: Join [Saleor Discord](https://discord.gg/saleor)

## 🚨 Common Issues

### Port Already in Use
```bash
# Change ports in docker-compose.yml
services:
  api:
    ports:
      - "8001:8000"  # Change 8000 to 8001
```

### Services Not Starting
```bash
# Check status
docker-compose ps

# View logs
docker-compose logs api

# Restart
docker-compose restart
```

### Storefront Can't Connect
1. Verify API is running: `curl http://localhost:8000/graphql/`
2. Check `.env.local` in storefront folder
3. Make sure `NEXT_PUBLIC_API_URL=http://localhost:8000/graphql/`

## 🎓 Learn More

- **Saleor Docs**: https://docs.saleor.io/
- **GraphQL**: https://graphql.org/learn/
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/

## ✨ What You Get

✅ Complete ecommerce backend (Saleor)  
✅ Modern storefront (Next.js + React)  
✅ Admin dashboard  
✅ Product catalog  
✅ Shopping cart  
✅ GraphQL API  
✅ Database (PostgreSQL)  
✅ Caching (Redis)  
✅ Email testing (MailHog)  
✅ Production-ready setup  

## 🚀 Ready for Production?

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- SSL/HTTPS setup
- Cloud deployment guides
- Performance optimization
- Scaling strategies
- Security best practices

---

**Happy Selling!** 🛒🎉
