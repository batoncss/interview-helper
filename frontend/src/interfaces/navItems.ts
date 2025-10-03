import type { NavLinkItem } from "../types/navItems.ts";

export interface NavItemsProps {
  links: NavLinkItem[];
  onClick?: () => void;
  className?: string;
}
