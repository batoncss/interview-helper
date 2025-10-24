import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface TranscriptionTableProps {
  recognizedSpeech: string[];
  recognizedQuestions: string[];
  answers: string[];
}

export const TranscriptionTable = ({
  recognizedSpeech,
  recognizedQuestions,
  answers,
}: TranscriptionTableProps) => {
  return (
    <div className="w-full max-w-6xl flex-1 border border-gray-300 rounded-2xl shadow-lg bg-white overflow-auto">
      <table className="w-full table-auto border-collapse text-base">
        <thead className="bg-gray-200 text-lg font-semibold sticky top-0 z-10">
          <tr>
            <th className="border-b p-4 text-left w-12">#</th>
            <th className="border-b p-4 text-left w-64">Фраза</th>
            <th className="border-b p-4 text-left w-64">Вопросы</th>
            <th className="border-b p-4 text-left">Ответы</th>
          </tr>
        </thead>
        <tbody>
          {recognizedSpeech.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-10 text-gray-400 text-center italic">
                Транскрипция появится здесь...
              </td>
            </tr>
          ) : (
            recognizedSpeech.map((speech, i) => (
              <tr
                key={i}
                className={
                  i % 2 === 0
                    ? "bg-white hover:bg-gray-50 transition"
                    : "bg-gray-50 hover:bg-gray-100 transition"
                }
              >
                <td className="border-b p-4 text-gray-600">{i + 1}</td>
                <td className="border-b p-4">{speech || "—"}</td>
                <td className="border-b p-4">
                  {recognizedQuestions[i] ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {recognizedQuestions[i]}
                    </ReactMarkdown>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
                <td className="border-b p-4">
                  {answers[i] ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {answers[i]}
                    </ReactMarkdown>
                  ) : (
                    <span className="text-gray-400 italic">—</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
