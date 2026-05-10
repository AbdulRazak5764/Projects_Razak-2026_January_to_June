import pytesseract
from pdf2image import convert_from_path
import os
import logging

logger = logging.getLogger(__name__)

# Configure Tesseract Path if needed (Windows often needs explicit path)
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts text from a PDF file using OCR.
    """
    try:
        # Convert PDF to images
        images = convert_from_path(file_path, poppler_path=None) # Ensure poppler is in PATH or specify here
        
        extracted_text = ""
        for i, image in enumerate(images):
            text = pytesseract.image_to_string(image)
            extracted_text += f"\n--- Page {i+1} ---\n{text}"
            
        return extracted_text
    except Exception as e:
        logger.error(f"OCR Failed: {e}")
        # Fallback for dev/demo if tools aren't installed
        return f"[MOCK OCR OUTPUT] content of {os.path.basename(file_path)}. \n(Real OCR failed: Ensure Poppler and Tesseract are installed)."
