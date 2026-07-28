/* ═══════════════════════════════════════════════
   NEUROVERSE GAME ENGINE v1.0
   Prime Spirit Mentors — PrimeLab
   ═══════════════════════════════════════════════ */

'use strict';

// ─── ROUNDRECT POLYFILL ───
if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

// ─── BACKGROUND PARTICLE ENGINE ───
const bgCanvas = document.getElementById('bgCanvas');
const bgCtx = bgCanvas.getContext('2d');
let particles = [];
let neurons = [];

function initBG() {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  particles = Array.from({ length: 60 }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    r: Math.random() * 2 + 0.5,
    alpha: Math.random() * 0.4 + 0.1,
    color: Math.random() > 0.5 ? '0,229,255' : '180,79,255'
  }));
  neurons = Array.from({ length: 8 }, () => ({
    x: Math.random() * bgCanvas.width,
    y: Math.random() * bgCanvas.height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 4 + 3
  }));
}

function drawBG() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  // Connections between neurons
  neurons.forEach((n, i) => {
    neurons.forEach((m, j) => {
      if (j <= i) return;
      const d = Math.hypot(n.x - m.x, n.y - m.y);
      if (d < 200) {
        bgCtx.beginPath();
        bgCtx.strokeStyle = `rgba(0,229,255,${0.04 * (1 - d / 200)})`;
        bgCtx.lineWidth = 1;
        bgCtx.moveTo(n.x, n.y); bgCtx.lineTo(m.x, m.y);
        bgCtx.stroke();
      }
    });
  });
  // Neurons
  neurons.forEach(n => {
    n.x += n.vx; n.y += n.vy;
    if (n.x < 0 || n.x > bgCanvas.width) n.vx *= -1;
    if (n.y < 0 || n.y > bgCanvas.height) n.vy *= -1;
    bgCtx.beginPath();
    bgCtx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
    bgCtx.fillStyle = 'rgba(0,229,255,0.25)';
    bgCtx.fill();
    bgCtx.beginPath();
    bgCtx.arc(n.x, n.y, n.r * 2, 0, Math.PI * 2);
    bgCtx.fillStyle = 'rgba(0,229,255,0.06)';
    bgCtx.fill();
  });
  // Particles
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0 || p.x > bgCanvas.width) p.vx *= -1;
    if (p.y < 0 || p.y > bgCanvas.height) p.vy *= -1;
    bgCtx.beginPath();
    bgCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bgCtx.fillStyle = `rgba(${p.color},${p.alpha})`;
    bgCtx.fill();
  });
}

// ─── SAVE SYSTEM ───
const Save = {
  key: 'neuroverse_v1',
  data: null,
  load() {
    try {
      const raw = localStorage.getItem(this.key);
      this.data = raw ? JSON.parse(raw) : this.defaults();
    } catch { this.data = this.defaults(); }
    return this.data;
  },
  save() {
    try { localStorage.setItem(this.key, JSON.stringify(this.data)); } catch {}
  },
  defaults() {
    return {
      xp: 0, level: 1, streak: 0, lastPlay: null,
      levelData: {},
      analytics: { focus: 0, memory: 0, creativity: 0, reaction: 0, strategy: 0 },
      totalCrystals: 0
    };
  }
};

// ─── LEVEL DEFINITIONS ───
const LEVELS = [
  // PHYSICS LEVELS
  {
    id: 1, type: 'physics', name: 'First Light',
    desc: 'Guide the crystal to the Core.',
    difficulty: 'tutorial',
    config: {
      gridW: 10, gridH: 8,
      crystal: { x: 1, y: 4 },
      core: { x: 8, y: 4 },
      walls: [[3,2],[3,3],[3,5],[3,6],[6,1],[6,2],[6,5],[6,6]],
      portals: [],
      gravity: { x: 0, y: 0.3 }
    }
  },
  {
    id: 2, type: 'memory', name: 'Echo Pattern',
    desc: 'Watch the sequence. Then repeat it.',
    difficulty: 'easy',
    config: { gridSize: 3, sequenceLen: 3, showTime: 800, symbols: ['🔵','🔴','🟡','🟢','🟣'] }
  },
  {
    id: 3, type: 'rules', name: 'Law Breaker',
    desc: 'Rewrite the rules to help the crystal reach safety.',
    difficulty: 'easy',
    config: {
      initialRules: ['FIRE = HOT', 'WATER = WET', 'ROCK = SOLID'],
      availableRules: ['FIRE = COLD', 'WATER = SOLID', 'ROCK = FLOAT'],
      solution: ['FIRE = COLD', 'WATER = SOLID', 'ROCK = SOLID'],
      gridW: 8, gridH: 6,
    }
  },
  {
    id: 4, type: 'physics', name: 'Gravity Shift',
    desc: 'Reverse gravity to reach the upper core.',
    difficulty: 'easy',
    config: {
      gridW: 10, gridH: 8,
      crystal: { x: 5, y: 6 },
      core: { x: 5, y: 1 },
      walls: [[2,3],[3,3],[4,3],[6,3],[7,3],[8,3],[1,5],[9,5]],
      portals: [{ ax: 2, ay: 7, bx: 8, by: 2 }],
      gravity: { x: 0, y: -0.3 }
    }
  },
  {
    id: 5, type: 'memory', name: 'Matrix Echo',
    desc: 'Sharper patterns. Faster flashes.',
    difficulty: 'medium',
    config: { gridSize: 4, sequenceLen: 4, showTime: 600, symbols: ['⚡','💎','🔮','🌀','🧿','⭐'] }
  },
  {
    id: 6, type: 'physics', name: 'Portal Nexus',
    desc: 'Use portals to route the crystal through gaps.',
    difficulty: 'medium',
    config: {
      gridW: 12, gridH: 8,
      crystal: { x: 1, y: 4 },
      core: { x: 10, y: 2 },
      walls: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5],[7,3],[7,4],[7,5],[7,6],[7,7]],
      portals: [{ ax: 4, ay: 7, bx: 6, by: 0 }],
      gravity: { x: 0, y: 0.25 }
    }
  },
  {
    id: 7, type: 'rules', name: 'Cascade Logic',
    desc: 'Some rules unlock others. Think in chains.',
    difficulty: 'medium',
    config: {
      initialRules: ['SHADOW = DARK', 'WATER = WET', 'LIGHT = SHINE'],
      availableRules: ['SHADOW = BRIDGE', 'WATER = PATH', 'LIGHT = SOLID'],
      solution: ['SHADOW = BRIDGE', 'WATER = PATH', 'LIGHT = SHINE'],
      gridW: 8, gridH: 6,
    }
  },
  {
    id: 8, type: 'memory', name: 'Neural Surge',
    desc: 'Symbols appear simultaneously. Remember all.',
    difficulty: 'hard',
    config: { gridSize: 4, sequenceLen: 6, showTime: 500, symbols: ['⚡','💎','🔮','🌀','🧿','⭐','🎯','🔥'] }
  },
  {
    id: 9, type: 'physics', name: 'Magnet Fields',
    desc: 'Attract and repel to thread the needle.',
    difficulty: 'hard',
    config: {
      gridW: 12, gridH: 10,
      crystal: { x: 1, y: 5 },
      core: { x: 10, y: 5 },
      walls: [[4,0],[4,1],[4,3],[4,4],[4,6],[4,7],[4,9],[4,10],[8,0],[8,2],[8,4],[8,6],[8,8]],
      portals: [{ ax: 2, ay: 8, bx: 11, by: 2 }],
      gravity: { x: 0, y: 0.15 }
    }
  },
  {
    id: 10, type: 'boss', name: '⚡ BOSS: Core Collapse',
    desc: 'Memory + Physics + Rules — all at once. No hints.',
    difficulty: 'boss',
    config: { gridSize: 3, sequenceLen: 5, showTime: 700, symbols: ['⚡','💎','🔮','🌀','🧿'], bossPhasesTotal: 3 }
  }
];

