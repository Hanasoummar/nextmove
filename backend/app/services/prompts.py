
EXTRACTION_PROMPT = """You are a job description data extractor.
Analyze the text below and return ONLY a valid JSON object
(without Markdown or explanations) containing exactly these keys:

- "company": company name (string)
- "position": job title (string)
- "location": city/country (string or null)
- "employment_type": e.g. "Full-time", "Internship", "Permanent" (string or null)
- "experience_required": e.g. "2-3 years" (string or null)
- "required_skills": list of required skills (array of strings)
- "job_url": URL if present in the text (string or null)
- "source": platform if identifiable, e.g. "LinkedIn", "Indeed" (string or null)

Job description text:
{text}
"""
