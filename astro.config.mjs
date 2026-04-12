// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://ronnakrit.net',
  base: '/',
  
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()]
  },
  
  // GitHub Pages configuration
  output: 'static',
  build: {
    format: 'directory'
  },
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: 'always'
});