import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=1)

async def async_recognize(service, audio_gen):
    loop = asyncio.get_event_loop()
    for result in await loop.run_in_executor(executor, lambda: list(service.recognize_streaming(audio_gen))):
        yield result
