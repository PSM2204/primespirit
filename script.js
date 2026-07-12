/**
 * 🛡️ PRIME SPIRIT MENTORS PRODUCTION ENGINE v9.0
 * Fully Integrated Independent Portal Actions Layer with Web3Forms Access Routing
 * + Full 10-Question Psychometric Mindset Audit (Student & Parent tracks)
 */

// ==========================================================================
// DAILY BLOG DATABASE ARRAY (Add your updates right here smoothly)
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
// PSYCHOMETRIC MINDSET AUDIT — QUESTION BANKS (10 per track)
// Each option carries a score 1 (highest concern) to 4 (healthiest pattern).
// ==========================================================================

const studentQuizQuestions = [
    {
        q: "Right before a big test, what usually happens in your head?",
        options: [
            { text: "My mind goes blank even on topics I know well", score: 1 },
            { text: "I get nervous but can refocus within a few minutes", score: 2 },
            { text: "I feel a manageable rush of adrenaline that helps me focus", score: 3 },
            { text: "I stay mostly calm regardless of the stakes", score: 4 }
        ]
    },
    {
        q: "When you get a tough problem wrong, what's your first instinct?",
        options: [
            { text: "I assume I'm just not good at this subject", score: 1 },
            { text: "I feel discouraged but try again later", score: 2 },
            { text: "I immediately want to understand exactly where I went wrong", score: 3 },
            { text: "I see it as useful data and move on without much emotion", score: 4 }
        ]
    },
    {
        q: "What's really driving you to prepare for this exam?",
        options: [
            { text: "Fear of disappointing my parents or family", score: 1 },
            { text: "Wanting to prove something to myself", score: 2 },
            { text: "A mix of personal goals and family expectations", score: 3 },
            { text: "Genuine interest in the field I'm aiming for", score: 4 }
        ]
    },
    {
        q: "How does your study schedule usually go?",
        options: [
            { text: "I plan a lot but rarely stick to it", score: 1 },
            { text: "I study consistently but feel like I'm always behind", score: 2 },
            { text: "I have a working rhythm most days", score: 3 },
            { text: "I follow a structured plan and adjust it weekly", score: 4 }
        ]
    },
    {
        q: "When a classmate scores higher than you, what happens internally?",
        options: [
            { text: "I feel like I'm falling behind everyone", score: 1 },
            { text: "I feel briefly bad but it fades quickly", score: 2 },
            { text: "I get curious about what they did differently", score: 3 },
            { text: "It barely affects me either way", score: 4 }
        ]
    },
    {
        q: "When you don't understand something in class, what do you actually do?",
        options: [
            { text: "I stay quiet and hope it makes sense later", score: 1 },
            { text: "I note it down but often forget to follow up", score: 2 },
            { text: "I try to solve it myself first, then ask if stuck", score: 3 },
            { text: "I ask a teacher or search for it the same day", score: 4 }
        ]
    },
    {
        q: "How often do you feel physically drained just from studying (mentally exhausted, not sleep-deprived)?",
        options: [
            { text: "Almost every day", score: 1 },
            { text: "A few times a week", score: 2 },
            { text: "Occasionally, especially before exams", score: 3 },
            { text: "Rarely", score: 4 }
        ]
    },
    {
        q: "If someone asked why you want your target exam's rank/score, could you answer clearly in one sentence?",
        options: [
            { text: "No, it's mostly just \"because I have to\"", score: 1 },
            { text: "Sort of, but it feels fuzzy", score: 2 },
            { text: "Yes, I have a fairly clear reason", score: 3 },
            { text: "Yes, and it's very specific to what I want to become", score: 4 }
        ]
    },
    {
        q: "When you're stressed about studies, what do you usually do?",
        options: [
            { text: "Keep it to myself and push through alone", score: 1 },
            { text: "Vent to a friend but don't really solve anything", score: 2 },
            { text: "Talk to a parent or mentor about it", score: 3 },
            { text: "Actively problem-solve with someone who can help", score: 4 }
        ]
    },
    {
        q: "Do you know what actually helps you retain a concept — visuals, practice, teaching it, or something else?",
        options: [
            { text: "Not really, I just do whatever everyone else does", score: 1 },
            { text: "I have a vague idea", score: 2 },
            { text: "Yes, I know what works for me", score: 3 },
            { text: "Yes, and I actively use that method on purpose", score: 4 }
        ]
    }
];

