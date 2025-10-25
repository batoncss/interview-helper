export class AudioProcessor {
  private audioCtx: AudioContext | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;
  private workletNode: AudioWorkletNode | null = null;

  // Безопасный доступ к sampleRate
  get sampleRate() {
    return this.audioCtx?.sampleRate ?? 48000;
  }

  async start(onAudio: (buffer: Float32Array) => void) {
    if (this.audioCtx) {
      console.warn("AudioProcessor уже запущен");
      return;
    }

    try {
      // 1. Получаем доступ к микрофону
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Создаём контекст
      this.audioCtx = new AudioContext();

      // 3. Загружаем модуль аудио-ворклета
      await this.audioCtx.audioWorklet.addModule("/processor.js");

      // 4. Создаём источник и ворклет
      this.source = this.audioCtx.createMediaStreamSource(this.stream);
      this.workletNode = new AudioWorkletNode(this.audioCtx, "audio-processor");

      // 5. Подписка на данные
      this.workletNode.port.onmessage = (e) => {
        const data = e.data;
        if (data instanceof Float32Array) {
          onAudio(data);
        }
      };

      // 6. Подключаем цепочку
      this.source.connect(this.workletNode);
      // Не обязательно подключать к destination — можно исключить вывод звука в динамики:
      // this.workletNode.connect(this.audioCtx.destination);
    } catch (err) {
      console.error("Ошибка при инициализации аудио:", err);
      await this.stop();
      throw err;
    }
  }

  async stop() {
    try {
      this.workletNode?.disconnect();
      this.source?.disconnect();

      if (this.audioCtx && this.audioCtx.state !== "closed") {
        await this.audioCtx.close();
      }

      this.stream?.getTracks().forEach((t) => t.stop());
    } catch (err) {
      console.warn("Ошибка при остановке аудио:", err);
    } finally {
      this.audioCtx = null;
      this.source = null;
      this.workletNode = null;
      this.stream = null;
    }
  }

  /**
   * Быстрое даунсемплирование (48000 -> 16000)
   */
  static downsample(buffer: Float32Array, inRate: number, outRate: number) {
    if (inRate === outRate) return buffer;
    const ratio = inRate / outRate;
    const newLength = Math.floor(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }
    return result;
  }

  /**
   * Преобразование float → 16-bit PCM (Little Endian)
   */
  static floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buffer;
  }
}
