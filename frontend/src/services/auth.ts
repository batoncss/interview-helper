import { apiLogin, apiRegister } from "../api/authApi";
import { jwtDecode } from "jwt-decode";
import type { customJwtPayload } from "../types/auth.ts";

export async function loginAction(login: string, password: string) {
  const response = await apiLogin(login, password);
  if (!response.ok) throw new Error(`Ошибка ${response.status}`);

  const data = await response.json();
  const token = data.access_token;
  localStorage.setItem("token", token);

  const decoded = jwtDecode<customJwtPayload>(token);
  return decoded.username;
}

export async function register({
  login,
  password,
  passwordConfirm,
  email,
}: {
  login: string;
  password: string;
  passwordConfirm: string;
  email: string;
}): Promise<string | null> {
  if (password !== passwordConfirm) {
    alert("Пароли не совпадают");
    return null;
  }

  try {
    const response = await apiRegister(login, email, password);
    if (!response.ok) return null;

    const data = await response.json();
    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      return data.access_token;
    }
    if (data.redirectUrl) window.location.href = data.redirectUrl;
    return null;
  } catch (e) {
    console.error("Ошибка регистрации:", e);
    return null;
  }
}