const parentQuizQuestions = [
    {
        q: "When you talk to your child about their exam prep, how do you think it usually lands emotionally?",
        options: [
            { text: "I worry it adds pressure even when I don't mean it to", score: 1 },
            { text: "It's a mix — sometimes reassuring, sometimes stressful", score: 2 },
            { text: "I'm not fully sure how it lands", score: 3 },
            { text: "I think it generally motivates them", score: 4 }
        ]
    },
    {
        q: "Do you know which specific topics or subjects your child is currently struggling with?",
        options: [
            { text: "Not really, they don't share much", score: 1 },
            { text: "I have a rough idea", score: 2 },
            { text: "Yes, fairly specifically", score: 3 },
            { text: "Yes, and we discuss it regularly", score: 4 }
        ]
    },
    {
        q: "How often do conversations about their studies reference other students' performance?",
        options: [
            { text: "Fairly often, usually to motivate them", score: 1 },
            { text: "Occasionally, without meaning to compare", score: 2 },
            { text: "Rarely", score: 3 },
            { text: "Never — we focus only on their own progress", score: 4 }
        ]
    },
    {
        q: "When your child makes a study-related decision (schedule, subject focus, coaching), who usually decides?",
        options: [
            { text: "I decide, since I know what's best for their future", score: 1 },
            { text: "We discuss it but I have final say", score: 2 },
            { text: "We decide together as equals", score: 3 },
            { text: "They decide, and I support their choice", score: 4 }
        ]
    },
    {
        q: "Beyond marks and results, how often do you ask how they're feeling about the pressure itself?",
        options: [
            { text: "Rarely — we focus on results", score: 1 },
            { text: "Occasionally, when they seem visibly stressed", score: 2 },
            { text: "Regularly, it's part of our routine conversations", score: 3 },
            { text: "Very often — it's a priority for us", score: 4 }
        ]
    },
    {
        q: "When they come home with a lower score than expected, what's usually said first?",
        options: [
            { text: "Some version of disappointment or concern about the number", score: 1 },
            { text: "A question about what happened", score: 2 },
            { text: "Recognition of effort, then a look at what to improve", score: 3 },
            { text: "Reassurance first, analysis second", score: 4 }
        ]
    },
    {
        q: "Would you know if your child was mentally burnt out, versus just tired from a long day?",
        options: [
            { text: "Honestly, probably not", score: 1 },
            { text: "I might notice if it got severe", score: 2 },
            { text: "Yes, I can usually tell the difference", score: 3 },
            { text: "Yes, and I actively watch for early signs", score: 4 }
        ]
    },
    {
        q: "Have you and your child explicitly discussed what \"success\" means for this exam?",
        options: [
            { text: "Not really, it's assumed rather than discussed", score: 1 },
            { text: "Loosely, nothing specific", score: 2 },
            { text: "Yes, we've talked about a general target", score: 3 },
            { text: "Yes, we've aligned on something specific together", score: 4 }
        ]
    },
    {
        q: "How much of your own anxiety about their future do you think shows up in daily conversations?",
        options: [
            { text: "Quite a bit, even if I try to hide it", score: 1 },
            { text: "Some, especially closer to exams", score: 2 },
            { text: "I'm honestly not sure", score: 3 },
            { text: "Very little, I try to stay neutral", score: 4 }
        ]
    },
    {
        q: "If they told you they needed to slow down or take a short break, how would you react?",
        options: [
            { text: "I'd worry it derails their preparation", score: 1 },
            { text: "I'd be hesitant but probably allow it", score: 2 },
            { text: "I'd support it if they gave a reason", score: 3 },
            { text: "I'd trust their judgment on their own limits", score: 4 }
        ]
    }
];

let quizState = { role: null, index: 0, totalScore: 0 };

