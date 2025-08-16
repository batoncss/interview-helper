import type { QAItem } from './VoiceRecorder'

type Props = {
  qa: QAItem[];
};

export default function AnswersAndQuestionsTable({ qa }: Props) {
  return (
    <>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Ответы на вопросы</h3>
        <span className="text-sm text-gray-500">Всего: {qa.length}</span>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-3 py-2 text-left">Время</th>
              <th className="px-3 py-2 text-left w-1/2">Вопрос</th>
              <th className="px-3 py-2 text-left w-1/2">Ответ</th>
            </tr>
          </thead>
          <tbody>
            {qa.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-gray-400 italic" colSpan={3}>
                  Пока нет данных
                </td>
              </tr>
            ) : (
              qa.map((row) => (
                <tr key={row.id} className="border-t align-top">
                  <td className="px-3 py-2 whitespace-nowrap text-gray-500">
                    {new Date(row.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="px-3 py-2 text-gray-800">{row.question}</td>
                  <td className="px-3 py-2 text-gray-800">{row.answer}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
