export function SubmitButton({ text }: { text: string }) {
  return (
    <button
      type="submit"
      className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {text}
    </button>
  );
}
