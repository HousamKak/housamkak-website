import { site } from '../data/site';

export type Entry = { title: string; url: string; description: string; date: Date; kind: string };

const clean = (s: string) =>
  s.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/\s*[20132014]\s*/g, ', ');

// Papers are not in the blog RSS, so they are listed here.
const PAPERS: Entry[] = [
  { title: 'Social Starting Capital', url: `${site.blog}/papers/social-starting-capital/`, kind: 'Paper',
    description: 'A research paper, published in full on the blog.', date: new Date('2026-10-05') },
];

const FALLBACK: Entry[] = [
  { title: 'From a logo brief to a voxel engine', url: `${site.blog}/posts/kiddycody-voxel-engine/`, kind: 'Post',
    description: "My brother asked for a logo for his kids' coding academy. I ended up refactoring the logo into SVG blocks, wiring a CLI to an LLM, and deciding to rewrite the whole thing in C++.", date: new Date('2026-04-22') },
  { title: 'Interactive Julia Sets with Wilson', url: `${site.blog}/posts/interactive-julia-sets/`, kind: 'Post',
    description: 'Exploring Julia sets with an interactive GPU-accelerated fractal viewer, running in your browser.', date: new Date('2026-04-16') },
  { title: 'Hello World: Building This Blog', url: `${site.blog}/posts/hello-world/`, kind: 'Post',
    description: 'How I built this blog from scratch using Astro 5, Tailwind CSS v4, and MDX.', date: new Date('2026-04-16') },
];

let cache: Entry[] | null = null;
export async function writing(): Promise<Entry[]> {
  if (cache) return cache;
  let posts = FALLBACK;
  try {
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 8000);
    const xml = await (await fetch(`${site.blog}/rss.xml`, { signal: ctl.signal })).text(); clearTimeout(t);
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, it]) => {
      const g = (tag: string) => clean((it.match(new RegExp(`<${tag}>([\s\S]*?)</${tag}>`)) || [, ''])[1]!.replace(/<!\[CDATA\[|\]\]>/g, ''));
      return { title: g('title'), url: g('link'), description: g('description'), date: new Date(g('pubDate')), kind: 'Post' };
    }).filter((e) => e.title && e.url);
    if (items.length) posts = items;
  } catch { /* offline build: keep fallback */ }
  cache = [...posts, ...PAPERS].sort((a, b) => +b.date - +a.date);
  return cache;
}
