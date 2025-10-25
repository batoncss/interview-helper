import { useAssistant } from "../../context/AssistantProvider.tsx";
import { AssistantControls } from "./AssistantControls";
import { TranscriptionTable } from "./TranscriptionTable";

export const AssistantUI = () => {
  const {
    recognizedSpeech,
    recognizedQuestions,
    answers,
    recording,
    startRecording,
    stopRecording,
    clearRecognizedSpeech,
  } = useAssistant();

  return (
    <section className="flex flex-col items-center justify-start h-full p-6 bg-gradient-to-b from-gray-100 to-gray-50">
      <h1 className="text-4xl font-extrabold mb-8 text-gray-800 drop-shadow-sm">
        🎤 Помощник
      </h1>

      <AssistantControls
        recording={recording}
        startRecording={startRecording}
        stopRecording={stopRecording}
        clearRecognizedSpeech={clearRecognizedSpeech}
      />

      <TranscriptionTable
        recognizedSpeech={recognizedSpeech}
        recognizedQuestions={recognizedQuestions}
        answers={answers}
      />
    </section>
  );
};
