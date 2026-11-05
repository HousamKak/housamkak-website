import fs from 'node:fs';
import path from 'node:path';
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'work'>;
export type Media = {
  hero: string | null;
  gallery: { src: string; alt: string; caption?: string }[];
  video: { src: string; poster?: string } | null;
  og: string | null;
  heroAlt?: string;
  turntables: { src: string; poster?: string; alt: string; caption?: string }[];
};

let mediaCache: Record<string, Media> | null = null;
export function media(slug: string): Media {
  if (!mediaCache) {
    try {
      mediaCache = JSON.parse(fs.readFileSync(path.resolve('src/data/media.json'), 'utf8'));
    } catch { mediaCache = {}; }
  }
  const m = mediaCache![slug] ?? ({} as Partial<Media>);
  const exists = (p?: string | null) => !!p && fs.existsSync(path.resolve('public' + p));
  return {
    hero: exists(m.hero) ? m.hero! : null,
    gallery: (m.gallery ?? []).filter((g) => exists(g.src)),
    video: m.video && exists(m.video.src) ? m.video : null,
    og: exists(m.og) ? m.og! : null,
    heroAlt: m.heroAlt,
    turntables: (m.turntables ?? []).filter((t) => exists(t.src)),
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
