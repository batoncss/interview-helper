import yandex.cloud.ai.stt.v3.stt_pb2 as stt_pb2
from starlette.websockets import WebSocket

async def audio_generator(ws: WebSocket, rate: int, channels: int):
    options = stt_pb2.StreamingOptions(
        recognition_model=stt_pb2.RecognitionModelOptions(
            audio_format=stt_pb2.AudioFormatOptions(
                raw_audio=stt_pb2.RawAudio(
                    audio_encoding=stt_pb2.RawAudio.LINEAR16_PCM,
                    sample_rate_hertz=rate,
                    audio_channel_count=channels
                )
            ),
            text_normalization=stt_pb2.TextNormalizationOptions(
                text_normalization=stt_pb2.TextNormalizationOptions.TEXT_NORMALIZATION_ENABLED,
                profanity_filter=True,
                literature_text=False
            ),
            language_restriction=stt_pb2.LanguageRestrictionOptions(
                restriction_type=stt_pb2.LanguageRestrictionOptions.WHITELIST,
                language_code=['ru-RU']
            ),
            audio_processing_type=stt_pb2.RecognitionModelOptions.REAL_TIME,
        )
    )
    yield stt_pb2.StreamingRequest(session_options=options)

    while True:
        try:
            chunk = await ws.receive_bytes()
            if not chunk:
                break
            yield stt_pb2.StreamingRequest(chunk=stt_pb2.AudioChunk(data=chunk))
        except Exception:
            break
