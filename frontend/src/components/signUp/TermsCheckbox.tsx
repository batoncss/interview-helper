export function TermsCheckbox() {
  return (
    <div className="flex items-center space-x-2">
      <input
        id="terms"
        type="checkbox"
        required
        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor="terms" className="text-sm text-gray-600">
        Я принимаю{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Условия и положения
        </a>
      </label>
    </div>
  );
}
