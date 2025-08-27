from fastapi import APIRouter

router = APIRouter(prefix="/health", tags=["health"])


@router.get("")
def health_check():
    """Health check endpoint."""
    return {
        "status": "ok",
        "engine": "fastapi",
        "version": "1.0.0"
    }


