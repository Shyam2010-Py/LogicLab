/* LogicLab v3.5.2 — Shared shell */
(function(){'use strict';
const NAV_ITEMS=[
{id:'index',icon:'⌂',label:'Dashboard',url:'index.html',section:'main'},
{id:'converter',icon:'01',label:'Number Systems',url:'converter.html',section:'logic'},
{id:'gates',icon:'⚡',label:'Logic Gates',url:'gates.html',section:'logic'},
{id:'truth-tables',icon:'▦',label:'Truth Tables',url:'truth-tables.html',section:'logic'},
{id:'arithmetic',icon:'＋',label:'Binary Arithmetic',url:'arithmetic.html',section:'logic'},
{id:'complements',icon:'±',label:'Complements',url:'complements.html',section:'logic'},
{id:'half-adder',icon:'Σ',label:'Half Adder',url:'half-adder.html',section:'circuits'},
{id:'full-adder',icon:'Σ',label:'Full Adder',url:'full-adder.html',section:'circuits'},
{id:'flipflops',icon:'◈',label:'Flip-Flops',url:'flipflops.html',section:'circuits'},
{id:'multiplexer',icon:'◇',label:'MUX / DEMUX',url:'multiplexer.html',section:'circuits'},
{id:'encoder',icon:'↗',label:'Encoder',url:'encoder.html',section:'circuits'},
{id:'decoder',icon:'↘',label:'Decoder',url:'decoder.html',section:'circuits'},
{id:'formulas',icon:'π',label:'Formula Sheet',url:'formulas.html',section:'learn'},
{id:'notes',icon:'▤',label:'Notes',url:'notes.html',section:'learn'},
{id:'quiz',icon:'✓',label:'Quiz',url:'quiz.html',section:'practice'},
{id:'about',icon:'i',label:'About',url:'about.html',section:'system'},
{id:'changelog',icon:'↻',label:'Changelog',url:'changelog.html',section:'system'}
];
const SECTIONS={main:'Main',logic:'Digital Logic',circuits:'Circuits',learn:'Learning',practice:'Practice',system:'System'};
const currentPath=(window.location.pathname.split('/').pop()||'index.html').toLowerCase();
function loadTheme(){if(document.getElementById('logiclab-theme-css'))return;const link=document.createElement('link');link.id='logiclab-theme-css';link.rel='stylesheet';link.href='css/theme.css?v=3.5.2';document.head.appendChild(link)}
function loadLearningHubBridge(){if(document.getElementById('learninghub-bridge'))return;const script=document.createElement('script');script.id='learninghub-bridge';script.type='module';script.src='js/learninghub-bridge.js?v=1.0.0';document.head.appendChild(script)}
function buildSidebar(){let html=`<div class="sidebar-header"><div class="sidebar-logo">LL</div><div><div class="sidebar-title">LogicLab</div><div class="sidebar-tagline">Digital Electronics Lab</div></div><button id="sidebarClose" class="menu-toggle" aria-label="Close navigation">×</button></div><div class="sidebar-search"><input type="text" id="globalSearch" class="sidebar-search-input" placeholder="Search the lab..." autocomplete="off"><div id="searchResults" style="display:none"></div></div><nav class="sidebar-nav">`;let last='';NAV_ITEMS.forEach(item=>{if(item.section!==last){html+=`<div class="sidebar-nav-section">${SECTIONS[item.section]}</div>`;last=item.section}const active=item.url.toLowerCase()===currentPath?'active':'';html+=`<a href="${item.url}" class="nav-item ${active}" data-nav="${item.url}"><span class="nav-item-icon">${item.icon}</span><span>${item.label}</span></a>`});html+=`</nav><div class="sidebar-footer"><div class="sidebar-footer-row"><span>Appearance</span><button id="themeToggle" class="theme-toggle"><span class="theme-icon">☀️</span><span class="theme-label">Light</span></button></div><div>LogicLab v3.5.2</div><div style="opacity:.65;margin-top:2px">Digital Electronics Laboratory</div></div>`;return html}
function buildTopBar(){return `<div class="top-bar"><button id="menuToggle" class="menu-toggle" aria-label="Open navigation">☰</button><div class="top-bar-logo"><div class="sidebar-logo" style="width:32px;height:32px;font-size:.85rem">LL</div><span>LogicLab</span></div><button id="themeToggleMobile" class="theme-toggle" aria-label="Toggle theme"><span class="theme-icon">☀️</span></button></div>`}
function buildFooter(){return `<footer class="site-footer"><div class="footer-brand"><strong>⚡ LogicLab</strong> <span class="footer-version">v3.5.2</span></div><div class="footer-subtitle">Digital Electronics Laboratory</div><div class="footer-credit"><span class="footer-credit-label">Built &amp; maintained by</span><strong>Ghanashyam Pabbuleti</strong><span>Diploma in Electronics &amp; Communication Engineering</span><span>SV Government Polytechnic College, Tirupati</span></div><div class="footer-links">Learn <span>•</span> Simulate <span>•</span> Practice</div><div class="footer-copy">© 2026 Ghanashyam Pabbuleti</div></footer>`}
function inject(){
  loadTheme();
  const s=document.getElementById('sidebar-mount');if(s)s.outerHTML=`<aside class="sidebar" id="sidebar">${buildSidebar()}</aside>`;
  const t=document.getElementById('topbar-mount');if(t)t.outerHTML=buildTopBar();
  const b=document.getElementById('bottomnav-mount');if(b)b.outerHTML='';
  const o=document.getElementById('overlay-mount');if(o)o.outerHTML='<div id="sidebarOverlay" class="sidebar-overlay"></div>';
  const sc=document.getElementById('scrolltop-mount');if(sc)sc.outerHTML='<button id="scrollTopBtn" class="scroll-top-btn" aria-label="Scroll to top">↑</button>';
  const f=document.getElementById('footer-mount');
  if(f){f.outerHTML=buildFooter()}
  else if(!document.querySelector('.site-footer')){
    const main=document.querySelector('.main-content')||document.body;
    main.insertAdjacentHTML('beforeend',buildFooter());
  }
  loadLearningHubBridge();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();
