/* ==========================================
   HAPPY JULA — All Games
   18 fully playable cognitive games
   ========================================== */

HappyJula.games = {
    list: [
        // MEMORY
        { id: 'card-flip', name: 'Card Flip', icon: '🃏', category: 'Memory', desc: 'Find matching pairs by flipping cards.' },
        { id: 'number-recall', name: 'Number Recall', icon: '🔢', category: 'Memory', desc: 'Memorize and recall a sequence of numbers.' },
        { id: 'color-recall', name: 'Color Recall', icon: '🎨', category: 'Memory', desc: 'Remember and repeat the color sequence.' },
        { id: 'grid-recall', name: 'Grid Recall', icon: '▦', category: 'Memory', desc: 'Remember which cells were highlighted.' },
        { id: 'emoji-recall', name: 'Emoji Recall', icon: '😀', category: 'Memory', desc: 'Recall emoji positions on a grid.' },
        // ATTENTION
        { id: 'odd-one-out', name: 'Odd One Out', icon: '🔍', category: 'Attention', desc: 'Find the item that is different.' },
        { id: 'moving-target', name: 'Moving Target', icon: '🎯', category: 'Attention', desc: 'Track and tap the correct moving target.' },
        { id: 'spot-symbol', name: 'Spot Symbol', icon: '🔎', category: 'Attention', desc: 'Find the target symbol in a grid.' },
        // SPEED
        { id: 'reaction-test', name: 'Reaction Test', icon: '⚡', category: 'Speed', desc: 'Tap as fast as you can when the screen changes.' },
        { id: 'lightning-math', name: 'Lightning Math', icon: '🌩️', category: 'Speed', desc: 'Solve arithmetic problems quickly.' },
        { id: 'quick-compare', name: 'Quick Compare', icon: '⚖️', category: 'Speed', desc: 'Which group has more? Decide fast!' },
        // LOGIC
        { id: 'pattern-builder', name: 'Pattern Builder', icon: '🧩', category: 'Logic', desc: 'Complete the pattern by finding the missing piece.' },
        { id: 'sequence-master', name: 'Sequence Master', icon: '🎵', category: 'Logic', desc: 'Remember and repeat an ever-growing sequence.' },
        // MATH
        { id: 'mental-arithmetic', name: 'Mental Arithmetic', icon: '🧮', category: 'Math', desc: 'Solve increasingly complex math problems.' },
        { id: 'number-balance', name: 'Number Balance', icon: '⚖️', category: 'Math', desc: 'Find the missing number to balance the equation.' },
        // LANGUAGE
        { id: 'word-recall', name: 'Word Recall', icon: '📝', category: 'Language', desc: 'Remember words from a list shown briefly.' },
        { id: 'spell-challenge', name: 'Spell Challenge', icon: '✏️', category: 'Language', desc: 'Identify the correctly spelled word.' },
        // EXECUTIVE
        { id: 'task-switch', name: 'Task Switch', icon: '🔄', category: 'Executive', desc: 'Rapidly switch between different rules.' },
    ],

    categories: ['All', 'Memory', 'Attention', 'Speed', 'Logic', 'Math', 'Language', 'Executive'],

    diffConfig: {
        'card-flip':     { beginner: [2,2], easy: [3,2], medium: [4,3], hard: [4,4], expert: [5,4], master: [6,5] },
        'number-recall': { beginner: 3, easy: 4, medium: 5, hard: 6, expert: 7, master: 9 },
        'grid-recall':   { beginner: [3,2], easy: [4,3], medium: [4,4], hard: [5,4], expert: [5,5], master: [6,5] },
        'color-recall':  { beginner: 3, easy: 4, medium: 5, hard: 6, expert: 7, master: 9 },
        'odd-one-out':   { beginner: [3,1], easy: [4,1], medium: [5,2], hard: [6,2], expert: [7,3], master: [9,3] },
        'moving-target': { beginner: [3,1], easy: [4,1], medium: [5,2], hard: [6,3], expert: [8,3], master: [10,4] },
        'spot-symbol':   { beginner: [3,1], easy: [4,1], medium: [5,1], hard: [6,2], expert: [7,2], master: [8,2] },
        'lightning-math':{ beginner: [10,1], easy: [10,2], medium: [15,2], hard: [15,3], expert: [20,3], master: [20,4] },
        'quick-compare': { beginner: 10, easy: 15, medium: 20, hard: 25, expert: 30, master: 35 },
        'pattern-builder':{ beginner: [3,1], easy: [4,1], medium: [5,2], hard: [6,2], expert: [7,3], master: [8,3] },
        'sequence-master':{ beginner: 3, easy: 4, medium: 5, hard: 6, expert: 8, master: 10 },
        'mental-arithmetic':{ beginner: [10,1], easy: [10,2], medium: [15,2], hard: [15,3], expert: [20,3], master: [20,4] },
        'number-balance':{ beginner: 10, easy: 15, medium: 20, hard: 25, expert: 30, master: 35 },
        'word-recall':   { beginner: 3, easy: 4, medium: 5, hard: 6, expert: 7, master: 9 },
        'spell-challenge':{ beginner: 10, easy: 12, medium: 15, hard: 18, expert: 22, master: 25 },
        'task-switch':   { beginner: 10, easy: 15, medium: 20, hard: 25, expert: 30, master: 40 },
        'emoji-recall':  { beginner: [3,2], easy: [4,3], medium: [4,4], hard: [5,4], expert: [5,5], master: [6,5] },
    },

    start(gameId, container, onComplete) {
        const method = this['_' + gameId.replace(/-/g, '_')];
        if (method) {
            method.call(this, container, onComplete);
        } else {
            container.innerHTML = '<p style="text-align:center;margin-top:40px;color:var(--text-muted)">Game coming soon!</p>';
            setTimeout(() => onComplete({ score: 0, accuracy: 0, correct: 0, wrong: 0, timeMs: 0 }), 1000);
        }
    },

    getDiff(gameId) {
        return HappyJula.adaptive.getDifficulty(gameId);
    },

    getDiffVal(gameId) {
        const diff = this.getDiff(gameId);
        const cfg = this.diffConfig[gameId];
        if (!cfg) return null;
        return cfg[diff] || cfg['beginner'];
    },

    // ================================================
    // GAME: Card Flip
    // ================================================
    _card_flip(container, onComplete) {
        const dv = this.getDiffVal('card-flip');
        const [cols, rows] = dv;
        const total = cols * rows;
        const pairs = total / 2;
        const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼','🐨','🐯','🦁','🐮','🐷','🐸','🐵','🐔','🐧','🐦','🦆','🦅'];
        const selected = emojis.slice(0, pairs);
        const cards = [...selected, ...selected].sort(() => Math.random() - 0.5);

        let flipped = [], matched = 0, moves = 0, startTime = Date.now(), locked = false;

        container.innerHTML = `
            <div class="game-content">
                <p class="game-instructions">Find all matching pairs!</p>
                <div class="card-grid" style="grid-template-columns: repeat(${cols}, 1fr); max-width: ${cols * 70}px"></div>
            </div>`;

        const grid = container.querySelector('.card-grid');
        cards.forEach((emoji, i) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.style.animationDelay = `${i * 0.03}s`;
            card.innerHTML = `<div class="memory-card-inner"><div class="memory-card-front">❓</div><div class="memory-card-back">${emoji}</div></div>`;
            card.addEventListener('click', () => {
                if (locked || card.classList.contains('flipped') || card.classList.contains('matched')) return;
                HappyJula.sound.play('click');
                card.classList.add('flipped');
                flipped.push({ card, emoji });
                if (flipped.length === 2) {
                    moves++;
                    locked = true;
                    if (flipped[0].emoji === flipped[1].emoji) {
                        matched += 2;
                        flipped.forEach(f => f.card.classList.add('matched'));
                        HappyJula.sound.play('success');
                        flipped = [];
                        locked = false;
                        if (matched === total) {
                            const timeMs = Date.now() - startTime;
                            const accuracy = Math.max(0, Math.round((pairs / Math.max(moves, pairs)) * 100));
                            onComplete({ score: Math.round(accuracy * 2 + (pairs * 10)), accuracy, correct: pairs, wrong: Math.max(0, moves - pairs), timeMs });
                        }
                    } else {
                        HappyJula.sound.play('fail');
                        setTimeout(() => {
                            flipped.forEach(f => f.card.classList.remove('flipped'));
                            flipped = [];
                            locked = false;
                        }, 800);
                    }
                }
            });
            grid.appendChild(card);
        });
    },

    // ================================================
    // GAME: Number Recall
    // ================================================
    _number_recall(container, onComplete) {
        const len = this.getDiffVal('number-recall');
        const digits = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
        let phase = 'show', startTime;

        function render() {
            if (phase === 'show') {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Memorize these numbers!</p>
                        <div class="sequence-display">${digits.map(d => `<div class="seq-item highlight" style="font-family:var(--font-mono);font-size:2rem">${d}</div>`).join('')}</div>
                        <p style="color:var(--text-muted);font-size:0.85rem">Remembering in <span id="recall-timer">3</span>s...</p>
                    </div>`;
                let countdown = 3;
                const interval = setInterval(() => {
                    countdown--;
                    const el = container.querySelector('#recall-timer');
                    if (el) el.textContent = countdown;
                    if (countdown <= 0) {
                        clearInterval(interval);
                        phase = 'recall';
                        render();
                    }
                }, 1000);
            } else {
                startTime = Date.now();
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Type the numbers you saw!</p>
                        <div class="recall-input">${digits.map((_, i) => `<input class="recall-digit" type="text" maxlength="1" data-idx="${i}" inputmode="numeric">`).join('')}</div>
                        <button class="btn btn-primary" id="recall-submit">Submit</button>
                    </div>`;
                const inputs = container.querySelectorAll('.recall-digit');
                inputs[0].focus();
                inputs.forEach((inp, i) => {
                    inp.addEventListener('input', () => {
                        if (inp.value && i < inputs.length - 1) inputs[i + 1].focus();
                    });
                    inp.addEventListener('keydown', e => {
                        if (e.key === 'Backspace' && !inp.value && i > 0) inputs[i - 1].focus();
                    });
                });
                container.querySelector('#recall-submit').addEventListener('click', () => {
                    const answer = Array.from(inputs).map(inp => inp.value);
                    let correct = 0;
                    answer.forEach((a, i) => {
                        if (parseInt(a) === digits[i]) {
                            inputs[i].style.borderColor = 'var(--success)';
                            correct++;
                        } else {
                            inputs[i].style.borderColor = 'var(--danger)';
                        }
                    });
                    const timeMs = Date.now() - startTime;
                    const accuracy = Math.round((correct / len) * 100);
                    HappyJula.sound.play(accuracy >= 80 ? 'success' : 'fail');
                    setTimeout(() => onComplete({ score: correct * 20 + (accuracy === 100 ? 50 : 0), accuracy, correct, wrong: len - correct, timeMs }), 1200);
                });
            }
        }
        render();
    },

    // ================================================
    // GAME: Color Recall
    // ================================================
    _color_recall(container, onComplete) {
        const len = this.getDiffVal('color-recall');
        const colors = ['#ef4444','#3b82f6','#22c55e','#eab308','#a855f7','#ec4899'];
        const colorNames = ['Red','Blue','Green','Yellow','Purple','Pink'];
        const sequence = Array.from({ length: len }, () => Math.floor(Math.random() * colors.length));
        let phase = 'show';

        function render() {
            if (phase === 'show') {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Watch the color sequence!</p>
                        <div class="sequence-display" id="color-seq"></div>
                    </div>`;
                const seqEl = container.querySelector('#color-seq');
                let i = 0;
                const showNext = () => {
                    if (i >= sequence.length) {
                        phase = 'input';
                        setTimeout(render, 600);
                        return;
                    }
                    seqEl.innerHTML = `<div class="seq-item highlight" style="background:${colors[sequence[i]]};border-color:${colors[sequence[i]]};width:80px;height:80px;border-radius:50%"></div>`;
                    HappyJula.sound.play('click');
                    i++;
                    setTimeout(showNext, 700);
                };
                setTimeout(showNext, 500);
            } else {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Repeat the sequence by tapping the colors!</p>
                        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;max-width:250px;margin:20px auto">
                            ${colors.map((c, i) => `<div class="seq-item" data-ci="${i}" style="background:${c};border-color:${c};width:70px;height:70px;border-radius:50%;cursor:pointer"></div>`).join('')}
                        </div>
                        <p style="color:var(--text-muted);font-size:0.85rem" id="color-progress">0 / ${len}</p>
                    </div>`;
                let idx = 0, startTime = Date.now();
                container.querySelectorAll('.seq-item[data-ci]').forEach(el => {
                    el.addEventListener('click', () => {
                        const ci = parseInt(el.dataset.ci);
                        if (ci === sequence[idx]) {
                            el.style.transform = 'scale(1.2)';
                            setTimeout(() => el.style.transform = '', 200);
                            HappyJula.sound.play('click');
                            idx++;
                            const prog = container.querySelector('#color-progress');
                            if (prog) prog.textContent = `${idx} / ${len}`;
                            if (idx >= len) {
                                const timeMs = Date.now() - startTime;
                                HappyJula.sound.play('success');
                                onComplete({ score: 100 + len * 20, accuracy: 100, correct: len, wrong: 0, timeMs });
                            }
                        } else {
                            HappyJula.sound.play('fail');
                            el.style.opacity = '0.3';
                            const timeMs = Date.now() - startTime;
                            const accuracy = Math.round((idx / len) * 100);
                            setTimeout(() => onComplete({ score: idx * 20, accuracy, correct: idx, wrong: 1, timeMs }), 500);
                        }
                    });
                });
            }
        }
        render();
    },

    // ================================================
    // GAME: Grid Recall
    // ================================================
    _grid_recall(container, onComplete) {
        const dv = this.getDiffVal('grid-recall');
        const [cols, rows] = dv;
        const total = cols * rows;
        const count = Math.max(3, Math.floor(total * 0.3));
        const indices = new Set();
        while (indices.size < count) indices.add(Math.floor(Math.random() * total));
        let phase = 'show';

        function render() {
            if (phase === 'show') {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Remember the highlighted cells!</p>
                        <div class="grid-recall" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 50}px"></div>
                    </div>`;
                const grid = container.querySelector('.grid-recall');
                for (let i = 0; i < total; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    if (indices.has(i)) cell.classList.add('highlight');
                    grid.appendChild(cell);
                }
                setTimeout(() => {
                    phase = 'recall';
                    render();
                }, 2000 + count * 200);
            } else {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Select the cells that were highlighted!</p>
                        <div class="grid-recall" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 50}px"></div>
                        <button class="btn btn-primary" style="margin-top:16px" id="grid-submit">Submit</button>
                    </div>`;
                const grid = container.querySelector('.grid-recall');
                const selected = new Set();
                for (let i = 0; i < total; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.addEventListener('click', () => {
                        HappyJula.sound.play('click');
                        if (selected.has(i)) { selected.delete(i); cell.classList.remove('selected'); }
                        else { selected.add(i); cell.classList.add('selected'); }
                    });
                    grid.appendChild(cell);
                }
                container.querySelector('#grid-submit').addEventListener('click', () => {
                    const cells = grid.children;
                    let correct = 0;
                    for (let i = 0; i < total; i++) {
                        if (indices.has(i) && selected.has(i)) { cells[i].classList.add('correct'); correct++; }
                        else if (indices.has(i)) { cells[i].classList.add('missed'); }
                        else if (selected.has(i)) { cells[i].style.opacity = '0.3'; }
                    }
                    const accuracy = Math.round((correct / count) * 100);
                    const wrong = selected.size - correct;
                    HappyJula.sound.play(accuracy >= 70 ? 'success' : 'fail');
                    setTimeout(() => onComplete({ score: correct * 25 - wrong * 5, accuracy, correct, wrong: Math.max(0, wrong), timeMs: 3000 }), 1200);
                });
            }
        }
        render();
    },

    // ================================================
    // GAME: Emoji Recall
    // ================================================
    _emoji_recall(container, onComplete) {
        const dv = this.getDiffVal('grid-recall');
        const [cols, rows] = dv;
        const total = cols * rows;
        const emojis = ['😀','😎','🥳','😡','😱','🤢','😈','🤡','👻','💀','🤖','👽'];
        const count = Math.min(emojis.length, Math.max(3, Math.floor(total * 0.3)));
        const chosen = emojis.slice(0, count).sort(() => Math.random() - 0.5);
        const positions = new Set();
        while (positions.size < count) positions.add(Math.floor(Math.random() * total));
        const posArr = [...positions];
        const mapping = {};
        posArr.forEach((p, i) => mapping[p] = chosen[i]);
        let phase = 'show';

        function render() {
            if (phase === 'show') {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Remember where each emoji is!</p>
                        <div class="grid-recall" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 60}px"></div>
                    </div>`;
                const grid = container.querySelector('.grid-recall');
                for (let i = 0; i < total; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.style.display = 'flex';
                    cell.style.alignItems = 'center';
                    cell.style.justifyContent = 'center';
                    cell.style.fontSize = '1.5rem';
                    cell.textContent = mapping[i] || '';
                    grid.appendChild(cell);
                }
                setTimeout(() => { phase = 'recall'; render(); }, 3000 + count * 300);
            } else {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Place each emoji in its original position!</p>
                        <div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin:12px 0" id="emoji-queue"></div>
                        <div class="grid-recall" style="grid-template-columns:repeat(${cols},1fr);max-width:${cols * 60}px"></div>
                    </div>`;
                let currentEmoji = 0;
                const queue = container.querySelector('#emoji-queue');
                const shuffled = [...chosen].sort(() => Math.random() - 0.5);
                const answerMap = {};
                shuffled.forEach(e => {
                    const s = document.createElement('span');
                    s.style.fontSize = '1.5rem';
                    s.style.padding = '4px';
                    s.textContent = e;
                    queue.appendChild(s);
                });
                let startTime = Date.now();
                const grid = container.querySelector('.grid-recall');
                for (let i = 0; i < total; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'grid-cell';
                    cell.style.display = 'flex';
                    cell.style.alignItems = 'center';
                    cell.style.justifyContent = 'center';
                    cell.style.fontSize = '1.3rem';
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => {
                        if (currentEmoji >= shuffled.length) return;
                        cell.textContent = shuffled[currentEmoji];
                        answerMap[i] = shuffled[currentEmoji];
                        currentEmoji++;
                        HappyJula.sound.play('click');
                        if (currentEmoji >= shuffled.length) {
                            let correct = 0;
                            for (const [pos, emoji] of Object.entries(mapping)) {
                                if (answerMap[pos] === emoji) correct++;
                            }
                            const timeMs = Date.now() - startTime;
                            const accuracy = Math.round((correct / count) * 100);
                            HappyJula.sound.play(accuracy >= 70 ? 'success' : 'fail');
                            setTimeout(() => onComplete({ score: correct * 30, accuracy, correct, wrong: count - correct, timeMs }), 800);
                        }
                    });
                    grid.appendChild(cell);
                }
            }
        }
        render();
    },

    // ================================================
    // GAME: Odd One Out
    // ================================================
    _odd_one_out(container, onComplete) {
        const dv = this.getDiffVal('odd-one-out');
        const [total, rounds] = dv;
        let round = 0, correctTotal = 0, wrongTotal = 0, startTime = Date.now();

        function playRound() {
            if (round >= rounds) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correctTotal / rounds) * 100);
                onComplete({ score: correctTotal * 30, accuracy, correct: correctTotal, wrong: wrongTotal, timeMs });
                return;
            }
            round++;
            const base = ['🔴','🔵','🟢','🟡','🟣'][Math.floor(Math.random() * 5)];
            const odd = ['🔴','🔵','🟢','🟡','🟣'].filter(c => c !== base)[Math.floor(Math.random() * 4)];
            const oddIdx = Math.floor(Math.random() * total);
            const gridCols = Math.ceil(Math.sqrt(total));

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Find the odd one out! (Round ${round}/${rounds})</p>
                    <div class="oog-grid" style="grid-template-columns:repeat(${gridCols},1fr);max-width:${gridCols * 70}px"></div>
                </div>`;

            const grid = container.querySelector('.oog-grid');
            for (let i = 0; i < total; i++) {
                const item = document.createElement('div');
                item.className = 'oog-item';
                item.textContent = i === oddIdx ? odd : base;
                item.addEventListener('click', () => {
                    if (item.dataset.done) return;
                    item.dataset.done = '1';
                    if (i === oddIdx) {
                        item.classList.add('correct');
                        correctTotal++;
                        HappyJula.sound.play('success');
                    } else {
                        item.classList.add('wrong');
                        grid.children[oddIdx].classList.add('correct');
                        wrongTotal++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playRound, 600);
                });
                grid.appendChild(item);
            }
        }
        playRound();
    },

    // ================================================
    // GAME: Moving Target
    // ================================================
    _moving_target(container, onComplete) {
        const dv = this.getDiffVal('moving-target');
        const [total, rounds] = dv;
        let score = 0, round = 0, correct = 0, wrong = 0, startTime = Date.now();

        function playRound() {
            if (round >= rounds) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / rounds) * 100);
                onComplete({ score, accuracy, correct, wrong, timeMs });
                return;
            }
            round++;
            const targetEmoji = ['🎯','⭐','💎'][Math.floor(Math.random() * 3)];
            const decoyEmoji = ['🔴','🔵','🟢'][Math.floor(Math.random() * 3)];

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Tap the ${targetEmoji}! Avoid the decoys. (Round ${round}/${rounds})</p>
                    <div class="moving-area" id="moving-area"></div>
                </div>`;

            const area = container.querySelector('#moving-area');
            const items = [];
            for (let i = 0; i < total; i++) {
                const dot = document.createElement('div');
                dot.className = 'moving-dot';
                dot.textContent = i === 0 ? targetEmoji : decoyEmoji;
                dot.dataset.target = i === 0 ? '1' : '0';
                dot.style.left = Math.random() * 80 + '%';
                dot.style.top = Math.random() * 80 + '%';
                area.appendChild(dot);
                items.push({
                    el: dot,
                    x: parseFloat(dot.style.left),
                    y: parseFloat(dot.style.top),
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5
                });

                dot.addEventListener('click', () => {
                    if (dot.dataset.done) return;
                    dot.dataset.done = '1';
                    if (dot.dataset.target === '1') {
                        dot.classList.add('correct');
                        score += 50;
                        correct++;
                        HappyJula.sound.play('success');
                    } else {
                        dot.classList.add('wrong');
                        wrong++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playRound, 400);
                });
            }

            let animId;
            function animate() {
                for (const item of items) {
                    item.x += item.vx;
                    item.y += item.vy;
                    if (item.x < 0 || item.x > 85) item.vx *= -1;
                    if (item.y < 0 || item.y > 85) item.vy *= -1;
                    item.x = Math.max(0, Math.min(85, item.x));
                    item.y = Math.max(0, Math.min(85, item.y));
                    item.el.style.left = item.x + '%';
                    item.el.style.top = item.y + '%';
                }
                animId = requestAnimationFrame(animate);
            }
            animate();
        }
        playRound();
    },

    // ================================================
    // GAME: Spot Symbol
    // ================================================
    _spot_symbol(container, onComplete) {
        const dv = this.getDiffVal('spot-symbol');
        const [gridSize, targets] = dv;
        const total = gridSize * gridSize;
        const symbols = ['♠','♥','♦','♣','★','♪','✿','◆'];
        const targetSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        let decoys = symbols.filter(s => s !== targetSymbol);
        const targetIndices = new Set();
        while (targetIndices.size < targets) targetIndices.add(Math.floor(Math.random() * total));
        let found = 0, wrong = 0, startTime = Date.now();

        container.innerHTML = `
            <div class="game-content">
                <p class="game-instructions">Find all <strong style="font-size:1.5rem">${targetSymbol}</strong> (${targets} hidden)</p>
                <div class="oog-grid" style="grid-template-columns:repeat(${gridSize},1fr);max-width:${gridSize * 55}px"></div>
            </div>`;

        const grid = container.querySelector('.oog-grid');
        for (let i = 0; i < total; i++) {
            const item = document.createElement('div');
            item.className = 'oog-item';
            item.style.fontSize = '1.5rem';
            item.textContent = targetIndices.has(i) ? targetSymbol : decoys[Math.floor(Math.random() * decoys.length)];
            item.addEventListener('click', () => {
                if (item.dataset.done) return;
                item.dataset.done = '1';
                if (targetIndices.has(i)) {
                    item.classList.add('correct');
                    found++;
                    HappyJula.sound.play('click');
                    if (found >= targets) {
                        const timeMs = Date.now() - startTime;
                        const accuracy = 100;
                        HappyJula.sound.play('success');
                        setTimeout(() => onComplete({ score: 100 + Math.max(0, 500 - Math.floor(timeMs / 100)), accuracy, correct: found, wrong, timeMs }), 500);
                    }
                } else {
                    item.classList.add('wrong');
                    wrong++;
                    HappyJula.sound.play('fail');
                }
            });
            grid.appendChild(item);
        }
    },

    // ================================================
    // GAME: Reaction Test
    // ================================================
    _reaction_test(container, onComplete) {
        let state = 'waiting', startTime, attempts = [], maxAttempts = 5;

        function render() {
            if (attempts.length >= maxAttempts) {
                const avg = Math.round(attempts.reduce((a, b) => a + b) / attempts.length);
                const best = Math.min(...attempts);
                const accuracy = Math.round(attempts.filter(a => a < 500).length / attempts.length * 100);
                onComplete({ score: Math.max(0, 1000 - avg * 2), accuracy, correct: attempts.filter(a => a < 500).length, wrong: attempts.filter(a => a >= 500).length, timeMs: attempts.reduce((a, b) => a + b) });
                return;
            }

            state = 'waiting';
            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Tap when the screen turns GREEN! (${attempts.length + 1}/${maxAttempts})</p>
                    <div class="reaction-zone reaction-waiting" id="reaction-zone">
                        <span>Wait for green...</span>
                    </div>
                    ${attempts.length > 0 ? `<p style="color:var(--text-muted);margin-top:12px">Last: ${attempts[attempts.length - 1]}ms | Best: ${Math.min(...attempts)}ms</p>` : ''}
                </div>`;

            const zone = container.querySelector('#reaction-zone');
            const delay = 1000 + Math.random() * 3000;

            const timeout = setTimeout(() => {
                state = 'ready';
                startTime = Date.now();
                zone.className = 'reaction-zone reaction-ready';
                zone.innerHTML = '<span>TAP NOW!</span>';
            }, delay);

            zone.addEventListener('click', () => {
                if (state === 'waiting') {
                    clearTimeout(timeout);
                    state = 'too-soon';
                    zone.className = 'reaction-zone reaction-too-soon';
                    zone.innerHTML = '<span>Too early! Tap to retry.</span>';
                    attempts.push(999);
                    HappyJula.sound.play('fail');
                    zone.addEventListener('click', () => render(), { once: true });
                } else if (state === 'ready') {
                    const reactionTime = Date.now() - startTime;
                    attempts.push(reactionTime);
                    state = 'result';
                    zone.className = 'reaction-zone reaction-result';
                    zone.innerHTML = `<span>${reactionTime}ms!</span>`;
                    HappyJula.sound.play(reactionTime < 300 ? 'success' : 'click');
                    setTimeout(render, 1200);
                }
            }, { once: true });
        }
        render();
    },

    // ================================================
    // GAME: Lightning Math
    // ================================================
    _lightning_math(container, onComplete) {
        const dv = this.getDiffVal('lightning-math');
        const [total, level] = dv;
        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        function genQuestion() {
            let a, b, op, answer;
            if (level === 1) {
                a = Math.floor(Math.random() * 10) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                op = ['+', '-'][Math.floor(Math.random() * 2)];
                if (op === '-' && a < b) [a, b] = [b, a];
                answer = op === '+' ? a + b : a - b;
            } else if (level === 2) {
                a = Math.floor(Math.random() * 20) + 2;
                b = Math.floor(Math.random() * 12) + 2;
                op = ['+', '-', '×'][Math.floor(Math.random() * 3)];
                if (op === '-' && a < b) [a, b] = [b, a];
                if (op === '×') { a = Math.floor(Math.random() * 12) + 1; b = Math.floor(Math.random() * 12) + 1; }
                answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
            } else {
                a = Math.floor(Math.random() * 50) + 10;
                b = Math.floor(Math.random() * 30) + 2;
                op = ['+', '-', '×', '+'][Math.floor(Math.random() * 4)];
                if (op === '×') { a = Math.floor(Math.random() * 15) + 2; b = Math.floor(Math.random() * 15) + 2; }
                answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
            }
            return { text: `${a} ${op} ${b}`, answer };
        }

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 15, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const { text, answer } = genQuestion();
            const options = [answer];
            while (options.length < 4) {
                const fake = answer + Math.floor(Math.random() * 20) - 10;
                if (!options.includes(fake) && fake !== answer) options.push(fake);
            }
            options.sort(() => Math.random() - 0.5);

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Solve fast! (${q}/${total})</p>
                    <div class="math-question">${text}</div>
                    <div class="math-options">${options.map(o => `<button class="math-option" data-val="${o}">${o}</button>`).join('')}</div>
                </div>`;

            container.querySelectorAll('.math-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    if (btn.dataset.done) return;
                    container.querySelectorAll('.math-option').forEach(b => b.dataset.done = '1');
                    const val = parseInt(btn.dataset.val);
                    if (val === answer) {
                        btn.classList.add('correct');
                        correct++;
                        HappyJula.sound.play('success');
                    } else {
                        btn.classList.add('wrong');
                        container.querySelector(`[data-val="${answer}"]`).classList.add('correct');
                        wrong++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playQuestion, 500);
                });
            });
        }
        playQuestion();
    },

    // ================================================
    // GAME: Quick Compare
    // ================================================
    _quick_compare(container, onComplete) {
        const total = this.getDiffVal('quick-compare');
        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 10, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const a = Math.floor(Math.random() * 15) + 3;
            let b = Math.floor(Math.random() * 15) + 3;
            while (b === a) b = Math.floor(Math.random() * 15) + 3;
            const bigger = a > b ? 'left' : 'right';

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Which side has MORE dots? (${q}/${total})</p>
                    <div style="display:flex;gap:40px;justify-content:center;align-items:center;margin:30px 0">
                        <div class="oog-item" data-side="left" style="width:120px;height:120px;border-radius:50%;font-size:0.8rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:12px">${'● '.repeat(a).split(' ').filter(Boolean).map(() => '<span style="color:var(--accent)">●</span>').join('')}</div>
                        <span style="font-size:1.5rem;color:var(--text-muted)">vs</span>
                        <div class="oog-item" data-side="right" style="width:120px;height:120px;border-radius:50%;font-size:0.8rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2px;padding:12px">${'● '.repeat(b).split(' ').filter(Boolean).map(() => '<span style="color:var(--accent2)">●</span>').join('')}</div>
                    </div>
                    <div style="display:flex;gap:16px;justify-content:center">
                        <button class="task-btn" data-choice="left">← Left (${a})</button>
                        <button class="task-btn" data-choice="right">Right (${b}) →</button>
                    </div>
                </div>`;

            container.querySelectorAll('.task-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.task-btn').forEach(b => b.style.pointerEvents = 'none');
                    if (btn.dataset.choice === bigger) {
                        correct++;
                        btn.style.background = 'rgba(52,211,153,0.2)';
                        btn.style.borderColor = 'var(--success)';
                        HappyJula.sound.play('click');
                    } else {
                        wrong++;
                        btn.style.background = 'rgba(248,113,113,0.2)';
                        btn.style.borderColor = 'var(--danger)';
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playQuestion, 400);
                });
            });
        }
        playQuestion();
    },

    // ================================================
    // GAME: Pattern Builder
    // ================================================
    _pattern_builder(container, onComplete) {
        const dv = this.getDiffVal('pattern-builder');
        const [total, level] = dv;
        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        const patterns = [
            { gen: () => { const s = Math.floor(Math.random()*5)+1; const seq = Array.from({length:6},(_,i)=>s+i); return { seq: seq.slice(0,-1), answer: seq[5], display: seq.slice(0,-1).join(', ') + ', ?' }; }},
            { gen: () => { const s = Math.floor(Math.random()*3)+2; const m = Math.floor(Math.random()*3)+2; const seq = Array.from({length:6},(_,i)=>s+m*i); return { seq: seq.slice(0,-1), answer: seq[5], display: seq.slice(0,-1).join(', ') + ', ?' }; }},
            { gen: () => { const base = [2,4,8,16,32,64]; const seq = base; return { seq: seq.slice(0,-1), answer: seq[5], display: seq.slice(0,-1).join(', ') + ', ?' }; }},
            { gen: () => { const s = Math.floor(Math.random()*5)+1; const seq = Array.from({length:6},(_,i)=>s+i*i); return { seq: seq.slice(0,-1), answer: seq[5], display: seq.slice(0,-1).join(', ') + ', ?' }; }},
            { gen: () => { const fib = [1,1]; while(fib.length<6) fib.push(fib[fib.length-1]+fib[fib.length-2]); return { seq: fib.slice(0,-1), answer: fib[5], display: fib.slice(0,-1).join(', ') + ', ?' }; }},
        ];

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 25, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const pattern = patterns[Math.floor(Math.random() * patterns.length)].gen();
            const options = [pattern.answer];
            while (options.length < 4) {
                const fake = pattern.answer + Math.floor(Math.random() * 20) - 10;
                if (!options.includes(fake) && fake > 0) options.push(fake);
            }
            options.sort(() => Math.random() - 0.5);

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">What comes next? (${q}/${total})</p>
                    <div class="math-question" style="font-size:1.8rem">${pattern.display}</div>
                    <div class="math-options">${options.map(o => `<button class="math-option" data-val="${o}">${o}</button>`).join('')}</div>
                </div>`;

            container.querySelectorAll('.math-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.math-option').forEach(b => b.dataset.done = '1');
                    const val = parseInt(btn.dataset.val);
                    if (val === pattern.answer) {
                        btn.classList.add('correct');
                        correct++;
                        HappyJula.sound.play('success');
                    } else {
                        btn.classList.add('wrong');
                        container.querySelector(`[data-val="${pattern.answer}"]`).classList.add('correct');
                        wrong++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playQuestion, 600);
                });
            });
        }
        playQuestion();
    },

    // ================================================
    // GAME: Sequence Master (Simon-like)
    // ================================================
    _sequence_master(container, onComplete) {
        const maxLen = this.getDiffVal('sequence-master');
        const colors = ['#ef4444','#3b82f6','#22c55e','#eab308'];
        const labels = ['Red','Blue','Green','Yellow'];
        let sequence = [], playerIdx = 0, round = 0, startTime = Date.now();

        function nextRound() {
            sequence.push(Math.floor(Math.random() * 4));
            round++;
            playerIdx = 0;
            showSequence();
        }

        function showSequence() {
            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Watch the sequence! (Round ${round})</p>
                    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;max-width:220px;margin:20px auto">
                        ${colors.map((c, i) => `<div class="seq-item" data-ci="${i}" style="background:${c};border-color:${c};width:100px;height:100px;border-radius:var(--radius-sm);cursor:pointer;opacity:0.5;transition:all 0.2s">${labels[i]}</div>`).join('')}
                    </div>
                    <p style="color:var(--text-muted)" id="seq-status">Watch carefully...</p>
                </div>`;

            const items = container.querySelectorAll('.seq-item');
            let i = 0;
            const highlight = () => {
                if (i >= sequence.length) {
                    setTimeout(() => {
                        enableInput();
                    }, 300);
                    return;
                }
                items[sequence[i]].style.opacity = '1';
                items[sequence[i]].style.transform = 'scale(1.1)';
                HappyJula.sound.play('click');
                setTimeout(() => {
                    items[sequence[i]].style.opacity = '0.5';
                    items[sequence[i]].style.transform = '';
                    i++;
                    setTimeout(highlight, 200);
                }, 500);
            };
            setTimeout(highlight, 600);
        }

        function enableInput() {
            const status = container.querySelector('#seq-status');
            if (status) status.textContent = 'Your turn! Repeat the sequence.';
            container.querySelectorAll('.seq-item').forEach(el => {
                el.style.opacity = '1';
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => {
                    const ci = parseInt(el.dataset.ci);
                    el.style.transform = 'scale(1.1)';
                    setTimeout(() => el.style.transform = '', 200);
                    HappyJula.sound.play('click');
                    if (ci === sequence[playerIdx]) {
                        playerIdx++;
                        if (playerIdx >= sequence.length) {
                            if (sequence.length >= maxLen) {
                                const timeMs = Date.now() - startTime;
                                HappyJula.sound.play('success');
                                setTimeout(() => onComplete({ score: round * 30, accuracy: 100, correct: round, wrong: 0, timeMs }), 500);
                            } else {
                                HappyJula.sound.play('success');
                                setTimeout(nextRound, 500);
                            }
                        }
                    } else {
                        HappyJula.sound.play('fail');
                        const timeMs = Date.now() - startTime;
                        const accuracy = Math.round(((round - 1) / maxLen) * 100);
                        if (status) status.textContent = `Wrong! You reached round ${round}`;
                        setTimeout(() => onComplete({ score: (round - 1) * 30, accuracy, correct: round - 1, wrong: 1, timeMs }), 800);
                    }
                });
            });
        }

        nextRound();
    },

    // ================================================
    // GAME: Mental Arithmetic
    // ================================================
    _mental_arithmetic(container, onComplete) {
        this._lightning_math(container, onComplete);
    },

    // ================================================
    // GAME: Number Balance
    // ================================================
    _number_balance(container, onComplete) {
        const total = this.getDiffVal('number-balance');
        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 12, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const a = Math.floor(Math.random() * 20) + 1;
            const b = Math.floor(Math.random() * 20) + 1;
            const answer = a + b;
            const options = [answer];
            while (options.length < 4) {
                const fake = answer + Math.floor(Math.random() * 10) - 5;
                if (!options.includes(fake) && fake > 0) options.push(fake);
            }
            options.sort(() => Math.random() - 0.5);

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Find the missing number! (${q}/${total})</p>
                    <div class="math-question">${a} + ? = ${answer}</div>
                    <div class="math-options">${options.map(o => `<button class="math-option" data-val="${o}">${o}</button>`).join('')}</div>
                </div>`;

            container.querySelectorAll('.math-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.math-option').forEach(b => b.dataset.done = '1');
                    const val = parseInt(btn.dataset.val);
                    if (val === b) {
                        btn.classList.add('correct');
                        correct++;
                        HappyJula.sound.play('success');
                    } else {
                        btn.classList.add('wrong');
                        container.querySelector(`[data-val="${b}"]`).classList.add('correct');
                        wrong++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playQuestion, 500);
                });
            });
        }
        playQuestion();
    },

    // ================================================
    // GAME: Word Recall
    // ================================================
    _word_recall(container, onComplete) {
        const len = this.getDiffVal('word-recall');
        const wordPool = ['apple','house','river','cloud','music','dance','light','storm','flame','ocean','dream','peace','brave','ghost','charm','blaze','frost','lunar','solar','crisp'];
        const words = [...wordPool].sort(() => Math.random() - 0.5).slice(0, len);
        let phase = 'show';

        function render() {
            if (phase === 'show') {
                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Memorize these words!</p>
                        <div class="sequence-display">${words.map(w => `<div class="seq-item" style="width:auto;padding:0 16px;font-size:1rem;font-family:var(--font-display)">${w}</div>`).join('')}</div>
                        <p style="color:var(--text-muted)" id="word-timer">3s...</p>
                    </div>`;
                let countdown = 3;
                const iv = setInterval(() => {
                    countdown--;
                    const el = container.querySelector('#word-timer');
                    if (el) el.textContent = countdown + 's...';
                    if (countdown <= 0) { clearInterval(iv); phase = 'recall'; render(); }
                }, 1000);
            } else {
                const shuffled = [...words].sort(() => Math.random() - 0.5);
                const extras = wordPool.filter(w => !words.includes(w)).sort(() => Math.random() - 0.5).slice(0, 3);
                const allOptions = [...shuffled, ...extras].sort(() => Math.random() - 0.5);
                const selected = new Set();

                container.innerHTML = `
                    <div class="game-content">
                        <p class="game-instructions">Select the words you saw! (${len} words)</p>
                        <div class="word-options">${allOptions.map(w => `<button class="word-option" data-word="${w}">${w}</button>`).join('')}</div>
                        <button class="btn btn-primary" style="margin-top:16px" id="word-submit">Submit</button>
                    </div>`;

                container.querySelectorAll('.word-option').forEach(btn => {
                    btn.addEventListener('click', () => {
                        HappyJula.sound.play('click');
                        if (selected.has(btn.dataset.word)) {
                            selected.delete(btn.dataset.word);
                            btn.style.borderColor = 'var(--glass-border)';
                        } else {
                            selected.add(btn.dataset.word);
                            btn.style.borderColor = 'var(--accent)';
                        }
                    });
                });

                container.querySelector('#word-submit').addEventListener('click', () => {
                    let c = 0;
                    for (const w of words) { if (selected.has(w)) c++; }
                    const wrong = selected.size - c;
                    const accuracy = Math.round((c / len) * 100);
                    HappyJula.sound.play(accuracy >= 70 ? 'success' : 'fail');
                    setTimeout(() => onComplete({ score: c * 25, accuracy, correct: c, wrong: Math.max(0, wrong), timeMs: 5000 }), 500);
                });
            }
        }
        render();
    },

    // ================================================
    // GAME: Spell Challenge
    // ================================================
    _spell_challenge(container, onComplete) {
        const total = this.getDiffVal('spell-challenge');
        const words = [
            { correct: 'necessary', wrong: 'neccessary' },
            { correct: 'separate', wrong: 'seperate' },
            { correct: 'occurrence', wrong: 'occurence' },
            { correct: 'definitely', wrong: 'definately' },
            { correct: 'accommodate', wrong: 'accomodate' },
            { correct: 'independent', wrong: 'independant' },
            { correct: 'restaurant', wrong: 'restaraunt' },
            { correct: 'beautiful', wrong: 'beutiful' },
            { correct: 'conscience', wrong: 'concience' },
            { correct: 'weird', wrong: 'wierd' },
            { correct: 'believe', wrong: 'beleive' },
            { correct: 'receive', wrong: 'recieve' },
            { correct: 'achieve', wrong: 'acheive' },
            { correct: 'embarrass', wrong: 'embarass' },
            { correct: 'rhythm', wrong: 'rythm' },
            { correct: 'privilege', wrong: 'privelege' },
            { correct: 'maintenance', wrong: 'maintainance' },
            { correct: 'existence', wrong: 'existance' },
            { correct: 'exaggerate', wrong: 'exagerate' },
            { correct: 'millennium', wrong: 'millenium' },
        ];

        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 15, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const word = words[Math.floor(Math.random() * words.length)];
            const showCorrect = Math.random() > 0.5;
            const display = showCorrect ? word.correct : word.wrong;

            container.innerHTML = `
                <div class="game-content">
                    <p class="game-instructions">Is this word spelled correctly? (${q}/${total})</p>
                    <div class="word-display">${display}</div>
                    <div style="display:flex;gap:16px;justify-content:center">
                        <button class="task-btn" data-answer="correct">✓ Correct</button>
                        <button class="task-btn" data-answer="wrong">✗ Wrong</button>
                    </div>
                </div>`;

            container.querySelectorAll('.task-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    container.querySelectorAll('.task-btn').forEach(b => b.style.pointerEvents = 'none');
                    const isCorrectSpelling = showCorrect;
                    const userSaidCorrect = btn.dataset.answer === 'correct';
                    if (userSaidCorrect === isCorrectSpelling) {
                        btn.style.background = 'rgba(52,211,153,0.2)';
                        btn.style.borderColor = 'var(--success)';
                        correct++;
                        HappyJula.sound.play('success');
                    } else {
                        btn.style.background = 'rgba(248,113,113,0.2)';
                        btn.style.borderColor = 'var(--danger)';
                        wrong++;
                        HappyJula.sound.play('fail');
                    }
                    setTimeout(playQuestion, 600);
                });
            });
        }
        playQuestion();
    },

    // ================================================
    // GAME: Task Switch
    // ================================================
    _task_switch(container, onComplete) {
        const total = this.getDiffVal('task-switch');
        let q = 0, correct = 0, wrong = 0, startTime = Date.now();

        const numbers = [1,2,3,4,5,6,7,8,9];
        const vowels = 'AEIOU';
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        function playQuestion() {
            if (q >= total) {
                const timeMs = Date.now() - startTime;
                const accuracy = Math.round((correct / total) * 100);
                onComplete({ score: correct * 12, accuracy, correct, wrong, timeMs });
                return;
            }
            q++;
            const isNumberTask = Math.random() > 0.5;

            if (isNumberTask) {
                const num = numbers[Math.floor(Math.random() * numbers.length)];
                const isOdd = num % 2 === 1;
                container.innerHTML = `
                    <div class="game-content">
                        <div class="task-rule">Rule: Is the number ODD or EVEN?</div>
                        <div class="task-stimulus">${num}</div>
                        <div class="task-buttons">
                            <button class="task-btn" data-answer="odd" style="background:rgba(167,139,250,0.1)">ODD</button>
                            <button class="task-btn" data-answer="even" style="background:rgba(34,211,238,0.1)">EVEN</button>
                        </div>
                    </div>`;
                container.querySelectorAll('.task-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        container.querySelectorAll('.task-btn').forEach(b => b.style.pointerEvents = 'none');
                        const correctAnswer = isOdd ? 'odd' : 'even';
                        if (btn.dataset.answer === correctAnswer) { correct++; btn.style.borderColor = 'var(--success)'; HappyJula.sound.play('click'); }
                        else { wrong++; btn.style.borderColor = 'var(--danger)'; HappyJula.sound.play('fail'); }
                        setTimeout(playQuestion, 400);
                    });
                });
            } else {
                const letter = letters[Math.floor(Math.random() * 26)];
                const isVowel = vowels.includes(letter);
                container.innerHTML = `
                    <div class="game-content">
                        <div class="task-rule">Rule: Is the letter a VOWEL or CONSONANT?</div>
                        <div class="task-stimulus">${letter}</div>
                        <div class="task-buttons">
                            <button class="task-btn" data-answer="vowel" style="background:rgba(244,114,182,0.1)">VOWEL</button>
                            <button class="task-btn" data-answer="consonant" style="background:rgba(251,191,36,0.1)">CONSONANT</button>
                        </div>
                    </div>`;
                container.querySelectorAll('.task-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        container.querySelectorAll('.task-btn').forEach(b => b.style.pointerEvents = 'none');
                        const correctAnswer = isVowel ? 'vowel' : 'consonant';
                        if (btn.dataset.answer === correctAnswer) { correct++; btn.style.borderColor = 'var(--success)'; HappyJula.sound.play('click'); }
                        else { wrong++; btn.style.borderColor = 'var(--danger)'; HappyJula.sound.play('fail'); }
                        setTimeout(playQuestion, 400);
                    });
                });
            }
        }
        playQuestion();
    }
};
