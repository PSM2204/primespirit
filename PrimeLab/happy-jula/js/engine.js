/* ==========================================
   HAPPY JULA — Core Engine
   Store, Sound, Adaptive AI, Utilities,
   Particles, Confetti, Charts
   ========================================== */

const HappyJula = {};

// ============ STORE ============
HappyJula.store = {
    KEY: 'happy-jula-data',

    defaults() {
        return {
            onboarded: false,
            user: {
                name: 'Player',
                avatar: '🐼',
                level: 1,
                xp: 0,
                coins: 0,
                diamonds: 0,
                stars: 0,
                streak: 0,
                bestStreak: 0,
                lastPlayDate: null,
                joinDate: new Date().toISOString()
            },
            games: {},
            settings: {
                darkMode: true,
                sound: true,
                music: false,
                haptic: true,
                colorBlind: false,
                dyslexiaFont: false,
                largeText: false
            },
            achievements: {},
            dailyChallenge: null,
            dailyCompleted: [],
            history: [],
            totalTimeMs: 0
        };
    },

    data: null,

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            this.data = raw ? this._merge(this.defaults(), JSON.parse(raw)) : this.defaults();
        } catch (e) {
            this.data = this.defaults();
        }
        return this.data;
    },

    save() {
        try { localStorage.setItem(this.KEY, JSON.stringify(this.data)); } catch(e) {}
    },

    _merge(def, saved) {
        const result = { ...def };
        for (const key of Object.keys(saved)) {
            if (saved[key] !== null && typeof saved[key] === 'object' && !Array.isArray(saved[key]) && def[key]) {
                result[key] = this._merge(def[key], saved[key]);
            } else {
                result[key] = saved[key];
            }
        }
        return result;
    },

    getGame(id) {
        if (!this.data.games[id]) {
            this.data.games[id] = {
                highScore: 0,
                totalPlayed: 0,
                totalCorrect: 0,
                totalWrong: 0,
                totalTimeMs: 0,
                avgTime: 0,
                difficulty: 'beginner',
                level: 1,
                history: []
            };
        }
        return this.data.games[id];
    },

    addXP(amount) {
        this.data.user.xp += amount;
        const needed = this.xpForLevel(this.data.user.level);
        while (this.data.user.xp >= needed) {
            this.data.user.xp -= needed;
            this.data.user.level++;
            HappyJula.sound.play('levelup');
            HappyJula.app.showToast(`🎉 Level Up! Level ${this.data.user.level}`);
        }
        this.save();
    },

    addCoins(amount) {
        this.data.user.coins += amount;
        this.save();
    },

    xpForLevel(level) {
        return Math.floor(100 * Math.pow(1.3, level - 1));
    },

    updateStreak() {
        const today = new Date().toDateString();
        const last = this.data.user.lastPlayDate;
        if (last === today) return;
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (last === yesterday) {
            this.data.user.streak++;
        } else if (last !== today) {
            this.data.user.streak = 1;
        }
        this.data.user.lastPlayDate = today;
        if (this.data.user.streak > this.data.user.bestStreak) {
            this.data.user.bestStreak = this.data.user.streak;
        }
        this.save();
    },

    recordGame(gameId, result) {
        const game = this.getGame(gameId);
        game.totalPlayed++;
        game.totalCorrect += result.correct;
        game.totalWrong += result.wrong;
        game.totalTimeMs += result.timeMs;
        game.avgTime = game.totalTimeMs / game.totalPlayed;
        const isBest = result.score > game.highScore;
        if (isBest) game.highScore = result.score;
        game.history.push({
            score: result.score,
            accuracy: result.accuracy,
            timeMs: result.timeMs,
            date: new Date().toISOString()
        });
        if (game.history.length > 50) game.history = game.history.slice(-50);

        this.data.history.push({
            gameId,
            score: result.score,
            date: new Date().toDateString()
        });
        this.data.totalTimeMs += result.timeMs;

        const xpEarned = Math.round(result.score * 0.5 + result.accuracy * 2);
        const coinsEarned = Math.round(result.score * 0.2 + 5);
        this.addXP(xpEarned);
        this.addCoins(coinsEarned);
        this.updateStreak();

        // Update daily completed
        if (this.data.dailyChallenge && this.data.dailyChallenge.games) {
            const dc = this.data.dailyChallenge;
            if (dc.date === new Date().toDateString() && dc.games.includes(gameId)) {
                if (!this.data.dailyCompleted.includes(gameId)) {
                    this.data.dailyCompleted.push(gameId);
                }
            }
        }

        this.save();
        HappyJula.adaptive.update(gameId, result);

        return { xpEarned, coinsEarned, isBest };
    }
};

