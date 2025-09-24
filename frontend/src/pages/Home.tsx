import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-70px)] flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4 text-center">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-4 text-5xl font-extrabold text-gray-800 drop-shadow-md hover:text-blue-600 transition-colors duration-500"
      >
        Добро пожаловать!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="max-w-xl text-lg text-gray-600"
      >
        Это интерфейс помощника для собеседований. Выберите интересующий раздел
        из меню выше.
      </motion.p>
    </div>
  );
}
