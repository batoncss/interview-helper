import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Menu() {
  const links = [
    { text: "Главная", href: "/" },
    { text: "О нас", href: "/about" },
    { text: "Включить помощника", href: "/assistant" },
  ];

  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      {/* Кнопка мобильного меню */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      {/* Меню для desktop */}
      <ul className="hidden lg:flex gap-x-6">
        {links.map(({ text, href }) => (
          <li key={text}>
            <NavLink
              to={href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-blue-600"
                    : "text-gray-700 hover:text-blue-600"
                }`
              }
            >
              {text}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Мобильное меню */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg p-6 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="self-end mb-6 rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            <ul className="space-y-4">
              {links.map(({ text, href }) => (
                <li key={text}>
                  <NavLink
                    to={href}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block text-base font-medium transition-colors ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-700 hover:text-blue-600"
                      }`
                    }
                  >
                    {text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
