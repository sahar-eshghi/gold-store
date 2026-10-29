# ROYAL ATELIER — Design System

## Direction

Luxury jewellery house: restrained editorial composition, dark royal-green surfaces, fine gold detailing, warm paper backgrounds and deep brown supporting tones. Product imagery and negative space carry the visual hierarchy. The UI is Persian RTL, with English brand typography as a secondary layer.

## Palette

- `--forest: #14382d` — primary brand surface and key controls.
- `--forest-deep: #0c251e` — hero/footer and deep contrast.
- `--gold: #d6b36a` — main accent, primary CTA and fine details.
- `--gold-light: #ecd9a8` — text on deep green.
- `--gold-dark: #9e783b` — accents and headings on light backgrounds.
- `--brown: #38261d` — product pricing and warm dark text.
- `--paper: #f7f4ed` / `--paper-deep: #eee8dc` — page and alternate section backgrounds.
- `--white: #fffdf8` — forms and surfaces.
- `--ink: #28241f`, `--muted: #82796e`, `--line: rgba(56,38,29,.16)` — text hierarchy and dividers.

## Typography

- Persian UI: Estedad, with a system fallback.
- Latin brand/display: Playfair Display.
- Utility labels: DM Sans.
- Use compact uppercase labels for English metadata, generous line-height for Persian paragraphs, and clear distinction between section headings, product names and prices.

## Layout and shape

- RTL by default; header, filter toolbar and admin data tables should preserve usable reading order.
- Content width: 88% with a 1240px cap; smaller gutters at mobile breakpoints.
- Product catalogue: four columns on wide screens, three on medium screens, two on mobile.
- Sharp/small-radius geometry throughout; gold lines and whitespace provide separation instead of nested rounded cards.
- Responsive breakpoints: 1000px, 700px, 380px.

## Interaction rules

- Primary action: gold background with dark green text.
- Secondary action: transparent surface with a visible green border.
- Disabled inventory controls must remain visibly disabled.
- Filters must update the result count and empty state.
- Cart quantity cannot exceed the displayed local stock count.
- Modal forms must display inline validation and explicit demo limitations.
- Honor `prefers-reduced-motion` and keep keyboard focus visible.

## Production boundary

This design system covers the static prototype only. Authentication, payments, order processing and shared inventory require a separate secured backend and are not implied by these visual components.
