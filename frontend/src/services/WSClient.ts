export class WSClient {
  private ws: WebSocket | null = null;
  private url: string;
  private onMessage: (msg: string) => void;

  /** Состояние соединения */
  public isOpen = false;

  constructor(url: string, onMessage: (msg: string) => void) {
    this.url = url;
    this.onMessage = onMessage;
  }

  /** Подключение к серверу */
  connect() {
    if (this.ws) return; // уже подключено

    console.log(`[WS] Попытка подключения к ${this.url}...`);

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.isOpen = true;
      console.log("[WS] Соединение открыто");
    };

    this.ws.onmessage = (e: MessageEvent) => {
      this.onMessage(e.data);
    };

    this.ws.onclose = (event: CloseEvent) => {
      this.isOpen = false;
      console.log(
        `[WS] Соединение закрыто. Код: ${event.code}, причина: ${event.reason}, wasClean: ${event.wasClean}`,
      );
      this.ws = null;
    };

    this.ws.onerror = (event: Event | any) => {
      this.isOpen = false;
      const stateMap = ["CONNECTING", "OPEN", "CLOSING", "CLOSED"];
      console.error(
        "[WS] Ошибка WebSocket:",
        event,
        "readyState:",
        this.ws?.readyState,
        stateMap[this.ws?.readyState ?? 3],
      );
    };
  }

  /** Отправка данных, только если соединение открыто */
  send(data: ArrayBuffer | string) {
    if (this.isOpen && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.warn(
        "[WS] Попытка отправить данные при закрытом WS. readyState:",
        this.ws?.readyState,
      );
    }
  }

  /** Закрытие соединения */
  close() {
    if (this.ws) {
      console.log("[WS] Закрытие соединения...");
      this.ws.close();
    }
    this.ws = null;
    this.isOpen = false;
  }
}
