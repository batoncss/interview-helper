import Logo from "./header/Logo.tsx";
import Menu from "./header/Menu.tsx";
import AuthButtons from "./header/AuthButtons.tsx";

export default function Header() {
  return (
    <header className="flex shadow-md py-4 px-4 sm:px-10 bg-white min-h-[70px] tracking-wide relative z-50">
      <div className="relative flex items-center justify-between w-full">
        <Logo />
        <div className="absolute left-1/2 -translate-x-1/2">
          <Menu />
        </div>
        <AuthButtons />
      </div>
    </header>
  );
}