// ─── MAIN GAME CONTROLLER ───
const Game = {
  saveData: null,
  currentLevelId: 1,
  currentLevelDef: null,
  activeEngine: null,
  rioMood: 'happy',

  init() {
    this.saveData = Save.load();
    this.updateStreak();
    this.updateTitleStats();
    initBG();
    this.bgLoop();
    this.populateLevelGrid();
    this.bindKeys();
  },

  bgLoop() {
    drawBG();
    requestAnimationFrame(() => this.bgLoop());
  },

  updateStreak() {
    const today = new Date().toDateString();
    if (this.saveData.lastPlay !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      if (this.saveData.lastPlay === yesterday) {
        this.saveData.streak++;
      } else if (this.saveData.lastPlay && this.saveData.lastPlay !== today) {
        this.saveData.streak = 1;
      } else if (!this.saveData.lastPlay) {
        this.saveData.streak = 1;
      }
      this.saveData.lastPlay = today;
      Save.save();
    }
  },

  updateTitleStats() {
    const cleared = Object.values(this.saveData.levelData).filter(l => l.stars > 0).length;
    document.getElementById('stat-levels').textContent = cleared;
    document.getElementById('stat-score').textContent = this.saveData.xp;
    document.getElementById('stat-streak').textContent = this.saveData.streak;
    document.getElementById('hud-xp').textContent = this.saveData.xp;
  },

  // ─── SCREEN MANAGEMENT ───
  showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
      s.style.display = 'none';
    });
    const el = document.getElementById(id);
    el.style.display = 'flex';
    requestAnimationFrame(() => el.classList.add('active'));
  },

  showTitle() {
    if (this.activeEngine) { this.activeEngine.destroy?.(); this.activeEngine = null; }
    this.showScreen('screen-title');
    this.updateTitleStats();
  },

  showHowToPlay() { this.showScreen('screen-howtoplay'); },
  hideHowToPlay() { this.showScreen('screen-title'); },

  startGame() {
    this.populateLevelGrid();
    this.showScreen('screen-levels');
  },

  exitToLevels() {
    if (this.activeEngine) { this.activeEngine.destroy?.(); this.activeEngine = null; }
    this.showScreen('screen-levels');
    this.updateTitleStats();
  },

  populateLevelGrid() {
    const grid = document.getElementById('levels-grid');
    grid.innerHTML = '';
    const maxUnlocked = this.getMaxUnlockedLevel();
    LEVELS.forEach(lvl => {
      const card = document.createElement('div');
      const ld = this.saveData.levelData[lvl.id];
      const stars = ld ? ld.stars : 0;
      const locked = lvl.id > maxUnlocked;
      card.className = `level-card type-${lvl.type} ${locked ? 'locked' : ''} ${stars > 0 ? 'completed' : ''}`;
      card.innerHTML = `
        <div class="level-card-num">${lvl.id}</div>
        <div class="level-card-type">${lvl.type === 'boss' ? '👑 BOSS' : lvl.type.toUpperCase()}</div>
        <div class="level-card-stars">${'⭐'.repeat(stars)}${'☆'.repeat(3 - stars)}</div>
      `;
      if (!locked) card.onclick = () => this.loadLevel(lvl.id);
      grid.appendChild(card);
    });
  },

  getMaxUnlockedLevel() {
    let max = 1;
    LEVELS.forEach(lvl => {
      const ld = this.saveData.levelData[lvl.id];
      if (ld && ld.stars > 0) max = Math.max(max, lvl.id + 1);
    });
    return Math.min(max, LEVELS.length);
  },

  loadLevel(id) {
    const def = LEVELS.find(l => l.id === id);
    if (!def) return;
    this.currentLevelId = id;
    this.currentLevelDef = def;
    if (this.activeEngine) { this.activeEngine.destroy?.(); this.activeEngine = null; }

    this.showScreen('screen-game');
    document.getElementById('current-level-num').textContent = id;

    const badge = document.getElementById('level-type-badge');
    badge.textContent = def.type === 'boss' ? '👑 BOSS' : def.type.toUpperCase();
    badge.className = `level-type-badge ${def.type}`;

    // Rio says something
    const msgs = {
      physics: "Guide the crystal to the Core!", memory: "Watch carefully — then repeat!",
      rules: "Change the rules, change the world!", boss: "This is it. Give everything you have! 🔥"
    };
    this.setRioSpeech(msgs[def.type] || "Let's go!", def.type === 'boss' ? '🤩' : '😮');

    // Objectives
    const objEl = document.getElementById('level-objectives');
    const objs = this.getLevelObjectives(def);
    objEl.innerHTML = objs.map(o => `<div class="objective-item"><span class="obj-check">○</span> ${o}</div>`).join('');

    // Timer display
    const timeDis = document.getElementById('time-display');
    if (def.config.timer) {
      timeDis.style.display = '';
    } else if (def.type === 'memory') {
      timeDis.style.display = '';
    } else {
      timeDis.style.display = 'none';
    }

    // Moves display
    const movesDis = document.getElementById('moves-display');
    movesDis.style.display = def.config.moves ? '' : 'none';

    // Hide rules panel if not rule level
    const rulesPanel = document.getElementById('rules-panel');
    rulesPanel.style.display = def.type === 'rules' ? '' : 'none';

    // Launch engine
    if (def.type === 'physics' || def.type === 'boss') {
      this.activeEngine = new PhysicsEngine(def);
    } else if (def.type === 'memory') {
      this.activeEngine = new MemoryEngine(def);
    } else if (def.type === 'rules') {
      this.activeEngine = new RulesEngine(def);
    }
  },

  getLevelObjectives(def) {
    if (def.type === 'physics' || def.type === 'boss') return ['Guide crystal to Core', 'Don\'t lose the crystal', 'Complete in fewer moves'];
    if (def.type === 'memory') return ['Watch the sequence', 'Repeat correctly', 'Faster = more stars'];
    if (def.type === 'rules') return ['Rewrite the right rules', 'Get the crystal home', 'Use fewest changes'];
    return ['Complete the challenge'];
  },

  setRioSpeech(text, emoji = '😮') {
    document.getElementById('rio-speech').textContent = text;
    document.getElementById('rio-expression').textContent = emoji;
  },

  useHint() {
    if (this.saveData.xp < 50) { this.flash('Not enough XP for a hint!', 'error'); return; }
    if (this.activeEngine?.hint) {
      this.saveData.xp -= 50;
      Save.save();
      this.activeEngine.hint();
      this.updateTitleStats();
    }
  },

  flash(msg, type = 'info') {
    const el = document.createElement('div');
    el.className = 'flash-msg';
    el.textContent = msg;
    if (type === 'error') el.style.borderColor = 'var(--neon-red)';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2100);
  },

  popXP(amount, x, y) {
    const el = document.createElement('div');
    el.className = 'xp-pop';
    el.textContent = `+${amount} XP`;
    el.style.left = (x || window.innerWidth / 2) + 'px';
    el.style.top = (y || window.innerHeight / 2) + 'px';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1300);
  },

  completeLevel(result) {
    if (this.activeEngine) { this.activeEngine.destroy?.(); this.activeEngine = null; }

    const def = this.currentLevelDef;
    const id = this.currentLevelId;
    const prev = this.saveData.levelData[id] || { stars: 0, bestXP: 0 };
    const stars = result.stars || 1;
    const xpGained = result.xpGained || 100;

    this.saveData.levelData[id] = {
      stars: Math.max(prev.stars, stars),
      bestXP: Math.max(prev.bestXP, xpGained)
    };
    this.saveData.xp += xpGained;
    this.saveData.totalCrystals++;
    Save.save();

    // Update analytics
    if (result.memoryScore) this.saveData.analytics.memory = Math.round((this.saveData.analytics.memory * 0.8 + result.memoryScore * 0.2));
    if (result.speedScore) this.saveData.analytics.reaction = Math.round((this.saveData.analytics.reaction * 0.8 + result.speedScore * 0.2));

    this.showCompletionScreen(def, stars, xpGained, result);
  },

  showCompletionScreen(def, stars, xpGained, result) {
    document.getElementById('complete-subtitle').textContent = `Level ${def.id}: ${def.name}`;
    document.getElementById('stars-display').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);
    document.getElementById('score-breakdown').innerHTML = `
      <div class="score-row"><span class="score-label">XP Earned</span><span class="score-val">+${xpGained}</span></div>
      <div class="score-row"><span class="score-label">Stars</span><span class="score-val">${'★'.repeat(stars)}</span></div>
      <div class="score-row"><span class="score-label">Total XP</span><span class="score-val">${this.saveData.xp}</span></div>
      ${result.time ? `<div class="score-row"><span class="score-label">Time</span><span class="score-val">${result.time}s</span></div>` : ''}
    `;
    document.getElementById('analytics-snapshot').innerHTML = `
      <div class="ana-chip">Memory <span>${this.saveData.analytics.memory || '--'}</span></div>
      <div class="ana-chip">Focus <span>${this.saveData.analytics.focus || '--'}</span></div>
      <div class="ana-chip">Reaction <span>${this.saveData.analytics.reaction || '--'}</span></div>
    `;
    this.updateTitleStats();
    this.showScreen('screen-complete');
    this.popXP(xpGained, window.innerWidth / 2, window.innerHeight / 2);
  },

  nextLevel() {
    const nextId = this.currentLevelId + 1;
    if (nextId > LEVELS.length) {
      this.flash('You cleared all levels! More coming soon!');
      this.startGame();
    } else {
      this.loadLevel(nextId);
    }
  },

  replayLevel() { this.loadLevel(this.currentLevelId); },

  share(platform) {
    const text = `I just cleared Level ${this.currentLevelId} on PrimeLab: NeuroVerse! 🧠⚡ My brain score: ${this.saveData.xp} XP. Can you beat me? primespirit.co.in`;
    const url = 'https://primespirit.co.in/primelab';
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n' + url)}`);
    } else if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
    } else if (platform === 'copy') {
      navigator.clipboard?.writeText(text + '\n' + url).then(() => this.flash('Copied to clipboard! 📋'));
    }
  },

  bindKeys() {
    document.addEventListener('keydown', e => {
      if (e.key === 'r' || e.key === 'R') {
        const gs = document.getElementById('screen-game');
        if (gs.classList.contains('active')) this.replayLevel();
      }
      if (e.key === 'h' || e.key === 'H') {
        const gs = document.getElementById('screen-game');
        if (gs.classList.contains('active')) this.useHint();
      }
    });
  }
};

