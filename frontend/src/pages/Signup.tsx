import * as React from "react";
import { motion } from "framer-motion";
import { User, Mail, Lock } from "lucide-react";

export default function SignUp() {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const body = {
      username: formData.get("login"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    if (body.password !== formData.get("confirm-password")) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        console.error("Ошибка:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("Успешный ответ:", data);

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.error("Сетевая ошибка:", error);
    }
  };

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
            Создание аккаунта
          </h1>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="login"
                className="block text-sm font-medium text-gray-700"
              >
                Ваш логин
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="login"
                  name="login"
                  type="text"
                  placeholder="логин"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Ваш email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Повторите пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="w-full rounded-lg border border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
            </div>

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

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white shadow hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
            >
              Создать аккаунт
            </button>

            <p className="text-center text-sm text-gray-600">
              Уже зарегистрированы?{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Войдите тут
              </a>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
