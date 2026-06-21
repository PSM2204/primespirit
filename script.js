// Gamified Assessment Matrix Configuration
const quizQuestions = [
    {
        question: "How do you handle advanced analytical derivations or numerical balance problems under tight examination timers?",
        answers: [
            { text: "I comfortably map logical formulas instantly.", correct: true },
            { text: "I experience high anxiety and overthink the initial variables.", correct: false }
        ]
    },
    {
        question: "What does your secondary self-study tracking system look like outside of typical classroom hours?",
        answers: [
            { text: "Highly structured notes with mapped revision cycles.", correct: true },
            { text: "Random cramming sessions without tracking test metrics.", correct: false }
        ]
    },
    {
        question: "When processing critical mock-score drops or unexpected performance setbacks, what is your mindset?",
        answers: [
            { text: "I isolate problem metrics and adjust conceptual loops cleanly.", correct: true },
            { text: "I experience heavy psychological burnout or severe imposter panic.", correct: false }
        ]
    }
];

// App Cache State variables
let currentQuestionIndex = 0;
let pointsScore = 0;

// Dynamic Element Targets
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const quizWindow = document.getElementById('quiz-window');
const resultWindow = document.getElementById('result-window');
const scoreText = document.getElementById('score-text');
const badgeDisplay = document.getElementById('badge-display');

// Responsive Hamburger Toggle Mechanics
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if(icon.classList.contains('fa-bars')) {
            icon.className = 'fas fa-xmark';
        } else {
            icon.className = 'fas fa-bars';
        }
    });

    document.querySelectorAll('#nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.className = 'fas fa-bars';
        });
    });
}

// Gamified Diagnostic Logic Orchestration
function launchAssessment() {
    currentQuestionIndex = 0;
    pointsScore = 0;
    if(resultWindow) resultWindow.classList.add('hidden');
    if(quizWindow) quizWindow.classList.remove('hidden');
    if(nextButton) nextButton.classList.add('hidden');
    renderQuestion();
}

function renderQuestion() {
    resetQuizTrack();
    let currentQuestion = quizQuestions[currentQuestionIndex];
    if (questionElement) questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('quiz-btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', captureSelection);
        if (answerButtonsElement) answerButtonsElement.appendChild(button);
    });
}

function resetQuizTrack() {
    if(nextButton) nextButton.classList.add('hidden');
    while (answerButtonsElement && answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function captureSelection(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) pointsScore++;
    
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true;
        button.style.opacity = "0.4";
    });
    
    selectedBtn.style.borderColor = "var(--primary-neon)";
    selectedBtn.style.background = "rgba(0, 112, 243, 0.1)";
    selectedBtn.style.opacity = "1";

    if (quizQuestions.length > currentQuestionIndex + 1) {
        if(nextButton) nextButton.classList.remove('hidden');
    } else {
        showResultsWindow();
    }
}

function showResultsWindow() {
    if(quizWindow) quizWindow.classList.add('hidden');
    if(nextButton) nextButton.classList.add('hidden');
    if(resultWindow) resultWindow.classList.remove('hidden');
    
    // Custom Gamified Addictive Badges for GenZ Engagement
    if (pointsScore === quizQuestions.length) {
        if(badgeDisplay) badgeDisplay.innerText = "🏆";
        if(scoreText) scoreText.innerHTML = `<strong>Score: ${pointsScore} / ${quizQuestions.length} — Formula Wizard Status</strong><br>Your conceptual logic matrix is clean. Let's maximize it to guarantee top ranks.`;
    } else if (pointsScore > 0) {
        if(badgeDisplay) badgeDisplay.innerText = "⚡";
        if(scoreText) scoreText.innerHTML = `<strong>Score: ${pointsScore} / ${quizQuestions.length} — Speed Demon Status</strong><br>You have great analytical potential, but hidden test anxieties are capping your output under pressure.`;
    } else {
        if(badgeDisplay) badgeDisplay.innerText = "📉";
        if(scoreText) scoreText.innerHTML = `<strong>Score: ${pointsScore} / ${quizQuestions.length} — Severe Burnout Warning</strong><br>Your mind and approach pathways are struggling with stress. We need structured counseling immediately to re-anchor you.`;
    }
}

if(nextButton) {
    nextButton.addEventListener('click', () => {
        currentQuestionIndex++;
        renderQuestion();
    });
}

if(restartButton) {
    restartButton.addEventListener('click', launchAssessment);
}

document.addEventListener('DOMContentLoaded', launchAssessment);

// Form Control submission override hooks
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Data uploaded metrics locked! Abhinav sir will assess your scoring diagnostics profile and reach out via WhatsApp/Email to finalize your free 1-on-1 strategy slot.');
        contactForm.reset();
    });
}