// ═══════════════════════════════════════════
//   PHYSICS ENGINE
// ═══════════════════════════════════════════
class PhysicsEngine {
  constructor(def) {
    this.def = def;
    this.cfg = def.config;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.destroyed = false;
    this.startTime = Date.now();
    this.moves = 0;

    this.CELL = 0;
    this.offsetX = 0;
    this.offsetY = 0;

    this.crystal = { ...this.cfg.crystal, vx: 0, vy: 0, trail: [] };
    this.core = { ...this.cfg.core };
    this.walls = new Set((this.cfg.walls || []).map(([x, y]) => `${x},${y}`));
    this.portals = this.cfg.portals || [];
    this.gravity = this.cfg.gravity || { x: 0, y: 0.3 };
    this.dragging = false;
    this.dragStart = null;
    this.dragLine = null;
    this.win = false;
    this.particles = [];
    this.animFrame = null;
    this.glowPulse = 0;

    this.initCanvas();
    this.bindEvents();
    this.loop();
  }

  initCanvas() {
    const wrap = this.canvas.parentElement;
    const W = wrap.clientWidth;
    const H = wrap.clientHeight;
    this.canvas.width = W;
    this.canvas.height = H;
    const cellW = Math.floor(W / (this.cfg.gridW + 2));
    const cellH = Math.floor(H / (this.cfg.gridH + 2));
    this.CELL = Math.min(cellW, cellH, 64);
    this.offsetX = Math.floor((W - this.CELL * this.cfg.gridW) / 2);
    this.offsetY = Math.floor((H - this.CELL * this.cfg.gridH) / 2);
  }

