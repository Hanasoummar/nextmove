
import time
from google import genai
from google.genai import types
from google.genai.errors import APIError as GeminiError
from ..config import settings

gemini_client = genai.Client(api_key=settings.gemini_api_key)

groq_client = None
if settings.groq_api_key:
    from groq import Groq
    groq_client = Groq(api_key=settings.groq_api_key)

GEMINI_MODELS = ["gemini-3.8-flash", "gemini-2.5-flash"]
GROQ_MODELS = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"]

GEMINI_TIMEOUT = 30
GROQ_TIMEOUT = 30


def _try_gemini(model: str, prompt: str) -> str:
    response = gemini_client.models.generate_content(
        model=model,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
        http_options={"timeout": GEMINI_TIMEOUT * 1000},
    )
    return response.text


def _try_groq(model: str, prompt: str) -> str:
    response = groq_client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        response_format={"type": "json_object"},
        timeout=GROQ_TIMEOUT,
    )
    return response.choices[0].message.content


def call_llm(prompt: str) -> str:
    start = time.time()
    last_error = None

    for model in GEMINI_MODELS:
        try:
            print(f"[llm] Trying Gemini: {model}...")
            result = _try_gemini(model, prompt)
            print(f"[llm] Success in {time.time() - start:.1f}s ({model})")
            return result
        except Exception as e:
            last_error = e
            print(
                f"[llm] {model} failed ({type(e).__name__}), "
                f"{time.time() - start:.1f}s elapsed"
            )

   
    if groq_client:
        print(f"[llm] Switching to Groq fallback after {time.time() - start:.1f}s")

        for model in GROQ_MODELS:
            try:
                print(f"[llm] Trying Groq: {model}...")
                result = _try_groq(model, prompt)
                print(f"[llm] Success in {time.time() - start:.1f}s ({model})")
                return result
            except Exception as e:
                last_error = e
                print(f"[llm] {model} failed: {e}")

    raise last_error
