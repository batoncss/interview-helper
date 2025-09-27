import { motion } from "framer-motion";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

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
          <LoginForm
            onSuccess={() => {
              navigate("/");
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}