  bindEvents() {
    this.onDown = e => this.handleDown(e);
    this.onMove = e => this.handleMove(e);
    this.onUp = e => this.handleUp(e);
    this.canvas.addEventListener('mousedown', this.onDown);
    this.canvas.addEventListener('mousemove', this.onMove);
    this.canvas.addEventListener('mouseup', this.onUp);
    this.canvas.addEventListener('touchstart', e => { e.preventDefault(); this.handleDown(e.touches[0]); }, { passive: false });
    this.canvas.addEventListener('touchmove', e => { e.preventDefault(); this.handleMove(e.touches[0]); }, { passive: false });
    this.canvas.addEventListener('touchend', e => { e.preventDefault(); this.handleUp(e.changedTouches[0]); }, { passive: false });
  }

  getGridPos(clientX, clientY) {
    const rect = this.canvas.getBoundingClientRect();
    const x = (clientX - rect.left - this.offsetX) / this.CELL;
    const y = (clientY - rect.top - this.offsetY) / this.CELL;
    return { x, y };
  }

  handleDown(e) {
    const pos = this.getGridPos(e.clientX, e.clientY);
    const dx = pos.x - this.crystal.x - 0.5;
    const dy = pos.y - this.crystal.y - 0.5;
    if (Math.hypot(dx, dy) < 1.2) {
      this.dragging = true;
      this.dragStart = pos;
      this.dragLine = null;
    }
  }

  handleMove(e) {
    if (!this.dragging) return;
    const pos = this.getGridPos(e.clientX, e.clientY);
    this.dragLine = pos;
  }

  handleUp(e) {
    if (!this.dragging) return;
    this.dragging = false;
    if (this.dragLine && this.dragStart) {
      const dx = this.dragLine.x - this.dragStart.x;
      const dy = this.dragLine.y - this.dragStart.y;
      const len = Math.hypot(dx, dy);
      if (len > 0.3) {
        const power = Math.min(len * 0.35, 2.5);
        this.crystal.vx = (dx / len) * power;
        this.crystal.vy = (dy / len) * power;
        this.moves++;
      }
    }
    this.dragStart = null;
    this.dragLine = null;
  }

