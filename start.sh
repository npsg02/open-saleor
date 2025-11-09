#!/bin/bash

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}  Open Saleor Setup Script${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker from https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not installed${NC}"
    echo "Please install Docker Compose from https://docs.docker.com/compose/install/"
    exit 1
fi

# Check if .env exists, if not copy from example
if [ ! -f .env ]; then
    echo -e "${BLUE}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

# Start Docker services
echo ""
echo -e "${BLUE}Starting Docker services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo ""
echo -e "${BLUE}Waiting for services to be ready...${NC}"
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✓ Services are running${NC}"
else
    echo -e "${RED}✗ Some services failed to start${NC}"
    echo "Run 'docker-compose logs' to see details"
    exit 1
fi

# Check if we need to create superuser
echo ""
read -p "Do you want to create an admin user? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Creating admin user...${NC}"
    docker-compose exec api python manage.py createsuperuser
fi

# Ask about sample data
echo ""
read -p "Do you want to populate the database with sample data? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Populating database with sample data...${NC}"
    docker-compose exec api python manage.py populatedb
    echo -e "${GREEN}✓ Sample data added${NC}"
fi

# Setup storefront
echo ""
read -p "Do you want to set up the storefront? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd storefront
    
    if [ ! -d "node_modules" ]; then
        echo -e "${BLUE}Installing storefront dependencies...${NC}"
        npm install
    else
        echo -e "${GREEN}✓ Dependencies already installed${NC}"
    fi
    
    echo ""
    echo -e "${GREEN}Setup complete!${NC}"
    echo ""
    echo -e "${BLUE}You can now start the storefront with:${NC}"
    echo "  cd storefront && npm run dev"
fi

echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}  Setup Complete!${NC}"
echo -e "${GREEN}================================${NC}"
echo ""
echo -e "${BLUE}Access your services at:${NC}"
echo "  • Storefront: http://localhost:3000"
echo "  • API GraphQL: http://localhost:8000/graphql/"
echo "  • Admin Dashboard: http://localhost:9000"
echo "  • MailHog: http://localhost:8025"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo "  • View logs: docker-compose logs -f"
echo "  • Stop services: docker-compose down"
echo "  • Restart services: docker-compose restart"
echo ""
