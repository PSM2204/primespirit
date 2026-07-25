/* ==========================================
   HAPPY JULA — Main Application
   Router, UI, Events, Initialization
   ========================================== */

HappyJula.app = {
    currentScreen: 'loading',
    currentGameId: null,
    gameTimerInterval: null,
    gameStartTime: null,

    // ============ NAVIGATION ============
    navigate(screenId) {
        HappyJula.sound.play('click');
        HappyJula.sound.haptic();
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const target = document.getElementById('screen-' + screenId);
        if (target) target.classList.add('active');
        this.currentScreen = screenId;

        // Update nav
        document.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.screen === screenId);
        });

        // Show/hide bottom nav
        const hideNav = ['loading', 'onboarding', 'game', 'results'].includes(screenId);
        document.getElementById('bottom-nav').classList.toggle('hidden', hideNav);

        // Refresh screen-specific content
        switch(screenId) {
            case 'home': this.refreshHome(); break;
            case 'games-hub': this.refreshGamesHub(); break;
            case 'statistics': this.refreshStats(); break;
            case 'profile': this.refreshProfile(); break;
            case 'coach': this.refreshCoach(); break;
            case 'daily': this.refreshDaily(); break;
            case 'achievements': this.refreshAchievements(); break;
        }
    },

    // ============ INITIALIZATION ============
    init() {
        HappyJula.store.load();
        HappyJula.sound.init();
        HappyJula.particles.init();
        HappyJula.daily.generate();

        // Apply settings
        this.applySettings();

        // Loading animation
        const bar = document.querySelector('.loading-bar');
        let progress = 0;
        const loadInterval = setInterval(() => {
            progress += Math.random() * 20 + 5;
            if (progress > 100) progress = 100;
            bar.style.width = progress + '%';
            if (progress >= 100) {
                clearInterval(loadInterval);
                setTimeout(() => {
                    if (HappyJula.store.data.onboarded) {
                        this.navigate('home');
                    } else {
                        this.navigate('onboarding');
                    }
                }, 400);
            }
        }, 200);

        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').catch(() => {});
        }

        // Generate worlds
        this.renderWorlds();

        // Periodic achievement check
        setInterval(() => HappyJula.checkAchievements(), 5000);
    },

    // ============ ONBOARDING ============
    nextOnboard() {
        HappyJula.sound.play('click');
        document.querySelector('.onboard-step[data-step="1"]').classList.add('hidden');
        document.querySelector('.onboard-step[data-step="2"]').classList.remove('hidden');
        this.renderAvatarGrid();
    },

    renderAvatarGrid() {
        const grid = document.getElementById('avatar-grid');
        grid.innerHTML = HappyJula.avatars.map((a, i) =>
            `<div class="avatar-option ${i === 0 ? 'selected' : ''}" data-idx="${i}" onclick="HappyJula.app.selectAvatar(${i})">${a.emoji}</div>`
        ).join('');
    },

    selectedAvatarIdx: 0,

    selectAvatar(idx) {
        HappyJula.sound.play('click');
        this.selectedAvatarIdx = idx;
        document.querySelectorAll('.avatar-option').forEach((el, i) => {
            el.classList.toggle('selected', i === idx);
        });
    },

    finishOnboard() {
        HappyJula.sound.play('success');
        const name = document.getElementById('nickname-input').value.trim() || 'Brain Trainer';
        HappyJula.store.data.user.name = name;
        HappyJula.store.data.user.avatar = HappyJula.avatars[this.selectedAvatarIdx].emoji;
        HappyJula.store.data.onboarded = true;
        HappyJula.store.save();
        HappyJula.showConfetti();
        this.navigate('home');
    },

    // ============ HOME ============
    refreshHome() {
        const d = HappyJula.store.data;
        const u = d.user;

        // Greeting
        const hour = new Date().getHours();
        const greet = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
        document.getElementById('greeting-text').textContent = greet;
        document.getElementById('greeting-name').textContent = u.name;
        document.getElementById('home-avatar').textContent = u.avatar;

        // Stats
        document.getElementById('stat-xp').textContent = u.xp;
        document.getElementById('stat-coins').textContent = u.coins;
        document.getElementById('stat-diamonds').textContent = u.diamonds;

        // XP bar
        const xpNeeded = HappyJula.store.xpForLevel(u.level);
        document.getElementById('xp-level').textContent = u.level;
        document.getElementById('xp-current').textContent = u.xp;
        document.getElementById('xp-max').textContent = xpNeeded;
        document.getElementById('xp-bar-fill').style.width = (u.xp / xpNeeded * 100) + '%';

        // Streak
        document.getElementById('streak-count').textContent = u.streak;
        document.getElementById('streak-best').textContent = u.bestStreak;

        // Daily challenge
        this.refreshDailyCard();

        // Radar chart
        this.refreshRadar('radar-chart');
    },

    refreshDailyCard() {
        const dc = HappyJula.store.data.dailyChallenge;
        if (!dc) return;
        const list = document.getElementById('daily-games-list');
        list.innerHTML = dc.games.map(gId => {
            const game = HappyJula.games.list.find(g => g.id === gId);
            const done = HappyJula.store.data.dailyCompleted.includes(gId);
            return `<div class="daily-game-chip ${done ? 'completed' : ''}">${game ? game.icon : '🎮'} ${game ? game.name : gId}</div>`;
        }).join('');

        const progress = HappyJula.daily.progress();
        document.getElementById('daily-progress-fill').style.width = (progress * 100) + '%';
    },

    refreshRadar(canvasId) {
        const skills = this.getSkillScores();
        HappyJula.charts.radar(canvasId, skills);
    },

    getSkillScores() {
        const d = HappyJula.store.data;
        const cats = { Memory: 0, Attention: 0, Speed: 0, Logic: 0, Math: 0, Language: 0, Executive: 0 };
        const counts = { ...cats };

        for (const game of HappyJula.games.list) {
            const gd = d.games[game.id];
            if (gd && gd.totalPlayed > 0) {
                const acc = gd.totalCorrect / Math.max(1, gd.totalCorrect + gd.totalWrong) * 100;
                if (cats[game.category] !== undefined) {
                    cats[game.category] += acc;
                    counts[game.category]++;
                }
            }
        }

        const result = {};
        for (const key of Object.keys(cats)) {
            result[key] = counts[key] > 0 ? Math.round(cats[key] / counts[key]) : 10 + Math.floor(Math.random() * 20);
        }
        return result;
    },

    renderWorlds() {
        const container = document.getElementById('worlds-container');
        if (!container) return;
        container.innerHTML = HappyJula.worlds.map(w => {
            const locked = HappyJula.store.data.user.level < w.level;
            return `<div class="world-card glass ${locked ? 'locked' : ''}" style="background:${w.color}" onclick="${locked ? '' : "HappyJula.app.navigate('games-hub')"}">
                <div class="world-icon">${w.icon}</div>
                <div class="world-name">${w.name}</div>
                <div class="world-level">${locked ? '🔒 Level ' + w.level : 'Open'}</div>
            </div>`;
        }).join('');
    },

    // ============ GAMES HUB ============
    currentCategory: 'All',

    refreshGamesHub() {
        const pills = document.getElementById('category-pills');
        pills.innerHTML = HappyJula.games.categories.map(c =>
            `<button class="cat-pill ${c === this.currentCategory ? 'active' : ''}" onclick="HappyJula.app.filterCategory('${c}')">${c}</button>`
        ).join('');
        this.renderGameCards();
    },

    filterCategory(cat) {
        HappyJula.sound.play('click');
        this.currentCategory = cat;
        document.querySelectorAll('.cat-pill').forEach(p => {
            p.classList.toggle('active', p.textContent === cat);
        });
        this.renderGameCards();
    },

    renderGameCards() {
        const grid = document.getElementById('games-grid');
        const filtered = this.currentCategory === 'All'
            ? HappyJula.games.list
            : HappyJula.games.list.filter(g => g.category === this.currentCategory);

        grid.innerHTML = filtered.map((g, i) => {
            const diff = HappyJula.store.getGame(g.id).difficulty;
            return `<div class="game-card glass card-flip-enter stagger-${i % 6}" onclick="HappyJula.app.startGame('${g.id}')">
                <span class="game-card-icon">${g.icon}</span>
                <div class="game-card-name">${g.name}</div>
                <div class="game-card-cat">${g.category}</div>
                <span class="game-card-diff diff-${diff}">${diff}</span>
            </div>`;
        }).join('');
    },

    // ============ GAME PLAY ============
    startGame(gameId) {
        HappyJula.sound.play('click');
        this.currentGameId = gameId;
        const game = HappyJula.games.list.find(g => g.id === gameId);
        document.getElementById('game-title').textContent = game ? game.name : gameId;
        document.getElementById('game-score').textContent = '0';
        this.navigate('game');

        this.gameStartTime = Date.now();
        this.startGameTimer();

        const area = document.getElementById('game-area');
        HappyJula.games.start(gameId, area, (result) => {
            this.stopGameTimer();
            this.onGameComplete(gameId, result);
        });
    },

    startGameTimer() {
        this.stopGameTimer();
        this.gameTimerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.gameStartTime) / 1000);
            const min = Math.floor(elapsed / 60);
            const sec = elapsed % 60;
            const el = document.getElementById('game-timer');
            if (el) el.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
        }, 1000);
    },

    stopGameTimer() {
        if (this.gameTimerInterval) {
            clearInterval(this.gameTimerInterval);
            this.gameTimerInterval = null;
        }
    },

    exitGame() {
        this.stopGameTimer();
        this.navigate('games-hub');
    },

    onGameComplete(gameId, result) {
        const rewards = HappyJula.store.recordGame(gameId, result);
        this.showResults(gameId, result, rewards);
    },

    // ============ RESULTS ============
    showResults(gameId, result, rewards) {
        this.navigate('results');

        // Stars
        const stars = result.accuracy >= 90 ? 3 : result.accuracy >= 60 ? 2 : result.accuracy >= 30 ? 1 : 0;
        document.getElementById('results-stars').textContent = '⭐'.repeat(stars) + '☆'.repeat(3 - stars);

        // Score animation
        const scoreEl = document.getElementById('results-score');
        this.animateNumber(scoreEl, 0, Math.max(0, result.score), 800);

        // Stats
        document.getElementById('result-accuracy').textContent = result.accuracy + '%';
        document.getElementById('result-time').textContent = (result.timeMs / 1000).toFixed(1) + 's';
        document.getElementById('result-streak').textContent = result.correct;

        // Rewards
        document.getElementById('reward-xp').textContent = rewards.xpEarned;
        document.getElementById('reward-coins').textContent = rewards.coinsEarned;

        // New best
        const bestEl = document.getElementById('results-new-best');
        bestEl.classList.toggle('hidden', !rewards.isBest);

        // Coach message
        const msg = this.getCoachMessage(result);
        document.getElementById('results-coach-msg').innerHTML = `<strong>🧠 Jula says:</strong> ${msg}`;

        // Play again button
        document.getElementById('btn-play-again').onclick = () => this.startGame(gameId);

        // Effects
        if (stars >= 2) HappyJula.showConfetti();
        HappyJula.sound.play(stars >= 2 ? 'success' : 'coin');

        // Check achievements
        HappyJula.checkAchievements();
    },

    animateNumber(el, from, to, duration) {
        const start = performance.now();
        function update(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(from + (to - from) * eased);
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    },

    getCoachMessage(result) {
        if (result.accuracy >= 95) return "Outstanding performance! Your brain is on fire today! 🔥";
        if (result.accuracy >= 80) return "Great job! You're making excellent progress. Keep it up!";
        if (result.accuracy >= 60) return "Good effort! With regular practice, you'll see improvement quickly.";
        if (result.accuracy >= 40) return "Nice try! Every attempt strengthens your neural pathways. Don't give up!";
        return "Everyone starts somewhere! The important thing is you showed up. Let's try again!";
    },

    // ============ PROFILE ============
    refreshProfile() {
        const u = HappyJula.store.data.user;
        document.getElementById('profile-avatar').textContent = u.avatar;
        document.getElementById('profile-name').textContent = u.name;
        document.getElementById('profile-level').textContent = u.level;

        const titles = ['Beginner Brain', 'Sharp Thinker', 'Quick Learner', 'Mind Master', 'Cognitive Champion', 'Brain Genius'];
        const titleIdx = Math.min(Math.floor(u.level / 5), titles.length - 1);
        document.getElementById('profile-title').textContent = titles[titleIdx];

        // Brain scores
        const skills = this.getSkillScores();
        const icons = { Memory: '🧩', Attention: '👁️', Speed: '⚡', Logic: '🔮', Math: '🔢', Language: '📖', Executive: '🎯' };
        const scoresEl = document.getElementById('brain-scores');
        scoresEl.innerHTML = Object.entries(skills).map(([k, v]) =>
            `<div class="brain-score-card glass">
                <div class="brain-score-icon">${icons[k] || '🧠'}</div>
                <div class="brain-score-val">${Math.round(v)}</div>
                <div class="brain-score-label">${k}</div>
            </div>`
        ).join('');

        // Achievements
        const ag = document.getElementById('achievements-grid');
        ag.innerHTML = HappyJula.achievementsList.map(a => {
            const unlocked = !!HappyJula.store.data.achievements[a.id];
            return `<div class="achievement-card glass ${unlocked ? '' : 'locked'}" title="${a.desc}">
                <div class="achievement-icon">${a.icon}</div>
                <div>${a.name}</div>
            </div>`;
        }).join('');
    },

    // ============ STATISTICS ============
    refreshStats() {
        const d = HappyJula.store.data;
        let totalGames = 0, totalCorrect = 0, totalAll = 0;
        for (const g of Object.values(d.games)) {
            totalGames += g.totalPlayed;
            totalCorrect += g.totalCorrect;
            totalAll += g.totalCorrect + g.totalWrong;
        }

        document.getElementById('stat-total-games').textContent = totalGames;
        const mins = Math.floor(d.totalTimeMs / 60000);
        document.getElementById('stat-total-time').textContent = mins < 60 ? mins + 'm' : Math.floor(mins / 60) + 'h ' + (mins % 60) + 'm';
        document.getElementById('stat-avg-accuracy').textContent = totalAll > 0 ? Math.round(totalCorrect / totalAll * 100) + '%' : '--';
        document.getElementById('stat-brain-age').textContent = HappyJula.adaptive.brainAge();

        // Radar
        HappyJula.charts.radar('stats-radar', this.getSkillScores());

        // Weekly chart
        HappyJula.charts.weekly('weekly-chart');

        // Heatmap
        this.renderHeatmap();

        // Skill bars
        this.renderSkillBars();
    },

    renderHeatmap() {
        const grid = document.getElementById('heatmap-grid');
        grid.innerHTML = '';
        const today = new Date();
        const dateMap = {};
        for (const entry of HappyJula.store.data.history) {
            dateMap[entry.date] = (dateMap[entry.date] || 0) + 1;
        }
        for (let week = 0; week < 52; week++) {
            for (let day = 0; day < 7; day++) {
                const date = new Date(today);
                date.setDate(date.getDate() - (51 - week) * 7 - (6 - day));
                const key = date.toDateString();
                const count = dateMap[key] || 0;
                const level = count === 0 ? 0 : count <= 2 ? 1 : count <= 5 ? 2 : count <= 10 ? 3 : 4;
                const cell = document.createElement('div');
                cell.className = `heatmap-cell hm-${level}`;
                cell.title = `${key}: ${count} games`;
                grid.appendChild(cell);
            }
        }
    },

    renderSkillBars() {
        const skills = this.getSkillScores();
        const colors = { Memory: '#a78bfa', Attention: '#f472b6', Speed: '#22d3ee', Logic: '#34d399', Math: '#fbbf24', Language: '#fb923c', Executive: '#f87171' };
        const container = document.getElementById('skill-bars');
        container.innerHTML = Object.entries(skills).map(([k, v]) =>
            `<div class="skill-bar-item">
                <div class="skill-bar-header"><span>${k}</span><span style="font-family:var(--font-mono)">${Math.round(v)}%</span></div>
                <div class="skill-bar-track"><div class="skill-bar-fill" style="width:${v}%;background:${colors[k] || '#a78bfa'}"></div></div>
            </div>`
        ).join('');
    },

    // ============ ACHIEVEMENTS ============
    refreshAchievements() {
        const list = document.getElementById('achievement-list-full');
        list.innerHTML = HappyJula.achievementsList.map(a => {
            const unlocked = !!HappyJula.store.data.achievements[a.id];
            return `<div class="setting-item glass" style="opacity:${unlocked ? 1 : 0.5}">
                <span>${a.icon} ${a.name}<br><small style="color:var(--text-muted)">${a.desc}</small></span>
                <span>${unlocked ? '✅' : '🔒'}</span>
            </div>`;
        }).join('');
    },

    // ============ COACH ============
    refreshCoach() {
        // Quote
        const q = HappyJula.quotes[Math.floor(Math.random() * HappyJula.quotes.length)];
        document.getElementById('quote-text').textContent = `"${q.text}"`;
        document.getElementById('quote-author').textContent = `— ${q.author}`;

        // Recommendations
        const recs = HappyJula.adaptive.recommend();
        const recEl = document.getElementById('coach-recommendations');
        recEl.innerHTML = recs.map(id => {
            const game = HappyJula.games.list.find(g => g.id === id);
            if (!game) return '';
            return `<div class="setting-item glass" style="cursor:pointer" onclick="HappyJula.app.startGame('${id}')">
                <span>${game.icon} ${game.name}</span>
                <span>→</span>
            </div>`;
        }).join('');

        // Chat welcome
        const msgs = document.getElementById('chat-messages');
        if (msgs.children.length === 0) {
            this.addChatMessage('coach', `Hi ${HappyJula.store.data.user.name}! I'm Jula, your brain coach. How are you feeling today?`);
        }
    },

    addChatMessage(type, text) {
        const msgs = document.getElementById('chat-messages');
        const div = document.createElement('div');
        div.className = `chat-msg ${type}`;
        div.textContent = text;
        msgs.appendChild(div);
        msgs.scrollTop = msgs.scrollHeight;
    },

    coachReply() {
        const input = document.getElementById('chat-input');
        const text = input.value.trim();
        if (!text) return;
        this.addChatMessage('user', text);
        input.value = '';

        setTimeout(() => {
            const replies = [
                "That's a great mindset! Every session makes you stronger. 💪",
                "Remember, consistency beats intensity. Even 5 minutes a day helps!",
                "I've noticed you're improving in memory games. Keep pushing!",
                "Try focusing on your weaker areas today — that's where the biggest gains are!",
                "Your brain loves challenges! Let's aim for a new high score today.",
                "Did you know? Sleep and exercise also boost cognitive performance. Rest well!",
                "I believe in you! Every expert was once a beginner.",
                "Great question! The key to improvement is deliberate practice.",
                "Try the Daily Challenge for a well-rounded brain workout!",
                "You're doing amazing! Let's keep this streak going! 🔥"
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];
            this.addChatMessage('coach', reply);
        }, 600 + Math.random() * 600);
    },

    // ============ DAILY CHALLENGE ============
    refreshDaily() {
        const dc = HappyJula.store.data.dailyChallenge;
        if (!dc) return;
        const list = document.getElementById('daily-challenge-list');
        list.innerHTML = dc.games.map(gId => {
            const game = HappyJula.games.list.find(g => g.id === gId);
            const done = HappyJula.store.data.dailyCompleted.includes(gId);
            return `<div class="daily-ch-item glass ${done ? '' : ''}" onclick="${done ? '' : "HappyJula.app.startGame('" + gId + "')"}">
                <span class="daily-ch-icon">${game ? game.icon : '🎮'}</span>
                <div class="daily-ch-info">
                    <div class="daily-ch-name">${game ? game.name : gId}</div>
                    <div class="daily-ch-cat">${game ? game.category : ''}</div>
                </div>
                <span class="daily-ch-status">${done ? '✅' : '▶️'}</span>
            </div>`;
        }).join('');
    },

    startDailyChallenge() {
        const dc = HappyJula.store.data.dailyChallenge;
        if (!dc) return;
        const first = dc.games.find(g => !HappyJula.store.data.dailyCompleted.includes(g));
        if (first) {
            this.startGame(first);
        } else {
            this.showToast('Daily challenge complete! 🎉');
            HappyJula.showConfetti();
        }
    },

    // ============ RANDOM GAME ============
    randomGame() {
        const games = HappyJula.games.list;
        const g = games[Math.floor(Math.random() * games.length)];
        this.startGame(g.id);
    },

    // ============ SETTINGS ============
    applySettings() {
        const s = HappyJula.store.data.settings;
        document.documentElement.setAttribute('data-theme', s.darkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-colorblind', s.colorBlind);
        document.documentElement.setAttribute('data-font', s.dyslexiaFont ? 'dyslexia' : 'normal');
        document.documentElement.setAttribute('data-size', s.largeText ? 'large' : 'normal');

        // Sync toggles
        setTimeout(() => {
            const setToggle = (id, val) => { const el = document.getElementById(id); if (el) el.checked = val; };
            setToggle('set-dark', s.darkMode);
            setToggle('set-sound', s.sound);
            setToggle('set-music', s.music);
            setToggle('set-haptic', s.haptic);
            setToggle('set-colorblind', s.colorBlind);
            setToggle('set-dyslexia', s.dyslexiaFont);
            setToggle('set-largetext', s.largeText);

            // Bind toggle events
            const bind = (id, key) => {
                const el = document.getElementById(id);
                if (el) el.addEventListener('change', () => {
                    HappyJula.store.data.settings[key] = el.checked;
                    HappyJula.store.save();
                    this.applySettings();
                    HappyJula.sound.play('click');
                });
            };
            bind('set-dark', 'darkMode');
            bind('set-sound', 'sound');
            bind('set-music', 'music');
            bind('set-haptic', 'haptic');
            bind('set-colorblind', 'colorBlind');
            bind('set-dyslexia', 'dyslexiaFont');
            bind('set-largetext', 'largeText');
        }, 100);
    },

    changeAvatar() {
        const modal = document.getElementById('modal-overlay');
        const box = document.getElementById('modal-box');
        modal.classList.remove('hidden');
        box.innerHTML = `
            <h2>Choose Avatar</h2>
            <div class="avatar-grid" style="margin:16px 0">
                ${HappyJula.avatars.map((a, i) =>
                    `<div class="avatar-option ${HappyJula.store.data.user.avatar === a.emoji ? 'selected' : ''}" onclick="HappyJula.app.pickAvatar('${a.emoji}')">${a.emoji}</div>`
                ).join('')}
            </div>
            <button class="btn btn-secondary btn-sm" onclick="HappyJula.app.hideModal()">Close</button>`;
    },

    pickAvatar(emoji) {
        HappyJula.store.data.user.avatar = emoji;
        HappyJula.store.save();
        this.hideModal();
        this.refreshProfile();
        this.showToast('Avatar updated!');
        HappyJula.sound.play('success');
    },

    changeName() {
        const modal = document.getElementById('modal-overlay');
        const box = document.getElementById('modal-box');
        modal.classList.remove('hidden');
        box.innerHTML = `
            <h2>Change Nickname</h2>
            <input type="text" id="new-name-input" class="input-field" value="${HappyJula.store.data.user.name}" maxlength="20" style="margin:16px 0">
            <button class="btn btn-primary" onclick="HappyJula.app.saveName()">Save</button>
            <button class="btn btn-secondary" onclick="HappyJula.app.hideModal()" style="margin-top:8px">Cancel</button>`;
    },

    saveName() {
        const name = document.getElementById('new-name-input').value.trim();
        if (name) {
            HappyJula.store.data.user.name = name;
            HappyJula.store.save();
            this.hideModal();
            this.refreshProfile();
            this.showToast('Name updated!');
            HappyJula.sound.play('success');
        }
    },

    exportData() {
        const data = JSON.stringify(HappyJula.store.data, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'happy-jula-data.json';
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported!');
    },

    resetData() {
        const modal = document.getElementById('modal-overlay');
        const box = document.getElementById('modal-box');
        modal.classList.remove('hidden');
        box.innerHTML = `
            <h2>Reset All Data?</h2>
            <p>This will delete all your progress, achievements, and settings. This cannot be undone.</p>
            <button class="btn btn-primary" style="background:var(--danger)" onclick="HappyJula.app.confirmReset()">Yes, Reset</button>
            <button class="btn btn-secondary" onclick="HappyJula.app.hideModal()" style="margin-top:8px">Cancel</button>`;
    },

    confirmReset() {
        localStorage.removeItem(HappyJula.store.KEY);
        HappyJula.store.load();
        this.hideModal();
        this.navigate('home');
        this.showToast('All data reset.');
    },

    hideModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    },

    // ============ COACH BUBBLE ============
    showCoachBubble(text) {
        const bubble = document.getElementById('jula-bubble');
        bubble.classList.remove('hidden');
        bubble.querySelector('.jula-speech').textContent = text;
        setTimeout(() => this.hideCoachBubble(), 8000);
    },

    hideCoachBubble() {
        document.getElementById('jula-bubble').classList.add('hidden');
    },

    // ============ TOAST ============
    showToast(text) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = text;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }
};

// ============ BOOT ============
document.addEventListener('DOMContentLoaded', () => {
    HappyJula.app.init();
});

// Touch/click handler for audio context
document.addEventListener('click', () => {
    if (HappyJula.sound.ctx && HappyJula.sound.ctx.state === 'suspended') {
        HappyJula.sound.ctx.resume();
    }
}, { once: true });
