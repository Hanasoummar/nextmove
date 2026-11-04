from sqlalchemy import Column, Integer, String, Date, Text, DateTime, func, JSON
from ..database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    position = Column(String, nullable=False)
    location = Column(String, nullable=True)
    employment_type = Column(String, nullable=True)
    experience_required = Column(String, nullable=True)
    required_skills = Column(JSON, default=list, nullable=False)
    job_url = Column(String, nullable=True)
    source = Column(String, nullable=True)
    status = Column(String, default="Applied")
    application_date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, server_default=func.now())