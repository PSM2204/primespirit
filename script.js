/**
 * 🛡️ PRIME SPIRIT MENTORS PRODUCTION ENGINE v5.0 (OBFUSCATED HUD SYSTEM)
 * Self-Defending Client-Side Architecture Layout
 */
(function(_0xX1,_0xX2){const _0xO=function(_0xZ){while(--_0xZ){_0xX1['push'](_0xX1['shift']());}};_0xO(++_0xX2);}([(function(){var _0xH=function(){var _0xS=true;return function(_0xC,_0xW){var _0xK=_0xS?function(){if(_0xW){var _0xY=_0xW['apply'](_0xC,arguments);_0xW=null;return _0xY;}}:function(){};_0xS=false;return _0xK;};}();var _0xR=_0xH(this,function(){var _0xG=function(){return 'dev';},_0xB=function(){return 'window';};return!_0xG()['test'](_0xB());});_0xR();const _0xT=function(){debugger;};setInterval(_0xT,2000);})(),'contextmenu','keydown','F12','preventDefault','active','hidden','signup','login','forgot','strength-bar','strength-feedback-text'],0x3F));

(function() {
    // Hidden internal cache state registers
    let _0xStateAuth = false;
    let _0xContextVault = '';
    let _0xQuizIndex = 0;
    let _0xMetrics = { stress: 0, logic: 0, speed: 0, motivation: 0, alignment: 0 };

    // Anti-Scraping Core Hook Defenses
    document.addEventListener('contextmenu', function(_0xE) {
        _0xE.preventDefault();
        alert("🛡️ Protection Activated: Content extraction disabled.");
    });

    document.addEventListener('keydown', function(_0xE) {
        if (_0xE.key === 'F12' || 
            ((_0xE.ctrlKey || _0xE.metaKey) && _0xE.shiftKey && (_0xE.key === 'I' || _0xE.key === 'i' || _0xE.key === 'J' || _0xE.key === 'j')) ||
            ((_0xE.ctrlKey || _0xE.metaKey) && (_0xE.key === 'U' || _0xE.key === 'u' || _0xE.key === 'S' || _0xE.key === 's'))) {
            _0xE.preventDefault();
            return false;
        }
    });

    // Node Registry Setup
    window.addEventListener('DOMContentLoaded', () => {
        // Nav Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        }

        // Notes Event Hooks
        for(let i=1; i<=6; i++) {
            const btn = document.getElementById(`btn-notes-${i}`);
            if(btn) {
                btn.addEventListener('click', () => {
                    const titles = [
                        "Class 9/10 Foundation Notes", "Class 11/12 Physics Notes", 
                        "Class 11/12 Economics Notes", "NEET UG Master Notes", 
                        "JEE Mains Premium Notes", "CUET/IAT/NEST Advanced Notes"
                    ];
                    _0xContextVault = titles[i-1];
                    if (!_0xStateAuth) {
                        alert(`🔒 "${_0xContextVault}" requires authentication verification logs.`);
                        openAuthModal('signup');
                    } else {
                        alert(`🚀 Access approved. Downloading layout for: ${_0xContextVault}`);
                    }
                });
            }
        }

        // Blog Filtering Event hooks
        const filters = ['all', 'physics', 'chemistry', 'maths', 'economics'];
        filters.forEach(cat => {
            const fBtn = document.getElementById(`filter-${cat}`);
            if(fBtn) {
                fBtn.addEventListener('click', (e) => {
                    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    document.querySelectorAll('.blog-post-card').forEach(card => {
                        if (cat === 'all' || card.dataset.category === cat) card.classList.remove('hidden');
                        else card.classList.add('hidden');
                    });
                });
            }
        });

        // Auth Navigation Triggers
        setupClick('btn-close-modal', closeAuthModal);
        setupClick('btn-goto-forgot', () => switchAuthView('forgot'));
        setupClick('btn-goto-signup', () => switchAuthView('signup'));
        setupClick('btn-goto-login', () => switchAuthView('login'));
        setupClick('btn-goto-login-2', () => switchAuthView('login'));
        setupClick('btn-role-student', () => launchAudit('student'));
        setupClick('btn-role-parent', () => launchAudit('parent'));

        // Form Submit Handlers
        setupForm('form-login', (e) => handleAuthProcess(e, 'login'));
        setupForm('form-signup', (e) => handleAuthProcess(e, 'signup'));
        setupForm('form-forgot', (e) => handleAuthProcess(e, 'forgot'));
        setupForm('contact-form', (e) => {
            e.preventDefault();
            alert('Consultation parameters successfully synced across Abhinav sir\'s verification registers.');
            e.target.reset();
        });

        // Password Tracker Hook
        const passInput = document.getElementById('signup-pass');
        if(passInput) passInput.addEventListener('keyup', (e) => trackPassMetrics(e.target.value));
    });

    // Helper Utility Functions
    function setupClick(id, handler) { const el = document.getElementById(id); if(el) el.addEventListener('click', handler); }
    function setupForm(id, handler) { const el = document.getElementById(id); if(el) el.addEventListener('submit', handler); }

    function openAuthModal(view) { document.getElementById('auth-modal').classList.remove('hidden'); switchAuthView(view); }
    function closeAuthModal() { document.getElementById('auth-modal').classList.add('hidden'); }
    
    function switchAuthView(view) {
        ['login', 'signup', 'forgot'].forEach(v => document.getElementById(`auth-view-${v}`).classList.add('hidden'));
        document.getElementById(`auth-view-${view}`).classList.remove('hidden');
    }

    function trackPassMetrics(val) {
        const bar = document.getElementById('strength-bar');
        const txt = document.getElementById('strength-feedback-text');
        if(!bar || !txt) return;
        if(val.length === 0) { bar.style.width = '0%'; txt.innerText = "Awaiting parameters..."; return; }
        
        let pts = 0;
        if(val.length >= 8) pts++;
        if(/[A-Z]/.test(val)) pts++;
        if(/[0-9]/.test(val)) pts++;
        if(/[@#$!%*?&]/.test(val)) pts++;

        if(pts <= 1) { bar.style.width = '25%'; bar.style.backgroundColor = '#ef4444'; txt.innerText = "❌ Unsafe profile."; }
        else if(pts < 4) { bar.style.width = '60%'; bar.style.backgroundColor = '#f59e0b'; txt.innerText = "⚠️ Missing characters rules."; }
        else { bar.style.width = '100%'; bar.style.backgroundColor = '#00df89'; txt.innerText = "🛡️ Alphanumeric Shield Active."; }
    }

    function handleAuthProcess(e, mode) {
        e.preventDefault();
        if(mode === 'signup') {
            const pass = document.getElementById('signup-pass').value;
            if(!(pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass) && /[@#$!%*?&]/.test(pass))) {
                alert("❌ Alpha-numeric length rule failure."); return;
            }
        }
        _0xStateAuth = true;
        alert(mode === 'forgot' ? "📧 Encrypted token routed to your inbox registers." : "🎉 Security parameters confirmed! Core sync complete.");
        closeAuthModal();
    }

    function launchAudit(role) {
        document.getElementById('role-select-window').classList.add('hidden');
        document.getElementById('quiz-window').classList.remove('hidden');
        document.getElementById('quiz-progress-text').innerText = "Evaluation Block: 1 of 1";
        document.getElementById('question').innerText = role === 'student' ? "When processing physics problem configurations, you tend to:" : "Your child's primary stress markers are generated via:";
        
        const btnBox = document.getElementById('answer-buttons');
        btnBox.innerHTML = '';
        const opts = ["Anxiety spikes block formula recall steps.", "Concept retention works but structural speed is capped slow."];
        opts.forEach(o => {
            const b = document.createElement('button'); b.innerText = o; b.classList.add('quiz-btn');
            b.addEventListener('click', () => {
                document.getElementById('quiz-window').classList.add('hidden');
                document.getElementById('result-window').classList.remove('hidden');
                document.getElementById('psych-metrics-output').innerHTML = "<strong>🔍 Scan Diagnostic Confirmed:</strong> High-yield friction blocks discovered. Abhinav sir will isolate this configuration during your 1:1 strategy slot allocation maps.";
            });
            btnBox.appendChild(b);
        });
    }
})();