// ============ SOUND ============
HappyJula.sound = {
    ctx: null,
    muted: false,

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch(e) {}
    },

    ensure() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    play(type) {
        if (!HappyJula.store.data.settings.sound || this.muted || !this.ctx) return;
        this.ensure();
        const c = this.ctx;
        const now = c.currentTime;
        const g = c.createGain();
        g.connect(c.destination);

        switch(type) {
            case 'click': {
                const o = c.createOscillator();
                o.type = 'sine';
                o.frequency.setValueAtTime(800, now);
                o.frequency.exponentialRampToValueAtTime(400, now + 0.08);
                g.gain.setValueAtTime(0.15, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.08);
                break;
            }
            case 'success': {
                [523, 659, 784].forEach((f, i) => {
                    const o = c.createOscillator();
                    o.type = 'sine';
                    o.frequency.value = f;
                    const gn = c.createGain();
                    gn.gain.setValueAtTime(0, now + i * 0.1);
                    gn.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.05);
                    gn.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.3);
                    o.connect(gn);
                    gn.connect(c.destination);
                    o.start(now + i * 0.1);
                    o.stop(now + i * 0.1 + 0.3);
                });
                return;
            }
            case 'fail': {
                const o = c.createOscillator();
                o.type = 'sawtooth';
                o.frequency.setValueAtTime(300, now);
                o.frequency.exponentialRampToValueAtTime(100, now + 0.3);
                g.gain.setValueAtTime(0.08, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.3);
                break;
            }
            case 'coin': {
                const o = c.createOscillator();
                o.type = 'sine';
                o.frequency.setValueAtTime(1200, now);
                o.frequency.setValueAtTime(1600, now + 0.05);
                g.gain.setValueAtTime(0.1, now);
                g.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
                o.connect(g);
                o.start(now);
                o.stop(now + 0.15);
                break;
            }
            case 'levelup': {
                [523, 659, 784, 1047].forEach((f, i) => {
                    const o = c.createOscillator();
                    o.type = 'sine';
                    o.frequency.value = f;
                    const gn = c.createGain();
                    gn.gain.setValueAtTime(0, now + i * 0.12);
                    gn.gain.linearRampToValueAtTime(0.12, now + i * 0.12 + 0.06);
                    gn.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.4);
                    o.connect(gn);
                    gn.connect(c.destination);
                    o.start(now + i * 0.12);
                    o.stop(now + i * 0.12 + 0.4);
                });
                return;
            }
            case 'achievement': {
                [784, 988, 1175, 1568].forEach((f, i) => {
                    const o = c.createOscillator();
                    o.type = 'triangle';
                    o.frequency.value = f;
                    const gn = c.createGain();
                    gn.gain.setValueAtTime(0, now + i * 0.15);
                    gn.gain.linearRampToValueAtTime(0.1, now + i * 0.15 + 0.08);
                    gn.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.5);
                    o.connect(gn);
                    gn.connect(c.destination);
                    o.start(now + i * 0.15);
                    o.stop(now + i * 0.15 + 0.5);
                });
                return;
            }
        }
        if (g) { g.gain.setValueAtTime(0.001, now + 0.01); }
    },

    haptic(pattern) {
        if (!HappyJula.store.data.settings.haptic) return;
        if (navigator.vibrate) navigator.vibrate(pattern || 15);
    }
};

