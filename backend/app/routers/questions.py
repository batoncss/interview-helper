from fastapi import APIRouter
from pydantic import BaseModel
import json
from openai import OpenAI
from backend.app.core.config import API_KEY_OPENAI

router = APIRouter()
client = OpenAI(api_key=API_KEY_OPENAI)

class QuestionRequest(BaseModel):
    text: str

@router.post("/questions/recognized_questions")
async def get_questions(request: QuestionRequest):
    text = request.text
    prompt = "Ты получишь фрагменты распознанного текста. В них могут содержаться вопросы для собеседований Python или JavaScript.Твоя задача: найти все такие вопросы, привести их к корректной формулировке и вернуть JSON-массив строк без пояснений и обёрток."
    response = client.responses.create(
        model="gpt-4o-mini",
        instructions=prompt,
        input=text,
    )
    data = json.loads(response.model_dump_json())['output'][0]['content'][0]['text']
    return data