import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ScrollProgress from './components/ScrollProgress';
import Footer from './components/Footer';
import ScrollToHash from './components/ScrollToHash';
import SupportWidget from './components/SupportWidget';
import Home from './pages/Home';
import AccountRedirect from './components/AccountRedirect';

// Loaded on demand: visitors to the homepage never download the inner pages,
// and nobody outside /admin ever downloads the Super Admin console.
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const CareersPage = lazy(() => import('./pages/CareersPage'));
const TitanDeskPage = lazy(() => import('./pages/TitanDeskPage'));
const EnterprisePage = lazy(() => import('./pages/EnterprisePage'));
const LegalPage = lazy(() => import('./pages/LegalPage'));
const BlogListPage = lazy(() => import('./pages/BlogPages').then((m) => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import('./pages/BlogPages').then((m) => ({ default: m.BlogPostPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
/**
 * Which parts this build contains (VITE_APP_MODE):
 *  - "marketing": the public site only. The Super Admin console is not in the
 *    bundle at all, and /admin sends people to VITE_ADMIN_URL.
 *  - "admin": the Super Admin console only, for its own subdomain.
 *  - "all" (default): both, for local development.
 * The value is fixed at build time, so the unused half is dropped entirely.
 */
const APP_MODE = (import.meta.env.VITE_APP_MODE ?? 'all') as 'all' | 'marketing' | 'admin';
const AdminConsole = APP_MODE === 'marketing' ? null : lazy(() => import('./admin/AdminConsole'));

function AdminElsewhere() {
  const target = import.meta.env.VITE_ADMIN_URL;
  useEffect(() => { if (target) window.location.replace(target); }, [target]);
  return <Navigate to="/" replace />;
}

function MarketingSite() {
  return (
    <div className="min-h-screen bg-slate-25">
      <ScrollToHash />
      <ScrollProgress />
      <Navbar />
      <main>
        <Suspense fallback={<div className="min-h-[60vh]" />}>
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
          <Route path="/titandesk/enterprise" element={<EnterprisePage />} />
          <Route path="/de/titandesk/enterprise" element={<EnterprisePage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/de/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/de/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<LegalPage page="privacy" />} />
          <Route path="/de/privacy" element={<LegalPage page="privacy" />} />
          <Route path="/terms" element={<LegalPage page="terms" />} />
          <Route path="/de/terms" element={<LegalPage page="terms" />} />
          <Route path="/imprint" element={<LegalPage page="imprint" />} />
          <Route path="/de/imprint" element={<LegalPage page="imprint" />} />
          <Route path="/titandesk/terms" element={<LegalPage page="service" />} />
          <Route path="/de/titandesk/terms" element={<LegalPage page="service" />} />
          <Route path="/refunds" element={<LegalPage page="refunds" />} />
          <Route path="/de/refunds" element={<LegalPage page="refunds" />} />
          <Route path="/security" element={<LegalPage page="security" />} />
          <Route path="/de/security" element={<LegalPage page="security" />} />
          {/* Sign-in and sign-up live on the shared account pages; old links here forward there. */}
          <Route path="/login" element={<AccountRedirect page="login" />} />
          <Route path="/de/login" element={<AccountRedirect page="login" />} />
          <Route path="/register" element={<AccountRedirect page="signup" />} />
          <Route path="/de/register" element={<AccountRedirect page="signup" />} />
          <Route path="/forgot-password" element={<AccountRedirect page="forgotPassword" />} />
          <Route path="/de/forgot-password" element={<AccountRedirect page="forgotPassword" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </main>
      <Footer />
      <SupportWidget />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/admin/*" element={AdminConsole ? <Suspense fallback={null}><AdminConsole /></Suspense> : <AdminElsewhere />} />
      <Route path="/*" element={APP_MODE === 'admin' ? <Navigate to="/admin" replace /> : <MarketingSite />} />
    </Routes>
  );
}
