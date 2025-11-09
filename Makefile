.PHONY: help start stop restart logs build clean install setup test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Available targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

start: ## Start all services
	docker-compose up -d
	@echo "Services started!"
	@echo "API: http://localhost:8000"
	@echo "Dashboard: http://localhost:9000"
	@echo "Storefront: cd storefront && npm run dev"

stop: ## Stop all services
	docker-compose down

restart: ## Restart all services
	docker-compose restart

logs: ## View logs from all services
	docker-compose logs -f

logs-api: ## View API logs
	docker-compose logs -f api

logs-worker: ## View worker logs
	docker-compose logs -f worker

build: ## Build all Docker images
	docker-compose build

clean: ## Remove all containers and volumes
	docker-compose down -v
	@echo "All containers and volumes removed"

install: ## Install storefront dependencies
	cd storefront && npm install

setup: ## Initial setup (first time use)
	@echo "Setting up Open Saleor..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "Created .env file"; \
	fi
	docker-compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 10
	@echo "Services are ready!"
	@echo ""
	@echo "Next steps:"
	@echo "1. Create admin user: make create-user"
	@echo "2. Populate sample data: make populate-db"
	@echo "3. Install storefront: make install"
	@echo "4. Start storefront: cd storefront && npm run dev"

create-user: ## Create a superuser
	docker-compose exec api python manage.py createsuperuser

populate-db: ## Populate database with sample data
	docker-compose exec api python manage.py populatedb

migrate: ## Run database migrations
	docker-compose exec api python manage.py migrate

shell: ## Open Django shell
	docker-compose exec api python manage.py shell

dbshell: ## Open database shell
	docker-compose exec db psql -U saleor saleor

backup-db: ## Backup database
	@echo "Backing up database..."
	docker-compose exec -T db pg_dump -U saleor saleor > backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Database backed up!"

restore-db: ## Restore database from backup (usage: make restore-db FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "Error: Please specify backup file. Usage: make restore-db FILE=backup.sql"; \
		exit 1; \
	fi
	docker-compose exec -T db psql -U saleor saleor < $(FILE)
	@echo "Database restored!"

update: ## Update Saleor to latest version
	docker-compose pull
	docker-compose up -d
	docker-compose exec api python manage.py migrate

test-storefront: ## Run storefront tests
	cd storefront && npm run lint && npm run type-check

dev-storefront: ## Start storefront in development mode
	cd storefront && npm run dev

build-storefront: ## Build storefront for production
	cd storefront && npm run build

ps: ## Show running services
	docker-compose ps

stats: ## Show resource usage
	docker stats
