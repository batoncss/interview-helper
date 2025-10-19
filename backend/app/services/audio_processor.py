from fastapi import WebSocket, WebSocketDisconnect
from backend.app.services.speech import SpeechRecognizer


async def processing_data(event, ws: WebSocket, stop_flag: bool):
    if stop_flag:
        return True
    try:
        await ws.send_json(event)
    except (WebSocketDisconnect, RuntimeError):
        print("Попытка отправки на закрытый WebSocket")
        return True
    return False



from backend.app.services.speech import SpeechRecognizer

class AudioProcessor:
    def __init__(self, recognizer: SpeechRecognizer):
        self.recognizer = recognizer

    async def process_stream(self, audio_stream):
        """
        Принимает асинхронный генератор байт (например, от WebSocket),
        и возвращает асинхронный генератор событий распознавания.
        """
        async for event in self.recognizer.recognize_streaming(audio_stream):
            yield event