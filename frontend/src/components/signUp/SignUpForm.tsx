import { User, Mail, Lock } from "lucide-react";
import { InputField } from "./InputField.tsx";
import { TermsCheckbox } from "./TermsCheckbox.tsx";
import { SubmitButton } from "./SubmitButton.tsx";

interface SignUpFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function SignUpForm({ onSubmit }: SignUpFormProps) {
  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <InputField
        id="login"
        name="login"
        label="Ваш логин"
        type="text"
        icon={User}
        placeholder="логин"
      />
      <InputField
        id="email"
        name="email"
        label="Ваш email"
        type="email"
        icon={Mail}
        placeholder="name@company.com"
      />
      <InputField
        id="password"
        name="password"
        label="Пароль"
        type="password"
        icon={Lock}
        placeholder="••••••••"
      />
      <InputField
        id="confirm-password"
        name="confirm-password"
        label="Повторите пароль"
        type="password"
        icon={Lock}
        placeholder="••••••••"
      />

      <TermsCheckbox />

      <SubmitButton text="Создать аккаунт" />

      <p className="text-center text-sm text-gray-600">
        Уже зарегистрированы?{" "}
        <a href="#" className="text-blue-600 hover:underline">
          Войдите тут
        </a>
      </p>
    </form>
  );
}
