(function(){
'use strict';

/* ═══════════════════════════════════════════════════════
   PHYSICS QUEST: ACADEMY OF FORCES — Game Engine v1.0
   Prime Spirit Mentors · primespirit.co.in
   ═══════════════════════════════════════════════════════ */

// ── Constants ──
const CFG={
  SAVE_KEY:'pq-save-v1',DB:'PhysicsQuestDB',STORE:'gamedata',
  DATA:'game/data/',VER:'1.0.0',
  XP_CURVE:[0,100,250,500,850,1300,1900,2700,3800,5200,7000,10000],
  PLAYER_HP:100,BOSS_HP_MULT:1,DMG_CORRECT:22,DMG_WRONG:15,
  XP_CORRECT:10,COIN_CORRECT:5,XP_LEVEL_BONUS:50,COIN_LEVEL_BONUS:30
};

// ── Creature SVG Art (original) ──
const CREATURE_SVG={
momentum_fox:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="65" rx="24" ry="18" fill="#ff9f43"/><circle cx="50" cy="42" r="17" fill="#ff9f43"/><polygon points="36,34 28,8 46,28" fill="#ee5a24"/><polygon points="64,34 72,8 54,28" fill="#ee5a24"/><polygon points="37,33 30,10 44,27" fill="#ffbe76"/><polygon points="63,33 70,10 56,27" fill="#ffbe76"/><circle cx="43" cy="39" r="3.5" fill="#2d3436"/><circle cx="57" cy="39" r="3.5" fill="#2d3436"/><circle cx="44" cy="38" r="1.2" fill="#fff"/><circle cx="58" cy="38" r="1.2" fill="#fff"/><ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#2d3436"/><path d="M46 50Q50 55 54 50" fill="none" stroke="#2d3436" stroke-width="1.3" stroke-linecap="round"/><ellipse cx="78" cy="72" rx="15" ry="6" fill="#ee5a24" transform="rotate(-15 78 72)"/><ellipse cx="82" cy="69" rx="8" ry="4" fill="#ffbe76" transform="rotate(-15 82 69)"/></svg>`,
vector_hawk:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="20" ry="28" fill="#8b5cf6"/><polygon points="50,12 44,30 56,30" fill="#a855f7"/><polygon points="10,50 30,44 30,56" fill="#7c3aed" opacity=".7"/><polygon points="90,50 70,44 70,56" fill="#7c3aed" opacity=".7"/><circle cx="44" cy="38" r="3" fill="#fff"/><circle cx="56" cy="38" r="3" fill="#fff"/><circle cx="44" cy="38" r="1.5" fill="#2d3436"/><circle cx="56" cy="38" r="1.5" fill="#2d3436"/><polygon points="50,44 46,48 54,48" fill="#f59e0b"/><path d="M38 55L50 80L62 55" fill="none" stroke="#c4b5fd" stroke-width="1.5"/><line x1="50" y1="65" x2="50" y2="80" stroke="#c4b5fd" stroke-width="1.5"/><circle cx="8" cy="50" r="3" fill="#f59e0b"/><circle cx="92" cy="50" r="3" fill="#f59e0b"/></svg>`,
gravion:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="45" width="40" height="35" rx="6" fill="#92400e"/><rect x="35" y="30" width="30" height="20" rx="4" fill="#b45309"/><circle cx="43" cy="38" r="3.5" fill="#fbbf24"/><circle cx="57" cy="38" r="3.5" fill="#fbbf24"/><rect x="26" y="50" width="8" height="25" rx="4" fill="#92400e"/><rect x="66" y="50" width="8" height="25" rx="4" fill="#92400e"/><rect x="34" y="80" width="12" height="8" rx="3" fill="#78350f"/><rect x="54" y="80" width="12" height="8" rx="3" fill="#78350f"/><circle cx="50" cy="55" r="6" fill="none" stroke="#fbbf24" stroke-width="1.5"/><text x="50" y="58" text-anchor="middle" font-size="7" font-weight="900" fill="#fbbf24">G</text></svg>`,
thermix:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="60" rx="22" ry="26" fill="#ef4444"/><ellipse cx="50" cy="60" rx="16" ry="20" fill="#f97316"/><ellipse cx="50" cy="58" rx="10" ry="14" fill="#fbbf24"/><circle cx="50" cy="50" r="5" fill="#fef3c7"/><circle cx="44" cy="42" r="3" fill="#fff"/><circle cx="56" cy="42" r="3" fill="#fff"/><circle cx="44" cy="42" r="1.5" fill="#2d3436"/><circle cx="56" cy="42" r="1.5" fill="#2d3436"/><path d="M44 52Q50 58 56 52" fill="none" stroke="#2d3436" stroke-width="1.5" stroke-linecap="round"/><polygon points="50,8 46,22 54,22" fill="#f97316"/><polygon points="35,15 33,28 40,24" fill="#ef4444" opacity=".7"/><polygon points="65,15 67,28 60,24" fill="#ef4444" opacity=".7"/></svg>`,
circuit_crab:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="62" rx="28" ry="18" fill="#0891b2"/><ellipse cx="50" cy="60" rx="22" ry="14" fill="#06b6d4"/><circle cx="42" cy="48" r="4" fill="#fff"/><circle cx="58" cy="48" r="4" fill="#fff"/><circle cx="42" cy="48" r="2" fill="#164e63"/><circle cx="58" cy="48" r="2" fill="#164e63"/><path d="M18 55L8 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/><path d="M82 55L92 40" stroke="#0e7490" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="38" r="5" fill="#ef4444"/><circle cx="92" cy="38" r="5" fill="#ef4444"/><line x1="38" y1="60" x2="62" y2="60" stroke="#0e7490" stroke-width="1.5" stroke-dasharray="3 2"/><circle cx="50" cy="60" r="3" fill="#22d3ee"/></svg>`,
voltix:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="28" fill="#0070f3"/><circle cx="50" cy="50" r="22" fill="#00C6FF"/><circle cx="50" cy="50" r="14" fill="#b3e5fc"/><circle cx="44" cy="44" r="3" fill="#fff"/><circle cx="56" cy="44" r="3" fill="#fff"/><circle cx="44" cy="44" r="1.5" fill="#001d3d"/><circle cx="56" cy="44" r="1.5" fill="#001d3d"/><path d="M46 52L50 46L54 52L50 48Z" fill="#f59e0b"/><polygon points="50,6 46,18 50,14 54,18" fill="#f59e0b"/><polygon points="50,94 46,82 50,86 54,82" fill="#f59e0b"/><polygon points="6,50 18,46 14,50 18,54" fill="#f59e0b"/><polygon points="94,50 82,46 86,50 82,54" fill="#f59e0b"/></svg>`,
hydron:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="55" rx="24" ry="20" fill="#7c3aed"/><ellipse cx="50" cy="53" rx="18" ry="15" fill="#8b5cf6"/><ellipse cx="50" cy="48" rx="8" ry="5" fill="#c4b5fd"/><circle cx="43" cy="44" r="3" fill="#ede9fe"/><circle cx="57" cy="44" r="3" fill="#ede9fe"/><circle cx="43" cy="44" r="1.5" fill="#2d3436"/><circle cx="57" cy="44" r="1.5" fill="#2d3436"/><path d="M46 50Q50 54 54 50" fill="none" stroke="#2d3436" stroke-width="1.2"/><ellipse cx="75" cy="62" rx="14" ry="5" fill="#6d28d9" transform="rotate(-10 75 62)"/><path d="M30 70Q20 82 35 85Q40 72 30 70Z" fill="#6d28d9"/><circle cx="50" cy="65" r="4" fill="none" stroke="#a78bfa" stroke-width="1.5"/><circle cx="50" cy="65" r="2" fill="#c4b5fd"/></svg>`,
photonix:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="50" rx="30" ry="20" fill="#ec4899" opacity=".3"/><polygon points="50,20 30,50 50,45 70,50" fill="#ec4899"/><polygon points="50,80 30,50 50,55 70,50" fill="#db2777"/><polygon points="50,20 40,50 50,42" fill="#f9a8d4" opacity=".6"/><polygon points="50,80 40,50 50,58" fill="#f472b6" opacity=".6"/><circle cx="50" cy="50" r="6" fill="#fce7f3"/><circle cx="48" cy="48" r="1.5" fill="#be185d"/><circle cx="52" cy="48" r="1.5" fill="#be185d"/><path d="M47 52Q50 55 53 52" fill="none" stroke="#be185d" stroke-width="1" stroke-linecap="round"/><circle cx="50" cy="50" r="10" fill="none" stroke="#f9a8d4" stroke-width=".8" stroke-dasharray="2 3" opacity=".5"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="8s" repeatCount="indefinite"/></circle></svg>`,
wave_dolphin:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><ellipse cx="45" cy="55" rx="28" ry="16" fill="#3b82f6"/><path d="M73 55Q85 42 80 55Q88 50 78 58Z" fill="#1d4ed8"/><circle cx="30" cy="50" r="3" fill="#fff"/><circle cx="30" cy="50" r="1.5" fill="#1e3a5f"/><path d="M17 54Q20 58 25 55" fill="none" stroke="#1e3a5f" stroke-width="1.2" stroke-linecap="round"/><path d="M38 60Q45 66 52 60Q59 66 66 60" fill="none" stroke="#93c5fd" stroke-width="1.5" opacity=".5"/><path d="M10 72Q25 65 40 72Q55 79 70 72Q85 65 95 72" fill="none" stroke="#60a5fa" stroke-width="2" opacity=".3"/><path d="M5 80Q20 73 35 80Q50 87 65 80Q80 73 95 80" fill="none" stroke="#60a5fa" stroke-width="1.5" opacity=".2"/></svg>`,
quark_sprite:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="20" fill="#a855f7" opacity=".4"/><circle cx="50" cy="50" r="14" fill="#00C6FF" opacity=".6"/><circle cx="50" cy="50" r="8" fill="#00df89"/><circle cx="46" cy="47" r="2" fill="#fff"/><circle cx="54" cy="47" r="2" fill="#fff"/><circle cx="46" cy="47" r="1" fill="#0a0e27"/><circle cx="54" cy="47" r="1" fill="#0a0e27"/><path d="M47 53Q50 56 53 53" fill="none" stroke="#0a0e27" stroke-width="1"/><circle cx="50" cy="50" r="30" fill="none" stroke="#00C6FF" stroke-width="1" stroke-dasharray="4 6" opacity=".3"><animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="6s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="38" fill="none" stroke="#a855f7" stroke-width="1" stroke-dasharray="3 8" opacity=".2"><animateTransform attributeName="transform" type="rotate" from="360 50 50" to="0 50 50" dur="10s" repeatCount="indefinite"/></circle><circle cx="78" cy="30" r="2" fill="#00C6FF" opacity=".6"><animate attributeName="opacity" values=".6;.2;.6" dur="2s" repeatCount="indefinite"/></circle><circle cx="22" cy="70" r="2" fill="#a855f7" opacity=".5"><animate attributeName="opacity" values=".5;.2;.5" dur="2.5s" repeatCount="indefinite"/></circle></svg>`
};

// ── Audio Engine (Web Audio API) ──
class AudioEngine{
  constructor(){this.ctx=null;this.muted=false;this.vol=0.4}
  init(){try{this.ctx=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}
  resume(){if(this.ctx&&this.ctx.state==='suspended')this.ctx.resume()}
  _tone(freq,dur,type,vol){
    if(this.muted||!this.ctx)return;this.resume();
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type||'sine';o.frequency.value=freq;
    g.gain.setValueAtTime((vol||this.vol)*0.3,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur);
    o.connect(g);g.connect(this.ctx.destination);o.start();o.stop(this.ctx.currentTime+dur);
  }
  correct(){this._tone(523,.08,'sine');setTimeout(()=>this._tone(659,.08,'sine'),80);setTimeout(()=>this._tone(784,.15,'sine'),160)}
  wrong(){this._tone(220,.15,'sawtooth',.2);setTimeout(()=>this._tone(180,.2,'sawtooth',.15),100)}
  coin(){this._tone(1200,.06,'sine');setTimeout(()=>this._tone(1600,.1,'sine'),60)}
  click(){this._tone(800,.04,'sine',.15)}
  victory(){this._tone(523,.1,'sine');setTimeout(()=>this._tone(659,.1,'sine'),100);setTimeout(()=>this._tone(784,.1,'sine'),200);setTimeout(()=>this._tone(1047,.25,'sine'),300)}
  levelUp(){this._tone(440,.1,'triangle');setTimeout(()=>this._tone(554,.1,'triangle'),80);setTimeout(()=>this._tone(659,.1,'triangle'),160);setTimeout(()=>this._tone(880,.3,'triangle'),240)}
  bossHit(){this._tone(150,.12,'square',.2);setTimeout(()=>this._tone(100,.15,'sawtooth',.15),80)}
  playerHit(){this._tone(200,.1,'sawtooth',.2);setTimeout(()=>this._tone(150,.15,'square',.15),80)}
  creature(){this._tone(600,.1,'sine');setTimeout(()=>this._tone(800,.1,'sine'),100);setTimeout(()=>this._tone(1000,.15,'sine'),200);setTimeout(()=>this._tone(1200,.2,'sine'),300)}
  setMuted(v){this.muted=v}
  setVolume(v){this.vol=v}
}

// ── Save Manager ──
class SaveManager{
  constructor(){this.db=null}
  async init(){
    return new Promise((res)=>{
      if(!window.indexedDB){res();return}
      const r=indexedDB.open(CFG.DB,1);
      r.onupgradeneeded=e=>{const d=e.target.result;if(!d.objectStoreNames.contains(CFG.STORE))d.createObjectStore(CFG.STORE)};
      r.onsuccess=e=>{this.db=e.target.result;res()};r.onerror=()=>res();
    });
  }
  async save(data){
    try{localStorage.setItem(CFG.SAVE_KEY,JSON.stringify(data))}catch(e){}
    if(!this.db)return;
    return new Promise((res)=>{
      try{const tx=this.db.transaction(CFG.STORE,'readwrite');tx.objectStore(CFG.STORE).put(data,'save');tx.oncomplete=res;tx.onerror=res}catch(e){res()}
    });
  }
  async load(){
    if(this.db){
      const d=await new Promise((res)=>{
        try{const tx=this.db.transaction(CFG.STORE,'readonly');const r=tx.objectStore(CFG.STORE).get('save');r.onsuccess=()=>res(r.result);r.onerror=()=>res(null)}catch(e){res(null)}
      });
      if(d)return d;
    }
    try{const s=localStorage.getItem(CFG.SAVE_KEY);return s?JSON.parse(s):null}catch(e){return null}
  }
}

// ── Memory Engine (SM-2 Spaced Repetition) ──
class MemoryEngine{
  constructor(){this.schedule={}}
  add(qid){if(!this.schedule[qid])this.schedule[qid]={interval:1,ef:2.5,next:Date.now()+864e5,rep:0}}
  record(qid,correct){
    const s=this.schedule[qid];if(!s)return;
    if(correct){s.rep++;s.interval=s.rep===1?1:s.rep===2?3:Math.round(s.interval*s.ef);s.ef=Math.max(1.3,s.ef+0.1)}else{s.rep=0;s.interval=1;s.ef=Math.max(1.3,s.ef-0.2)}
    s.next=Date.now()+s.interval*864e5;
  }
  getDue(){const n=Date.now();return Object.keys(this.schedule).filter(id=>this.schedule[id].next<=n)}
  getData(){return{...this.schedule}}
  load(d){if(d)this.schedule=d}
}

// ── Question Pool ──
class QuestionPool{
  constructor(){this.all=[];this.used=new Set()}
  async load(){
    try{const r=await fetch(CFG.DATA+'questions.json');const d=await r.json();this.all=d.questions||[]}catch(e){this.all=[]}
  }
  get(worldId,count){
    let pool=this.all.filter(q=>q.world===worldId&&!this.used.has(q.id));
    if(pool.length<count){this.used.clear();pool=this.all.filter(q=>q.world===worldId)}
    const shuffled=pool.sort(()=>Math.random()-.5).slice(0,count);
    shuffled.forEach(q=>this.used.add(q.id));
    return shuffled;
  }
  getById(id){return this.all.find(q=>q.id===id)}
  reset(){this.used.clear()}
}

// ── Achievement Definitions ──
const ACHIEVEMENTS=[
  {id:'first_correct',name:'First Light',desc:'Answer your first question correctly',icon:'💡',check:p=>p.stats.correct>=1},
  {id:'streak_5',name:'Hot Streak',desc:'Get 5 correct answers in a row',icon:'🔥',check:p=>p.streak>=5},
  {id:'streak_10',name:'Unstoppable',desc:'10 correct in a row',icon:'⚡',check:p=>p.streak>=10},
  {id:'correct_50',name:'Half Century',desc:'50 correct answers total',icon:'🎯',check:p=>p.stats.correct>=50},
  {id:'correct_100',name:'Centurion',desc:'100 correct answers total',icon:'💯',check:p=>p.stats.correct>=100},
  {id:'world_1',name:'Motion Master',desc:'Complete Motion Valley',icon:'🏃',check:p=>p.worldsCompleted?.includes('motion')},
  {id:'boss_1',name:'Newton Defeated',desc:'Defeat Sir Isaac Newton',icon:'🍎',check:p=>p.bossesDefeated?.includes('motion')},
  {id:'creature_3',name:'Collector',desc:'Collect 3 Physics Spirits',icon:'🧬',check:p=>(p.creatures||[]).length>=3},
  {id:'creature_all',name:'Spirit Master',desc:'Collect all 11 Physics Spirits',icon:'👑',check:p=>(p.creatures||[]).length>=11},
  {id:'level_5',name:'Rising Star',desc:'Reach Player Level 5',icon:'⭐',check:p=>p.level>=5},
  {id:'coins_500',name:'Wealthy Scientist',desc:'Accumulate 500 coins',icon:'💰',check:p=>p.coins>=500},
  {id:'perfect_level',name:'Flawless',desc:'Complete a level with 100% accuracy',icon:'💎',check:p=>p.stats.perfectLevels>=1}
];

// ── Main Game Class ──
class PhysicsQuest{
  constructor(root){
    this.root=root;this.audio=new AudioEngine();this.save=new SaveManager();this.memory=new MemoryEngine();this.questions=new QuestionPool();
    this.player=null;this.worldData=null;this.creaturesData=null;this.gadgetsData=null;
    this.state='title';this.currentWorld=null;this.currentLevel=null;this.levelQs=[];this.qIdx=0;this.levelCorrect=0;
    this.battleState=null;this._toasts=[];this._animating=false;
  }

  async init(){
    await this.save.init();
    await this._loadData();
    const saved=await this.save.load();
    if(saved){this.player=saved.player;this.memory.load(saved.memory)}else{this._newPlayer()}
    this.audio.init();this._buildShell();this._render();
  }

  async _loadData(){
    try{
      const[ls,cs,gs]=await Promise.all([fetch(CFG.DATA+'levels.json'),fetch(CFG.DATA+'creatures.json'),fetch(CFG.DATA+'gadgets.json')]);
      this.worldData=(await ls.json()).worlds;this.creaturesData=(await cs.json()).creatures;this.gadgetsData=(await gs.json()).gadgets;
    }catch(e){this.worldData=[];this.creaturesData=[];this.gadgetsData=[]}
  }

  _newPlayer(){
    this.player={
      name:'Scientist',xp:0,level:1,coins:100,hp:CFG.PLAYER_HP,
      streak:0,bestStreak:0,
      stats:{correct:0,wrong:0,played:0,perfectLevels:0,totalLevels:0},
      worldsUnlocked:['motion'],worldsCompleted:[],levelsCompleted:{},levelStars:{},
      bossesDefeated:[],creatures:[],gadgets:{jet_boots:2,gravity_belt:1,photon_shield:0,laser_compass:1,rocket_pack:0,quantum_scanner:0,magnetic_gloves:0,electric_hammer:0,time_stabilizer:0},
      achievements:[],settings:{sfx:true,music:false,vol:0.4},dailyStreak:0,lastLogin:null
    };
  }

  _save(){this.save.save({player:this.player,memory:this.memory.getData(),ver:CFG.VER})}

  _buildShell(){
    this.root.innerHTML=`<div class="pq-wrap">
      <div class="pq-hud" id="pq-hud"></div>
      <div class="pq-content" id="pq-content"></div>
      <div class="pq-toasts" id="pq-toasts"></div>
    </div>`;
    this.hud=this.root.querySelector('#pq-hud');this.content=this.root.querySelector('#pq-content');this.toastsEl=this.root.querySelector('#pq-toasts');
    this.content.addEventListener('click',e=>this._click(e));
    this.hud.addEventListener('click',e=>this._click(e));
    this.toastsEl.addEventListener('click',e=>this._click(e));
  }

  _click(e){
    const t=e.target.closest('[data-a]');if(!t||this._animating)return;
    this.audio.click();
    const a=t.dataset.a,d=t.dataset;
    switch(a){
      case 'new-game':this._startNew();break;
      case 'continue':this._setState('worldmap');break;
      case 'enter-world':this._enterWorld(d.world);break;
      case 'enter-level':this._enterLevel(d.level);break;
      case 'start-level':this._startLevel();break;
      case 'answer':this._handleAnswer(+d.idx);break;
      case 'next-q':this._nextQuestion();break;
      case 'back-worlds':this._setState('worldmap');break;
      case 'back-levels':this._enterWorld(this.currentWorld?.id);break;
      case 'collection':this._setState('collection');break;
      case 'shop':this._setState('shop');break;
      case 'buy-gadget':this._buyGadget(d.gadget);break;
      case 'use-gadget':this._useGadget(d.gadget);break;
      case 'settings':this._setState('settings');break;
      case 'toggle-sfx':this._toggleSfx();break;
      case 'vol-change':this.player.settings.vol=+t.value;this.audio.setVolume(+t.value);this._save();break;
      case 'start-battle':this._startBattle();break;
      case 'battle-answer':this._battleAnswer(+d.idx);break;
      case 'battle-next':this._battleNextQ();break;
      case 'results-continue':this._setState('worldmap');break;
      case 'close':this._close();break;
      case 'achievements':this._setState('achievements');break;
    }
  }

  _setState(s,data={}){
    this.state=s;this._renderState(data);
  }

  _render(){
    this._renderHUD();
    this._renderState();
  }

  _renderHUD(){
    const p=this.player;if(!p)return;
    const show=this.state!=='title';
    this.hud.style.display=show?'flex':'none';
    if(!show)return;
    this.hud.innerHTML=`
      <div class="pq-hud-left">
        <button class="pq-hud-btn" data-a="back-worlds" title="World Map">🗺️</button>
        <span class="pq-level-badge">Lv ${p.level}</span>
      </div>
      <div class="pq-hud-center">${this._stateTitle()}</div>
      <div class="pq-hud-right">
        <span class="pq-xp-badge">⚡ ${p.xp} XP</span>
        <span class="pq-coin-badge">🪙 ${p.coins}</span>
        <button class="pq-hud-btn" data-a="collection" title="Collection">📦</button>
        <button class="pq-hud-btn" data-a="shop" title="Gadget Shop">🛒</button>
        <button class="pq-hud-btn" data-a="settings" title="Settings">⚙️</button>
        <button class="pq-hud-btn" data-a="close" title="Exit Game">✕</button>
      </div>`;
  }

  _stateTitle(){
    const m={title:'Physics Quest',worldmap:'World Map',levelselect:'Level Select',gameplay:'Mission',battle:'Boss Battle',results:'Results',collection:'Collection',shop:'Gadget Shop',settings:'Settings',achievements:'Achievements'};
    return m[this.state]||'';
  }

  _renderState(data={}){
    this._renderHUD();
    const r={title:()=>this._rTitle(),worldmap:()=>this._rWorldMap(),levelselect:()=>this._rLevelSelect(),gameplay:()=>this._rGameplay(),battle:()=>this._rBattle(),results:()=>this._rResults(data),collection:()=>this._rCollection(),shop:()=>this._rShop(),settings:()=>this._rSettings(),achievements:()=>this._rAchievements()};
    if(r[this.state])this.content.innerHTML=r[this.state]();
    this.content.scrollTop=0;
  }

  // ── Title Screen ──
  _rTitle(){
    const hasSave=this.player.stats.played>0;
    return`<div class="pq-title">
      <div class="pq-title-atom"><svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00C6FF" stroke-width="2" opacity=".5"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#a855f7" stroke-width="2" opacity=".5" transform="rotate(60 100 100)"><animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/></ellipse>
        <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00df89" stroke-width="2" opacity=".5" transform="rotate(120 100 100)"><animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/></ellipse>
        <circle cx="100" cy="100" r="18" fill="#00C6FF"/><circle cx="100" cy="100" r="10" fill="#060810"/><circle cx="100" cy="100" r="5" fill="#00df89"/>
        <circle cx="175" cy="100" r="5" fill="#00C6FF"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/></circle>
        <circle cx="145" cy="50" r="4" fill="#a855f7"><animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/></circle>
        <circle cx="55" cy="150" r="4" fill="#00df89"><animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/></circle>
      </svg></div>
      <h1>Physics Quest</h1>
      <p class="pq-tagline">Academy of Forces<br>Learn Physics. Play Adventures. Master Concepts.</p>
      <div class="pq-title-buttons">
        ${hasSave?`<button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="continue">Continue Adventure</button>`:''}
        <button class="pq-btn ${hasSave?'pq-btn-secondary':'pq-btn-primary pq-btn-lg pq-btn-glow'}" data-a="new-game">${hasSave?'New Game':'Start Adventure'}</button>
        <button class="pq-btn pq-btn-ghost" data-a="collection">Physics Spirit Collection</button>
      </div>
      <span class="pq-title-version">v${CFG.VER} · Prime Spirit Mentors</span>
    </div>`;
  }

  _startNew(){
    this._newPlayer();this.memory.schedule={};this.questions.reset();this._save();this._setState('worldmap');
  }

  // ── World Map ──
  _rWorldMap(){
    const p=this.player;
    const cards=(this.worldData||[]).map((w,i)=>{
      const unlocked=p.worldsUnlocked.includes(w.id);
      const completed=p.worldsCompleted.includes(w.id);
      const doneLevels=(p.levelsCompleted[w.id]||[]).length;
      const total=w.levels.length;
      const pct=Math.round(doneLevels/total*100);
      return`<div class="pq-world-card ${unlocked?'':'locked'}" ${unlocked?`data-a="enter-world" data-world="${w.id}"`:''} style="--wcolor:${w.color}">
        <span class="pq-world-badge">${completed?'✓ DONE':pct+'%'}</span>
        <div class="pq-world-icon">${w.icon}</div>
        <h3>${w.name}</h3>
        <p>${w.desc}</p>
        <div class="pq-world-progress"><div class="pq-world-progress-fill" style="width:${pct}%;background:${w.color}"></div></div>
        ${!unlocked?'<p style="font-size:.7rem;color:var(--pq-muted);margin-top:8px">🔒 Complete previous world to unlock</p>':''}
      </div>`;
    }).join('');
    return`<div class="pq-section-head"><h2>The Universe Awaits</h2><p>Each world holds the key to a Physics law stolen by Chaos. Restore them all.</p></div><div class="pq-worlds">${cards}</div>`;
  }

  _enterWorld(worldId){
    this.currentWorld=this.worldData.find(w=>w.id===worldId);
    if(!this.currentWorld)return;
    this._setState('levelselect');
  }

  // ── Level Select ──
  _rLevelSelect(){
    const w=this.currentWorld;if(!w)return'';const p=this.player;
    const done=p.levelsCompleted[w.id]||[];
    const items=w.levels.map((l,i)=>{
      const isDone=done.includes(l.id);
      const prev=i===0||done.includes(w.levels[i-1].id);
      const locked=!prev&&!isDone;
      const stars=p.levelStars[l.id]||0;
      return`<div class="pq-level-item ${locked?'locked':''}" ${locked?'':`data-a="enter-level" data-level="${l.id}"`}>
        <div class="pq-level-num ${isDone?'done':locked?'locked-n':'active'}">${isDone?'✓':i+1}</div>
        <div class="pq-level-info">
          <h4>${l.name}</h4>
          <span>⚡${l.xp} XP · 🪙${l.coins} coins · ${l.count} questions</span>
        </div>
        <div class="pq-level-stars">${'★'.repeat(stars)}${'☆'.repeat(3-stars)}</div>
      </div>`;
    }).join('');
    const bossDone=p.bossesDefeated.includes(w.id);
    const allDone=done.length>=w.levels.length;
    return`<div class="pq-levels">
      <button class="pq-btn pq-btn-ghost pq-btn-sm pq-mb-2" data-a="back-worlds">← Back to Worlds</button>
      <h2 style="color:${w.color}">${w.icon} ${w.name}</h2>
      <p class="pq-sub">${w.desc}</p>
      ${items}
      ${allDone&&!bossDone?`<button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-block pq-boss-btn" data-a="start-battle">⚔️ Challenge Boss: ${w.boss.name}</button>`:''}
      ${bossDone?'<div class="pq-card pq-text-center pq-mt-2" style="color:var(--pq-green)">🏆 Boss Defeated! World Complete!</div>':''}
    </div>`;
  }

  _enterLevel(levelId){
    const w=this.currentWorld;if(!w)return;
    this.currentLevel=w.levels.find(l=>l.id===levelId);
    if(!this.currentLevel)return;
    this._setState('gameplay');
  }

  // ── Gameplay ──
  _startLevel(){
    const l=this.currentLevel;if(!l)return;
    this.levelQs=this.questions.get(this.currentWorld.id,l.count);
    this.qIdx=0;this.levelCorrect=0;this.player.hp=CFG.PLAYER_HP;
    this._setState('gameplay');
  }

  _rGameplay(){
    const l=this.currentLevel;if(!l)return this._rLevelIntro();
    if(this.qIdx>=this.levelQs.length)return this._rLevelIntro();
    const q=this.levelQs[this.qIdx];
    const pct=Math.round(this.qIdx/this.levelQs.length*100);
    const letters=['A','B','C','D'];
    const opts=q.opts.map((o,i)=>`<div class="pq-option" data-a="answer" data-idx="${i}"><span class="pq-option-letter">${letters[i]}</span><span>${o}</span></div>`).join('');
    return`<div class="pq-play">
      <div class="pq-progress-wrap">
        <div class="pq-progress-label"><span>Question ${this.qIdx+1} of ${this.levelQs.length}</span><span>${this.levelCorrect} correct</span></div>
        <div class="pq-progress-bar"><div class="pq-progress-fill" style="width:${pct}%"></div></div>
      </div>
      <div class="pq-question-card">
        <div class="pq-q-num">DIFFICULTY ${'★'.repeat(q.diff)}${'☆'.repeat(3-q.diff)}</div>
        <p class="pq-q-text">${q.q}</p>
        ${q.formula?`<div class="pq-q-formula">${q.formula}</div>`:''}
      </div>
      <div class="pq-options" id="pq-options">${opts}</div>
      <div id="pq-feedback-area"></div>
    </div>`;
  }

  _rLevelIntro(){
    const l=this.currentLevel;const w=this.currentWorld;
    return`<div class="pq-results">
      <div class="pq-results-icon">${w.icon}</div>
      <h2>${l.name}</h2>
      <p class="pq-sub">${w.name} · ${l.count} Questions · ⚡${l.xp} XP · 🪙${l.coins} Coins</p>
      <div class="pq-results-buttons">
        <button class="pq-btn pq-btn-primary pq-btn-lg pq-btn-glow" data-a="start-level">Begin Mission</button>
        <button class="pq-btn pq-btn-ghost" data-a="back-levels">← Back</button>
      </div>
    </div>`;
  }

  _handleAnswer(idx){
    const q=this.levelQs[this.qIdx];if(!q)return;
    const correct=idx===q.ans;
    const opts=this.content.querySelectorAll('.pq-option');
    opts.forEach((o,i)=>{
      o.classList.add('disabled');
      if(i===q.ans)o.classList.add('correct');
      if(i===idx&&!correct)o.classList.add('wrong');
    });
    const p=this.player;p.stats.played++;
    if(correct){
      p.stats.correct++;this.levelCorrect++;p.streak++;
      if(p.streak>p.bestStreak)p.bestStreak=p.streak;
      p.xp+=CFG.XP_CORRECT;p.coins+=CFG.COIN_CORRECT;
      this.audio.correct();
      this._toast(`+${CFG.XP_CORRECT} XP`,'xp');this._toast(`+${CFG.COIN_CORRECT} Coins`,'coin');
    }else{
      p.stats.wrong++;p.streak=0;
      this.audio.wrong();
    }
    this.memory.add(q.id);this.memory.record(q.id,correct);
    this._checkLevelUp();this._checkAchievements();
    const fb=this.content.querySelector('#pq-feedback-area');
    if(fb)fb.innerHTML=this._feedbackHTML(q,correct);
    this._renderHUD();this._save();
  }

  _feedbackHTML(q,correct){
    const robotTip=!correct&&q.tip?`<div class="pq-robot"><div class="pq-robot-avatar">🤖</div><div class="pq-robot-text"><strong>Science Bot says:</strong> ${q.tip}</div></div>`:'';
    return`<div class="pq-feedback ${correct?'correct-fb':'wrong-fb'}">
      <div class="pq-fb-title"><span class="pq-fb-icon">${correct?'✅':'❌'}</span>${correct?'Correct!':'Not quite!'}</div>
      <div class="pq-fb-explain">${q.explain}</div>
      ${q.formula?`<div class="pq-fb-formula">📐 ${q.formula}</div>`:''}
      ${robotTip}
    </div>
    <div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-primary" data-a="next-q">Next Question →</button></div>`;
  }

  _nextQuestion(){
    this.qIdx++;
    if(this.qIdx>=this.levelQs.length){this._completeLevel();return}
    this._setState('gameplay');
  }

  _completeLevel(){
    const l=this.currentLevel;const w=this.currentWorld;const p=this.player;
    const total=this.levelQs.length;const pct=Math.round(this.levelCorrect/total*100);
    const stars=pct>=90?3:pct>=70?2:pct>=50?1:0;
    const xpBonus=l.xp;const coinBonus=l.coins;
    p.xp+=xpBonus;p.coins+=coinBonus;
    if(!p.levelsCompleted[w.id])p.levelsCompleted[w.id]=[];
    if(!p.levelsCompleted[w.id].includes(l.id))p.levelsCompleted[w.id].push(l.id);
    p.levelStars[l.id]=Math.max(stars,p.levelStars[l.id]||0);
    p.stats.totalLevels++;
    if(pct===100)p.stats.perfectLevels++;
    const allDone=p.levelsCompleted[w.id].length>=w.levels.length;
    if(allDone&&!p.worldsUnlocked.includes(this._nextWorldId(w.id))){
      const nid=this._nextWorldId(w.id);
      if(nid)p.worldsUnlocked.push(nid);
    }
    if(allDone&&!p.worldsCompleted.includes(w.id))p.worldsCompleted.push(w.id);
    this.audio.levelUp();
    this._toast(`+${xpBonus} XP`,'xp');this._toast(`+${coinBonus} Coins`,'coin');
    this._checkLevelUp();this._checkAchievements();this._save();
    this._setState('results',{pct,stars,xpBonus,coinBonus,allDone});
  }

  _rResults(d={}){
    return`<div class="pq-results">
      <div class="pq-results-icon">${d.stars>=3?'🏆':d.stars>=2?'⭐':'✅'}</div>
      <h2>Mission Complete!</h2>
      <p class="pq-sub">${this.currentLevel?.name||''}</p>
      <div class="pq-results-stars">${'★'.repeat(d.stars||0)}${'☆'.repeat(3-(d.stars||0))}</div>
      <div class="pq-results-stats">
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">${this.levelCorrect}/${this.levelQs.length}</div><div class="pq-stat-lbl">Correct</div></div>
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-accent)">${d.pct||0}%</div><div class="pq-stat-lbl">Accuracy</div></div>
        <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">${d.xpBonus||0}</div><div class="pq-stat-lbl">XP Earned</div></div>
      </div>
      ${d.allDone?`<div class="pq-card pq-text-center pq-mb-2" style="border-color:var(--pq-purple);color:var(--pq-purple)">⚔️ All levels complete! Challenge the boss!</div>`:''}
      <div class="pq-results-buttons">
        <button class="pq-btn pq-btn-primary" data-a="back-levels">Continue</button>
        <button class="pq-btn pq-btn-ghost" data-a="back-worlds">World Map</button>
      </div>
    </div>`;
  }

  _nextWorldId(current){
    const ws=this.worldData;const idx=ws.findIndex(w=>w.id===current);
    return idx<ws.length-1?ws[idx+1].id:null;
  }

  _checkLevelUp(){
    const p=this.player;const curve=CFG.XP_CURVE;
    while(p.level<curve.length-1&&p.xp>=curve[p.level]){p.level++;this._toast(`Level Up! Lv ${p.level}`,'level');this.audio.levelUp()}
  }

  // ── Boss Battle ──
  _startBattle(){
    const w=this.currentWorld;if(!w)return;
    const bossQs=this.questions.get(w.id,10);
    this.battleState={bossHp:w.boss.hp,playerHp:CFG.PLAYER_HP,maxBossHp:w.boss.hp,qs:bossQs,qIdx:0,phase:'intro',gadgetEffects:[]};
    this._setState('battle');
  }

  _rBattle(){
    const b=this.battleState;const w=this.currentWorld;if(!b||!w)return'';const boss=w.boss;
    if(b.phase==='intro'){
      return`<div class="pq-results">
        <div class="pq-boss-avatar" style="border-color:${w.color}">${w.icon}</div>
        <h2 style="color:var(--pq-red)">${boss.name}</h2>
        <p class="pq-sub">${boss.title}</p>
        <p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"${boss.phrases[Math.floor(Math.random()*boss.phrases.length)]}"</p>
        <p class="pq-mb-2" style="font-size:.85rem">Answer questions correctly to deal damage. Wrong answers cost you HP!</p>
        <button class="pq-btn pq-btn-danger pq-btn-lg pq-btn-glow" data-a="battle-answer" data-idx="-1">⚔️ Begin Battle!</button>
      </div>`;
    }
    if(b.phase==='won'){
      return`<div class="pq-results">
        <div class="pq-results-icon">🏆</div>
        <h2>Victory!</h2>
        <p class="pq-sub">${boss.name} has been defeated!</p>
        <p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"${boss.phrases[boss.phrases.length-1]}"</p>
        <div class="pq-results-stats">
          <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-green)">+200</div><div class="pq-stat-lbl">XP</div></div>
          <div class="pq-stat-box"><div class="pq-stat-val" style="color:var(--pq-gold)">+100</div><div class="pq-stat-lbl">Coins</div></div>
          <div class="pq-stat-box"><div class="pq-stat-val">🧬</div><div class="pq-stat-lbl">Spirit</div></div>
        </div>
        <div class="pq-results-buttons"><button class="pq-btn pq-btn-primary" data-a="results-continue">Continue</button></div>
      </div>`;
    }
    if(b.phase==='lost'){
      return`<div class="pq-results">
        <div class="pq-results-icon">💀</div>
        <h2>Defeated</h2>
        <p class="pq-sub">${boss.name} was too strong this time.</p>
        <div class="pq-results-buttons">
          <button class="pq-btn pq-btn-danger pq-btn-lg" data-a="start-battle">Retry Battle</button>
          <button class="pq-btn pq-btn-ghost" data-a="back-levels">Train More</button>
        </div>
      </div>`;
    }
    const q=b.qs[b.qIdx];if(!q)return'';
    const letters=['A','B','C','D'];
    const opts=q.opts.map((o,i)=>`<div class="pq-option" data-a="battle-answer" data-idx="${i}"><span class="pq-option-letter">${letters[i]}</span><span>${o}</span></div>`).join('');
    const bossPct=Math.round(b.bossHp/b.maxBossHp*100);
    const playerPct=Math.round(b.playerHp/CFG.PLAYER_HP*100);
    const gadgetBtns=Object.entries(this.player.gadgets).filter(([,v])=>v>0).map(([id,count])=>{
      const g=this.gadgetsData.find(x=>x.id===id);if(!g)return'';
      return`<button class="pq-gadget-btn" data-a="use-gadget" data-gadget="${id}" title="${g.name}: ${g.desc}">${g.icon}<span class="pq-gadget-count">${count}</span></button>`;
    }).join('');
    return`<div class="pq-battle">
      <div class="pq-boss-header">
        <div class="pq-boss-avatar" style="border-color:${w.color}">${w.icon}</div>
        <div class="pq-boss-name">${boss.name}</div>
        <div class="pq-boss-title">${boss.title}</div>
      </div>
      <div class="pq-hp-bars">
        <div class="pq-hp-row"><span class="pq-hp-label" style="color:var(--pq-green)">YOU</span><div class="pq-hp-bar"><div class="pq-hp-fill player-hp" style="width:${playerPct}%"></div></div><span class="pq-hp-value">${b.playerHp}</span></div>
        <div class="pq-hp-row"><span class="pq-hp-label" style="color:var(--pq-red)">BOSS</span><div class="pq-hp-bar"><div class="pq-hp-fill boss-hp" style="width:${bossPct}%"></div></div><span class="pq-hp-value">${b.bossHp}</span></div>
      </div>
      ${gadgetBtns?`<div class="pq-gadget-bar">${gadgetBtns}</div>`:''}
      <div class="pq-question-card">
        <div class="pq-q-num">Q ${b.qIdx+1} of ${b.qs.length}</div>
        <p class="pq-q-text">${q.q}</p>
      </div>
      <div class="pq-options" id="pq-battle-opts">${opts}</div>
      <div id="pq-battle-fb"></div>
    </div>`;
  }

  _battleAnswer(idx){
    const b=this.battleState;if(!b)return;
    if(b.phase!=='fight'){b.phase='fight';this._setState('battle');return}
    const q=b.qs[b.qIdx];if(!q)return;
    const correct=idx===q.ans;
    const opts=this.content.querySelectorAll('.pq-option');
    opts.forEach((o,i)=>{o.classList.add('disabled');if(i===q.ans)o.classList.add('correct');if(i===idx&&!correct)o.classList.add('wrong')});
    const p=this.player;p.stats.played++;
    if(correct){
      p.stats.correct++;p.streak++;p.xp+=CFG.XP_CORRECT;p.coins+=CFG.COIN_CORRECT;
      let dmg=CFG.DMG_CORRECT;
      if(b.gadgetEffects.includes('double_damage')){dmg*=2;b.gadgetEffects=b.gadgetEffects.filter(e=>e!=='double_damage')}
      b.bossHp=Math.max(0,b.bossHp-dmg);
      this.audio.bossHit();this._toast(`-${dmg} Boss HP!`,'xp');
    }else{
      p.stats.wrong++;p.streak=0;
      let dmg=CFG.DMG_WRONG;
      if(b.gadgetEffects.includes('shield')){dmg=Math.floor(dmg/2);b.gadgetEffects=b.gadgetEffects.filter(e=>e!=='shield')}
      if(b.gadgetEffects.includes('block')){dmg=0;b.gadgetEffects=b.gadgetEffects.filter(e=>e!=='block')}
      b.playerHp=Math.max(0,b.playerHp-dmg);
      this.audio.playerHit();
    }
    this.memory.add(q.id);this.memory.record(q.id,correct);
    this._checkAchievements();
    const fb=this.content.querySelector('#pq-battle-fb');
    if(fb)fb.innerHTML=`<div class="pq-feedback ${correct?'correct-fb':'wrong-fb'}" style="margin-top:16px">
      <div class="pq-fb-title">${correct?'✅ Direct Hit!':'💥 Boss Attacks!'}</div>
      <div class="pq-fb-explain">${q.explain}</div>
      ${q.formula?`<div class="pq-fb-formula">📐 ${q.formula}</div>`:''}
    </div><div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-primary" data-a="battle-next">Next Round →</button></div>`;
    this._renderHUD();this._save();
  }

  _battleNextQ(){
    const b=this.battleState;if(!b)return;
    if(b.bossHp<=0){this._battleVictory();return}
    if(b.playerHp<=0){b.phase='lost';this._setState('battle');return}
    b.qIdx++;
    if(b.qIdx>=b.qs.length){
      const moreQs=this.questions.get(this.currentWorld.id,5);
      b.qs=b.qs.concat(moreQs);
    }
    this._setState('battle');
  }

  _battleVictory(){
    const b=this.battleState;const w=this.currentWorld;const p=this.player;
    b.phase='won';
    p.xp+=200;p.coins+=100;
    if(!p.bossesDefeated.includes(w.id))p.bossesDefeated.push(w.id);
    const creature=w.creature;
    if(creature&&!p.creatures.includes(creature)){p.creatures.push(creature);this._toast('New Spirit: '+creature.replace(/_/g,' '),'creature');this.audio.creature()}
    this.audio.victory();this._toast('+200 XP','xp');this._toast('+100 Coins','coin');
    this._checkLevelUp();this._checkAchievements();this._save();
    this._setState('battle');
  }

  _useGadget(gadgetId){
    const p=this.player;if(!p.gadgets[gadgetId]||p.gadgets[gadgetId]<=0)return;
    const g=this.gadgetsData.find(x=>x.id===gadgetId);if(!g)return;
    p.gadgets[gadgetId]--;
    const b=this.battleState;
    switch(g.effect){
      case 'hint':{
        if(!b)break;const q=b.qs[b.qIdx];if(!q)break;
        const opts=this.content.querySelectorAll('#pq-battle-opts .pq-option');
        if(opts.length>=4){const wrongs=[];opts.forEach((o,i)=>{if(i!==q.ans)wrongs.push(i)});const remove=wrongs.sort(()=>Math.random()-.5).slice(0,2);remove.forEach(i=>{opts[i].style.opacity='.3';opts[i].style.pointerEvents='none'})}
        break;
      }
      case 'shield':case 'block':case 'double_damage':case 'xp_boost':case 'coin_boost':
        if(b)b.gadgetEffects.push(g.effect);break;
      case 'retry':
        if(b&&b.playerHp<CFG.PLAYER_HP)b.playerHp=Math.min(CFG.PLAYER_HP,b.playerHp+30);break;
      case 'eliminate':{
        if(!b)break;const q=b.qs[b.qIdx];if(!q)break;
        const opts=this.content.querySelectorAll('#pq-battle-opts .pq-option');
        if(opts.length>=4){const wrongs=[];opts.forEach((o,i)=>{if(i!==q.ans)wrongs.push(i)});const remove=wrongs.sort(()=>Math.random()-.5).slice(0,2);remove.forEach(i=>{opts[i].style.opacity='.3';opts[i].style.pointerEvents='none'})}
        break;
      }
    }
    this._toast(`Used ${g.name}!`,'xp');this._save();this._setState('battle');
  }

  // ── Collection ──
  _rCollection(){
    const p=this.player;
    const cards=(this.creaturesData||[]).map(c=>{
      const owned=p.creatures.includes(c.id);
      return`<div class="pq-creature-card ${owned?'':'locked'}">
        <div class="pq-creature-svg-wrap">${CREATURE_SVG[c.id]||'🧬'}</div>
        <h4>${c.name}</h4>
        <p>${owned?c.desc:'???'}</p>
        <span class="pq-creature-rarity pq-rarity-${c.rarity}">${c.rarity}</span>
      </div>`;
    }).join('');
    return`<div class="pq-collection">
      <div class="pq-section-head"><h2>Physics Spirit Collection</h2><p>${p.creatures.length}/${this.creaturesData?.length||0} spirits collected</p></div>
      <div class="pq-creature-grid">${cards}</div>
      <div class="pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">← Back to World Map</button></div>
    </div>`;
  }

  // ── Shop ──
  _rShop(){
    const p=this.player;
    const items=(this.gadgetsData||[]).map(g=>{
      const count=p.gadgets[g.id]||0;
      return`<div class="pq-shop-item">
        <div class="pq-shop-icon">${g.icon}</div>
        <h4>${g.name} ${count>0?`(×${count})`:''}</h4>
        <p>${g.desc}</p>
        <div class="pq-shop-price">🪙 ${g.cost}</div>
        <button class="pq-btn pq-btn-sm ${p.coins>=g.cost?'pq-btn-success':'pq-btn-ghost'}" data-a="buy-gadget" data-gadget="${g.id}" ${p.coins<g.cost?'disabled':''}>${p.coins>=g.cost?'Buy':'Not enough coins'}</button>
      </div>`;
    }).join('');
    return`<div class="pq-collection">
      <div class="pq-section-head"><h2>Gadget Shop</h2><p>Your coins: 🪙 ${p.coins}</p></div>
      <div class="pq-shop-grid">${items}</div>
      <div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">← Back</button></div>
    </div>`;
  }

  _buyGadget(gadgetId){
    const p=this.player;const g=this.gadgetsData.find(x=>x.id===gadgetId);
    if(!g||p.coins<g.cost)return;
    p.coins-=g.cost;p.gadgets[gadgetId]=(p.gadgets[gadgetId]||0)+1;
    this.audio.coin();this._toast(`Bought ${g.name}!`,'coin');this._save();this._setState('shop');
  }

  // ── Settings ──
  _rSettings(){
    const s=this.player.settings;
    return`<div class="pq-settings">
      <h2>Settings</h2>
      <div class="pq-setting-row"><label>Sound Effects</label><div class="pq-toggle ${s.sfx?'on':''}" data-a="toggle-sfx"></div></div>
      <div class="pq-setting-row"><label>Volume</label><input type="range" class="pq-range" min="0" max="1" step="0.1" value="${s.vol}" data-a="vol-change"></div>
      <div class="pq-setting-row"><label>Player Level</label><span style="color:var(--pq-accent)">${this.player.level}</span></div>
      <div class="pq-setting-row"><label>Total XP</label><span style="color:var(--pq-accent)">${this.player.xp}</span></div>
      <div class="pq-setting-row"><label>Questions Answered</label><span style="color:var(--pq-accent)">${this.player.stats.played}</span></div>
      <div class="pq-setting-row"><label>Accuracy</label><span style="color:var(--pq-accent)">${this.player.stats.played?Math.round(this.player.stats.correct/this.player.stats.played*100):0}%</span></div>
      <div class="pq-mt-3 pq-text-center"><button class="pq-btn pq-btn-danger pq-btn-sm" data-a="new-game">Reset All Progress</button></div>
      <div class="pq-mt-2 pq-text-center"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">← Back</button></div>
    </div>`;
  }

  _toggleSfx(){
    const s=this.player.settings;s.sfx=!s.sfx;this.audio.setMuted(!s.sfx);this._save();this._setState('settings');
  }

  // ── Achievements ──
  _rAchievements(){
    const p=this.player;
    const items=ACHIEVEMENTS.map(a=>{
      const unlocked=p.achievements.includes(a.id);
      return`<div class="pq-card" style="opacity:${unlocked?1:.4};text-align:center;padding:16px">
        <div style="font-size:2rem;margin-bottom:6px">${a.icon}</div>
        <h4 style="font-family:var(--pq-head);font-size:.85rem">${a.name}</h4>
        <p style="font-size:.75rem;color:var(--pq-sec)">${a.desc}</p>
        ${unlocked?'<span style="font-size:.65rem;color:var(--pq-green)">✓ Unlocked</span>':'<span style="font-size:.65rem;color:var(--pq-muted)">Locked</span>'}
      </div>`;
    }).join('');
    return`<div class="pq-collection">
      <div class="pq-section-head"><h2>Achievements</h2><p>${p.achievements.length}/${ACHIEVEMENTS.length} unlocked</p></div>
      <div class="pq-creature-grid">${items}</div>
      <div class="pq-text-center pq-mt-2"><button class="pq-btn pq-btn-ghost" data-a="back-worlds">← Back</button></div>
    </div>`;
  }

  _checkAchievements(){
    const p=this.player;
    ACHIEVEMENTS.forEach(a=>{
      if(!p.achievements.includes(a.id)&&a.check(p)){
        p.achievements.push(a.id);this._toast(`🏆 ${a.name}`,'achievement');p.xp+=25;
      }
    });
  }

  // ── Toast System ──
  _toast(msg,type){
    const el=document.createElement('div');
    el.className=`pq-toast pq-toast-${type||'xp'}`;el.textContent=msg;
    this.toastsEl.appendChild(el);
    setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(40px)';el.style.transition='all .3s';setTimeout(()=>el.remove(),300)},2500);
  }

  // ── Close ──
  _close(){
    this._save();
    const ov=document.getElementById('pq-overlay');
    if(ov)ov.remove();
    document.body.style.overflow='';
  }
}

// ── Global Launcher ──
window.PQGame={
  _instance:null,
  async launch(root){
    if(this._instance){root.innerHTML='';this._instance.root=root;this._instance._buildShell();this._instance._render();return}
    const game=new PhysicsQuest(root);
    this._instance=game;
    await game.init();
  }
};

})();
