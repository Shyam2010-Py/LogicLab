/* ==========================================================================
   LogicLab - Shared Component Injector
   Injects sidebar and bottom navigation into all pages
   Version: 2.0.0
   ========================================================================== */

(function() {
  'use strict';

  const NAV_ITEMS = [
    { id: 'index', icon: '🏠', label: 'Home', url: 'index.html', section: 'main' },
    { id: 'converter', icon: '🔄', label: 'Number Systems', url: 'converter.html', section: 'tools' },
    { id: 'gates', icon: '⚡', label: 'Logic Gates', url: 'gates.html', section: 'tools' },
    { id: 'truth-tables', icon: '📋', label: 'Truth Tables', url: 'truth-tables.html', section: 'tools' },
    { id: 'arithmetic', icon: '➕', label: 'Binary Arithmetic', url: 'arithmetic.html', section: 'tools' },
    { id: 'complements', icon: '🔢', label: 'Complements', url: 'complements.html', section: 'tools' },
    { id: 'half-adder', icon: '➗', label: 'Half Adder', url: 'half-adder.html', section: 'circuits' },
    { id: 'full-adder', icon: '➕', label: 'Full Adder', url: 'full-adder.html', section: 'circuits' },
    { id: 'flipflops', icon: '🔁', label: 'Flip-Flops', url: 'flipflops.html', section: 'circuits' },
    { id: 'multiplexer', icon: '🔀', label: 'MUX/DEMUX', url: 'multiplexer.html', section: 'circuits' },
    { id: 'encoder', icon: '📤', label: 'Encoder/Decoder', url: 'encoder.html', section: 'circuits' },
    { id: 'decoder', icon: '📥', label: 'Decoder', url: 'decoder.html', section: 'circuits' },
    { id: 'formulas', icon: '📐', label: 'Formula Sheet', url: 'formulas.html', section: 'learn' },
    { id: 'quiz', icon: '🎯', label: 'Quiz', url: 'quiz.html', section: 'learn' },
    { id: 'notes', icon: '📝', label: 'Notes', url: 'notes.html', section: 'learn' },
    { id: 'about', icon: 'ℹ️', label: 'About', url: 'about.html', section: 'info' },
    { id: 'changelog', icon: '📜', label: 'Changelog', url: 'changelog.html', section: 'info' }
  ];

  const SECTIONS = { main: 'Main', tools: 'Tools', circuits: 'Circuits', learn: 'Learn', info: 'Info' };
  const currentPath = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function loadTheme() {
    if (document.getElementById('logiclab-theme-css')) return;
    const link = document.createElement('link');
    link.id = 'logiclab-theme-css';
    link.rel = 'stylesheet';
    link.href = 'css/theme.css?v=2.0.0';
    document.head.appendChild(link);
  }

  function buildSidebar() {
    let html = `
      <div class="sidebar-header">
        <div class="sidebar-logo">LL</div>
        <div><div class="sidebar-title">LogicLab</div><div class="sidebar-tagline">Digital Electronics</div></div>
        <button id="sidebarClose" class="menu-toggle" style="margin-left:auto;color:white;background:rgba(255,255,255,0.1);">✕</button>
      </div>
      <div class="sidebar-search">
        <input type="text" id="globalSearch" class="sidebar-search-input" placeholder="🔍 Search topics..." autocomplete="off">
        <div id="searchResults" style="display:none;"></div>
      </div>
      <nav class="sidebar-nav">`;

    let lastSection = '';
    NAV_ITEMS.forEach(item => {
      if (item.section !== lastSection) {
        html += `<div class="sidebar-nav-section">${SECTIONS[item.section]}</div>`;
        lastSection = item.section;
      }
      const active = item.url.toLowerCase() === currentPath ? 'active' : '';
      html += `<a href="${item.url}" class="nav-item ${active}" data-nav="${item.url}"><span class="nav-item-icon">${item.icon}</span><span>${item.label}</span></a>`;
    });

    html += `</nav>
      <div class="sidebar-footer">
        <div class="sidebar-footer-row"><span>Theme</span><button id="themeToggle" class="theme-toggle"><span class="theme-icon">🌙</span><span class="theme-label">Dark</span></button></div>
        <div>LogicLab v2.0.0</div><div style="opacity:0.7;margin-top:2px;">Diploma ECE Edition</div>
      </div>`;
    return html;
  }

  function buildTopBar() {
    return `<div class="top-bar"><button id="menuToggle" class="menu-toggle">☰</button><div class="top-bar-logo"><div class="sidebar-logo" style="width:32px;height:32px;font-size:0.9rem;">LL</div><span>LogicLab</span></div><button id="themeToggleMobile" class="theme-toggle" style="background:var(--bg-tertiary);color:var(--text-primary);border-color:var(--border);"><span class="theme-icon">🌙</span></button></div>`;
  }

  function buildBottomNav() {
    // Keep only the five most useful destinations on small screens.
    const primary = ['index', 'converter', 'gates', 'quiz', 'formulas'];
    let html = '<div class="bottom-nav-inner">';
    primary.forEach(id => {
      const item = NAV_ITEMS.find(n => n.id === id);
      if (!item) return;
      const active = item.url.toLowerCase() === currentPath ? 'active' : '';
      html += `<a href="${item.url}" class="bottom-nav-item ${active}" data-nav="${item.url}"><span class="bottom-nav-item-icon">${item.icon}</span><span>${item.label}</span></a>`;
    });
    return html + '</div>';
  }

  function inject() {
    loadTheme();

    const sidebarMount = document.getElementById('sidebar-mount');
    if (sidebarMount) sidebarMount.outerHTML = `<aside class="sidebar" id="sidebar">${buildSidebar()}</aside>`;

    const topMount = document.getElementById('topbar-mount');
    if (topMount) topMount.outerHTML = buildTopBar();

    const bottomMount = document.getElementById('bottomnav-mount');
    if (bottomMount) bottomMount.outerHTML = `<nav class="bottom-nav" id="bottomNav">${buildBottomNav()}</nav>`;

    const overlayMount = document.getElementById('overlay-mount');
    if (overlayMount) overlayMount.outerHTML = '<div id="sidebarOverlay" class="sidebar-overlay"></div>';

    const scrollMount = document.getElementById('scrolltop-mount');
    if (scrollMount) scrollMount.outerHTML = '<button id="scrollTopBtn" class="scroll-top-btn" aria-label="Scroll to top">↑</button>';

    const footerMount = document.getElementById('footer-mount');
    if (footerMount) footerMount.outerHTML = `<footer class="site-footer"><div><strong>LogicLab</strong> <span class="footer-version">v2.0.0</span></div><div style="margin-top:0.5rem;">Digital Electronics Learning Platform · Built for Diploma ECE Students</div><div style="margin-top:0.5rem;font-size:0.75rem;opacity:0.7;">Learn • Simulate • Practice • Master</div></footer>`;

    const mobileTheme = document.getElementById('themeToggleMobile');
    if (mobileTheme) {
      mobileTheme.addEventListener('click', () => {
        document.getElementById('themeToggle')?.click();
        setTimeout(() => {
          const icon = mobileTheme.querySelector('.theme-icon');
          const theme = document.documentElement.getAttribute('data-theme');
          if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }, 50);
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
})();
