(function(){
'use strict';

/* ═══════════════════════════════════════════════════════
   PHYSICS QUEST: ACADEMY OF FORCES — Game Engine v1.1
   Prime Spirit Mentors · primespirit.co.in

   Changelog v1.1
   - Fixed: questions.load() now called during init
   - Fixed: questions are fetched before any render
   - All question data loads from /game/data/questions.json
   ═══════════════════════════════════════════════════════ */

// ── Constants ──
var CFG = {
  SAVE_KEY: 'pq-save-v1',
  DB_NAME: 'PhysicsQuestDB',
  DB_STORE: 'gamedata',
  DATA_DIR: 'game/data/',
  VERSION: '1.1.0',
  XP_CURVE: [0, 100, 250, 500, 850, 1300, 1900, 2700, 3800, 5200, 7000, 10000],
  PLAYER_HP: 100,
  BOSS_HP_MULT: 1,
  DMG_CORRECT: 22,
  DMG_WRONG: 15,
  XP_PER_CORRECT: 10,
  COIN_PER_CORRECT: 5,
  XP_BOSS_WIN: 200,
  COIN_BOSS_WIN: 100,
  XP_ACHIEVEMENT: 25
};

// ── Creature SVG Art (100% original) ──
var CREATURE_SVG = {

momentum_fox:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="65" rx="24" ry="18" fill="#ff9f43"/>'+
  '<circle cx="50" cy="42" r="17" fill="#ff9f43"/>'+
  '<polygon points="36,34 28,8 46,28" fill="#ee5a24"/>'+
  '<polygon points="64,34 72,8 54,28" fill="#ee5a24"/>'+
  '<polygon points="37,33 30,10 44,27" fill="#ffbe76"/>'+
  '<polygon points="63,33 70,10 56,27" fill="#ffbe76"/>'+
  '<circle cx="43" cy="39" r="3.5" fill="#2d3436"/>'+
  '<circle cx="57" cy="39" r="3.5" fill="#2d3436"/>'+
  '<circle cx="44" cy="38" r="1.2" fill="#fff"/>'+
  '<circle cx="58" cy="38" r="1.2" fill="#fff"/>'+
  '<ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#2d3436"/>'+
  '<path d="M46 50Q50 55 54 50" fill="none" stroke="#2d3436" stroke-width="1.3" stroke-linecap="round"/>'+
  '<ellipse cx="78" cy="72" rx="15" ry="6" fill="#ee5a24" transform="rotate(-15 78 72)"/>'+
  '<ellipse cx="82" cy="69" rx="8" ry="4" fill="#ffbe76" transform="rotate(-15 82 69)"/>'+
'</svg>',

vector_hawk:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="55" rx="20" ry="28" fill="#8b5cf6"/>'+
  '<polygon points="50,12 44,30 56,30" fill="#a855f7"/>'+
  '<polygon points="10,50 30,44 30,56" fill="#7c3aed" opacity=".7"/>'+
  '<polygon points="90,50 70,44 70,56" fill="#7c3aed" opacity=".7"/>'+
  '<circle cx="44" cy="38" r="3" fill="#fff"/>'+
  '<circle cx="56" cy="38" r="3" fill="#fff"/>'+
  '<circle cx="44" cy="38" r="1.5" fill="#2d3436"/>'+
  '<circle cx="56" cy="38" r="1.5" fill="#2d3436"/>'+
  '<polygon points="50,44 46,48 54,48" fill="#f59e0b"/>'+
  '<path d="M38 55L50 80L62 55" fill="none" stroke="#c4b5fd" stroke-width="1.5"/>'+
  '<line x1="50" y1="65" x2="50" y2="80" stroke="#c4b5fd" stroke-width="1.5"/>'+
  '<circle cx="8" cy="50" r="3" fill="#f59e0b"/>'+
  '<circle cx="92" cy="50" r="3" fill="#f59e0b"/>'+
'</svg>',

gravion:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<rect x="30" y="45" width="40" height="35" rx="6" fill="#92400e"/>'+
  '<rect x="35" y="30" width="30" height="20" rx="4" fill="#b45309"/>'+
  '<circle cx="43" cy="38" r="3.5" fill="#fbbf24"/>'+
  '<circle cx="57" cy="38" r="3.5" fill="#fbbf24"/>'+
  '<rect x="26" y="50" width="8" height="25" rx="4" fill="#92400e"/>'+
  '<rect x="66" y="50" width="8" height="25" rx="4" fill="#92400e"/>'+
  '<rect x="34" y="80" width="12" height="8" rx="3" fill="#78350f"/>'+
  '<rect x="54" y="80" width="12" height="8" rx="3" fill="#78350f"/>'+
  '<circle cx="50" cy="55" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5"/>'+
  '<text x="50" y="58" text-anchor="middle" font-size="7" font-weight="900" fill="#fbbf24">G</text>'+
'</svg>',

thermix:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="60" rx="22" ry="26" fill="#ef4444"/>'+
  '<ellipse cx="50" cy="60" rx="16" ry="20" fill="#f97316"/>'+
  '<ellipse cx="50" cy="58" rx="10" ry="14" fill="#fbbf24"/>'+
  '<circle cx="50" cy="50" r="5" fill="#fef3c7"/>'+
  '<circle cx="44" cy="42" r="3" fill="#fff"/>'+
  '<circle cx="56" cy="42" r="3" fill="#fff"/>'+
  '<circle cx="44" cy="42" r="1.5" fill="#2d3436"/>'+
  '<circle cx="56" cy="42" r="1.5" fill="#2d3436"/>'+
  '<path d="M44 52Q50 58 56 52" fill="none" stroke="#2d3436" stroke-width="1.5" stroke-linecap="round"/>'+
  '<polygon points="50,8 46,22 54,22" fill="#f97316"/>'+
  '<polygon points="35,15 33,28 40,24" fill="#ef4444" opacity=".7"/>'+
  '<polygon points="65,15 67,28 60,24" fill="#ef4444" opacity=".7"/>'+
'</svg>',

circuit_crab:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="62" rx="28" ry="18" fill="#0891b2"/>'+
  '<ellipse cx="50" cy="60" rx="22" ry="14" fill="#06b6d4"/>'+
  '<circle cx="42" cy="48" r="4" fill="#fff"/>'+
  '<circle cx="58" cy="48" r="4" fill="#fff"/>'+
  '<circle cx="42" cy="48" r="2" fill="#164e63"/>'+
  '<circle cx="58" cy="48" r="2" fill="#164e63"/>'+
  '<path d="M18 55L8 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/>'+
  '<path d="M82 55L92 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/>'+
  '<circle cx="8" cy="38" r="5" fill="#ef4444"/>'+
  '<circle cx="92" cy="38" r="5" fill="#ef4444"/>'+
  '<line x1="38" y1="60" x2="62" y2="60" stroke="#0e7490" stroke-width="1.5" stroke-dasharray="3 2"/>'+
  '<circle cx="50" cy="60" r="3" fill="#22d3ee"/>'+
'</svg>',

voltix:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<circle cx="50" cy="50" r="28" fill="#0070f3"/>'+
  '<circle cx="50" cy="50" r="22" fill="#00C6FF"/>'+
  '<circle cx="50" cy="50" r="14" fill="#b3e5fc"/>'+
  '<circle cx="44" cy="44" r="3" fill="#fff"/>'+
  '<circle cx="56" cy="44" r="3" fill="#fff"/>'+
  '<circle cx="44" cy="44" r="1.5" fill="#001d3d"/>'+
  '<circle cx="56" cy="44" r="1.5" fill="#001d3d"/>'+
  '<path d="M46 52L50 46L54 52L50 48Z" fill="#f59e0b"/>'+
  '<polygon points="50,6 46,18 50,14 54,18" fill="#f59e0b"/>'+
  '<polygon points="50,94 46,82 50,86 54,82" fill="#f59e0b"/>'+
  '<polygon points="6,50 18,46 14,50 18,54" fill="#f59e0b"/>'+
  '<polygon points="94,50 82,46 86,50 82,54" fill="#f59e0b"/>'+
'</svg>',

hydron:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="55" rx="24" ry="20" fill="#7c3aed"/>'+
  '<ellipse cx="50" cy="53" rx="18" ry="15" fill="#8b5cf6"/>'+
  '<ellipse cx="50" cy="48" rx="8" ry="5" fill="#c4b5fd"/>'+
  '<circle cx="43" cy="44" r="3" fill="#ede9fe"/>'+
  '<circle cx="57" cy="44" r="3" fill="#ede9fe"/>'+
  '<circle cx="43" cy="44" r="1.5" fill="#2d3436"/>'+
  '<circle cx="57" cy="44" r="1.5" fill="#2d3436"/>'+
  '<path d="M46 50Q50 54 54 50" fill="none" stroke="#2d3436" stroke-width="1.2"/>'+
  '<ellipse cx="75" cy="62" rx="14" ry="5" fill="#6d28d9" transform="rotate(-10 75 62)"/>'+
  '<path d="M30 70Q20 82 35 85Q40 72 30 70Z" fill="#6d28d9"/>'+
  '<circle cx="50" cy="65" r="4" fill="none" stroke="#a78bfa" stroke-width="1.5"/>'+
  '<circle cx="50" cy="65" r="2" fill="#c4b5fd"/>'+
'</svg>',

photonix:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="50" cy="50" rx="30" ry="20" fill="#ec4899" opacity=".3"/>'+
  '<polygon points="50,20 30,50 50,45 70,50" fill="#ec4899"/>'+
  '<polygon points="50,80 30,50 50,55 70,50" fill="#db2777"/>'+
  '<polygon points="50,20 40,50 50,42" fill="#f9a8d4" opacity=".6"/>'+
  '<polygon points="50,80 40,50 50,58" fill="#f472b6" opacity=".6"/>'+
  '<circle cx="50" cy="50" r="6" fill="#fce7f3"/>'+
  '<circle cx="48" cy="48" r="1.5" fill="#be185d"/>'+
  '<circle cx="52" cy="48" r="1.5" fill="#be185d"/>'+
  '<path d="M47 52Q50 55 53 52" fill="none" stroke="#be185d" stroke-width="1" stroke-linecap="round"/>'+
  '<circle cx="50" cy="50" r="10" fill="none" stroke="#f9a8d4" stroke-width=".8" stroke-dasharray="2 3" opacity=".5">'+
    '<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/>'+
  '</circle>'+
'</svg>',

wave_dolphin:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<ellipse cx="45" cy="55" rx="28" ry="16" fill="#3b82f6"/>'+
  '<path d="M73 55Q85 42 80 55Q88 50 78 58Z" fill="#1d4ed8"/>'+
  '<circle cx="30" cy="50" r="3" fill="#fff"/>'+
  '<circle cx="30" cy="50" r="1.5" fill="#1e3a5f"/>'+
  '<path d="M17 54Q20 58 25 55" fill="none" stroke="#1e3a5f" stroke-width="1.2" stroke-linecap="round"/>'+
  '<path d="M38 60Q45 66 52 60Q59 66 66 60" fill="none" stroke="#93c5fd" stroke-width="1.5" opacity=".5"/>'+
  '<path d="M10 72Q25 65 40 72Q55 79 70 72Q85 65 95 72" fill="none" stroke="#60a5fa" stroke-width="2" opacity=".3"/>'+
  '<path d="M5 80Q20 73 35 80Q50 87 65 80Q80 73 95 80" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity=".2"/>'+
'</svg>',

quark_sprite:
'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">'+
  '<circle cx="50" cy="50" r="20" fill="#a855f7" opacity=".4"/>'+
  '<circle cx="50" cy="50" r="14" fill="#00C6FF" opacity=".6"/>'+
  '<circle cx="50" cy="50" r="8" fill="#00df89"/>'+
  '<circle cx="46" cy="47" r="2" fill="#fff"/>'+
  '<circle cx="54" cy="47" r="2" fill="#fff"/>'+
  '<circle cx="46" cy="47" r="1" fill="#0a0e27"/>'+
  '<circle cx="54" cy="47" r="1" fill="#0a0e27"/>'+
  '<path d="M47 53Q50 56 53 53" fill="none" stroke="#0a0e27" stroke-width="1"/>'+
  '<circle cx="50" cy="50" r="30" fill="none" stroke="#00C6FF" stroke-width="1" stroke-dasharray="4 6" opacity=".3">'+
    '<animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite"/>'+
  '</circle>'+
  '<circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="3 8" opacity=".2">'+
    '<animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite"/>'+
  '</circle>'+
  '<circle cx="78" cy="30" r="2" fill="#00C6FF" opacity=".6">'+
    '<animate attributeName="opacity" values=".6;.2;.6" dur="2s" repeatCount="indefinite"/>'+
  '</circle>'+
  '<circle cx="22" cy="70" r="2" fill="#a855f7" opacity=".5">'+
    '<animate attributeName="opacity" values=".5;.2;.5" dur="2.5s" repeatCount="indefinite"/>'+
  '</circle>'+
'</svg>'

};

// ══════════════════════════════════════════
//  AUDIO ENGINE (Web Audio API — no files)
// ══════════════════════════════════════════
function AudioEngine(){
  this.ctx = null;
  this.muted = false;
  this.vol = 0.4;
}

AudioEngine.prototype.init = function(){
  try {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  } catch(e) { /* Web Audio not supported — silent fallback */ }
};

AudioEngine.prototype.resume = function(){
  if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
};

AudioEngine.prototype._tone = function(freq, dur, type, vol){
  if (this.muted || !this.ctx) return;
  this.resume();
  var o = this.ctx.createOscillator();
  var g = this.ctx.createGain();
  o.type = type || 'sine';
  o.frequency.value = freq;
  g.gain.setValueAtTime((vol || this.vol) * 0.3, this.ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + dur);
  o.connect(g);
  g.connect(this.ctx.destination);
  o.start();
  o.stop(this.ctx.currentTime + dur);
};

AudioEngine.prototype.correct = function(){
  this._tone(523, 0.08, 'sine');
  setTimeout(this._tone.bind(this, 659, 0.08, 'sine'), 80);
  setTimeout(this._tone.bind(this, 784, 0.15, 'sine'), 160);
};

AudioEngine.prototype.wrong = function(){
  this._tone(220, 0.15, 'sawtooth', 0.2);
  setTimeout(this._tone.bind(this, 180, 0.2, 'sawtooth', 0.15), 100);
};

AudioEngine.prototype.coin = function(){
  this._tone(1200, 0.06, 'sine');
  setTimeout(this._tone.bind(this, 1600, 0.1, 'sine'), 60);
};

AudioEngine.prototype.click = function(){
  this._tone(800, 0.04, 'sine', 0.15);
};

AudioEngine.prototype.victory = function(){
  this._tone(523, 0.1, 'sine');
  setTimeout(this._tone.bind(this, 659, 0.1, 'sine'), 100);
  setTimeout(this._tone.bind(this, 784, 0.1, 'sine'), 200);
  setTimeout(this._tone.bind(this, 1047, 0.25, 'sine'), 300);
};

AudioEngine.prototype.levelUp = function(){
  this._tone(440, 0.1, 'triangle');
  setTimeout(this._tone.bind(this, 554, 0.1, 'triangle'), 80);
  setTimeout(this._tone.bind(this, 659, 0.1, 'triangle'), 160);
  setTimeout(this._tone.bind(this, 880, 0.3, 'triangle'), 240);
};

AudioEngine.prototype.bossHit = function(){
  this._tone(150, 0.12, 'square', 0.2);
  setTimeout(this._tone.bind(this, 100, 0.15, 'sawtooth', 0.15), 80);
};

AudioEngine.prototype.playerHit = function(){
  this._tone(200, 0.1, 'sawtooth', 0.2);
  setTimeout(this._tone.bind(this, 150, 0.15, 'square', 0.15), 80);
};

AudioEngine.prototype.creature = function(){
  this._tone(600, 0.1, 'sine');
  setTimeout(this._tone.bind(this, 800, 0.1, 'sine'), 100);
  setTimeout(this._tone.bind(this, 1000, 0.15, 'sine'), 200);
  setTimeout(this._tone.bind(this, 1200, 0.2, 'sine'), 300);
};

AudioEngine.prototype.setMuted = function(v){ this.muted = v; };
AudioEngine.prototype.setVolume = function(v){ this.vol = v; };


// ══════════════════════════════════════════
//  SAVE MANAGER (localStorage + IndexedDB)
// ══════════════════════════════════════════
function SaveManager(){
  this.db = null;
}

SaveManager.prototype.init = function(){
  var self = this;
  return new Promise(function(resolve){
    if (!window.indexedDB) { resolve(); return; }
    var req = indexedDB.open(CFG.DB_NAME, 1);
    req.onupgradeneeded = function(e){
      var d = e.target.result;
      if (!d.objectStoreNames.contains(CFG.DB_STORE)) {
        d.createObjectStore(CFG.DB_STORE);
      }
    };
    req.onsuccess = function(e){ self.db = e.target.result; resolve(); };
    req.onerror = function(){ resolve(); };
  });
};

SaveManager.prototype.save = function(data){
  try { localStorage.setItem(CFG.SAVE_KEY, JSON.stringify(data)); } catch(e) {}
  if (!this.db) return Promise.resolve();
  return new Promise(function(resolve){
    try {
      var tx = self.db.transaction(CFG.DB_STORE, 'readwrite');
      tx.objectStore(CFG.DB_STORE).put(data, 'save');
      tx.oncomplete = resolve;
      tx.onerror = resolve;
    } catch(e) { resolve(); }
  });
};

SaveManager.prototype.load = function(){
  var self = this;
  // Try IndexedDB first
  if (self.db) {
    return new Promise(function(resolve){
      try {
        var tx = self.db.transaction(CFG.DB_STORE, 'readonly');
        var r = tx.objectStore(CFG.DB_STORE).get('save');
        r.onsuccess = function(){ resolve(r.result || null); };
        r.onerror = function(){ resolve(null); };
      } catch(e) { resolve(null); }
    }).then(function(data){
      if (data) return data;
      return self._loadFromLS();
    });
  }
  return Promise.resolve(self._loadFromLS());
};

SaveManager.prototype._loadFromLS = function(){
  try {
    var s = localStorage.getItem(CFG.SAVE_KEY);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
};


// ══════════════════════════════════════════
//  MEMORY ENGINE (SM-2 Spaced Repetition)
// ══════════════════════════════════════════
function MemoryEngine(){
  this.schedule = {};
}

MemoryEngine.prototype.add = function(qid){
  if (!this.schedule[qid]) {
    this.schedule[qid] = { interval: 1, ef: 2.5, next: Date.now() + 86400000, rep: 0 };
  }
};

MemoryEngine.prototype.record = function(qid, correct){
  var s = this.schedule[qid];
  if (!s) return;
  if (correct) {
    s.rep++;
    if (s.rep === 1) s.interval = 1;
    else if (s.rep === 2) s.interval = 3;
    else s.interval = Math.round(s.interval * s.ef);
    s.ef = Math.max(1.3, s.ef + 0.1);
  } else {
    s.rep = 0;
    s.interval = 1;
    s.ef = Math.max(1.3, s.ef - 0.2);
  }
  s.next = Date.now() + s.interval * 86400000;
};

MemoryEngine.prototype.getDue = function(){
  var now = Date.now();
  var ids = [];
  for (var id in this.schedule) {
    if (this.schedule[id].next <= now) ids.push(id);
  }
  return ids;
};

MemoryEngine.prototype.getData = function(){
  // Shallow copy
  var copy = {};
  for (var k in this.schedule) copy[k] = Object.assign({}, this.schedule[k]);
  return copy;
};

MemoryEngine.prototype.load = function(d){
  if (d) this.schedule = d;
};


// ══════════════════════════════════════════
//  QUESTION POOL
// ══════════════════════════════════════════
function QuestionPool(){
  this.all = [];
  this.used = {};
}

QuestionPool.prototype.load = function(){
  var self = this;
  return fetch(CFG.DATA_DIR + 'questions.json')
    .then(function(r){
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(function(d){
      self.all = d.questions || [];
    })
    .catch(function(e){
      console.error('[PhysicsQuest] Failed to load questions:', e);
      self.all = [];
    });
};

QuestionPool.prototype.get = function(worldId, count){
  var self = this;
  var pool = this.all.filter(function(q){
    return q.world === worldId && !self.used[q.id];
  });
  if (pool.length < count) {
    // Reset used set for this world and try again
    this.all.forEach(function(q){
      if (q.world === worldId) delete self.used[q.id];
    });
    pool = this.all.filter(function(q){ return q.world === worldId; });
  }
  // Shuffle
  pool = pool.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, count);
  pool.forEach(function(q){ self.used[q.id] = true; });
  return pool;
};

QuestionPool.prototype.getById = function(id){
  for (var i = 0; i < this.all.length; i++) {
    if (this.all[i].id === id) return this.all[i];
  }
  return null;
};

QuestionPool.prototype.reset = function(){
  this.used = {};
};


// ══════════════════════════════════════════
//  ACHIEVEMENTS
// ══════════════════════════════════════════
var ACHIEVEMENTS = [
  { id: 'first_correct', name: 'First Light',      desc: 'Answer your first question correctly',  icon: '\u{1F4A1}', check: function(p){ return p.stats.correct >= 1; } },
  { id: 'streak_5',      name: 'Hot Streak',        desc: 'Get 5 correct answers in a row',        icon: '\u{1F525}', check: function(p){ return p.streak >= 5; } },
  { id: 'streak_10',     name: 'Unstoppable',       desc: '10 correct in a row',                   icon: '\u26A1',    check: function(p){ return p.streak >= 10; } },
  { id: 'correct_50',    name: 'Half Century',      desc: '50 correct answers total',              icon: '\u{1F3AF}', check: function(p){ return p.stats.correct >= 50; } },
  { id: 'correct_100',   name: 'Centurion',         desc: '100 correct answers total',             icon: '\u{1F4AF}', check: function(p){ return p.stats.correct >= 100; } },
  { id: 'world_1',       name: 'Motion Master',     desc: 'Complete Motion Valley',                icon: '\u{1F3C3}', check: function(p){ return (p.worldsCompleted || []).indexOf('motion') !== -1; } },
  { id: 'boss_1',        name: 'Newton Defeated',   desc: 'Defeat Sir Isaac Newton',               icon: '\u{1F34E}', check: function(p){ return (p.bossesDefeated || []).indexOf('motion') !== -1; } },
  { id: 'creature_3',    name: 'Collector',         desc: 'Collect 3 Physics Spirits',             icon: '\u{1F9EC}', check: function(p){ return (p.creatures || []).length >= 3; } },
  { id: 'creature_all',  name: 'Spirit Master',     desc: 'Collect all 11 Physics Spirits',        icon: '\u{1F451}', check: function(p){ return (p.creatures || []).length >= 11; } },
  { id: 'level_5',       name: 'Rising Star',       desc: 'Reach Player Level 5',                  icon: '\u2B50',    check: function(p){ return p.level >= 5; } },
  { id: 'coins_500',     name: 'Wealthy Scientist', desc: 'Accumulate 500 coins',                  icon: '\u{1F4B0}', check: function(p){ return p.coins >= 500; } },
  { id: 'perfect_level', name: 'Flawless',          desc: 'Complete a level with 100% accuracy',   icon: '\u{1F48E}', check: function(p){ return p.stats.perfectLevels >= 1; } }
];


// ══════════════════════════════════════════════════════
//  MAIN GAME CLASS
// ══════════════════════════════════════════════════════
function PhysicsQuest(root){
  this.root = root;
  this.audio = new AudioEngine();
  this.save = new SaveManager();
  this.memory = new MemoryEngine();
  this.questions = new QuestionPool();

  this.player = null;
  this.worldData = null;
  this.creaturesData = null;
  this.gadgetsData = null;

  this.state = 'title';
  this.currentWorld = null;
  this.currentLevel = null;
  this.levelQs = [];
  this.qIdx = 0;
  this.levelCorrect = 0;

  this.battleState = null;
  this._toasts = [];
  this._animating = false;
}

// ── Initialization ──
PhysicsQuest.prototype.init = function(){
  var self = this;
  return this.save.init()
    .then(function(){ return self._loadData(); })
    .then(function(){
      // *** FIX: Load questions BEFORE any rendering ***
      return self.questions.load();
    })
    .then(function(){ return self.save.load(); })
    .then(function(saved){
      if (saved && saved.player) {
        self.player = saved.player;
        self.memory.load(saved.memory);
      } else {
        self._newPlayer();
      }
      self.audio.init();
      self._buildShell();
      self._render();
    });
};

PhysicsQuest.prototype._loadData = function(){
  var self = this;
  return Promise.all([
    fetch(CFG.DATA_DIR + 'levels.json').then(function(r){ return r.json(); }),
    fetch(CFG.DATA_DIR + 'creatures.json').then(function(r){ return r.json(); }),
    fetch(CFG.DATA_DIR + 'gadgets.json').then(function(r){ return r.json(); })
  ]).then(function(results){
    self.worldData = results[0].worlds || [];
    self.creaturesData = results[1].creatures || [];
    self.gadgetsData = results[2].gadgets || [];
  }).catch(function(e){
    console.error('[PhysicsQuest] Failed to load data files:', e);
    self.worldData = [];
    self.creaturesData = [];
    self.gadgetsData = [];
  });
};

PhysicsQuest.prototype._newPlayer = function(){
  this.player = {
    name: 'Scientist',
    xp: 0,
    level: 1,
    coins: 100,
    hp: CFG.PLAYER_HP,
    streak: 0,
    bestStreak: 0,
    stats: { correct: 0, wrong: 0, played: 0, perfectLevels: 0, totalLevels: 0 },
    worldsUnlocked: ['motion'],
    worldsCompleted: [],
    levelsCompleted: {},
    levelStars: {},
    bossesDefeated: [],
    creatures: [],
    gadgets: {
      jet_boots: 2,
      gravity_belt: 1,
      photon_shield: 0,
      laser_compass: 1,
      rocket_pack: 0,
      quantum_scanner: 0,
      magnetic_gloves: 0,
      electric_hammer: 0,
      time_stabilizer: 0
    },
    achievements: [],
    settings: { sfx: true, music: false, vol: 0.4 },
    dailyStreak: 0,
    lastLogin: null
  };
};

PhysicsQuest.prototype._save = function(){
  this.save.save({
    player: this.player,
    memory: this.memory.getData(),
    ver: CFG.VERSION
  });
};

// ── Build DOM shell ──
PhysicsQuest.prototype._buildShell = function(){
  this.root.innerHTML =
    '<div class="pq-wrap">' +
      '<div class="pq-hud" id="pq-hud"></div>' +
      '<div class="pq-content" id="pq-content"></div>' +
      '<div class="pq-toasts" id="pq-toasts"></div>' +
    '</div>';
  this.hud = this.root.querySelector('#pq-hud');
  this.content = this.root.querySelector('#pq-content');
  this.toastsEl = this.root.querySelector('#pq-toasts');

  var self = this;
  this.content.addEventListener('click', function(e){ self._handleClick(e); });
  this.hud.addEventListener('click', function(e){ self._handleClick(e); });
  this.toastsEl.addEventListener('click', function(e){ self._handleClick(e); });
};

// ── Event delegation ──
PhysicsQuest.prototype._handleClick = function(e){
  var t = e.target.closest('[data-a]');
  if (!t || this._animating) return;
  this.audio.click();

  var action = t.dataset.a;
  var d = t.dataset;

  switch(action){
    case 'new-game':       this._startNew(); break;
    case 'continue':       this._setState('worldmap'); break;
    case 'enter-world':    this._enterWorld(d.world); break;
    case 'enter-level':    this._enterLevel(d.level); break;
    case 'start-level':    this._startLevel(); break;
    case 'answer':         this._handleAnswer(+d.idx); break;
    case 'next-q':         this._nextQuestion(); break;
    case 'back-worlds':    this._setState('worldmap'); break;
    case 'back-levels':    this._enterWorld(this.currentWorld ? this.currentWorld.id : null); break;
    case 'collection':     this._setState('collection'); break;
    case 'shop':           this._setState('shop'); break;
    case 'buy-gadget':     this._buyGadget(d.gadget); break;
    case 'use-gadget':     this._useGadget(d.gadget); break;
    case 'settings':       this._setState('settings'); break;
    case 'toggle-sfx':     this._toggleSfx(); break;
    case 'vol-change':     this.player.settings.vol = +t.value; this.audio.setVolume(+t.value); this._save(); break;
    case 'start-battle':   this._startBattle(); break;
    case 'battle-answer':  this._battleAnswer(+d.idx); break;
    case 'battle-next':    this._battleNextQ(); break;
    case 'results-continue': this._setState('worldmap'); break;
    case 'close':          this._close(); break;
    case 'achievements':   this._setState('achievements'); break;
  }
};

// ── State machine ──
PhysicsQuest.prototype._setState = function(s, data){
  this.state = s;
  this._renderState(data || {});
};

PhysicsQuest.prototype._render = function(){
  this._renderHUD();
  this._renderState({});
};

PhysicsQuest.prototype._renderHUD = function(){
  var p = this.player;
  if (!p) return;
  var show = (this.state !== 'title');
  this.hud.style.display = show ? 'flex' : 'none';
  if (!show) return;

  this.hud.innerHTML =
    '<div class="pq-hud-left">' +
      '<button class="pq-hud-btn" data-a="back-worlds" title="World Map">\u{1F5FA}\uFE0F</button>' +
      '<span class="pq-level-badge">Lv ' + p.level + '</span>' +
    '</div>' +
    '<div class="pq-hud-center">' + this._stateTitle() + '</div>' +
    '<div class="pq-hud-right">' +
      '<span class="pq-xp-badge">\u26A1 ' + p.xp + ' XP</span>' +
      '<span class="pq-coin-badge">\u{1FA99} ' + p.coins + '</span>' +
      '<button class="pq-hud-btn" data-a="collection" title="Collection">\u{1F4E6}</button>' +
      '<button class="pq-hud-btn" data-a="shop" title="Gadget Shop">\u{1F6D2}</button>' +
      '<button class="pq-hud-btn" data-a="settings" title="Settings">\u2699\uFE0F</button>' +
      '<button class="pq-hud-btn" data-a="close" title="Exit Game">\u2715</button>' +
    '</div>';
};

PhysicsQuest.prototype._stateTitle = function(){
  var map = {
    title: 'Physics Quest',
    worldmap: 'World Map',
    levelselect: 'Level Select',
    gameplay: 'Mission',
    battle: 'Boss Battle',
    results: 'Results',
    collection: 'Collection',
    shop: 'Gadget Shop',
    settings: 'Settings',
    achievements: 'Achievements'
  };
  return map[this.state] || '';
};

PhysicsQuest.prototype._renderState = function(data){
  this._renderHUD();
  var html = '';
  switch(this.state){
    case 'title':         html = this._rTitle(); break;
    case 'worldmap':      html = this._rWorldMap(); break;
    case 'levelselect':   html = this._rLevelSelect(); break;
    case 'gameplay':      html = this._rGameplay(); break;
    case 'battle':        html = this._rBattle(); break;
    case 'results':       html = this._rResults(data); break;
    case 'collection':    html = this._rCollection(); break;
    case 'shop':          html = this._rShop(); break;
    case 'settings':      html = this._rSettings(); break;
    case 'achievements':  html = this._rAchievements(); break;
  }
  this.content.innerHTML = html;
  this.content.scrollTop = 0;
};


// ══════════════════════
//  TITLE SCREEN
// ══════════════════════
PhysicsQuest.prototype._rTitle = function(){
  var hasSave = (this.player && this.player.stats.played > 0);
  return '<div class="pq-title">' +
    '<div class="pq-title-atom">' +
      '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">' +
        '<ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00C6FF" stroke-width="2" opacity=".5">' +
          '<animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/>' +
        '</ellipse>' +
        '<ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#a855f7" stroke-width="2" opacity=".5" transform="rotate(60 100 100)">' +
          '<animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/>' +
        '</ellipse>' +
        '<ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00df89" stroke-width="2" opacity=".5" transform="rotate(120 100 100)">' +
          '<animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/>' +
        '</ellipse>' +
        '<circle cx="100" cy="100" r="18" fill="#00C6FF"/>' +
        '<circle cx="100" cy="100" r="10" fill="#060810"/>' +
        '<circle cx="100" cy="100" r="5" fill="#00df89"/>' +
        '<circle cx="175" cy="100" r="5" fill="#00C6FF">' +
          '<animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/>' +
        '</circle>' +
        '<circle cx="145" cy="50" r="4" fill="#a855f7">' +
          '<animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/>' +
        '</circle>' +
        '<circle cx="55" cy="150" r="4" fill="#00df89">' +
          '<animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/>' +
        '</circle>' +
      '</svg>' +
    '</div>' +
    '<h1>Physics Quest</h1>' +
    '<p class="pq-tagline">Academy of Forces<br>Learn Physics. Play Adventures. Master Concepts.</p>' +
    '<div class="pq-title-buttons">' +
      (hasSave ? '<button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="continue">Continue Adventure</button>' : '') +
      '<button class="pq-btn ' + (hasSave ? 'pq-btn-secondary' : 'pq-btn-primary pq-btn-lg pq-btn-glow') + '" data-a="new-game">' + (hasSave ? 'New Game' : 'Start Adventure') + '</button>' +
      '<button class="pq-btn pq-btn-ghost" data-a="collection">Physics Spirit Collection</button>' +
    '</div>' +
    '<span class="pq-title-version">v' + CFG.VERSION + ' \u00B7 Prime Spirit Mentors</span>' +
  '</div>';
};

PhysicsQuest.prototype._startNew = function(){
  this._newPlayer();
  this.memory.schedule = {};
  this.questions.reset();
  this._save();
  this._setState('worldmap');
};


// ══════════════════════
//  WORLD MAP
// ══════════════════════
PhysicsQuest.prototype._rWorldMap = function(){
  var p = this.player;
  var self = this;
  var cards = '';
  (this.worldData || []).forEach(function(w){
    var unlocked = p.worldsUnlocked.indexOf(w.id) !== -1;
    var completed = p.worldsCompleted.indexOf(w.id) !== -1;
    var doneLevels = (p.levelsCompleted[w.id] || []).length;
    var total = w.levels.length;
    var pct = Math.round(doneLevels / total * 100);
    cards += '<div class="pq-world-card ' + (unlocked ? '' : 'locked') + '" ' +
      (unlocked ? 'data-a="enter-world" data-world="' + w.id + '"' : '') +
      ' style="--wcolor:' + w.color + '">' +
      '<span class="pq-world-badge">' + (completed ? '\u2713 DONE' : pct + '%') + '</span>' +
      '<div class="pq-world-icon">' + w.icon + '</div>' +
      '<h3>' + w.name + '</h3>' +
      '<p>' + w.desc + '</p>' +
      '<div class="pq-world-progress"><div class="pq-world-progress-fill" style="width:' + pct + '%;background:' + w.color + '"></div></div>' +
      (!unlocked ? '<p style="font-size:.7rem;color:var(--pq-muted);margin-top:8px">\u{1F512} Complete previous world to unlock</p>' : '') +
    '</div>';
  });

  return '<div class="pq-section-head"><h2>The Universe Awaits</h2><p>Each world holds the key to a Physics law stolen by Chaos. Restore them all.</p></div>' +
    '<div class="pq-worlds">' + cards + '</div>';
};

PhysicsQuest.prototype._enterWorld = function(worldId){
  if (!worldId) return;
  this.currentWorld = null;
  for (var i = 0; i < this.worldData.length; i++) {
    if (this.worldData[i].id === worldId) { this.currentWorld = this.worldData[i]; break; }
  }
  if (!this.currentWorld) return;
  this._setState('levelselect');
};


// ══════════════════════
//  LEVEL SELECT
// ══════════════════════
PhysicsQuest.prototype._rLevelSelect = function(){
  var w = this.currentWorld;
  if (!w) return '';
  var p = this.player;
  var done = p.levelsCompleted[w.id] || [];
  var items = '';

  w.levels.forEach(function(l, i){
    var isDone = done.indexOf(l.id) !== -1;
    var prev = (i === 0) || (done.indexOf(w.levels[i - 1].id) !== -1);
    var locked = !prev && !isDone;
    var stars = p.levelStars[l.id] || 0;
    var starsHtml = '';
    for (var s = 0; s < 3; s++) starsHtml += (s < stars ? '\u2605' : '\u2606');

    items += '<div class="pq-level-item ' + (locked ? 'locked' : '') + '" ' +
      (locked ? '' : 'data-a="enter-level" data-level="' + l.id + '"') + '>' +
      '<div class="pq-level-num ' + (isDone ? 'done' : (locked ? 'locked-n' : 'active')) + '">' +
        (isDone ? '\u2713' : (i + 1)) +
      '</div>' +
      '<div class="pq-level-info">' +
        '<h4>' + l.name + '</h4>' +
        '<span>\u26A1' + l.xp + ' XP \u00B7 \u{1FA99}' + l.coins + ' coins \u00B7 ' + l.count + ' questions</span>' +
      '</div>' +
      '<div class="pq-level-stars">' + starsHtml + '</div>' +
    '</div>';
  });

  var bossDone = p.bossesDefeated.indexOf(w.id) !== -1;
  var allDone = done.length >= w.levels.length;

  return '<div class="pq-levels">' +
    '<button class="pq-btn pq-btn-ghost pq-btn-sm pq-mb-2" data-a="back-worlds">\u2190 Back to Worlds</button>' +
    '<h2 style="color:' + w.color + '">' + w.icon + ' ' + w.name + '</h2>' +
    '<p class="pq-sub">' + w.desc + '</p>' +
    items +
    (allDone && !bossDone
      ? '<button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-block pq-boss-btn" data-a="start-battle">\u2694\uFE0F Challenge Boss: ' + w.boss.name + '</button>'
      : '') +
    (bossDone
      ? '<div class="pq-card pq-text-center pq-mt-2" style="color:var(--pq-green)">\u{1F3C6} Boss Defeated! World Complete!</div>'
      : '') +
  '</div>';
};

PhysicsQuest.prototype._enterLevel = function(levelId){
  if (!this.currentWorld || !levelId) return;
  this.currentLevel = null;
  for (var i = 0; i < this.currentWorld.levels.length; i++) {
    if (this.currentWorld.levels[i].id === levelId) {
      this.currentLevel = this.currentWorld.levels[i];
      break;
    }
  }
  if (!this.currentLevel) return;
  this._setState('gameplay');
};


// ══════════════════════
//  GAMEPLAY / QUESTIONS
// ══════════════════════
PhysicsQuest.prototype._startLevel = function(){
  var l = this.currentLevel;
  if (!l) return;

  // *** Fetch questions for this world and level ***
  this.levelQs = this.questions.get(this.currentWorld.id, l.count);

  // Debug log
  console.log('[PhysicsQuest] Loading level "' + l.name + '" — got ' + this.levelQs.length + ' questions for world "' + this.currentWorld.id + '"');

  this.qIdx = 0;
  this.levelCorrect = 0;
  this.player.hp = CFG.PLAYER_HP;
  this._setState('gameplay');
};

PhysicsQuest.prototype._rGameplay = function(){
  var l = this.currentLevel;
  if (!l) return this._rLevelIntro();

  // If no questions loaded, show intro (user needs to click Begin)
  if (!this.levelQs || this.levelQs.length === 0) return this._rLevelIntro();

  // If past all questions, should have been caught by _nextQuestion → show intro
  if (this.qIdx >= this.levelQs.length) return this._rLevelIntro();

  var q = this.levelQs[this.qIdx];
  if (!q) return this._rLevelIntro();

  var pct = Math.round(this.qIdx / this.levelQs.length * 100);
  var letters = ['A', 'B', 'C', 'D'];
  var opts = '';
  q.opts.forEach(function(o, i){
    opts += '<div class="pq-option" data-a="answer" data-idx="' + i + '">' +
      '<span class="pq-option-letter">' + letters[i] + '</span>' +
      '<span>' + o + '</span>' +
    '</div>';
  });

  var diffStars = '';
  for (var s = 0; s < 3; s++) diffStars += (s < q.diff ? '\u2605' : '\u2606');

  return '<div class="pq-play">' +
    '<div class="pq-progress-wrap">' +
      '<div class="pq-progress-label"><span>Question ' + (this.qIdx + 1) + ' of ' + this.levelQs.length + '</span><span>' + this.levelCorrect + ' correct</span></div>' +
      '<div class="pq-progress-bar"><div class="pq-progress-fill" style="width:' + pct + '%"></div></div>' +
    '</div>' +
    '<div class="pq-question-card">' +
      '<div class="pq-q-num">DIFFICULTY ' + diffStars + '</div>' +
      '<p class="pq-q-text">' + q.q + '</p>' +
      (q.formula ? '<div class="pq-q-formula">' + q.formula + '</div>' : '') +
    '</div>' +
    '<div class="pq-options" id="pq-options">' + opts + '</div>' +
    '<div id="pq-feedback-area"></div>' +
  '</div>';
};

PhysicsQuest.prototype._rLevelIntro = function(){
  var l = this.currentLevel;
  var w = this.currentWorld;
  if (!l || !w) return '';
  return '<div class="pq-results">' +
    '<div class="pq-results-icon">' + w.icon + '</div>' +
    '<h2>' + l.name + '</h2>' +
    '<p class="pq-sub">' + w.name + ' \u00B7 ' + l.count + ' Questions \u00B7 \u26A1' + l.xp + ' XP \u00B7 \u{1FA99}' + l.coins + ' Coins</p>' +
    '<p class="pq-mb-2" style="font-size:.85rem;color:var(--pq-sec)">Answer all questions to earn XP, coins, and level stars. Get 90%+ for 3 stars!</p>' +
    '<div class="pq-results-buttons">' +
      '<button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="start-level">Begin Mission</button>' +
      '<button class="pq-btn pq-btn-ghost" data-a="back-levels">\u2190 Back</button>' +
    '</div>' +
  '</div>';
};

PhysicsQuest.prototype._handleAnswer = function(idx){
  var q = this.levelQs[this.qIdx];
  if (!q) return;

  var correct = (idx === q.ans);
  var opts = this.content.querySelectorAll('.pq-option');

  for (var i = 0; i < opts.length; i++) {
    opts[i].classList.add('disabled');
    if (i === q.ans) opts[i].classList.add('correct');
    if (i === idx && !correct) opts[i].classList.add('wrong');
  }

  var p = this.player;
  p.stats.played++;

  if (correct) {
    p.stats.correct++;
    this.levelCorrect++;
    p.streak++;
    if (p.streak > p.bestStreak) p.bestStreak = p.streak;
    p.xp += CFG.XP_PER_CORRECT;
    p.coins += CFG.COIN_PER_CORRECT;
    this.audio.correct();
    this._toast('+' + CFG.XP_PER_CORRECT + ' XP', 'xp');
    this._toast('+' + CFG.COIN_PER_CORRECT + ' Coins', 'coin');
  } else {
    p.stats.wrong++;
    p.streak = 0;
    this.audio.wrong();
  }

  this.memory.add(q.id);
  this.memory.record(q.id, correct);
  this._checkLevelUp();
  this._checkAchievements();

  // Show feedback
  var fbArea = this.content.querySelector('#pq-feedback-area');
  if (fbArea) fbArea.innerHTML = this._feedbackHTML(q, correct);

  this._renderHUD();
  this._save();
};

PhysicsQuest.prototype._feedbackHTML = function(q, correct){
  var robotTip = '';
  if (!correct && q.tip) {
    robotTip =
      '<div class="pq-robot">' +
        '<div class="pq-robot-avatar">\u{1F916}</div>' +
        '<div class="pq-robot-text"><strong>Science Bot says:</strong> ' + q.tip + '</div>' +
      '</div>';
  }
  return '<div class="pq-feedback ' + (correct ? 'correct-fb' : 'wrong-fb') + '">' +
    '<div class="pq-fb-title"><span class="pq-fb-icon">' + (correct ? '\u2705' : '\u274C') + '</span>' + (correct ? 'Correct!' : 'Not quite!') + '</div>' +
    '<div class="pq-fb-explain">' + q.explain + '</div>' +
    (q.formula ? '<div class="pq-fb-formula">\u{1F4D0} ' + q.formula + '</div>' : '') +
    robotTip +
  '</div>' +
  '<div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-primary" data-a="next-q">Next Question \u2192</button></div>';
};

PhysicsQuest.prototype._nextQuestion = function(){
  this.qIdx++;
  if (this.qIdx >= this.levelQs.length) {
    this._completeLevel();
    return;
  }
  this._setState('gameplay');
};

PhysicsQuest.prototype._completeLevel = function(){
  var l = this.currentLevel;
  var w = this.currentWorld;
  var p = this.player;
  var total = this.levelQs.length;
  var pct = total > 0 ? Math.round(this.levelCorrect / total * 100) : 0;
  var stars = pct >= 90 ? 3 : (pct >= 70 ? 2 : (pct >= 50 ? 1 : 0));

  var xpBonus = l.xp;
  var coinBonus = l.coins;
  p.xp += xpBonus;
  p.coins += coinBonus;

  // Record completion
  if (!p.levelsCompleted[w.id]) p.levelsCompleted[w.id] = [];
  if (p.levelsCompleted[w.id].indexOf(l.id) === -1) p.levelsCompleted[w.id].push(l.id);

  // Update stars (best only)
  p.levelStars[l.id] = Math.max(stars, p.levelStars[l.id] || 0);

  p.stats.totalLevels++;
  if (pct === 100) p.stats.perfectLevels++;

  // Unlock next world if all levels done
  var allDone = p.levelsCompleted[w.id].length >= w.levels.length;
  var nextId = this._nextWorldId(w.id);
  if (allDone && nextId && p.worldsUnlocked.indexOf(nextId) === -1) {
    p.worldsUnlocked.push(nextId);
  }
  if (allDone && p.worldsCompleted.indexOf(w.id) === -1) {
    p.worldsCompleted.push(w.id);
  }

  this.audio.levelUp();
  this._toast('+' + xpBonus + ' XP', 'xp');
  this._toast('+' + coinBonus + ' Coins', 'coin');
  this._checkLevelUp();
  this._checkAchievements();
  this._save();

  this._setState('results', { pct: pct, stars: stars, xpBonus: xpBonus, coinBonus: coinBonus, allDone: allDone });
};

PhysicsQuest.prototype._rResults = function(d){
  var starsCount = d.stars || 0;
  var starsHtml = '';
  for (var i = 0; i < 3; i++) starsHtml += (i < starsCount ? '\u2605' : '\u2606');

  return '<div class="pq-results">' +
    '<div class="pq-results-icon">' + (starsCount >= 3 ? '\u{1F3C6}' : (starsCount >= 2 ? '\u2B50' : '\u2705')) + '</div>' +
    '<h2>Mission Complete!</h2>' +
    '<p class="pq-sub">' + (this.currentLevel ? this.currentLevel.name : '') + '</p>' +
    '<div class="pq-results-stars">' + starsHtml + '</div>' +
    '<div class="pq-results-stats">' +
      '<div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">' + this.levelCorrect + '/' + this.levelQs.length + '</div><div class="pq-stat-lbl">Correct</div></div>' +
      '<div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-accent)">' + (d.pct || 0) + '%</div><div class="pq-stat-lbl">Accuracy</div></div>' +
      '<div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">' + (d.xpBonus || 0) + '</div><div class="pq-stat-lbl">XP Earned</div></div>' +
    '</div>' +
    (d.allDone
      ? '<div class="pq-card pq-text-center pq-mb-2" style="border-color:var(--pq-purple);color:var(--pq-purple)">\u2694\uFE0F All levels complete! Challenge the boss!</div>'
      : '') +
    '<div class="pq-results-buttons">' +
      '<button class="pq-btn pq-btn-primary" data-a="back-levels">Continue</button>' +
      '<button class="pq-btn pq-btn-ghost" data-a="back-worlds">World Map</button>' +
    '</div>' +
  '</div>';
};

PhysicsQuest.prototype._nextWorldId = function(current){
  for (var i = 0; i < this.worldData.length; i++) {
    if (this.worldData[i].id === current && i < this.worldData.length - 1) {
      return this.worldData[i + 1].id;
    }
  }
  return null;
};

PhysicsQuest.prototype._checkLevelUp = function(){
  var p = this.player;
  var curve = CFG.XP_CURVE;
  while (p.level < curve.length - 1 && p.xp >= curve[p.level]) {
    p.level++;
    this._toast('Level Up! Lv ' + p.level, 'level');
    this.audio.levelUp();
  }
};


// ══════════════════════
//  BOSS BATTLE
// ══════════════════════
PhysicsQuest.prototype._startBattle = function(){
  var w = this.currentWorld;
  if (!w) return;

  var bossQs = this.questions.get(w.id, 10);
  console.log('[PhysicsQuest] Boss battle loaded ' + bossQs.length + ' questions for world "' + w.id + '"');

  this.battleState = {
    bossHp: w.boss.hp,
    playerHp: CFG.PLAYER_HP,
    maxBossHp: w.boss.hp,
    qs: bossQs,
    qIdx: 0,
    phase: 'intro',
    gadgetEffects: []
  };
  this._setState('battle');
};

PhysicsQuest.prototype._rBattle = function(){
  var b = this.battleState;
  var w = this.currentWorld;
  if (!b || !w) return '';
  var boss = w.boss;

  // INTRO
  if (b.phase === 'intro') {
    var phraseIdx = Math.floor(Math.random() * boss.phrases.length);
    return '<div class="pq-results">' +
      '<div class="pq-boss-avatar" style="border-color:' + w.color + '">' + w.icon + '</div>' +
      '<h2 style="color:var(--pq-red)">' + boss.name + '</h2>' +
      '<p class="pq-sub">' + boss.title + '</p>' +
      '<p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"' + boss.phrases[phraseIdx] + '"</p>' +
      '<p class="pq-mb-2" style="font-size:.85rem">Answer questions correctly to deal damage. Wrong answers cost you HP!</p>' +
      '<button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-glow" data-a="battle-answer" data-idx="-1">\u2694\uFE0F Begin Battle!</button>' +
    '</div>';
  }

  // WON
  if (b.phase === 'won') {
    return '<div class="pq-results">' +
      '<div class="pq-results-icon">\u{1F3C6}</div>' +
      '<h2>Victory!</h2>' +
      '<p class="pq-sub">' + boss.name + ' has been defeated!</p>' +
      '<p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"' + boss.phrases[boss.phrases.length - 1] + '"</p>' +
      '<div class="pq-results-stats">' +
        '<div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">+' + CFG.XP_BOSS_WIN + '</div><div class="pq-stat-lbl">XP</div></div>' +
        '<div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">+' + CFG.COIN_BOSS_WIN + '</div><div class="pq-stat-lbl">Coins</div></div>' +
        '<div class="pq-stat-box"><div class="pq-stat-val">\u{1F9EC}</div><div class="pq-stat-lbl">Spirit</div></div>' +
      '</div>' +
      '<div class="pq-results-buttons"><button class="pq-btn pq-btn-primary" data-a="results-continue">Continue</button></div>' +
    '</div>';
  }

  // LOST
  if (b.phase === 'lost') {
    return '<div class="pq-results">' +
      '<div class="pq-results-icon">\u{1F480}</div>' +
      '<h2>Defeated</h2>' +
      '<p class="pq-sub">' + boss.name + ' was too strong this time.</p>' +
      '<div class="pq-results-buttons">' +
        '<button class="pq-btn pq-btn-danger pq-btn-lg" data-a="start-battle">Retry Battle</button>' +
        '<button class="pq-btn pq-btn-ghost" data-a="back-levels">Train More</button>' +
      '</div>' +
    '</div>';
  }

  // FIGHT — show question
  var q = b.qs[b.qIdx];
  if (!q) return '<div class="pq-text-center pq-mt-3"><p>No more questions available.</p><button class="pq-btn pq-btn-primary" data-a="back-levels">Back</button></div>';

  var letters = ['A', 'B', 'C', 'D'];
  var opts = '';
  q.opts.forEach(function(o, i){
    opts += '<div class="pq-option" data-a="battle-answer" data-idx="' + i + '">' +
      '<span class="pq-option-letter">' + letters[i] + '</span>' +
      '<span>' + o + '</span>' +
    '</div>';
  });

  var bossPct = Math.round(b.bossHp / b.maxBossHp * 100);
  var playerPct = Math.round(b.playerHp / CFG.PLAYER_HP * 100);

  // Gadgets
  var gadgetBtns = '';
  var self = this;
  Object.keys(this.player.gadgets).forEach(function(id){
    var count = self.player.gadgets[id];
    if (count <= 0) return;
    var g = null;
    for (var i = 0; i < self.gadgetsData.length; i++) {
      if (self.gadgetsData[i].id === id) { g = self.gadgetsData[i]; break; }
    }
    if (!g) return;
    gadgetBtns += '<button class="pq-gadget-btn" data-a="use-gadget" data-gadget="' + id + '" title="' + g.name + ': ' + g.desc + '">' +
      g.icon + '<span class="pq-gadget-count">' + count + '</span></button>';
  });

  return '<div class="pq-battle">' +
    '<div class="pq-boss-header">' +
      '<div class="pq-boss-avatar" style="border-color:' + w.color + '">' + w.icon + '</div>' +
      '<div class="pq-boss-name">' + boss.name + '</div>' +
      '<div class="pq-boss-title">' + boss.title + '</div>' +
    '</div>' +
    '<div class="pq-hp-bars">' +
      '<div class="pq-hp-row"><span class="pq-hp-label" style="color:var(--pq-green)">YOU</span><div class="pq-hp-bar"><div class="pq-hp-fill player-hp" style="width:' + playerPct + '%"></div></div><span class="pq-hp-value">' + b.playerHp + '</span></div>' +
      '<div class="pq-hp-row"><span class="pq-hp-label" style="color:var(--pq-red)">BOSS</span><div class="pq-hp-bar"><div class="pq-hp-fill boss-hp" style="width:' + bossPct + '%"></div></div><span class="pq-hp-value">' + b.bossHp + '</span></div>' +
    '</div>' +
    (gadgetBtns ? '<div class="pq-gadget-bar">' + gadgetBtns + '</div>' : '') +
    '<div class="pq-question-card">' +
      '<div class="pq-q-num">Q ' + (b.qIdx + 1) + ' of ' + b.qs.length + '</div>' +
      '<p class="pq-q-text">' + q.q + '</p>' +
      (q.formula ? '<div class="pq-q-formula">' + q.formula + '</div>' : '') +
    '</div>' +
    '<div class="pq-options" id="pq-battle-opts">' + opts + '</div>' +
    '<div id="pq-battle-fb"></div>' +
  '</div>';
};

PhysicsQuest.prototype._battleAnswer = function(idx){
  var b = this.battleState;
  if (!b) return;

  // Intro → start fight
  if (b.phase !== 'fight') {
    b.phase = 'fight';
    this._setState('battle');
    return;
  }

  var q = b.qs[b.qIdx];
  if (!q) return;

  var correct = (idx === q.ans);
  var opts = this.content.querySelectorAll('.pq-option');
  for (var i = 0; i < opts.length; i++) {
    opts[i].classList.add('disabled');
    if (i === q.ans) opts[i].classList.add('correct');
    if (i === idx && !correct) opts[i].classList.add('wrong');
  }

  var p = this.player;
  p.stats.played++;

  if (correct) {
    p.stats.correct++;
    p.streak++;
    p.xp += CFG.XP_PER_CORRECT;
    p.coins += CFG.COIN_PER_CORRECT;

    var dmg = CFG.DMG_CORRECT;
    // Check double damage gadget
    var ddIdx = b.gadgetEffects.indexOf('double_damage');
    if (ddIdx !== -1) {
      dmg *= 2;
      b.gadgetEffects.splice(ddIdx, 1);
    }
    b.bossHp = Math.max(0, b.bossHp - dmg);
    this.audio.bossHit();
    this._toast('-' + dmg + ' Boss HP!', 'xp');
    this._toast('+' + CFG.XP_PER_CORRECT + ' XP', 'xp');
  } else {
    p.stats.wrong++;
    p.streak = 0;

    var dmgW = CFG.DMG_WRONG;
    // Check shield gadget
    var shIdx = b.gadgetEffects.indexOf('shield');
    if (shIdx !== -1) {
      dmgW = Math.floor(dmgW / 2);
      b.gadgetEffects.splice(shIdx, 1);
    }
    // Check block gadget
    var blIdx = b.gadgetEffects.indexOf('block');
    if (blIdx !== -1) {
      dmgW = 0;
      b.gadgetEffects.splice(blIdx, 1);
    }
    b.playerHp = Math.max(0, b.playerHp - dmgW);
    this.audio.playerHit();
  }

  this.memory.add(q.id);
  this.memory.record(q.id, correct);
  this._checkAchievements();

  // Show feedback
  var fbArea = this.content.querySelector('#pq-battle-fb');
  if (fbArea) {
    fbArea.innerHTML =
      '<div class="pq-feedback ' + (correct ? 'correct-fb' : 'wrong-fb') + '" style="margin-top:16px">' +
        '<div class="pq-fb-title">' + (correct ? '\u2705 Direct Hit!' : '\u{1F4A5} Boss Attacks!') + '</div>' +
        '<div class="pq-fb-explain">' + q.explain + '</div>' +
        (q.formula ? '<div class="pq-fb-formula">\u{1F4D0} ' + q.formula + '</div>' : '') +
        (!correct && q.tip ? '<div class="pq-robot"><div class="pq-robot-avatar">\u{1F916}</div><div class="pq-robot-text"><strong>Science Bot:</strong> ' + q.tip + '</div></div>' : '') +
      '</div>' +
      '<div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-primary" data-a="battle-next">Next Round \u2192</button></div>';
  }

  this._renderHUD();
  this._save();
};

PhysicsQuest.prototype._battleNextQ = function(){
  var b = this.battleState;
  if (!b) return;

  if (b.bossHp <= 0) { this._battleVictory(); return; }
  if (b.playerHp <= 0) { b.phase = 'lost'; this._setState('battle'); return; }

  b.qIdx++;
  // Extend question pool if needed
  if (b.qIdx >= b.qs.length) {
    var moreQs = this.questions.get(this.currentWorld.id, 5);
    b.qs = b.qs.concat(moreQs);
    console.log('[PhysicsQuest] Extended boss questions to ' + b.qs.length);
  }
  this._setState('battle');
};

PhysicsQuest.prototype._battleVictory = function(){
  var b = this.battleState;
  var w = this.currentWorld;
  var p = this.player;
  b.phase = 'won';

  p.xp += CFG.XP_BOSS_WIN;
  p.coins += CFG.COIN_BOSS_WIN;

  if (p.bossesDefeated.indexOf(w.id) === -1) p.bossesDefeated.push(w.id);

  // Award creature
  var creature = w.creature;
  if (creature && p.creatures.indexOf(creature) === -1) {
    p.creatures.push(creature);
    var creatureName = creature.replace(/_/g, ' ');
    this._toast('New Spirit: ' + creatureName, 'creature');
    this.audio.creature();
  }

  this.audio.victory();
  this._toast('+' + CFG.XP_BOSS_WIN + ' XP', 'xp');
  this._toast('+' + CFG.COIN_BOSS_WIN + ' Coins', 'coin');
  this._checkLevelUp();
  this._checkAchievements();
  this._save();
  this._setState('battle');
};

PhysicsQuest.prototype._useGadget = function(gadgetId){
  var p = this.player;
  if (!p.gadgets[gadgetId] || p.gadgets[gadgetId] <= 0) return;

  var g = null;
  for (var i = 0; i < this.gadgetsData.length; i++) {
    if (this.gadgetsData[i].id === gadgetId) { g = this.gadgetsData[i]; break; }
  }
  if (!g) return;

  p.gadgets[gadgetId]--;
  var b = this.battleState;

  switch(g.effect) {
    case 'hint':
    case 'eliminate': {
      if (!b) break;
      var q = b.qs[b.qIdx];
      if (!q) break;
      var opts = this.content.querySelectorAll('#pq-battle-opts .pq-option');
      if (opts.length >= 4) {
        var wrongs = [];
        for (var j = 0; j < opts.length; j++) {
          if (j !== q.ans) wrongs.push(j);
        }
        wrongs.sort(function(){ return Math.random() - 0.5; });
        var remove = wrongs.slice(0, 2);
        remove.forEach(function(idx){
          opts[idx].style.opacity = '.3';
          opts[idx].style.pointerEvents = 'none';
        });
      }
      break;
    }
    case 'shield':
    case 'block':
    case 'double_damage':
    case 'xp_boost':
    case 'coin_boost':
      if (b) b.gadgetEffects.push(g.effect);
      break;
    case 'retry':
      if (b) b.playerHp = Math.min(CFG.PLAYER_HP, b.playerHp + 30);
      break;
  }

  this._toast('Used ' + g.name + '!', 'xp');
  this._save();
  this._setState('battle');
};


// ══════════════════════
//  COLLECTION
// ══════════════════════
PhysicsQuest.prototype._rCollection = function(){
  var p = this.player;
  var totalCreatures = (this.creaturesData || []).length;
  var cards = '';
  var self = this;

  (this.creaturesData || []).forEach(function(c){
    var owned = p.creatures.indexOf(c.id) !== -1;
    var svg = CREATURE_SVG[c.id] || '\u{1F9EC}';
    cards += '<div class="pq-creature-card ' + (owned ? '' : 'locked') + '">' +
      '<div class="pq-creature-svg-wrap">' + svg + '</div>' +
      '<h4>' + c.name + '</h4>' +
      '<p>' + (owned ? c.desc : '???') + '</p>' +
      '<span class="pq-creature-rarity pq-rarity-' + c.rarity + '">' + c.rarity + '</span>' +
    '</div>';
  });

  return '<div class="pq-collection">' +
    '<div class="pq-section-head"><h2>Physics Spirit Collection</h2><p>' + p.creatures.length + '/' + totalCreatures + ' spirits collected</p></div>' +
    '<div class="pq-creature-grid">' + cards + '</div>' +
    '<div class="pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back to World Map</button></div>' +
  '</div>';
};


// ══════════════════════
//  GADGET SHOP
// ══════════════════════
PhysicsQuest.prototype._rShop = function(){
  var p = this.player;
  var items = '';
  var self = this;

  (this.gadgetsData || []).forEach(function(g){
    var count = p.gadgets[g.id] || 0;
    var canBuy = p.coins >= g.cost;
    items += '<div class="pq-shop-item">' +
      '<div class="pq-shop-icon">' + g.icon + '</div>' +
      '<h4>' + g.name + (count > 0 ? ' (\u00D7' + count + ')' : '') + '</h4>' +
      '<p>' + g.desc + '</p>' +
      '<div class="pq-shop-price">\u{1FA99} ' + g.cost + '</div>' +
      '<button class="pq-btn pq-btn-sm ' + (canBuy ? 'pq-btn-success' : 'pq-btn-ghost') + '" data-a="buy-gadget" data-gadget="' + g.id + '"' +
        (!canBuy ? ' disabled' : '') + '>' +
        (canBuy ? 'Buy' : 'Not enough coins') +
      '</button>' +
    '</div>';
  });

  return '<div class="pq-collection">' +
    '<div class="pq-section-head"><h2>Gadget Shop</h2><p>Your coins: \u{1FA99} ' + p.coins + '</p></div>' +
    '<div class="pq-shop-grid">' + items + '</div>' +
    '<div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>' +
  '</div>';
};

PhysicsQuest.prototype._buyGadget = function(gadgetId){
  var p = this.player;
  var g = null;
  for (var i = 0; i < this.gadgetsData.length; i++) {
    if (this.gadgetsData[i].id === gadgetId) { g = this.gadgetsData[i]; break; }
  }
  if (!g || p.coins < g.cost) return;

  p.coins -= g.cost;
  p.gadgets[gadgetId] = (p.gadgets[gadgetId] || 0) + 1;
  this.audio.coin();
  this._toast('Bought ' + g.name + '!', 'coin');
  this._save();
  this._setState('shop');
};


// ══════════════════════
//  SETTINGS
// ══════════════════════
PhysicsQuest.prototype._rSettings = function(){
  var s = this.player.settings;
  var p = this.player;
  var accuracy = p.stats.played > 0 ? Math.round(p.stats.correct / p.stats.played * 100) : 0;

  return '<div class="pq-settings">' +
    '<h2>Settings</h2>' +
    '<div class="pq-setting-row"><label>Sound Effects</label><div class="pq-toggle ' + (s.sfx ? 'on' : '') + '" data-a="toggle-sfx"></div></div>' +
    '<div class="pq-setting-row"><label>Volume</label><input type="range" class="pq-range" min="0" max="1" step="0.1" value="' + s.vol + '" data-a="vol-change"></div>' +
    '<div class="pq-setting-row"><label>Player Level</label><span style="color:var(--pq-accent)">' + p.level + '</span></div>' +
    '<div class="pq-setting-row"><label>Total XP</label><span style="color:var(--pq-accent)">' + p.xp + '</span></div>' +
    '<div class="pq-setting-row"><label>Questions Answered</label><span style="color:var(--pq-accent)">' + p.stats.played + '</span></div>' +
    '<div class="pq-setting-row"><label>Accuracy</label><span style="color:var(--pq-accent)">' + accuracy + '%</span></div>' +
    '<div class="pq-setting-row"><label>Best Streak</label><span style="color:var(--pq-accent)">' + p.bestStreak + '</span></div>' +
    '<div class="pq-setting-row"><label>Creatures Collected</label><span style="color:var(--pq-accent)">' + p.creatures.length + '</span></div>' +
    '<div class="pq-mt-3 pq-text-center"><button class="pq-btn pq-btn-danger pq-btn-sm" data-a="new-game">Reset All Progress</button></div>' +
    '<div class="pq-mt-2 pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>' +
  '</div>';
};

PhysicsQuest.prototype._toggleSfx = function(){
  var s = this.player.settings;
  s.sfx = !s.sfx;
  this.audio.setMuted(!s.sfx);
  this._save();
  this._setState('settings');
};


// ══════════════════════
//  ACHIEVEMENTS
// ══════════════════════
PhysicsQuest.prototype._rAchievements = function(){
  var p = this.player;
  var items = '';

  ACHIEVEMENTS.forEach(function(a){
    var unlocked = p.achievements.indexOf(a.id) !== -1;
    items += '<div class="pq-card" style="opacity:' + (unlocked ? '1' : '.4') + ';text-align:center;padding:16px">' +
      '<div style="font-size:2rem;margin-bottom:6px">' + a.icon + '</div>' +
      '<h4 style="font-family:var(--pq-head);font-size:.85rem">' + a.name + '</h4>' +
      '<p style="font-size:.75rem;color:var(--pq-sec)">' + a.desc + '</p>' +
      (unlocked
        ? '<span style="font-size:.65rem;color:var(--pq-green)">\u2713 Unlocked</span>'
        : '<span style="font-size:.65rem;color:var(--pq-muted)">Locked</span>') +
    '</div>';
  });

  return '<div class="pq-collection">' +
    '<div class="pq-section-head"><h2>Achievements</h2><p>' + p.achievements.length + '/' + ACHIEVEMENTS.length + ' unlocked</p></div>' +
    '<div class="pq-creature-grid">' + items + '</div>' +
    '<div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">\u2190 Back</button></div>' +
  '</div>';
};

PhysicsQuest.prototype._checkAchievements = function(){
  var p = this.player;
  var self = this;
  ACHIEVEMENTS.forEach(function(a){
    if (p.achievements.indexOf(a.id) === -1 && a.check(p)) {
      p.achievements.push(a.id);
      self._toast('\u{1F3C6} ' + a.name, 'achievement');
      p.xp += CFG.XP_ACHIEVEMENT;
    }
  });
};


// ══════════════════════
//  TOAST NOTIFICATIONS
// ══════════════════════
PhysicsQuest.prototype._toast = function(msg, type){
  var el = document.createElement('div');
  el.className = 'pq-toast pq-toast-' + (type || 'xp');
  el.textContent = msg;
  this.toastsEl.appendChild(el);
  setTimeout(function(){
    el.style.opacity = '0';
    el.style.transform = 'translateX(40px)';
    el.style.transition = 'all .3s';
    setTimeout(function(){ el.remove(); }, 300);
  }, 2500);
};


// ══════════════════════
//  CLOSE / EXIT
// ══════════════════════
PhysicsQuest.prototype._close = function(){
  this._save();
  var ov = document.getElementById('pq-overlay');
  if (ov) ov.remove();
  document.body.style.overflow = '';
};


// ═══════════════════════════════════════════════════════
//  GLOBAL LAUNCHER
//  Exposed as window.PQGame.launch(containerElement)
// ═══════════════════════════════════════════════════════
window.PQGame = {
  _instance: null,

  launch: function(root){
    var self = this;
    // If already initialized, re-render into new root
    if (self._instance) {
      root.innerHTML = '';
      self._instance.root = root;
      self._instance._buildShell();
      self._instance._render();
      return Promise.resolve();
    }
    // First launch — create and initialize
    var game = new PhysicsQuest(root);
    self._instance = game;
    return game.init();
  }
};

})();
