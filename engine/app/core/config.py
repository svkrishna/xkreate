from typing import List
from pydantic_settings import BaseSettings
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:postgres@localhost:5432/creative_portal"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7
    
    # File Upload
    max_file_size: int = 26214400  # 25MB in bytes
    max_megapixels: int = 60
    upload_dir: str = "storage"
    asset_secret: str = "your-asset-secret-key-here"
    
    # Logging
    log_level: str = "INFO"
    
    # CORS - ignored field to prevent validation errors
    allowed_origins: str = "http://localhost:3000"
    
    @property
    def cors_origins(self) -> List[str]:
        return ["http://localhost:3000"]
    
    model_config = {
        "env_file": ".env",
        "case_sensitive": False,
        "extra": "ignore"
    }


settings = Settings()
