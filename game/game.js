(function() {
'use strict';

/* ═══════════════════════════════════════════════════════
   PHYSICS QUEST: ACADEMY OF FORCES — Game Engine v2.0
   Prime Spirit Mentors · primespirit.co.in

   Changelog v2.0
   ─ Modernized to ES6+ (classes, async/await, const/let)
   ─ Fixed: SaveManager.save() 'self' reference bug
   ─ Fixed: Boss battle infinite-question loop
   ─ Added: Combo system in boss battles
   ─ Added: Critical hit mechanic
   ─ Added: DOM particle effects engine
   ─ Added: Screen-shake on boss hits
   ─ Added: Daily login rewards
   ─ Added: Passive creature bonuses
   ─ Added: Achievement popup banner
   ─ Added: Fallback questions if JSON fails
   ─ Added: Save-data migration for v1 → v2
   ─ Improved: Battle phases (boss enrages at low HP)
   ─ Improved: Toast stacking and animations
   ─ Improved: Error handling throughout
   ═══════════════════════════════════════════════════════ */

// ── Utilities ──────────────────────────────────────────
const clamp  = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const shuffle = arr => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const lerp = (a, b, t) => a + (b - a) * t;
const pct  = (n, d) => d > 0 ? Math.round(n / d * 100) : 0;
const cap  = s => s.charAt(0).toUpperCase() + s.slice(1);

// ── Configuration ──────────────────────────────────────
const CFG = {
  SAVE_KEY      : 'pq-save-v1',
  DB_NAME       : 'PhysicsQuestDB',
  DB_STORE      : 'gamedata',
  DATA_DIR      : 'game/data/',
  VERSION       : '2.0.0',
  XP_CURVE      : [0, 100, 250, 500, 850, 1300, 1900, 2700, 3800, 5200, 7000, 10000],
  PLAYER_HP     : 100,
  DMG_CORRECT   : 22,
  DMG_WRONG     : 15,
  COMBO_MULT    : [1, 1, 1.15, 1.3, 1.45, 1.6, 1.75, 1.9, 2.1],   // index = combo count
  CRIT_CHANCE   : 0.10,
  CRIT_MULT     : 2,
  XP_PER_CORRECT: 10,
  COIN_PER_CORRECT: 5,
  XP_BOSS_WIN   : 200,
  COIN_BOSS_WIN : 100,
  XP_ACHIEVEMENT: 25,
  DAILY_COINS   : 50,
  DAILY_XP      : 25,
  MAX_BOSS_QS   : 40
};

// ── Creature SVG Art (100 % original) ──────────────────
const CREATURE_SVG = {

momentum_fox:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="65" rx="24" ry="18" fill="#ff9f43"/>
  <circle cx="50" cy="42" r="17" fill="#ff9f43"/>
  <polygon points="36,34 28,8 46,28" fill="#ee5a24"/>
  <polygon points="64,34 72,8 54,28" fill="#ee5a24"/>
  <polygon points="37,33 30,10 44,27" fill="#ffbe76"/>
  <polygon points="63,33 70,10 56,27" fill="#ffbe76"/>
  <circle cx="43" cy="39" r="3.5" fill="#2d3436"/>
  <circle cx="57" cy="39" r="3.5" fill="#2d3436"/>
  <circle cx="44" cy="38" r="1.2" fill="#fff"/>
  <circle cx="58" cy="38" r="1.2" fill="#fff"/>
  <ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#2d3436"/>
  <path d="M46 50Q50 55 54 50" fill="none" stroke="#2d3436" stroke-width="1.3" stroke-linecap="round"/>
  <ellipse cx="78" cy="72" rx="15" ry="6" fill="#ee5a24" transform="rotate(-15 78 72)"/>
  <ellipse cx="82" cy="69" rx="8" ry="4" fill="#ffbe76" transform="rotate(-15 82 69)"/>
</svg>`,

vector_hawk:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="55" rx="20" ry="28" fill="#8b5cf6"/>
  <polygon points="50,12 44,30 56,30" fill="#a855f7"/>
  <polygon points="10,50 30,44 30,56" fill="#7c3aed" opacity=".7"/>
  <polygon points="90,50 70,44 70,56" fill="#7c3aed" opacity=".7"/>
  <circle cx="44" cy="38" r="3" fill="#fff"/>
  <circle cx="56" cy="38" r="3" fill="#fff"/>
  <circle cx="44" cy="38" r="1.5" fill="#2d3436"/>
  <circle cx="56" cy="38" r="1.5" fill="#2d3436"/>
  <polygon points="50,44 46,48 54,48" fill="#f59e0b"/>
  <path d="M38 55L50 80L62 55" fill="none" stroke="#c4b5fd" stroke-width="1.5"/>
  <line x1="50" y1="65" x2="50" y2="80" stroke="#c4b5fd" stroke-width="1.5"/>
  <circle cx="8" cy="50" r="3" fill="#f59e0b"/>
  <circle cx="92" cy="50" r="3" fill="#f59e0b"/>
</svg>`,

gravion:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="30" y="45" width="40" height="35" rx="6" fill="#92400e"/>
  <rect x="35" y="30" width="30" height="20" rx="4" fill="#b45309"/>
  <circle cx="43" cy="38" r="3.5" fill="#fbbf24"/>
  <circle cx="57" cy="38" r="3.5" fill="#fbbf24"/>
  <rect x="26" y="50" width="8" height="25" rx="4" fill="#92400e"/>
  <rect x="66" y="50" width="8" height="25" rx="4" fill="#92400e"/>
  <rect x="34" y="80" width="12" height="8" rx="3" fill="#78350f"/>
  <rect x="54" y="80" width="12" height="8" rx="3" fill="#78350f"/>
  <circle cx="50" cy="55" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5"/>
  <text x="50" y="58" text-anchor="middle" font-size="7" font-weight="900" fill="#fbbf24">G</text>
</svg>`,

thermix:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="60" rx="22" ry="26" fill="#ef4444"/>
  <ellipse cx="50" cy="60" rx="16" ry="20" fill="#f97316"/>
  <ellipse cx="50" cy="58" rx="10" ry="14" fill="#fbbf24"/>
  <circle cx="50" cy="50" r="5" fill="#fef3c7"/>
  <circle cx="44" cy="42" r="3" fill="#fff"/>
  <circle cx="56" cy="42" r="3" fill="#fff"/>
  <circle cx="44" cy="42" r="1.5" fill="#2d3436"/>
  <circle cx="56" cy="42" r="1.5" fill="#2d3436"/>
  <path d="M44 52Q50 58 56 52" fill="none" stroke="#2d3436" stroke-width="1.5" stroke-linecap="round"/>
  <polygon points="50,8 46,22 54,22" fill="#f97316"/>
  <polygon points="35,15 33,28 40,24" fill="#ef4444" opacity=".7"/>
  <polygon points="65,15 67,28 60,24" fill="#ef4444" opacity=".7"/>
</svg>`,

circuit_crab:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="62" rx="28" ry="18" fill="#0891b2"/>
  <ellipse cx="50" cy="60" rx="22" ry="14" fill="#06b6d4"/>
  <circle cx="42" cy="48" r="4" fill="#fff"/>
  <circle cx="58" cy="48" r="4" fill="#fff"/>
  <circle cx="42" cy="48" r="2" fill="#164e63"/>
  <circle cx="58" cy="48" r="2" fill="#164e63"/>
  <path d="M18 55L8 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/>
  <path d="M82 55L92 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/>
  <circle cx="8" cy="38" r="5" fill="#ef4444"/>
  <circle cx="92" cy="38" r="5" fill="#ef4444"/>
  <line x1="38" y1="60" x2="62" y2="60" stroke="#0e7490" stroke-width="1.5" stroke-dasharray="3 2"/>
  <circle cx="50" cy="60" r="3" fill="#22d3ee"/>
</svg>`,

voltix:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="28" fill="#0070f3"/>
  <circle cx="50" cy="50" r="22" fill="#00C6FF"/>
  <circle cx="50" cy="50" r="14" fill="#b3e5fc"/>
  <circle cx="44" cy="44" r="3" fill="#fff"/>
  <circle cx="56" cy="44" r="3" fill="#fff"/>
  <circle cx="44" cy="44" r="1.5" fill="#001d3d"/>
  <circle cx="56" cy="44" r="1.5" fill="#001d3d"/>
  <path d="M46 52L50 46L54 52L50 48Z" fill="#f59e0b"/>
  <polygon points="50,6 46,18 50,14 54,18" fill="#f59e0b"/>
  <polygon points="50,94 46,82 50,86 54,82" fill="#f59e0b"/>
  <polygon points="6,50 18,46 14,50 18,54" fill="#f59e0b"/>
  <polygon points="94,50 82,46 86,50 82,54" fill="#f59e0b"/>
</svg>`,

hydron:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="55" rx="24" ry="20" fill="#7c3aed"/>
  <ellipse cx="50" cy="53" rx="18" ry="15" fill="#8b5cf6"/>
  <ellipse cx="50" cy="48" rx="8" ry="5" fill="#c4b5fd"/>
  <circle cx="43" cy="44" r="3" fill="#ede9fe"/>
  <circle cx="57" cy="44" r="3" fill="#ede9fe"/>
  <circle cx="43" cy="44" r="1.5" fill="#2d3436"/>
  <circle cx="57" cy="44" r="1.5" fill="#2d3436"/>
  <path d="M46 50Q50 54 54 50" fill="none" stroke="#2d3436" stroke-width="1.2"/>
  <ellipse cx="75" cy="62" rx="14" ry="5" fill="#6d28d9" transform="rotate(-10 75 62)"/>
  <path d="M30 70Q20 82 35 85Q40 72 30 70Z" fill="#6d28d9"/>
  <circle cx="50" cy="65" r="4" fill="none" stroke="#a78bfa" stroke-width="1.5"/>
  <circle cx="50" cy="65" r="2" fill="#c4b5fd"/>
</svg>`,

photonix:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="50" rx="30" ry="20" fill="#ec4899" opacity=".3"/>
  <polygon points="50,20 30,50 50,45 70,50" fill="#ec4899"/>
  <polygon points="50,80 30,50 50,55 70,50" fill="#db2777"/>
  <polygon points="50,20 40,50 50,42" fill="#f9a8d4" opacity=".6"/>
  <polygon points="50,80 40,50 50,58" fill="#f472b6" opacity=".6"/>
  <circle cx="50" cy="50" r="6" fill="#fce7f3"/>
  <circle cx="48" cy="48" r="1.5" fill="#be185d"/>
  <circle cx="52" cy="48" r="1.5" fill="#be185d"/>
  <path d="M47 52Q50 55 53 52" fill="none" stroke="#be185d" stroke-width="1" stroke-linecap="round"/>
  <circle cx="50" cy="50" r="10" fill="none" stroke="#f9a8d4" stroke-width=".8" stroke-dasharray="2 3" opacity=".5">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>
  </circle>
</svg>`,

wave_dolphin:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="45" cy="55" rx="28" ry="16" fill="#3b82f6"/>
  <path d="M73 55Q85 42 80 55Q88 50 78 58Z" fill="#1d4ed8"/>
  <circle cx="30" cy="50" r="3" fill="#fff"/>
  <circle cx="30" cy="50" r="1.5" fill="#1e3a5f"/>
  <path d="M17 54Q20 58 25 55" fill="none" stroke="#1e3a5f" stroke-width="1.2" stroke-linecap="round"/>
  <path d="M38 60Q45 66 52 60Q59 66 66 60" fill="none" stroke="#93c5fd" stroke-width="1.5" opacity=".5"/>
  <path d="M10 72Q25 65 40 72Q55 79 70 72Q85 65 95 72" fill="none" stroke="#60a5fa" stroke-width="2" opacity=".3"/>
  <path d="M5 80Q20 73 35 80Q50 87 65 80Q80 73 95 80" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity=".2"/>
</svg>`,

quark_sprite:
`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="20" fill="#a855f7" opacity=".4"/>
  <circle cx="50" cy="50" r="14" fill="#00C6FF" opacity=".6"/>
  <circle cx="50" cy="50" r="8" fill="#00df89"/>
  <circle cx="46" cy="47" r="2" fill="#fff"/>
  <circle cx="54" cy="47" r="2" fill="#fff"/>
  <circle cx="46" cy="47" r="1" fill="#0a0e27"/>
  <circle cx="54" cy="47" r="1" fill="#0a0e27"/>
  <path d="M47 53Q50 56 53 53" fill="none" stroke="#0a0e27" stroke-width="1"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#00C6FF" stroke-width="1" stroke-dasharray="4 6" opacity=".3">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite"/>
  </circle>
  <circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="3 8" opacity=".2">
    <animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite"/>
  </circle>
  <circle cx="78" cy="30" r="2" fill="#00C6FF" opacity=".6">
    <animate attributeName="opacity" values=".6;.2;.6" dur="2s" repeatCount="indefinite"/>
  </circle>
  <circle cx="22" cy="70" r="2" fill="#a855f7" opacity=".5">
    <animate attributeName="opacity" values=".5;.2;.5" dur="2.5s" repeatCount="indefinite"/>
  </circle>
</svg>`

};

// ── Creature Passive Bonuses ───────────────────────────
const CREATURE_BONUSES = {
  momentum_fox : { coinsMul     : 0.05  },
  vector_hawk  : { xpMul        : 0.05  },
  gravion      : { bossHpBonus  : 10    },
  thermix      : { doubleChance : 0.10  },
  circuit_crab : { dmgReduce    : 5     },
  voltix       : { startCombo   : 1     },
  hydron       : { critBonus    : 0.05  },
  photonix     : { shieldBonus  : 10    },
  wave_dolphin : { levelXpMul   : 0.10  },
  quark_sprite : { globalMul    : 0.03  }
};

// ── Fallback Questions (used if JSON fails to load) ────
const FALLBACK_QS = [
  { id:'fb_01', world:'motion',   diff:1, q:'What is the SI unit of force?',               opts:['Newton','Joule','Watt','Pascal'],        ans:0, explain:'The Newton (N) = kg·m/s².',         tip:'Force = mass × acceleration', formula:'F = ma' },
  { id:'fb_02', world:'motion',   diff:1, q:'Which law states "every action has an equal and opposite reaction"?', opts:['1st Law','2nd Law','3rd Law','Law of Gravitation'], ans:2, explain:"Newton's Third Law.", tip:'Think of a rocket pushing gas down while being pushed up.' },
  { id:'fb_03', world:'motion',   diff:2, q:'A car accelerates at 2 m/s². What speed does it reach after 5 s from rest?', opts:['5 m/s','7 m/s','10 m/s','12 m/s'], ans:2, explain:'v = u + at = 0 + 2×5 = 10 m/s.', formula:'v = u + at' },
  { id:'fb_04', world:'motion',   diff:1, q:'Speed is a ______ quantity.', opts:['Vector','Scalar','Tensor','Complex'], ans:1, explain:'Speed has magnitude only; velocity has direction too.' },
  { id:'fb_05', world:'motion',   diff:2, q:'An object at rest stays at rest unless acted upon by a force. This is Newton\'s ___ Law.', opts:['1st','2nd','3rd','Zeroth'], ans:0, explain:"Newton's First Law (Law of Inertia)." },
  { id:'fb_06', world:'energy',   diff:1, q:'The SI unit of energy is the:', opts:['Newton','Joule','Watt','Calorie'], ans:1, explain:'Energy is measured in Joules (J).' },
  { id:'fb_07', world:'energy',   diff:2, q:'Kinetic energy depends on:', opts:['Mass only','Velocity only','Mass and velocity','Height'], ans:2, explain:'KE = ½mv² — both mass and velocity matter.', formula:'KE = ½mv²' },
  { id:'fb_08', world:'energy',   diff:1, q:'A raised object has what type of energy?', opts:['Kinetic','Potential','Thermal','Nuclear'], ans:1, explain:'Gravitational potential energy due to its position.' },
  { id:'fb_09', world:'electricity', diff:1, q:'What is the SI unit of electric current?', opts:['Volt','Ampere','Ohm','Coulomb'], ans:1, explain:'Current is measured in Amperes (A).' },
  { id:'fb_10', world:'electricity', diff:2, q:'Ohm\'s Law relates voltage, current, and:', opts:['Power','Resistance','Capacitance','Inductance'], ans:1, explain:'V = IR', formula:'V = IR' },
  { id:'fb_11', world:'waves',    diff:1, q:'Sound cannot travel through:', opts:['Air','Water','Steel','Vacuum'], ans:3, explain:'Sound needs a medium; it cannot propagate in a vacuum.' },
  { id:'fb_12', world:'waves',    diff:2, q:'The frequency of a wave is measured in:', opts:['Meters','Seconds','Hertz','Decibels'], ans:2, explain:'Frequency is in Hertz (Hz) = cycles per second.' }
];


// ══════════════════════════════════════════
//  AUDIO ENGINE (Web Audio API — no files)
// ══════════════════════════════════════════
class AudioEngine {
  constructor() {
    this.ctx   = null;
    this.muted = false;
    this.vol   = 0.4;
  }

  init() {
    try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (_) { /* silent fallback */ }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  _tone(freq, dur, type, vol) {
    if (this.muted || !this.ctx) return;
    this.resume();
    const o = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    const v = (vol ?? this.vol) * 0.3;
    g.gain.setValueAtTime(v, this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
    o.connect(g).connect(this.ctx.destination);
    o.start();
    o.stop(this.ctx.currentTime + dur);
  }

  correct()      { this._tone(523,.08); setTimeout(()=>this._tone(659,.08),80);  setTimeout(()=>this._tone(784,.15),160); }
  wrong()        { this._tone(220,.15,'sawtooth',.2); setTimeout(()=>this._tone(180,.2,'sawtooth',.15),100); }
  coin()         { this._tone(1200,.06); setTimeout(()=>this._tone(1600,.1),60); }
  click()        { this._tone(800,.04,'sine',.15); }
  victory()      { this._tone(523,.1); setTimeout(()=>this._tone(659,.1),100); setTimeout(()=>this._tone(784,.1),200); setTimeout(()=>this._tone(1047,.25),300); }
  levelUp()      { this._tone(440,.1,'triangle'); setTimeout(()=>this._tone(554,.1,'triangle'),80); setTimeout(()=>this._tone(659,.1,'triangle'),160); setTimeout(()=>this._tone(880,.3,'triangle'),240); }
  bossHit()      { this._tone(150,.12,'square',.2); setTimeout(()=>this._tone(100,.15,'sawtooth',.15),80); }
  playerHit()    { this._tone(200,.1,'sawtooth',.2); setTimeout(()=>this._tone(150,.15,'square',.15),80); }
  creature()     { this._tone(600,.1); setTimeout(()=>this._tone(800,.1),100); setTimeout(()=>this._tone(1000,.15),200); setTimeout(()=>this._tone(1200,.2),300); }
  combo(level)   { this._tone(400 + level * 80, .06); setTimeout(()=>this._tone(600 + level * 100, .1), 60); }
  critical()     { this._tone(900,.08); setTimeout(()=>this._tone(1200,.06),50); setTimeout(()=>this._tone(1500,.12),100); }
  daily()        { this._tone(523,.12); setTimeout(()=>this._tone(784,.15,'triangle'),120); }

  setMuted(v) { this.muted = v; }
  setVolume(v) { this.vol = v; }
}


// ══════════════════════════════════════════
//  SAVE MANAGER (localStorage + IndexedDB)
// ══════════════════════════════════════════
class SaveManager {
  constructor() { this.db = null; }

  init() {
    return new Promise(resolve => {
      if (!window.indexedDB) { resolve(); return; }
      const req = indexedDB.open(CFG.DB_NAME, 1);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        if (!d.objectStoreNames.contains(CFG.DB_STORE))
          d.createObjectStore(CFG.DB_STORE);
      };
      req.onsuccess = e => { this.db = e.target.result; resolve(); };
      req.onerror   = () => resolve();
    });
  }

  save(data) {
    try { localStorage.setItem(CFG.SAVE_KEY, JSON.stringify(data)); } catch (_) {}
    if (!this.db) return Promise.resolve();
    return new Promise(resolve => {
      try {
        const tx = this.db.transaction(CFG.DB_STORE, 'readwrite');   // ← fixed: was 'self.db'
        tx.objectStore(CFG.DB_STORE).put(data, 'save');
        tx.oncomplete = resolve;
        tx.onerror    = resolve;
      } catch (_) { resolve(); }
    });
  }

  load() {
    return new Promise(resolve => {
      if (!this.db) { resolve(this._fromLS()); return; }
      try {
        const tx = this.db.transaction(CFG.DB_STORE, 'readonly');     // ← fixed: was 'self.db'
        const r  = tx.objectStore(CFG.DB_STORE).get('save');
        r.onsuccess = () => resolve(r.result || this._fromLS());
        r.onerror   = () => resolve(this._fromLS());
      } catch (_) { resolve(this._fromLS()); }
    });
  }

  _fromLS() {
    try { const s = localStorage.getItem(CFG.SAVE_KEY); return s ? JSON.parse(s) : null; }
    catch (_) { return null; }
  }
}


// ══════════════════════════════════════════
//  MEMORY ENGINE (SM-2 Spaced Repetition)
// ══════════════════════════════════════════
class MemoryEngine {
  constructor() { this.schedule = {}; }

  add(qid) {
    if (!this.schedule[qid])
      this.schedule[qid] = { interval: 1, ef: 2.5, next: Date.now() + 86400000, rep: 0 };
  }

  record(qid, correct) {
    const s = this.schedule[qid];
    if (!s) return;
    if (correct) {
      s.rep++;
      s.interval = s.rep === 1 ? 1 : s.rep === 2 ? 3 : Math.round(s.interval * s.ef);
      s.ef = Math.max(1.3, s.ef + 0.1);
    } else {
      s.rep = 0; s.interval = 1; s.ef = Math.max(1.3, s.ef - 0.2);
    }
    s.next = Date.now() + s.interval * 86400000;
  }

  getDue() {
    const now = Date.now();
    return Object.keys(this.schedule).filter(id => this.schedule[id].next <= now);
  }

  getData() {
    const c = {};
    for (const k in this.schedule) c[k] = { ...this.schedule[k] };
    return c;
  }

  load(d) { if (d) this.schedule = d; }
}


// ══════════════════════════════════════════
//  QUESTION POOL
// ══════════════════════════════════════════
class QuestionPool {
  constructor() { this.all = []; this.used = {}; }

  async load() {
    try {
      const r = await fetch(CFG.DATA_DIR + 'questions.json');
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const d = await r.json();
      this.all = d.questions || [];
    } catch (e) {
      console.warn('[PhysicsQuest] JSON load failed, using fallback questions.', e);
      this.all = FALLBACK_QS.slice();
    }
  }

  get(worldId, count) {
    let pool = this.all.filter(q => q.world === worldId && !this.used[q.id]);
    if (pool.length < count) {
      // Reset used for this world
      this.all.forEach(q => { if (q.world === worldId) delete this.used[q.id]; });
      pool = this.all.filter(q => q.world === worldId);
    }
    if (pool.length === 0) pool = FALLBACK_QS.filter(q => q.world === worldId);
    const picked = shuffle(pool).slice(0, count);
    picked.forEach(q => { this.used[q.id] = true; });
    return picked;
  }

  getById(id) { return this.all.find(q => q.id === id) || null; }
  reset()     { this.used = {}; }
}


// ══════════════════════════════════════════
//  EFFECTS ENGINE (Particles + Shake + Popups)
// ══════════════════════════════════════════
class EffectsEngine {
  constructor() {
    this.layer = document.createElement('div');
    this.layer.className = 'pq-fx-layer';
    this.layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:hidden;';
    document.body.appendChild(this.layer);
  }

  particles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'pq-particle';
      const size = 4 + Math.random() * 5;
      Object.assign(p.style, {
        position: 'absolute', left: x + 'px', top: y + 'px',
        width: size + 'px', height: size + 'px',
        borderRadius: '50%', background: color, opacity: '1',
        '--dx': ((Math.random() - 0.5) * 160) + 'px',
        '--dy': ((Math.random() - 0.5) * 160 - 40) + 'px',
        '--dur': (0.35 + Math.random() * 0.45) + 's',
        animation: `pq-p-fly var(--dur) ease-out forwards`
      });
      this.layer.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  }

  floatText(x, y, text, color) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'absolute', left: x + 'px', top: y + 'px',
      color, fontWeight: '800', fontSize: '1.1rem',
      pointerEvents: 'none', textShadow: '0 2px 4px rgba(0,0,0,.5)',
      animation: 'pq-f-up 1.3s ease-out forwards', whiteSpace: 'nowrap'
    });
    el.textContent = text;
    this.layer.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }

  shake(el) {
    if (!el) return;
    el.classList.add('pq-shaking');
    setTimeout(() => el.classList.remove('pq-shaking'), 350);
  }

  comboPopup(combo) {
    const el = document.createElement('div');
    Object.assign(el.style, {
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%,-50%) scale(.5)',
      fontFamily: 'var(--pq-head,sans-serif)', fontSize: '2.4rem',
      fontWeight: '900', color: '#f5c842', textShadow: '0 0 24px rgba(245,200,66,.6)',
      pointerEvents: 'none', zIndex: '10001',
      animation: 'pq-combo-pop .7s ease-out forwards'
    });
    el.textContent = combo + 'x COMBO!';
    this.layer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }

  showAchievement(ach) {
    let popup = document.getElementById('pq-ach-popup');
    if (!popup) {
      popup = document.createElement('div');
      popup.id = 'pq-ach-popup';
      popup.style.cssText = `
        position:fixed;top:20px;left:50%;transform:translateX(-50%) translateY(-120px);
        background:linear-gradient(135deg,#1a1a2e,#16213e);border:2px solid #f5c842;
        border-radius:12px;padding:16px 28px;z-index:10002;text-align:center;
        box-shadow:0 8px 32px rgba(245,200,66,.3);
        transition:transform .55s cubic-bezier(.34,1.56,.64,1);
        font-family:var(--pq-body,sans-serif);`;
      document.body.appendChild(popup);
    }
    popup.innerHTML = `<div style="font-size:2rem;margin-bottom:4px">${ach.icon}</div>` +
      `<div style="font-weight:700;color:#f5c842;font-size:1rem;font-family:var(--pq-head,sans-serif)">${ach.name}</div>` +
      `<div style="font-size:.75rem;color:#999;margin-top:2px">${ach.desc}</div>`;
    requestAnimationFrame(() => { popup.style.transform = 'translateX(-50%) translateY(0)'; });
    clearTimeout(this._achTimer);
    this._achTimer = setTimeout(() => { popup.style.transform = 'translateX(-50%) translateY(-120px)'; }, 4200);
  }

  destroy() { this.layer.remove(); }
}


// ══════════════════════════════════════════
//  ACHIEVEMENTS
// ══════════════════════════════════════════
const ACHIEVEMENTS = [
  { id:'first_correct', name:'First Light',       desc:'Answer your first question correctly', icon:'\u{1F4A1}',  check: p => p.stats.correct >= 1 },
  { id:'streak_5',      name:'Hot Streak',         desc:'Get 5 correct answers in a row',       icon:'\u{1F525}',  check: p => p.streak >= 5 },
  { id:'streak_10',     name:'Unstoppable',        desc:'10 correct in a row',                  icon:'\u26A1',     check: p => p.streak >= 10 },
  { id:'correct_50',    name:'Half Century',        desc:'50 correct answers total',             icon:'\u{1F3AF}',  check: p => p.stats.correct >= 50 },
  { id:'correct_100',   name:'Centurion',           desc:'100 correct answers total',            icon:'\u{1F4AF}',  check: p => p.stats.correct >= 100 },
  { id:'world_1',       name:'Motion Master',       desc:'Complete Motion Valley',               icon:'\u{1F3C3}',  check: p => (p.worldsCompleted||[]).includes('motion') },
  { id:'boss_1',        name:'Newton Defeated',     desc:'Defeat Sir Isaac Newton',              icon:'\u{1F34E}',  check: p => (p.bossesDefeated||[]).includes('motion') },
  { id:'creature_3',    name:'Collector',           desc:'Collect 3 Physics Spirits',            icon:'\u{1F9EC}',  check: p => (p.creatures||[]).length >= 3 },
  { id:'creature_all',  name:'Spirit Master',       desc:'Collect all Physics Spirits',          icon:'\u{1F451}',  check: p => (p.creatures||[]).length >= 11 },
  { id:'level_5',       name:'Rising Star',         desc:'Reach Player Level 5',                 icon:'\u2B50',     check: p => p.level >= 5 },
  { id:'coins_500',     name:'Wealthy Scientist',   desc:'Accumulate 500 coins',                 icon:'\u{1F4B0}',  check: p => p.coins >= 500 },
  { id:'perfect_level', name:'Flawless',            desc:'Complete a level with 100% accuracy',  icon:'\u{1F48E}',  check: p => p.stats.perfectLevels >= 1 },
  { id:'combo_5',       name:'Combo Master',        desc:'Reach a 5× combo in a boss battle',    icon:'\u{1F525}',  check: p => (p.stats.bestCombo||0) >= 5 }
];


// ══════════════════════════════════════════════════════
//  MAIN GAME CLASS
// ══════════════════════════════════════════════════════
class PhysicsQuest {

  constructor(root) {
    this.root          = root;
    this.audio         = new AudioEngine();
    this.save          = new SaveManager();
    this.memory        = new MemoryEngine();
    this.questions     = new QuestionPool();
    this.fx            = null;   // created after DOM ready

    this.player        = null;
    this.worldData     = null;
    this.creaturesData = null;
    this.gadgetsData   = null;

    this.state         = 'title';
    this.currentWorld  = null;
    this.currentLevel  = null;
    this.levelQs       = [];
    this.qIdx          = 0;
    this.levelCorrect  = 0;

    this.battleState   = null;
    this._animating    = false;
    this._achTimer     = null;
  }

  // ── Initialization ──
  async init() {
    await this.save.init();
    await this._loadData();
    await this.questions.load();

    const saved = await this.save.load();
    if (saved && saved.player) {
      this.player = this._migratePlayer(saved.player);
      this.memory.load(saved.memory || {});
    } else {
      this.player = this._defaultPlayer();
    }

    this.audio.init();
    this.audio.setMuted(!this.player.settings.sfx);
    this.audio.setVolume(this.player.settings.vol);

    this._injectStyles();
    this._buildShell();
    this.fx = new EffectsEngine();

    this._checkDailyLogin();
    this._render();
  }

  async _loadData() {
    try {
      const [levelsRes, creaturesRes, gadgetsRes] = await Promise.all([
        fetch(CFG.DATA_DIR + 'levels.json').then(r => r.json()),
        fetch(CFG.DATA_DIR + 'creatures.json').then(r => r.json()),
        fetch(CFG.DATA_DIR + 'gadgets.json').then(r => r.json())
      ]);
      this.worldData     = levelsRes.worlds || [];
      this.creaturesData = creaturesRes.creatures || [];
      this.gadgetsData   = gadgetsRes.gadgets || [];
    } catch (e) {
      console.error('[PhysicsQuest] Data load failed:', e);
      this.worldData = []; this.creaturesData = []; this.gadgetsData = [];
    }
  }

  // ── Inject effects CSS ──
  _injectStyles() {
    if (document.getElementById('pq-fx-styles')) return;
    const s = document.createElement('style');
    s.id = 'pq-fx-styles';
    s.textContent = `
      @keyframes pq-p-fly {
        0%   { transform: translate(0,0) scale(1); opacity:1; }
        100% { transform: translate(var(--dx),var(--dy)) scale(0); opacity:0; }
      }
      @keyframes pq-f-up {
        0%   { opacity:1; transform:translateY(0); }
        100% { opacity:0; transform:translateY(-90px); }
      }
      @keyframes pq-combo-pop {
        0%   { opacity:0; transform:translate(-50%,-50%) scale(.3); }
        40%  { opacity:1; transform:translate(-50%,-50%) scale(1.25); }
        70%  { transform:translate(-50%,-50%) scale(.95); }
        100% { opacity:0; transform:translate(-50%,-50%) scale(1.1) translateY(-30px); }
      }
      @keyframes pq-shake {
        0%,100% { transform:translate(0); }
        15%     { transform:translate(-5px,3px); }
        30%     { transform:translate(5px,-3px); }
        45%     { transform:translate(-3px,5px); }
        60%     { transform:translate(3px,-5px); }
        75%     { transform:translate(-2px,2px); }
      }
      .pq-shaking { animation: pq-shake .35s ease-in-out; }

      /* Combo bar in battle */
      .pq-combo-bar {
        display:flex;align-items:center;gap:8px;justify-content:center;
        margin:6px 0;font-family:var(--pq-head,sans-serif);
      }
      .pq-combo-bar .combo-label { color:#f5c842;font-weight:800;font-size:1.1rem; }
      .pq-combo-bar .combo-pips  { display:flex;gap:3px; }
      .pq-combo-bar .combo-pip {
        width:10px;height:10px;border-radius:50%;
        background:rgba(245,200,66,.15);border:1.5px solid rgba(245,200,66,.3);
        transition:all .2s;
      }
      .pq-combo-bar .combo-pip.active { background:#f5c842;border-color:#f5c842; box-shadow:0 0 6px rgba(245,200,66,.6); }

      /* Boss phase badge */
      .pq-boss-phase {
        display:inline-block;padding:2px 10px;border-radius:20px;
        font-size:.65rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;
        margin-bottom:4px;
      }
      .pq-boss-phase.normal  { background:rgba(100,100,100,.2); color:#aaa; }
      .pq-boss-phase.enraged { background:rgba(239,68,68,.15); color:#ef4444; }
      .pq-boss-phase.desperate { background:rgba(168,85,247,.15); color:#a855f7; }

      /* Crit flash */
      .pq-crit-flash {
        position:fixed;inset:0;background:rgba(245,200,66,.08);
        pointer-events:none;z-index:9999;
        animation:pq-crit-f .4s ease-out forwards;
      }
      @keyframes pq-crit-f { 0%{opacity:1} 100%{opacity:0} }

      /* Daily banner */
      .pq-daily-banner {
        background:linear-gradient(135deg,rgba(245,200,66,.12),rgba(0,198,255,.08));
        border:1px solid rgba(245,200,66,.25);border-radius:10px;
        padding:14px 20px;margin-bottom:16px;text-align:center;
      }
      .pq-daily-banner h3 { color:#f5c842;margin:0 0 4px;font-family:var(--pq-head,sans-serif); }
      .pq-daily-banner p  { margin:0;font-size:.8rem;color:var(--pq-sec,#888); }
    `;
    document.head.appendChild(s);
  }

  // ── Default / migration ──
  _defaultPlayer() {
    return {
      name: 'Scientist', xp: 0, level: 1, coins: 100, hp: CFG.PLAYER_HP,
      streak: 0, bestStreak: 0,
      stats: { correct:0, wrong:0, played:0, perfectLevels:0, totalLevels:0, bestCombo:0 },
      worldsUnlocked: ['motion'], worldsCompleted: [], levelsCompleted: {},
      levelStars: {}, bossesDefeated: [], creatures: [],
      gadgets: {
        jet_boots:2, gravity_belt:1, photon_shield:0, laser_compass:1,
        rocket_pack:0, quantum_scanner:0, magnetic_gloves:0,
        electric_hammer:0, time_stabilizer:0
      },
      achievements: [],
      settings: { sfx:true, music:false, vol:0.4 },
      dailyStreak: 0, lastLogin: null
    };
  }

  _migratePlayer(p) {
    const d = this._defaultPlayer();
    // Shallow merge top-level
    const out = { ...d, ...p };
    // Nested: settings
    out.settings = { ...d.settings, ...(p.settings || {}) };
    // Nested: stats
    out.stats = { ...d.stats, ...(p.stats || {}) };
    // Nested: gadgets
    out.gadgets = { ...d.gadgets, ...(p.gadgets || {}) };
    // Ensure arrays
    ['worldsUnlocked','worldsCompleted','bossesDefeated','creatures','achievements'].forEach(k => {
      if (!Array.isArray(out[k])) out[k] = d[k];
    });
    if (typeof out.levelsCompleted !== 'object' || !out.levelsCompleted) out.levelsCompleted = {};
    if (typeof out.levelStars !== 'object' || !out.levelStars) out.levelStars = {};
    return out;
  }

  _save() {
    this.save.save({ player: this.player, memory: this.memory.getData(), ver: CFG.VERSION });
  }

  // ── Daily Login ──
  _checkDailyLogin() {
    const p = this.player;
    const now = new Date();
    const today = now.toISOString().slice(0, 10);     // YYYY-MM-DD
    if (p.lastLogin === today) return;                  // already claimed
    const yesterday = new Date(now.getTime() - 86400000).toISOString().slice(0, 10);
    if (p.lastLogin === yesterday) {
      p.dailyStreak = (p.dailyStreak || 0) + 1;
    } else {
      p.dailyStreak = 1;
    }
    p.lastLogin = today;
    const bonusCoins = CFG.DAILY_COINS + p.dailyStreak * 5;
    const bonusXp    = CFG.DAILY_XP    + p.dailyStreak * 3;
    p.coins += bonusCoins;
    p.xp    += bonusXp;
    this._dailyBonus = { coins: bonusCoins, xp: bonusXp, streak: p.dailyStreak };
    this.audio.daily();
    this._save();
  }

  // ── Build DOM shell ──
  _buildShell() {
    this.root.innerHTML = `
      <div class="pq-wrap">
        <div class="pq-hud" id="pq-hud"></div>
        <div class="pq-content" id="pq-content"></div>
        <div class="pq-toasts" id="pq-toasts"></div>
      </div>`;
    this.hud      = this.root.querySelector('#pq-hud');
    this.content  = this.root.querySelector('#pq-content');
    this.toastsEl = this.root.querySelector('#pq-toasts');

    const handler = e => this._handleClick(e);
    this.content.addEventListener('click', handler);
    this.hud.addEventListener('click', handler);
    this.toastsEl.addEventListener('click', handler);
  }

  // ── Event delegation ──
  _handleClick(e) {
    const t = e.target.closest('[data-a]');
    if (!t || this._animating) return;
    this.audio.click();
    const action = t.dataset.a, d = t.dataset;

    switch (action) {
      case 'new-game':         this._startNew(); break;
      case 'continue':         this._setState('worldmap'); break;
      case 'enter-world':      this._enterWorld(d.world); break;
      case 'enter-level':      this._enterLevel(d.level); break;
      case 'start-level':      this._startLevel(); break;
      case 'answer':           this._handleAnswer(+d.idx, e); break;
      case 'next-q':           this._nextQuestion(); break;
      case 'back-worlds':      this._setState('worldmap'); break;
      case 'back-levels':      this._enterWorld(this.currentWorld?.id); break;
      case 'collection':       this._setState('collection'); break;
      case 'shop':             this._setState('shop'); break;
      case 'buy-gadget':       this._buyGadget(d.gadget); break;
      case 'use-gadget':       this._useGadget(d.gadget); break;
      case 'settings':         this._setState('settings'); break;
      case 'toggle-sfx':       this._toggleSfx(); break;
      case 'vol-change':       this.player.settings.vol = +t.value; this.audio.setVolume(+t.value); this._save(); break;
      case 'start-battle':     this._startBattle(); break;
      case 'battle-answer':    this._battleAnswer(+d.idx, e); break;
      case 'battle-next':      this._battleNextQ(); break;
      case 'results-continue': this._setState('worldmap'); break;
      case 'close':            this._close(); break;
      case 'achievements':     this._setState('achievements'); break;
    }
  }

  // ── State machine ──
  _setState(s, data) { this.state = s; this._renderState(data || {}); }

  _render() { this._renderHUD(); this._renderState({}); }

  _renderHUD() {
    const p = this.player;
    if (!p) return;
    const show = this.state !== 'title';
    this.hud.style.display = show ? 'flex' : 'none';
    if (!show) return;

    this.hud.innerHTML = `
      <div class="pq-hud-left">
        <button class="pq-hud-btn" data-a="back-worlds" title="World Map">\u{1F5FA}\uFE0F</button>
        <span class="pq-level-badge">Lv ${p.level}</span>
      </div>
      <div class="pq-hud-center">${this._stateTitle()}</div>
      <div class="pq-hud-right">
        <span class="pq-xp-badge">\u26A1 ${p.xp} XP</span>
        <span class="pq-coin-badge">\u{1FA99} ${p.coins}</span>
        <button class="pq-hud-btn" data-a="collection" title="Collection">\u{1F4E6}</button>
        <button class="pq-hud-btn" data-a="shop" title="Gadget Shop">\u{1F6D2}</button>
        <button class="pq-hud-btn" data-a="achievements" title="Achievements">\u{1F3C6}</button>
        <button class="pq-hud-btn" data-a="settings" title="Settings">\u2699\uFE0F</button>
        <button class="pq-hud-btn" data-a="close" title="Exit Game">\u2715</button>
      </div>`;
  }

  _stateTitle() {
    return { title:'Physics Quest', worldmap:'World Map', levelselect:'Level Select',
             gameplay:'Mission', battle:'Boss Battle', results:'Results',
             collection:'Collection', shop:'Gadget Shop', settings:'Settings',
             achievements:'Achievements' }[this.state] || '';
  }

  _renderState(data) {
    this._renderHUD();
    const fn = { title:'_rTitle', worldmap:'_rWorldMap', levelselect:'_rLevelSelect',
                 gameplay:'_rGameplay', battle:'_rBattle', results:'_rResults',
                 collection:'_rCollection', shop:'_rShop', settings:'_rSettings',
                 achievements:'_rAchievements' }[this.state];
    this.content.innerHTML = fn ? this[fn](data) : '';
    this.content.scrollTop = 0;
  }


  // ══════════════════════
  //  TITLE SCREEN
  // ══════════════════════
  _rTitle() {
    const hasSave = this.player && this.player.stats.played > 0;
    const daily   = this._dailyBonus;
    let dailyHTML = '';
    if (daily) {
      dailyHTML = `
        <div class="pq-daily-banner">
          <h3>\u{1F381} Daily Login — Day ${daily.streak}!</h3>
          <p>+${daily.xp} XP \u00B7 +${daily.coins} Coins${daily.streak >= 3 ? ' \u00B7 Streak bonus!' : ''}</p>
        </div>`;
    }

    return `
    <div class="pq-title">
      <div class="pq-title-atom">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00C6FF" stroke-width="2" opacity=".5">
            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#a855f7" stroke-width="2" opacity=".5" transform="rotate(60 100 100)">
            <animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/>
          </ellipse>
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00df89" stroke-width="2" opacity=".5" transform="rotate(120 100 100)">
            <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/>
          </ellipse>
          <circle cx="100" cy="100" r="18" fill="#00C6FF"/>
          <circle cx="100" cy="100" r="10" fill="#060810"/>
          <circle cx="100" cy="100" r="5" fill="#00df89"/>
          <circle cx="175" cy="100" r="5" fill="#00C6FF">
            <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/>
          </circle>
          <circle cx="145" cy="50" r="4" fill="#a855f7">
            <animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/>
          </circle>
          <circle cx="55" cy="150" r="4" fill="#00df89">
            <animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      ${dailyHTML}
      <h1>Physics Quest</h1>
      <p class="pq-tagline">Academy of Forces<br>Learn Physics. Play Adventures. Master Concepts.</p>
      <div class="pq-title-buttons">
        ${hasSave ? '<button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="continue">Continue Adventure</button>' : ''}
        <button class="pq-btn ${hasSave ? 'pq-btn-secondary' : 'pq-btn-primary pq-btn-lg pq-btn-glow'}" data-a="new-game">${hasSave ? 'New Game' : 'Start Adventure'}</button>
        <button class="pq-btn pq-btn-ghost" data-a="collection">Physics Spirit Collection</button>
      </div>
      <span class="pq-title-version">v${CFG.VERSION} \u00B7 Prime Spirit Mentors</span>
    </div>`;
  }

  _startNew() {
    this.player = this._defaultPlayer();
    this.memory.schedule = {};
    this.questions.reset();
    this._dailyBonus = null;
    this._save();
    this._setState('worldmap');
  }


  // ══════════════════════
  //  WORLD MAP
  // ══════════════════════
  _rWorldMap() {
    const p = this.player;
    const cards = (this.worldData || []).map(w => {
      const unlocked = p.worldsUnlocked.includes(w.id);
      const completed = p.worldsCompleted.includes(w.id);
      const doneLevels = (p.levelsCompleted[w.id] || []).length;
      const total = w.levels.length;
      const percent = pct(doneLevels, total);

      return `
      <div class="pq-world-card ${unlocked ? '' : 'locked'}"
           ${unlocked ? `data-a="enter-world" data-world="${w.id}"` : ''}
           style="--wcolor:${w.color}">
        <span class="pq-world-badge">${completed ? '\u2713 DONE' : percent + '%'}</span>
        <div class="pq-world-icon">${w.icon}</div>
        <h3>${w.name}</h3>
        <p>${w.desc}</p>
        <div class="pq-world-progress">
          <div class="pq-world-progress-fill" style="width:${percent}%;background:${w.color}"></div>
        </div>
        ${unlocked ? '' : '<p style="font-size:.7rem;color:var(--pq-muted);margin-top:8px">\u{1F512} Complete previous world to unlock</p>'}
      </div>`;
    }).join('');

    return `
    <div class="pq-section-head">
      <h2>The Universe Awaits</h2>
      <p>Each world holds the key to a Physics law stolen by Chaos. Restore them all.</p>
    </div>
    <div class="pq-worlds">${cards}</div>`;
  }

  _enterWorld(worldId) {
    if (!worldId) return;
    this.currentWorld = (this.worldData || []).find(w => w.id === worldId) || null;
    if (this.currentWorld) this._setState('levelselect');
  }


  // ══════════════════════
  //  LEVEL SELECT
  // ══════════════════════
  _rLevelSelect() {
    const w = this.currentWorld;
    if (!w) return '';
    const p = this.player;
    const done = p.levelsCompleted[w.id] || [];

    const items = w.levels.map((l, i) => {
      const isDone = done.includes(l.id);
      const prev   = i === 0 || done.includes(w.levels[i - 1].id);
      const locked = !prev && !isDone;
      const stars  = p.levelStars[l.id] || 0;
      const starsH = Array.from({ length: 3 }, (_, s) => s < stars ? '\u2605' : '\u2606').join('');

      return `
      <div class="pq-level-item ${locked ? 'locked' : ''}"
           ${locked ? '' : `data-a="enter-level" data-level="${l.id}"`}>
        <div class="pq-level-num ${isDone ? 'done' : locked ? 'locked-n' : 'active'}">
          ${isDone ? '\u2713' : i + 1}
        </div>
        <div class="pq-level-info">
          <h4>${l.name}</h4>
          <span>\u26A1${l.xp} XP \u00B7 \u{1FA99}${l.coins} coins \u00B7 ${l.count} questions</span>
        </div>
        <div class="pq-level-stars">${starsH}</div>
      </div>`;
    }).join('');

    const bossDone = p.bossesDefeated.includes(w.id);
    const allDone  = done.length >= w.levels.length;

    return `
    <div class="pq-levels">
      <button class="pq-btn pq-btn-ghost pq-btn-sm pq-mb-2" data-a="back-worlds">\u2190 Back to Worlds</button>
      <h2 style="color:${w.color}">${w.icon} ${w.name}</h2>
      <p class="pq-sub">${w.desc}</p>
      ${items}
      ${allDone && !bossDone
        ? `<button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-block pq-boss-btn" data-a="start-battle">\u2694\uFE0F Challenge Boss: ${w.boss.name}</button>`
        : ''}
      ${bossDone
        ? '<div class="pq-card pq-text-center pq-mt-2" style="color:var(--pq-green)">\u{1F3C6} Boss Defeated! World Complete!</div>'
        : ''}
    </div>`;
  }

  _enterLevel(levelId) {
    if (!this.currentWorld || !levelId) return;
    this.currentLevel = this.currentWorld.levels.find(l => l.id === levelId) || null;
    if (this.currentLevel) this._setState('gameplay');
  }


  // ══════════════════════
  //  GAMEPLAY / QUESTIONS
  // ══════════════════════
  _startLevel() {
    const l = this.currentLevel;
    if (!l) return;
    this.levelQs     = this.questions.get(this.currentWorld.id, l.count);
    this.qIdx        = 0;
    this.levelCorrect = 0;
    this.player.hp   = CFG.PLAYER_HP;
    console.log(`[PhysicsQuest] Level "${l.name}" — ${this.levelQs.length} questions`);
    this._setState('gameplay');
  }

  _rGameplay() {
    const l = this.currentLevel;
    if (!l) return this._rLevelIntro();
    if (!this.levelQs?.length || this.qIdx >= this.levelQs.length) return this._rLevelIntro();

    const q    = this.levelQs[this.qIdx];
    if (!q) return this._rLevelIntro();
    const pctQ = pct(this.qIdx, this.levelQs.length);
    const letters = ['A','B','C','D'];

    const opts = q.opts.map((o, i) => `
      <div class="pq-option" data-a="answer" data-idx="${i}">
        <span class="pq-option-letter">${letters[i]}</span>
        <span>${o}</span>
      </div>`).join('');

    const diffStars = Array.from({ length: 3 }, (_, s) => s < q.diff ? '\u2605' : '\u2606').join('');

    return `
    <div class="pq-play">
      <div class="pq-progress-wrap">
        <div class="pq-progress-label">
          <span>Question ${this.qIdx + 1} of ${this.levelQs.length}</span>
          <span>${this.levelCorrect} correct</span>
        </div>
        <div class="pq-progress-bar"><div class="pq-progress-fill" style="width:${pctQ}%"></div></div>
      </div>
      <div class="pq-question-card">
        <div class="pq-q-num">DIFFICULTY ${diffStars}</div>
        <p class="pq-q-text">${q.q}</p>
        ${q.formula ? `<div class="pq-q-formula">${q.formula}</div>` : ''}
      </div>
      <div class="pq-options" id="pq-options">${opts}</div>
      <div id="pq-feedback-area"></div>
    </div>`;
  }

  _rLevelIntro() {
    const l = this.currentLevel, w = this.currentWorld;
    if (!l || !w) return '';
    return `
    <div class="pq-results">
      <div class="pq-results-icon">${w.icon}</div>
      <h2>${l.name}</h2>
      <p class="pq-sub">${w.name} \u00B7 ${l.count} Questions \u00B7 \u26A1${l.xp} XP \u00B7 \u{1FA99}${l.coins} Coins</p>
      <p class="pq-mb-2" style="font-size:.85rem;color:var(--pq-sec)">Answer all questions to earn XP, coins, and level stars. Get 90%+ for 3 stars!</p>
      <div class="pq-results-buttons">
        <button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="start-level">Begin Mission</button>
        <button class="pq-btn pq-btn-ghost" data-a="back-levels">\u2190 Back</button>
      </div>
    </div>`;
  }

  _handleAnswer(idx, event) {
    const q = this.levelQs[this.qIdx];
    if (!q) return;
    const correct = idx === q.ans;
    const opts    = this.content.querySelectorAll('.pq-option');

    opts.forEach((o, i) => {
      o.classList.add('disabled');
      if (i === q.ans) o.classList.add('correct');
      if (i === idx && !correct) o.classList.add('wrong');
    });

    const p = this.player;
    p.stats.played++;

    // ── Creature bonus: XP & coin multipliers ──
    const bonuses   = this._getCreatureBonuses();
    const xpGain    = Math.round(CFG.XP_PER_CORRECT * (1 + (bonuses.xpMul || 0)));
    const coinGain  = Math.round(CFG.COIN_PER_CORRECT * (1 + (bonuses.coinsMul || 0)));

    if (correct) {
      p.stats.correct++;
      this.levelCorrect++;
      p.streak++;
      if (p.streak > p.bestStreak) p.bestStreak = p.streak;
      p.xp    += xpGain;
      p.coins += coinGain;
      this.audio.correct();

      // Particle burst at click position
      if (event) {
        const rect = (event.currentTarget || event.target).getBoundingClientRect?.();
        const cx = event.clientX || (rect ? rect.left + rect.width / 2 : window.innerWidth / 2);
        const cy = event.clientY || (rect ? rect.top + rect.height / 2 : window.innerHeight / 2);
        this.fx.particles(cx, cy, 12, '#00df89');
        this.fx.floatText(cx, cy - 20, `+${xpGain} XP`, '#00df89');
      }
      this._toast(`+${xpGain} XP`, 'xp');
      this._toast(`+${coinGain} Coins`, 'coin');
    } else {
      p.stats.wrong++;
      p.streak = 0;
      this.audio.wrong();
      if (event) {
        const cx = event.clientX || window.innerWidth / 2;
        const cy = event.clientY || window.innerHeight / 2;
        this.fx.particles(cx, cy, 8, '#ef4444');
      }
    }

    this.memory.add(q.id);
    this.memory.record(q.id, correct);
    this._checkLevelUp();
    this._checkAchievements();

    const fbArea = this.content.querySelector('#pq-feedback-area');
    if (fbArea) fbArea.innerHTML = this._feedbackHTML(q, correct);
    this._renderHUD();
    this._save();
  }

  _feedbackHTML(q, correct) {
    const robot = (!correct && q.tip)
      ? `<div class="pq-robot">
           <div class="pq-robot-avatar">\u{1F916}</div>
           <div class="pq-robot-text"><strong>Science Bot says:</strong> ${q.tip}</div>
         </div>` : '';

    return `
    <div class="pq-feedback ${correct ? 'correct-fb' : 'wrong-fb'}">
      <div class="pq-fb-title">
        <span class="pq-fb-icon">${correct ? '\u2705' : '\u274C'}</span>
        ${correct ? 'Correct!' : 'Not quite!'}
      </div>
      <div class="pq-fb-explain">${q.explain}</div>
      ${q.formula ? `<div class="pq-fb-formula">\u{1F4D0} ${q.formula}</div>` : ''}
      ${robot}
    </div>
    <div class="pq-text-center pq-mt-2">
      <button class="pq-btn pq-btn-primary" data-a="next-q">Next Question \u2192</button>
    </div>`;
  }

  _nextQuestion() {
    this.qIdx++;
    if (this.qIdx >= this.levelQs.length) { this._completeLevel(); return; }
    this._setState('gameplay');
  }

  _completeLevel() {
    const l = this.currentLevel, w = this.currentWorld, p = this.player;
    const total = this.levelQs.length;
    const acc   = pct(this.levelCorrect, total);
    const stars = acc >= 90 ? 3 : acc >= 70 ? 2 : acc >= 50 ? 1 : 0;

    const bonuses    = this._getCreatureBonuses();
    const xpBonus    = Math.round(l.xp * (1 + (bonuses.levelXpMul || 0)));
    const coinBonus  = l.coins;

    p.xp    += xpBonus;
    p.coins += coinBonus;

    if (!p.levelsCompleted[w.id]) p.levelsCompleted[w.id] = [];
    if (!p.levelsCompleted[w.id].includes(l.id)) p.levelsCompleted[w.id].push(l.id);

    p.levelStars[l.id] = Math.max(stars, p.levelStars[l.id] || 0);
    p.stats.totalLevels++;
    if (acc === 100) p.stats.perfectLevels++;

    const allDone = p.levelsCompleted[w.id].length >= w.levels.length;
    const nextId  = this._nextWorldId(w.id);
    if (allDone && nextId && !p.worldsUnlocked.includes(nextId)) p.worldsUnlocked.push(nextId);
    if (allDone && !p.worldsCompleted.includes(w.id)) p.worldsCompleted.push(w.id);

    this.audio.levelUp();
    this._toast(`+${xpBonus} XP`, 'xp');
    this._toast(`+${coinBonus} Coins`, 'coin');
    this._checkLevelUp();
    this._checkAchievements();
    this._save();

    this._setState('results', { pct: acc, stars, xpBonus, coinBonus, allDone });
  }

  _rResults(d = {}) {
    const sc = d.stars || 0;
    const starsH = Array.from({ length: 3 }, (_, i) => i < sc ? '\u2605' : '\u2606').join('');

    return `
    <div class="pq-results">
      <div class="pq-results-icon">${sc >= 3 ? '\u{1F3C6}' : sc >= 2 ? '\u2B50' : '\u2705'}</div>
      <h2>Mission Complete!</h2>
      <p class="pq-sub">${this.currentLevel?.name || ''}</p>
      <div class="pq-results-stars">${starsH}</div>
      <div class="pq-results-stats">
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">${this.levelCorrect}/${this.levelQs.length}</div><div class="pq-stat-lbl">Correct</div></div>
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-accent)">${d.pct || 0}%</div><div class="pq-stat-lbl">Accuracy</div></div>
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">${d.xpBonus || 0}</div><div class="pq-stat-lbl">XP Earned</div></div>
      </div>
      ${d.allDone
        ? '<div class="pq-card pq-text-center pq-mb-2" style="border-color:var(--pq-purple);color:var(--pq-purple)">\u2694\uFE0F All levels complete! Challenge the boss!</div>'
        : ''}
      <div class="pq-results-buttons">
        <button class="pq-btn pq-btn-primary" data-a="back-levels">Continue</button>
        <button class="pq-btn pq-btn-ghost" data-a="back-worlds">World Map</button>
      </div>
    </div>`;
  }

  _nextWorldId(current) {
    const idx = this.worldData.findIndex(w => w.id === current);
    return idx >= 0 && idx < this.worldData.length - 1 ? this.worldData[idx + 1].id : null;
  }

  _checkLevelUp() {
    const p = this.player, curve = CFG.XP_CURVE;
    while (p.level < curve.length - 1 && p.xp >= curve[p.level]) {
      p.level++;
      this._toast(`Level Up! Lv ${p.level}`, 'level');
      this.audio.levelUp();
    }
  }


  // ════════════════════════════════
  //  BOSS BATTLE (Improved v2)
  // ════════════════════════════════
  _startBattle() {
    const w = this.currentWorld;
    if (!w) return;

    const bonuses = this._getCreatureBonuses();
    const bossQs  = this.questions.get(w.id, 10);
    console.log(`[PhysicsQuest] Boss battle — ${bossQs.length} questions for "${w.id}"`);

    this.battleState = {
      bossHp     : w.boss.hp,
      playerHp   : CFG.PLAYER_HP + (bonuses.bossHpBonus || 0),
      maxBossHp  : w.boss.hp,
      qs         : bossQs,
      qIdx       : 0,
      phase      : 'intro',
      combo      : bonuses.startCombo || 0,
      maxCombo   : bonuses.startCombo || 0,
      gadgetFx   : [],
      bossPhase  : 'normal'   // normal | enraged | desperate
    };
    this._setState('battle');
  }

  _rBattle() {
    const b = this.battleState, w = this.currentWorld;
    if (!b || !w) return '';
    const boss = w.boss;

    // ── INTRO ──
    if (b.phase === 'intro') {
      const phrase = pick(boss.phrases);
      return `
      <div class="pq-results">
        <div class="pq-boss-avatar" style="border-color:${w.color}">${w.icon}</div>
        <h2 style="color:var(--pq-red)">${boss.name}</h2>
        <p class="pq-sub">${boss.title}</p>
        <p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"${phrase}"</p>
        <p class="pq-mb-2" style="font-size:.85rem">Answer correctly to deal damage. Wrong answers cost you HP! Build combos for bonus damage.</p>
        <button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-glow" data-a="battle-answer" data-idx="-1">\u2694\uFE0F Begin Battle!</button>
      </div>`;
    }

    // ── WON ──
    if (b.phase === 'won') {
      return `
      <div class="pq-results">
        <div class="pq-results-icon">\u{1F3C6}</div>
        <h2>Victory!</h2>
        <p class="pq-sub">${boss.name} has been defeated!</p>
        <p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"${boss.phrases[boss.phrases.length - 1]}"</p>
        <div class="pq-results-stats">
          <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">+${CFG.XP_BOSS_WIN}</div><div class="pq-stat-lbl">XP</div></div>
          <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">+${CFG.COIN_BOSS_WIN}</div><div class="pq-stat-lbl">Coins</div></div>
          <div class="pq-stat-box"><div class="pq-stat-val">\u{1F9EC}</div><div class="pq-stat-lbl">Spirit</div></div>
        </div>
        <div class="pq-results-buttons"><button class="pq-btn pq-btn-primary" data-a="results-continue">Continue</button></div>
      </div>`;
    }

    // ── LOST ──
    if (b.phase === 'lost') {
      return `
      <div class="pq-results">
        <div class="pq-results-icon">\u{1F480}</div>
        <h2>Defeated</h2>
        <p class="pq-sub">${boss.name} was too strong this time.</p>
        <div class="pq-results-buttons">
          <button class="pq-btn pq-btn-danger pq-btn-lg" data-a="start-battle">Retry Battle</button>
          <button class="pq-btn pq-btn-ghost" data-a="back-levels">Train More</button>
        </div>
      </div>`;
    }

    // ── FIGHT ──
    const q = b.qs[b.qIdx];
    if (!q) {
      return `<div class="pq-text-center pq-mt-3"><p>No more questions.</p>
        <button class="pq-btn pq-btn-primary" data-a="back-levels">Back</button></div>`;
    }

    const letters = ['A','B','C','D'];
    const opts = q.opts.map((o, i) => `
      <div class="pq-option" data-a="battle-answer" data-idx="${i}">
        <span class="pq-option-letter">${letters[i]}</span><span>${o}</span>
      </div>`).join('');

    const bossPct   = pct(b.bossHp, b.maxBossHp);
    const playerPct = pct(b.playerHp, CFG.PLAYER_HP);

    // Boss phase
    if (bossPct <= 25) b.bossPhase = 'desperate';
    else if (bossPct <= 50) b.bossPhase = 'enraged';
    else b.bossPhase = 'normal';

    const phaseLabels = { normal:'\u{1F7E2} Normal', enraged:'\u{1F534} Enraged', desperate:'\u{1F7E3} Desperate' };

    // Combo display
    const maxComboI = Math.min(b.combo, CFG.COMBO_MULT.length - 1);
    const comboPips = Array.from({ length: 8 }, (_, i) =>
      `<div class="combo-pip ${i < b.combo ? 'active' : ''}"></div>`).join('');

    // Gadgets
    let gadgetBtns = '';
    Object.keys(this.player.gadgets).forEach(id => {
      const count = this.player.gadgets[id];
      if (count <= 0) return;
      const g = (this.gadgetsData || []).find(g => g.id === id);
      if (!g) return;
      gadgetBtns += `<button class="pq-gadget-btn" data-a="use-gadget" data-gadget="${id}" title="${g.name}: ${g.desc}">${g.icon}<span class="pq-gadget-count">${count}</span></button>`;
    });

    return `
    <div class="pq-battle">
      <div class="pq-boss-header">
        <div class="pq-boss-avatar" style="border-color:${w.color}">${w.icon}</div>
        <div class="pq-boss-name">${boss.name}</div>
        <div class="pq-boss-title">${boss.title}</div>
        <span class="pq-boss-phase ${b.bossPhase}">${phaseLabels[b.bossPhase]}</span>
      </div>
      <div class="pq-hp-bars">
        <div class="pq-hp-row">
          <span class="pq-hp-label" style="color:var(--pq-green)">YOU</span>
          <div class="pq-hp-bar"><div class="pq-hp-fill player-hp" style="width:${playerPct}%"></div></div>
          <span class="pq-hp-value">${b.playerHp}</span>
        </div>
        <div class="pq-hp-row">
          <span class="pq-hp-label" style="color:var(--pq-red)">BOSS</span>
          <div class="pq-hp-bar"><div class="pq-hp-fill boss-hp" style="width:${bossPct}%"></div></div>
          <span class="pq-hp-value">${b.bossHp}</span>
        </div>
      </div>
      ${b.combo > 0 ? `
        <div class="pq-combo-bar">
          <span class="combo-label">${b.combo}x COMBO</span>
          <div class="combo-pips">${comboPips}</div>
        </div>` : ''}
      ${gadgetBtns ? `<div class="pq-gadget-bar">${gadgetBtns}</div>` : ''}
      <div class="pq-question-card">
        <div class="pq-q-num">Q ${b.qIdx + 1} of ${b.qs.length}</div>
        <p class="pq-q-text">${q.q}</p>
        ${q.formula ? `<div class="pq-q-formula">${q.formula}</div>` : ''}
      </div>
      <div class="pq-options" id="pq-battle-opts">${opts}</div>
      <div id="pq-battle-fb"></div>
    </div>`;
  }

  _battleAnswer(idx, event) {
    const b = this.battleState;
    if (!b) return;

    // Intro → start fight
    if (b.phase !== 'fight') {
      b.phase = 'fight';
      this._setState('battle');
      return;
    }

    const q = b.qs[b.qIdx];
    if (!q) return;
    const correct = idx === q.ans;
    const opts    = this.content.querySelectorAll('.pq-option');

    opts.forEach((o, i) => {
      o.classList.add('disabled');
      if (i === q.ans) o.classList.add('correct');
      if (i === idx && !correct) o.classList.add('wrong');
    });

    const p = this.player;
    p.stats.played++;

    if (correct) {
      p.stats.correct++;
      p.xp    += CFG.XP_PER_CORRECT;
      p.coins += CFG.COIN_PER_CORRECT;

      // Combo system
      b.combo++;
      if (b.combo > b.maxCombo) b.maxCombo = b.combo;
      if (b.combo > (p.stats.bestCombo || 0)) p.stats.bestCombo = b.combo;

      const comboI   = Math.min(b.combo, CFG.COMBO_MULT.length - 1);
      let dmg        = Math.round(CFG.DMG_CORRECT * CFG.COMBO_MULT[comboI]);

      // Creature bonus: double-damage chance (thermix)
      const bonuses  = this._getCreatureBonuses();
      const ddChance  = (bonuses.doubleChance || 0) + (bonuses.globalMul || 0);
      let isCrit     = false;
      let isDouble   = false;

      if (Math.random() < (CFG.CRIT_CHANCE + (bonuses.critBonus || 0) + (bonuses.globalMul || 0))) {
        dmg *= CFG.CRIT_MULT;
        isCrit = true;
      }
      if (Math.random() < ddChance) {
        dmg *= 2;
        isDouble = true;
      }

      // Gadget: double damage
      const ddIdx = b.gadgetFx.indexOf('double_damage');
      if (ddIdx !== -1) { dmg *= 2; b.gadgetFx.splice(ddIdx, 1); isDouble = true; }

      b.bossHp = Math.max(0, b.bossHp - dmg);

      this.audio.bossHit();
      if (isCrit) { this.audio.critical(); this.fx.shake(this.content); }
      if (b.combo >= 2) this.audio.combo(b.combo);

      const cx = event?.clientX || window.innerWidth / 2;
      const cy = event?.clientY || window.innerHeight / 2;
      this.fx.particles(cx, cy, isCrit ? 20 : 12, isCrit ? '#f5c842' : w_color(this));
      this.fx.floatText(cx, cy - 30, `-${dmg} HP` + (isCrit ? ' CRIT!' : ''), isCrit ? '#f5c842' : '#00df89');
      if (b.combo >= 3) this.fx.comboPopup(b.combo);

      this._toast(`-${dmg} Boss HP!`, 'xp');
      this._toast(`+${CFG.XP_PER_CORRECT} XP`, 'xp');

      // Show feedback
      const fbArea = this.content.querySelector('#pq-battle-fb');
      if (fbArea) {
        fbArea.innerHTML = `
          <div class="pq-feedback correct-fb" style="margin-top:16px">
            <div class="pq-fb-title">\u2705 ${isCrit ? 'CRITICAL HIT!' : 'Direct Hit!'}${isDouble ? ' \u00D72!' : ''} ${b.combo >= 2 ? ` (${b.combo}x combo)` : ''}</div>
            <div class="pq-fb-explain">${q.explain}</div>
            ${q.formula ? `<div class="pq-fb-formula">\u{1F4D0} ${q.formula}</div>` : ''}
          </div>
          <div class="pq-text-center pq-mt-2">
            <button class="pq-btn pq-btn-primary" data-a="battle-next">Next Round \u2192</button>
          </div>`;
      }
    } else {
      p.stats.wrong++;
      p.streak = 0;
      b.combo = 0;   // reset combo

      const bonuses  = this._getCreatureBonuses();
      let dmgW       = CFG.DMG_WRONG;

      // Boss phase modifiers
      if (b.bossPhase === 'enraged')   dmgW += 5;
      if (b.bossPhase === 'desperate') dmgW += 10;

      // Creature bonus: damage reduction
      dmgW = Math.max(0, dmgW - (bonuses.dmgReduce || 0));

      // Gadget effects
      const shIdx = b.gadgetFx.indexOf('shield');
      if (shIdx !== -1) { dmgW = Math.floor(dmgW / 2) - (bonuses.shieldBonus || 0); b.gadgetFx.splice(shIdx, 1); }
      const blIdx = b.gadgetFx.indexOf('block');
      if (blIdx !== -1) { dmgW = 0; b.gadgetFx.splice(blIdx, 1); }
      dmgW = Math.max(0, dmgW);

      b.playerHp = Math.max(0, b.playerHp - dmgW);
      this.audio.playerHit();
      this.fx.shake(this.content);

      const cx = event?.clientX || window.innerWidth / 2;
      const cy = event?.clientY || window.innerHeight / 2;
      this.fx.particles(cx, cy, 8, '#ef4444');

      // Show feedback
      const fbArea = this.content.querySelector('#pq-battle-fb');
      if (fbArea) {
        fbArea.innerHTML = `
          <div class="pq-feedback wrong-fb" style="margin-top:16px">
            <div class="pq-fb-title">\u{1F4A5} Boss Attacks! (-${dmgW} HP)</div>
            <div class="pq-fb-explain">${q.explain}</div>
            ${q.formula ? `<div class="pq-fb-formula">\u{1F4D0} ${q.formula}</div>` : ''}
            ${q.tip ? `<div class="pq-robot"><div class="pq-robot-avatar">\u{1F916}</div><div class="pq-robot-text"><strong>Science Bot:</strong> ${q.tip}</div></div>` : ''}
          </div>
          <div class="pq-text-center pq-mt-2">
            <button class="pq-btn pq-btn-primary" data-a="battle-next">Next Round \u2192</button>
          </div>`;
      }
    }

    // Update combo bar (re-render HUD area of battle for live combo display)
    this._renderHUD();
    this._save();

    // Helper for particle color
    function w_color(self) {
      return self.currentWorld?.color || '#00df89';
    }
  }

  _battleNextQ() {
    const b = this.battleState;
    if (!b) return;

    if (b.bossHp <= 0) { this._battleVictory(); return; }
    if (b.playerHp <= 0) { b.phase = 'lost'; this._setState('battle'); return; }

    b.qIdx++;
    if (b.qIdx >= b.qs.length) {
      if (b.qs.length >= CFG.MAX_BOSS_QS) {
        // Exhausted questions — force victory
        this._battleVictory();
        return;
      }
      const more = this.questions.get(this.currentWorld.id, 5);
      if (more.length === 0) { this._battleVictory(); return; }
      b.qs = b.qs.concat(more);
      console.log(`[PhysicsQuest] Extended boss questions to ${b.qs.length}`);
    }
    this._setState('battle');
  }

  _battleVictory() {
    const b = this.battleState, w = this.currentWorld, p = this.player;
    b.phase = 'won';

    const bonuses    = this._getCreatureBonuses();
    const xpReward   = Math.round(CFG.XP_BOSS_WIN * (1 + (bonuses.levelXpMul || 0)));
    const coinReward = Math.round(CFG.COIN_BOSS_WIN * (1 + (bonuses.coinsMul || 0)));

    p.xp    += xpReward;
    p.coins += coinReward;

    if (!p.bossesDefeated.includes(w.id)) p.bossesDefeated.push(w.id);

    // Award creature
    const creature = w.creature;
    if (creature && !p.creatures.includes(creature)) {
      p.creatures.push(creature);
      this._toast('New Spirit: ' + creature.replace(/_/g, ' '), 'creature');
      this.audio.creature();
    }

    this.audio.victory();
    this._toast(`+${xpReward} XP`, 'xp');
    this._toast(`+${coinReward} Coins`, 'coin');
    this._checkLevelUp();
    this._checkAchievements();
    this._save();
    this._setState('battle');
  }


  // ── Creature Bonuses Aggregator ──
  _getCreatureBonuses() {
    const result = {};
    const all = {};
    (this.player.creatures || []).forEach(id => {
      const b = CREATURE_BONUSES[id];
      if (b) Object.entries(b).forEach(([k, v]) => { all[k] = (all[k] || 0) + v; });
    });
    // quark_sprite gives +3% to all
    const gm = all.globalMul || 0;
    Object.assign(result, all);
    // Apply global multiplier to additive bonuses
    if (gm > 0) {
      ['xpMul','coinsMul','levelXpMul','doubleChance','critBonus'].forEach(k => {
        if (result[k]) result[k] += gm;
      });
    }
    return result;
  }


  // ── Gadgets ──
  _useGadget(gadgetId) {
    const p = this.player;
    if (!p.gadgets[gadgetId] || p.gadgets[gadgetId] <= 0) return;
    const g = (this.gadgetsData || []).find(g => g.id === gadgetId);
    if (!g) return;

    p.gadgets[gadgetId]--;
    const b = this.battleState;

    switch (g.effect) {
      case 'hint':
      case 'eliminate': {
        if (!b) break;
        const q = b.qs[b.qIdx];
        if (!q) break;
        const opts = this.content.querySelectorAll('#pq-battle-opts .pq-option');
        if (opts.length < 4) break;
        const wrongs = [];
        opts.forEach((o, i) => { if (i !== q.ans) wrongs.push(i); });
        shuffle(wrongs).slice(0, 2).forEach(i => {
          opts[i].style.opacity = '.25';
          opts[i].style.pointerEvents = 'none';
        });
        break;
      }
      case 'shield': case 'block': case 'double_damage':
        if (b) b.gadgetFx.push(g.effect);
        break;
      case 'xp_boost':
        p.xp += 20;
        this._toast('+20 XP!', 'xp');
        break;
      case 'coin_boost':
        p.coins += 15;
        this._toast('+15 Coins!', 'coin');
        break;
      case 'retry':
        if (b) b.playerHp = Math.min(CFG.PLAYER_HP + 10, b.playerHp + 30);
        break;
      case 'scan':
        if (b) {
          const q = b.qs[b.qIdx];
          if (q) {
            const opts = this.content.querySelectorAll('#pq-battle-opts .pq-option');
            if (opts[q.ans]) opts[q.ans].style.boxShadow = '0 0 12px rgba(0,198,255,.6)';
          }
        }
        break;
      default:
        if (b) b.gadgetFx.push(g.effect);
    }

    this._toast('Used ' + g.name + '!', 'xp');
    this._save();
    this._setState('battle');
  }


  // ══════════════════════
  //  COLLECTION
  // ══════════════════════
  _rCollection() {
    const p = this.player;
    const total = (this.creaturesData || []).length;
    const cards = (this.creaturesData || []).map(c => {
      const owned = p.creatures.includes(c.id);
      const svg   = CREATURE_SVG[c.id] || '\u{1F9EC}';
      const bonus = CREATURE_BONUSES[c.id];
      let bonusStr = '';
      if (owned && bonus) {
        const entries = Object.entries(bonus);
        if (entries.length) {
          const [k, v] = entries[0];
          const labels = { coinsMul:'+Coins', xpMul:'+XP', bossHpBonus:'+Boss HP', doubleChance:'Double DMG',
                           dmgReduce:'-DMG taken', startCombo:'Start Combo', critBonus:'+Crit%',
                           shieldBonus:'+Shield', levelXpMul:'+Level XP', globalMul:'+All stats' };
          bonusStr = `<span class="pq-creature-bonus">${labels[k] || k}: ${typeof v === 'number' && v < 1 ? Math.round(v * 100) + '%' : '+' + v}</span>`;
        }
      }
      return `
      <div class="pq-creature-card ${owned ? '' : 'locked'}">
        <div class="pq-creature-svg-wrap">${svg}</div>
        <h4>${c.name}</h4>
        <p>${owned ? c.desc : '???'}</p>
        ${bonusStr}
        <span class="pq-creature-rarity pq-rarity-${c.rarity}">${c.rarity}</span>
      </div>`;
    }).join('');

    return `
    <div class="pq-collection">
      <div class="pq-section-head">
        <h2>Physics Spirit Collection</h2>
        <p>${p.creatures.length}/${total} spirits collected</p>
      </div>
      <div class="pq-creature-grid">${cards}</div>
      <div class="pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back to World Map</button></div>
    </div>`;
  }


  // ══════════════════════
  //  GADGET SHOP
  // ══════════════════════
  _rShop() {
    const p = this.player;
    const items = (this.gadgetsData || []).map(g => {
      const count   = p.gadgets[g.id] || 0;
      const canBuy  = p.coins >= g.cost;
      return `
      <div class="pq-shop-item">
        <div class="pq-shop-icon">${g.icon}</div>
        <h4>${g.name}${count > 0 ? ` (\u00D7${count})` : ''}</h4>
        <p>${g.desc}</p>
        <div class="pq-shop-price">\u{1FA99} ${g.cost}</div>
        <button class="pq-btn pq-btn-sm ${canBuy ? 'pq-btn-success' : 'pq-btn-ghost'}"
                data-a="buy-gadget" data-gadget="${g.id}" ${canBuy ? '' : 'disabled'}>
          ${canBuy ? 'Buy' : 'Not enough coins'}
        </button>
      </div>`;
    }).join('');

    return `
    <div class="pq-collection">
      <div class="pq-section-head">
        <h2>Gadget Shop</h2>
        <p>Your coins: \u{1FA99} ${p.coins}</p>
      </div>
      <div class="pq-shop-grid">${items}</div>
      <div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>
    </div>`;
  }

  _buyGadget(gadgetId) {
    const p = this.player;
    const g = (this.gadgetsData || []).find(g => g.id === gadgetId);
    if (!g || p.coins < g.cost) return;
    p.coins -= g.cost;
    p.gadgets[gadgetId] = (p.gadgets[gadgetId] || 0) + 1;
    this.audio.coin();
    this._toast('Bought ' + g.name + '!', 'coin');
    this._save();
    this._setState('shop');
  }


  // ══════════════════════
  //  SETTINGS
  // ══════════════════════
  _rSettings() {
    const s = this.player.settings, p = this.player;
    const accuracy = pct(p.stats.correct, p.stats.played);

    return `
    <div class="pq-settings">
      <h2>Settings</h2>
      <div class="pq-setting-row"><label>Sound Effects</label><div class="pq-toggle ${s.sfx ? 'on' : ''}" data-a="toggle-sfx"></div></div>
      <div class="pq-setting-row"><label>Volume</label><input type="range" class="pq-range" min="0" max="1" step="0.1" value="${s.vol}" data-a="vol-change"></div>
      <hr style="border:none;border-top:1px solid var(--pq-border,#333);margin:12px 0">
      <div class="pq-setting-row"><label>Player Level</label><span style="color:var(--pq-accent)">${p.level}</span></div>
      <div class="pq-setting-row"><label>Total XP</label><span style="color:var(--pq-accent)">${p.xp}</span></div>
      <div class="pq-setting-row"><label>Questions Answered</label><span style="color:var(--pq-accent)">${p.stats.played}</span></div>
      <div class="pq-setting-row"><label>Accuracy</label><span style="color:var(--pq-accent)">${accuracy}%</span></div>
      <div class="pq-setting-row"><label>Best Streak</label><span style="color:var(--pq-accent)">${p.bestStreak}</span></div>
      <div class="pq-setting-row"><label>Best Combo</label><span style="color:var(--pq-accent)">${p.stats.bestCombo || 0}x</span></div>
      <div class="pq-setting-row"><label>Creatures Collected</label><span style="color:var(--pq-accent)">${p.creatures.length}</span></div>
      <div class="pq-setting-row"><label>Daily Login Streak</label><span style="color:var(--pq-accent)">${p.dailyStreak || 0} days</span></div>
      <div class="pq-mt-3 pq-text-center"><button class="pq-btn pq-btn-danger pq-btn-sm" data-a="new-game">Reset All Progress</button></div>
      <div class="pq-mt-2 pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>
    </div>`;
  }

  _toggleSfx() {
    const s = this.player.settings;
    s.sfx = !s.sfx;
    this.audio.setMuted(!s.sfx);
    this._save();
    this._setState('settings');
  }


  // ══════════════════════
  //  ACHIEVEMENTS
  // ══════════════════════
  _rAchievements() {
    const p = this.player;
    const items = ACHIEVEMENTS.map(a => {
      const unlocked = p.achievements.includes(a.id);
      return `
      <div class="pq-card" style="opacity:${unlocked ? '1' : '.4'};text-align:center;padding:16px">
        <div style="font-size:2rem;margin-bottom:6px">${a.icon}</div>
        <h4 style="font-family:var(--pq-head);font-size:.85rem">${a.name}</h4>
        <p style="font-size:.75rem;color:var(--pq-sec)">${a.desc}</p>
        ${unlocked
          ? '<span style="font-size:.65rem;color:var(--pq-green)">\u2713 Unlocked</span>'
          : '<span style="font-size:.65rem;color:var(--pq-muted)">Locked</span>'}
      </div>`;
    }).join('');

    return `
    <div class="pq-collection">
      <div class="pq-section-head">
        <h2>Achievements</h2>
        <p>${p.achievements.length}/${ACHIEVEMENTS.length} unlocked</p>
      </div>
      <div class="pq-creature-grid">${items}</div>
      <div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>
    </div>`;
  }

  _checkAchievements() {
    const p = this.player;
    ACHIEVEMENTS.forEach(a => {
      if (!p.achievements.includes(a.id) && a.check(p)) {
        p.achievements.push(a.id);
        p.xp += CFG.XP_ACHIEVEMENT;
        this.fx.showAchievement(a);
        this._toast('\u{1F3C6} ' + a.name + ' — +' + CFG.XP_ACHIEVEMENT + ' XP', 'achievement');
      }
    });
  }


  // ══════════════════════
  //  TOAST NOTIFICATIONS
  // ══════════════════════
  _toast(msg, type) {
    const el = document.createElement('div');
    el.className = 'pq-toast pq-toast-' + (type || 'xp');
    el.textContent = msg;
    this.toastsEl.appendChild(el);
    // Stagger: offset by existing toasts
    const existing = this.toastsEl.children.length;
    el.style.transitionDelay = (existing * 30) + 'ms';
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateX(40px)';
      el.style.transition = 'all .3s ease';
      setTimeout(() => el.remove(), 350);
    }, 2600);
  }


  // ══════════════════════
  //  CLOSE / EXIT
  // ══════════════════════
  _close() {
    this._save();
    if (this.fx) this.fx.destroy();
    const ov = document.getElementById('pq-overlay');
    if (ov) ov.remove();
    document.body.style.overflow = '';
  }

  destroy() {
    this._close();
    const s = document.getElementById('pq-fx-styles');
    if (s) s.remove();
  }
}


// ═══════════════════════════════════════════════════════
//  GLOBAL LAUNCHER
//  window.PQGame.launch(containerElement)
// ═══════════════════════════════════════════════════════
window.PQGame = {
  _instance: null,

  launch(root) {
    if (this._instance) {
      root.innerHTML = '';
      this._instance.root = root;
      this._instance._buildShell();
      this._instance._render();
      return Promise.resolve();
    }
    const game = new PhysicsQuest(root);
    this._instance = game;
    return game.init().catch(err => {
      console.error('[PhysicsQuest] Init failed:', err);
      root.innerHTML = '<div style="padding:40px;text-align:center;color:#ef4444">' +
        '<h2>Failed to load Physics Quest</h2><p>' + err.message + '</p></div>';
    });
  }
};

})();