  update() {
    if (this.win) return;
    const c = this.crystal;
    c.vy += this.gravity.y;
    c.vx += this.gravity.x;
    c.vx *= 0.985;
    c.vy *= 0.985;

    let nx = c.x + c.vx;
    let ny = c.y + c.vy;

    // Wall collisions (grid snapped)
    const cx = Math.floor(nx + 0.5);
    const cy = Math.floor(ny + 0.5);
    if (this.walls.has(`${Math.floor(nx + 0.5)},${Math.floor(c.y + 0.5)}`)) {
      c.vx *= -0.6; nx = c.x;
    }
    if (this.walls.has(`${Math.floor(c.x + 0.5)},${Math.floor(ny + 0.5)}`)) {
      c.vy *= -0.6; ny = c.y;
    }

    // Boundary
    if (nx < 0) { nx = 0; c.vx *= -0.7; }
    if (nx > this.cfg.gridW - 1) { nx = this.cfg.gridW - 1; c.vx *= -0.7; }
    if (ny < 0) { ny = 0; c.vy *= -0.7; }
    if (ny > this.cfg.gridH - 1) { ny = this.cfg.gridH - 1; c.vy *= -0.7; }

    // Portals
    this.portals.forEach(p => {
      if (Math.hypot(nx - p.ax, ny - p.ay) < 0.8) {
        nx = p.bx; ny = p.by;
        this.spawnParticleBurst(
          this.offsetX + p.bx * this.CELL,
          this.offsetY + p.by * this.CELL,
          'var(--neon-violet)'
        );
        Game.flash('⚡ PORTAL!');
      }
    });

    c.x = nx; c.y = ny;
    c.trail.push({ x: nx, y: ny });
    if (c.trail.length > 24) c.trail.shift();

    // Win check
    if (Math.hypot(c.x - this.core.x, c.y - this.core.y) < 0.9) {
      this.triggerWin();
    }

    // Particles update
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.05; p.life -= 2;
    });
    this.glowPulse += 0.05;
  }

  spawnParticleBurst(px, py, color) {
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const speed = Math.random() * 2 + 1;
      this.particles.push({
        x: px, y: py,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 60, color
      });
    }
  }

  triggerWin() {
    this.win = true;
    const cx = this.offsetX + this.core.x * this.CELL;
    const cy = this.offsetY + this.core.y * this.CELL;
    for (let i = 0; i < 30; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3 + 1;
      this.particles.push({ x: cx, y: cy, vx: Math.cos(angle)*speed, vy: Math.sin(angle)*speed, life: 90, color: '255,209,102' });
    }
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const stars = this.moves <= 3 ? 3 : this.moves <= 6 ? 2 : 1;
    const xp = stars === 3 ? 150 : stars === 2 ? 100 : 70;
    setTimeout(() => {
      Game.setRioSpeech('AMAZING! Neuron repaired! ✨', '🤩');
      Game.completeLevel({ stars, xpGained: xp, time: elapsed });
    }, 1000);
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    const C = this.CELL;
    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = 'rgba(0,229,255,0.06)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= this.cfg.gridW; x++) {
      ctx.beginPath();
      ctx.moveTo(this.offsetX + x * C, this.offsetY);
      ctx.lineTo(this.offsetX + x * C, this.offsetY + this.cfg.gridH * C);
      ctx.stroke();
    }
    for (let y = 0; y <= this.cfg.gridH; y++) {
      ctx.beginPath();
      ctx.moveTo(this.offsetX, this.offsetY + y * C);
      ctx.lineTo(this.offsetX + this.cfg.gridW * C, this.offsetY + y * C);
      ctx.stroke();
    }

    // Walls
    this.walls.forEach(key => {
      const [gx, gy] = key.split(',').map(Number);
      const px = this.offsetX + gx * C;
      const py = this.offsetY + gy * C;
      ctx.fillStyle = 'rgba(30,50,120,0.85)';
      ctx.fillRect(px, py, C, C);
      ctx.strokeStyle = 'rgba(0,229,255,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, C - 1, C - 1);
      // inner glow
      const grad = ctx.createLinearGradient(px, py, px + C, py + C);
      grad.addColorStop(0, 'rgba(0,229,255,0.06)');
      grad.addColorStop(1, 'rgba(180,79,255,0.06)');
      ctx.fillStyle = grad;
      ctx.fillRect(px, py, C, C);
    });

    // Portals
    this.portals.forEach(p => {
      [[p.ax, p.ay, '0,229,255'], [p.bx, p.by, '180,79,255']].forEach(([gx, gy, col]) => {
        const px = this.offsetX + (gx + 0.5) * C;
        const py = this.offsetY + (gy + 0.5) * C;
        ctx.beginPath();
        ctx.arc(px, py, C * 0.42, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col},0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, C * 0.3 + Math.sin(this.glowPulse) * 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${col},0.15)`;
        ctx.fill();
        // Portal label
        ctx.fillStyle = `rgba(${col},0.9)`;
        ctx.font = `bold ${C * 0.3}px Orbitron`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('⬡', px, py);
      });
    });

    // Core
    const corePX = this.offsetX + (this.core.x + 0.5) * C;
    const corePY = this.offsetY + (this.core.y + 0.5) * C;
    const coreR = C * 0.38 + Math.sin(this.glowPulse * 1.5) * 3;
    const coreGrad = ctx.createRadialGradient(corePX, corePY, 0, corePX, corePY, coreR * 1.5);
    coreGrad.addColorStop(0, 'rgba(255,209,102,0.9)');
    coreGrad.addColorStop(0.5, 'rgba(255,150,50,0.5)');
    coreGrad.addColorStop(1, 'rgba(255,100,20,0)');
    ctx.beginPath();
    ctx.arc(corePX, corePY, coreR * 1.8, 0, Math.PI * 2);
    ctx.fillStyle = coreGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(corePX, corePY, coreR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,209,102,0.85)';
    ctx.fill();
    ctx.font = `${C * 0.5}px Arial`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('💎', corePX, corePY);

    // Crystal trail
    const c = this.crystal;
    if (c.trail.length > 1) {
      for (let i = 1; i < c.trail.length; i++) {
        const alpha = (i / c.trail.length) * 0.4;
        const t = c.trail[i];
        const tp = c.trail[i - 1];
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
        ctx.lineWidth = (i / c.trail.length) * 4;
        ctx.moveTo(this.offsetX + (tp.x + 0.5) * C, this.offsetY + (tp.y + 0.5) * C);
        ctx.lineTo(this.offsetX + (t.x + 0.5) * C, this.offsetY + (t.y + 0.5) * C);
        ctx.stroke();
      }
    }

    // Crystal
    const cx = this.offsetX + (c.x + 0.5) * C;
    const cy = this.offsetY + (c.y + 0.5) * C;
    const cr = C * 0.32;
    const crystalGrad = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, 0, cx, cy, cr);
    crystalGrad.addColorStop(0, 'rgba(180,255,255,1)');
    crystalGrad.addColorStop(0.5, 'rgba(0,200,255,0.9)');
    crystalGrad.addColorStop(1, 'rgba(0,100,200,0.8)');
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fillStyle = crystalGrad;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, cr + 4 + Math.sin(this.glowPulse * 2) * 2, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,229,255,0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Drag arrow
    if (this.dragging && this.dragLine && this.dragStart) {
      const sx = this.offsetX + (this.dragStart.x) * C;
      const sy = this.offsetY + (this.dragStart.y) * C;
      const ex = this.offsetX + (this.dragLine.x) * C;
      const ey = this.offsetY + (this.dragLine.y) * C;
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0,229,255,0.7)';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 4]);
      ctx.moveTo(sx, sy); ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrowhead
      const angle = Math.atan2(ey - sy, ex - sx);
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 12 * Math.cos(angle - 0.4), ey - 12 * Math.sin(angle - 0.4));
      ctx.lineTo(ex - 12 * Math.cos(angle + 0.4), ey - 12 * Math.sin(angle + 0.4));
      ctx.closePath();
      ctx.fillStyle = 'rgba(0,229,255,0.8)';
      ctx.fill();
    }

    // Particles
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.life / 90})`;
      ctx.fill();
    });

    // Crystals HUD
    document.getElementById('crystals-display').textContent = this.win ? '1/1 ✓' : '0/1';
    document.getElementById('moves-left').textContent = this.moves;
  }

  loop() {
    if (this.destroyed) return;
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  hint() {
    Game.setRioSpeech(`Pull the crystal toward the glowing core! Aim carefully.`, '💡');
    Game.flash('💡 Hint: Aim for the golden diamond!');
  }

  destroy() {
    this.destroyed = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    this.canvas.removeEventListener('mousedown', this.onDown);
    this.canvas.removeEventListener('mousemove', this.onMove);
    this.canvas.removeEventListener('mouseup', this.onUp);
  }
}

