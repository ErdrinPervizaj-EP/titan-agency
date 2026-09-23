import { Routes, Route } from 'react-router-dom';
import { SuperAdminAuthProvider, RequireSuperAdmin } from './auth';
import { SuperAdminToastProvider } from './toast';
import AdminLoginPage from './LoginPage';
import AdminLayout from './Layout';
import OverviewPage from './OverviewPage';
import ResourcePage from './ResourcePage';
import SupportPage from './SupportPage';
import UserDetailPage from './UserDetailPage';
import OrganizationDetailPage from './OrganizationDetailPage';
import WebsitePage from './WebsitePage';
import BlogAdminPage from './BlogAdminPage';

/**
 * Titan Network's internal platform-admin console for Desk.TitanNetwork —
 * moved here from the product app since it's an agency-operator tool, not
 * a tenant-facing product feature. Calls the same TitanDesk server over
 * HTTP (VITE_TITANDESK_API_URL), authenticated by the same session cookie.
 */
export default function AdminConsole() {
  return (
    <SuperAdminAuthProvider>
      <SuperAdminToastProvider>
        <Routes>
          <Route path="login" element={<AdminLoginPage />} />
          <Route element={<RequireSuperAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<OverviewPage />} />
              <Route path="organizations" element={<ResourcePage resource="organizations" />} />
              <Route path="organizations/:id" element={<OrganizationDetailPage />} />
              <Route path="users" element={<ResourcePage resource="users" />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="support" element={<SupportPage />} />
              <Route path="feature-flags" element={<ResourcePage resource="feature-flags" />} />
              <Route path="audit-logs" element={<ResourcePage resource="audit-logs" />} />
              <Route path="data-privacy" element={<ResourcePage resource="data-privacy" />} />
              <Route path="website" element={<WebsitePage />} />
              <Route path="blog" element={<BlogAdminPage />} />
            </Route>
          </Route>
        </Routes>
      </SuperAdminToastProvider>
    </SuperAdminAuthProvider>
  );
}
