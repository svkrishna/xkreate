from sqlalchemy import Column, String, DateTime, Text, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database.base import Base
from app.core.security import generate_uuid


class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="queued", nullable=False)  # queued, processing, done, failed
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="jobs")
    items = relationship("JobItem", back_populates="job", cascade="all, delete-orphan")


class JobItem(Base):
    __tablename__ = "job_items"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"), nullable=False)
    src_path = Column(String(500), nullable=False)
    dst_path = Column(String(500), nullable=True)
    preset_key = Column(String(100), nullable=False)
    fmt = Column(String(10), nullable=True)  # jpeg, png, webp, avif
    params_json = Column(JSON, nullable=True)
    status = Column(String(50), default="pending", nullable=False)  # pending, processing, done, failed
    
    # Relationships
    job = relationship("Job", back_populates="items")


