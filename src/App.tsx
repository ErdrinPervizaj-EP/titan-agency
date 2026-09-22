import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import Home from './pages/Home';
import TitanDeskPage from './pages/TitanDeskPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-25">
      <ScrollToHash />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/titandesk" element={<TitanDeskPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
