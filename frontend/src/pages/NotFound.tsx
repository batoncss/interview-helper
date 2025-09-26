import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-9xl font-extrabold text-blue-600">404</h1>
      <p className="mt-4 text-2xl font-semibold text-gray-800">
        Упс! Страница не найдена
      </p>
      <p className="mt-2 text-gray-500">
        Возможно, вы ошиблись адресом или страница была удалена.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow hover:bg-blue-700 transition"
      >
        Вернуться на главную
      </Link>
    </div>
  );
}
