import random

def evaluate_submission(extracted_text: str, rubric_keywords: list = None) -> dict:
    """
    Evaluates the submission text against a model answer/rubric.
    Returns marks and feedback.
    """
    if not rubric_keywords:
        rubric_keywords = ["concept", "logic", "explanation", "example"]
        
    score = 0
    total_score = 100
    found_keywords = []
    
    # Mock Logic: Check for keywords
    text_lower = extracted_text.lower()
    match_count = 0
    
    for word in rubric_keywords:
        if word in text_lower:
            match_count += 1
            found_keywords.append(word)
            
    # Simple formula
    if "MOCK OCR OUTPUT" in extracted_text:
        feedback = "OCR failed, could not evaluate properly. Please upload a clear PDF."
        score = 0
    else:
        # Simulate intelligent scoring
        base_score = 40
        keyword_bonus = match_count * 10
        length_bonus = len(extracted_text) // 50
        score = min(total_score, base_score + keyword_bonus + length_bonus)
        feedback = f"Good attempt. Found key concepts: {', '.join(found_keywords)}. Structuring could be improved."

    return {
        "marks": score,
        "feedback": feedback,
        "is_final": False
    }
