import { parseHex, type CatalogCategory } from '@/core';

// Palette rotation, only for categories the store left without a valid colour.
const ROTATION = ['#E2A21B', '#C63B24', '#4E7A3A', '#3A1F3B'];

/** A category's own colour from the POS (validated), or the palette's. */
export const swatch = (category: CatalogCategory | undefined, index: number): string =>
  (parseHex(category?.backgroundColor) ? category!.backgroundColor! : null) ?? ROTATION[index % ROTATION.length];
