import json

from fastapi import APIRouter
from openai import OpenAI
from pydantic import BaseModel

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
        "Ты часть системы по помощи в технических интервью."
        "Ты получаешь фрагменты распознанного текста, который может быть частичным, неполным или прерывистым."
        "Твоя задача - определить, есть ли в этом тексте вопрос, связанный с разработкой по Python или JavaScript"
        "и переформулировать этот вопрос для дальнейшей обработки, поиска в интернет-ресурсах и базах знаний.\n"
        "Всегда отвечай только на русском языке, используя правильные термины и в ответ высылай только строкой переформулированного вопроса, без кавычек и пояснений."
        "Никогда не отвечай на технический вопрос как таковой, а только переформулируй его.\n"
        "Если технического вопроса нет, или он не релевантен к Python или JavaScript просто ответь пустой строкой вот так: ''."
        "Примеры: \n"
        "input: 'что ты знаешь про двоичный поиск в Python?'"
        "output: 'Как реализовать алгоритм двоичного поиска на Python?'"
        "input: 'а вчера в больнице было холодно?'"
        "output: ''"
        "input: 'Го рутины как способствуют конкурентности и распределенным вычислениям?'"
        "output: ''"
        "input: 'расскажи про типизацию пропсов в функциональном компоненте'"
        "output: 'Как типизировать пропсы в функциональном компоненте React на TypeScript?'"
    )
    data = call_openai(prompt, request.text)
    return {"question": data}

@router.post("/questions/answer_questions")
async def get_answer(request: QuestionRequest):
    prompt = (
        "Примеры:\n"
        "input: 'Как реализовать алгоритм двоичного поиска на Python?'\n"
        "output: 'Искомый элемент ищется делением отсортированного массива пополам до нахождения или исчерпания диапазона.'\n"
        "```python\n"
        "def binary_search(arr, target):\n"
        "    left, right = 0, len(arr) - 1\n"
        "    while left <= right:\n"
        "        mid = (left + right) // 2\n"
        "        if arr[mid] == target:\n"
        "            return mid\n"
        "        if arr[mid] < target:\n"
        "            left = mid + 1\n"
        "        else:\n"
        "            right = mid - 1\n"
        "    return -1\n"
        "```\n"
        "\n"
        "input: 'Как типизировать пропсы в функциональном компоненте React на TypeScript?'\n"
        "output: 'Используется type или interface для описания пропсов и передача их как generic в React.FC.'\n"
        "```ts\n"
        "type MyComponentProps = {\n"
        "    title: string;\n"
        "    count?: number; // необязательный проп\n"
        "};\n"
        "\n"
        "const MyComponent: React.FC<MyComponentProps> = ({ title, count }) => {\n"
        "    return (\n"
        "        <div>\n"
        "            <h1>{title}</h1>\n"
        "            {count && <p>{count}</p>}\n"
        "        </div>\n"
        "    );\n"
        "};\n"
        "```\n"
    )
    data = call_openai(prompt, request.text)
    return {"answer": data}
