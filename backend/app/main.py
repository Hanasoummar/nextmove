from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import extract, applications
from .database import engine, Base
from .models import application 

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Job Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(extract.router)
app.include_router(applications.router)

@app.get("/api/health")
def health():
    return {"status": "ok"}