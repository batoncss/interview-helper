export default function About() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">О нас</h1>

      <p className="text-gray-700 mb-4">
        Здесь вы найдете информацию о наших проектах, идеях и планах на будущее.
      </p>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Контакты</h2>
        <ul className="space-y-2">
          <li>
            📧 Email:{" "}
            <a
              href="mailto:batoncss@yandex.ru"
              className="text-blue-600 hover:underline"
            >
              batoncss@yandex.ru
            </a>
          </li>
          <li>
            💻 GitHub:{" "}
            <a
              href="https://github.com/batoncss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              github.com/batoncss
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
