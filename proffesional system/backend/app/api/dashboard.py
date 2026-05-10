from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ..db import database, models, models
from ..schemas import EvaluationUpdate
import pandas as pd
from io import BytesIO
from typing import List

router = APIRouter()

@router.get("/submissions")
def get_submissions(db: Session = Depends(database.get_db)):
    submissions = db.query(models.Submission).all()
    # Serialize for frontend
    results = []
    for sub in submissions:
        student_name = sub.student.full_name if sub.student else "Unknown"
        roll = sub.student.roll_number if sub.student else "N/A"
        marks = sub.evaluation.marks_awarded if sub.evaluation else None
        results.append({
            "id": sub.id,
            "student_name": student_name,
            "roll_number": roll,
            "status": sub.status,
            "submitted_at": sub.submitted_at,
            "marks": marks
        })
    return results

@router.get("/submissions/{submission_id}")
def get_submission_details(submission_id: int, db: Session = Depends(database.get_db)):
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    return {
        "id": sub.id,
        "file_path": sub.file_path,
        "ocr_text": sub.ocr_text,
        "status": sub.status,
        "evaluation": {
            "marks": sub.evaluation.marks_awarded if sub.evaluation else 0,
            "feedback": sub.evaluation.ai_feedback if sub.evaluation else "",
            "faculty_comments": sub.evaluation.faculty_comments if sub.evaluation else ""
        } if sub.evaluation else None
    }

@router.put("/submissions/{submission_id}/grade")
def update_grade(submission_id: int, update: EvaluationUpdate, db: Session = Depends(database.get_db)):
    sub = db.query(models.Submission).filter(models.Submission.id == submission_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    
    if not sub.evaluation:
        # Create if not exists (edge case)
        eval_obj = models.Evaluation(submission_id=sub.id, marks_awarded=update.marks_awarded)
        db.add(eval_obj)
    else:
        sub.evaluation.marks_awarded = update.marks_awarded
        sub.evaluation.faculty_comments = update.faculty_comments
        sub.evaluation.is_finalized = 1 if update.is_finalized else 0
        
    db.commit()
    return {"status": "updated"}

@router.get("/reports/excel")
def generate_excel_report(db: Session = Depends(database.get_db)):
    # Query data
    data = db.query(
        models.Student.full_name,
        models.Student.roll_number,
        models.Student.section,
        models.Evaluation.marks_awarded
    ).join(models.Submission, models.Submission.student_id == models.Student.id)\
     .join(models.Evaluation, models.Evaluation.submission_id == models.Submission.id).all()
    
    # Create DataFrame
    df = pd.DataFrame(data, columns=["Student Name", "Roll Number", "Section", "Marks"])
    
    # Create Excel
    output = BytesIO()
    with pd.ExcelWriter(output, engine='openpyxl') as writer:
        df.to_excel(writer, index=False, sheet_name='Assessment Report')
        
    output.seek(0)
    
    headers = {
        'Content-Disposition': 'attachment; filename="assessment_report.xlsx"'
    }
    return Response(content=output.getvalue(), media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', headers=headers)
