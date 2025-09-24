import Logo from "./header/Logo.tsx";
import Menu from "./header/Menu.tsx";
import AuthButtons from "./header/AuthButtons.tsx";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        <Logo />
        <nav className="absolute left-1/2 hidden -translate-x-1/2 md:block">
          <Menu />
        </nav>
        <AuthButtons />
      </div>
    </header>
  );
}
