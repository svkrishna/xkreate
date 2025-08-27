# Creative Portal

A production-ready, minimal-viable "Creative Portal" with a Next.js (App Router) frontend and a FastAPI backend, suitable for future iterations (multi-tenant, presets management, batch, AI add-ons).

## Monorepo Structure

```
xkreate/
├── console/        # Next.js 14+, TypeScript, Tailwind, shadcn/ui
├── engine/         # FastAPI, Python 3.11, SQLAlchemy, Alembic
├── infra/          # docker-compose for local dev, env samples
└── README.md
```

## Quick Start

1. **Setup Environment Files**
   ```bash
   cp engine/.env.example engine/.env
   cp console/.env.local.example console/.env.local
   ```

2. **Launch the Application**
   ```bash
   docker compose up --build
   ```

3. **Access the Application**
   - Console (Frontend): http://localhost:3000
   - Engine (API): http://localhost:8000/docs
   - Database: PostgreSQL on localhost:5432

## Features (Iteration 1)

### Authentication
- JWT-based authentication with email/password
- Routes: `/auth/register`, `/auth/login`, `/auth/refresh`, `/me`
- Password hashing with bcrypt

### Presets
- Social media presets (Instagram, Facebook, X, YouTube, etc.)
- IAB Display and Video Companion presets
- Standard and Video Player presets
- Read-only preset gallery with search/filter

### Image Transform
- Client-side image processing using Canvas/OffscreenCanvas
- Server-side fallback for large files and special formats
- Support for resize, compress, format conversion
- Multiple fit modes: cover, contain, stretch

### Jobs
- Simple job processing for batch operations
- Synchronous processing (Celery/Redis planned for Iteration 2)
- Job status tracking and result URLs

## Development

### Backend (Engine)
```bash
cd engine
# Install dependencies
pip install -r requirements.txt

# Run migrations
make migrate

# Start development server
make run

# Run tests
make test

# Lint code
make lint
```

### Frontend (Console)
```bash
cd console
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:e2e
```

### Database
```bash
# Create initial migration
cd engine
make alembic-rev

# Apply migrations
make migrate

# Seed initial user (optional)
python -c "from app.database import seed_user; seed_user()"
```

## API Documentation

Once the engine is running, visit http://localhost:8000/docs for interactive API documentation.

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- File upload validation (magic bytes)
- Size and megapixel limits
- Metadata stripping by default
- Signed asset URLs with HMAC

## Tech Stack

### Backend
- FastAPI + Uvicorn
- Python 3.11
- SQLAlchemy 2.x + Alembic
- PostgreSQL
- Pillow for image processing
- PyJWT for authentication
- bcrypt for password hashing

### Frontend
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui components
- React Query (TanStack Query)
- Playwright for E2E testing

### Infrastructure
- Docker Compose
- PostgreSQL 15
- Local file storage

## Future Iterations

- Multi-tenant architecture
- Advanced presets management
- Batch processing with ZIP export
- AI-powered features
- S3 storage integration
- Celery/Redis for async job processing
- HEIC and CMYK support


