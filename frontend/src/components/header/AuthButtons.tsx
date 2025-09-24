import { Link } from "react-router-dom";

export default function AuthButtons() {
  return (
    <div className="flex max-lg:ml-auto items-center space-x-3">
      <Link to="/signin">
        <button className="px-5 py-2 text-sm rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm transition-colors duration-200">
          Вход
        </button>
      </Link>
      <Link to="/signup">
        <button className="px-5 py-2 text-sm rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors duration-200">
          Регистрация
        </button>
      </Link>
    </div>
  );
}
