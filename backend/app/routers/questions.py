from fastapi import APIRouter
from pydantic import BaseModel
import json
from openai import OpenAI

from backend.app.config import API_KEY_OPENAI

router = APIRouter()
client = OpenAI(api_key=API_KEY_OPENAI)

class QuestionRequest(BaseModel):
    text: str

def call_openai(prompt: str, text: str) -> str:
    response = client.responses.create(
        model="gpt-4o-mini",
        instructions=prompt,
        input=text
    )
    resp_json = json.loads(response.model_dump_json())
    return resp_json.get("output", [{}])[0].get("content", [{}])[0].get("text", "")

@router.post("/questions/recognized_questions")
async def get_questions(request: QuestionRequest):
    prompt = (
        "Ты получишь фрагменты распознанного текста. В них может содержаться вопрос "
        "для собеседований Python или JavaScript. Твоя задача: найти такой вопрос, "
        "привести их к корректной формулировке и вернуть вопрос без пояснений и обёрток."
    )
    data = call_openai(prompt, request.text)
    return {"question": data}

@router.post("/questions/answer_questions")
async def get_answer(request: QuestionRequest):
    prompt = (
        "Тебе может быть передан вопрос по программированию. Ответь на него, если он есть. "
        "Постарайся ответить кратко. Попробуй привести пример, если он уместен. "
        "Если вопроса нет, то ничего не отвечай."
    )
    data = call_openai(prompt, request.text)
    return {"answer": data}
