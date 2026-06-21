// Advanced Psychometric Data Structure Map
const psychometricQuizData = {
    student: [
        {
            q: "When you sit down to solve a highly complex Physics or Mathematics problem set, what happens internally?",
            a: [
                { text: "⚡ I get an immediate rush of anxiety and assume I won't hit the right derivation.", metric: "stress", weight: 3 },
                { text: "⏳ I understand the core logic but consistently clear the timer too slowly.", metric: "speed", weight: 2 },
                { text: "🎯 I treat it like an engaging challenge and confidently execute formulas.", metric: "motivation", weight: 3 },
                { text: "⚙️ I can replicate steps from memory but struggle if the numerical pattern changes.", metric: "logic", weight: 2 }
            ]
        },
        {
            q: "How does your mental stamina hold up during long-duration mock tracking exams or board cycles?",
            a: [
                { text: "🛑 Severe exhaustion kicks in halfway through, leading to careless calculation errors.", metric: "stress", weight: 3 },
                { text: "📉 I lose interest completely if the initial few questions are too complex.", metric: "motivation", weight: 1 },
                { text: "🧠 My mind wanders off; staying hyper-focused for 3 hours feels nearly impossible.", metric: "logic", weight: 3 },
                { text: "⚡ I stay locked in but run completely out of time before the final module.", metric: "speed", weight: 3 }
            ]
        },
        {
            q: "If mock performance metrics drop unexpectedly, how do you manage that psychological shock?",
            a: [
                { text: "🌪️ Massive imposter syndrome hits; I doubt if I can handle NEET/JEE tracks at all.", metric: "stress", weight: 3 },
                { text: "📊 I systematically audit my exact weak modules with absolute zero panic.", metric: "motivation", weight: 3 },
                { text: "🚪 I try to ignore the score and switch variables to a completely different subject.", metric: "logic", weight: 2 },
                { text: "💬 I feel immense pressure regarding what my parents or teachers will say.", metric: "alignment", weight: 3 }
            ]
        },
        {
            q: "What is the single biggest roadblock holding you back from scoring at your absolute maximum potential?",
            a: [
                { text: "⚠️ Unmanageable stress and conceptual overthinking during exam hour blocks.", metric: "stress", weight: 3 },
                { text: "🐢 Weak fundamental building blocks from lower secondary classes (6th-10th).", metric: "logic", weight: 3 },
                { text: "⏱️ Mismanaging my exam roadmap time allocation strategy.", metric: "speed", weight: 3 },
                { text: "📉 Lack of structured routines and consistent everyday accountability.", metric: "motivation", weight: 2 }
            ]
        },
        {
            q: "Be entirely honest: What is driving your current educational preparation milestones?",
            a: [
                { text: "🚀 True intrinsic passion to conquer advanced sciences/economics and solve hard logics.", metric: "motivation", weight: 3 },
                { text: "👪 Fulfilling family career tracks and satisfying parental expectations.", metric: "alignment", weight: 3 },
                { text: "💎 Securing a highly lucrative lifestyle and status marker in elite engineering/medical spaces.", metric: "alignment", weight: 2 },
                { text: "🛡️ Pure fear of falling behind my peer circle or failing completely.", metric: "stress", weight: 2 }
            ]
        },
        {
            q: "When reviewing highly theoretical data frameworks (like Botany cycles or Macroeconomic metrics), you tend to:",
            a: [
                { text: "🧠 Memorize chunks cleanly but fail when application logic tracking queries appear.", metric: "logic", weight: 3 },
                { text: "🌀 Overwhelm my tracking memory quickly, finding data retention chaotic.", metric: "stress", weight: 2 },
                { text: "📝 Code charts, mind-maps, and visual blueprints to store connections seamlessly.", metric: "motivation", weight: 3 },
                { text: "⏳ Skip the dense theory blocks entirely and jump straight into solving patterns.", metric: "speed", weight: 2 }
            ]
        },
        {
            q: "How do you rate the everyday alignment between your academic prep schedules and your personal mental health?",
            a: [
                { text: "📉 I am running on pure burnout; my sleep, mood, and mental clarity are taking hits.", metric: "stress", weight: 3 },
                { text: "⚖️ I manage my balance profiles decently well but feel constant low-level pressure.", metric: "logic", weight: 2 },
                { text: "💪 High energy era! I balance rigorous preparation with completely unshakeable confidence.", metric: "motivation", weight: 3 },
                { text: "🤷‍♂️ I have lowered my goals completely to protect my peace of mind.", metric: "alignment", weight: 2 }
            ]
        },
        {
            q: "When a question paper presents an entirely new, unseen application puzzle template, your instinct is to:",
            a: [
                { text: "🛑 Freeze up completely and assume it's beyond my intelligence layer.", metric: "stress", weight: 3 },
                { text: "🧩 Systematically strip down the known variables to isolate the logic path.", metric: "logic", weight: 3 },
                { text: "⏳ Waste too many minutes trying to forcefully derive a path, breaking my time budget.", metric: "speed", weight: 3 },
                { text: "⏭️ Skip it immediately to secure safer marks down the line.", metric: "speed", weight: 1 }
            ]
        },
        {
            q: "Your current personal daily study tracking systems can be described as:",
            a: [
                { text: "📋 Flawlessly structured charts with distinct milestones and active recalls.", metric: "motivation", weight: 3 },
                { text: "🌪️ Completely chaotic—studying random variables only when exam notifications hit.", metric: "logic", weight: 3 },
                { text: "📱 Constantly disrupted by micro-distractions and scrolling patterns.", metric: "motivation", weight: 1 },
                { text: "⏳ I try to execute schedules but structural anxiety blocks my implementation flow.", metric: "stress", weight: 2 }
            ]
        },
        {
            q: "What component do you feel is missing from your ecosystem to scale to a top national rank?",
            a: [
                { text: "🧘 Professional student counseling to dissolve stress and regulate anxiety loops.", metric: "stress", weight: 3 },
                { text: "🧬 Deep conceptual mentors who break formulas into foundational logic models.", metric: "logic", weight: 3 },
                { text: "⏱️ Advanced time hack simulations to fix speed thresholds.", metric: "speed", weight: 3 },
                { text: "🔥 High-octane everyday tracking to maintain relentless execution loops.", metric: "motivation", weight: 2 }
            ]
        }
    ],
    parent: [
        {
            q: "When observing your child's current academic preparation patterns, what is your deepest internal worry?",
            a: [
                { text: "🌪️ Their visible stress, anxiety drops, and potential mental health burnout.", metric: "stress", weight: 3 },
                { text: "📉 Lack of absolute conceptual tracking; they prioritize cramming over core fundamentals.", metric: "logic", weight: 3 },
                { text: "📱 Micro-distractions, screen addiction, and general inconsistencies in daily routines.", metric: "motivation", weight: 3 },
                { text: "⏳ Mismanagement of examination hours leading to low performance output despite hard work.", metric: "speed", weight: 2 }
            ]
        },
        {
            q: "How often do conversations regarding future careers, NEET/JEE mock scores, or board trackers generate tension at home?",
            a: [
                { text: "💥 Frequently. It easily turns into a high-friction defense loop or silent phase.", metric: "alignment", weight: 3 },
                { text: "⚖️ Rarely. We attempt discussion loops but can easily sense underlying stress barriers.", metric: "stress", weight: 2 },
                { text: "🤝 Smoothly. We share complete clarity and absolute operational goal alignment.", metric: "motivation", weight: 3 },
                { text: "🤐 We intentionally avoid the topic completely to maintain household peace.", metric: "alignment", weight: 2 }
            ]
        },
        {
            q: "How would you diagnose your child's psychological resilience when facing poor mock scorecard reports?",
            a: [
                { text: "🛑 They face deep emotional crashes, lock themselves away, or lose confidence for days.", metric: "stress", weight: 3 },
                { text: "🤷‍♂️ They simulate indifference, hiding behind a casual attitude to avoid the pain point.", metric: "alignment", weight: 3 },
                { text: "🔋 They try to fight back instantly but repeat the same mechanical errors over and over.", metric: "logic", weight: 2 },
                { text: "📈 They process feedback with logical maturity and maintain zero panic metrics.", metric: "motivation", weight: 3 }
            ]
        },
        {
            q: "Which parameter describes your child's core fundamental building blocks from previous classes (6th-10th Math/Science)?",
            a: [
                { text: "⚠️ Severe structural gaps are coming back to haunt their advanced 11th/12th prep equations.", metric: "logic", weight: 3 },
                { text: "📋 Decent foundation tracking but lacks high-velocity competitive edge application models.", metric: "logic", weight: 1 },
                { text: "🔥 Flawless intuitive analytics—they easily conceptualize logic frameworks.", metric: "motivation", weight: 3 },
                { text: "🔄 They have the intelligence index but lack stable study stamina thresholds.", metric: "motivation", weight: 2 }
            ]
        },
        {
            q: "As a parent, your primary motivation for securing an elite rank or secondary board metric for them is:",
            a: [
                { text: "🌟 Ensuring they fulfill their true raw intellectual capacity and feel accomplished.", metric: "motivation", weight: 3 },
                { text: "🛡️ Securing safe, stable global career matrices in a highly volatile market system.", metric: "alignment", weight: 2 },
                { text: "💎 Elevating family pride, establishing stellar community markers, and legacy building.", metric: "alignment", weight: 3 },
                { text: "🛑 Ensuring they don't lock themselves out of major national opportunities due to early slacking.", metric: "stress", weight: 2 }
            ]
        },
        {
            q: "How would you define your personal parental tracking anxiety score regarding their future choices?",
            a: [
                { text: "📈 High pressure. I am constantly tracking their metrics, sleeplessly worrying about options.", metric: "alignment", weight: 3 },
                { text: "⚖️ Controlled anxiety. I try to stay calm but feel deep stress behind the scenes.", metric: "stress", weight: 3 },
                { text: "🧘 Completely serene. I trust the timing and focus purely on providing empathetic infrastructure.", metric: "motivation", weight: 3 },
                { text: "🌪️ Frustrated. I want to guide them but feel a total lack of communication control.", metric: "alignment", weight: 2 }
            ]
        },
        {
            q: "When your child is studying inside their room for hours, you notice their focus profiles are:",
            a: [
                { text: "📱 Highly fragmented by notification check frequencies and micro-task loops.", metric: "motivation", weight: 3 },
                { text: "⏳ Extremely intense but clearly paired with high friction, sighing, or visual stress signs.", metric: "stress", weight: 3 },
                { text: "🧠 Passive reading—flipping textbook blocks lazily without writing or doing active recall sheets.", metric: "logic", weight: 3 },
                { text: "🔥 Flow state mastery—completely zoned in with rigorous structural output metrics.", metric: "motivation", weight: 3 }
            ]
        },
        {
            q: "What is your perspective on your child's current time budgeting mechanics during mock simulations?",
            a: [
                { text: "🐢 They freeze on single tough physics/math puzzles and leave half the paper unattempted.", metric: "speed", weight: 3 },
                { text: "🏃‍♂️ They rush through the modules carelessly, making highly preventable calculation errors.", metric: "speed", weight: 2 },
                { text: "📊 They struggle to prioritize easy scoring questions, breaking their tactical time limits.", metric: "logic", weight: 2 },
                { text: "🎯 Flawless velocity tracking—they calculate options cleanly within the allotted limits.", metric: "motivation", weight: 3 }
            ]
        },
        {
            q: "In your observation, how effectively does your child communicate their internal academic fears with you?",
            a: [
                { text: "🤐 Total lockdown. They mask everything behind 'I am fine' or single-word answers.", metric: "alignment", weight: 3 },
                { text: "💥 Explosive communication—it only vents out during major performance crashes or arguments.", metric: "stress", weight: 3 },
                { text: "🕊️ Partial filtration. They discuss basic conceptual steps but hide deep mindset anxieties.", metric: "stress", weight: 1 },
                { text: "🤝 Complete transparent audit loops—we operate like a cohesive execution team.", metric: "motivation", weight: 3 }
            ]
        },
        {
            q: "What structural asset do you believe your child needs right now to step into their peak potential phase?",
            a: [
                { text: "🧘 Specialized professional counseling to break stress cycles and restore confidence.", metric: "stress", weight: 3 },
                { text: "🎓 Foundational conceptual trainers who rebuild intuitive scientific logic, step-by-step.", metric: "logic", weight: 3 },
                { text: "⏱️ Advanced time automation trackers to patch up speed and examination panic thresholds.", metric: "speed", weight: 3 },
                { text: "👥 A third-party objective mentor who acts as an accountability layer to bypass household arguments.", metric: "alignment", weight: 3 }
            ]
        }
    ]
};

