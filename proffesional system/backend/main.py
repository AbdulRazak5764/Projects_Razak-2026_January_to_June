from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db import models, database
from app.api import ingestion, dashboard

# Create Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Automated Assessment System API", version="1.0.0")

# CORS Configuration
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingestion.router, prefix="/api/v1", tags=["Ingestion"])
app.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])

@app.get("/")
def read_root():
    return {"message": "System is running", "status": "active"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
