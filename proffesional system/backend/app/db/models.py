from sqlalchemy import Column, Integer, String, ForeignKey, Text, Float, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True)
    roll_number = Column(String, unique=True, index=True)
    classroom = Column(String) # 'class' is reserved keyword
    section = Column(String)
    
    submissions = relationship("Submission", back_populates="student")

class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    total_marks = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    submissions = relationship("Submission", back_populates="assessment")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    assessment_id = Column(Integer, ForeignKey("assessments.id"))
    file_path = Column(String)
    ocr_text = Column(Text, nullable=True)
    status = Column(String, default="pending") # pending, processed, evaluated
    submitted_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="submissions")
    assessment = relationship("Assessment", back_populates="submissions")
    evaluation = relationship("Evaluation", back_populates="submission", uselist=False)

class Evaluation(Base):
    __tablename__ = "evaluations"

    id = Column(Integer, primary_key=True, index=True)
    submission_id = Column(Integer, ForeignKey("submissions.id"))
    marks_awarded = Column(Float)
    ai_feedback = Column(Text)
    faculty_comments = Column(Text, nullable=True)
    is_finalized = Column(Integer, default=0) # 0=Draft, 1=Final
    created_at = Column(DateTime, default=datetime.utcnow)

    submission = relationship("Submission", back_populates="evaluation")
