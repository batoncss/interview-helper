import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Header.tsx";
import Home from "./pages/Home.tsx";

export default function App() {

  return (
      <>
      <Router>
        <Header></Header>
          {/* Разделительная линия */}
          <div className="h-px bg-gray-300" />
          {/* Контент ограничиваем по центру */}
          <main className="flex-1 mt-6 w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
              <Routes>
                  <Route path="/" element={<Home />} />
              </Routes>
          </main>
      </Router>
      </>
  )
}