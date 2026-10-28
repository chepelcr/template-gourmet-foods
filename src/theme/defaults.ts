import type { ThemeDefaults } from '@/core';

/** The template's own accent and surfaces; the store's branding overrides the accent. */
export const themeDefaults: ThemeDefaults = {
  brand: '#E2A21B',
  brand2: '#3A1F3B',
  surface: '#F4EFF3',
  // Raised cards are the lightest reading surface in dark mode.
  darkSurface: '#322738',
  displayFont: '"Zilla Slab", "Noto Serif", Georgia, serif',
  bundledFonts: ['Zilla Slab', 'Manrope'],
  displayFallback: 'Georgia, serif',
};
