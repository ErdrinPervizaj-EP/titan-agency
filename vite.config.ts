import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * Content Security Policy for production builds. The site only ever loads its
 * own files and talks to the TitanDesk API, so everything else is refused.
 * Inline styles stay allowed because React sets `style` attributes; inline
 * scripts do not. Frame protection (frame-ancestors) cannot be set from a meta
 * tag — set it as a response header on the host (see README).
 */
function contentSecurityPolicy(apiUrl: string): Plugin {
  const api = new URL(apiUrl).origin
  const policy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    `connect-src 'self' ${api}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ')
  return {
    name: 'titan-csp',
    apply: 'build',
    transformIndexHtml: (html) => html.replace('<head>', `<head>\n    <meta http-equiv="Content-Security-Policy" content="${policy}" />`),
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    base: process.env.GITHUB_PAGES ? '/titan-agency/' : '/',
    plugins: [react(), tailwindcss(), contentSecurityPolicy(env.VITE_TITANDESK_API_URL ?? 'http://127.0.0.1:4100')],
    server: {
      port: 5190,
    },
  }
})
