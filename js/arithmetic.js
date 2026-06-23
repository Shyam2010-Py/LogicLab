/* ==========================================================================
   LogicLab - Binary Arithmetic
   Addition, Subtraction, Multiplication, Division with step-by-step
   Version: 1.0.0
   ========================================================================== */

(function() {
  'use strict';

  function pad(s, len) {
    s = String(s);
    return ' '.repeat(Math.max(0, len - s.length)) + s;
  }

  function isBinary(s) {
    return /^[01]+$/.test(s);
  }

  /* --------------------- Addition --------------------- */
  function add(a, b) {
    const maxLen = Math.max(a.length, b.length) + 1;
    a = a.padStart(maxLen, '0');
    b = b.padStart(maxLen, '0');
    const steps = [];
    let carry = 0;
    let result = '';
    const carryRow = [];

    steps.push({
      label: 'Input',
      bitsA: a.split('').map(Number),
      bitsB: b.split('').map(Number),
      carry: new Array(maxLen).fill(null)
    });

    for (let i = maxLen - 1; i >= 0; i--) {
      const ba = parseInt(a[i], 10);
      const bb = parseInt(b[i], 10);
      const sum = ba + bb + carry;
      const bit = sum % 2;
      const newCarry = Math.floor(sum / 2);
      carryRow.unshift(newCarry);
      result = String(bit) + result;
      carry = newCarry;
    }

    steps.push({
      label: 'Carry out',
      bitsA: a.split('').map(Number),
      bitsB: b.split('').map(Number),
      carry: carryRow
    });

    steps.push({
      label: 'Sum',
      bitsA: a.split('').map(Number),
      bitsB: b.split('').map(Number),
      carry: carryRow,
      result: result.split('').map(Number)
    });

    return { result: result.replace(/^0+(?=\d)/, '') || '0', steps, operands: { a, b } };
  }

  /* --------------------- Subtraction (using 2's complement) --------------------- */
  function subtract(a, b) {
    // Standard column subtraction
    const maxLen = Math.max(a.length, b.length);
    a = a.padStart(maxLen, '0');
    b = b.padStart(maxLen, '0');
    const steps = [];
    let borrow = 0;
    let result = '';
    const borrowRow = [];

    const aArr = a.split('').map(Number);
    const bArr = b.split('').map(Number);

    steps.push({
      label: 'Input',
      bitsA: aArr.slice(),
      bitsB: bArr.slice(),
      borrow: new Array(maxLen).fill(null)
    });

    for (let i = maxLen - 1; i >= 0; i--) {
      let ba = aArr[i] - borrow;
      borrow = 0;
      if (ba < parseInt(bArr[i], 10)) {
        ba += 2;
        borrow = 1;
      }
      const bit = ba - parseInt(bArr[i], 10);
      result = String(bit) + result;
      borrowRow.unshift(borrow);
    }

    steps.push({
      label: 'Borrow',
      bitsA: aArr,
      bitsB: bArr,
      borrow: borrowRow
    });

    steps.push({
      label: 'Difference',
      bitsA: aArr,
      bitsB: bArr,
      borrow: borrowRow,
      result: result.split('').map(Number)
    });

    return { result: result.replace(/^0+(?=\d)/, '') || '0', steps, operands: { a, b } };
  }

  /* --------------------- Multiplication --------------------- */
  function multiply(a, b) {
    const aDec = parseInt(a, 2);
    const bDec = parseInt(b, 2);
    const dec = aDec * bDec;
    const result = dec.toString(2);

    const steps = [];
    steps.push({ text: `Convert to decimal: ${a}₂ = ${aDec}, ${b}₂ = ${bDec}` });
    steps.push({ text: `Multiply: ${aDec} × ${bDec} = ${dec}` });
    steps.push({ text: `Convert back to binary: ${dec}₁₀ = ${result}₂` });

    // Show shift-and-add steps
    const bArr = b.split('').reverse();
    const partials = [];
    for (let i = 0; i < bArr.length; i++) {
      if (bArr[i] === '1') {
        partials.push({ shift: i, value: a + '0'.repeat(i) });
      }
    }
    if (partials.length === 0) partials.push({ shift: 0, value: '0' });

    steps.push({ text: `Partial products:`, partials });
    steps.push({ text: `Sum all partial products → ${result}₂` });

    return { result, steps };
  }

  /* --------------------- Division --------------------- */
  function divide(a, b) {
    if (b === '0' || b === '') return { error: 'Division by zero' };
    const aDec = parseInt(a, 2);
    const bDec = parseInt(b, 2);
    if (bDec === 0) return { error: 'Division by zero' };

    const quotientDec = Math.floor(aDec / bDec);
    const remainderDec = aDec % bDec;
    const quotient = quotientDec.toString(2);
    const remainder = remainderDec.toString(2);

    const steps = [];
    steps.push({ text: `Convert to decimal: ${a}₂ = ${aDec}, ${b}₂ = ${bDec}` });
    steps.push({ text: `Divide: ${aDec} ÷ ${bDec} = ${quotientDec} remainder ${remainderDec}` });
    steps.push({ text: `Convert back: Quotient ${quotientDec}₁₀ = ${quotient}₂, Remainder ${remainderDec}₁₀ = ${remainder}₂` });

    return { result: quotient, remainder, steps };
  }

  /* --------------------- Render --------------------- */
  function renderSteps(containerId, result) {
    const c = document.getElementById(containerId);
    if (!c) return;

    if (result.error) {
      c.innerHTML = `<div class="alert alert-danger">${result.error}</div>`;
      return;
    }

    let html = '';
    if (result.steps) {
      result.steps.forEach((step, idx) => {
        if (step.bitsA) {
          html += `<div class="binary-step-row">
            <div class="binary-step-label">${step.label}</div>
            <div class="binary-step-bits">
              ${step.bitsA.map(b => `<span class="binary-bit ${b?'one':'zero'}">${b}</span>`).join('')}
            </div>
          </div>`;
          html += `<div class="binary-step-row">
            <div class="binary-step-label">${step.bitsB ? '&nbsp;' : ''}</div>
            <div class="binary-step-bits">
              ${step.bitsB ? step.bitsB.map(b => `<span class="binary-bit ${b?'one':'zero'}">${b}</span>`).join('') : ''}
            </div>
          </div>`;
          if (step.carry) {
            html += `<div class="binary-step-row">
              <div class="binary-step-label" style="color:var(--warning);">carry</div>
              <div class="binary-step-bits">
                ${step.carry.map(c => c === null ? '<span class="binary-bit" style="background:transparent;border:1px dashed var(--border);">·</span>' : `<span class="binary-bit ${c?'carry':'zero'}">${c}</span>`).join('')}
              </div>
            </div>`;
          }
          if (step.result) {
            html += `<div class="binary-step-row" style="border-top:2px solid var(--primary);padding-top:0.75rem;margin-top:0.25rem;">
              <div class="binary-step-label" style="color:var(--primary);font-weight:700;">result</div>
              <div class="binary-step-bits">
                ${step.result.map(b => `<span class="binary-bit ${b?'one':'zero'}" style="background:var(--primary-light);color:var(--primary);">${b}</span>`).join('')}
              </div>
            </div>`;
          }
          html += `<div style="height:0.5rem;"></div>`;
        } else if (step.text) {
          html += `<div class="step-box">${step.text}</div>`;
          if (step.partials) {
            html += step.partials.map(p => `<div class="step-box" style="font-size:0.85rem;">Shift ${p.shift}: <strong>${p.value}</strong></div>`).join('');
          }
        }
      });
    }
    c.innerHTML = html;
  }

  /* --------------------- Operations --------------------- */
  function performAdd() {
    const a = document.getElementById('addA').value.trim();
    const b = document.getElementById('addB').value.trim();
    const errEl = document.getElementById('addError');

    if (!isBinary(a) || !isBinary(b)) {
      errEl.textContent = 'Both inputs must be valid binary numbers (0s and 1s only)';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const r = add(a, b);
    document.getElementById('addResult').innerHTML = `<span class="result-value">${r.result}</span>`;
    document.getElementById('addResultDec').textContent = `Decimal: ${parseInt(r.result, 2)}`;
    renderSteps('addSteps', r);
  }

  function performSub() {
    const a = document.getElementById('subA').value.trim();
    const b = document.getElementById('subB').value.trim();
    const errEl = document.getElementById('subError');

    if (!isBinary(a) || !isBinary(b)) {
      errEl.textContent = 'Both inputs must be valid binary numbers (0s and 1s only)';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const r = subtract(a, b);
    document.getElementById('subResult').innerHTML = `<span class="result-value">${r.result}</span>`;
    document.getElementById('subResultDec').textContent = `Decimal: ${parseInt(r.result, 2)}`;
    renderSteps('subSteps', r);
  }

  function performMul() {
    const a = document.getElementById('mulA').value.trim();
    const b = document.getElementById('mulB').value.trim();
    const errEl = document.getElementById('mulError');

    if (!isBinary(a) || !isBinary(b)) {
      errEl.textContent = 'Both inputs must be valid binary numbers';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const r = multiply(a, b);
    document.getElementById('mulResult').innerHTML = `<span class="result-value">${r.result}</span>`;
    document.getElementById('mulResultDec').textContent = `Decimal: ${parseInt(r.result, 2)}`;
    renderSteps('mulSteps', r);
  }

  function performDiv() {
    const a = document.getElementById('divA').value.trim();
    const b = document.getElementById('divB').value.trim();
    const errEl = document.getElementById('divError');

    if (!isBinary(a) || !isBinary(b)) {
      errEl.textContent = 'Both inputs must be valid binary numbers';
      errEl.style.display = 'block';
      return;
    }
    if (b === '0') {
      errEl.textContent = 'Division by zero is not allowed';
      errEl.style.display = 'block';
      return;
    }
    errEl.style.display = 'none';

    const r = divide(a, b);
    if (r.error) {
      errEl.textContent = r.error;
      errEl.style.display = 'block';
      return;
    }
    document.getElementById('divResult').innerHTML = `<span class="result-value">${r.result}</span>`;
    document.getElementById('divResultRem').textContent = `Remainder: ${r.remainder}₂ (${parseInt(r.remainder, 2)})`;
    renderSteps('divSteps', r);
  }

  function init() {
    document.getElementById('addBtn')?.addEventListener('click', performAdd);
    document.getElementById('subBtn')?.addEventListener('click', performSub);
    document.getElementById('mulBtn')?.addEventListener('click', performMul);
    document.getElementById('divBtn')?.addEventListener('click', performDiv);

    // Examples
    document.querySelectorAll('[data-arith-example]').forEach(btn => {
      btn.addEventListener('click', () => {
        const op = btn.dataset.op;
        document.getElementById(`${op}A`).value = btn.dataset.a;
        document.getElementById(`${op}B`).value = btn.dataset.b;
        if (op === 'add') performAdd();
        else if (op === 'sub') performSub();
        else if (op === 'mul') performMul();
        else if (op === 'div') performDiv();
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.LogicLabArith = { add, subtract, multiply, divide };
})();
