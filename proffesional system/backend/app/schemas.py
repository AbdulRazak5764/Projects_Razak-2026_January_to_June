from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class StudentBase(BaseModel):
    full_name: str
    roll_number: str
    classroom: str
    section: str

class AssessmentBase(BaseModel):
    title: str
    total_marks: float

class SubmissionCreate(BaseModel):
    student: StudentBase
    assessment_id: int
    file_url: Optional[str] = None # For Google Forms
    
class FormPayload(BaseModel):
    """
    Schema representing the JSON structure sent by Google Forms App Script
    """
    form_id: str
    response_id: str
    timestamp: str
    answers: dict  # Dynamic keys based on form

class EvaluationUpdate(BaseModel):
    marks_awarded: float
    faculty_comments: Optional[str] = None
    is_finalized: bool = False
