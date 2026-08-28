# MarketSphere Multi-Vendor Platform Build System

.PHONY: all install build run test clean docker-up docker-down

all: install build test

install:
	@echo "Installing backend dependencies..."
	cd backend && python -m pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

build:
	@echo "Building frontend Next.js production bundle..."
	cd frontend && npm run build

run:
	@echo "Starting MarketSphere full stack in production mode..."
	python main.py

dev:
	@echo "Starting development daemons..."
	cd backend && uvicorn app.main:app --reload --port 8000 &
	cd frontend && npm run dev

test:
	@echo "Executing automated test suite..."
	cd backend && pytest tests/ -v

docker-up:
	docker-compose up --build -d

docker-down:
	docker-compose down -v

clean:
	rm -rf frontend/.next frontend/dist backend/__pycache__ backend/.pytest_cache
