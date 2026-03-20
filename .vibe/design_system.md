# Rellax Design System

## Typography

### Fonts
Loaded via `next/font/google` in `app/layout.tsx`.

| Variable | Font | Weights | Usage |
|---|---|---|---|
| `--font-display` | Syne | 400, 600, 700, 800 | Headings, logo, large numbers |
| `--font-mono` | DM Mono | 300, 400, 500 | Labels, eyebrows, captions, code |

Apply via CSS classes defined in `globals.css`:
```css
.font-display { font-family: var(--font-display), serif; }
.font-mono    { font-family: var(--font-mono), monospace; }
```

### Type Scale

| Role | Classes |
|---|---|
| Hero H1 | `font-display text-5xl sm:text-7xl leading-none` |
| Section H2 | `font-display text-4xl sm:text-5xl leading-tight` |
| Card H3 | `font-display text-3xl leading-tight` or `text-xl font-medium` |
| Body | `text-base leading-8` or `text-sm leading-7` |
| Eyebrow / label | `font-mono text-[0.7rem] uppercase tracking-[0.24em]` |
| Caption / footer label | `font-mono text-[0.68rem] uppercase tracking-[0.22em]` |
| Stat value | `font-display text-6xl` |

### Accent pattern
Wrap a word/phrase in `<span>` with an accent color class — used consistently across all section headings:
```tsx
<h2 className="font-display text-4xl ...">
  Main heading
  <span className="text-[var(--rellax-sage)]"> accent word.</span>
</h2>
```

---

## Color Palette

All tokens defined as CSS custom properties in `app/globals.css` under `:root`.

### Brand colors
| Token | Value | Usage |
|---|---|---|
| `--rellax-ink` | `#080809` | Primary text, dark backgrounds, primary buttons |
| `--rellax-ink-2` | `#16161a` | Footer background |
| `--rellax-ink-soft` | `#5c5c6b` | Body text / descriptions |
| `--rellax-ink-muted` | `#9898a8` | Muted labels, placeholders |
| `--rellax-surface` | `#f7f6f3` | Section backgrounds (off-white) |
| `--rellax-surface-2` | `#f0ede6` | Subtle surface variant |
| `--rellax-surface-3` | `#e5e1d8` | Photo grid background, dividers |
| `--rellax-sage` | `#3d6b4f` | Primary accent (green) — headings, buttons |
| `--rellax-gold` | `#9c7a3c` | Secondary accent (gold) — badge, highlight |
| `--rellax-gold-muted` | `#faf3e4` | Gold badge background |
| `--rellax-slate` | `#2d4f72` | Tertiary accent (blue) — data/metrics |
| `--rellax-line` | `rgba(8,8,9,0.08)` | Border color on light backgrounds |

### Section backgrounds
| Background | Usage |
|---|---|
| `bg-white` | Default section, cards |
| `bg-[var(--rellax-surface)]` | Alternate section (ProcessSection) |
| `bg-[var(--rellax-ink)]` | Dark inverted section (engine stats strip) |
| `bg-[var(--rellax-ink-2)]` | Footer |

---

## Spacing & Layout

### Container
`components/global/container.tsx` — wraps all page content:
```tsx
<Container>           // max-w-7xl, auto margins, px-5 sm:px-8
<Container as="section">
<Container className="grid ...">
```

### Section vertical padding
Standard section rhythm — always use one of:
```
py-24 sm:py-32   ← standard sections
py-16            ← footer
py-14            ← card/panel interior
```

### Common layout patterns
```tsx
// Two-column with image + content
"grid lg:grid-cols-2"

// Two-column weighted (text heavy)
"grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"

// Three-column value strip
"grid gap-px bg-black/6 md:grid-cols-3"

// Four-column stats row
"grid gap-px overflow-hidden rounded-[2rem] border ... md:grid-cols-3"

// Four-column process steps
"grid gap-5 md:grid-cols-2 xl:grid-cols-4"

// Footer: logo + 3 link columns
"grid gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]"
```

---

## Border Radius

| Token | Usage |
|---|---|
| `rounded-full` | Buttons, pills, badge labels, input |
| `rounded-[1.5rem]` | Process step cards |
| `rounded-[2rem]` | Feature split cards, engine panel, photo grid |

---

## Shadows

| Class | Usage |
|---|---|
| `shadow-[0_20px_60px_rgba(8,8,9,0.04)]` | Subtle card lift (process cards) |
| `shadow-[0_30px_80px_rgba(8,8,9,0.05)]` | CTA / panel card |
| `shadow-[0_30px_80px_rgba(8,8,9,0.12)]` | Engine metric card (dark) |
| `shadow-[0_10px_30px_rgba(8,8,9,0.16)]` | Primary button |

---

## Components

### Button — `components/global/button.tsx`
```tsx
<Button href="/signup">Sign up free</Button>               // primary (dark bg, white text)
<Button href="/login" variant="secondary">Log in</Button>  // outlined
<Button href="#how" variant="ghost">How it works</Button>  // ghost (nav links)

// Custom color override — use ! prefix to guarantee override
<Button href="/signup" className="bg-white !text-[var(--rellax-ink)]">
  Start free
</Button>
```

