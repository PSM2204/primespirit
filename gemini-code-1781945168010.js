// --- Quiz Application logic ---
const quizQuestions = [
    {
        question: "What is the primary indicator of strong emotional intelligence?",
        answers: [
            { text: "Suppressing all structural emotions", correct: false },
            { text: "Recognizing, understanding, and managing emotions", correct: true },
            { text: "Always agreeing with external opinions", correct: false },
            { text: "Having a high technical IQ score", correct: false }
        ]
    },
    {
        question: "Which mindset approach treats challenges as opportunities to grow?",
        answers: [
            { text: "Fixed Mindset", correct: false },
            { text: "Stagnant Mindset", correct: false },
            { text: "Growth Mindset", correct: true },
            { text: "Defensive Mindset", correct: false }
        ]
    },
    {
        question: "What is the most effective way to eliminate modern productivity blockers?",
        answers: [
            { text: "Multitasking continuously", correct: false },
            { text: "Working without micro-breaks", correct: false },
            { text: "Structured focus windows (e.g., Pomodoro method)", correct: true },
            { text: "Checking notifications immediately", correct: false }
        ]
    }
];

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const quizWindow = document.getElementById('quiz-window');
const resultWindow = document.getElementById('result-window');
const scoreText = document.getElementById('score-text');
const restartButton = document.getElementById('restart-btn');

let currentQuestionIndex = 0;
let score = 0;

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    resultWindow.classList.add('hidden');
    quizWindow.classList.remove('hidden');
    nextButton.classList.add('hidden');
    showQuestion();
}

function showQuestion() {
    resetState();
    let currentQuestion = quizQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn-choice');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hidden');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === "true";
    
    if (isCorrect) {
        selectedButton.classList.add('correct');
        score++;
    } else {
        selectedButton.classList.add('wrong');
    }

    Array.from(answerButtonsElement.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    if (quizQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hidden');
    } else {
        setTimeout(showResults, 1500);
    }
}

function showResults() {
    quizWindow.classList.add('hidden');
    nextButton.classList.add('hidden');
    resultWindow.classList.remove('hidden');
    scoreText.innerText = `You scored ${score} out of ${quizQuestions.length}!`;
}

nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

restartButton.addEventListener('click', startQuiz);

// Initialize Quiz on load
document.addEventListener('DOMContentLoaded', startQuiz);

// --- Form Validation Interaction ---
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for reaching out to Prime Spirit Mentors! We will connect with you shortly.');
    this.reset();
});