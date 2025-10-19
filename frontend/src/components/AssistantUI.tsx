import { useAssistant } from "../context/AssistantProvider";

export const AssistantUI = () => {
  const {
    recognizedSpeech,
    recognizedQuestions,
    recording,
    startRecording,
    stopRecording,
    clearRecognizedSpeech,
  } = useAssistant();

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">🎤 Помощник</h1>

      <div className="flex gap-4 mb-6">
        {!recording ? (
          <button
            onClick={startRecording}
            className="px-6 py-3 rounded-lg text-white font-semibold bg-green-500 hover:bg-green-600 transition"
          >
            Старт
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-6 py-3 rounded-lg text-white font-semibold bg-red-500 hover:bg-red-600 transition"
          >
            Стоп
          </button>
        )}
        <button
          onClick={clearRecognizedSpeech}
          className="px-6 py-3 rounded-lg text-white font-semibold bg-gray-500 hover:bg-gray-600 transition"
        >
          Очистка
        </button>
      </div>

      <div className="w-full max-w-3xl border border-gray-300 rounded-xl shadow-sm bg-white overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">#</th>
              <th className="border p-2 text-left">Фраза</th>
              <th className="border p-2 text-left">Вопросы</th>
            </tr>
          </thead>
          <tbody>
            {recognizedSpeech.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-4 text-gray-500 text-center">
                  Транскрипция появится здесь...
                </td>
              </tr>
            ) : (
              recognizedSpeech.map((speech, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="border p-2 text-gray-600">{i + 1}</td>
                  <td className="border p-2">{speech || <em>—</em>}</td>
                  <td className="border p-2">
                    {recognizedQuestions[i]?.length ? (
                      <ul className="list-disc pl-5">
                        {recognizedQuestions[i].map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    ) : (
                      <em>—</em>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
