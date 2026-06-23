/* ==========================================================================
   LogicLab - Main JavaScript
   Navigation, Theme, Search, Common Utilities
   Version: 1.0.0
   ========================================================================== */

(function() {
  'use strict';

  /* --------------------- Theme Management --------------------- */
  const ThemeManager = {
    init() {
      const saved = localStorage.getItem('logiclab-theme') || 'light';
      this.set(saved, false);
      this.bind();
    },

    set(theme, save = true) {
      document.documentElement.setAttribute('data-theme', theme);
      const btn = document.getElementById('themeToggle');
      const icon = btn?.querySelector('.theme-icon');
      const label = btn?.querySelector('.theme-label');
      if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
      if (label) label.textContent = theme === 'dark' ? 'Light' : 'Dark';
      if (save) localStorage.setItem('logiclab-theme', theme);
    },

    toggle() {
      const current = document.documentElement.getAttribute('data-theme');
      this.set(current === 'dark' ? 'light' : 'dark');
    },

    bind() {
      document.getElementById('themeToggle')?.addEventListener('click', () => this.toggle());
    }
  };

  /* --------------------- Mobile Sidebar --------------------- */
  const SidebarManager = {
    init() {
      this.sidebar = document.getElementById('sidebar');
      this.overlay = document.getElementById('sidebarOverlay');
      this.menuBtn = document.getElementById('menuToggle');
      this.closeBtn = document.getElementById('sidebarClose');

      this.menuBtn?.addEventListener('click', () => this.open());
      this.closeBtn?.addEventListener('click', () => this.close());
      this.overlay?.addEventListener('click', () => this.close());

      // Close on escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') this.close();
      });

      // Close on nav click (mobile)
      this.sidebar?.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
          if (window.innerWidth <= 768) this.close();
        });
      });
    },

    open() {
      this.sidebar?.classList.add('open');
      this.overlay?.classList.add('visible');
    },

    close() {
      this.sidebar?.classList.remove('open');
      this.overlay?.classList.remove('visible');
    }
  };

  /* --------------------- Scroll to Top --------------------- */
  const ScrollTopManager = {
    init() {
      this.btn = document.getElementById('scrollTopBtn');
      if (!this.btn) return;
      this.btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
      window.addEventListener('scroll', () => this.toggle());
    },

    toggle() {
      if (!this.btn) return;
      if (window.scrollY > 400) {
        this.btn.classList.add('visible');
      } else {
        this.btn.classList.remove('visible');
      }
    }
  };

  /* --------------------- Search System --------------------- */
  const SearchManager = {
    index: null,

    init() {
      const input = document.getElementById('globalSearch');
      if (!input) return;
      input.addEventListener('input', (e) => this.handle(e.target.value));
      this.loadIndex();
    },

    async loadIndex() {
      try {
        const res = await fetch('search-index.json');
        if (res.ok) this.index = await res.json();
      } catch (err) {
        this.index = this.buildInlineIndex();
      }
    },

    buildInlineIndex() {
      return [
        { title: 'Number Systems', url: 'converter.html', desc: 'Binary, Decimal, Octal, Hexadecimal conversions' },
        { title: 'Logic Gates', url: 'gates.html', desc: 'AND, OR, NOT, NAND, NOR, XOR, XNOR' },
        { title: 'Truth Tables', url: 'truth-tables.html', desc: 'Generate and view truth tables' },
        { title: 'Binary Arithmetic', url: 'arithmetic.html', desc: 'Addition, Subtraction, Multiplication, Division' },
        { title: 'Complements', url: 'complements.html', desc: '1s and 2s complement calculations' },
        { title: 'Half Adder', url: 'half-adder.html', desc: 'Sum and Carry circuit' },
        { title: 'Full Adder', url: 'full-adder.html', desc: '3-input adder circuit' },
        { title: 'Flip-Flops', url: 'flipflops.html', desc: 'SR, JK, D, T flip-flops' },
        { title: 'Multiplexer', url: 'multiplexer.html', desc: 'MUX 2:1, 4:1' },
        { title: 'Demultiplexer', url: 'demultiplexer.html', desc: 'DEMUX 1:2, 1:4' },
        { title: 'Encoder', url: 'encoder.html', desc: 'Priority and standard encoders' },
        { title: 'Decoder', url: 'decoder.html', desc: '2-to-4, 3-to-8 decoders' },
        { title: 'Formula Sheet', url: 'formulas.html', desc: 'Quick revision formulas' },
        { title: 'Quiz', url: 'quiz.html', desc: 'Test your knowledge' },
        { title: 'Notes', url: 'notes.html', desc: 'Concise study notes' },
        { title: 'About', url: 'about.html', desc: 'About LogicLab' }
      ];
    },

    handle(query) {
      const q = query.trim().toLowerCase();
      const resultsEl = document.getElementById('searchResults');
      if (!resultsEl) return;
      if (!q) {
        resultsEl.innerHTML = '';
        resultsEl.style.display = 'none';
        return;
      }

      const items = (this.index || this.buildInlineIndex()).filter(it =>
        it.title.toLowerCase().includes(q) ||
        it.desc.toLowerCase().includes(q)
      );

      if (items.length === 0) {
        resultsEl.innerHTML = '<div class="search-empty">No results found</div>';
        resultsEl.style.display = 'block';
        return;
      }

      resultsEl.innerHTML = items.slice(0, 8).map(it => `
        <a href="${it.url}" class="search-result-item">
          <div class="search-result-title">${this.highlight(it.title, q)}</div>
          <div class="search-result-desc">${this.highlight(it.desc, q)}</div>
        </a>
      `).join('');
      resultsEl.style.display = 'block';
    },

    highlight(text, q) {
      const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      return text.replace(re, '<mark>$1</mark>');
    }
  };

  /* --------------------- Active Nav Highlight --------------------- */
  const NavHighlight = {
    init() {
      const path = window.location.pathname.split('/').pop() || 'index.html';
      document.querySelectorAll('[data-nav]').forEach(el => {
        if (el.dataset.nav === path || (path === '' && el.dataset.nav === 'index.html')) {
          el.classList.add('active');
        }
      });
    }
  };

  /* --------------------- Binary Background Animation --------------------- */
  const BinaryBg = {
    init() {
      const container = document.getElementById('binaryBg');
      if (!container) return;
      const digits = '01';
      const lines = 8;
      let html = '';
      for (let i = 0; i < lines; i++) {
        let line = '';
        for (let j = 0; j < 60; j++) {
          line += digits[Math.floor(Math.random() * 2)];
        }
        html += `<div class="binary-bg" style="top:${10 + i * 11}%; left:${-5 + Math.random() * 10}%; animation-delay:${Math.random() * 4}s; animation-duration:${5 + Math.random() * 5}s;">${line}</div>`;
      }
      container.innerHTML = html;

      // Circuit decoration
      const deco = document.getElementById('circuitDeco');
      if (deco) {
        deco.innerHTML = '<div class="circuit-deco" style="top:10%; right:5%;"></div>' +
                        '<div class="circuit-deco" style="bottom:15%; right:18%; width:120px; height:120px; animation-delay:2s;"></div>' +
                        '<div class="circuit-deco" style="top:40%; right:25%; width:80px; height:80px; animation-delay:4s;"></div>';
      }
    }
  };

  /* --------------------- Copy to Clipboard --------------------- */
  window.copyToClipboard = function(text, btn) {
    navigator.clipboard.writeText(text).then(() => {
      if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.style.color = 'var(--success)';
        setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 1500);
      }
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (e) {}
      document.body.removeChild(ta);
    });
  };

  /* --------------------- Toast Notifications --------------------- */
  window.showToast = function(message, type = 'success') {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.className = `toast toast-${type} show`;
    toast.textContent = message;
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  };

  /* --------------------- Initialization --------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    SidebarManager.init();
    ScrollTopManager.init();
    SearchManager.init();
    NavHighlight.init();
    BinaryBg.init();
  });
})();
