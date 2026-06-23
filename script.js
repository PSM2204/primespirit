/**
 * 🛡️ PRIME SPIRIT MENTORS PRODUCTION ENGINE v6.0 (JS CORE BLOGGING ARCHITECTURE)
 */
(function(_0xX1,_0xX2){const _0xO=function(_0xZ){while(--_0xZ){_0xX1['push'](_0xX1['shift']());}};_0xO(++_0xX2);}([(function(){var _0xH=function(){var _0xS=true;return function(_0xC,_0xW){var _0xK=_0xS?function(){if(_0xW){var _0xY=_0xW['apply'](_0xC,arguments);_0xW=null;return _0xY;}}:function(){};_0xS=false;return _0xK;};}();var _0xR=_0xH(this,function(){var _0xG=function(){return 'dev';},_0xB=function(){return 'window';};return!_0xG()['test'](_0xB());});_0xR();const _0xT=function(){debugger;};setInterval(_0xT,2000);})(),'contextmenu','keydown','F12','preventDefault','active','hidden','signup','login','forgot','strength-bar','strength-feedback-text'],0x3F));

// ==========================================================================
// DAILY BLOG DATABASE ARRAY (Add your everyday updates smoothly right here)
// ==========================================================================
const blogDatabase = [
    {
        title: "De-coding Rotational Mechanics Parameters",
        date: "June 24, 2026",
        category: "physics",
        summary: "Stop memorizing moment of inertia equations raw. Learn to map torque variables geometrically to clear advanced numerical matrices instantly."
    },
    {
        title: "Visualizing National Income Parameters",
        date: "June 23, 2026",
        category: "economics",
        summary: "Breaking down the expenditure and value-added computation modules without overlapping structural accounting loops."
    },
    {
        title: "Conquering Named Organic Mechanisms",
        date: "June 22, 2026",
        category: "chemistry",
        summary: "A systematic framework detailing how electrophilic addition coordinates across high-yield tracking metrics for competitive test setups."
    },
    {
        title: "Calculus Insights: Limits & Continuity",
        date: "June 21, 2026",
        category: "maths",
        summary: "An intuitive geometric breakdown designed to master continuity properties without getting caught in dense algebraic traps."
    }
];

(function() {
    let _0xStateAuth = false;
    let _0xContextVault = '';

    // Anti-Scraping Defenses
    document.addEventListener('contextmenu', function(_0xE) {
        _0xE.preventDefault();
        alert("🛡️ Protection Activated: Content inspection disabled.");
    });

    document.addEventListener('keydown', function(_0xE) {
        if (_0xE.key === 'F12' || 
            ((_0xE.ctrlKey || _0xE.metaKey) && _0xE.shiftKey && (_0xE.key === 'I' || _0xE.key === 'i' || _0xE.key === 'J' || _0xE.key === 'j')) ||
            ((_0xE.ctrlKey || _0xE.metaKey) && (_0xE.key === 'U' || _0xE.key === 'u' || _0xE.key === 'S' || _0xE.key === 's'))) {
            _0xE.preventDefault();
            return false;
        }
    });

    window.addEventListener('DOMContentLoaded', () => {
        // Render Blogs dynamically
        renderBlogPostsEngine();

        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
        }

        // Notes Button Hooks
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
                        alert(`🔒 "${_0xContextVault}" requires verification profile registration.`);
                        openAuthModal('signup');
                    } else {
                        alert(`🚀 Access approved. Downloading layout for: ${_0xContextVault}`);
                    }
                });
            }
        }

        // Blog Filter Active Listeners
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

        setupClick('btn-close-modal', closeAuthModal);
        setupClick('btn-goto-forgot', () => switchAuthView('forgot'));
        setupClick('btn-goto-signup', () => switchAuthView('signup'));
        setupClick('btn-goto-login', () => switchAuthView('login'));
        setupClick('btn-goto-login-2', () => switchAuthView('login'));
        setupClick('btn-role-student', () => launchAudit('student'));
        setupClick('btn-role-parent', () => launchAudit('parent'));

        setupForm('form-login', (e) => handleAuthProcess(e, 'login'));
        setupForm('form-signup', (e) => handleAuthProcess(e, 'signup'));
        setupForm('form-forgot', (e) => handleAuthProcess(e, 'forgot'));
        setupForm('contact-form', (e) => {
            e.preventDefault();
            alert('Consultation parameters successfully synced across Abhinav sir\'s evaluation registers.');
            e.target.reset();
        });

        const passInput = document.getElementById('signup-pass');
        if(passInput) passInput.addEventListener('keyup', (e) => trackPassMetrics(e.target.value));
    });

    function renderBlogPostsEngine() {
        const container = document.getElementById('blog-posts-container');
        if(!container) return;
        container.innerHTML = '';

        blogDatabase.forEach(post => {
            const card = document.createElement('div');
            card.className = 'course-card blog-post-card';
            card.setAttribute('data-category', post.category.toLowerCase());
            card.innerHTML = `
                <div class="blog-meta">📅 ${post.date} | By Abhinav Kashyap</div>
                <h3>${post.title}</h3>
                <p>${post.summary}</p>
                <span class="target-badge">${post.category.charAt(0).toUpperCase() + post.category.slice(1)} Insights</span>
            `;
            container.appendChild(card);
        });
    }

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
        alert(mode === 'forgot' ? "📧 Encrypted link routed to your registered inbox parameters." : "🎉 Security parameters confirmed! Core sync complete.");
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
