// ==========================================
// COCKPIT TEST EXECUTION ENGINE
// ==========================================

import { ExamState, loadRealQuestions, generateMockDataset, getCurrentQuestion, updateQuestionStatus } from './state.js';
import { PrimeDB } from './auth.js';
import { setTestPauseState } from './antiCheating.js';

let timerInterval = null;

export function initializeTestExecutionEngine() {
    
    // 1. LISTEN FOR ORBIT CLICK (Start Test)
    window.addEventListener('startSimulation', async (event) => {
        const stream = event.detail.stream;
        console.log(` Initializing CBT for: ${stream}`);

        try {
            let realQuestions = [];
            
            // Try fetching from GitHub first, fallback to Admin IndexedDB
            try {
                const response = await fetch(`questions/${stream}.json`);
                if (response.ok) realQuestions = await response.json();
            } catch (err) { /* GitHub file not found, fallback to DB */ }

            if (!realQuestions || realQuestions.length === 0) {
                realQuestions = await PrimeDB.getQuestions(stream);
            }

            // Load data into state
            if (realQuestions && realQuestions.length > 0) {
                loadRealQuestions(realQuestions, stream);
            } else {
                generateMockDataset(stream);
            }

            // Initialize UI
            renderCurrentQuestion();
            startTimer();
            renderPalette();

        } catch (error) {
            console.error("Failed to initialize test:", error);
            alert("⚠️ Critical Error: Could not load examination matrix.");
        }
    });

    // 2. LISTEN FOR ANTI-CHEATING FORCE SUBMIT
    window.addEventListener('forceSubmitTest', () => {
        console.warn("🚨 Anti-cheating protocol triggered: Force submitting test.");
        executeFinalSubmissionSequence();
    });

    // 3. UI BUTTON LISTENERS
    document.getElementById('btn-action-next')?.addEventListener('click', () => saveAndNext());
    document.getElementById('btn-action-prev')?.addEventListener('click', () => navigateQuestion(-1));
    document.getElementById('btn-action-review')?.addEventListener('click', () => markForReview());
    document.getElementById('btn-action-clear')?.addEventListener('click', () => clearResponse());
    
    document.getElementById('btn-cockpit-submit')?.addEventListener('click', () => {
        if(confirm("Are you sure you want to submit the test? This action cannot be undone.")) {
            executeFinalSubmissionSequence();
        }
    });
    
    // Pause & Resume Logic
    document.getElementById('btn-cockpit-pause')?.addEventListener('click', () => {
        setTestPauseState(true);
        clearInterval(timerInterval);
        document.getElementById('pause-overlay').classList.remove('hidden');
        document.getElementById('pause-timer-display').innerText = document.getElementById('clock-digital-hud').innerText;
    });

    document.getElementById('btn-resume-test')?.addEventListener('click', () => {
        setTestPauseState(false);
        document.getElementById('pause-overlay').classList.add('hidden');
        startTimer();
    });

    document.getElementById('btn-cockpit-exit')?.addEventListener('click', () => {
        if(confirm("Are you sure you want to exit? All progress will be lost.")) {
            location.reload();
        }
    });

    // Return to Base from Result Dashboard
    document.getElementById('btn-return-home')?.addEventListener('click', () => {
        document.getElementById('screen-result-dashboard').classList.add('hidden');
        document.getElementById('screen-home-hub').classList.remove('hidden');
        location.reload(); // Resets the test state for a fresh attempt
    });
}

// ==========================================
// RENDERING LOGIC
// ==========================================

function renderCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;

    // Update Header
    document.getElementById('hud-question-index-number').innerText = `Q. ${ExamState.activeQuestionIndex + 1} // SUBJECT: ${q.subject}`;
    
    // Render Question Text
    const viewport = document.getElementById('hud-question-render-viewport');
    viewport.innerHTML = q.question;
    
    // Trigger MathJax to render LaTeX formulas
    if (window.MathJax) {
        MathJax.typesetPromise([viewport]).catch((err) => console.log('MathJax error:', err));
    }

    // Render Image (ImgBB / Cloudinary)
    const existingImage = document.getElementById('q-image-container');
    if (existingImage) existingImage.remove(); // Clear previous image

    if (q.imageUrl) {
        const imgContainer = document.createElement('div');
        imgContainer.id = 'q-image-container';
        imgContainer.className = 'question-image-container';
        
        const img = document.createElement('img');
        img.src = q.imageUrl;
        img.alt = "Question Diagram";
        img.onerror = () => { imgContainer.innerHTML = '<p style="color: #FF4D4D; font-size: 0.8rem;">⚠️ Image failed to load. Check URL.</p>'; };
        
        imgContainer.appendChild(img);
        // Insert image right after the question text
        viewport.parentNode.insertBefore(imgContainer, viewport.nextSibling);
    }

    // Render Options or Numerical Input
    const optionsViewport = document.getElementById('hud-options-render-viewport');
    optionsViewport.innerHTML = '';

    if (q.type === 'Numerical' || !q.options || q.options.length === 0) {
        const currentVal = ExamState.userResponses[q.id]?.value || '';
        optionsViewport.innerHTML = `
            <div class="numerical-input-container">
                <label class="numerical-hint">Enter your numerical answer (e.g., 22.4):</label>
                <input type="text" class="numerical-input-field" id="numerical-answer-input" placeholder="Type answer here..." value="${currentVal}">
            </div>
        `;
        // Auto-save on input for numerical
        document.getElementById('numerical-answer-input').addEventListener('input', (e) => {
            ExamState.userResponses[q.id] = { type: 'Numerical', value: e.target.value };
            updateQuestionStatus(q.id, 'answered');
            renderPalette();
        });
    } else {
        // Render MCQ Options
        q.options.forEach((opt, index) => {
            const isSelected = ExamState.userResponses[q.id]?.value === index;
            const div = document.createElement('div');
            div.className = `option-node-item ${isSelected ? 'selected' : ''}`;
            div.innerHTML = `<strong>${String.fromCharCode(65 + index)}.</strong> ${opt}`;
            div.onclick = () => selectOption(index);
            optionsViewport.appendChild(div);
        });
    }
    
    renderPalette();
}