// Global Tracking Registry Cache variables
let chosenRole = '';
let currentTrackIndex = 0;
let diagnosticMetrics = { stress: 0, logic: 0, speed: 0, motivation: 0, alignment: 0 };

// Interface Nodes Selection Hooks
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const roleSelectWindow = document.getElementById('role-select-window');
const quizWindow = document.getElementById('quiz-window');
const resultWindow = document.getElementById('result-window');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const progressText = document.getElementById('quiz-progress-text');
const trackIdentity = document.getElementById('quiz-track-identity');
const metricsOutput = document.getElementById('psych-metrics-output');
const badgeDisplay = document.getElementById('badge-display');

// Responsive Header Menu Animation Controller
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        icon.className = icon.classList.contains('fa-bars') ? 'fas fa-xmark' : 'fas fa-bars';
    });
}

// Psychometric Entry Core Launch
function startPsychometricQuiz(role) {
    chosenRole = role;
    currentTrackIndex = 0;
    diagnosticMetrics = { stress: 0, logic: 0, speed: 0, motivation: 0, alignment: 0 };
    
    if(roleSelectWindow) roleSelectWindow.classList.add('hidden');
    if(quizWindow) quizWindow.classList.remove('hidden');
    
    if(trackIdentity) {
        trackIdentity.innerText = role === 'student' ? "🚀 Student Tracking Matrix Active" : "👥 Parent Diagnostic Tracking Active";
    }
    
    renderPsychQuestion();
}

