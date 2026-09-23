import { superAdminRequest } from './lib/titandesk-client';
import { superAdminApi } from './api';
import type { SiteCompany, SiteContent, SitePlan, SiteJob, SiteClient, SiteTestimonial } from '../lib/site-content';

/** Stored shapes: the public ones plus the unpublished/closed entries and plan rules not stored. */
export interface ContentShapes {
  company: SiteCompany;
  plans: Omit<SitePlan, 'gatewayLimit' | 'modules'>[];
  jobs: (SiteJob & { open: boolean })[];
  clients: (SiteClient & { published: boolean })[];
  testimonials: (SiteTestimonial & { published: boolean })[];
}
export type ContentKey = keyof ContentShapes;
export interface ContentEntry<K extends ContentKey> { data: ContentShapes[K]; version: number; updatedAt: string | null }
export type ContentSnapshot = { [K in ContentKey]: ContentEntry<K> };

export interface BlogPostInput {
  slug: string;
  lang: 'en' | 'de';
  title: string;
  excerpt: string;
  body: string;
  coverImageUrl: string;
  author: string;
  tags: string[];
  status: 'draft' | 'published';
}
export interface AdminBlogPost extends BlogPostInput { id: string; publishedAt: string | null; createdAt: string; updatedAt: string }

/**
 * The server only accepts content changes within five minutes of a password
 * (or MFA) check on this session. Remember when that window closes so a batch
 * of edits needs one check, not one per save; the server still decides.
 */
let freshUntil = 0;
export const hasFreshAuthentication = () => Date.now() < freshUntil - 10_000;
export async function authenticate(password: string, mfaCode?: string) {
  const { stepUpToken } = await superAdminApi.reauthenticate(password, mfaCode);
  freshUntil = new Date(stepUpToken.replace('server-session.', '')).getTime() || Date.now() + 4 * 60_000;
}
export const clearFreshAuthentication = () => { freshUntil = 0; };

export const websiteApi = {
  async content() {
    return (await superAdminRequest<{ data: ContentSnapshot }>('/api/v1/super-admin/site-content')).data;
  },
  async saveContent<K extends ContentKey>(key: K, expectedVersion: number, data: ContentShapes[K], reason: string) {
    return (await superAdminRequest<{ data: ContentEntry<K> }>(`/api/v1/super-admin/site-content/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ expectedVersion, data, reason }),
    })).data;
  },
  async posts() {
    return (await superAdminRequest<{ data: AdminBlogPost[] }>('/api/v1/super-admin/blog')).data;
  },
  async createPost(post: BlogPostInput, reason: string) {
    return (await superAdminRequest<{ data: AdminBlogPost }>('/api/v1/super-admin/blog', { method: 'POST', body: JSON.stringify({ post, reason }) })).data;
  },
  async updatePost(id: string, post: BlogPostInput, reason: string) {
    return (await superAdminRequest<{ data: AdminBlogPost }>(`/api/v1/super-admin/blog/${encodeURIComponent(id)}`, { method: 'PUT', body: JSON.stringify({ post, reason }) })).data;
  },
  async deletePost(id: string, reason: string) {
    await superAdminRequest(`/api/v1/super-admin/blog/${encodeURIComponent(id)}`, { method: 'DELETE', body: JSON.stringify({ reason }) });
  },
  async setPlan(organizationId: string, plan: 'Trial' | 'Team' | 'Business' | 'Enterprise', reason: string) {
    await superAdminRequest(`/api/v1/super-admin/organizations/${encodeURIComponent(organizationId)}/plan`, { method: 'PUT', body: JSON.stringify({ plan, reason }) });
  },
};

export type { SiteContent };
