type ButtonsGroupProps = {
  start: () => void;
  stop: () => void;
  isListening: boolean;
  chatMode: boolean;
  setChatMode: (v: boolean) => void;
};

export default function ButtonsGroup({
  start,
  stop,
  isListening,
  chatMode,
  setChatMode,
}: ButtonsGroupProps) {
  return (
    <div className="flex gap-4 mb-6 items-center">
      <button
        onClick={start}
        disabled={isListening}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
      >
        ▶ Старт
      </button>
      <button
        onClick={stop}
        disabled={!isListening}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:opacity-50"
      >
        ⏹ Стоп
      </button>

      <label className="inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={chatMode}
          onChange={(e) => setChatMode(e.target.checked)}
        />
        <div className="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600" />
        <span className="ms-3 text-sm font-medium text-gray-900">
          {chatMode ? "Отправка включена" : "Отправка выключена"}
        </span>
      </label>
    </div>
  );
}
