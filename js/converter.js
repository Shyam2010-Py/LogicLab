/* ==========================================================================
   LogicLab - Number System Converter
   Bidirectional conversions between Binary, Decimal, Octal, Hexadecimal
   Version: 1.0.0
   ========================================================================== */

(function() {
  'use strict';

  const HISTORY_KEY = 'logiclab-converter-history';

  // Validation
  function validate(value, base) {
    if (!value || value.trim() === '') return { ok: false, msg: 'Input cannot be empty' };
    value = value.trim();
    const pattern = base === 2 ? /^[01]+$/ :
                    base === 8 ? /^[0-7]+$/ :
                    base === 16 ? /^[0-9A-Fa-f]+$/ :
                    /^[0-9]+$/;
    if (!pattern.test(value)) {
      return { ok: false, msg: `Invalid ${nameOf(base)} number: "${value}"` };
    }
    return { ok: true };
  }

  function nameOf(base) {
    return { 2: 'Binary', 8: 'Octal', 10: 'Decimal', 16: 'Hexadecimal' }[base];
  }

  // Conversions
  function toDecimal(value, base) {
    if (base === 10) return value;
    return parseInt(value, base).toString(10);
  }

  function fromDecimal(decimal, base) {
    if (base === 10) return decimal;
    return parseInt(decimal, 10).toString(base).toUpperCase();
  }

  function convert(value, fromBase, toBase) {
    const dec = toDecimal(value, fromBase);
    return fromDecimal(dec, toBase);
  }

  // Step-by-step explanation
  function explainConversion(value, fromBase, toBase) {
    const steps = [];
    const fromName = nameOf(fromBase);
    const toName = nameOf(toBase);

    if (fromBase === toBase) {
      return [`No conversion needed — same base (${toName}).`];
    }

    steps.push(`<strong>Step 1:</strong> Input is "${value}" in ${fromName} (base ${fromBase}).`);

    if (fromBase !== 10) {
      // Convert from source base to decimal first
      steps.push(`<strong>Step 2:</strong> Convert ${fromName} to Decimal by multiplying each digit by its positional weight (${fromBase}^position).`);
      const digits = value.toUpperCase().split('').reverse();
      let calcStr = [];
      let total = 0;
      digits.forEach((d, i) => {
        const digitVal = fromBase === 16 ? parseInt(d, 16) : parseInt(d, 10);
        const contrib = digitVal * Math.pow(fromBase, i);
        total += contrib;
        calcStr.push(`${digitVal}×${fromBase}<sup>${i}</sup>`);
      });
      steps.push(`<strong>Step 3:</strong> ${calcStr.reverse().join(' + ')} = <strong style="color:var(--primary);">${total}</strong> (Decimal)`);

      if (toBase === 10) {
        return steps;
      }

      // Convert decimal to target base
      let n = total;
      const remainders = [];
      if (n === 0) remainders.push(0);
      while (n > 0) {
        remainders.push(n % toBase);
        n = Math.floor(n / toBase);
      }
      remainders.reverse();
      const hexDigits = '0123456789ABCDEF';
      const remStr = remainders.map(r => hexDigits[r]).join('');
      steps.push(`<strong>Step 4:</strong> Convert Decimal ${total} to ${toName} by repeated division by ${toBase}:`);
      let work = total;
      const divisions = [];
      while (work > 0) {
        divisions.push(`${work} ÷ ${toBase} = ${Math.floor(work / toBase)} remainder <strong>${hexDigits[work % toBase]}</strong>`);
        work = Math.floor(work / toBase);
      }
      steps.push(`<div style="font-family:var(--font-mono);font-size:0.85rem;background:var(--bg-tertiary);padding:0.75rem;border-radius:var(--radius);margin-top:0.5rem;">${divisions.reverse().join('<br>')}</div>`);
      steps.push(`<strong>Step 5:</strong> Reading remainders bottom-up: <strong style="color:var(--success);">${remStr}</strong> (${toName})`);
    } else {
      // From decimal to another base
      if (toBase === 10) {
        steps.push(`Already in Decimal. Result: <strong style="color:var(--primary);">${value}</strong>`);
        return steps;
      }
      let n = parseInt(value, 10);
      const remainders = [];
      const hexDigits = '0123456789ABCDEF';
      if (n === 0) remainders.push(0);
      while (n > 0) {
        remainders.push(hexDigits[n % toBase]);
        n = Math.floor(n / toBase);
      }
      remainders.reverse();
      const divisions = [];
      let work = parseInt(value, 10);
      while (work > 0) {
        divisions.push(`${work} ÷ ${toBase} = ${Math.floor(work / toBase)} remainder <strong>${hexDigits[work % toBase]}</strong>`);
        work = Math.floor(work / toBase);
      }
      steps.push(`<strong>Step 2:</strong> Convert Decimal ${value} to ${toName} by repeated division by ${toBase}:`);
      steps.push(`<div style="font-family:var(--font-mono);font-size:0.85rem;background:var(--bg-tertiary);padding:0.75rem;border-radius:var(--radius);margin-top:0.5rem;">${divisions.reverse().join('<br>')}</div>`);
      steps.push(`<strong>Step 3:</strong> Reading remainders bottom-up: <strong style="color:var(--success);">${remainders.join('')}</strong> (${toName})`);
    }

    return steps;
  }

  function saveHistory(entry) {
    let history = [];
    try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) { history = []; }
    history.unshift(entry);
    history = history.slice(0, 10);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    const list = document.getElementById('historyList');
    if (!list) return;
    let history = [];
    try { history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch (e) {}
    if (history.length === 0) {
      list.innerHTML = '<div style="color:var(--text-tertiary);font-size:0.85rem;">No conversions yet</div>';
      return;
    }
    list.innerHTML = history.map(h => `
      <div class="step-box" style="font-family:var(--font-mono);font-size:0.85rem;display:flex;justify-content:space-between;align-items:center;gap:0.5rem;">
        <span>${h.input} <span style="color:var(--text-tertiary);">(${h.from})</span> → <strong style="color:var(--primary);">${h.output}</strong> <span style="color:var(--text-tertiary);">(${h.to})</span></span>
        <span style="font-size:0.7rem;color:var(--text-tertiary);">${h.time}</span>
      </div>
    `).join('');
  }

  function showError(msg) {
    const errEl = document.getElementById('convError');
    if (errEl) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
      setTimeout(() => { errEl.style.display = 'none'; }, 4000);
    }
  }

  function performConversion() {
    const input = document.getElementById('convInput').value.trim();
    const fromBase = parseInt(document.getElementById('convFrom').value, 10);
    const toBase = parseInt(document.getElementById('convTo').value, 10);

    if (!input) {
      showError('Please enter a value to convert');
      return;
    }

    const v = validate(input, fromBase);
    if (!v.ok) {
      showError(v.msg);
      return;
    }

    try {
      const result = convert(input, fromBase, toBase);
      const outputEl = document.getElementById('convOutput');
      if (outputEl) {
        if ('value' in outputEl) {
          outputEl.value = result;
        } else {
          outputEl.textContent = result;
        }
      }

      const steps = explainConversion(input, fromBase, toBase);
      const stepsEl = document.getElementById('convSteps');
      if (stepsEl) {
        stepsEl.innerHTML = steps.map(s => `<div class="step-box">${s}</div>`).join('');
      }

      // Save history
      saveHistory({
        input: input.toUpperCase(),
        from: nameOf(fromBase),
        output: result,
        to: nameOf(toBase),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      window.showToast(`Converted: ${input} → ${result}`, 'success');
    } catch (e) {
      showError('Conversion error: ' + e.message);
    }
  }

  function init() {
    const convertBtn = document.getElementById('convertBtn');
    if (!convertBtn) return;

    convertBtn.addEventListener('click', performConversion);

    document.getElementById('convInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performConversion();
    });

    document.getElementById('clearBtn')?.addEventListener('click', () => {
      document.getElementById('convInput').value = '';
      const outEl = document.getElementById('convOutput');
      if (outEl) {
        if ('value' in outEl) outEl.value = '';
        else outEl.textContent = '—';
      }
      document.getElementById('convSteps').innerHTML = '';
    });

    document.getElementById('copyBtn')?.addEventListener('click', (e) => {
      const outEl = document.getElementById('convOutput');
      const out = outEl ? ('value' in outEl ? outEl.value : outEl.textContent) : '';
      if (out && out !== '—') window.copyToClipboard(out, e.currentTarget);
    });

    document.getElementById('clearHistoryBtn')?.addEventListener('click', () => {
      localStorage.removeItem(HISTORY_KEY);
      renderHistory();
      window.showToast('History cleared', 'success');
    });

    // Quick converter buttons
    document.querySelectorAll('[data-quick]').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = btn.dataset.quick;
        document.getElementById('convInput').value = val;
        const from = parseInt(btn.dataset.from, 10);
        const to = parseInt(btn.dataset.to, 10);
        document.getElementById('convFrom').value = from;
        document.getElementById('convTo').value = to;
        performConversion();
      });
    });

    renderHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
