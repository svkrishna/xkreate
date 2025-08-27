.PHONY: run test lint migrate alembic-rev clean

# Development server
run:
	uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run tests
test:
	pytest -v --cov=app --cov-report=term-missing

# Run tests with coverage report
test-cov:
	pytest --cov=app --cov-report=html

# Lint code
lint:
	black app tests
	isort app tests
	flake8 app tests

# Format code only
format:
	black app tests
	isort app tests

# Database migrations
migrate:
	alembic upgrade head

# Create new migration
alembic-rev:
	alembic revision --autogenerate -m "$(message)"

# Clean up
clean:
	find . -type f -name "*.pyc" -delete
	find . -type d -name "__pycache__" -delete
	rm -rf .pytest_cache
	rm -rf htmlcov