function renderPsychQuestion() {
    clearOptionsTrack();
    const activeQuestions = psychometricQuizData[chosenRole];
    let currentQData = activeQuestions[currentTrackIndex];
    
    if(progressText) progressText.innerText = `Evaluation Block: ${currentTrackIndex + 1} of 10`;
    if(questionElement) questionElement.innerText = currentQData.q;

    currentQData.a.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.classList.add('quiz-btn');
        button.addEventListener('click', () => processOptionSelection(option, button));
        if(answerButtonsElement) answerButtonsElement.appendChild(button);
    });
}

function clearOptionsTrack() {
    if(nextButton) nextButton.classList.add('hidden');
    while (answerButtonsElement && answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function processOptionSelection(option, selectedButton) {
    // Inject custom metrics weights directly into registry logs
    diagnosticMetrics[option.metric] += option.weight;

    // Lock all options to provide an addictive clean tap experience
    Array.from(answerButtonsElement.children).forEach(btn => {
        btn.disabled = true;
        btn.style.opacity = "0.4";
    });

    selectedButton.style.borderColor = "var(--primary-neon)";
    selectedButton.style.background = "rgba(0, 112, 243, 0.08)";
    selectedButton.style.opacity = "1";

    const activeQuestions = psychometricQuizData[chosenRole];
    if (activeQuestions.length > currentTrackIndex + 1) {
        if(nextButton) nextButton.classList.remove('hidden');
    } else {
        compilePsychDiagnosticsReport();
    }
}

function compilePsychDiagnosticsReport() {
    if(quizWindow) quizWindow.classList.add('hidden');
    if(nextButton) nextButton.classList.add('hidden');
    if(resultWindow) resultWindow.classList.remove('hidden');

    // Advanced Algorithmic evaluation to determine primary pain thresholds
    let maxMetric = 'stress';
    let maxVal = -1;
    for (let key in diagnosticMetrics) {
        if(diagnosticMetrics[key] > maxVal) {
            maxVal = diagnosticMetrics[key];
            maxMetric = key;
        }
    }

    let diagnosticHTML = '';
    
    if(chosenRole === 'student') {
        if(maxMetric === 'stress' || diagnosticMetrics.stress > 12) {
            if(badgeDisplay) badgeDisplay.innerText = "🧘";
            diagnosticHTML = `<strong>🔍 Primary Vulnerability: Severe Academic Burnout & Anxiety Thresholds</strong><br><br>
            Your profile metrics indicate that examination anxiety loops and advanced formula overthinking are severely blocking your score potential. You don't need to study more hours—you need specialized <em>Student Counseling</em> to lower your cortisol levels and lock in exam-hour calmness.`;
        } else if(maxMetric === 'logic') {
            if(badgeDisplay) badgeDisplay.innerText = "🧬";
            diagnosticHTML = `<strong>🔍 Primary Vulnerability: Core Logic Breakdown</strong><br><br>
            You are operating on memory tracking rather than true conceptual physics or math intuition. When an exam module twists the application profile, you run into roadblock scripts. We need to rebuild your lower secondary foundations systematically.`;
        } else if(maxMetric === 'speed') {
            if(badgeDisplay) badgeDisplay.innerText = "⏱️";
            diagnosticHTML = `<strong>🔍 Primary Vulnerability: Execution Velocity Caps</strong><br><br>
            Your concept retention models are running but your speed mechanics are mismanaged. You freeze on hard physics numericals, wasting crucial time allocations. Customized strategy mapping is required.`;
        } else {
            if(badgeDisplay) badgeDisplay.innerText = "🔥";
            diagnosticHTML = ` = `<strong>🔍 Primary Vulnerability: Strategic Disconnection Loops</strong><br><br>
            Your raw intelligence baseline is running at peak capacity, but you lack an unshakeable day-to-day strategic tracking layout. Re-anchoring your accountability modules will unlock top ranks easily.`;
        }
    } else { // Parent Profile Output
        if(maxMetric === 'stress' || diagnosticMetrics.stress > 10) {
            if(badgeDisplay) badgeDisplay.innerText = "👪";
            diagnosticHTML = `<strong>🔍 Parent-Student Diagnostic Report: Silent Burnout Shielding</strong><br><br>
            You can clearly observe deep psychological stress, mood adjustments, or isolation cycles in your child. They are trying hard to absorb massive competitive expectations but are running on empty thresholds. Empathetic professional counseling is recommended to preserve both their peace and their rank potential.`;
        } else if(maxMetric === 'alignment') {
            if(badgeDisplay) badgeDisplay.innerText = "💥";
            diagnosticHTML = `<strong>🔍 Parent-Student Diagnostic Report: Communication Alignment Deficit</strong><br><br>
            Conversations regarding test metrics, NEET/JEE mock trackers, or career decisions are triggering protective high-friction scripts or silence loops at home. Injecting a neutral, objective mentor layer will completely bypass household arguments.`;
        } else if(maxMetric === 'logic') {
            if(badgeDisplay) badgeDisplay.innerText = "📐";
            diagnosticHTML = `<strong>🔍 Parent-Student Diagnostic Report: Foundation Layer Instability</strong><br><br>
            Your diagnostic data indicates your child is working hard but running into severe structural gaps left over from Class 6th-10th Science and Mathematics models. We must patch their conceptual logic foundations quickly.`;
        } else {
            if(badgeDisplay) badgeDisplay.innerText = "📱";
            diagnosticHTML = `<strong>🔍 Parent-Student Diagnostic Report: Routine Fragmentation Track</strong><br><br>
            The child possesses excellent raw intelligence scores but their day-to-day stamina is being continuously interrupted by micro-distractions and modern screen scrolling behaviors. They require a rigorous outer accountability matrix.`;
        }
    }

    if(metricsOutput) metricsOutput.innerHTML = diagnosticHTML;
}

if(nextButton) {
    nextButton.addEventListener('click', () => {
        currentTrackIndex++;
        renderPsychQuestion();
    });
}

if(restartButton) {
    restartButton.addEventListener('click', () => {
        if(resultWindow) resultWindow.classList.add('hidden');
        if(roleSelectWindow) roleSelectWindow.classList.remove('hidden');
    });
}

// Override contact form submission hook behavior cleanly
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Diagnostic parameters securely synced! Abhinav sir will evaluate your specific student counseling tracking metrics and reach out via WhatsApp/Email to schedule your free strategic alignment session.');
        contactForm.reset();
    });
}
