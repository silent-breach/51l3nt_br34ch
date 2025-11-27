// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  site: 'https://silent-breach.github.io',
  base: '/51l3nt_br34ch',
  // Ensure Vite prebundles GSAP properly in dev to avoid Outdated Optimize Dep errors
  vite: {
    optimizeDeps: {
      include: ['gsap', 'gsap/ScrollTrigger'],
    },
    // Prevent SSR from trying to externalize gsap (even though we use it client-only)
    ssr: {
      noExternal: ['gsap'],
    },
  },
  markdown: {
    rehypePlugins: [
      // Fix image paths to include base
      () => {
        return (tree) => {
          const visit = (/** @type {any} */ node) => {
            if (node.type === 'element' && node.tagName === 'img' && node.properties && node.properties.src) {
              const src = node.properties.src;
              // Only modify absolute paths that don't already have the base
              if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('/51l3nt_br34ch/')) {
                node.properties.src = '/51l3nt_br34ch' + src;
              }
            }
            if (node.children) {
              node.children.forEach(visit);
            }
          };
          visit(tree);
        };
      }
    ]
  }
});
