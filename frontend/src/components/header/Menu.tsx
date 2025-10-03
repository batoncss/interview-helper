import { useState } from "react";
import { Menu as MenuIcon, X } from "lucide-react";
import { links } from "../../../constants/links";
import { NavItems } from "./NavItems";

export default function Menu() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative">
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <NavItems links={links} className="hidden lg:flex gap-x-6 text-sm" />

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg p-6 flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="self-end mb-6 rounded-full p-2 hover:bg-gray-100"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>

            <NavItems
              links={links}
              onClick={() => setOpen(false)}
              className="space-y-4 text-base"
            />
          </div>
        </div>
      )}
    </nav>
  );
}
