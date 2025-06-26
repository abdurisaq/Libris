from fastapi import APIRouter, UploadFile, HTTPException, Depends
from sqlalchemy.orm import Session
from app.db.sqlite import get_db
from app.models.document import Document
import os

router = APIRouter()

UPLOAD_DIR = "./uploads"

@router.post("/upload/")
async def upload_document(file: UploadFile, db: Session = Depends(get_db)):
    print(f"Received file: {file.filename}, size: {file.size} bytes")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    document = Document(name=file.filename, path=file_path, size=os.path.getsize(file_path))
    db.add(document)
    db.commit()
    db.refresh(document)

    return {"message": "File uploaded successfully", "file_path": file_path}

@router.get("/")
async def get_documents(db: Session = Depends(get_db)):
    documents = db.query(Document).all()
    print(f"Documents retrieved from database: {documents}")
    return [{"id": doc.id, "name": doc.name, "path": doc.path, "size": doc.size} for doc in documents]

@router.delete("/{document_id}/")
async def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")

    if os.path.exists(document.path):
        os.remove(document.path)

    db.delete(document)
    db.commit()

    return {"message": "Document deleted successfully"}