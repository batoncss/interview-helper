import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { customJwtPayload } from "../types/auth.ts";

interface AuthContextType {
  username: string | null;
  setUsername: (name: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  username: null,
  setUsername: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<customJwtPayload>(token);
        setUsername(decoded.username);
      } catch (err) {
        console.error("Ошибка декодирования токена:", err);
        setUsername(null);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, setUsername, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
