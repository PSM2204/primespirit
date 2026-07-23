(function(){
'use strict';

/* ═══════════════════════════════════════════════════════
   PRIMEQUEST — Class 7 Science Story Adventure
   Complete Game Engine v1.0
   Prime Spirit Mentors · primespirit.co.in
   ═══════════════════════════════════════════════════════ */

// ── Utilities ──
const shuffle = a => { const b=a.slice(); for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const pick = a => a[Math.floor(Math.random()*a.length)];
const pct = (n,d) => d>0 ? Math.round(n/d*100) : 0;
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const wait = ms => new Promise(r=>setTimeout(r,ms));

const CFG = {
  SAVE_KEY:'pq7c-save-v1', VERSION:'1.0.0',
  XP_CURVE:[0,100,250,500,850,1300,1900,2700,3800,5200,7000],
  PLAYER_HP:100, DMG_CORRECT:25, DMG_WRONG:12,
  COMBO_MULT:[1,1,1.15,1.3,1.45,1.6,1.75,1.9,2.1],
  CRIT_CHANCE:0.10, CRIT_MULT:2,
  XP_CORRECT:10, COIN_CORRECT:5,
  XP_BOSS:200, COIN_BOSS:100,
  DAILY_COINS:50, DAILY_XP:25
};

// ══════════════════════════════════════════
//  AUDIO ENGINE (Web Audio API synth)
// ══════════════════════════════════════════
class AudioEngine {
  constructor(){ this.ctx=null; this.muted=false; this.vol=0.35; }
  init(){ try{ this.ctx=new(window.AudioContext||window.webkitAudioContext)(); }catch(_){} }
  resume(){ if(this.ctx&&this.ctx.state==='suspended') this.ctx.resume(); }
  _t(f,d,type,v){
    if(this.muted||!this.ctx)return; this.resume();
    const o=this.ctx.createOscillator(), g=this.ctx.createGain();
    o.type=type||'sine'; o.frequency.value=f;
    g.gain.setValueAtTime((v??this.vol)*0.25,this.ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+d);
    o.connect(g).connect(this.ctx.destination); o.start(); o.stop(this.ctx.currentTime+d);
  }
  correct(){ this._t(523,.08); setTimeout(()=>this._t(659,.08),80); setTimeout(()=>this._t(784,.15),160); }
  wrong(){ this._t(220,.15,'sawtooth',.2); setTimeout(()=>this._t(180,.2,'sawtooth',.15),100); }
  coin(){ this._t(1200,.06); setTimeout(()=>this._t(1600,.1),60); }
  click(){ this._t(800,.04,'sine',.15); }
  victory(){ [523,659,784,1047].forEach((f,i)=>setTimeout(()=>this._t(f,i<3?.1:.25),i*100)); }
  levelUp(){ [440,554,659,880].forEach((f,i)=>setTimeout(()=>this._t(f,.1,'triangle'),i*80)); }
  bossHit(){ this._t(150,.12,'square',.2); setTimeout(()=>this._t(100,.15,'sawtooth',.15),80); }
  playerHit(){ this._t(200,.1,'sawtooth',.2); setTimeout(()=>this._t(150,.15,'square',.15),80); }
  creature(){ [600,800,1000,1200].forEach((f,i)=>setTimeout(()=>this._t(f,i<3?.1:.2),i*100)); }
  combo(lv){ this._t(400+lv*80,.06); setTimeout(()=>this._t(600+lv*100,.1),60); }
  critical(){ this._t(900,.08); setTimeout(()=>this._t(1200,.06),50); setTimeout(()=>this._t(1500,.12),100); }
  story(){ this._t(262,.3,'sine',.12); setTimeout(()=>this._t(330,.4,'sine',.1),300); }
  setMuted(v){ this.muted=v; }
  setVolume(v){ this.vol=v; }
}

// ══════════════════════════════════════════
//  SAVE MANAGER
// ══════════════════════════════════════════
class SaveManager {
  save(d){ try{ localStorage.setItem(CFG.SAVE_KEY,JSON.stringify(d)); }catch(_){} }
  load(){ try{ const s=localStorage.getItem(CFG.SAVE_KEY); return s?JSON.parse(s):null; }catch(_){ return null; } }
}

// ══════════════════════════════════════════
//  EFFECTS ENGINE
// ══════════════════════════════════════════
class EffectsEngine {
  constructor(){
    this.layer=document.createElement('div');
    this.layer.className='pq7-fx-layer';
    document.body.appendChild(this.layer);
  }
  particles(x,y,count,color){
    for(let i=0;i<count;i++){
      const p=document.createElement('div'); p.className='pq7-particle';
      const sz=4+Math.random()*5;
      Object.assign(p.style,{position:'absolute',left:x+'px',top:y+'px',width:sz+'px',height:sz+'px',background:color,
        '--dx':((Math.random()-0.5)*140)+'px','--dy':((Math.random()-0.5)*140-30)+'px','--dur':(0.3+Math.random()*0.4)+'s'});
      this.layer.appendChild(p); setTimeout(()=>p.remove(),1000);
    }
  }
  floatText(x,y,text,color){
    const el=document.createElement('div'); el.className='pq7-float-text';
    Object.assign(el.style,{left:x+'px',top:y+'px',color});
    el.textContent=text; this.layer.appendChild(el); setTimeout(()=>el.remove(),1400);
  }
  shake(el){ if(!el)return; el.classList.add('pq7-shaking'); setTimeout(()=>el.classList.remove('pq7-shaking'),350); }
  comboPopup(c){
    const el=document.createElement('div'); el.className='pq7-combo-popup';
    el.textContent=c+'x COMBO!'; this.layer.appendChild(el); setTimeout(()=>el.remove(),900);
  }
  critFlash(){
    const el=document.createElement('div'); el.className='pq7-crit-flash';
    this.layer.appendChild(el); setTimeout(()=>el.remove(),400);
  }
  destroy(){ this.layer.remove(); }
}

// ══════════════════════════════════════════
//  STORY ENGINE (Typewriter + Cinematics)
// ══════════════════════════════════════════
class StoryEngine {
  constructor(game){ this.game=game; this._typing=false; this._fullText=''; this._resolve=null; }

  async playScene(scene, container){
    return new Promise(resolve=>{
      this._resolve=resolve;
      container.innerHTML='';

      // Background
      const bg=document.createElement('div');
      bg.className='pq7-story-bg';
      bg.style.background=scene.bg||'var(--pq-bg)';
      container.appendChild(bg);

      // Particles
      if(scene.particles){
        const pp=document.createElement('div'); pp.className='pq7-story-particles';
        for(let i=0;i<15;i++){
          const dot=document.createElement('div');
          dot.style.cssText=`position:absolute;width:3px;height:3px;border-radius:50%;background:${scene.particleColor||'rgba(255,255,255,0.3)'};
            left:${Math.random()*100}%;top:${Math.random()*100}%;animation:float ${3+Math.random()*4}s ease-in-out ${Math.random()*2}s infinite;`;
          pp.appendChild(dot);
        }
        container.appendChild(pp);
      }

      // Character
      if(scene.character){
        const ch=document.createElement('div'); ch.className='pq7-story-char';
        ch.textContent=scene.character; container.appendChild(ch);
      }

      // Narrator box
      const nar=document.createElement('div'); nar.className='pq7-story-narrator';
      const label=document.createElement('div'); label.className='pq7-narrator-label';
      label.textContent=scene.speaker||'Narrator';
      const text=document.createElement('div'); text.className='pq7-story-text';
      nar.appendChild(label); nar.appendChild(text);
      container.appendChild(nar);

      // Continue hint
      const hint=document.createElement('div'); hint.className='pq7-story-continue';
      hint.textContent='Click anywhere to continue...';
      hint.style.opacity='0'; container.appendChild(hint);

      // Typewriter effect
      this._fullText=scene.text||'';
      this._typing=true;
      let idx=0; text.innerHTML='<span class="pq7-cursor"></span>';

      const typeInterval=setInterval(()=>{
        if(idx<this._fullText.length){
          text.innerHTML=this._fullText.substring(0,idx+1)+'<span class="pq7-cursor"></span>';
          idx++;
        } else {
          clearInterval(typeInterval); this._typing=false;
          text.innerHTML=this._fullText;
          hint.style.opacity='1';
        }
      },scene.speed||35);

      this.game.audio.story();

      // Click to advance
      const handler=()=>{
        if(this._typing){
          clearInterval(typeInterval); this._typing=false;
          text.innerHTML=this._fullText; hint.style.opacity='1';
        } else {
          container.removeEventListener('click',handler);
          resolve();
        }
      };
      container.addEventListener('click',handler);
    });
  }

  async playStory(storyId, container){
    const story=PRIMEQUEST_DATA.stories[storyId];
    if(!story)return;
    for(const scene of story){
      await this.playScene(scene, container);
    }
  }
}


// ══════════════════════════════════════════
//  QUESTION ENGINE (MCQ, True/False, Fill, Sequence)
// ══════════════════════════════════════════
class QuestionEngine {
  renderQuestion(q, container, onAnswer){
    container.innerHTML='';
    const card=document.createElement('div'); card.className='pq7-question-card';
    const type=document.createElement('div'); type.className='pq7-q-type';
    const labels={mcq:'Multiple Choice',truefalse:'True or False',fill:'Fill in the Blank',sequence:'Arrange in Order'};
    type.textContent=labels[q.type]||'Question';
    const text=document.createElement('p'); text.className='pq7-q-text'; text.innerHTML=q.q;
    card.appendChild(type); card.appendChild(text);
    if(q.formula){ const f=document.createElement('div'); f.className='pq7-q-formula'; f.textContent=q.formula; card.appendChild(f); }

    let answered=false;

    if(q.type==='mcq'){
      const opts=document.createElement('div'); opts.className='pq7-options';
      const letters=['A','B','C','D'];
      q.opts.forEach((o,i)=>{
        const opt=document.createElement('div'); opt.className='pq7-option';
        opt.innerHTML=`<span class="pq7-option-letter">${letters[i]}</span><span>${o}</span>`;
        opt.addEventListener('click',()=>{
          if(answered)return; answered=true;
          opts.querySelectorAll('.pq7-option').forEach((oo,ii)=>{
            oo.classList.add('disabled');
            if(ii===q.ans)oo.classList.add('correct');
            if(ii===i&&i!==q.ans)oo.classList.add('wrong');
          });
          onAnswer(i===q.ans);
        });
        opts.appendChild(opt);
      });
      card.appendChild(opts);
    }
    else if(q.type==='truefalse'){
      const opts=document.createElement('div'); opts.className='pq7-options';
      ['True','False'].forEach((label,i)=>{
        const opt=document.createElement('div'); opt.className='pq7-option';
        opt.innerHTML=`<span class="pq7-option-letter">${i===0?'T':'F'}</span><span>${label}</span>`;
        opt.addEventListener('click',()=>{
          if(answered)return; answered=true;
          const correct=(i===0)===q.ans;
          opts.querySelectorAll('.pq7-option').forEach((oo,ii)=>{
            oo.classList.add('disabled');
            const isAns=(ii===0)===q.ans;
            if(isAns)oo.classList.add('correct');
            if(ii===i&&!correct)oo.classList.add('wrong');
          });
          onAnswer(correct);
        });
        opts.appendChild(opt);
      });
      card.appendChild(opts);
    }
    else if(q.type==='fill'){
      const input=document.createElement('input'); input.type='text';
      input.className='pq7-q-fill-input'; input.placeholder='Type your answer...';
      card.appendChild(input);
      const btn=document.createElement('button'); btn.className='pq7-btn pq7-btn-primary pq7-mt-2';
      btn.textContent='Submit Answer'; btn.style.width='100%';
      btn.addEventListener('click',()=>{
        if(answered)return; answered=true;
        const val=input.value.trim().toLowerCase();
        const correct=q.accept.some(a=>val===a.toLowerCase());
        input.style.borderColor=correct?'var(--pq-green)':'var(--pq-red)';
        input.disabled=true; btn.disabled=true;
        onAnswer(correct);
      });
      card.appendChild(btn);
    }
    else if(q.type==='sequence'){
      const shuffled=shuffle(q.items.map((item,i)=>({text:item,correct:i})));
      const selected=[];
      const wrap=document.createElement('div'); wrap.className='pq7-seq-options';
      const render=()=>{
        wrap.innerHTML='';
        shuffled.forEach((item,i)=>{
          const el=document.createElement('div'); el.className='pq7-seq-item';
          if(selected.includes(i))el.classList.add('selected');
          const num=selected.indexOf(i);
          el.innerHTML=`<span class="pq7-seq-num">${num>=0?num+1:''}</span><span>${item.text}</span>`;
          el.addEventListener('click',()=>{
            if(answered)return;
            const si=selected.indexOf(i);
            if(si>=0) selected.splice(si,1);
            else selected.push(i);
            render();
            if(selected.length===shuffled.length){
              answered=true;
              const correct=selected.every((si,idx)=>shuffled[si].correct===idx);
              wrap.querySelectorAll('.pq7-seq-item').forEach((el,ii)=>{
                el.classList.add(correct?'correct-seq':'wrong-seq');
              });
              onAnswer(correct);
            }
          });
          wrap.appendChild(el);
        });
      };
      render();
      card.appendChild(wrap);
    }

    container.appendChild(card);
  }

  getQuestions(chapterId, roundIdx, levelIdx){
    const data=PRIMEQUEST_DATA.questions[chapterId];
    if(!data)return[];
    const key=`r${roundIdx}_l${levelIdx}`;
    return data[key]||[];
  }

  getBossQuestions(chapterId){
    const data=PRIMEQUEST_DATA.questions[chapterId];
    return data?data.boss||[]:[];
  }
}


// ═══════════════════════════════════════════════════════
//  MAIN GAME CLASS
// ═══════════════════════════════════════════════════════
class PrimeQuest {
  constructor(root){
    this.root=root;
    this.audio=new AudioEngine();
    this.save=new SaveManager();
    this.fx=null;
    this.story=new StoryEngine(this);
    this.questions=new QuestionEngine();

    this.player=null;
    this.chapters=PRIMEQUEST_DATA.chapters;

    this.state='title';
    this.currentChapter=null;
    this.currentRound=null;
    this.currentLevel=null;
    this.levelQs=[];
    this.qIdx=0;
    this.levelCorrect=0;
    this.battleState=null;
    this._animating=false;
    this._achTimer=null;
  }

  async init(){
    const saved=this.save.load();
    if(saved&&saved.player){
      this.player={...this._defaultPlayer(),...saved.player,
        stats:{...this._defaultPlayer().stats,...(saved.player.stats||{})},
        settings:{...this._defaultPlayer().settings,...(saved.player.settings||{})}
      };
    } else {
      this.player=this._defaultPlayer();
    }
    this.audio.init();
    this.audio.setMuted(!this.player.settings.sfx);
    this._buildShell();
    this.fx=new EffectsEngine();
    this._checkDaily();
    this._render();
  }

  _defaultPlayer(){
    return {
      name:'Explorer',xp:0,level:1,coins:100,hp:CFG.PLAYER_HP,
      streak:0,bestStreak:0,
      stats:{correct:0,wrong:0,played:0,perfectLevels:0,totalLevels:0,bestCombo:0},
      chaptersUnlocked:['nutrition_plants'],chaptersCompleted:[],
      roundsCompleted:{},roundStars:{},bossesDefeated:[],
      creatures:[],achievements:[],
      settings:{sfx:true,vol:0.35},
      dailyStreak:0,lastLogin:null
    };
  }

  _save(){ this.save.save({player:this.player,ver:CFG.VERSION}); }

  _checkDaily(){
    const p=this.player, now=new Date(), today=now.toISOString().slice(0,10);
    if(p.lastLogin===today)return;
    const yesterday=new Date(now.getTime()-86400000).toISOString().slice(0,10);
    p.dailyStreak=p.lastLogin===yesterday?(p.dailyStreak||0)+1:1;
    p.lastLogin=today;
    const bc=CFG.DAILY_COINS+p.dailyStreak*5, bx=CFG.DAILY_XP+p.dailyStreak*3;
    p.coins+=bc; p.xp+=bx;
    this._dailyBonus={coins:bc,xp:bx,streak:p.dailyStreak};
    this._save();
  }

  _buildShell(){
    this.root.innerHTML=`
      <div class="pq7-hud" id="pq7-hud"></div>
      <div class="pq7-content" id="pq7-content"></div>
      <div class="pq7-toasts" id="pq7-toasts"></div>`;
    this.hud=this.root.querySelector('#pq7-hud');
    this.content=this.root.querySelector('#pq7-content');
    this.toastsEl=this.root.querySelector('#pq7-toasts');
    const handler=e=>this._handleClick(e);
    this.content.addEventListener('click',handler);
    this.hud.addEventListener('click',handler);
  }

  _handleClick(e){
    const t=e.target.closest('[data-a]');
    if(!t||this._animating)return;
    this.audio.click();
    const a=t.dataset.a, d=t.dataset;
    switch(a){
      case 'new-game': this._newGame(); break;
      case 'continue': this._setState('worldmap'); break;
      case 'enter-chapter': this._enterChapter(d.chapter); break;
      case 'enter-round': this._enterRound(+d.round); break;
      case 'enter-level': this._enterLevel(+d.level); break;
      case 'start-level': this._startLevel(); break;
      case 'answer': this._handleAnswer(+d.idx,e); break;
      case 'fill-submit': this._handleFillSubmit(); break;
      case 'next-q': this._nextQ(); break;
      case 'back-worlds': this._setState('worldmap'); break;
      case 'back-rounds': this._enterChapter(this.currentChapter?.id); break;
      case 'back-levels': this._enterRound(this.currentRound?.idx); break;
      case 'start-battle': this._startBattle(); break;
      case 'battle-answer': this._battleAnswer(+d.idx,e); break;
      case 'battle-next': this._battleNextQ(); break;
      case 'results-continue': this._setState('worldmap'); break;
      case 'shop': this._setState('shop'); break;
      case 'collection': this._setState('collection'); break;
      case 'achievements': this._setState('achievements'); break;
      case 'settings': this._setState('settings'); break;
      case 'toggle-sfx': this._toggleSfx(); break;
      case 'close': this._close(); break;
    }
  }

  _setState(s,data){ this.state=s; this._renderState(data||{}); }
  _render(){ this._renderHUD(); this._renderState({}); }

  _renderHUD(){
    const p=this.player;
    const show=this.state!=='title';
    this.hud.style.display=show?'flex':'none';
    if(!show)return;
    this.hud.innerHTML=`
      <div class="pq7-hud-left">
        <button class="pq7-hud-btn" data-a="back-worlds" title="World Map">🗺️</button>
        <span class="pq7-badge pq7-badge-accent">Lv ${p.level}</span>
      </div>
      <div class="pq7-hud-center">${{title:'PrimeQuest',worldmap:'Chapter Map',roundselect:'Rounds',levelselect:'Levels',
        story:'Story',gameplay:'Mission',feedback:'Feedback',results:'Results',
        boss_intro:'Boss Battle',boss_battle:'Boss Fight',boss_result:'Victory',
        collection:'Collection',shop:'Shop',achievements:'Achievements',settings:'Settings'}[this.state]||''}</div>
      <div class="pq7-hud-right">
        <span class="pq7-badge">⚡${p.xp}</span>
        <span class="pq7-badge pq7-badge-gold">🪙${p.coins}</span>
        <button class="pq7-hud-btn" data-a="collection" title="Collection">📦</button>
        <button class="pq7-hud-btn" data-a="shop" title="Shop">🛒</button>
        <button class="pq7-hud-btn" data-a="achievements" title="Achievements">🏆</button>
        <button class="pq7-hud-btn" data-a="settings" title="Settings">⚙️</button>
        <button class="pq7-hud-btn" data-a="close" title="Exit">✕</button>
      </div>`;
  }

  _renderState(data){
    this._renderHUD();
    const map={title:'_rTitle',worldmap:'_rWorldMap',roundselect:'_rRoundSelect',levelselect:'_rLevelSelect',
      story:'_rStory',gameplay:'_rGameplay',results:'_rResults',
      boss_intro:'_rBossIntro',boss_battle:'_rBossBattle',boss_result:'_rBossResult',
      collection:'_rCollection',shop:'_rShop',achievements:'_rAchievements',settings:'_rSettings'};
    const fn=map[this.state];
    this.content.innerHTML=fn?this[fn](data):'';
    this.content.scrollTop=0;
  }

  // ── TITLE ──
  _rTitle(){
    const has=this.player.stats.played>0;
    let daily='';
    if(this._dailyBonus){
      daily=`<div class="pq7-daily-banner"><h3>🎁 Daily Login — Day ${this._dailyBonus.streak}!</h3>
        <p>+${this._dailyBonus.xp} XP · +${this._dailyBonus.coins} Coins</p></div>`;
    }
    return `<div class="pq7-title">
      <div class="pq7-title-atom">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00C6FF" stroke-width="2" opacity=".5"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#a855f7" stroke-width="2" opacity=".5" transform="rotate(60 100 100)"><animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/></ellipse>
          <ellipse cx="100" cy="100" rx="85" ry="30" fill="none" stroke="#00df89" stroke-width="2" opacity=".5" transform="rotate(120 100 100)"><animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/></ellipse>
          <circle cx="100" cy="100" r="18" fill="#00C6FF"/><circle cx="100" cy="100" r="10" fill="#060810"/><circle cx="100" cy="100" r="5" fill="#00df89"/>
          <circle cx="175" cy="100" r="5" fill="#00C6FF"><animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="8s" repeatCount="indefinite"/></circle>
          <circle cx="145" cy="50" r="4" fill="#a855f7"><animateTransform attributeName="transform" type="rotate" from="60 100 100" to="420 100 100" dur="10s" repeatCount="indefinite"/></circle>
          <circle cx="55" cy="150" r="4" fill="#00df89"><animateTransform attributeName="transform" type="rotate" from="120 100 100" to="480 100 100" dur="12s" repeatCount="indefinite"/></circle>
        </svg>
      </div>
      <h2>Prime Spirit Mentors presents</h2>
      <h1>PrimeQuest</h1>
      <p class="pq7-subtitle">Class 7 · CBSE NCERT Science · Story Adventure</p>
      <span class="pq7-class-badge">18 Worlds · 180 Rounds · 4320+ Questions · 18 Boss Battles</span>
      ${daily}
      <div class="pq7-btns">
        ${has?'<button class="pq7-btn pq7-btn-primary pq7-btn-lg pq7-btn-glow" data-a="continue">Continue Adventure</button>':''}
        <button class="pq7-btn ${has?'pq7-btn-ghost':'pq7-btn-primary pq7-btn-lg pq7-btn-glow'}" data-a="new-game">${has?'New Game':'Start Adventure'}</button>
        <button class="pq7-btn pq7-btn-ghost" data-a="collection">Science Spirit Collection</button>
      </div>
    </div>`;
  }

  _newGame(){
    this.player=this._defaultPlayer(); this._save(); this._setState('worldmap');
  }

  // ── WORLD MAP ──
  _rWorldMap(){
    const p=this.player;
    const cards=this.chapters.map((c,i)=>{
      const unlocked=p.chaptersUnlocked.includes(c.id);
      const done=p.chaptersCompleted.includes(c.id);
      const doneRounds=Object.keys(p.roundsCompleted[c.id]||{}).length;
      const total=c.rounds;
      const pctDone=pct(doneRounds,total);
      return `<div class="pq7-world-card ${unlocked?'':'locked'}" ${unlocked?`data-a="enter-chapter" data-chapter="${c.id}"`:''} style="--wcolor:${c.color};animation:fadeUp ${0.3+i*0.06}s ease both">
        <span class="pq7-world-badge">${done?'✓ DONE':pctDone+'%'}</span>
        <div class="pq7-world-icon">${c.icon}</div>
        <h3>${c.name}</h3>
        <p>${c.ncert}</p>
        <div class="pq7-world-progress"><div class="pq7-world-progress-fill" style="width:${pctDone}%;background:${c.color}"></div></div>
        ${unlocked?'':'<p style="font-size:.65rem;color:var(--pq-muted);margin-top:6px">🔒 Complete previous chapter</p>'}
      </div>`;
    }).join('');
    return `<div class="pq7-section-head"><h2>The Universe Awaits</h2><p>Each chapter is a world to explore. Defeat every Guardian to restore knowledge.</p></div>
      <div class="pq7-worlds">${cards}</div>`;
  }

  _enterChapter(chId){
    this.currentChapter=this.chapters.find(c=>c.id===chId);
    if(this.currentChapter)this._setState('roundselect');
  }

  // ── ROUND SELECT ──
  _rRoundSelect(){
    const c=this.currentChapter; if(!c)return'';
    const p=this.player;
    const doneR=p.roundsCompleted[c.id]||[];
    const items=c.roundDefs.map((r,i)=>{
      const done=doneR.includes(i);
      const prev=i===0||doneR.includes(i-1);
      const locked=!prev&&!done;
      const stars=(p.roundStars[c.id]||{})[i]||0;
      const starsH=Array.from({length:3},(_,s)=>s<stars?'★':'☆').join('');
      const diffLabel=['','Easy','Medium','Hard'][r.diff]||'';
      return `<div class="pq7-round-item ${locked?'locked':''}" ${locked?'':`data-a="enter-round" data-round="${i}"`} style="animation:fadeUp ${0.2+i*0.05}s ease both">
        <div class="pq7-round-num ${done?'done':locked?'locked-n':'active'}">${done?'✓':i+1}</div>
        <div class="pq7-round-info"><h4>${r.name}</h4><span>${diffLabel} · ${r.levels*6} questions</span></div>
        <div class="pq7-round-stars">${starsH}</div>
      </div>`;
    }).join('');

    const bossDone=p.bossesDefeated.includes(c.id);
    const allDone=doneR.length>=c.roundDefs.length;

    return `<div class="pq7-rounds">
      <button class="pq7-btn pq7-btn-ghost pq7-btn-sm pq7-mb-2" data-a="back-worlds">← Back to Chapters</button>
      <h2 style="color:${c.color};margin-bottom:4px">${c.icon} ${c.name}</h2>
      <p class="pq7-mb-2" style="color:var(--pq-sec);font-size:.85rem">${c.ncert}</p>
      ${items}
      ${allDone&&!bossDone?`<button class="pq7-btn pq7-btn-danger pq7-btn-lg pq7-btn-block pq7-mt-2" data-a="start-battle">⚔️ Challenge Guardian: ${c.boss.name}</button>`:''}
      ${bossDone?'<div class="pq7-card pq7-text-center pq7-mt-2" style="color:var(--pq-green)">🏆 Guardian Defeated! Chapter Complete!</div>':''}
    </div>`;
  }

  _enterRound(idx){
    if(!this.currentChapter)return;
    this.currentRound={...this.currentChapter.roundDefs[idx],idx};
    this._setState('levelselect');
  }

  // ── LEVEL SELECT ──
  _rLevelSelect(){
    const c=this.currentChapter, r=this.currentRound; if(!c||!r)return'';
    const p=this.player;
    const doneRounds=p.roundsCompleted[c.id]||[];
    const roundDone=doneRounds.includes(r.idx);
    const levels=['Explorer','Researcher','Scientist','Guardian Challenge'];
    const items=levels.map((name,i)=>{
      const done=roundDone;
      return `<div class="pq7-level-item" data-a="enter-level" data-level="${i}" style="animation:fadeUp ${0.2+i*0.06}s ease both">
        <div class="pq7-level-num ${done?'done':'active'}">${done?'✓':i+1}</div>
        <div class="pq7-level-info"><h4>${name}</h4><span>6 questions</span></div>
      </div>`;
    }).join('');
    return `<div class="pq7-levels">
      <button class="pq7-btn pq7-btn-ghost pq7-btn-sm pq7-mb-2" data-a="back-rounds">← Back to Rounds</button>
      <h2 style="margin-bottom:4px">Round ${r.idx+1}: ${r.name}</h2>
      <p class="pq7-mb-2" style="color:var(--pq-sec);font-size:.85rem">${['','Easy','Medium','Hard'][r.diff]} Difficulty</p>
      ${items}
    </div>`;
  }

  _enterLevel(idx){
    this.currentLevel=idx;
    // Play story before first level of each round
    const c=this.currentChapter, r=this.currentRound;
    const storyKey=`${c.id}_r${r.idx}`;
    const hasStory=PRIMEQUEST_DATA.stories[storyKey];
    if(hasStory&&idx===0){
      this._setState('story');
    } else {
      this._setState('gameplay');
    }
  }

  // ── STORY ──
  async _rStory(){
    const c=this.currentChapter, r=this.currentRound;
    const storyKey=`${c.id}_r${r.idx}`;
    // Will be filled by playStory
    setTimeout(async()=>{
      await this.story.playStory(storyKey, this.content);
      this._setState('gameplay');
    },100);
    return `<div class="pq7-story" id="pq7-story-area"></div>`;
  }

  // ── GAMEPLAY ──
  _startLevel(){
    const c=this.currentChapter, r=this.currentRound;
    const qs=this.questions.getQuestions(c.id,r.idx,this.currentLevel);
    this.levelQs=qs.length?qs:this._generateFallbackQs(6);
    this.qIdx=0; this.levelCorrect=0;
    this._setState('gameplay');
  }

  _rGameplay(){
    if(!this.levelQs.length||this.qIdx>=this.levelQs.length) return this._rLevelIntro();
    const q=this.levelQs[this.qIdx];
    const p=pct(this.qIdx,this.levelQs.length);
    return `<div class="pq7-play">
      <div class="pq7-progress-wrap">
        <div class="pq7-progress-label"><span>Question ${this.qIdx+1} of ${this.levelQs.length}</span><span>${this.levelCorrect} correct</span></div>
        <div class="pq7-progress-bar"><div class="pq7-progress-fill" style="width:${p}%"></div></div>
      </div>
      <div id="pq7-q-area"></div>
      <div id="pq7-fb-area"></div>
    </div>`;
  }

  // Render question after DOM ready
  _afterRenderGameplay(){
    if(this.state!=='gameplay')return;
    const q=this.levelQs[this.qIdx];
    const area=document.getElementById('pq7-q-area');
    if(!q||!area)return;
    this.questions.renderQuestion(q, area, correct=>this._onAnswer(correct));
  }

  _rLevelIntro(){
    const c=this.currentChapter,r=this.currentRound;
    return `<div class="pq7-results">
      <div class="pq7-results-icon">${c.icon}</div>
      <h2>Round ${r.idx+1}: ${r.name}</h2>
      <p class="pq7-sub">${c.ncert} · Level ${this.currentLevel+1} · 6 Questions</p>
      <div class="pq7-results-buttons">
        <button class="pq7-btn pq7-btn-primary pq7-btn-lg pq7-btn-glow" data-a="start-level">Begin Mission</button>
        <button class="pq7-btn pq7-btn-ghost" data-a="back-levels">← Back</button>
      </div>
    </div>`;
  }

  _onAnswer(correct){
    const q=this.levelQs[this.qIdx];
    const p=this.player;
    p.stats.played++;

    if(correct){
      p.stats.correct++; this.levelCorrect++; p.streak++;
      if(p.streak>p.bestStreak)p.bestStreak=p.streak;
      const xg=CFG.XP_CORRECT, cg=CFG.COIN_CORRECT;
      p.xp+=xg; p.coins+=cg;
      this.audio.correct();
      this.fx.particles(window.innerWidth/2, window.innerHeight/2, 12, '#00df89');
      this._toast(`+${xg} XP`,'xp');
      this._toast(`+${cg} Coins`,'coin');
    } else {
      p.stats.wrong++; p.streak=0;
      this.audio.wrong();
      this.fx.particles(window.innerWidth/2, window.innerHeight/2, 8, '#ef4444');
    }

    this._checkLevelUp();
    this._checkAchievements();

    const fbArea=document.getElementById('pq7-fb-area');
    if(fbArea){
      const robot=q.tip?`<div class="pq7-robot"><div class="pq7-robot-avatar">🤖</div><div class="pq7-robot-text"><strong>Science Bot:</strong> ${q.tip}</div></div>`:'';
      fbArea.innerHTML=`<div class="pq7-feedback ${correct?'correct-fb':'wrong-fb'}">
        <div class="pq7-fb-title">${correct?'✅ Correct!':'❌ Not quite!'}</div>
        <div class="pq7-fb-explain">${q.explain}</div>
        ${q.formula?`<div class="pq7-fb-formula">📐 ${q.formula}</div>`:''}
        ${robot}
      </div>
      <div class="pq7-text-center pq7-mt-2">
        <button class="pq7-btn pq7-btn-primary" data-a="next-q">Next Question →</button>
      </div>`;
    }
    this._renderHUD(); this._save();
  }

  _nextQ(){
    this.qIdx++;
    if(this.qIdx>=this.levelQs.length){ this._completeLevel(); return; }
    this._setState('gameplay');
  }

  _completeLevel(){
    const c=this.currentChapter,r=this.currentRound,p=this.player;
    const total=this.levelQs.length;
    const acc=pct(this.levelCorrect,total);
    const stars=acc>=90?3:acc>=70?2:acc>=50?1:0;

    if(!p.roundsCompleted[c.id])p.roundsCompleted[c.id]=[];
    if(!p.roundsCompleted[c.id].includes(r.idx))p.roundsCompleted[c.id].push(r.idx);

    if(!p.roundStars[c.id])p.roundStars[c.id]={};
    p.roundStars[c.id][r.idx]=Math.max(stars,p.roundStars[c.id][r.idx]||0);

    p.stats.totalLevels++;
    if(acc===100)p.stats.perfectLevels++;

    // Unlock next chapter if all rounds done
    const allDone=p.roundsCompleted[c.id].length>=c.roundDefs.length;
    const nextIdx=this.chapters.indexOf(c)+1;
    if(allDone&&nextIdx<this.chapters.length){
      const nextId=this.chapters[nextIdx].id;
      if(!p.chaptersUnlocked.includes(nextId))p.chaptersUnlocked.push(nextId);
    }
    if(allDone&&!p.chaptersCompleted.includes(c.id))p.chaptersCompleted.push(c.id);

    this.audio.levelUp();
    this._checkLevelUp();
    this._checkAchievements();
    this._save();
    this._setState('results',{acc,stars});
  }

  _rResults(d={}){
    const sc=d.stars||0;
    const starsH=Array.from({length:3},(_,i)=>i<sc?'★':'☆').join('');
    return `<div class="pq7-results">
      <div class="pq7-results-icon">${sc>=3?'🏆':sc>=2?'⭐':'✅'}</div>
      <h2>Mission Complete!</h2>
      <p class="pq7-sub">Round ${this.currentRound?.idx+1} · Level ${this.currentLevel+1}</p>
      <div class="pq7-results-stars">${starsH}</div>
      <div class="pq7-results-stats">
        <div class="pq7-stat-box"><div class="pq7-stat-val" style="color:var(--pq-green)">${this.levelCorrect}/${this.levelQs.length}</div><div class="pq7-stat-lbl">Correct</div></div>
        <div class="pq7-stat-box"><div class="pq7-stat-val" style="color:var(--pq-accent)">${d.acc||0}%</div><div class="pq7-stat-lbl">Accuracy</div></div>
        <div class="pq7-stat-box"><div class="pq7-stat-val" style="color:var(--pq-gold)">Lv ${this.player.level}</div><div class="pq7-stat-lbl">Player Level</div></div>
      </div>
      <div class="pq7-results-buttons">
        <button class="pq7-btn pq7-btn-primary" data-a="back-rounds">Continue</button>
        <button class="pq7-btn pq7-btn-ghost" data-a="back-worlds">World Map</button>
      </div>
    </div>`;
  }


  // ══════════════════════════════════════════
  //  BOSS BATTLE
  // ══════════════════════════════════════════
  _startBattle(){
    const c=this.currentChapter; if(!c)return;
    const bQs=this.questions.getBossQuestions(c.id);
    const qs=bQs.length?bQs:this._generateFallbackQs(15);
    this.battleState={
      bossHp:c.boss.hp,playerHp:CFG.PLAYER_HP,maxBossHp:c.boss.hp,
      qs,qIdx:0,phase:'intro',combo:0,maxCombo:0,bossPhase:'normal'
    };
    this._setState('boss_battle');
  }

  _rBossBattle(){
    const b=this.battleState,c=this.currentChapter; if(!b||!c)return'';
    const boss=c.boss;

    if(b.phase==='intro'){
      return `<div class="pq7-results">
        <div class="pq7-boss-avatar" style="border-color:${c.color}">${boss.icon||'👹'}</div>
        <h2 style="color:var(--pq-red)">${boss.name}</h2>
        <p class="pq7-sub">${boss.title}</p>
        <p style="font-style:italic;color:var(--pq-sec);margin:16px 0">"${pick(boss.phrases)}"</p>
        <p class="pq7-mb-2" style="font-size:.85rem">Answer correctly to deal damage. Wrong answers cost you HP!</p>
        <button class="pq7-btn pq7-btn-danger pq7-btn-lg pq7-btn-glow" data-a="battle-answer" data-idx="-1">⚔️ Begin Battle!</button>
      </div>`;
    }

    if(b.phase==='won'){
      return `<div class="pq7-results">
        <div class="pq7-results-icon">🏆</div>
        <h2>Victory!</h2>
        <p class="pq7-sub">${boss.name} has been defeated!</p>
        <div class="pq7-results-stats">
          <div class="pq7-stat-box"><div class="pq7-stat-val" style="color:var(--pq-green)">+${CFG.XP_BOSS}</div><div class="pq7-stat-lbl">XP</div></div>
          <div class="pq7-stat-box"><div class="pq7-stat-val" style="color:var(--pq-gold)">+${CFG.COIN_BOSS}</div><div class="pq7-stat-lbl">Coins</div></div>
          <div class="pq7-stat-box"><div class="pq7-stat-val">🔮</div><div class="pq7-stat-lbl">Spirit</div></div>
        </div>
        <button class="pq7-btn pq7-btn-primary" data-a="results-continue">Continue</button>
      </div>`;
    }

    if(b.phase==='lost'){
      return `<div class="pq7-results">
        <div class="pq7-results-icon">💀</div>
        <h2>Defeated</h2>
        <p class="pq7-sub">${boss.name} was too strong this time.</p>
        <div class="pq7-results-buttons">
          <button class="pq7-btn pq7-btn-danger pq7-btn-lg" data-a="start-battle">Retry Battle</button>
          <button class="pq7-btn pq7-btn-ghost" data-a="back-levels">Train More</button>
        </div>
      </div>`;
    }

    // FIGHT
    const q=b.qs[b.qIdx];
    if(!q)return'<p>No more questions.</p>';

    const letters=['A','B','C','D'];
    let optsHTML='';
    if(q.type==='mcq'){
      optsHTML=q.opts.map((o,i)=>`<div class="pq7-option" data-a="battle-answer" data-idx="${i}"><span class="pq7-option-letter">${letters[i]}</span><span>${o}</span></div>`).join('');
    } else if(q.type==='truefalse'){
      optsHTML=['True','False'].map((o,i)=>`<div class="pq7-option" data-a="battle-answer" data-idx="${i}"><span class="pq7-option-letter">${i===0?'T':'F'}</span><span>${o}</span></div>`).join('');
    }

    const bossPct=pct(b.bossHp,b.maxBossHp);
    const playerPct=pct(b.playerHp,CFG.PLAYER_HP);
    if(bossPct<=25)b.bossPhase='desperate'; else if(bossPct<=50)b.bossPhase='enraged'; else b.bossPhase='normal';
    const phaseL={normal:'🟢 Normal',enraged:'🔴 Enraged',desperate:'🟣 Desperate'};

    const comboPips=Array.from({length:8},(_,i)=>`<div class="pq7-combo-pip ${i<b.combo?'active':''}"></div>`).join('');

    return `<div class="pq7-battle">
      <div class="pq7-boss-header">
        <div class="pq7-boss-avatar" style="border-color:${c.color}">${boss.icon||'👹'}</div>
        <div class="pq7-boss-name">${boss.name}</div>
        <div class="pq7-boss-title">${boss.title}</div>
        <span class="pq7-boss-phase ${b.bossPhase}">${phaseL[b.bossPhase]}</span>
      </div>
      <div class="pq7-hp-bars">
        <div class="pq7-hp-row"><span class="pq7-hp-label" style="color:var(--pq-green)">YOU</span><div class="pq7-hp-bar"><div class="pq7-hp-fill player-hp" style="width:${playerPct}%"></div></div><span class="pq7-hp-value">${b.playerHp}</span></div>
        <div class="pq7-hp-row"><span class="pq7-hp-label" style="color:var(--pq-red)">BOSS</span><div class="pq7-hp-bar"><div class="pq7-hp-fill boss-hp" style="width:${bossPct}%"></div></div><span class="pq7-hp-value">${b.bossHp}</span></div>
      </div>
      ${b.combo>0?`<div class="pq7-combo-bar"><span class="pq7-combo-label">${b.combo}x COMBO</span><div class="pq7-combo-pips">${comboPips}</div></div>`:''}
      <div class="pq7-question-card">
        <div class="pq7-q-type">Round ${b.qIdx+1} of ${b.qs.length}</div>
        <p class="pq7-q-text">${q.q}</p>
        ${q.formula?`<div class="pq7-q-formula">${q.formula}</div>`:''}
      </div>
      <div class="pq7-options" id="pq7-battle-opts">${optsHTML}</div>
      <div id="pq7-battle-fb"></div>
    </div>`;
  }

  _battleAnswer(idx,event){
    const b=this.battleState; if(!b)return;
    if(b.phase==='intro'){ b.phase='fight'; this._setState('boss_battle'); return; }
    if(b.phase!=='fight')return;

    const q=b.qs[b.qIdx]; if(!q)return;
    let correct;
    if(q.type==='mcq') correct=idx===q.ans;
    else if(q.type==='truefalse') correct=(idx===0)===q.ans;
    else correct=false;

    const opts=this.content.querySelectorAll('#pq7-battle-opts .pq7-option');
    opts.forEach((o,i)=>{
      o.classList.add('disabled');
      if(q.type==='mcq'&&i===q.ans)o.classList.add('correct');
      if(q.type==='truefalse'&&((i===0)===q.ans))o.classList.add('correct');
      if(i===idx&&!correct)o.classList.add('wrong');
    });

    const p=this.player; p.stats.played++;

    if(correct){
      p.stats.correct++; p.xp+=CFG.XP_CORRECT; p.coins+=CFG.COIN_CORRECT;
      b.combo++; if(b.combo>b.maxCombo)b.maxCombo=b.combo;
      if(b.combo>(p.stats.bestCombo||0))p.stats.bestCombo=b.combo;
      const ci=Math.min(b.combo,CFG.COMBO_MULT.length-1);
      let dmg=Math.round(CFG.DMG_CORRECT*CFG.COMBO_MULT[ci]);
      let isCrit=false;
      if(Math.random()<CFG.CRIT_CHANCE){ dmg*=CFG.CRIT_MULT; isCrit=true; }
      b.bossHp=Math.max(0,b.bossHp-dmg);
      this.audio.bossHit();
      if(isCrit){ this.audio.critical(); this.fx.shake(this.content); this.fx.critFlash(); }
      if(b.combo>=2)this.audio.combo(b.combo);
      if(b.combo>=3)this.fx.comboPopup(b.combo);
      this.fx.particles(event?.clientX||window.innerWidth/2,event?.clientY||window.innerHeight/2,isCrit?20:12,isCrit?'#f5c842':c_color(this));
      this.fx.floatText(event?.clientX||window.innerWidth/2,(event?.clientY||window.innerHeight/2)-30,`-${dmg} HP`+(isCrit?' CRIT!':''),isCrit?'#f5c842':'#00df89');
      this._toast(`-${dmg} Boss HP!`,'xp');

      const fb=this.content.querySelector('#pq7-battle-fb');
      if(fb)fb.innerHTML=`<div class="pq7-feedback correct-fb"><div class="pq7-fb-title">✅ ${isCrit?'CRITICAL HIT!':'Direct Hit!'}${b.combo>=2?` (${b.combo}x combo)`:''}</div><div class="pq7-fb-explain">${q.explain}</div></div>
        <div class="pq7-text-center pq7-mt-2"><button class="pq7-btn pq7-btn-primary" data-a="battle-next">Next Round →</button></div>`;
    } else {
      p.stats.wrong++; p.streak=0; b.combo=0;
      let dmgW=CFG.DMG_WRONG;
      if(b.bossPhase==='enraged')dmgW+=5;
      if(b.bossPhase==='desperate')dmgW+=8;
      b.playerHp=Math.max(0,b.playerHp-dmgW);
      this.audio.playerHit();
      this.fx.shake(this.content);
      this.fx.particles(event?.clientX||window.innerWidth/2,event?.clientY||window.innerHeight/2,8,'#ef4444');

      const fb=this.content.querySelector('#pq7-battle-fb');
      if(fb)fb.innerHTML=`<div class="pq7-feedback wrong-fb"><div class="pq7-fb-title">💥 Boss Attacks! (-${dmgW} HP)</div><div class="pq7-fb-explain">${q.explain}</div>
        ${q.tip?`<div class="pq7-robot"><div class="pq7-robot-avatar">🤖</div><div class="pq7-robot-text"><strong>Science Bot:</strong> ${q.tip}</div></div>`:''}</div>
        <div class="pq7-text-center pq7-mt-2"><button class="pq7-btn pq7-btn-primary" data-a="battle-next">Next Round →</button></div>`;
    }
    this._renderHUD(); this._save();
    function c_color(self){ return self.currentChapter?.color||'#00df89'; }
  }

  _battleNextQ(){
    const b=this.battleState; if(!b)return;
    if(b.bossHp<=0){ this._battleVictory(); return; }
    if(b.playerHp<=0){ b.phase='lost'; this._setState('boss_battle'); return; }
    b.qIdx++;
    if(b.qIdx>=b.qs.length){ this._battleVictory(); return; }
    this._setState('boss_battle');
  }

  _battleVictory(){
    const b=this.battleState, c=this.currentChapter, p=this.player;
    b.phase='won';
    p.xp+=CFG.XP_BOSS; p.coins+=CFG.COIN_BOSS;
    if(!p.bossesDefeated.includes(c.id))p.bossesDefeated.push(c.id);
    if(c.creature&&!p.creatures.includes(c.creature)){
      p.creatures.push(c.creature);
      this._toast('New Spirit: '+c.creature.replace(/_/g,' '),'creature');
      this.audio.creature();
    }
    this.audio.victory();
    this._checkLevelUp(); this._checkAchievements(); this._save();
    this._setState('boss_battle');
  }


  // ── COLLECTION ──
  _rCollection(){
    const p=this.player, all=PRIMEQUEST_DATA.creatures;
    const cards=all.map(c=>{
      const owned=p.creatures.includes(c.id);
      return `<div class="pq7-creature-card ${owned?'':'locked'}">
        <div class="pq7-creature-icon">${c.icon}</div>
        <h4>${c.name}</h4><p>${owned?c.desc:'???'}</p>
        <span class="pq7-creature-rarity pq7-rarity-${c.rarity}">${c.rarity}</span>
      </div>`;
    }).join('');
    return `<div class="pq7-section-head"><h2>Science Spirit Collection</h2><p>${p.creatures.length}/${all.length} spirits collected</p></div>
      <div class="pq7-creature-grid">${cards}</div>
      <div class="pq7-text-center pq7-mt-3"><button class="pq7-btn pq7-btn-ghost" data-a="back-worlds">← Back</button></div>`;
  }

  // ── SHOP ──
  _rShop(){
    const p=this.player, items=PRIMEQUEST_DATA.shop;
    const grid=items.map(g=>{
      const can=p.coins>=g.cost;
      return `<div class="pq7-shop-item"><div class="pq7-shop-icon">${g.icon}</div><h4>${g.name}</h4><p>${g.desc}</p>
        <div class="pq7-shop-price">🪙 ${g.cost}</div></div>`;
    }).join('');
    return `<div class="pq7-section-head"><h2>Gadget Shop</h2><p>Your coins: 🪙 ${p.coins}</p></div>
      <div class="pq7-shop-grid">${grid}</div>
      <div class="pq7-text-center pq7-mt-3"><button class="pq7-btn pq7-btn-ghost" data-a="back-worlds">← Back</button></div>`;
  }

  // ── ACHIEVEMENTS ──
  _rAchievements(){
    const p=this.player, all=PRIMEQUEST_DATA.achievements;
    const items=all.map(a=>{
      const unlocked=p.achievements.includes(a.id);
      return `<div class="pq7-creature-card" style="opacity:${unlocked?1:0.35}">
        <div class="pq7-creature-icon">${a.icon}</div><h4>${a.name}</h4><p>${a.desc}</p>
        ${unlocked?'<span style="font-size:.7rem;color:var(--pq-green)">✓ Unlocked</span>':'<span style="font-size:.7rem;color:var(--pq-muted)">Locked</span>'}
      </div>`;
    }).join('');
    return `<div class="pq7-section-head"><h2>Achievements</h2><p>${p.achievements.length}/${all.length} unlocked</p></div>
      <div class="pq7-creature-grid">${items}</div>
      <div class="pq7-text-center pq7-mt-3"><button class="pq7-btn pq7-btn-ghost" data-a="back-worlds">← Back</button></div>`;
  }

  // ── SETTINGS ──
  _rSettings(){
    const s=this.player.settings, p=this.player;
    return `<div class="pq7-settings"><h2>Settings</h2>
      <div class="pq7-setting-row"><label>Sound Effects</label><div class="pq7-toggle ${s.sfx?'on':''}" data-a="toggle-sfx"></div></div>
      <hr style="border:none;border-top:1px solid var(--pq-border);margin:12px 0">
      <div class="pq7-setting-row"><label>Player Level</label><span style="color:var(--pq-accent)">${p.level}</span></div>
      <div class="pq7-setting-row"><label>Total XP</label><span style="color:var(--pq-accent)">${p.xp}</span></div>
      <div class="pq7-setting-row"><label>Questions Answered</label><span style="color:var(--pq-accent)">${p.stats.played}</span></div>
      <div class="pq7-setting-row"><label>Accuracy</label><span style="color:var(--pq-accent)">${pct(p.stats.correct,p.stats.played)}%</span></div>
      <div class="pq7-setting-row"><label>Creatures Collected</label><span style="color:var(--pq-accent)">${p.creatures.length}</span></div>
      <div class="pq7-mt-3 pq7-text-center"><button class="pq7-btn pq7-btn-danger pq7-btn-sm" data-a="new-game">Reset All Progress</button></div>
      <div class="pq7-mt-2 pq7-text-center"><button class="pq7-btn pq7-btn-ghost" data-a="back-worlds">← Back</button></div>
    </div>`;
  }

  _toggleSfx(){
    this.player.settings.sfx=!this.player.settings.sfx;
    this.audio.setMuted(!this.player.settings.sfx);
    this._save(); this._setState('settings');
  }


  // ── HELPERS ──
  _checkLevelUp(){
    const p=this.player, curve=CFG.XP_CURVE;
    while(p.level<curve.length-1&&p.xp>=curve[p.level]){
      p.level++; this._toast(`Level Up! Lv ${p.level}`,'level'); this.audio.levelUp();
    }
  }

  _checkAchievements(){
    const p=this.player;
    const checks=[
      {id:'first_correct',name:'First Light',icon:'💡',check:()=>p.stats.correct>=1},
      {id:'streak_5',name:'Hot Streak',icon:'🔥',check:()=>p.streak>=5},
      {id:'correct_50',name:'Half Century',icon:'🎯',check:()=>p.stats.correct>=50},
      {id:'boss_1',name:'Guardian Slayer',icon:'⚔️',check:()=>p.bossesDefeated.length>=1},
      {id:'creature_3',name:'Collector',icon:'🧪',check:()=>p.creatures.length>=3},
      {id:'level_5',name:'Rising Star',icon:'⭐',check:()=>p.level>=5},
    ];
    checks.forEach(a=>{
      if(!p.achievements.includes(a.id)&&a.check()){
        p.achievements.push(a.id);
        p.xp+=25;
        this._toast('🏆 '+a.name+' +25 XP','level');
      }
    });
  }

  _generateFallbackQs(count){
    return Array.from({length:count},(_,i)=>({
      type:'mcq', q:`Sample question ${i+1} for this chapter. Content is loading...`,
      opts:['Option A','Option B','Option C','Option D'], ans:0,
      explain:'This is a placeholder. Full questions load from the data file.'
    }));
  }

  _toast(msg,type){
    const el=document.createElement('div');
    el.className='pq7-toast pq7-toast-'+(type||'xp');
    el.textContent=msg;
    this.toastsEl.appendChild(el);
    setTimeout(()=>{el.style.opacity='0';el.style.transform='translateX(40px)';setTimeout(()=>el.remove(),350);},2400);
  }

  _close(){
    this._save(); if(this.fx)this.fx.destroy();
    this.root.innerHTML='<div style="padding:60px;text-align:center"><h2 style="font-family:var(--pq-head)">Game Saved & Closed</h2><p style="color:var(--pq-sec)">Your progress is safe. Refresh the page to play again.</p></div>';
  }
}


// ═══════════════════════════════════════════════════════
//  HOOK: Render questions after DOM update
// ═══════════════════════════════════════════════════════
const origRenderState = PrimeQuest.prototype._renderState;
PrimeQuest.prototype._renderState = function(data){
  origRenderState.call(this, data);
  if(this.state==='gameplay') requestAnimationFrame(()=>this._afterRenderGameplay());
};


// ═══════════════════════════════════════════════════════
//  LAUNCHER
// ═══════════════════════════════════════════════════════
const root=document.querySelector('.pq7-root');
if(root){
  const game=new PrimeQuest(root);
  game.init().catch(err=>{
    console.error('[PrimeQuest] Init failed:',err);
    root.innerHTML='<div style="padding:40px;text-align:center;color:#ef4444"><h2>Failed to load PrimeQuest</h2><p>'+err.message+'</p></div>';
  });
}

})();