Variants:
- **primary**: `bg-[var(--rellax-ink)] text-white` + subtle shadow + hover lift
- **secondary**: `border border-[var(--rellax-line)] bg-white` + hover lift
- **ghost**: `text-[var(--rellax-ink-soft)]` + hover bg

Base: `inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition`

### Container — `components/global/container.tsx`
```tsx
<Container>                         // renders as <div>
<Container as="section">           // semantic override
<Container className="grid ...">   // append classes
```
Always: `mx-auto w-full max-w-7xl px-5 sm:px-8`

### SectionHeading — `components/global/section-heading.tsx`
```tsx
<SectionHeading
  eyebrow="How it works"
  title="A precise path from signal to"
  accent="readiness."
  description="..."
  align="left"    // or "center"
/>
```
Renders: pill eyebrow label → H2 with optional accent span → body paragraph.

### BrandLogo — `components/global/brand-logo.tsx`
```tsx
<BrandLogo />                  // dark (default)
<BrandLogo tone="light" />     // white — for dark backgrounds (footer, hero)
<BrandLogo href="/#top" />     // custom link
```

---

## Borders

On light backgrounds:
```
border border-black/6    ← cards, panels
border border-black/8    ← inputs
border-b border-white/8  ← footer divider
```

On dark backgrounds:
```
border border-white/10   ← engine section panels
border border-white/20   ← hero badge, secondary buttons in hero
```

---

## Hero Section Pattern

Dark full-viewport section with background image + double scrim:

```tsx
<section className={styles.heroSection}>    {/* position:relative; overflow:hidden; bg:#080809 */}
  <div className={styles.heroBackground} />  {/* absolute fill, background-image */}
  <div className={styles.heroScrim} />       {/* absolute fill, gradient overlay */}
  <Container className="relative z-10 flex min-h-[calc(100vh-4rem)] flex-col justify-center py-24">
    {/* white text content */}
  </Container>
</section>
```

Scrim (from `home-page.module.css`):
```css
background:
  linear-gradient(110deg, rgba(8,8,9,0.76) 0%, rgba(8,8,9,0.52) 46%, rgba(8,8,9,0.18) 100%),
  linear-gradient(180deg, rgba(8,8,9,0.1) 55%, rgba(255,255,255,0.2) 100%);
```

Hero badge pill:
```tsx
<div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/80 backdrop-blur">
  <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(74,222,128,0.18)]" />
  Label text
</div>
```

---

## Eyebrow / Badge Pill Pattern

Reused across sections with slight variations:

```tsx
// On white background (SectionHeading)
<span className="inline-flex rounded-full border border-[var(--rellax-line)] bg-white/70 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-[var(--rellax-ink-muted)]">
  Eyebrow label
</span>

// On dark background (inside feature card)
<div className="inline-flex rounded-full border border-black/6 bg-white px-3 py-1 text-xs uppercase tracking-[0.2em] text-[var(--rellax-ink-muted)]">
  Eyebrow label
</div>

// Gold variant (early access / special callout)
<div className="inline-flex items-center gap-2 rounded-full border border-[rgba(156,122,60,0.18)] bg-[var(--rellax-gold-muted)] px-4 py-2 text-xs uppercase tracking-[0.22em] text-[var(--rellax-gold)]">
  <span className="size-2 rounded-full bg-[var(--rellax-gold)]" />
  Label
</div>
```

---

## CSS Architecture

- **Framework**: Tailwind v4 via `@import "tailwindcss"` in `globals.css`
- **CSS Layers order**: `theme → base → components → utilities`
- **Critical rule**: Any plain CSS written outside `@layer` beats Tailwind utilities. Always wrap custom base resets in `@layer base { }`.
- **CSS Modules**: Used for complex multi-class patterns (hero background/scrim, photo grid layout). File: `home-page.module.css`.
- **Arbitrary values**: Used freely — e.g. `tracking-[0.24em]`, `rounded-[2rem]`, `text-[var(--rellax-ink)]`.
- **`!` prefix**: Use `!text-[...]` / `!bg-[...]` when a className prop must override a component's built-in variant class.

---

## File Structure

```
app/
  globals.css          ← CSS tokens, @layer base reset, font classes
  layout.tsx           ← font loading, html/body setup

components/
  global/
    button.tsx         ← Button (primary/secondary/ghost)
    container.tsx      ← max-w-7xl wrapper
    brand-logo.tsx     ← Rellax wordmark (dark/light)
    section-heading.tsx ← eyebrow + H2 + description

  home/
    data.ts            ← all static content arrays (HERO_STATS, VALUE_CARDS, etc.)
    home-page.module.css ← CSS Modules for hero & photo grid
    home-page.tsx      ← page composition
    site-header.tsx    ← sticky nav
    site-footer.tsx    ← footer with link columns
    hero-section.tsx
    value-strip.tsx
    process-section.tsx
    feature-split-section.tsx
    engine-section.tsx
    photo-grid-section.tsx
```
