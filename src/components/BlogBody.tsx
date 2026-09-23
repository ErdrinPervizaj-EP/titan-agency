import type { ReactNode } from 'react';

/**
 * Renders a blog post's light markdown — ## and ### headings, "- " lists,
 * **bold**, `code` and [links](https://…) — as React elements. It never
 * produces raw HTML, so post text cannot inject markup or scripts, and only
 * http(s) links become clickable.
 */
function inline(text: string, keyPrefix: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\*\*([^*]+)\*\*|`([^`]+)`|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let match: RegExpExecArray | null;
  let n = 0;
  while ((match = pattern.exec(text))) {
    if (match.index > last) parts.push(text.slice(last, match.index));
    const key = `${keyPrefix}-${n++}`;
    if (match[1]) parts.push(<strong key={key} className="font-semibold text-navy-900">{match[1]}</strong>);
    else if (match[2]) parts.push(<code key={key} className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-navy-800">{match[2]}</code>);
    else if (/^https?:\/\//i.test(match[4])) parts.push(<a key={key} href={match[4]} target="_blank" rel="noreferrer noopener" className="font-medium text-indigo-500 underline decoration-indigo-200 underline-offset-4 hover:decoration-indigo-500">{match[3]}</a>);
    else parts.push(match[3]);
    last = pattern.lastIndex;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

export default function BlogBody({ body }: { body: string }) {
  const blocks: ReactNode[] = [];
  const lines = body.replace(/\r\n/g, '\n').split('\n');
  let paragraph: string[] = [];
  let list: string[] = [];

  const flush = () => {
    if (paragraph.length) {
      const key = `p${blocks.length}`;
      blocks.push(<p key={key} className="mt-5 leading-relaxed text-navy-700">{inline(paragraph.join(' '), key)}</p>);
      paragraph = [];
    }
    if (list.length) {
      const key = `l${blocks.length}`;
      blocks.push(<ul key={key} className="mt-5 list-disc space-y-2 pl-6 text-navy-700 marker:text-indigo-400">{list.map((item, i) => <li key={i}>{inline(item, `${key}-${i}`)}</li>)}</ul>);
      list = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) { flush(); continue; }
    const heading = /^(#{2,3})\s+(.*)$/.exec(line);
    if (heading) {
      flush();
      const key = `h${blocks.length}`;
      blocks.push(heading[1] === '##'
        ? <h2 key={key} className="font-display mt-10 text-2xl font-bold text-navy-900">{inline(heading[2], key)}</h2>
        : <h3 key={key} className="font-display mt-8 text-xl font-semibold text-navy-900">{inline(heading[2], key)}</h3>);
      continue;
    }
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (bullet) {
      if (paragraph.length) { const pending = list; list = []; flush(); list = pending; }
      list.push(bullet[1]);
      continue;
    }
    if (list.length) flush();
    paragraph.push(line.trim());
  }
  flush();
  return <div>{blocks}</div>;
}
