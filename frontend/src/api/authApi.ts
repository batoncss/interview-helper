export async function apiLogin(login: string, password: string) {
  return fetch("/api/auth/token", {
    method: "POST",
    body: new URLSearchParams({ username: login, password }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
}

export async function apiRegister(body: {
  login: string;
  email: string;
  password: string;
}) {
  return fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8" },
    body: JSON.stringify(body),
  });
}