function selectOption(index) {
    const q = getCurrentQuestion();
    ExamState.userResponses[q.id] = { type: 'MCQ', value: index };
    updateQuestionStatus(q.id, 'answered');
    renderCurrentQuestion(); // Re-render to show selection styling
}

// ==========================================
// NAVIGATION & PALETTE LOGIC
// ==========================================

function saveAndNext() {
    const q = getCurrentQuestion();
    if (!ExamState.userResponses[q.id]) {
        updateQuestionStatus(q.id, 'unanswered');
    }
    if (ExamState.activeQuestionIndex < ExamState.totalQuestions - 1) {
        ExamState.activeQuestionIndex++;
        renderCurrentQuestion();
    }
}

function navigateQuestion(direction) {
    const newIndex = ExamState.activeQuestionIndex + direction;
    if (newIndex >= 0 && newIndex < ExamState.totalQuestions) {
        ExamState.activeQuestionIndex = newIndex;
        renderCurrentQuestion();
    }
}

function markForReview() {
    const q = getCurrentQuestion();
    updateQuestionStatus(q.id, 'review');
    renderPalette();
    saveAndNext();
}

function clearResponse() {
    const q = getCurrentQuestion();
    delete ExamState.userResponses[q.id];
    updateQuestionStatus(q.id, 'unvisited');
    renderCurrentQuestion();
}

function renderPalette() {
    const grid = document.getElementById('hud-palette-circles-grid');
    grid.innerHTML = '';
    ExamState.questionsData.forEach((q, index) => {
        const status = ExamState.questionStatuses[q.id] || 'unvisited';
        const div = document.createElement('div');
        div.className = `status-circle-node ${status}`;
        div.innerText = index + 1;
        div.onclick = () => {
            ExamState.activeQuestionIndex = index;
            renderCurrentQuestion();
        };
        grid.appendChild(div);
    });
}

// ==========================================
// TIMER & SUBMISSION LOGIC
// ==========================================

