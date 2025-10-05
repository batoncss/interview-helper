import { register } from "./auth";
import * as React from "react";

// export async function handleLogin(
//   event: React.FormEvent<HTMLFormElement>,
//   navigate: (path: string) => void,
// ) {
//   event.preventDefault();
//
//   const formData = new FormData(event.currentTarget);
//   const loginValue = formData.get("login") as string;
//   const passwordValue = formData.get("password") as string;
//
//   const token = await login(loginValue, passwordValue);
//
//   if (token) {
//     navigate("/");
//   }
// }

export async function handleRegister(
  event: React.FormEvent<HTMLFormElement>,
  navigate: (path: string) => void,
) {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const body = {
    login: formData.get("login") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    passwordConfirm: formData.get("confirm-password") as string,
  };

  const token = await register(body);
  if (token) {
    navigate("/");
  }
}
