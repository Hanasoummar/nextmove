from fastapi import APIRouter, UploadFile
from ...schemas.extraction import ExtractRequest
from ...services.extractor import extract_job

router = APIRouter(prefix="/api/extract", tags=["extract"])

@router.post("")
def extract(req: ExtractRequest):
    return extract_job(req.text)

@router.post("/pdf")
async def extract_pdf(file: UploadFile):
    from pypdf import PdfReader
    import io
    reader = PdfReader(io.BytesIO(await file.read()))
    text = "\n".join(page.extract_text() for page in reader.pages)
    return extract_job(text)