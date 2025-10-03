import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth.ts";

export function useAuth() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<JwtPayload>(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
      }
    }
  }, []);

  return username;
}
