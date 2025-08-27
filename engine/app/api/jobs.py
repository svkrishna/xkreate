import os
import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.models.user import User
from app.models.job import Job, JobItem
from app.schemas.jobs import JobCreate, JobResponse, JobItemRequest, JobItemResult
from app.api.deps import get_current_active_user
from app.services.presets import preset_service
from app.core.config import settings

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.post("", response_model=JobResponse)
async def create_job(
    job_data: JobCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new job for batch processing."""
    # Create job
    job = Job(user_id=current_user.id)
    db.add(job)
    db.commit()
    db.refresh(job)
    
    # Process items synchronously (for Iteration 1)
    results = []
    
    for item_data in job_data.items:
        try:
            # Validate preset
            preset = preset_service.get_preset_by_key(item_data.preset_key)
            
            # Create job item
            job_item = JobItem(
                job_id=job.id,
                src_path=f"temp_{uuid.uuid4()}",  # Placeholder for now
                preset_key=item_data.preset_key,
                fmt=item_data.fmt or "jpeg",
                params_json={
                    "quality": item_data.quality or 85,
                    "fit": "cover",
                    "bg_color": "#FFFFFF"
                },
                status="done"  # For now, mark as done immediately
            )
            db.add(job_item)
            
            # Create result URL (placeholder for now)
            result_filename = f"result_{uuid.uuid4()}.{job_item.fmt}"
            result = JobItemResult(
                filename=result_filename,
                url=f"/assets/{result_filename}"
            )
            results.append(result)
            
        except Exception as e:
            # Mark job as failed
            job.status = "failed"
            db.commit()
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to process job item: {str(e)}"
            )
    
    # Mark job as done
    job.status = "done"
    db.commit()
    
    return JobResponse(
        id=str(job.id),
        status=job.status,
        results=results,
        created_at=job.created_at,
        updated_at=job.updated_at
    )


@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get job status and results."""
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Build results from job items
    results = []
    for item in job.items:
        if item.status == "done" and item.dst_path:
            result = JobItemResult(
                filename=os.path.basename(item.dst_path),
                url=f"/assets/{os.path.basename(item.dst_path)}"
            )
            results.append(result)
    
    return JobResponse(
        id=str(job.id),
        status=job.status,
        results=results if results else None,
        created_at=job.created_at,
        updated_at=job.updated_at
    )


