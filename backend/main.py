from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from backend.document_parser import parse_document
from backend.agent import generate_quiz

app = FastAPI(title="Estudio AI Quizz Agent")

# Configurar variables estáticas
base_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(base_dir)
frontend_dir = os.path.join(parent_dir, 'frontend')
uploads_dir = os.path.join(parent_dir, 'uploads')

os.makedirs(uploads_dir, exist_ok=True)
os.makedirs(frontend_dir, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...), retry: bool = Form(False)):
    if not file.filename.endswith(('.pdf', '.txt', '.md', '.ppt', '.pptx')):
        raise HTTPException(status_code=400, detail="Formato no soportado. Sólo PDF, TXT, MD o Powerpoint.")
    
    file_path = os.path.join(uploads_dir, file.filename)
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
        
    extracted_text = parse_document(file_path)
    if not extracted_text:
        raise HTTPException(status_code=422, detail="El documento está vacío o no se pudo leer el texto.")
        
    try:
        quiz_data = generate_quiz(extracted_text, is_retry=retry)
        if "error" in quiz_data:
            raise HTTPException(status_code=500, detail=quiz_data["error"])
            
        return {"message": "Quizz generado existosamente", "data": quiz_data["questions"]}
    except ValueError as e:
        raise HTTPException(status_code=501, detail=str(e))

app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
