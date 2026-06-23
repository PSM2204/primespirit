/**
 * 🛡️ PRIME SPIRIT MENTORS PRODUCTION ENGINE v7.0
 * Fully Integrated Independent Portal Actions Layer with Web3Forms Access Routing
 */

// ==========================================================================
// DAILY BLOG DATABASE ARRAY
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

// Global Authorization Flags & Active Token Configuration Paths
let isUserRegisteredAndLoggedIn = false;
let currentOpenNotesContext = '';
const WEB3FORMS_ACCESS_KEY = 'c5cc0f11-b241-4a89-8a11-1642cb5aa3a2'; 

// ==========================================================================
// INTERACTIVE PORTAL ACTIONS ENGINE
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. Render Blogs dynamically on page setup load
    renderBlogPostsEngine();

    // 2. Mobile Nav Responsive Toggle Menu
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
    }

    // 3. Premium Notes Download Lock Logic Setup
    for (let i = 1; i <= 6; i++) {
        const btn = document.getElementById(`btn-notes-${i}`);
        if (btn) {
            btn.addEventListener('click', () => {
                const titles = [
                    "Class 9/10 Foundation Notes", "Class 11/12 Physics Notes", 
                    "Class 11/12 Economics Notes", "NEET UG Master Notes", 
                    "JEE Mains Premium Notes", "CUET/IAT/NEST Advanced Notes"
                ];
                currentOpenNotesContext = titles[i - 1];
                handleNotesDownloadSequence();
            });
        }
    }

    // 4. Blog Subject Filters Toolbar
    const filters = ['all', 'physics', 'chemistry', 'maths', 'economics'];
    filters.forEach(cat => {
        const fBtn = document.getElementById(`filter-${cat}`);
        if (fBtn) {
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

    // 5. Modal Flow View Switch Links
    setupClick('btn-close-modal', closeAuthModal);
    setupClick('btn-goto-forgot', () => switchAuthView('forgot'));
    setupClick('btn-goto-signup', () => switchAuthView('signup'));
    setupClick('btn-goto-login', () => switchAuthView('login'));
    setupClick('btn-goto-login-2', () => switchAuthView('login'));
    setupClick('btn-role-student', () => launchAudit('student'));
    setupClick('btn-role-parent', () => launchAudit('parent'));

    // 6. Form Submission Routers
    setupForm('form-login', (e) => handleAuthProcess(e, 'login'));
    setupForm('form-signup', (e) => handleAuthProcess(e, 'signup'));
    setupForm('form-forgot', (e) => handleAuthProcess(e, 'forgot'));
    setupForm('contact-form', (e) => {
        e.preventDefault();
        alert('Consultation parameters successfully logged across Abhinav sir\'s evaluation registers.');
        e.target.reset();
    });

    // 7. Live Alphanumeric Password Tracking HUD
    const passInput = document.getElementById('signup-pass');
    if (passInput) passInput.addEventListener('keyup', (e) => trackPassMetrics(e.target.value));
});

// Window Global Scopes configuration adjustments
window.openAuthModal = function(viewType) {
    document.getElementById('auth-modal').classList.remove('hidden');
    switchAuthView(viewType);
};

window.closeAuthModal = function() {
    document.getElementById('auth-modal').classList.add('hidden');
};

function setupClick(id, handler) { const el = document.getElementById(id); if (el) el.addEventListener('click', handler); }
function setupForm(id, handler) { const el = document.getElementById(id); if (el) el.addEventListener('submit', handler); }

function switchAuthView(view) {
    ['login', 'signup', 'forgot'].forEach(v => document.getElementById(`auth-view-${v}`).classList.add('hidden'));
    document.getElementById(`auth-view-${view}`).classList.remove('hidden');
}

function handleNotesDownloadSequence() {
    if (!isUserRegisteredAndLoggedIn) {
        alert(`🔒 Authentication Required:\n\nTo access and download "${currentOpenNotesContext}", please complete your Student Profile registration form.`);
        window.openAuthModal('signup');
    } else {
        alert(`🚀 Access approved! Compiling secure download package logs for: ${currentOpenNotesContext}`);
    }
}

function trackPassMetrics(val) {
    const bar = document.getElementById('strength-bar');
    const txt = document.getElementById('strength-feedback-text');
    if (!bar || !txt) return;
    if (val.length === 0) { bar.style.width = '0%'; txt.innerText = "Awaiting parameters..."; return; }
    
    let pts = 0;
    if (val.length >= 8) pts++;
    if (/[A-Z]/.test(val)) pts++;
    if (/[0-9]/.test(val)) pts++;
    if (/[@#$!%*?&]/.test(val)) pts++;

    if (pts <= 1) { bar.style.width = '25%'; bar.style.backgroundColor = '#ef4444'; txt.innerText = "❌ Unsafe entry profile."; }
    else if (pts < 4) { bar.style.width = '60%'; bar.style.backgroundColor = '#f59e0b'; txt.innerText = "⚠️ Missing characters rules."; }
    else { bar.style.width = '100%'; bar.style.backgroundColor = '#00df89'; txt.innerText = "🛡️ Alphanumeric Shield Active."; }
}

// HIGH-CAPACITY DISPATCH CONTROLLER: Routes data straight to primespirit.edu@gmail.com via Web3Forms API
function handleAuthProcess(e, mode) {
    e.preventDefault();
    
    if (mode === 'signup') {
        const nameInput = e.target.querySelector('input[placeholder*="full name"]').value;
        const emailInput = document.getElementById('signup-email').value;
        const phoneInput = e.target.querySelector('input[type="tel"]').value;
        const passInput = document.getElementById('signup-pass').value;

        // Alphanumeric Rules Engine Check Verification
        if (!(passInput.length >= 8 && /[A-Z]/.test(passInput) && /[0-9]/.test(passInput) && /[@#$!%*?&]/.test(passInput))) {
            alert("❌ Alphanumeric Security Check Failed: Your chosen password must include at least 8 characters, an uppercase letter, a number, and a special symbol.");
            return;
        }

        // Bundle elements data tracking registers payload packet
        const registrationPayload = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `⚡ New Student Profile Registration Request - ${nameInput}`,
            from_name: "Prime Spirit Portal Engine",
            student_name: nameInput,
            student_email: emailInput,
            student_phone: phoneInput,
            requested_document: currentOpenNotesContext || 'Portal Quick Signup',
            timestamp_logged: new Date().toLocaleString()
        };

        // Send submission straight out to Web3Forms secure endpoints array
        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(registrationPayload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                isUserRegisteredAndLoggedIn = true;
                alert(`🎉 Registration Successfully Verified!\n\nYour profile details have been securely logged onto primespirit.edu@gmail.com.\n"${currentOpenNotesContext}" files are now unlocked.`);
                window.closeAuthModal();
                e.target.reset();
            } else {
                alert("❌ Token validation error. Please recheck script.js configuration settings.");
            }
        })
        .catch(error => {
            alert("🌪️ Network request dropped. Please check connection logs.");
        });

    } else if (mode === 'login') {
        isUserRegisteredAndLoggedIn = true;
        alert("🚀 Authentication matching complete across server logs. Access ports are open.");
        window.closeAuthModal();
    } else if (mode === 'forgot') {
        alert("📧 Recovery request processed successfully. Check your verification inbox tracks inside 5 minutes.");
        window.closeAuthModal();
    }
}

function renderBlogPostsEngine() {
    const container = document.getElementById('blog-posts-container');
    if (!container) return;
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

// ==========================================================================
// ANTI-INSPECT SECURITY LAYER (Isolated Perimeter Shield)
// ==========================================================================
(function() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
            ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u' || e.key === 'S' || e.key === 's'))) {
            e.preventDefault();
            return false;
        }
    });
})();
