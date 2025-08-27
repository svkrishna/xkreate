from fastapi import APIRouter, File, Form, HTTPException, status
from fastapi.responses import Response
from typing import Optional
from app.services.image import image_service

router = APIRouter(prefix="/transform", tags=["transform"])


@router.post("/resize")
async def resize_image(
    file: bytes = File(...),
    width: int = Form(...),
    height: int = Form(...),
    fmt: str = Form("jpeg"),
    quality: int = Form(85),
    fit: str = Form("cover"),
    bg_color: str = Form("#FFFFFF"),
    strip_metadata: bool = Form(True)
):
    """Resize and process image on the server."""
    try:
        # Validate image
        is_valid, error_message = image_service.validate_image(file, "uploaded_file")
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=error_message
            )
        
        # Process image
        processed_image = image_service.process_image(
            file_content=file,
            width=width,
            height=height,
            fmt=fmt,
            quality=quality,
            fit=fit,
            bg_color=bg_color,
            strip_metadata=strip_metadata
        )
        
        # Return processed image
        content_type = f"image/{fmt.lower()}"
        return Response(
            content=processed_image,
            media_type=content_type,
            headers={
                "Content-Disposition": f"attachment; filename=processed.{fmt.lower()}"
            }
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process image: {str(e)}"
        )


