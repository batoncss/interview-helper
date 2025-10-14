"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { WSClient } from "../services/WSClient";
import { AudioProcessor } from "../services/AudioProcessor";

interface AssistantContextType {
  segments: string[];
  recording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearSegments: () => void;
}

const AssistantContext = createContext<AssistantContextType | null>(null);

export const useAssistant = () => {
  const context = useContext(AssistantContext);
  if (!context)
    throw new Error("useAssistant must be used within AssistantProvider");
  return context;
};

export const AssistantProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [segments, setSegments] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);

  const wsRef = useRef<WSClient | null>(null);
  const audioRef = useRef<AudioProcessor | null>(null);

  const startRecording = useCallback(async () => {
    if (recording) return;

    const ws = new WSClient("ws://127.0.0.1:8000/ws", (msg: string) => {
      console.log("📨 Пришло с бэка:", msg);

      requestAnimationFrame(() => {
        setSegments((prev) => {
          // 🟡 Если пришла пустая строка — начинаем новый элемент
          if (!msg.trim()) {
            // но только если последний элемент не пустой (чтобы не создавать лишние)
            if (prev.length === 0 || prev[prev.length - 1].trim() !== "") {
              return [...prev, ""];
            }
            return prev;
          }

          // 🟢 Если первый сегмент — создаём его
          if (prev.length === 0) {
            return [msg];
          }

          // 🟢 Если последний сегмент пустой (новый) — заполняем его
          if (prev[prev.length - 1].trim() === "") {
            const updated = [...prev];
            updated[updated.length - 1] = msg;
            return updated;
          }

          // 🟢 Иначе обновляем текущий сегмент
          const updated = [...prev];
          updated[updated.length - 1] = msg;
          return updated;
        });
      });
    });

    ws.connect();
    wsRef.current = ws;

    const audio = new AudioProcessor();
    await audio.start((buffer) => {
      const downsampled = AudioProcessor.downsample(
        buffer,
        audio.audioCtx?.sampleRate || 48000,
        16000,
      );
      ws.send(AudioProcessor.floatTo16BitPCM(downsampled));
    });
    audioRef.current = audio;

    setRecording(true);
  }, [recording]);

  const stopRecording = useCallback(async () => {
    await audioRef.current?.stop();
    audioRef.current = null;
    wsRef.current?.close();
    wsRef.current = null;
    setRecording(false);
  }, []);

  const clearSegments = useCallback(() => {
    setSegments([]);
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        segments,
        recording,
        startRecording,
        stopRecording,
        clearSegments,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};
