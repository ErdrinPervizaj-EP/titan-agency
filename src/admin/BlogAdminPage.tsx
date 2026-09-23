import { useCallback, useEffect, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Badge, Button, Card, CardHeader, EmptyState, Table, Td, Th } from './ui';
import { ErrorState, LoadingState, PageIntro } from './components';
import { useSuperAdminToast } from './toast';
import PublishDialog from './PublishDialog';
import BlogBody from '../components/BlogBody';
import { websiteApi, type AdminBlogPost, type BlogPostInput } from './website-api';

const EMPTY: BlogPostInput = { slug: '', lang: 'en', title: '', excerpt: '', body: '', coverImageUrl: '', author: 'Titan Network', tags: [], status: 'draft' };
const slugify = (title: string) => title.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 120);

export default function BlogAdminPage() {
  const { push } = useSuperAdminToast();
  const [posts, setPosts] = useState<AdminBlogPost[] | null>(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<{ id: string | null; post: BlogPostInput } | null>(null);
  const [confirm, setConfirm] = useState<'save' | 'delete' | null>(null);

  const load = useCallback(async () => {
    setError('');
    try { setPosts(await websiteApi.posts()); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Could not load posts.'); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  if (error) return <ErrorState message={error} onRetry={() => void load()} />;
  if (!posts) return <LoadingState />;

  if (editing) {
    const { post } = editing;
    const set = (patch: Partial<BlogPostInput>) => setEditing({ ...editing, post: { ...post, ...patch } });
    const valid = post.title.trim() && post.excerpt.trim() && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(post.slug) && post.slug.length >= 3 && post.author.trim();
    return (
      <div className="space-y-5">
        <PageIntro eyebrow="Blog" title={editing.id ? 'Edit post' : 'New post'} description="Posts use light formatting: ## heading, - list item, **bold**, [link](https://…)." actions={
          <>
            <Button type="button" variant="outline" className="h-9 px-3 text-body-sm" onClick={() => setEditing(null)}>Back to posts</Button>
            {editing.id && <Button type="button" variant="danger" className="h-9 px-3 text-body-sm" icon={Trash2} onClick={() => setConfirm('delete')}>Delete</Button>}
            <Button type="button" className="h-9 px-3 text-body-sm" disabled={!valid} onClick={() => setConfirm('save')}>{post.status === 'published' ? 'Publish' : 'Save draft'}</Button>
          </>
        } />
        <div className="grid gap-5 xl:grid-cols-2">
          <Card>
            <CardHeader icon={FileText} title="Post" />
            <div className="space-y-4 p-5">
              <label className="block text-2xs font-semibold text-ink-soft">Title
                <input className="input mt-1.5" value={post.title} maxLength={160} onChange={(e) => set({ title: e.target.value, ...(editing.id ? {} : { slug: slugify(e.target.value) }) })} />
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="block text-2xs font-semibold text-ink-soft sm:col-span-2">Web address (slug)
                  <input className="input mt-1.5 font-mono" value={post.slug} maxLength={120} onChange={(e) => set({ slug: slugify(e.target.value) })} />
                  <span className="mt-1 block font-normal text-ink-muted">/blog/{post.slug || '…'}</span>
                </label>
                <label className="block text-2xs font-semibold text-ink-soft">Language
                  <select className="input mt-1.5" value={post.lang} onChange={(e) => set({ lang: e.target.value as 'en' | 'de' })}><option value="en">English</option><option value="de">German</option></select>
                </label>
              </div>
              <label className="block text-2xs font-semibold text-ink-soft">Summary (shown in the list)
                <textarea className="input mt-1.5 min-h-20" value={post.excerpt} maxLength={400} onChange={(e) => set({ excerpt: e.target.value })} />
              </label>
              <label className="block text-2xs font-semibold text-ink-soft">Body
                <textarea className="input mt-1.5 min-h-72 font-mono text-body-sm" value={post.body} maxLength={60000} onChange={(e) => set({ body: e.target.value })} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-2xs font-semibold text-ink-soft">Author<input className="input mt-1.5" value={post.author} maxLength={120} onChange={(e) => set({ author: e.target.value })} /></label>
                <label className="block text-2xs font-semibold text-ink-soft">Tags (comma separated)<input className="input mt-1.5" value={post.tags.join(', ')} onChange={(e) => set({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 8) })} /></label>
              </div>
              <label className="block text-2xs font-semibold text-ink-soft">Cover image (optional https:// link)<input className="input mt-1.5" value={post.coverImageUrl} onChange={(e) => set({ coverImageUrl: e.target.value })} /></label>
              <label className="inline-flex items-center gap-2 text-body-sm text-ink"><input type="checkbox" checked={post.status === 'published'} onChange={(e) => set({ status: e.target.checked ? 'published' : 'draft' })} /> Published on the website</label>
            </div>
          </Card>
          <Card>
            <CardHeader icon={FileText} title="Preview" />
            <div className="p-5">
              <h2 className="text-2xl font-bold text-ink">{post.title || 'Untitled'}</h2>
              <p className="mt-2 text-ink-soft">{post.excerpt}</p>
              <BlogBody body={post.body} />
            </div>
          </Card>
        </div>
        {confirm && (
          <PublishDialog
            title={confirm === 'delete' ? 'Delete this post' : post.status === 'published' ? 'Publish post' : 'Save draft'}
            description={confirm === 'delete' ? 'The post is removed from the website and cannot be restored.' : post.status === 'published' ? 'The post goes live on /blog.' : 'Drafts are never shown on the website.'}
            confirmLabel={confirm === 'delete' ? 'Delete' : 'Save'}
            danger={confirm === 'delete'}
            onClose={() => setConfirm(null)}
            onConfirm={async (reason) => {
              if (confirm === 'delete' && editing.id) {
                await websiteApi.deletePost(editing.id, reason);
                push('Post deleted');
                setEditing(null);
              } else {
                const saved = editing.id ? await websiteApi.updatePost(editing.id, post, reason) : await websiteApi.createPost(post, reason);
                push(saved.status === 'published' ? 'Post published' : 'Draft saved');
                setEditing({ id: saved.id, post: { slug: saved.slug, lang: saved.lang, title: saved.title, excerpt: saved.excerpt, body: saved.body, coverImageUrl: saved.coverImageUrl, author: saved.author, tags: saved.tags, status: saved.status } });
              }
              await load();
            }}
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <PageIntro eyebrow="Website" title="Blog" description="Posts for titannetwork.io/blog. Drafts stay private." actions={
        <Button type="button" className="h-9 px-3 text-body-sm" icon={Plus} onClick={() => setEditing({ id: null, post: { ...EMPTY } })}>New post</Button>
      } />
      <Card className="overflow-hidden">
        {posts.length === 0 ? (
          <EmptyState icon={FileText} title="No posts yet" hint="Write the first one with New post." />
        ) : (
          <Table label="Blog posts">
            <thead><tr><Th>Title</Th><Th>Language</Th><Th>Status</Th><Th>Published</Th><Th /></tr></thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <Td><span className="font-semibold text-ink">{post.title}</span><span className="block text-2xs text-ink-muted">/blog/{post.slug}</span></Td>
                  <Td>{post.lang.toUpperCase()}</Td>
                  <Td><Badge tone={post.status === 'published' ? 'ok' : 'neutral'}>{post.status === 'published' ? 'Published' : 'Draft'}</Badge></Td>
                  <Td>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}</Td>
                  <Td><Button type="button" variant="outline" className="h-8 px-3 text-body-sm" onClick={() => setEditing({ id: post.id, post: { slug: post.slug, lang: post.lang, title: post.title, excerpt: post.excerpt, body: post.body, coverImageUrl: post.coverImageUrl, author: post.author, tags: post.tags, status: post.status } })}>Edit</Button></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card>
    </div>
  );
}
