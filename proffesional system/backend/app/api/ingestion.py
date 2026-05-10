from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..db import database, models
from ..schemas import SubmissionCreate
from ..services import ocr, ai_engine
import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "data/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def process_pdf_background(submission_id: int, file_path: str, db: Session):
    # This function will call OCR and AI services
    submission = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if submission:
        try:
            # 1. OCR Extraction
            text = ocr.extract_text_from_pdf(file_path)
            submission.ocr_text = text
            submission.status = "processed"
            
            # 2. AI Evaluation
            evaluation_result = ai_engine.evaluate_submission(text)
            
            # 3. Create Evaluation Record
            evaluation = models.Evaluation(
                submission_id=submission.id,
                marks_awarded=evaluation_result["marks"],
                ai_feedback=evaluation_result["feedback"]
            )
            db.add(evaluation)
            submission.status = "evaluated"
            
            db.commit()
        except Exception as e:
            print(f"Error processing submission {submission_id}: {e}")
            submission.status = "error"
            db.commit()

@router.post("/submit/direct")
async def direct_submission(
    background_tasks: BackgroundTasks,
    full_name: str = Form(...),
    roll_number: str = Form(...),
    classroom: str = Form(...),
    section: str = Form(...),
    assessment_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(database.get_db)
):
    # 1. Create Student if not exists
    student = db.query(models.Student).filter(models.Student.roll_number == roll_number).first()
    if not student:
        student = models.Student(
            full_name=full_name,
            roll_number=roll_number,
            classroom=classroom,
            section=section
        )
        db.add(student)
        db.commit()
        db.refresh(student)

    # 2. Save File
    file_ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 3. Create Submission Record
    submission = models.Submission(
        student_id=student.id,
        assessment_id=assessment_id,
        file_path=file_path,
        status="received"
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    # 4. Trigger Background Processing
    background_tasks.add_task(process_pdf_background, submission.id, file_path, db)

    return {"status": "success", "submission_id": submission.id}
