/* ==========================================================================
   LogicLab - Logic Gates Simulator
   AND, OR, NOT, NAND, NOR, XOR, XNOR with real-time output
   Version: 1.0.0
   ========================================================================== */

(function() {
  'use strict';

  const GATES = {
    AND: {
      symbol: '&',
      desc: 'Output is 1 only when ALL inputs are 1',
      expression: 'Y = A · B',
      truthTable: [[0,0,0],[0,1,0],[1,0,0],[1,1,1]],
      fn: (a, b) => a & b,
      not: false
    },
    OR: {
      symbol: '≥1',
      desc: 'Output is 1 when ANY input is 1',
      expression: 'Y = A + B',
      truthTable: [[0,0,0],[0,1,1],[1,0,1],[1,1,1]],
      fn: (a, b) => a | b,
      not: false
    },
    NOT: {
      symbol: '1',
      desc: 'Inverter — output is opposite of input',
      expression: 'Y = A\'',
      truthTable: [[0,1],[1,0]],
      fn: (a) => a ? 0 : 1,
      single: true,
      not: false
    },
    NAND: {
      symbol: '&',
      desc: 'Output is 0 only when ALL inputs are 1 (Universal gate)',
      expression: 'Y = (A · B)\'',
      truthTable: [[0,0,1],[0,1,1],[1,0,1],[1,1,0]],
      fn: (a, b) => (a & b) ? 0 : 1,
      bubble: true,
      not: false
    },
    NOR: {
      symbol: '≥1',
      desc: 'Output is 0 when ANY input is 1 (Universal gate)',
      expression: 'Y = (A + B)\'',
      truthTable: [[0,0,1],[0,1,0],[1,0,0],[1,1,0]],
      fn: (a, b) => (a | b) ? 0 : 1,
      bubble: true,
      not: false
    },
    XOR: {
      symbol: '=1',
      desc: 'Output is 1 when inputs are DIFFERENT',
      expression: 'Y = A ⊕ B',
      truthTable: [[0,0,0],[0,1,1],[1,0,1],[1,1,0]],
      fn: (a, b) => a ^ b,
      extra: true,
      not: false
    },
    XNOR: {
      symbol: '=1',
      desc: 'Output is 1 when inputs are SAME',
      expression: 'Y = (A ⊕ B)\'',
      truthTable: [[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
      fn: (a, b) => (a ^ b) ? 0 : 1,
      extra: true,
      bubble: true,
      not: false
    }
  };

  function drawGateSVG(gate, A, B, Y) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const stroke = isDark ? '#F1F5F9' : '#0F172A';
    const fill = isDark ? '#1E293B' : '#FFFFFF';
    const inputColor = '#2563EB';
    const outputColor = Y ? '#22C55E' : '#EF4444';

    const w = 200, h = 140;
    let svg = `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:280px;height:auto;">`;

    // Input A
    const aY = gate.single ? h / 2 : 35;
    svg += `<line x1="0" y1="${aY}" x2="50" y2="${aY}" stroke="${stroke}" stroke-width="2"/>`;
    svg += `<circle cx="0" cy="${aY}" r="6" fill="${A ? inputColor : '#94A3B8'}"/>`;
    svg += `<text x="10" y="${aY - 10}" font-size="13" font-weight="700" fill="${stroke}">A=${A}</text>`;

    // Input B (if not single)
    let bodyX1 = 50, bodyX2 = 150;
    if (!gate.single) {
      const bY = h - 35;
      svg += `<line x1="0" y1="${bY}" x2="50" y2="${bY}" stroke="${stroke}" stroke-width="2"/>`;
      svg += `<circle cx="0" cy="${bY}" r="6" fill="${B ? inputColor : '#94A3B8'}"/>`;
      svg += `<text x="10" y="${bY + 18}" font-size="13" font-weight="700" fill="${stroke}">B=${B}</text>`;
    } else {
      bodyX2 = 130;
    }

    // Gate body
    if (gate.symbol === '&' && !gate.single) {
      // AND / NAND shape
      svg += `<path d="M ${bodyX1} 20 L ${bodyX1 + 30} 20 A 50 50 0 0 1 ${bodyX1 + 30} ${h - 20} L ${bodyX1} ${h - 20} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    } else if (gate.symbol === '≥1' && !gate.single) {
      // OR / NOR shape
      svg += `<path d="M ${bodyX1} 20 Q ${bodyX1 + 25} ${h/2} ${bodyX1} ${h - 20} Q ${bodyX1 + 25} ${h/2} ${bodyX1 + 60} ${h/2 - 50} A 50 50 0 0 1 ${bodyX1 + 60} ${h/2 + 50} Q ${bodyX1 + 25} ${h/2} ${bodyX1} ${h - 20} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    } else if (gate.single) {
      // NOT gate triangle
      svg += `<polygon points="${bodyX1},20 ${bodyX1},${h - 20} ${bodyX1 + 50},${h/2}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      svg += `<circle cx="${bodyX1 + 50 + 5}" cy="${h/2}" r="5" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
    } else {
      // XOR/XNOR with extra curve
      svg += `<path d="M ${bodyX1 - 8} 20 Q ${bodyX1 + 17} ${h/2} ${bodyX1 - 8} ${h - 20} Q ${bodyX1 + 25} ${h/2} ${bodyX1 + 60} ${h/2 - 50} A 50 50 0 0 1 ${bodyX1 + 60} ${h/2 + 50} Q ${bodyX1 + 25} ${h/2} ${bodyX1 - 8} ${h - 20} Z" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      svg += `<path d="M ${bodyX1 - 16} 20 Q ${bodyX1 + 9} ${h/2} ${bodyX1 - 16} ${h - 20}" fill="none" stroke="${stroke}" stroke-width="2"/>`;
    }

    // Output bubble for inverted gates
    const outX = gate.single ? bodyX1 + 60 : bodyX1 + 60;
    let lineStartX = gate.single ? bodyX1 + 60 : bodyX1 + 110;
    if (gate.bubble) {
      svg += `<circle cx="${lineStartX + 8}" cy="${h/2}" r="5" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`;
      lineStartX += 16;
    }

    // Output line
    svg += `<line x1="${lineStartX}" y1="${h/2}" x2="${w - 10}" y2="${h/2}" stroke="${stroke}" stroke-width="2"/>`;
    svg += `<circle cx="${w - 10}" cy="${h/2}" r="7" fill="${outputColor}"/>`;
    svg += `<text x="${w - 50}" y="${h/2 - 12}" font-size="13" font-weight="700" fill="${stroke}">Y=${Y}</text>`;

    svg += `</svg>`;
    return svg;
  }

  function updateGate(gateName) {
    const gate = GATES[gateName];
    const aInput = document.getElementById(`inputA-${gateName}`);
    const bInput = document.getElementById(`inputB-${gateName}`);
    const outputEl = document.getElementById(`output-${gateName}`);
    const svgEl = document.getElementById(`svg-${gateName}`);

    if (!gate || !aInput || !outputEl) return;

    const A = aInput.checked ? 1 : 0;
    const B = bInput ? (bInput.checked ? 1 : 0) : null;

    let Y;
    if (gate.single) {
      Y = gate.fn(A);
    } else {
      Y = gate.fn(A, B);
    }

    outputEl.className = `led ${Y ? 'on' : 'off'}`;
    outputEl.nextElementSibling.textContent = Y;
    if (svgEl) svgEl.innerHTML = drawGateSVG(gate, A, B, Y);
  }

  function init() {
    Object.keys(GATES).forEach(name => {
      const gate = GATES[name];
      const aId = `inputA-${name}`;
      const bId = `inputB-${name}`;
      const outId = `output-${name}`;

      const aEl = document.getElementById(aId);
      const bEl = document.getElementById(bId);
      if (aEl) aEl.addEventListener('change', () => updateGate(name));
      if (bEl) bEl.addEventListener('change', () => updateGate(name));

      // Initial render
      updateGate(name);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging / external use
  window.LogicLabGates = { GATES, updateGate };
})();
