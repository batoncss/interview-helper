export default function Logo() {
  return (
    <div>
      <a href="/" className="hidden sm:block">
        <img src="/logo.png" alt="logo" className="w-10" />
      </a>
      <a href="/" className="sm:hidden">
        <img src="/logo.png" alt="logo" className="w-9" />
      </a>
    </div>
  );
}
