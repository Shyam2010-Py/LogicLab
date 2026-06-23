# LogicLab — Complete Pedagogical Guide

A comprehensive guide to using LogicLab effectively, understanding how it works, and extending it.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Design System](#design-system)
3. [Module-by-Module Walkthrough](#module-by-module-walkthrough)
4. [How the Code Works](#how-the-code-works)
5. [Extending LogicLab](#extending-logiclab)
6. [Future Improvements](#future-improvements)

---

## Project Overview

**LogicLab** is structured as a **single-page-application (SPA) without a router** — instead, each module is its own static HTML page. Shared chrome (sidebar, bottom nav, theme toggle) is injected by `js/components.js` at runtime, eliminating duplication while keeping the codebase simple and SEO-friendly.

### Key Architectural Decisions

| Decision | Reason |
|----------|--------|
| Pure static HTML | GitHub Pages compatible, no build step |
| Vanilla JS | Zero dependencies, fast load |
| Component injection | DRY without a framework |
| LocalStorage | Theme + history persistence |
| SVG for circuits | Crisp at any zoom level, themeable |
| CSS Custom Properties | Theme switching via `data-theme` |

---

## Design System

### Color Tokens

```css
--primary: #2563EB;      /* Action, links, highlights */
--secondary: #0F172A;    /* Dark backgrounds */
--accent: #06B6D4;       /* Secondary highlight */
--success: #22C55E;      /* Correct / true states */
--warning: #F59E0B;      /* Caution / carry bits */
--danger: #EF4444;       /* Errors */
```

### Typography
- **System UI fonts** for native feel
- **Monospace** for binary/code display
- Base size: 15px
- Heading scale: 1.0 / 1.25 / 1.5 / 1.875 / 2.25 rem

### Spacing Scale
- 0.5rem → 1rem → 1.5rem → 2rem → 3rem
- Cards: `padding: 1.5rem`
- Sections: `margin-bottom: 3rem`

---

## Module-by-Module Walkthrough

### 1. Home Page (`index.html`)
The landing page uses three key visual techniques:
- **Animated binary background**: Random 0/1 digits floating upward
- **Circuit decoration**: Concentric circles that pulse subtly
- **Feature cards**: Hoverable cards linking to each module

### 2. Number System Converter
- `parseInt(value, base)` is used for base conversion
- Step-by-step explanation dynamically builds the math
- History persists in `localStorage` (last 10 conversions)
- Validation ensures input matches the selected base

### 3. Logic Gates Simulator
Each gate is defined as an object with:
- `symbol`: visual identifier
- `fn`: pure function `(a, b) => output`
- `bubble`: indicates inversion (NAND/NOR/XNOR)

SVG circuit visualization updates live via the `drawGateSVG` function.

### 4. Truth Table Generator
- Static lookup tables for each gate
- CSV export using Blob + download link
- Pill navigation for quick switching

### 5. Binary Arithmetic
Three algorithms implemented from scratch:
- **Addition**: Bit-by-bit with carry propagation
- **Subtraction**: Borrow-based column method
- **Multiplication**: Convert to decimal, multiply, convert back

### 6-7. Half & Full Adder
Both implement:
- Boolean equations (S, C outputs)
- Interactive toggles for inputs
- SVG circuit diagram with dynamic LED colors

### 8. Flip-Flops
Tabbed interface for SR / JK / D / T. Each tab has:
- Theory with characteristic equation
- Interactive simulator with state log
- Truth table, advantages, applications

### 9. MUX / DEMUX / Encoder / Decoder
Common pattern across these:
- N-to-2^N or 2^N-to-N truth tables
- SVG circuit symbols
- Interactive simulators
- IC package references (74138, 74148, etc.)

### 10. Formula Sheet
Pure HTML/CSS — no JS. Comprehensive tables covering:
- Number system conversions
- Boolean algebra laws
- K-map rules
- Flip-flop equations
- Common conversion table (decimal ↔ all bases)

### 11. Quiz System
- 110+ questions across 9 categories
- 20 random questions per quiz
- Score tracking in `localStorage`
- Resume-in-progress via `sessionStorage`
- Detailed answer review at the end

### 12. Notes
- 11 topic sections covering full syllabus
- Client-side search filter (instant)
- Concise, exam-ready content

---

## How the Code Works

### Component Injection

`js/components.js` runs on `DOMContentLoaded` and replaces mount point `<div>`s with full HTML for:
- Sidebar (desktop navigation)
- Top bar (mobile header)
- Bottom nav (mobile navigation)
- Footer
- Scroll-to-top button
- Sidebar overlay

```js
const sidebarMount = document.getElementById('sidebar-mount');
if (sidebarMount) {
  sidebarMount.outerHTML = `<aside class="sidebar">${buildSidebar()}</aside>`;
}
```

### Theme System

`js/main.js` checks `localStorage` for saved theme, applies `data-theme` attribute on `<html>`. The CSS uses attribute selectors:

```css
[data-theme="dark"] {
  --bg-primary: #0F172A;
  /* ... other overrides ... */
}
```

Toggle button swaps the attribute and saves preference.

### Search System

The sidebar has a search input. As you type, `js/main.js` filters an inline index of all pages. Results render as clickable links.

### State Persistence

| Data | Storage |
|------|---------|
| Theme | `localStorage.logiclab-theme` |
| Quiz stats | `localStorage.logiclab-quiz-stats` |
| Converter history | `localStorage.logiclab-converter-history` |
| Active quiz session | `sessionStorage.logiclab-quiz-state` |

---

## Extending LogicLab

### Adding a New Module

1. **Create HTML file**: Copy an existing page as a template. Include the standard mount points:
   ```html
   <div id="sidebar-mount"></div>
   <div id="topbar-mount"></div>
   <div id="overlay-mount"></div>
   ...
   <div id="bottomnav-mount"></div>
   <div id="footer-mount"></div>
   ```

2. **Add to navigation**: Edit `js/components.js` and add your page to `NAV_ITEMS`:
   ```js
   { id: 'mymodule', icon: '🔮', label: 'My Module', url: 'mymodule.html', section: 'learn' }
   ```

3. **Style if needed**: Add component-specific styles to `css/extra.css`.

4. **JavaScript**: Either inline (like `complements.html`) or in a new file `js/mymodule.js`.

### Adding Quiz Questions

Edit `js/quiz.js` and add to the `QUESTIONS` array:
```js
{ q: "Your question?", o: ["Option A", "Option B", "Option C", "Option D"], a: 1, cat: "Category" }
```

### Custom Theme Colors

Edit `css/style.css` `:root` variables to change the entire color scheme.

---

## Future Improvements

### Short term (v1.1)
- ⏱️ Timer mode for quizzes
- 📊 Detailed quiz analytics by category
- 🔖 Bookmarks for important notes
- 📤 Share results via URL

### Medium term (v1.5)
- 🎨 Custom theme color picker
- 📱 PWA — install as app, full offline
- 💾 Import/export user notes
- 🔄 More counter designs (synchronous up/down, mod-N)

### Long term (v2.0)
- 🧮 K-map auto-solver
- 📐 Circuit drawing tool
- 🔌 VHDL code generation from circuits
- 🌍 Multi-language support (Hindi, Tamil, etc.)
- 🎓 Multi-user progress tracking (with optional backend)

---

## Pedagogical Notes for Educators

### Suggested Learning Sequence
1. **Number Systems** → Foundation for everything
2. **Logic Gates** → Building blocks
3. **Truth Tables** → Analysis tool
4. **Boolean Algebra** → Simplification
5. **Combinational Circuits** → Practical application
6. **Flip-Flops** → Memory and state
7. **Sequential Circuits** → Counters, registers
8. **Quiz** → Reinforce learning

### Assessment Strategy
- Use **Formula Sheet** for quick reference during labs
- Use **Notes** for exam preparation
- Use **Quiz** for self-assessment
- Use **interactive simulators** for visual reinforcement

---

## Accessibility Notes

- All interactive elements are keyboard accessible
- Color contrast meets WCAG AA standards
- `prefers-reduced-motion` respected
- Semantic HTML (`<nav>`, `<aside>`, `<main>`, `<article>`)
- ARIA labels on icon-only buttons
- Form labels properly associated

---

## Performance

- **First load**: ~50 KB (CSS + JS + initial HTML)
- **Each module**: ~10-30 KB
- **No network requests** after initial load
- **No layout shift** (explicit dimensions on images)
- **Smooth 60 FPS** animations (CSS transforms)

---

Built for the Diploma ECE community. Happy learning! 🎓
