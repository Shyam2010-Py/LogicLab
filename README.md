# LogicLab — Digital Electronics Learning Platform

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Learn • Simulate • Practice • Master**

LogicLab is a modern, production-ready educational platform designed for **Diploma ECE students** to learn, practice, and visualize Digital Electronics concepts. Built with pure HTML5, CSS3, and Vanilla JavaScript — no frameworks, no backend, no build step required.

🌐 **Live Demo:** [Open LogicLab](https://your-username.github.io/logiclab/)

---

## ✨ Features

### 🧮 17 Interactive Modules
- **Number System Converter** — Binary ↔ Decimal ↔ Octal ↔ Hex with step-by-step explanations
- **Logic Gates Simulator** — AND, OR, NOT, NAND, NOR, XOR, XNOR with live output
- **Truth Table Generator** — Generate and export truth tables as CSV
- **Binary Arithmetic** — Addition, Subtraction, Multiplication, Division
- **Complement Calculator** — 1's and 2's complements with examples
- **Half & Full Adders** — Interactive with truth tables
- **Flip-Flops** — SR, JK, D, T with state log
- **Multiplexer & Demultiplexer** — 2:1, 4:1 MUX and DEMUX
- **Encoder & Decoder** — Standard and priority encoders, 7-segment decoder
- **Formula Sheet** — Comprehensive quick reference
- **Notes** — Concise study notes with search
- **Quiz System** — 110+ randomized questions

### 🎨 Modern Design
- 🌗 Dark / Light theme toggle (persisted)
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎯 Bottom navigation on mobile, sidebar on desktop
- ✨ Smooth animations and transitions
- 🎮 Interactive simulators with real-time feedback
- 🔍 Global search across all topics

### ⚡ Technical
- Zero dependencies — pure HTML/CSS/JS
- Works fully offline once loaded
- GitHub Pages compatible
- ~150 KB total size
- 100% accessible (keyboard, screen-reader friendly)

---

## 🚀 Quick Start

### Local Preview
```bash
# Clone the repository
git clone https://github.com/your-username/logiclab.git
cd logiclab

# Option 1: Open index.html directly in a browser
open index.html        # macOS
xdg-open index.html    # Linux
start index.html       # Windows

# Option 2: Run a local server
python3 -m http.server 8000
# Then open http://localhost:8000
```

### Deploy to GitHub Pages
1. Fork this repository
2. Go to **Settings → Pages**
3. Under "Source", select `main` branch
4. Click **Save**
5. Your site will be live at `https://your-username.github.io/logiclab/`

---

## 📁 Project Structure

```
logiclab/
├── index.html              # Home / landing page
├── converter.html          # Number System Converter
├── gates.html              # Logic Gates Simulator
├── truth-tables.html       # Truth Table Generator
├── arithmetic.html         # Binary Arithmetic
├── complements.html        # Complement Calculator
├── half-adder.html         # Half Adder
├── full-adder.html         # Full Adder
├── flipflops.html          # SR / JK / D / T Flip-Flops
├── multiplexer.html        # Multiplexer (MUX)
├── demultiplexer.html      # Demultiplexer (DEMUX)
├── encoder.html            # Encoder
├── decoder.html            # Decoder (incl. BCD to 7-seg)
├── formulas.html           # Formula Sheet
├── quiz.html               # Quiz System (110+ questions)
├── notes.html              # Study Notes
├── about.html              # About page
├── changelog.html          # Version history
│
├── css/
│   ├── style.css           # Main stylesheet (design system)
│   ├── responsive.css      # Responsive breakpoints
│   └── extra.css           # Component-specific styles
│
├── js/
│   ├── main.js             # Theme, sidebar, scroll-top, search
│   ├── components.js       # Shared navigation injection
│   ├── converter.js        # Number system conversions
│   ├── gates.js            # Logic gate simulators
│   ├── arithmetic.js       # Binary arithmetic
│   └── quiz.js             # Quiz state and question bank
│
└── README.md
```

---

## 🎓 Target Audience

This platform is designed for:
- 🎓 **Diploma ECE students** (primary audience)
- 📚 **Polytechnic / ITI students** learning digital electronics
- 🛠️ **Hobbyists** exploring logic circuits
- 👨‍🏫 **Educators** as a teaching aid

---

## 📚 Topics Covered

- Number Systems (Binary, Octal, Decimal, Hex, BCD, Gray, Excess-3)
- Logic Gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)
- Boolean Algebra & Karnaugh Maps
- Combinational Circuits (Adders, Subtractors, MUX, DEMUX, Encoders, Decoders)
- Sequential Circuits (Flip-Flops, Registers, Counters)
- Memory & Programmable Logic
- A/D & D/A Converters
- Logic Families (TTL, CMOS, ECL)
- VHDL/Verilog basics

See [`GUIDE.md`](GUIDE.md) for a complete pedagogical guide.

---

## 🛠️ Built With

| Technology | Purpose |
|------------|---------|
| HTML5 | Semantic markup |
| CSS3 | Modern design with custom properties |
| Vanilla JavaScript (ES6+) | Interactivity |
| SVG | Circuit diagrams and illustrations |

**No frameworks. No bundlers. No dependencies.** Just open `index.html`.

---

## 🤝 Contributing

Contributions are welcome! Whether it's fixing a bug, adding a feature, or improving documentation:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ for engineering students
- Inspired by standard Diploma ECE curricula
- All circuit diagrams drawn with SVG for crisp rendering at any size

---

## 📬 Contact

Have questions, feedback, or suggestions?
- 🌐 Website: [your-site.com](https://your-site.com)
- 📧 Email: your-email@example.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/logiclab/issues)

---

<p align="center">
  <strong>LogicLab v1.0.0</strong><br>
  Made with ⚡ by students, for students.
</p>
