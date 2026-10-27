# Gourmet Foods — design plan

**Concept: Despensa.** A fine pantry. Products are preserves on aubergine
shelves, each with an oval label and a saffron price seal; the menu ("la
carta") lists every item with a dotted leader to its price; the hero is one
big preserve label beside a jar holding the store's photo.

Serves: delis and gourmet pantries, chocolatiers, coffee roasters, caterers
(platters and finger food sold as made-to-order services).

## Palette

| Token | Hex | Role |
|---|---|---|
| aubergine | `#3A1F3B` | header, hero, shelves section, footer, headings |
| saffron | `#E2A21B` | the store's accent (org primary): seals, main buttons, the CTA block |
| saffron text | `#8A5A00` | the accent as text on the wall and labels |
| tomato | `#C63B24` | offers, low stock |
| basil | `#4E7A3A` | category swatch only |
| label | `#FFFDF8` | labels, the menu card |
| wall | `#F4EFF3` | page (a pale aubergine tint, not cream) |
| ink | `#2A1A2B` | text |

Contrast (computed): ink on wall 14.6:1, on label 16.1:1 · soft ink
`#665566` on wall 6.1:1 · aubergine on saffron 6.5:1 (button text) · saffron
text on wall 5.3:1 · tomato on label 5.1:1 · label on aubergine 14.4:1 ·
lilac `#D8C8D9` on aubergine 9.2:1.

## Type

**Zilla Slab** (500–700) for display and prices — a slab with the weight of a
printed label — and **Manrope** for text. No all-caps eyebrows, no monospace.

## Layout

```
HOME (aubergine header and hero)
┌─────────────────────────────────────────┬──────────────────────┐
│ (   oval label, saffron border draws   )│   ▭ saffron lid       │
│ (   Despensa fina                       )│  ╭────────╮           │
│ (   Quesos, curados y conservas         )│  │ photo  │  jar      │
│ (   [Ver la carta] [Encargar]           )│  ╰────────╯           │
└─────────────────────────────────────────┴──────────────────────┘
 La carta: a menu card, two columns, each category with its first items:
   Queso maduro de la casa ··········· ₡6 800
 En la mesa hoy (aubergine): jars on shelves — photo, oval label, seal
 benefits as seals · story · saffron CTA block
CATALOG: title + count + view (shelf ⇄ carta) │ search + Filtros (sheet on
phones) │ swatch chips │ groups headed "● Quesos ····· description"
PRODUCT: photo with a seal │ name, price, text, a label with dotted
leaders (category, type, order ahead, availability), add (the seal stamps)
```

## Signature

The label and its seal (`HeroLabel`, `JarCard`, `Seal`, `MenuList`,
`.shelf-grid`). The hero label's border draws once on load (CSS
stroke-dashoffset); under reduced motion it is simply drawn. Adding an item
stamps its seal. A grid row stands on one shelf: each item carries its stretch
of board into the gaps. No WebGL in this template.

## Changed from the generic default

- No "cream + high-contrast serif + terracotta": aubergine and saffron with a
  slab face, a pale aubergine wall instead of cream.
- Prices are seals and menu leaders, not a line under every card.
- The catalog has a menu view for scanning ("carta") next to the shelf.
