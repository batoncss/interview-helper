import grpc
import logging
from typing import AsyncIterable
import yandex.cloud.ai.stt.v3.stt_service_pb2_grpc as stt_service_pb2_grpc
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

    async def recognize_streaming(self, audio_stream: AsyncIterable[bytes]):
        try:
            async for r in self.stub.RecognizeStreaming(
                audio_stream,
                metadata=(('authorization', f'Bearer {self.api_key}'),)
            ):
                event_type = r.WhichOneof('Event')
                if not event_type:
                    continue

                event_field = getattr(r, event_type)
                text = None

                if hasattr(event_field, "alternatives") and event_field.alternatives:
                    text = event_field.alternatives[0].text or None
                elif hasattr(event_field, "normalized_text") and event_field.normalized_text.alternatives:
                    text = event_field.normalized_text.alternatives[0].text or None

                if text:
                    yield {'event_type': event_type, 'text': [text]}

        except grpc.aio.AioRpcError as err:
            logging.error(f"gRPC error: {err.code()} - {err.details()}")
            yield {"error": f"gRPC error: {err.code()}, details: {err.details()}"}
