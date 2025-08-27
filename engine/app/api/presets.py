from fastapi import APIRouter
from app.services.presets import preset_service
from app.schemas.presets import PresetsResponse

router = APIRouter(prefix="/presets", tags=["presets"])


@router.get("", response_model=PresetsResponse)
def get_presets():
    """Get all presets grouped by platform."""
    return preset_service.get_all_presets()