// ============ ADAPTIVE AI ============
HappyJula.adaptive = {
    DIFFICULTIES: ['beginner', 'easy', 'medium', 'hard', 'expert', 'master'],
    THRESHOLDS: { up: 80, down: 40 },

    update(gameId, result) {
        const game = HappyJula.store.getGame(gameId);
        const idx = this.DIFFICULTIES.indexOf(game.difficulty);

        if (result.accuracy >= this.THRESHOLDS.up && idx < this.DIFFICULTIES.length - 1) {
            game.difficulty = this.DIFFICULTIES[idx + 1];
            game.level = Math.min(game.level + 1, 100);
        } else if (result.accuracy < this.THRESHOLDS.down && idx > 0) {
            game.difficulty = this.DIFFICULTIES[idx - 1];
        }
        HappyJula.store.save();
    },

    getDifficulty(gameId) {
        return HappyJula.store.getGame(gameId).difficulty;
    },

    getWeakAreas() {
        const areas = {};
        for (const [id, g] of Object.entries(HappyJula.store.data.games)) {
            if (g.totalPlayed > 0) {
                const acc = g.totalCorrect / Math.max(1, g.totalCorrect + g.totalWrong) * 100;
                if (acc < 60) areas[id] = acc;
            }
        }
        return areas;
    },

    recommend() {
        const weak = this.getWeakAreas();
        const games = Object.keys(weak);
        if (games.length === 0) {
            return HappyJula.games.list.slice(0, 3).map(g => g.id);
        }
        return games.slice(0, 5);
    },

    brainAge() {
        const d = HappyJula.store.data;
        let totalAcc = 0, totalGames = 0;
        for (const g of Object.values(d.games)) {
            if (g.totalPlayed > 0) {
                totalAcc += g.totalCorrect / Math.max(1, g.totalCorrect + g.totalWrong) * 100;
                totalGames++;
            }
        }
        if (totalGames === 0) return 25;
        const avgAcc = totalAcc / totalGames;
        const level = d.user.level;
        let age = 25 - (avgAcc - 50) * 0.1 - level * 0.15;
        return Math.max(8, Math.min(30, Math.round(age)));
    }
};

// ============ DAILY CHALLENGE ============
HappyJula.daily = {
    generate() {
        const store = HappyJula.store.data;
        const today = new Date().toDateString();
        if (store.dailyChallenge && store.dailyChallenge.date === today) return;

        const all = HappyJula.games.list;
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, 5).map(g => g.id);

        store.dailyChallenge = { date: today, games: selected };
        store.dailyCompleted = [];
        HappyJula.store.save();
    },

    isComplete() {
        const dc = HappyJula.store.data.dailyChallenge;
        if (!dc) return false;
        return HappyJula.store.data.dailyCompleted.length >= dc.games.length;
    },

    progress() {
        const dc = HappyJula.store.data.dailyChallenge;
        if (!dc) return 0;
        return HappyJula.store.data.dailyCompleted.length / dc.games.length;
    }
};

// ============ ACHIEVEMENTS ============
HappyJula.achievementsList = [
    { id: 'first_game', name: 'First Step', icon: '🎯', desc: 'Complete your first game', check: d => d.user.streak >= 0 && Object.values(d.games).some(g => g.totalPlayed > 0) },
    { id: 'streak_3', name: 'Consistent', icon: '🔥', desc: '3 day streak', check: d => d.user.bestStreak >= 3 },
    { id: 'streak_7', name: 'Weekly Warrior', icon: '⚡', desc: '7 day streak', check: d => d.user.bestStreak >= 7 },
    { id: 'streak_30', name: 'Monthly Master', icon: '👑', desc: '30 day streak', check: d => d.user.bestStreak >= 30 },
    { id: 'level_5', name: 'Rising Star', icon: '⭐', desc: 'Reach level 5', check: d => d.user.level >= 5 },
    { id: 'level_10', name: 'Brain Champion', icon: '🏆', desc: 'Reach level 10', check: d => d.user.level >= 10 },
    { id: 'level_25', name: 'Genius', icon: '🧠', desc: 'Reach level 25', check: d => d.user.level >= 25 },
    { id: 'games_10', name: 'Explorer', icon: '🗺️', desc: 'Play 10 games', check: d => Object.values(d.games).reduce((s, g) => s + g.totalPlayed, 0) >= 10 },
    { id: 'games_50', name: 'Dedicated', icon: '💪', desc: 'Play 50 games', check: d => Object.values(d.games).reduce((s, g) => s + g.totalPlayed, 0) >= 50 },
    { id: 'games_100', name: 'Veteran', icon: '🎖️', desc: 'Play 100 games', check: d => Object.values(d.games).reduce((s, g) => s + g.totalPlayed, 0) >= 100 },
    { id: 'coins_100', name: 'Collector', icon: '🪙', desc: 'Earn 100 coins', check: d => d.user.coins >= 100 },
    { id: 'coins_500', name: 'Rich', icon: '💰', desc: 'Earn 500 coins', check: d => d.user.coins >= 500 },
    { id: 'daily_1', name: 'Daily Devotee', icon: '📅', desc: 'Complete a daily challenge', check: d => d.dailyCompleted.length >= 5 },
    { id: 'perfect', name: 'Perfect!', icon: '💯', desc: 'Get 100% accuracy', check: d => Object.values(d.games).some(g => g.history.some(h => h.accuracy >= 100)) },
    { id: 'speed', name: 'Lightning Fast', icon: '⚡', desc: 'Complete a game in under 10s', check: d => Object.values(d.games).some(g => g.history.some(h => h.timeMs < 10000)) },
    { id: 'memory_master', name: 'Memory Master', icon: '🧩', desc: 'Play 5 memory games', check: d => ['card-flip','number-recall','color-recall','grid-recall','emoji-recall'].reduce((s, id) => s + (d.games[id]?.totalPlayed || 0), 0) >= 5 },
];

