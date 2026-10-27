import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#E2A21B',
  brand2: '#3A1F3B',
  surface: '#F4EFF3',
  displayFont: '"Zilla Slab", "Noto Serif", Georgia, serif',
  bundledFonts: ['Zilla Slab', 'Manrope'],
  displayFallback: 'Georgia, serif',
};
