"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { WSClient } from "../services/WSClient";
import generatingListRecognizedSpeech from "../services/recognizedSpeech";
import { AudioProcessor } from "../services/AudioProcessor";
import generatingQuestion, { answer_question } from "../services/questions";

interface AssistantContextType {
  recognizedSpeech: string[];
  recognizedQuestions: string[];
  answers: string[];
  recording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  clearRecognizedSpeech: () => void;
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
  const [recognizedSpeech, setRecognizedSpeech] = useState<string[]>([]);
  const [recognizedQuestions, setRecognizedQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recording, setRecording] = useState(false);

  const wsRef = useRef<WSClient | null>(null);
  const audioRef = useRef<AudioProcessor | null>(null);

  const startRecording = useCallback(async () => {
    if (recording) return;

    try {
      // 1. Подключаем WebSocket
      const ws = new WSClient("ws://127.0.0.1:8000/ws", async (msg: string) => {
        const data = JSON.parse(msg);
        setRecognizedSpeech((prev) =>
          generatingListRecognizedSpeech(prev, data.event_type, data.text),
        );

        if (data.event_type === "final_refinement") {
          const newQuestion = await generatingQuestion(data.text[0]);
          setRecognizedQuestions((prev) => [...prev, newQuestion]);
          const newAnswer = await answer_question(newQuestion);
          setAnswers((prev) => [...prev, newAnswer]);
        }
      });
      ws.connect();
      wsRef.current = ws;

      // 2. Запускаем обработку аудио
      const audio = new AudioProcessor();
      await audio.start((buffer) => {
        if (!wsRef.current?.isOpen) return;
        const downsampled = AudioProcessor.downsample(
          buffer,
          audio.sampleRate,
          16000,
        );
        const pcm = AudioProcessor.floatTo16BitPCM(downsampled);
        wsRef.current.send(pcm);
      });
      audioRef.current = audio;

      setRecording(true);
    } catch (err) {
      console.error("Ошибка при запуске записи:", err);
      await stopRecording(); // безопасное завершение при ошибке
    }
  }, [recording]);

  const stopRecording = useCallback(async () => {
    try {
      await audioRef.current?.stop();
      wsRef.current?.close();
    } catch (err) {
      console.warn("Ошибка при остановке записи:", err);
    } finally {
      audioRef.current = null;
      wsRef.current = null;
      setRecording(false);
    }
  }, []);

  const clearRecognizedSpeech = useCallback(() => {
    setRecognizedSpeech([]);
    setRecognizedQuestions([]);
    setAnswers([]);
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return (
    <AssistantContext.Provider
      value={{
        recognizedSpeech,
        recognizedQuestions,
        answers,
        recording,
        startRecording,
        stopRecording,
        clearRecognizedSpeech,
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
};
