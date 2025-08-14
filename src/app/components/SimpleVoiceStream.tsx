'use client';
import { useSpeechRecognition } from '@/app/hooks/useSpeechRecognition';
import ButtonsGroup from "@/app/components/ButtonsGroup";
import RecognizedTextTable from "@/app/components/RecognizedTextTable";
import AnswersAndQuestionsTable from "@/app/components/AnswersAndQuestionsTable";

export default function SimpleVoiceStream() {
  const {
    isListening,
    interimText,
    finalText,
    qa,
    chatMode,
    setChatMode,
    startListening,
    stopListening
  } = useSpeechRecognition();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">🎙 Голос → Текст → Ответы</h2>

        <ButtonsGroup
          start={startListening}
          stop={stopListening}
          chatMode={chatMode}
          setChatMode={setChatMode}
          isListening={isListening}
        />

        {interimText && (
          <div className="bg-yellow-100 p-2 rounded mb-4 text-gray-800">{interimText}</div>
        )}

        <RecognizedTextTable finalText={finalText} />
        <AnswersAndQuestionsTable qa={qa} />
      </div>
    </div>
  );
}