HappyJula.checkAchievements = function() {
    const d = HappyJula.store.data;
    const newOnes = [];
    for (const a of HappyJula.achievementsList) {
        if (!d.achievements[a.id] && a.check(d)) {
            d.achievements[a.id] = Date.now();
            newOnes.push(a);
        }
    }
    if (newOnes.length > 0) {
        HappyJula.store.save();
        for (const a of newOnes) {
            setTimeout(() => {
                HappyJula.sound.play('achievement');
                HappyJula.app.showToast(`🏅 ${a.name}: ${a.desc}`);
                HappyJula.showConfetti();
            }, 300);
        }
    }
};

// ============ WORLDS ============
HappyJula.worlds = [
    { id: 'forest', name: 'Forest Mind', icon: '🌲', color: 'linear-gradient(135deg,#065f46,#059669)', level: 1 },
    { id: 'ocean', name: 'Ocean Memory', icon: '🌊', color: 'linear-gradient(135deg,#1e3a5f,#0ea5e9)', level: 3 },
    { id: 'galaxy', name: 'Galaxy Logic', icon: '🌌', color: 'linear-gradient(135deg,#312e81,#7c3aed)', level: 5 },
    { id: 'castle', name: 'Castle Math', icon: '🏰', color: 'linear-gradient(135deg,#78350f,#f59e0b)', level: 8 },
    { id: 'cyber', name: 'Cyber Speed', icon: '🤖', color: 'linear-gradient(135deg,#134e4a,#22d3ee)', level: 10 },
    { id: 'dream', name: 'Dream Language', icon: '💫', color: 'linear-gradient(135deg,#831843,#f472b6)', level: 13 },
    { id: 'ancient', name: 'Ancient Reasoning', icon: '🏛️', color: 'linear-gradient(135deg,#44403c,#a8a29e)', level: 16 },
    { id: 'sky', name: 'Sky Creativity', icon: '☁️', color: 'linear-gradient(135deg,#1e40af,#60a5fa)', level: 20 },
];

// ============ PARTICLES ============
HappyJula.particles = {
    canvas: null,
    ctx: null,
    items: [],
    running: false,

    init() {
        this.canvas = document.getElementById('bg-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
        for (let i = 0; i < 40; i++) {
            this.items.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                r: Math.random() * 2 + 0.5,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                o: Math.random() * 0.3 + 0.05
            });
        }
        this.running = true;
        this.animate();
    },

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    },

    animate() {
        if (!this.running) return;
        const c = this.ctx;
        c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const p of this.items) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;
            c.beginPath();
            c.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            c.fillStyle = `rgba(167,139,250,${p.o})`;
            c.fill();
        }
        requestAnimationFrame(() => this.animate());
    }
};

// ============ CONFETTI ============
HappyJula.showConfetti = function() {
    const container = document.getElementById('confetti-container');
    const colors = ['#a78bfa','#f472b6','#22d3ee','#34d399','#fbbf24','#fb923c'];
    for (let i = 0; i < 80; i++) {
        const el = document.createElement('div');
        el.className = 'confetti-piece';
        el.style.left = Math.random() * 100 + '%';
        el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        el.style.width = (Math.random() * 8 + 4) + 'px';
        el.style.height = (Math.random() * 8 + 4) + 'px';
        el.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
        el.style.animationDelay = (Math.random() * 0.5) + 's';
        container.appendChild(el);
    }
    setTimeout(() => { container.innerHTML = ''; }, 4000);
};

