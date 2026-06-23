# Changelog

All notable changes to LogicLab are documented here. The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.0.2] - 2026-06-24

### 🐛 Fixed
- **PWA service worker was never registered** — `js/pwa.js` existed and was already in the SW precache list, but no HTML page actually loaded it. Added `<script src="js/pwa.js"></script>` after `js/components.js` on every page so the SW registers on first visit, offline support works, and the update prompt appears when a new version is waiting.

## [1.0.1] - 2026-06-24

### 🐛 Fixed
- **Converter output not showing** — `convOutput` is a `<span>` but JS was writing to `.value` (which spans don't have). Now uses `textContent` correctly, so the converted result visibly appears in the Result box.
- **Horizontal scroll on mobile (all pages)** — Added `overflow-x: hidden` + `max-width: 100vw` to `html` and `body`, plus a global safety net (`overflow-wrap: anywhere` on monospace text, tables, forms, result boxes). The `.bottom-nav` was switched from a horizontally-scrollable strip to a flex-equal-width bar so it can never bleed past the viewport. The `.def-list` and `.gate-control` were made to wrap on small screens.
- **Copy/Clear buttons on converter** — Updated to safely read from either `.value` or `.textContent` so they work with the span-based output.

## [1.0.0] - 2026-06-24

### 🎉 Initial Release

The first public release of LogicLab — a complete Digital Electronics learning platform for Diploma ECE students.

### ✨ Added

**17 Interactive Modules:**
- Home page with animated binary background
- Number System Converter (Binary, Octal, Decimal, Hex) with step-by-step explanations
- Logic Gates Simulator (AND, OR, NOT, NAND, NOR, XOR, XNOR) with SVG visualization
- Truth Table Generator with CSV export
- Binary Arithmetic (Addition, Subtraction, Multiplication, Division) with carry/borrow visualization
- 1's and 2's Complement Calculator
- Half Adder with interactive simulator
- Full Adder with interactive simulator
- Flip-Flops (SR, JK, D, T) with state log
- Multiplexer (2:1, 4:1)
- Demultiplexer (1:2, 1:4)
- 4-to-2 Encoder and 8-to-3 Priority Encoder
- 2-to-4, 3-to-8 Decoders and BCD-to-7-Segment
- Comprehensive Formula Sheet
- Study Notes with search
- Quiz System with 110+ questions across 9 categories

**Platform Features:**
- Dark / Light theme toggle (saved to localStorage)
- Global search across all topics
- Mobile-first responsive design
- Bottom navigation on mobile, sidebar on desktop
- Scroll-to-top button
- Toast notifications
- Conversion history (saved to localStorage)
- Quiz statistics tracking
- Resume-in-progress quiz sessions
- Print-friendly stylesheets
- Reduced-motion support

**Educational Content:**
- Comprehensive notes covering all topics
- 100+ quiz questions with detailed explanations
- Formula sheet with boolean laws, K-map rules, common conversions
- Circuit diagrams (SVG) for all major components
- IC package references (7400, 7402, 74138, 74148, 7447, etc.)

### 🎨 Design System
- Primary: `#2563EB`
- Secondary: `#0F172A`
- Accent: `#06B6D4`
- Success: `#22C55E`
- Warning: `#F59E0B`
- Custom typography scale
- 6px to 24px border radius scale
- Elevation/shadow system
- Smooth transitions and animations

### 💻 Technical Details
- Pure HTML5, CSS3, and Vanilla JavaScript (ES6+)
- Zero external dependencies
- No build step required
- GitHub Pages compatible
- Works fully offline after first load
- Total project size: ~150 KB

---

## Future Plans

### [1.1.0] - Planned
- Timer mode for quizzes
- Detailed category-wise quiz analytics
- Bookmarking for important notes
- Additional flip-flop variants (Master-Slave)

### [1.2.0] - Planned
- Counter designer with K-map based simplification
- State machine simulator
- Custom theme color picker

### [2.0.0] - Planned
- PWA support (installable, full offline)
- VHDL/Verilog code generation
- Multi-language support

---

[1.0.0]: https://github.com/your-username/logiclab/releases/tag/v1.0.0
