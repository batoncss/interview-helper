import callBackend from "./callBackend";

export async function apiLogin(login: string, password: string) {
  return callBackend(
    "/api/app/token",
    "POST",
    { username: login, password },
    "form",
  );
}

export async function apiRegister(
  login: string,
  email: string,
  password: string,
) {
  return callBackend(
    "/api/app/register",
    "POST",
    {
      username: login,
      email,
      password,
    },
    "json",
  );
}

export class ServerError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ServerError";
  }
}
