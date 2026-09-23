import { TITANDESK_WEB_URL } from './titandesk-client';

/**
 * Where visitors sign in, sign up and reset passwords. There is one account
 * for every Titan Network product, so the marketing site never links to a
 * specific product's login.
 *
 * Today TitanDesk's app hosts those pages, so this defaults to it. When more
 * products (HRM, …) exist and sign-in moves to a shared accounts app (e.g.
 * accounts.titannetwork.com), set VITE_ACCOUNT_URL and every link follows.
 */
export const ACCOUNT_URL = (import.meta.env.VITE_ACCOUNT_URL ?? TITANDESK_WEB_URL).replace(/\/$/, '');

export const ACCOUNT_PAGES = {
  login: '/login',
  signup: '/register',
  forgotPassword: '/forgot-password',
} as const;

export type AccountPage = keyof typeof ACCOUNT_PAGES;

export function accountUrl(page: AccountPage, search = ''): string {
  return `${ACCOUNT_URL}${ACCOUNT_PAGES[page]}${search}`;
}
