export async function apiLogin(login: string, password: string) {
  return callBackend("/api/auth/token", "POST", { username: login, password }, "form");
}

export async function apiRegister(body: {
  login: string;
  email: string;
  password: string;
}) {
  return callBackend("/api/auth/register", "POST", body, "json");
}
