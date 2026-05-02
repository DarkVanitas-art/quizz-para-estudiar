import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env
load_dotenv()

SYSTEM_PROMPT = """You are a rigorous and expert university professor. You will be provided with the content of a study document.
Your task is to generate a multiple-choice quiz with a MINIMUM of 40 questions and a MAXIMUM of 60 questions based EXCLUSIVELY on the relevant information from the provided document.

CRITICAL LANGUAGE RULE: 
You MUST analyze the language of the provided document. The ENTIRE generated quiz (questions, options, correct answer, and explanation) MUST BE WRITTEN IN THE EXACT SAME LANGUAGE AS THE ORIGINAL DOCUMENT. 
If the document is in English, you MUST generate the quiz in English. Do NOT translate it to Spanish.

Strict mathematical rules:
1. Extract the most important points and generate clear questions.
2. Each question must have EXACTLY 4 response options.
3. Only one option must be correct.
4. Your response must be EXCLUSIVELY a structured JSON object (no markdown, no backticks). The JSON keys must remain exactly as shown below, but the values must be in the document's original language:

{
  "questions": [
    {
      "pregunta": "Your question text here (in the document's language)...",
      "opciones": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "respuesta_correcta": "The EXACT text of the correct option",
      "explicacion": "A very brief explanation of why it is correct (in the document's language)"
    }
  ]
}
"""

def generate_quiz(document_text: str, is_retry: bool = False) -> dict:
    # Forzar recarga por si se modificó .env con el server prendido
    load_dotenv()
    API_KEY = os.environ.get("GEMINI_API_KEY")
    
    if not API_KEY or "tu_clave" in API_KEY.lower():
        raise ValueError("La API Key de Gemini no está configurada o dejaste el texto de placeholder. Corregí el archivo .env.")

    genai.configure(api_key=API_KEY)

    target_prompt = SYSTEM_PROMPT
    if is_retry:
        target_prompt += "\n\nATENCIÓN: EL USUARIO ESTÁ REPITIENDO EL TEMA POR HABER REPROBADO. Genera preguntas TOTALMENTE DIFERENTES o sobre detalles que no hayas preguntado antes para evitar que memorice respuestas de tests anteriores."

    # Usamos gemini-1.5-flash recomendada para JSON strict y ventanas inmensas
    model = genai.GenerativeModel(
        model_name="gemini-3.1-flash-lite-preview",
        system_instruction=target_prompt,
        generation_config={
            "response_mime_type": "application/json",
            "temperature": 0.6,
        }
    )
    
    try:
        response = model.generate_content(f"CONTENIDO DEL DOCUMENTO:\n{document_text}")
        result_json = json.loads(response.text)
        return result_json
    except Exception as e:
        print(f"Error parseando el JSON de Gemini. Posible timeout o error de token: {e}")
        return {"error": str(e)}
