import json
from ..schemas.extraction import ExtractedJob
from .llm_client import call_llm
from .prompts import EXTRACTION_PROMPT

def extract_job(text: str) -> ExtractedJob:
    raw = call_llm(EXTRACTION_PROMPT.format(text=text))
    data = json.loads(raw)
    return ExtractedJob(**data)