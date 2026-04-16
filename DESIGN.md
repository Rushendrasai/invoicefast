# Design Brief

## Direction

InvoiceFast — A professional, light-mode invoice creator with rich indigo blue accents and crisp typography. Optimized for paper-like A4 PDF export and client-side form entry.

## Tone

Clean and trustworthy minimalism. Professional without rigidity, accessible without clutter. Invoice aesthetic commands clarity and hierarchy.

## Differentiation

PDF preview styled as real printed paper with cream tint and crisp typography. Dual-mode layout: wide-screen split (form left, preview right) and mobile toggle. Ad banner zones clearly delineated with dashed borders.

## Color Palette

| Token      | OKLCH            | Role                                   |
| ---------- | ---------------- | -------------------------------------- |
| background | 0.98 0.008 230   | Light cool off-white, main surface     |
| foreground | 0.18 0.015 230   | Deep cool neutral, body text           |
| primary    | 0.42 0.14 240    | Rich indigo blue, headers & CTAs       |
| accent     | 0.6 0.15 170     | Cool teal, secondary actions           |
| card       | 1.0 0.004 230    | Pure white, form sections              |
| muted      | 0.94 0.01 230    | Light neutral, subtle backgrounds      |
| border     | 0.9 0.008 230    | Light neutral, dividers                |

## Typography

- Display: Space Grotesk — geometric, confident, headers and section titles
- Body: Figtree — modern, readable, form labels and paragraph text
- Scale: Hero `text-4xl font-bold tracking-tight`, h2 `text-2xl font-semibold`, label `text-xs font-semibold uppercase`, body `text-base`

## Elevation & Depth

Subtle layering: white cards on light backgrounds with minimal shadows. Primary blue header bar anchors the page. Ad banners use dashed borders instead of shadows for clarity.

## Structural Zones

| Zone       | Background               | Border                   | Notes                                             |
| ---------- | ------------------------ | ------------------------ | ------------------------------------------------- |
| Header     | Primary blue (0.42 0.14) | None                     | White text, app title, sticky on mobile          |
| Form       | Background (0.98)        | —                        | Spacious card-based layout, light inputs         |
| Ad Top     | Muted/20 (0.94 0.01)     | Dashed light border      | Min 80px, placeholder for ads                    |
| Ad Bottom  | Muted/20 (0.94 0.01)     | Dashed light border      | Min 80px, placeholder for ads                    |
| Preview    | Card white (1.0)         | Shadow elevation         | Paper-like appearance, A4 proportions            |
| Footer     | Muted/10 (0.94 0.01)     | Border-top light neutral | Copyright, privacy links, small text             |

## Spacing & Rhythm

Generous 1.5rem gaps between sections. Form inputs use 0.75rem internal padding. Card spacing creates visual grouping. Consistent 2rem margins for main content areas. Ad banners: full-width with 2rem top/bottom spacing.

## Component Patterns

- Buttons: Primary blue background, white text, rounded-md, hover darkens primary. Accent buttons (download) use teal. Destructive (delete row) use red.
- Cards: White background, subtle shadow (0 1px 3px), rounded-md, border-light for inputs
- Ad Banners: Dashed border, light gray background, centered placeholder text, 80px min-height
- Input Fields: Light border, rounded-sm, focus:ring-primary, light gray placeholder text

## Motion

- Entrance: Smooth fade-in (0.3s cubic-bezier) for form sections and preview updates
- Hover: Primary and accent buttons scale 102% with shadow deepening (0.3s smooth)
- Decorative: None — focus on information clarity

## Constraints

- Light mode only (no dark mode for initial release)
- No full-page gradients; depth via layering and shadows only
- Typography: exactly 2 fonts (Space Grotesk + Figtree)
- Border-radius: 0.5rem max (no pill-shaped buttons, maintains professional edge)
- PDF preview must show real A4 proportions and crisp, selectable text

## Signature Detail

Dual-column layout collapses responsively to mobile stack, maintaining form-left / preview-right precedence. Ad banners with dashed borders create clear commercial boundaries without visual noise.
