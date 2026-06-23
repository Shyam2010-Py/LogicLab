/* ==========================================================================
   LogicLab - Quiz System
   100+ Digital Electronics questions with score tracking
   Version: 1.0.0
   ========================================================================== */

(function() {
  'use strict';

  // Comprehensive question bank (110+ questions)
  const QUESTIONS = [
    // Number Systems (15)
    { q: "What is the base of the binary number system?", o: ["2", "8", "10", "16"], a: 0, cat: "Number Systems" },
    { q: "Convert binary 1011 to decimal.", o: ["9", "10", "11", "12"], a: 2, cat: "Number Systems" },
    { q: "What is 255 in binary?", o: ["11111110", "11111111", "10000000", "11110000"], a: 1, cat: "Number Systems" },
    { q: "The hexadecimal equivalent of decimal 16 is:", o: ["F", "10", "11", "A0"], a: 1, cat: "Number Systems" },
    { q: "BCD stands for:", o: ["Binary Coded Decimal", "Binary Code Data", "Basic Coded Digit", "Byte Code Decimal"], a: 0, cat: "Number Systems" },
    { q: "Which is a valid octal digit?", o: ["8", "9", "7", "A"], a: 2, cat: "Number Systems" },
    { q: "Octal 17 is equal to decimal:", o: ["15", "17", "10", "14"], a: 0, cat: "Number Systems" },
    { q: "What is the decimal value of 1A in hex?", o: ["26", "16", "1A", "10"], a: 0, cat: "Number Systems" },
    { q: "Hex FFFF equals decimal:", o: ["65535", "65536", "4095", "65534"], a: 0, cat: "Number Systems" },
    { q: "Which number system has base 16?", o: ["Binary", "Octal", "Decimal", "Hexadecimal"], a: 3, cat: "Number Systems" },
    { q: "The 2's complement of 00001111 is:", o: ["11110000", "11110001", "00010000", "11111111"], a: 1, cat: "Number Systems" },
    { q: "Gray code is also known as:", o: ["Reflected Binary Code", "Sequential Code", "Weighted Code", "BCD Code"], a: 0, cat: "Number Systems" },
    { q: "In Gray code, two adjacent codes differ by:", o: ["1 bit", "2 bits", "3 bits", "Any number of bits"], a: 0, cat: "Number Systems" },
    { q: "Excess-3 code is obtained by adding ____ to each BCD digit.", o: ["3", "4", "2", "5"], a: 0, cat: "Number Systems" },
    { q: "1's complement of 10101010 is:", o: ["01010101", "10101011", "01010110", "11111111"], a: 0, cat: "Number Systems" },

    // Logic Gates (15)
    { q: "A NAND gate is called a universal gate because:", o: ["It is cheap", "Any logic function can be built using only NAND gates", "It uses less power", "It is faster"], a: 1, cat: "Logic Gates" },
    { q: "The output of AND gate is 1 only when:", o: ["Any input is 1", "All inputs are 1", "No input is 1", "At least one input is 0"], a: 1, cat: "Logic Gates" },
    { q: "A XOR gate output is 1 when:", o: ["All inputs are same", "Inputs are different", "All inputs are 0", "All inputs are 1"], a: 1, cat: "Logic Gates" },
    { q: "NOT gate has:", o: ["Two inputs", "One input", "Three inputs", "No input"], a: 1, cat: "Logic Gates" },
    { q: "NOR gate output is 1 when:", o: ["Any input is 1", "All inputs are 0", "Inputs are different", "All inputs are 1"], a: 1, cat: "Logic Gates" },
    { q: "IC 7400 contains:", o: ["Quad AND gates", "Quad NAND gates", "Quad OR gates", "Quad NOR gates"], a: 1, cat: "Logic Gates" },
    { q: "The bubble in a logic symbol indicates:", o: ["Amplification", "Inversion", "Output", "Input"], a: 1, cat: "Logic Gates" },
    { q: "De Morgan's theorem states (A·B)' =", o: ["A'·B'", "A'+B'", "A·B", "A+B"], a: 1, cat: "Logic Gates" },
    { q: "How many NAND gates are needed to implement an XOR gate?", o: ["2", "3", "4", "5"], a: 2, cat: "Logic Gates" },
    { q: "The output of XNOR gate is 1 when:", o: ["Inputs are different", "Inputs are same", "Any input is 1", "All inputs are 0"], a: 1, cat: "Logic Gates" },
    { q: "A buffer is used to:", o: ["Invert the signal", "Amplify the signal without inversion", "Delay the signal", "Store the signal"], a: 1, cat: "Logic Gates" },
    { q: "A 3-input AND gate with inputs 1,1,0 gives output:", o: ["0", "1", "3", "Undefined"], a: 0, cat: "Logic Gates" },
    { q: "Tri-state logic has how many valid output states?", o: ["1", "2", "3", "4"], a: 2, cat: "Logic Gates" },
    { q: "IC 7486 contains:", o: ["Quad AND gates", "Quad XOR gates", "Quad XNOR gates", "Quad OR gates"], a: 1, cat: "Logic Gates" },
    { q: "The expression A + A' equals:", o: ["0", "A", "1", "A'"], a: 2, cat: "Logic Gates" },

    // Boolean Algebra (10)
    { q: "A + A equals:", o: ["2A", "1", "A", "0"], a: 2, cat: "Boolean Algebra" },
    { q: "A · A equals:", o: ["A²", "A", "1", "0"], a: 1, cat: "Boolean Algebra" },
    { q: "The distributive law A(B+C) =", o: ["AB + AC", "AB + C", "A + BC", "(A+B)(A+C)"], a: 0, cat: "Boolean Algebra" },
    { q: "A + AB =", o: ["B", "A", "AB", "1"], a: 1, cat: "Boolean Algebra" },
    { q: "A + A'B =", o: ["A + B", "A' + B", "AB", "1"], a: 0, cat: "Boolean Algebra" },
    { q: "K-map is used for:", o: ["Logic simplification", "Data storage", "Counting", "Encoding"], a: 0, cat: "Boolean Algebra" },
    { q: "A 4-variable K-map has how many cells?", o: ["8", "12", "16", "32"], a: 2, cat: "Boolean Algebra" },
    { q: "SOP stands for:", o: ["Sum of Products", "Standard Output Process", "Simple Output Pattern", "Sum of Parts"], a: 0, cat: "Boolean Algebra" },
    { q: "Which is the dual of (A+B)(C+D)?", o: ["AB+CD", "(A·B)(C·D)", "AB + CD", "A + B + C + D"], a: 0, cat: "Boolean Algebra" },
    { q: "Don't care conditions in K-map can be treated as:", o: ["Always 0", "Always 1", "Either 0 or 1 (whichever helps)", "Always invalid"], a: 2, cat: "Boolean Algebra" },

    // Combinational Circuits (15)
    { q: "A half adder has how many inputs?", o: ["1", "2", "3", "4"], a: 1, cat: "Combinational Circuits" },
    { q: "The Sum output of a half adder with A=1, B=1 is:", o: ["0", "1", "2", "10"], a: 0, cat: "Combinational Circuits" },
    { q: "A full adder has how many inputs?", o: ["1", "2", "3", "4"], a: 1, cat: "Combinational Circuits" },
    { q: "Sum output of a full adder with A=1, B=1, Cin=1 is:", o: ["0", "1", "2", "3"], a: 1, cat: "Combinational Circuits" },
    { q: "Carry output of full adder with A=1, B=1, Cin=1 is:", o: ["0", "1", "2", "11"], a: 1, cat: "Combinational Circuits" },
    { q: "A 4-bit ripple carry adder requires how many full adders?", o: ["2", "3", "4", "5"], a: 2, cat: "Combinational Circuits" },
    { q: "A 4-to-1 MUX has how many select lines?", o: ["1", "2", "3", "4"], a: 1, cat: "Combinational Circuits" },
    { q: "An 8-to-1 MUX has how many data inputs?", o: ["3", "4", "8", "16"], a: 2, cat: "Combinational Circuits" },
    { q: "A 3-to-8 decoder has how many outputs?", o: ["3", "6", "8", "16"], a: 2, cat: "Combinational Circuits" },
    { q: "A 4-to-2 priority encoder resolves when multiple inputs are 1 by:", o: ["Selecting lowest", "Selecting highest priority", "Output 00", "Error"], a: 1, cat: "Combinational Circuits" },
    { q: "A 1-to-4 DEMUX has how many select lines?", o: ["1", "2", "3", "4"], a: 1, cat: "Combinational Circuits" },
    { q: "BCD to 7-segment decoder has:", o: ["3 inputs, 7 outputs", "4 inputs, 7 outputs", "7 inputs, 4 outputs", "4 inputs, 10 outputs"], a: 1, cat: "Combinational Circuits" },
    { q: "A comparator is used to:", o: ["Add numbers", "Compare two numbers", "Multiply numbers", "Divide numbers"], a: 1, cat: "Combinational Circuits" },
    { q: "IC 74138 is a:", o: ["3-to-8 decoder", "8-to-3 encoder", "4-to-1 MUX", "Binary counter"], a: 0, cat: "Combinational Circuits" },
    { q: "A subtractor can be implemented using:", o: ["Adder + XOR gates", "Only AND gates", "Only OR gates", "Only NOT gates"], a: 0, cat: "Combinational Circuits" },

    // Sequential Circuits (15)
    { q: "A flip-flop stores how many bits?", o: ["1", "2", "4", "8"], a: 0, cat: "Sequential Circuits" },
    { q: "SR flip-flop has invalid state when:", o: ["S=0, R=0", "S=0, R=1", "S=1, R=0", "S=1, R=1"], a: 3, cat: "Sequential Circuits" },
    { q: "JK flip-flop with J=K=1 acts as:", o: ["Hold", "Reset", "Toggle", "Set"], a: 2, cat: "Sequential Circuits" },
    { q: "D flip-flop equation is:", o: ["Q = D", "Q = J + K", "Q = S + R", "Q = T"], a: 0, cat: "Sequential Circuits" },
    { q: "T flip-flop toggles when:", o: ["T=0", "T=1", "T=clock", "Always"], a: 1, cat: "Sequential Circuits" },
    { q: "A latch is ____ triggered.", o: ["Edge", "Level", "Pulse", "Clock"], a: 1, cat: "Sequential Circuits" },
    { q: "Master-slave flip-flop is used to avoid:", o: ["Power consumption", "Race condition", "Clock speed", "Heat"], a: 1, cat: "Sequential Circuits" },
    { q: "Setup time is the time:", o: ["Data is stable before clock edge", "Data is stable after clock edge", "Clock is high", "Clock is low"], a: 0, cat: "Sequential Circuits" },
    { q: "Hold time is the time:", o: ["Data must remain stable after clock edge", "Data must remain stable before clock edge", "Clock is high", "Reset is active"], a: 0, cat: "Sequential Circuits" },
    { q: "Asynchronous counter is also called:", o: ["Ripple counter", "Johnson counter", "Ring counter", "Mod counter"], a: 0, cat: "Sequential Circuits" },
    { q: "A 3-bit synchronous counter counts from:", o: ["000 to 111", "001 to 111", "000 to 010", "001 to 011"], a: 0, cat: "Sequential Circuits" },
    { q: "Mod-10 counter is also called:", o: ["Decade counter", "Binary counter", "Ring counter", "Up counter"], a: 0, cat: "Sequential Circuits" },
    { q: "Shift register can be used for:", o: ["Data storage", "Data conversion", "Data shifting", "All of the above"], a: 3, cat: "Sequential Circuits" },
    { q: "SIPO register converts:", o: ["Serial to parallel", "Parallel to serial", "Serial to serial", "Parallel to parallel"], a: 0, cat: "Sequential Circuits" },
    { q: "Johnson counter requires ____ flip-flops for n states.", o: ["n", "n/2", "2n", "n²"], a: 2, cat: "Sequential Circuits" },

    // Memory & PLD (10)
    { q: "ROM stands for:", o: ["Read Only Memory", "Random Only Memory", "Read Output Memory", "Run Only Memory"], a: 0, cat: "Memory & PLD" },
    { q: "SRAM uses:", o: ["Capacitors", "Flip-flops", "Magnetic cores", "Fuses"], a: 1, cat: "Memory & PLD" },
    { q: "DRAM needs:", o: ["No refreshing", "Periodic refreshing", "High voltage", "Cooling"], a: 1, cat: "Memory & PLD" },
    { q: "PLA has:", o: ["Fixed AND, fixed OR", "Programmable AND, fixed OR", "Fixed AND, programmable OR", "Programmable AND, programmable OR"], a: 3, cat: "Memory & PLD" },
    { q: "PAL has:", o: ["Fixed AND, fixed OR", "Programmable AND, fixed OR", "Fixed AND, programmable OR", "Programmable AND, programmable OR"], a: 1, cat: "Memory & PLD" },
    { q: "PROM is:", o: ["Programmed once", "Reprogrammable", "Volatile", "Read-only after manufacture"], a: 0, cat: "Memory & PLD" },
    { q: "Which is volatile memory?", o: ["ROM", "RAM", "PROM", "EPROM"], a: 1, cat: "Memory & PLD" },
    { q: "FPGA stands for:", o: ["Fast Programmable Gate Array", "Field Programmable Gate Array", "Full Programmable Gate Array", "Fixed Programmable Gate Array"], a: 1, cat: "Memory & PLD" },
    { q: "EPROM can be erased by:", o: ["Electricity", "UV light", "Heat", "Magnetism"], a: 1, cat: "Memory & PLD" },
    { q: "Cache memory is located:", o: ["On the hard disk", "Between CPU and RAM", "In the keyboard", "On the monitor"], a: 1, cat: "Memory & PLD" },

    // A/D and D/A (10)
    { q: "R-2R ladder is used in:", o: ["ADC", "DAC", "Encoder", "Decoder"], a: 1, cat: "ADC/DAC" },
    { q: "Flash ADC is the:", o: ["Slowest", "Fastest", "Most accurate", "Cheapest"], a: 1, cat: "ADC/DAC" },
    { q: "Successive approximation ADC uses:", o: ["Binary search", "Linear search", "Random sampling", "Direct comparison"], a: 0, cat: "ADC/DAC" },
    { q: "Dual-slope ADC is used in:", o: ["Digital cameras", "Digital voltmeters", "Audio systems", "Radar"], a: 1, cat: "ADC/DAC" },
    { q: "An 8-bit ADC has a resolution of:", o: ["1/8", "1/64", "1/128", "1/256"], a: 3, cat: "ADC/DAC" },
    { q: "Resolution of DAC is determined by:", o: ["Number of bits", "Clock speed", "Power supply", "Voltage"], a: 0, cat: "ADC/DAC" },
    { q: "Sample and hold circuit is used in:", o: ["ADC", "DAC", "Both", "Neither"], a: 0, cat: "ADC/DAC" },
    { q: "Aliasing occurs when:", o: ["Sample rate > 2 × signal freq", "Sample rate < 2 × signal freq", "Sample rate = signal freq", "Sample rate = 0"], a: 1, cat: "ADC/DAC" },
    { q: "Nyquist rate is:", o: ["Same as signal frequency", "Half the signal frequency", "Twice the signal frequency", "Independent"], a: 2, cat: "ADC/DAC" },
    { q: "Which is fastest ADC type?", o: ["Dual slope", "Successive approx", "Flash", "Counter"], a: 2, cat: "ADC/DAC" },

    // Logic Families (10)
    { q: "TTL stands for:", o: ["Transistor-Transistor Logic", "Triode Transistor Logic", "Transistor Timing Logic", "Time-Triggered Logic"], a: 0, cat: "Logic Families" },
    { q: "CMOS uses:", o: ["Bipolar transistors", "MOSFETs", "Vacuum tubes", "Relays"], a: 1, cat: "Logic Families" },
    { q: "Which logic family consumes least power?", o: ["TTL", "CMOS", "ECL", "RTL"], a: 1, cat: "Logic Families" },
    { q: "ECL stands for:", o: ["Emitter-Coupled Logic", "Easy Coupled Logic", "Emitter Capacitor Logic", "Enhanced Coupled Logic"], a: 0, cat: "Logic Families" },
    { q: "ECL is known for:", o: ["Low power", "High speed", "Low noise", "Small size"], a: 1, cat: "Logic Families" },
    { q: "Standard TTL supply voltage is:", o: ["3.3V", "5V", "12V", "15V"], a: 1, cat: "Logic Families" },
    { q: "Fan-out of standard TTL is typically:", o: ["1", "5", "10", "20"], a: 2, cat: "Logic Families" },
    { q: "Propagation delay is measured between:", o: ["10% and 90% of signal levels", "0% and 100%", "50% to 50%", "20% to 80%"], a: 2, cat: "Logic Families" },
    { q: "Noise margin is the difference between:", o: ["V_OH and V_IH", "V_OL and V_IL", "Both A and B", "V_CC and GND"], a: 2, cat: "Logic Families" },
    { q: "Schottky TTL is faster because it prevents:", o: ["Power loss", "Saturation of transistors", "Heat", "Voltage drop"], a: 1, cat: "Logic Families" },

    // VHDL & Verilog (10)
    { q: "VHDL stands for:", o: ["VHSIC Hardware Description Language", "Very High Definition Logic", "Virtual Hardware Description Language", "Variable Hardware Design Language"], a: 0, cat: "HDL" },
    { q: "VHDL is used for:", o: ["Describing hardware", "Programming microcontrollers", "Web development", "Database management"], a: 0, cat: "HDL" },
    { q: "In VHDL, the 'entity' describes:", o: ["Internal behavior", "External interface", "Test bench", "Configuration"], a: 1, cat: "HDL" },
    { q: "Verilog uses which style for combinational logic?", o: ["Procedural always block", "Concurrent assignments", "Both A and B", "None"], a: 2, cat: "HDL" },
    { q: "Which is correct VHDL assignment for sequential logic?", o: [":=", "<=", "==", "="], a: 1, cat: "HDL" },
    { q: "FPGAs are typically programmed using:", o: ["C++", "Python", "HDLs (VHDL/Verilog)", "Java"], a: 2, cat: "HDL" },
    { q: "In Verilog, 'wire' is used for:", o: ["Sequential elements", "Combinational connections", "Memory", "Registers"], a: 1, cat: "HDL" },
    { q: "In Verilog, 'reg' can store a value:", o: ["Continuously", "Only inside always block", "Always", "Never"], a: 1, cat: "HDL" },
    { q: "A test bench is used to:", o: ["Implement hardware", "Simulate and verify designs", "Program FPGAs", "Generate waveforms"], a: 1, cat: "HDL" },
    { q: "Synthesis converts HDL code to:", o: ["Software", "Gate-level netlist", "Executable file", "Document"], a: 1, cat: "HDL" }
  ];

  const QUESTIONS_PER_QUIZ = 20;
  const QUIZ_KEY = 'logiclab-quiz-state';
  const STATS_KEY = 'logiclab-quiz-stats';

  const state = {
    questions: [],
    current: 0,
    answers: [],
    mode: 'menu' // menu, quiz, review, results
  };

  let stats = loadStats();

  function loadStats() {
    try { return JSON.parse(localStorage.getItem(STATS_KEY)) || { totalAttempts: 0, totalScore: 0, totalQuestions: 0, bestScore: 0 }; }
    catch (e) { return { totalAttempts: 0, totalScore: 0, totalQuestions: 0, bestScore: 0 }; }
  }

  function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function startQuiz(category) {
    let pool = QUESTIONS;
    if (category && category !== 'all') {
      pool = QUESTIONS.filter(q => q.cat === category);
    }
    const shuffled = shuffle(pool);
    state.questions = shuffled.slice(0, QUESTIONS_PER_QUIZ);
    state.current = 0;
    state.answers = new Array(state.questions.length).fill(null);
    state.mode = 'quiz';
    saveState();
    render();
  }

  function saveState() {
    if (state.mode === 'quiz') {
      sessionStorage.setItem(QUIZ_KEY, JSON.stringify({
        current: state.current,
        answers: state.answers,
        questionIds: state.questions.map((q, i) => QUESTIONS.indexOf(q))
      }));
    }
  }

  function loadState() {
    try {
      const saved = JSON.parse(sessionStorage.getItem(QUIZ_KEY) || 'null');
      if (saved && saved.questionIds && saved.questionIds.length > 0) {
        state.questions = saved.questionIds.map(id => QUESTIONS[id]);
        state.current = saved.current;
        state.answers = saved.answers;
        state.mode = 'quiz';
        return true;
      }
    } catch (e) {}
    return false;
  }

  function selectAnswer(idx) {
    if (state.answers[state.current] !== null && state.answers[state.current] !== undefined) return;
    state.answers[state.current] = idx;
    saveState();
    render();
  }

  function nextQuestion() {
    if (state.current < state.questions.length - 1) {
      state.current++;
      saveState();
      render();
    } else {
      finishQuiz();
    }
  }

  function prevQuestion() {
    if (state.current > 0) {
      state.current--;
      saveState();
      render();
    }
  }

  function finishQuiz() {
    const score = state.answers.reduce((acc, a, i) => acc + (a === state.questions[i].a ? 1 : 0), 0);
    state.score = score;
    state.mode = 'results';
    stats.totalAttempts++;
    stats.totalScore += score;
    stats.totalQuestions += state.questions.length;
    if (score > stats.bestScore) stats.bestScore = score;
    saveStats();
    sessionStorage.removeItem(QUIZ_KEY);
    render();
  }

  function restart() {
    state.mode = 'menu';
    state.questions = [];
    state.current = 0;
    state.answers = [];
    sessionStorage.removeItem(QUIZ_KEY);
    render();
  }

  function renderMenu() {
    const cats = ['all', ...new Set(QUESTIONS.map(q => q.cat))];
    const accuracy = stats.totalQuestions > 0 ? Math.round((stats.totalScore / stats.totalQuestions) * 100) : 0;

    return `
      <div class="card mb-3 text-center fade-in">
        <div style="font-size:3rem;margin-bottom:1rem;">🎯</div>
        <h2>Ready to Test Your Knowledge?</h2>
        <p style="max-width:500px;margin:0 auto 1.5rem;">Challenge yourself with ${QUESTIONS.length}+ questions across ${cats.length - 1} topics. Each quiz contains ${QUESTIONS_PER_QUIZ} randomized questions.</p>

        <div class="grid-4 mb-3">
          <div class="stat-card">
            <div class="stat-icon">📝</div>
            <div>
              <div class="stat-value">${QUESTIONS.length}</div>
              <div class="stat-label">Total Questions</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🎯</div>
            <div>
              <div class="stat-value">${QUESTIONS_PER_QUIZ}</div>
              <div class="stat-label">Per Quiz</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🏆</div>
            <div>
              <div class="stat-value">${stats.bestScore}</div>
              <div class="stat-label">Best Score</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div>
              <div class="stat-value">${accuracy}%</div>
              <div class="stat-label">Accuracy</div>
            </div>
          </div>
        </div>

        <h3 style="margin-top:2rem;">Choose a Category</h3>
        <div class="grid-3 mt-2">
          <button class="btn btn-primary btn-lg" data-start="all">🌐 All Topics</button>
          ${cats.filter(c => c !== 'all').map(c => `<button class="btn btn-outline" data-start="${c}">${c}</button>`).join('')}
        </div>

        ${stats.totalAttempts > 0 ? `
          <div style="margin-top:2rem;font-size:0.85rem;color:var(--text-secondary);">
            Completed: ${stats.totalAttempts} quiz${stats.totalAttempts !== 1 ? 'zes' : ''} · Total score: ${stats.totalScore}/${stats.totalQuestions}
          </div>
        ` : ''}
      </div>
    `;
  }

  function renderQuiz() {
    const q = state.questions[state.current];
    const selected = state.answers[state.current];
    const answered = selected !== null && selected !== undefined;
    const progress = ((state.current + 1) / state.questions.length) * 100;

    const letters = ['A', 'B', 'C', 'D'];
    let optionsHtml = q.o.map((opt, i) => {
      let cls = 'quiz-option';
      if (answered) {
        cls += ' disabled';
        if (i === q.a) cls += ' correct';
        else if (i === selected) cls += ' wrong';
      } else if (selected === i) {
        cls += ' selected';
      }
      return `
        <button class="${cls}" data-option="${i}">
          <span class="quiz-option-letter">${letters[i]}</span>
          <span>${opt}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="card mb-3 fade-in">
        <div class="flex justify-between items-center mb-2" style="flex-wrap:wrap;gap:0.5rem;">
          <span class="badge badge-primary">${q.cat}</span>
          <span style="font-size:0.85rem;color:var(--text-secondary);">Question ${state.current + 1} of ${state.questions.length}</span>
        </div>

        <div class="quiz-progress">
          <div class="quiz-progress-bar" style="width:${progress}%"></div>
        </div>

        <div class="quiz-question">${state.current + 1}. ${q.q}</div>

        <div class="quiz-options">
          ${optionsHtml}
        </div>

        ${answered ? `
          <div class="alert ${selected === q.a ? 'alert-success' : 'alert-danger'}" style="margin-top:1rem;">
            <strong>${selected === q.a ? '✓ Correct!' : '✗ Incorrect'}</strong> The correct answer is <strong>${letters[q.a]}. ${q.o[q.a]}</strong>
          </div>
        ` : ''}

        <div class="flex justify-between mt-3" style="gap:0.5rem;">
          <button class="btn btn-secondary" id="prevBtn" ${state.current === 0 ? 'disabled' : ''}>← Previous</button>
          <div style="flex:1;text-align:center;font-size:0.85rem;color:var(--text-secondary);padding:0.5rem;">
            Answered: ${state.answers.filter(a => a !== null && a !== undefined).length}/${state.questions.length}
          </div>
          <button class="btn btn-primary" id="nextBtn">${state.current === state.questions.length - 1 ? 'Finish Quiz ✓' : 'Next →'}</button>
        </div>
      </div>
    `;
  }

  function renderResults() {
    const score = state.score || 0;
    const total = state.questions.length;
    const pct = Math.round((score / total) * 100);
    let grade, gradeColor;
    if (pct >= 90) { grade = 'Excellent! 🌟'; gradeColor = 'var(--success)'; }
    else if (pct >= 75) { grade = 'Great Job! 🎉'; gradeColor = 'var(--primary)'; }
    else if (pct >= 50) { grade = 'Good Effort! 👍'; gradeColor = 'var(--warning)'; }
    else { grade = 'Keep Practicing! 📚'; gradeColor = 'var(--danger)'; }

    const reviewHtml = state.questions.map((q, i) => {
      const userAns = state.answers[i];
      const correct = userAns === q.a;
      const letters = ['A', 'B', 'C', 'D'];
      return `
        <div class="step-box" style="border-left:3px solid ${correct ? 'var(--success)' : 'var(--danger)'};">
          <div style="font-weight:600;margin-bottom:0.4rem;">${i + 1}. ${q.q}</div>
          <div style="font-size:0.85rem;">
            Your answer: <span style="color:${correct ? 'var(--success)' : 'var(--danger)'};font-weight:600;">${letters[userAns]}. ${q.o[userAns]}</span>
            ${correct ? '' : `<br>Correct: <span style="color:var(--success);font-weight:600;">${letters[q.a]}. ${q.o[q.a]}</span>`}
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="card mb-3 text-center fade-in">
        <div style="font-size:4rem;margin-bottom:1rem;">${pct >= 75 ? '🏆' : pct >= 50 ? '🎯' : '📚'}</div>
        <h2 style="color:${gradeColor};">${grade}</h2>
        <div style="font-size:2.5rem;font-weight:800;margin:1rem 0;color:${gradeColor};">${score} / ${total}</div>
        <div style="font-size:1.1rem;color:var(--text-secondary);">Accuracy: ${pct}%</div>
      </div>

      <div class="grid-3 mb-3">
        <div class="stat-card">
          <div class="stat-icon">✅</div>
          <div>
            <div class="stat-value">${score}</div>
            <div class="stat-label">Correct</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">❌</div>
          <div>
            <div class="stat-value">${total - score}</div>
            <div class="stat-label">Incorrect</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div>
            <div class="stat-value">${pct}%</div>
            <div class="stat-label">Score</div>
          </div>
        </div>
      </div>

      <div class="card mb-3">
        <h3 style="margin-bottom:0.75rem;">📋 Answer Review</h3>
        ${reviewHtml}
      </div>

      <div class="flex gap-2" style="flex-wrap:wrap;justify-content:center;">
        <button class="btn btn-primary btn-lg" id="restartBtn">🔄 Take Another Quiz</button>
        <button class="btn btn-outline" id="homeBtn">🏠 Back to Menu</button>
      </div>
    `;
  }

  function render() {
    const app = document.getElementById('quiz-app');
    if (!app) return;

    if (state.mode === 'menu') app.innerHTML = renderMenu();
    else if (state.mode === 'quiz') app.innerHTML = renderQuiz();
    else if (state.mode === 'results') app.innerHTML = renderResults();

    attachListeners();
  }

  function attachListeners() {
    document.querySelectorAll('[data-start]').forEach(btn => {
      btn.addEventListener('click', () => startQuiz(btn.dataset.start));
    });
    document.querySelectorAll('[data-option]').forEach(btn => {
      btn.addEventListener('click', () => selectAnswer(parseInt(btn.dataset.option, 10)));
    });
    document.getElementById('nextBtn')?.addEventListener('click', nextQuestion);
    document.getElementById('prevBtn')?.addEventListener('click', prevQuestion);
    document.getElementById('restartBtn')?.addEventListener('click', restart);
    document.getElementById('homeBtn')?.addEventListener('click', restart);
  }

  function init() {
    // Try to resume an in-progress quiz
    if (loadState()) {
      render();
    } else {
      state.mode = 'menu';
      render();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
