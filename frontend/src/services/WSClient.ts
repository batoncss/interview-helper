export class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (msg: string) => void;

  constructor(url: string, onMessage: (msg: string) => void) {
    this.url = url;
    this.onMessage = onMessage;
  }

  connect() {
    if (this.ws) return;
    this.ws = new WebSocket(this.url);
    this.ws.onmessage = (e: MessageEvent) => this.onMessage(e.data);
    this.ws.onclose = () => {
      this.ws = null;
    };
  }

  send(data: ArrayBuffer) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(data);
  }

  close() {
    this.ws?.close();
    this.ws = null;
  }
}
