from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class JobItemRequest(BaseModel):
    source: str  # 'upload' or 'url'
    file: Optional[str] = None  # filename if source is 'upload'
    url: Optional[str] = None  # URL if source is 'url'
    preset_key: str
    fmt: Optional[str] = None  # jpeg, png, webp, avif
    quality: Optional[int] = None  # 5-100


class JobCreate(BaseModel):
    items: List[JobItemRequest]


class JobItemResult(BaseModel):
    filename: str
    url: str


class JobResponse(BaseModel):
    id: str
    status: str
    results: Optional[List[JobItemResult]] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


