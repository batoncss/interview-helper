interface AssistantControlsProps {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  clearRecognizedSpeech: () => void;
}

export const AssistantControls = ({
  recording,
  startRecording,
  stopRecording,
  clearRecognizedSpeech,
}: AssistantControlsProps) => {
  return (
    <div className="flex gap-4 mb-8">
      {!recording ? (
        <button
          onClick={startRecording}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-green-500 hover:bg-green-600 shadow-md transition transform hover:scale-105"
        >
          Старт
        </button>
      ) : (
        <button
          onClick={stopRecording}
          className="px-6 py-3 rounded-xl font-semibold text-white bg-red-500 hover:bg-red-600 shadow-md transition transform hover:scale-105"
        >
          Стоп
        </button>
      )}
      <button
        onClick={clearRecognizedSpeech}
        className="px-6 py-3 rounded-xl font-semibold text-white bg-gray-500 hover:bg-gray-600 shadow-md transition transform hover:scale-105"
      >
        Очистка
      </button>
    </div>
  );
};
