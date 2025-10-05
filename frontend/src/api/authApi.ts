export class ServerError extends Error {}

export async function apiLogin(
  login: string,
  password: string,
): Promise<string> {
  const response = await fetch("/api/auth/token", {
    method: "POST",
    body: new URLSearchParams({ username: login, password }),
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
  if (!response.ok) {
    // todo: check if statusText is actually contains useful info
    throw new ServerError(response.statusText);
  }
  const payload = await response.json();
  if (!payload.access_token || typeof payload.access_token !== "string") {
    throw new ServerError("No access token in response");
  }
  return payload.access_token;
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
