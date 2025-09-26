import { motion } from "framer-motion";
import { User, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../services/authHandlers.ts";

export default function SignIn() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-70px)] items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl bg-white p-8 shadow-xl">
          <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
            Вход
          </h1>
          <form
            className="space-y-5"
            onSubmit={(e) => handleLogin(e, navigate)}
          >
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
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Войти
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
