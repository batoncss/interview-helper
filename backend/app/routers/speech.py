from fastapi import APIRouter, WebSocket

from backend.app.services.audio_stream import audio_generator
from backend.app.services.speech import SpeechRecognizer
from backend.app.services.audio_processor import AudioProcessor
from backend.app.core.config import API_KEY_YANDEX

router = APIRouter()

recognizer = SpeechRecognizer(api_key=API_KEY_YANDEX)
processor = AudioProcessor(recognizer=recognizer)

@router.websocket("/ws")
async def websocket_audio(ws: WebSocket):
    await ws.accept()
    audio_stream = audio_generator(ws, rate=16000, channels=1)

    async for event in recognizer.recognize_streaming(audio_stream):
        await ws.send_json(event)
