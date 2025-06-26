from fastapi import FastAPI, BackgroundTasks, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from pydantic import BaseModel
from typing import Annotated
from app.models import Base  
from app.db.sqlite import engine, SessionLocal
from app.api.routes_documents import router as documents_router


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(documents_router, prefix="/api/documents", tags=["documents"])

# Allow frontend dev server to talk to backend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Serve frontend in production
frontend_path = Path(__file__).parent.parent.parent / "frontend" / "dist"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
