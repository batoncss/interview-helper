import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  username: string;
  user_id: number;
  exp: number;
  iat: number;
  token_type: string;
  jti: string;
};

export default function AuthButtons() {
  const [username, setUsername] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        console.log(decoded);
        setUsername(decoded.username);
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUsername(null);
    navigate("/signin");
  };

  return (
    <div className="flex max-lg:ml-auto items-center space-x-3">
      {username ? (
        <>
          <span className="text-gray-700 font-medium">Привет, {username}!</span>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-sm rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-100 shadow-sm transition-colors duration-200"
          >
            Выйти
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