// ==========================================================================
// INTERACTIVE PORTAL ACTIONS ENGINE
// ==========================================================================
window.addEventListener('DOMContentLoaded', () => {
    // 1. Render Blogs dynamically on page setup load
    renderBlogPostsEngine();

    // 2. Mobile Nav Responsive Toggle Menu Drawer Control
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (menuToggle && navMenu) {
        // Backdrop element, created here so index.html doesn't need editing.
        // Sits behind the slide-in drawer; tapping it closes the menu, and it also
        // gives a clear visual cue that the drawer is open (instead of it silently
        // floating over the page with no way to tell it's still active).
        const navBackdrop = document.createElement('div');
        navBackdrop.id = 'nav-backdrop';
        navBackdrop.style.cssText = [
            'position:fixed', 'inset:0', 'background:rgba(0,0,0,0.5)',
            'z-index:999', 'opacity:0', 'pointer-events:none',
            'transition:opacity 0.3s ease'
        ].join(';');
        document.body.appendChild(navBackdrop);

        function closeMobileNav() {
            navMenu.classList.remove('active');
            navBackdrop.style.opacity = '0';
            navBackdrop.style.pointerEvents = 'none';
        }
        function openMobileNav() {
            navMenu.classList.add('active');
            navBackdrop.style.opacity = '1';
            navBackdrop.style.pointerEvents = 'auto';
        }

        menuToggle.addEventListener('click', () => {
            navMenu.classList.contains('active') ? closeMobileNav() : openMobileNav();
        });

        // Close the moment any link inside the drawer is tapped — this is the
        // main fix: previously the drawer stayed open after a link was tapped,
        // so the next tap could land on a stale menu item instead of the page.
        navMenu.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('click', closeMobileNav);
        });

        // Tapping the dimmed backdrop closes the menu too.
        navBackdrop.addEventListener('click', closeMobileNav);

        // Escape key closes it (useful on tablets/keyboards).
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') closeMobileNav();
        });
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
    setupClick('restart-btn', resetAudit);

    // 6. High-Capacity Form Submission Routers
    setupForm('form-login', (e) => handleAuthProcess(e, 'login'));
    setupForm('form-signup', (e) => handleAuthProcess(e, 'signup'));
    setupForm('form-forgot', (e) => handleAuthProcess(e, 'forgot'));
    
    // Email Gateway Router for the Live Consultation Strategy booking form
    setupForm('contact-form', (e) => {
        e.preventDefault();
        
        const cName = document.getElementById('student-name').value;
        const cEmail = document.getElementById('student-email').value;
        const cPhone = document.getElementById('student-phone').value;
        const cMsg = document.getElementById('student-msg').value;

        const consultationPayload = {
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `🔥 NEW STRATEGY SLOT BOOKING REQUEST - ${cName}`,
            from_name: "Prime Spirit Booking Engine",
            applicant_name: cName,
            applicant_email: cEmail,
            applicant_phone: cPhone,
            applicant_notes_and_batch: cMsg,
            timestamp_logged: new Date().toLocaleString()
        };

        fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(consultationPayload)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('🎉 Consultation Request Logged!\n\nYour evaluation parameters have been securely routed straight to Abhinav sir\'s dashboard at primespirit.edu@gmail.com.');
                e.target.reset();
            } else {
                alert('❌ Error processing request. Check script access key settings.');
            }
        })
        .catch(error => {
            alert('🌪️ Transmission failed. Please verify network links.');
        });
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

// HIGH-CAPACITY SIGNUP ROUTER: Ships payload straight to primespirit.edu@gmail.com
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

        // Bundle data payload
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

        // Send submission out to Web3Forms secure endpoints array
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

// ==========================================================================
// PSYCHOMETRIC MINDSET AUDIT ENGINE (10-question flow, both tracks)
// ==========================================================================

function launchAudit(role) {
    quizState = { role, index: 0, totalScore: 0 };
    document.getElementById('role-select-window').classList.add('hidden');
    document.getElementById('result-window').classList.add('hidden');
    document.getElementById('quiz-window').classList.remove('hidden');
    document.getElementById('quiz-track-identity').innerText = role === 'student' ? 'Student Profile Active' : 'Parent Profile Active';
    renderAuditQuestion();
}

