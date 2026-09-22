import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import CookieBanner from './components/CookieBanner';
import SupportWidget from './components/SupportWidget';
import Home from './pages/Home';
import ServicesPage from './pages/ServicesPage';
import ServiceDetailPage from './pages/ServiceDetailPage';
import CareersPage from './pages/CareersPage';
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
          <Route path="/de" element={<Home />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/de/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/de/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/de/careers" element={<CareersPage />} />
          <Route path="/titandesk" element={<TitanDeskPage />} />
          <Route path="/de/titandesk" element={<TitanDeskPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/de/login" element={<LoginPage />} />
        </Routes>
      </main>
      <Footer />
      <SupportWidget />
      <CookieBanner />
    </div>
  );
}
