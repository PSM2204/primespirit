// Interactive Assessment Logic Matrix
const quizQuestions = [
    {
        question: "How do you handle advanced numerical problem derivations under tight mock exam timers?",
        answers: [
            { text: "I instantly identify patterns and connect formulas seamlessly.", correct: true },
            { text: "I panic, confuse my variables, or overthink the process.", correct: false }
        ]
    },
    {
        question: "What does your current self-study workflow look like outside of class hours?",
        answers: [
            { text: "Highly structured with targeted revisions and active mock sessions.", correct: true },
            { text: "Mainly chaotic—cramming concepts at random intervals without tracking.", correct: false }
        ]
    },
    {
        question: "When performance drops or mock scores hit a low point, how do you handle it?",
        answers: [
            { text: "I systematically audit mistake metrics and adjust methods.", correct: true },
            { text: "I deal with severe burnout, anxiety, and doubt my career trajectory.", correct: false }
        ]
    }
];

// Operational App State Cache
let currentQuestionIndex = 0;
let pointsScore = 0;

// Element Queries
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const restartButton = document.getElementById('restart-btn');
const quizWindow = document.getElementById('quiz-window');
const resultWindow = document.getElementById('result-window');
const scoreText = document.getElementById('score-text');

// Menu Interaction Hooks
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

// Engine Operations Controls
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
        button.style.opacity = "0.5";
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
    
    if (pointsScore === quizQuestions.length) {
        if(scoreText) scoreText.innerHTML = `🌟 <strong>Score: ${pointsScore} / ${quizQuestions.length}</strong> — Elite strategy profile! Your conceptual workflow is solid. Let's optimize it for peak performance.`;
    } else {
        if(scoreText) scoreText.innerHTML = `📉 <strong>Score: ${pointsScore} / ${quizQuestions.length}</strong> — You have hidden vulnerability caps or test anxieties holding you back. We can clear this systematically.`;
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

// Prevent default page reload tracking loops on Contact submit
const contactForm = document.getElementById('contact-form');
if(contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Details received successfully! Abhinav sir will review your profile metrics and connect via WhatsApp/Email shortly to set up your free counseling slot.');
        contactForm.reset();
    });
}
