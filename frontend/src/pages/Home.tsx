export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md mb-4 transition duration-500 hover:text-semargl-base">
        Добро пожаловать!
      </h1>
      <p className="text-lg text-gray-600 max-w-xl">
        Это интерфейс помощника для собеседований. Выберите интересующий раздел из меню
        выше.
      </p>
    </div>
  );
}