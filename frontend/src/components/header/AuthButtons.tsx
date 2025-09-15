export default function AuthButtons(){
    return (
        <div className="flex max-lg:ml-auto space-x-4">
          <button className="px-4 py-2 text-sm rounded-full font-medium border border-gray-400 text-slate-900 hover:bg-gray-50 transition">
            Вход
          </button>
          <button className="px-4 py-2 text-sm rounded-full font-medium text-white bg-blue-600 border border-blue-600 hover:bg-blue-700 transition">
            Регистрация
          </button>
        </div>
    )
}

