export default function callBackend(
  url: string,
  method: "POST" | "GET" | "PUT" | "PATCH" | "DELETE",
  body?: Record<string, any> | string,
  type: "json" | "form" = "form",
) {
  let headers: HeadersInit = {};
  let payload: BodyInit | undefined;

  if (body && method !== "GET" && method !== "DELETE") {
    if (type === "json") {
      headers["Content-Type"] = "application/json; charset=UTF-8";
      payload = typeof body === "string" ? body : JSON.stringify(body);
    } else {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      payload =
        typeof body === "string" ? body : new URLSearchParams(body).toString();
    }
  }

  return fetch(url, { method, headers, body: payload });
}