// ═══════════════════════════════════════════
//   MEMORY ENGINE
// ═══════════════════════════════════════════
class MemoryEngine {
  constructor(def) {
    this.def = def;
    this.cfg = def.config;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.destroyed = false;
    this.startTime = Date.now();

    this.state = 'showing'; // showing | waiting | inputting | done
    this.sequence = [];
    this.playerSeq = [];
    this.showIdx = 0;
    this.inputsCorrect = 0;
    this.mistakes = 0;
    this.cells = [];
    this.gridSize = this.cfg.gridSize;
    this.symbols = this.cfg.symbols;
    this.highlighted = -1;
    this.animFrame = null;
    this.glowPulse = 0;
    this.counterDown = 3;
    this.counterInterval = null;
    this.elapsedCorrect = 0;

    this.initCanvas();
    this.generateSequence();
    this.startCountdown();
  }

  initCanvas() {
    const wrap = this.canvas.parentElement;
    this.canvas.width = wrap.clientWidth;
    this.canvas.height = wrap.clientHeight;

    const size = this.gridSize;
    const maxCell = Math.min(
      Math.floor((this.canvas.width - 40) / size),
      Math.floor((this.canvas.height - 80) / size),
      100
    );
    this.CELL = maxCell;
    this.gridPX = Math.floor((this.canvas.width - this.CELL * size) / 2);
    this.gridPY = Math.floor((this.canvas.height - this.CELL * size) / 2) + 20;

    this.cells = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        this.cells.push({
          idx: r * size + c,
          x: this.gridPX + c * this.CELL,
          y: this.gridPY + r * this.CELL,
          symbol: this.symbols[Math.floor(Math.random() * this.symbols.length)]
        });
      }
    }
    this.canvas.onclick = e => this.handleClick(e);
    this.loop();
  }

  generateSequence() {
    this.sequence = [];
    const total = this.cells.length;
    for (let i = 0; i < this.cfg.sequenceLen; i++) {
      this.sequence.push(Math.floor(Math.random() * total));
    }
  }

  startCountdown() {
    this.state = 'countdown';
    this.counterDown = 3;
    this.counterInterval = setInterval(() => {
      this.counterDown--;
      if (this.counterDown < 1) {
        clearInterval(this.counterInterval);
        this.counterInterval = null;
        this.startShowing();
      }
    }, 600);
  }

  startShowing() {
    this.state = 'showing';
    this.showIdx = 0;
    Game.setRioSpeech('Watch carefully! 👀', '😮');
    this.showNextInSequence();
  }

  showNextInSequence() {
    if (this.showIdx >= this.sequence.length) {
      setTimeout(() => {
        this.state = 'inputting';
        this.highlighted = -1;
        Game.setRioSpeech(`Now repeat the ${this.cfg.sequenceLen}-step sequence!`, '🎯');
        document.getElementById('time-left').textContent = `${this.cfg.sequenceLen} left`;
      }, this.cfg.showTime);
      return;
    }
    const cellIdx = this.sequence[this.showIdx];
    this.highlighted = cellIdx;
    setTimeout(() => {
      this.highlighted = -1;
      this.showIdx++;
      setTimeout(() => this.showNextInSequence(), 150);
    }, this.cfg.showTime);
  }

  handleClick(e) {
    if (this.state !== 'inputting') return;
    const rect = this.canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let clicked = -1;
    this.cells.forEach((cell, idx) => {
      if (mx >= cell.x && mx < cell.x + this.CELL && my >= cell.y && my < cell.y + this.CELL) {
        clicked = idx;
      }
    });
    if (clicked === -1) return;

    const expected = this.sequence[this.playerSeq.length];
    this.playerSeq.push(clicked);

    if (clicked === expected) {
      this.cellFeedback = { idx: clicked, type: 'correct' };
      this.inputsCorrect++;
      setTimeout(() => { this.cellFeedback = null; }, 400);
      if (this.playerSeq.length === this.sequence.length) {
        this.triggerWin();
      } else {
        document.getElementById('time-left').textContent = `${this.sequence.length - this.playerSeq.length} left`;
      }
    } else {
      this.cellFeedback = { idx: clicked, type: 'wrong' };
      this.mistakes++;
      setTimeout(() => { this.cellFeedback = null; }, 500);
      Game.setRioSpeech('Wrong! Keep going!', '😬');
      // Reset player sequence for retry
      setTimeout(() => {
        this.playerSeq = [];
        document.getElementById('time-left').textContent = `${this.cfg.sequenceLen} left`;
        Game.setRioSpeech('Try again from the start!', '🤔');
      }, 600);
    }
  }

  triggerWin() {
    this.state = 'done';
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const stars = this.mistakes === 0 ? 3 : this.mistakes <= 2 ? 2 : 1;
    const xp = stars === 3 ? 160 : stars === 2 ? 110 : 75;
    const memScore = Math.max(0, 100 - this.mistakes * 15);
    const speedScore = Math.max(0, 100 - elapsed * 2);
    Game.setRioSpeech('Perfect recall! 🧠✨', '🤩');
    setTimeout(() => {
      Game.completeLevel({ stars, xpGained: xp, time: elapsed, memoryScore: memScore, speedScore });
    }, 800);
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);
    this.glowPulse += 0.04;

    // Title
    ctx.font = 'bold 13px Orbitron';
    ctx.fillStyle = 'rgba(180,79,255,0.8)';
    ctx.textAlign = 'center';
    ctx.fillText('MEMORY MATRIX', W / 2, this.gridPY - 30);

    if (this.state === 'countdown') {
      ctx.font = 'bold 80px Orbitron';
      ctx.fillStyle = 'rgba(0,229,255,0.9)';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(this.counterDown, W / 2, H / 2);
      return;
    }

    // Progress bar above grid
    const progress = this.playerSeq.length / this.sequence.length;
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(this.gridPX, this.gridPY - 14, this.CELL * this.gridSize, 6);
    ctx.fillStyle = 'rgba(180,79,255,0.8)';
    ctx.fillRect(this.gridPX, this.gridPY - 14, this.CELL * this.gridSize * progress, 6);

    // Cells
    this.cells.forEach((cell, idx) => {
      const isHighlighted = this.highlighted === idx;
      const isFeedback = this.cellFeedback && this.cellFeedback.idx === idx;
      const feedType = isFeedback ? this.cellFeedback.type : null;

      // Background
      ctx.fillStyle = isHighlighted
        ? 'rgba(0,229,255,0.25)'
        : feedType === 'correct'
          ? 'rgba(6,255,180,0.2)'
          : feedType === 'wrong'
            ? 'rgba(255,64,96,0.2)'
            : 'rgba(0,229,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(cell.x + 4, cell.y + 4, this.CELL - 8, this.CELL - 8, 10);
      ctx.fill();

      // Border
      const borderColor = isHighlighted
        ? 'rgba(0,229,255,1)'
        : feedType === 'correct'
          ? 'rgba(6,255,180,0.9)'
          : feedType === 'wrong'
            ? 'rgba(255,64,96,0.9)'
            : 'rgba(0,229,255,0.2)';
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = isHighlighted ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.roundRect(cell.x + 4, cell.y + 4, this.CELL - 8, this.CELL - 8, 10);
      ctx.stroke();

      // Glow
      if (isHighlighted) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(0,229,255,0.8)';
      }

      // Symbol (shown during sequence or after revealing)
      const showSymbol = this.state === 'showing' && isHighlighted;
      if (showSymbol || isHighlighted || feedType) {
        ctx.font = `${this.CELL * 0.45}px Arial`;
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'white';
        ctx.fillText(cell.symbol, cell.x + this.CELL / 2, cell.y + this.CELL / 2);
      } else {
        // Show number in waiting/inputting mode for orientation
        ctx.font = `${this.CELL * 0.25}px JetBrains Mono`;
        ctx.fillStyle = 'rgba(0,229,255,0.2)';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(idx + 1, cell.x + this.CELL / 2, cell.y + this.CELL / 2);
      }
      ctx.shadowBlur = 0;
    });

    // Step indicators
    const stepY = this.gridPY + this.CELL * this.gridSize + 20;
    this.sequence.forEach((_, i) => {
      const dotX = W / 2 - (this.sequence.length * 16) / 2 + i * 16 + 8;
      ctx.beginPath();
      ctx.arc(dotX, stepY, 5, 0, Math.PI * 2);
      ctx.fillStyle = i < this.playerSeq.length ? 'rgba(6,255,180,0.9)' : i < this.showIdx ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.15)';
      ctx.fill();
    });

    document.getElementById('time-left').textContent = this.state === 'inputting'
      ? `${this.sequence.length - this.playerSeq.length} left`
      : this.state === 'showing' ? `Step ${this.showIdx + 1}/${this.sequence.length}` : '--';
    document.getElementById('crystals-display').textContent = `${this.inputsCorrect}/${this.cfg.sequenceLen}`;
  }

  loop() {
    if (this.destroyed) return;
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  hint() {
    // Replay sequence
    Game.flash('💡 Replaying sequence (hint)...');
    if (this.state === 'inputting') {
      this.playerSeq = [];
      this.showIdx = 0;
      this.state = 'showing';
      this.showNextInSequence();
    }
  }

  destroy() {
    this.destroyed = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
      this.counterInterval = null;
    }
  }
}