function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (ExamState.timerSecondsLeft > 0) {
            ExamState.timerSecondsLeft--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            executeFinalSubmissionSequence();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const hrs = Math.floor(ExamState.timerSecondsLeft / 3600);
    const mins = Math.floor((ExamState.timerSecondsLeft % 3600) / 60);
    const secs = ExamState.timerSecondsLeft % 60;
    const timeStr = `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('clock-digital-hud').innerText = timeStr;
}

// ==========================================
// RESULT DASHBOARD & EXPLANATIONS
// ==========================================

export function executeFinalSubmissionSequence() {
    clearInterval(timerInterval);
    
    // 1. Calculate Detailed Results
    let totalScore = 0;
    let attempted = 0, correct = 0, incorrect = 0;
    let subjectStats = {};

    ExamState.questionsData.forEach(q => {
        if (!subjectStats[q.subject]) {
            subjectStats[q.subject] = { correct: 0, incorrect: 0, unattempted: 0, score: 0, total: 0 };
        }
        subjectStats[q.subject].total++;

        const response = ExamState.userResponses[q.id];
        
        if (!response) {
            subjectStats[q.subject].unattempted++;
        } else {
            attempted++;
            let isCorrect = false;
            
            if (q.type === 'MCQ') {
                isCorrect = response.value === q.correctAnswerIndex;
            } else {
                const userVal = parseFloat(response.value);
                const correctVal = parseFloat(q.correctAnswerIndex); 
                const tolerance = q.tolerance || 0.1;
                isCorrect = !isNaN(userVal) && Math.abs(userVal - correctVal) <= tolerance;
            }

            if (isCorrect) {
                totalScore += q.marks;
                correct++;
                subjectStats[q.subject].correct++;
                subjectStats[q.subject].score += q.marks;
            } else {
                totalScore -= q.negativeMarks;
                incorrect++;
                subjectStats[q.subject].incorrect++;
                subjectStats[q.subject].score -= q.negativeMarks;
            }
        }
    });

    ExamState.testResults = { totalScore, attempted, correct, incorrect, subjectStats };

    // 2. Hide Cockpit and Show Result Dashboard
    document.getElementById('screen-cockpit-simulation').classList.add('hidden');
    document.getElementById('screen-result-dashboard').classList.remove('hidden');

    // 3. Render the Dashboard
    renderResultDashboard();
}

function renderResultDashboard() {
    const res = ExamState.testResults;
    const maxScore = ExamState.totalQuestions * ExamState.posMark;
    const accuracy = res.attempted > 0 ? Math.round((res.correct / res.attempted) * 100) : 0;

    // Update Top Stats
    document.getElementById('res-total-score').innerText = res.totalScore;
    document.getElementById('res-max-score').innerText = maxScore;
    document.getElementById('res-accuracy').innerText = `${accuracy}%`;
    document.getElementById('res-attempted').innerText = res.attempted;
    document.getElementById('res-correct').innerText = res.correct;
    document.getElementById('res-incorrect').innerText = res.incorrect;

    // Update Subject Breakdown
    const subjectGrid = document.getElementById('res-subject-breakdown');
    subjectGrid.innerHTML = '';
    for (const [subject, stats] of Object.entries(res.subjectStats)) {
        subjectGrid.innerHTML += `
            <div class="subject-stat-item">
                <div>
                    <h4>${subject}</h4>
                    <p>C: ${stats.correct} | W: ${stats.incorrect} | Skip: ${stats.unattempted}</p>
                </div>
                <div class="subject-stat-score">${stats.score}</div>
            </div>
        `;
    }

    // Render Detailed Question Review with Explanations
    const reviewList = document.getElementById('res-question-review-list');
    reviewList.innerHTML = '';

    ExamState.questionsData.forEach((q, index) => {
        const response = ExamState.userResponses[q.id];
        let statusClass = 'is-unattempted';
        let statusText = 'UNATTEMPTED';
        
        if (response) {
            let isCorrect = false;
            if (q.type === 'MCQ') isCorrect = response.value === q.correctAnswerIndex;
            else isCorrect = Math.abs(parseFloat(response.value) - parseFloat(q.correctAnswerIndex)) <= (q.tolerance || 0.1);
            
            if (isCorrect) { statusClass = 'is-correct'; statusText = 'CORRECT'; }
            else { statusClass = 'is-incorrect'; statusText = 'INCORRECT'; }
        }

        // Build Options HTML
        let optionsHtml = '';
        if (q.type === 'MCQ' && q.options) {
            q.options.forEach((opt, i) => {
                let optClass = '';
                if (i === q.correctAnswerIndex) optClass = 'actual-correct'; 
                if (response && response.value === i && i !== q.correctAnswerIndex) optClass = 'user-wrong'; 
                
                optionsHtml += `<div class="review-option-item ${optClass}"><strong>${String.fromCharCode(65 + i)}.</strong> ${opt}</div>`;
            });
        } else {
            const userAns = response ? response.value : 'No Answer';
            optionsHtml = `<div class="review-option-item">Your Answer: <strong>${userAns}</strong></div>
                           <div class="review-option-item actual-correct">Correct Answer: <strong>${q.correctAnswerIndex}</strong></div>`;
        }

        // Build Explanation HTML
        const explanationHtml = q.explanation ? `
            <div class="explanation-box">
                <h4><i class="fas fa-lightbulb"></i> DETAILED EXPLANATION</h4>
                <p>${q.explanation}</p>
            </div>
        ` : '';

        // Assemble Card
        const card = document.createElement('div');
        card.className = `review-question-card ${statusClass}`;
        card.innerHTML = `
            <div class="review-q-header">
                <span>Q. ${index + 1} // ${q.subject}</span>
                <span style="color: ${statusClass === 'is-correct' ? 'var(--status-answered)' : (statusClass === 'is-incorrect' ? 'var(--status-unanswered)' : '#7F8C8D')}">${statusText}</span>
            </div>
            <div class="review-q-text">${q.question}</div>
            ${q.imageUrl ? `<div class="question-image-container"><img src="${q.imageUrl}" alt="Diagram"></div>` : ''}
            <div class="review-options-list">${optionsHtml}</div>
            ${explanationHtml}
        `;
        reviewList.appendChild(card);
    });

    // Trigger MathJax to render any math in the explanations
    if (window.MathJax) {
        MathJax.typesetPromise([reviewList]).catch((err) => console.log('MathJax error:', err));
    }
}
