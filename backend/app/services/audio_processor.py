from fastapi import WebSocket, WebSocketDisconnect
from backend.app.services.speech import SpeechRecognizer


async def processing_data(event, ws: WebSocket, stop_flag: bool):
    if stop_flag:
        return True
    try:
        if "text" in event:
            await ws.send_text(" ".join(event["text"]))
        elif "error" in event:
            await ws.send_text(f"Ошибка: {event['error']}")
    except (WebSocketDisconnect, RuntimeError):
        print("Попытка отправки на закрытый WebSocket")
        return True
    return False



class AudioProcessor:
    def __init__(self, recognizer: SpeechRecognizer):
        self.recognizer = recognizer
        self._stop = False

    async def handle_ws_audio(self, ws: WebSocket):
        await ws.accept()
        try:
            async for event in self.recognizer.recognize_streaming_ws(ws):
                stop = await processing_data(event, ws, self._stop)
                if stop:
                    break
        except WebSocketDisconnect:
            print("Клиент отключился")
        finally:
            try:
                if not self._stop:
                    await ws.close()
            except RuntimeError:
                print("WebSocket уже закрыт")

    def stop(self):
        self._stop = True

