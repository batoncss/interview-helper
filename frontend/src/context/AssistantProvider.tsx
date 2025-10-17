"use client";
import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from "react";
import { WSClient } from "../services/WSClient";
import generatingListRecognizedSpeech from "../services/recognizedSpeech.ts";
import { AudioProcessor } from "../services/AudioProcessor.ts";

interface AssistantContextType {
  recognizedSpeech: string[];
  questions: string[];
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
  const [recording, setRecording] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);

  const wsRef = useRef<WSClient | null>(null);
  const audioRef = useRef<AudioProcessor | null>(null);

  const startRecording = useCallback(async () => {
    if (recording) return;
    const ws = new WSClient("ws://127.0.0.1:8000/ws", (msg: string) => {
      setRecognizedSpeech((prev) => {
        return generatingListRecognizedSpeech(prev || [], msg);
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

  const clearRecognizedSpeech = useCallback(() => {
    setRecognizedSpeech([]);
    setQuestions([]);
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        recognizedSpeech,
        questions,
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
