import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import InputOmzet from './pages/InputOmzet';
import Riwayat from './pages/Riwayat';
import Pengaturan from './pages/Pengaturan';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">

        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-3xl mx-auto flex px-4 h-14 items-center gap-6 overflow-x-auto">
            <Link to="/" className="font-bold text-slate-800 hover:text-blue-600 transition-colors whitespace-nowrap">
              Dashboard
            </Link>
            <Link to="/input" className="font-bold text-slate-800 hover:text-blue-600 transition-colors whitespace-nowrap">
              Input Omzet
            </Link>
            <Link to="/riwayat" className="font-bold text-slate-800 hover:text-blue-600 transition-colors whitespace-nowrap">
              Riwayat
            </Link>
            <Link to="/pengaturan" className="font-bold text-slate-800 hover:text-blue-600 transition-colors whitespace-nowrap">
              Pengaturan
            </Link>
          </div>
        </nav>

        <main className="pb-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/input" element={<InputOmzet />} />
            <Route path="/riwayat" element={<Riwayat />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;