// ============ CHARTS ============
HappyJula.charts = {
    radar(canvasId, data) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        const cx = w / 2, cy = h / 2;
        const r = Math.min(cx, cy) - 30;
        const labels = Object.keys(data);
        const values = Object.values(data);
        const n = labels.length;

        ctx.clearRect(0, 0, w, h);

        // Grid
        for (let ring = 1; ring <= 4; ring++) {
            ctx.beginPath();
            const rr = r * ring / 4;
            for (let i = 0; i <= n; i++) {
                const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
                const x = cx + rr * Math.cos(angle);
                const y = cy + rr * Math.sin(angle);
                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'rgba(167,139,250,0.15)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Axes
        for (let i = 0; i < n; i++) {
            const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + r * Math.cos(angle), cy + r * Math.sin(angle));
            ctx.strokeStyle = 'rgba(167,139,250,0.1)';
            ctx.stroke();
        }

        // Data polygon
        ctx.beginPath();
        for (let i = 0; i <= n; i++) {
            const idx = i % n;
            const angle = (Math.PI * 2 * idx / n) - Math.PI / 2;
            const val = Math.min(values[idx] / 100, 1);
            const x = cx + r * val * Math.cos(angle);
            const y = cy + r * val * Math.sin(angle);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.fillStyle = 'rgba(167,139,250,0.2)';
        ctx.fill();
        ctx.strokeStyle = '#a78bfa';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dots and labels
        ctx.font = '11px Nunito';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b8498';
        ctx.textAlign = 'center';
        for (let i = 0; i < n; i++) {
            const angle = (Math.PI * 2 * i / n) - Math.PI / 2;
            const val = Math.min(values[i] / 100, 1);
            const x = cx + r * val * Math.cos(angle);
            const y = cy + r * val * Math.sin(angle);
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#a78bfa';
            ctx.fill();
            const lx = cx + (r + 18) * Math.cos(angle);
            const ly = cy + (r + 18) * Math.sin(angle);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b8498';
            ctx.fillText(labels[i], lx, ly + 4);
        }
    },

    weekly(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const today = new Date();
        const counts = [0,0,0,0,0,0,0];

        for (const entry of HappyJula.store.data.history) {
            const d = new Date(entry.date);
            const diff = Math.floor((today - d) / 86400000);
            if (diff < 7) {
                const dayIdx = (d.getDay() + 6) % 7;
                counts[dayIdx]++;
            }
        }

        const maxCount = Math.max(...counts, 1);
        const barW = (w - 60) / 7;
        const barMaxH = h - 50;

        ctx.font = '11px Nunito';
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b8498';
        ctx.textAlign = 'center';

        for (let i = 0; i < 7; i++) {
            const x = 30 + i * barW + barW / 2;
            const bh = (counts[i] / maxCount) * barMaxH;
            const y = h - 30 - bh;

            const grad = ctx.createLinearGradient(x, y, x, h - 30);
            grad.addColorStop(0, '#a78bfa');
            grad.addColorStop(1, 'rgba(167,139,250,0.3)');

            ctx.beginPath();
            ctx.roundRect(x - barW * 0.3, y, barW * 0.6, bh, 4);
            ctx.fillStyle = grad;
            ctx.fill();

            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted').trim() || '#8b8498';
            ctx.fillText(days[i], x, h - 12);
            if (counts[i] > 0) {
                ctx.fillText(counts[i], x, y - 6);
            }
        }
    }
};

// ============ QUOTES ============
HappyJula.quotes = [
    { text: "The mind, once stretched by a new idea, never returns to its original dimensions.", author: "Oliver Wendell Holmes" },
    { text: "Your brain is a muscle. The more you train it, the stronger it gets.", author: "Unknown" },
    { text: "Every expert was once a beginner.", author: "Helen Hayes" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
    { text: "The more you use your brain, the more brain you will have to use.", author: "George Dorsey" },
    { text: "Small daily improvements lead to stunning results.", author: "Robin Sharma" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
    { text: "The mind is everything. What you think, you become.", author: "Buddha" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
];

// ============ AVATARS ============
HappyJula.avatars = [
    { emoji: '🐼', name: 'Panda' },
    { emoji: '🤖', name: 'Robot' },
    { emoji: '🦊', name: 'Fox' },
    { emoji: '🦉', name: 'Owl' },
    { emoji: '🐱', name: 'Cat' },
    { emoji: '🚀', name: 'Space Kid' },
    { emoji: '📚', name: 'Scholar' },
    { emoji: '🎮', name: 'Pixel Hero' },
    { emoji: '👦', name: 'Boy' },
    { emoji: '👧', name: 'Girl' },
];
