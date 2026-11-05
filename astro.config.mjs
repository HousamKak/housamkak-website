import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Review notes for Housam live in HTML comments inside content files. Strip them so they never ship.
function stripHtmlComments() {
  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children
      .map((c) => (c.type === 'html' ? { ...c, value: c.value.replace(/<!--[\s\S]*?-->/g, '') } : c))
      .filter((c) => !(c.type === 'html' && c.value.trim() === ''));
    node.children.forEach(walk);
  };
  return (tree) => walk(tree);
}

export default defineConfig({
  site: 'https://www.housamkak.com',
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: { remarkPlugins: [stripHtmlComments] },
  build: { format: 'directory' },
});
