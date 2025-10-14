import { Lock, User } from "lucide-react";
import { useState } from "react";
import { loginAction } from "../services/auth.ts";
import { ServerError } from "../api/authApi.ts";
import { useAuth } from "../context/AuthContext.tsx";

class PasswordValidationError extends Error {}

class LoginValidationError extends Error {}

const cleanForm = (form: FormData): { login: string; password: string } => {
  const login = form.get("login");
  if (!login || !(typeof login === "string")) {
    throw new LoginValidationError("Логин не может быть пустым");
  }
  if (login.length < 3) {
    throw new LoginValidationError("Логин не может быть меньше 3х символов");
  }

  const password = form.get("password");
  if (!password || !(typeof password === "string")) {
    throw new PasswordValidationError("Пароль не может быть пустым");
  }
  if (password.length < 6) {
    throw new PasswordValidationError(
      "Пароль не может быть меньше 6ти символов",
    );
  }

  return { login, password };
};

export default function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [globalError, setGlobalError] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const { setUsername } = useAuth();

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    try {
      const { login, password } = cleanForm(formData);
      setLoginError("");
      setPasswordError("");
      setGlobalError("");
      const decoded = await loginAction(login, password);
      setUsername(decoded);
      onSuccess();
    } catch (error) {
      console.error("Login error:", error);
      if (error instanceof LoginValidationError) {
        setLoginError(error.message);
        setPasswordError("");
      } else if (error instanceof PasswordValidationError) {
        setPasswordError(error.message);
        setLoginError("");
      } else if (error instanceof ServerError) {
        setGlobalError(error.message);
        setLoginError("");
        setPasswordError("");
      } else {
        setLoginError("Неизвестная ошибка");
        setPasswordError("Неизвестная ошибка");
      }
      return;
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleFormSubmit}>
      <span className="text-red-500">{globalError}</span>
      <div className="space-y-2">
        <label
          htmlFor="login"
          className="block text-sm font-medium text-gray-700"
        >
          Логин
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="login"
            type="text"
            name="login"
            required
            autoComplete="login"
            placeholder="Ваш логин"
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span className="text-red-500">{loginError}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Пароль
          </label>
          <a href="#" className="text-sm text-blue-600 hover:underline">
            Забыли пароль?
          </a>
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            id="password"
            type="password"
            name="password"
            // required
            autoComplete="current-password"
            // placeholder="••••••••"
            className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
          />
          <span className="text-red-500">{passwordError}</span>
        </div>
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
      >
        Войти
      </button>
    </form>
  );
}
