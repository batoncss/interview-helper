import grpc
import logging
import yandex.cloud.ai.stt.v3.stt_service_pb2_grpc as stt_service_pb2_grpc
from starlette.websockets import WebSocket

from backend.app.services.audio_stream import audio_generator

logging.basicConfig(level=logging.DEBUG)

class SpeechRecognizer:
    def __init__(self, api_key: str, rate: int = 16000, channels: int = 1):
        self.api_key = api_key
        self.RATE = rate
        self.CHANNELS = channels
        self.cred = grpc.ssl_channel_credentials()
        self.channel = grpc.aio.secure_channel('stt.api.cloud.yandex.net:443', self.cred)
        self.stub = stt_service_pb2_grpc.RecognizerStub(self.channel)

    async def recognize_streaming_ws(self, ws: WebSocket):
        try:
            async for r in self.stub.RecognizeStreaming(
                audio_generator(ws, self.RATE, self.CHANNELS),
                metadata=(('authorization', f'Bearer {self.api_key}'),)
            ):
                event_type = r.WhichOneof('Event')
                text = None
                if event_type == 'partial' and r.partial.alternatives:
                    text = [a.text for a in r.partial.alternatives]
                elif event_type == 'final' and r.final.alternatives:
                    text = [a.text for a in r.final.alternatives]
                elif event_type == 'final_refinement' and r.final_refinement.normalized_text.alternatives:
                    text = [a.text for a in r.final_refinement.normalized_text.alternatives]

                if text:
                    yield {"type": event_type, "text": text}

        except grpc.aio.AioRpcError as err:
            yield {"error": f"gRPC error: {err.code()}, details: {err.details()}"}
