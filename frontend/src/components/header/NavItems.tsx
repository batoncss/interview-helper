import { NavLink } from "react-router-dom";

export function NavItems({
  links,
  onClick,
  className,
}: {
  links: { text: string; href: string }[];
  onClick?: () => void;
  className?: string;
}) {
  return (
    <ul className={className}>
      {links.map(({ text, href }) => (
        <li key={text}>
          <NavLink
            to={href}
            onClick={onClick}
            className={({ isActive }) =>
              `font-medium transition-colors ${
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
  );
}