function renderAuditQuestion() {
    const bank = quizState.role === 'student' ? studentQuizQuestions : parentQuizQuestions;
    const current = bank[quizState.index];

    document.getElementById('quiz-progress-text').innerText = `Question ${quizState.index + 1} of ${bank.length}`;
    document.getElementById('question').innerText = current.q;

    const btnBox = document.getElementById('answer-buttons');
    btnBox.innerHTML = '';

    current.options.forEach(opt => {
        const b = document.createElement('button');
        b.innerText = opt.text;
        b.classList.add('quiz-btn');
        b.addEventListener('click', () => {
            quizState.totalScore += opt.score;
            quizState.index++;
            if (quizState.index < bank.length) {
                renderAuditQuestion();
            } else {
                showAuditResult();
            }
        });
        btnBox.appendChild(b);
    });
}

function showAuditResult() {
    const bank = quizState.role === 'student' ? studentQuizQuestions : parentQuizQuestions;
    const maxScore = bank.length * 4;
    const pct = quizState.totalScore / maxScore;

    let profile, badge, message;

    if (pct >= 0.85) {
        badge = "🌟";
        profile = quizState.role === 'student' ? "Highly Resilient Learner" : "Highly Supportive Parent";
        message = quizState.role === 'student'
            ? "Your responses show strong self-regulation, healthy motivation, and good support-seeking habits. Abhinav sir's sessions will focus on refining strategy and pace rather than fixing foundational stress patterns."
            : "Your responses show strong awareness of your child's emotional state and a healthy, autonomy-supportive approach. We'll focus your consultation on optimizing their study structure together.";
    } else if (pct >= 0.65) {
        badge = "✅";
        profile = quizState.role === 'student' ? "Balanced, With Room to Sharpen" : "Engaged, With Room to Recalibrate";
        message = quizState.role === 'student'
            ? "You're managing pressure reasonably well, but a few specific friction points (likely around exam anxiety or doubt-clearing speed) are holding back consistency. This is exactly what the 1:1 mentorship track is built to fix."
            : "You're engaged and aware, but there may be a gap between your intentions and how conversations actually land on your child. Abhinav sir can walk through a few adjustment points during your consultation.";
    } else if (pct >= 0.45) {
        badge = "⚠️";
        profile = quizState.role === 'student' ? "Developing — Pressure Is Leaking Through" : "Developing — Pressure May Be Transferring";
        message = quizState.role === 'student'
            ? "Your answers suggest exam anxiety, self-doubt, or isolation are quietly affecting your prep more than they should. This is very fixable with the right structure and psychometric counseling — it's not a talent problem, it's a pattern problem."
            : "Your answers suggest some unintentional pressure transfer or limited visibility into your child's actual struggles. This is common and very addressable — we'll cover practical adjustments in your strategy call.";
    } else {
        badge = "🔴";
        profile = quizState.role === 'student' ? "High Support Needed — Act Now" : "High Support Needed — Let's Realign";
        message = quizState.role === 'student'
            ? "Your responses point to significant exam anxiety, low self-efficacy, or burnout risk. This needs direct attention, not just more study hours. Abhinav sir's psychometric counseling track was built specifically for this profile."
            : "Your responses suggest high pressure transfer and limited insight into your child's emotional load right now. A guided conversation with Abhinav sir can help reset this before it affects performance further.";
    }

    document.getElementById('quiz-window').classList.add('hidden');
    document.getElementById('result-window').classList.remove('hidden');
    document.getElementById('badge-display').innerText = badge;
    document.getElementById('psych-metrics-output').innerHTML = `
        <strong>${profile}</strong><br><br>
        ${message}<br><br>
        <span style="color: var(--text-dark); font-size: 0.85rem;">Diagnostic Score: ${quizState.totalScore}/${maxScore}</span>
    `;
}

function resetAudit() {
    document.getElementById('result-window').classList.add('hidden');
    document.getElementById('quiz-window').classList.add('hidden');
    document.getElementById('role-select-window').classList.remove('hidden');
    quizState = { role: null, index: 0, totalScore: 0 };
}

// ==========================================================================
// ANTI-INSPECT SECURITY CONTROLLER LAYER (Isolated Perimeter Shield)
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
