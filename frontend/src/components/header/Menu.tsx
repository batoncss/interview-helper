export default function Menu() {
  const links = ["Главная", "О нас", "Контакты"];
  return (
    <nav
      id="collapseMenu"
      className="max-lg:hidden lg:block max-lg:before:fixed max-lg:before:bg-black/50 max-lg:before:inset-0 max-lg:before:z-50"
    >
      <button
        id="toggleClose"
        className="lg:hidden fixed top-2 right-4 z-[100] w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200"
      >
        ✕
      </button>

      <ul className="lg:flex gap-x-4 max-lg:space-y-3 max-lg:fixed max-lg:bg-white max-lg:w-1/2 max-lg:min-w-[300px] max-lg:top-0 max-lg:left-0 max-lg:p-6 max-lg:h-full max-lg:shadow-md max-lg:overflow-auto z-50">
        <li className="mb-6 hidden max-lg:block">
          <a href="#">
            <img
              src="https://readymadeui.com/readymadeui.svg"
              alt="logo"
              className="w-36"
            />
          </a>
        </li>
        {links.map((text, i) => (
          <li
            key={text}
            className="max-lg:border-b max-lg:border-gray-300 max-lg:py-3 px-3"
          >
            <a
              href="#"
              className={`block font-medium text-[15px] hover:text-blue-700 ${
                i === 0 ? "text-blue-700" : "text-slate-900"
              }`}
            >
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
