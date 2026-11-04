
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    gemini_api_key: str
    groq_api_key: Optional[str] = None
    google_sheet_id: Optional[str] = None
    database_url: str = "sqlite:///./job_tracker.db"

    class Config:
        env_file = ".env"


settings = Settings()
