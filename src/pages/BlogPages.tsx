import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BookOpen, Lightbulb, Newspaper, PenLine, Rss, Sparkles } from 'lucide-react';
import { useLang, useLocalizedPath, useT } from '../i18n/useLang';
import { publicContent } from '../lib/titandesk-client';
import Seo from '../components/Seo';
import Section, { PageHeader } from '../components/Section';
import BlogBody from '../components/BlogBody';

interface PostSummary { id: string; slug: string; lang: 'en' | 'de'; title: string; excerpt: string; coverImageUrl: string; author: string; tags: string[]; publishedAt: string | null }
interface Post extends PostSummary { body: string }

const dateFormat = (iso: string | null, lang: 'en' | 'de') =>
  iso ? new Date(iso).toLocaleDateString(lang === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

export function BlogListPage() {
  const t = useT();
  const b = t.blog;
  const lang = useLang();
  const lp = useLocalizedPath();
  const [posts, setPosts] = useState<PostSummary[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    setPosts(null);
    setFailed(false);
    publicContent.blogPosts<PostSummary[]>(lang)
      .then((rows) => { if (active) setPosts(rows); })
      .catch(() => { if (active) { setPosts([]); setFailed(true); } });
    return () => { active = false; };
  }, [lang]);

  return (
    <>
      <Seo path="/blog" titleEn="Blog | Titan Network" titleDe="Blog | Titan Network" descriptionEn="Notes from the Titan Network team on IT support, networks, security and building TitanDesk." descriptionDe="Beiträge des Titan-Network-Teams zu IT-Support, Netzwerken, Sicherheit und der Entwicklung von TitanDesk." />
      <PageHeader label={b.tag} title={b.title} intro={b.sub} />
      <Section label={b.latest} title={b.latestTitle} fullWidth decor={{ icons: [BookOpen, PenLine, Newspaper, Lightbulb, Rss, Sparkles], accent: '#7c5cd6' }}>
        {posts === null ? (
          <p role="status" className="text-navy-400">{b.loading}</p>
        ) : posts.length === 0 ? (
          <p className="text-navy-500">{failed ? b.unavailable : b.empty}</p>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`${lp('/blog')}/${post.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-[0_20px_40px_-24px_rgba(65,101,183,0.45)]">
                  {post.coverImageUrl && (
                    <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                      <img src={post.coverImageUrl} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-xs font-medium text-navy-400">{dateFormat(post.publishedAt, lang)}{post.tags.length ? ` · ${post.tags.join(', ')}` : ''}</p>
                    <h2 className="font-display mt-2 text-xl font-semibold text-navy-900 group-hover:text-indigo-500">{post.title}</h2>
                    <p className="mt-2 flex-1 leading-relaxed text-navy-500">{post.excerpt}</p>
                    <span className="mt-5 text-sm font-semibold text-indigo-500">{b.readMore}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}

export function BlogPostPage() {
  const t = useT();
  const b = t.blog;
  const lang = useLang();
  const lp = useLocalizedPath();
  const { slug = '' } = useParams();
  const [post, setPost] = useState<Post | null | 'missing'>(null);

  useEffect(() => {
    let active = true;
    setPost(null);
    publicContent.blogPost<Post>(slug)
      .then((row) => { if (active) setPost(row); })
      .catch(() => { if (active) setPost('missing'); });
    return () => { active = false; };
  }, [slug]);

  if (post === null) return <p role="status" className="mx-auto max-w-3xl px-6 py-32 text-navy-400">{b.loading}</p>;
  if (post === 'missing') {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32">
        <h1 className="font-display text-3xl font-bold text-navy-900">{b.notFound}</h1>
        <Link to={lp('/blog')} className="mt-6 inline-flex items-center gap-1.5 font-semibold text-indigo-500"><ArrowLeft size={16} /> {b.back}</Link>
      </div>
    );
  }

  return (
    <>
      <Seo path={`/blog/${post.slug}`} titleEn={`${post.title} | Titan Network`} titleDe={`${post.title} | Titan Network`} descriptionEn={post.excerpt} descriptionDe={post.excerpt} />
      <article className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-20">
        <Link to={lp('/blog')} className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-400 hover:text-navy-900"><ArrowLeft size={15} /> {b.back}</Link>
        <p className="mt-8 text-sm text-navy-400">{dateFormat(post.publishedAt, lang)} · {post.author}</p>
        <h1 className="font-display text-balance mt-3 text-4xl font-bold leading-tight text-navy-900 sm:text-5xl">{post.title}</h1>
        <p className="mt-5 text-lg leading-relaxed text-navy-500">{post.excerpt}</p>
        {post.coverImageUrl && <img src={post.coverImageUrl} alt="" className="mt-10 w-full rounded-2xl border border-slate-200 object-cover" />}
        <div className="mt-6 border-t border-slate-200 pt-2">
          <BlogBody body={post.body} />
        </div>
        {post.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => <li key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-navy-600">{tag}</li>)}
          </ul>
        )}
      </article>
    </>
  );
}