// ═══════════════════════════════════════════
//   RULES ENGINE
// ═══════════════════════════════════════════
class RulesEngine {
  constructor(def) {
    this.def = def;
    this.cfg = def.config;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.destroyed = false;
    this.startTime = Date.now();

    this.activeRules = [...this.cfg.initialRules];
    this.changes = 0;
    this.animFrame = null;
    this.glowPulse = 0;
    this.worldState = 'broken'; // broken | fixed
    this.particles = [];
    this.selectedRule = null;

    this.buildRulesPanel();
    this.initCanvas();
    Game.setRioSpeech('Drag new rules into the slots to change the world!', '🤔');
    this.loop();
  }

  buildRulesPanel() {
    const panel = document.getElementById('rules-panel');
    const rulesList = document.getElementById('rules-list');
    const rulesAvail = document.getElementById('rules-available');

    // Active rule slots
    rulesList.innerHTML = '<div class="rules-title" style="font-size:9px;letter-spacing:2px;color:rgba(255,209,102,0.7);margin-bottom:4px">CURRENT RULES</div>';
    this.activeRules.forEach((rule, i) => {
      const slot = document.createElement('div');
      slot.className = 'rule-slot';
      slot.dataset.idx = i;
      slot.textContent = rule;
      slot.id = `rule-slot-${i}`;
      slot.ondragover = e => { e.preventDefault(); slot.classList.add('drag-over'); };
      slot.ondragleave = () => slot.classList.remove('drag-over');
      slot.ondrop = e => {
        e.preventDefault();
        slot.classList.remove('drag-over');
        const newRule = e.dataTransfer.getData('text/plain');
        this.changeRule(i, newRule);
      };
      rulesList.appendChild(slot);
    });

    // Available rules
    rulesAvail.innerHTML = '<div class="rules-title" style="font-size:9px;letter-spacing:2px;color:rgba(0,229,255,0.7);margin:8px 0 4px">DRAG THESE</div>';
    this.cfg.availableRules.forEach(rule => {
      const tag = document.createElement('div');
      tag.className = 'rule-tag';
      tag.textContent = rule;
      tag.draggable = true;
      tag.ondragstart = e => {
        e.dataTransfer.setData('text/plain', rule);
        tag.classList.add('dragging');
      };
      tag.ondragend = () => tag.classList.remove('dragging');
      rulesAvail.appendChild(tag);
    });
  }

