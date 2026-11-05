import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type Shot = { src: string; alt: string; caption?: string; kind?: 'desktop' | 'mobile'; tool?: string };
export type Media = {
  hero: string | null;
  heroAlt?: string;
  heroCaption?: string;
  shots: Shot[];        // real screenshots from running the app (src/data/shots/<slug>.json)
  gallery: Shot[];      // curated stills and renders (src/data/media.json)
  turntables: { src: string; poster?: string; alt: string; caption?: string }[];
  video: { src: string; poster?: string } | null;
  og: string | null;
};

const exists = (p?: string | null) => !!p && fs.existsSync(path.resolve('public' + p));
const readJson = (p: string) => { try { return JSON.parse(fs.readFileSync(path.resolve(p), 'utf8')); } catch { return null; } };

let mediaCache: Record<string, any> | null = null;
export function media(slug: string): Media {
  mediaCache ??= readJson('src/data/media.json') ?? {};
  const m = mediaCache![slug] ?? {};
  const shots: Shot[] = (readJson(`src/data/shots/${slug}.json`) ?? []).filter((s: Shot) => exists(s.src));
  const gallery: Shot[] = (m.gallery ?? []).filter((g: Shot) => exists(g.src));
  const curatedHero = exists(m.hero) ? m.hero : null;
  // Prefer a real screenshot of the running product over a curated still, except for BlockForge, whose renders are the product.
  const useShot = shots.length > 0 && (slug !== 'blockforge' || !curatedHero);
  return {
    hero: useShot ? shots[0].src : curatedHero,
    heroAlt: useShot ? shots[0].alt : m.heroAlt,
    heroCaption: useShot ? shots[0].caption : undefined,
    shots: useShot ? shots.slice(1) : shots,
    gallery,
    turntables: (m.turntables ?? []).filter((t: any) => exists(t.src)),
    video: m.video && exists(m.video.src) ? m.video : null,
    og: exists(m.og) ? m.og : null,
  };
}

export async function allWork(): Promise<Work[]> {
  const items = await getCollection('work', (e) => !e.data.draft);
  return items.sort((a, b) => a.data.tier - b.data.tier || a.data.order - b.data.order);
}

export const CAT: Record<string, string> = {
  'ai-agents': 'AI and agents', 'dev-tools': 'Developer tools', 'graphics-3d': 'Graphics and 3D', games: 'Games',
  'business-software': 'Business software', infrastructure: 'Infrastructure', 'engineering-hardware': 'Engineering and hardware',
  'research-simulation': 'Research', 'media-creative': 'Film and media', mobile: 'Mobile', 'consumer-apps': 'Consumer apps',
  startup: 'Ventures', enterprise: 'Enterprise',
};
export const tierLabel = (t: number) => (t === 1 ? 'Flagship' : t === 2 ? 'Case study' : 'Lab');
export const host = (u?: string) => (u ? u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : '');
