export class AudioProcessor {
  public audioCtx: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private stream: MediaStream | null = null;

  async start(onAudio: (buffer: Float32Array) => void) {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioCtx = new AudioContext();
    this.source = this.audioCtx.createMediaStreamSource(this.stream);
    this.processor = this.audioCtx.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event) =>
      onAudio(event.inputBuffer.getChannelData(0));

    this.source.connect(this.processor);
    this.processor.connect(this.audioCtx.destination);
  }

  async stop() {
    try {
      this.processor?.disconnect();
      this.source?.disconnect();

      if (this.audioCtx && this.audioCtx.state !== "closed") {
        await this.audioCtx.close();
      }
      this.audioCtx = null;

      this.stream?.getTracks().forEach((t) => t.stop());
      this.stream = null;
    } catch (err) {
      console.warn("Ошибка при остановке AudioContext:", err);
    }
  }

  static downsample(buffer: Float32Array, inRate: number, outRate: number) {
    if (inRate === outRate) return buffer;
    const ratio = inRate / outRate;
    return Float32Array.from(
      { length: Math.floor(buffer.length / ratio) },
      (_, i) => buffer[Math.floor(i * ratio)],
    );
  }

  static floatTo16BitPCM(float32Array: Float32Array) {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    float32Array.forEach((v, i) => {
      const s = Math.max(-1, Math.min(1, v));
      view.setInt16(i * 2, s * 0x7fff, true);
    });
    return buffer;
  }
}