  changeRule(idx, newRule) {
    this.activeRules[idx] = newRule;
    this.changes++;
    document.getElementById(`rule-slot-${idx}`).textContent = newRule;

    // Particle effect on world
    for (let i = 0; i < 8; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3 - 1,
        life: 60, color: '255,209,102'
      });
    }

    Game.flash(`Rule changed: ${newRule}`);

    // Check if solution matches
    const matches = this.cfg.solution.every((s, i) => this.activeRules[i] === s);
    if (matches) {
      this.worldState = 'fixed';
      setTimeout(() => this.triggerWin(), 1200);
    } else {
      Game.setRioSpeech(`Rules updated! ${this.changes} change(s). Keep going!`, '🤔');
    }
  }

  triggerWin() {
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    const stars = this.changes <= this.cfg.solution.length ? 3 : this.changes <= this.cfg.solution.length + 2 ? 2 : 1;
    const xp = stars === 3 ? 140 : stars === 2 ? 100 : 65;
    Game.setRioSpeech('Reality rewritten! World fixed! 🌟', '🤩');
    Game.completeLevel({ stars, xpGained: xp, time: elapsed });
  }

  initCanvas() {
    const wrap = this.canvas.parentElement;
    this.canvas.width = wrap.clientWidth;
    this.canvas.height = wrap.clientHeight;
  }

  draw() {
    const ctx = this.ctx;
    const W = this.canvas.width, H = this.canvas.height;
    ctx.clearRect(0, 0, W, H);
    this.glowPulse += 0.04;

    // World background (broken or fixing)
    const worldAlpha = this.worldState === 'fixed' ? 0.15 : 0.06;
    const worldColor = this.worldState === 'fixed' ? '6,255,180' : '0,229,255';

    // Draw a stylized world map
    const cx = W / 2, cy = H / 2;

    // Central brain-world sphere
    const r = Math.min(W, H) * 0.28;
    const grad = ctx.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    if (this.worldState === 'fixed') {
      grad.addColorStop(0, 'rgba(6,255,180,0.2)');
      grad.addColorStop(0.5, 'rgba(0,180,100,0.08)');
      grad.addColorStop(1, 'rgba(0,100,50,0)');
    } else {
      grad.addColorStop(0, 'rgba(180,79,255,0.12)');
      grad.addColorStop(0.5, 'rgba(50,0,120,0.06)');
      grad.addColorStop(1, 'rgba(0,0,80,0)');
    }
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = this.worldState === 'fixed' ? 'rgba(6,255,180,0.5)' : 'rgba(180,79,255,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Glitch lines (broken world)
    if (this.worldState !== 'fixed') {
      ctx.strokeStyle = 'rgba(255,64,96,0.3)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 5; i++) {
        const ly = cy - r + r * 0.4 * i + Math.sin(this.glowPulse + i) * 10;
        ctx.beginPath();
        ctx.moveTo(cx - r + Math.random() * 20, ly);
        ctx.lineTo(cx + r - Math.random() * 20, ly + Math.random() * 20 - 10);
        ctx.stroke();
      }
    }

    // Rule icons floating in world
    const rulePositions = [
      { x: cx - r * 0.5, y: cy - r * 0.3 },
      { x: cx + r * 0.4, y: cy - r * 0.2 },
      { x: cx, y: cy + r * 0.35 }
    ];
    this.activeRules.forEach((rule, i) => {
      const pos = rulePositions[i] || { x: cx, y: cy };
      const correct = rule === this.cfg.solution[i];
      ctx.fillStyle = correct ? 'rgba(6,255,180,0.9)' : 'rgba(255,100,100,0.7)';
      ctx.font = 'bold 11px JetBrains Mono';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      const bobY = pos.y + Math.sin(this.glowPulse + i * 1.5) * 6;
      // Card background
      const tw = ctx.measureText(rule).width + 20;
      ctx.fillStyle = correct ? 'rgba(0,50,30,0.8)' : 'rgba(50,0,20,0.8)';
      ctx.beginPath();
      ctx.roundRect(pos.x - tw / 2, bobY - 14, tw, 28, 6);
      ctx.fill();
      ctx.strokeStyle = correct ? 'rgba(6,255,180,0.6)' : 'rgba(255,64,96,0.4)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = correct ? '#06ffb4' : '#ff6080';
      ctx.fillText(rule, pos.x, bobY);
    });

    // Particles
    this.particles = this.particles.filter(p => p.life > 0);
    this.particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.life / 60})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.life -= 2;
    });

    // Status
    ctx.font = 'bold 14px Orbitron';
    ctx.fillStyle = this.worldState === 'fixed' ? 'rgba(6,255,180,0.9)' : 'rgba(255,64,96,0.7)';
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillText(this.worldState === 'fixed' ? '✓ WORLD RESTORED' : '⚠ WORLD BROKEN', cx, 20);

    // Changes counter
    ctx.font = '11px JetBrains Mono';
    ctx.fillStyle = 'rgba(255,209,102,0.6)';
    ctx.fillText(`${this.changes} changes made`, cx, 44);

    document.getElementById('crystals-display').textContent = `${this.cfg.solution.filter((s, i) => this.activeRules[i] === s).length}/${this.cfg.solution.length}`;
  }

  loop() {
    if (this.destroyed) return;
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  hint() {
    const wrongIdx = this.cfg.solution.findIndex((s, i) => this.activeRules[i] !== s);
    if (wrongIdx >= 0) {
      const needed = this.cfg.solution[wrongIdx];
      Game.flash(`💡 Hint: Slot ${wrongIdx + 1} needs "${needed}"`);
      Game.setRioSpeech(`Rule slot ${wrongIdx + 1} should be: ${needed}`, '💡');
    }
  }

  destroy() {
    this.destroyed = true;
    if (this.animFrame) cancelAnimationFrame(this.animFrame);
  }
}

// ─── INIT ───
window.addEventListener('load', () => Game.init());
window.addEventListener('resize', () => {
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  initBG();
});
