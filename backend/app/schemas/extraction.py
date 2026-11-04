
from pydantic import BaseModel, Field
from typing import Optional, Literal
from datetime import date


# --------------------------------------------------
# APPLICATION STATUS
# --------------------------------------------------

ApplicationStatus = Literal[
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
    "Pending",
    "Withdrawn"
]


# --------------------------------------------------
# EXTRACTION SCHEMAS
# --------------------------------------------------

class ExtractRequest(BaseModel):
    text: str = Field(..., min_length=50)
    is_pdf_text: bool = False


class ExtractedJob(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_required: Optional[str] = None
    required_skills: list[str] = Field(default_factory=list)
    job_url: Optional[str] = None
    source: Optional[str] = None


# --------------------------------------------------
# APPLICATION SCHEMAS
# --------------------------------------------------

class ApplicationCreate(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_required: Optional[str] = None
    required_skills: list[str] = Field(default_factory=list)
    job_url: Optional[str] = None
    source: Optional[str] = None
    status: ApplicationStatus = "Applied"


class ApplicationStatusUpdate(BaseModel):
    status: ApplicationStatus


class ApplicationOut(ApplicationCreate):
    id: int
    application_date: date

    class Config:
        from_attributes = True
