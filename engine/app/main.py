import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.core.config import settings
from app.api import auth, presets, transform, jobs, health

# Create FastAPI app
app = FastAPI(
    title="Creative Portal API",
    description="A production-ready image processing API for creative workflows",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(auth.router)
app.include_router(presets.router)
app.include_router(transform.router)
app.include_router(jobs.router)
app.include_router(health.router)

# Mount static files for assets
if os.path.exists(settings.upload_dir):
    app.mount("/assets", StaticFiles(directory=settings.upload_dir), name="assets")

@app.get("/")
def root():
    """Root endpoint."""
    return {
        "message": "Creative Portal API",
        "version": "1.0.0",
        "docs": "/docs"
    }
