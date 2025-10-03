import { NavLink } from "react-router-dom";
import type { NavItemsProps } from "../../interfaces/navItems.ts";

export function NavItems({ links, onClick, className }: NavItemsProps) {
  return (
    <ul className={className}>
      {links.map(({ text, href }) => (
        <li key={text}>
          <NavLink
            to={href}
            onClick={onClick}
            className={({ isActive }) =>
              `font-medium transition-colors ${
                isActive ? "text-blue-600" : "text-gray-700 hover:text-blue-600"
              }`
            }
          >
            {text}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
