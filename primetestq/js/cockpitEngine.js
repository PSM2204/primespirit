import { ExamState, loadRealQuestions, generateMockDataset, getCurrentQuestion, updateQuestionStatus } from './state.js';
import { PrimeDB } from './auth.js';
import { setTestPauseState } from './antiCheating.js';

let timerInterval = null;

export function initializeTestExecutionEngine() {
    
    window.addEventListener('startSimulation', async (event) => {
        const stream = event.detail.stream;
        console.log(`🚀 Initializing CBT for: ${stream}`);

        try {
            const realQuestions = await PrimeDB.getQuestions(stream);
            if (realQuestions && Array.isArray(realQuestions) && realQuestions.length > 0) {
                loadRealQuestions(realQuestions, stream);
            } else {
                generateMockDataset(stream);
            }
            renderCurrentQuestion();
            startTimer();
            renderPalette();
        } catch (error) {
            console.error("Failed to initialize test:", error);
            alert("⚠️ Critical Error: Could not load examination matrix.");
        }
    });

    // Anti-cheating force submit listener
    window.addEventListener('forceSubmitTest', () => {
        console.warn("🚨 Anti-cheating protocol triggered: Force submitting test.");
        executeFinalSubmissionSequence();
    });

    // UI Button Listeners
    document.getElementById('btn-action-next')?.addEventListener('click', () => saveAndNext());
    document.getElementById('btn-action-prev')?.addEventListener('click', () => navigateQuestion(-1));
    document.getElementById('btn-action-review')?.addEventListener('click', () => markForReview());
    document.getElementById('btn-action-clear')?.addEventListener('click', () => clearResponse());
    document.getElementById('btn-cockpit-submit')?.addEventListener('click', () => executeFinalSubmissionSequence());
    
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
}

function renderCurrentQuestion() {
    const q = getCurrentQuestion();
    if (!q) return;

    document.getElementById('hud-question-index-number').innerText = `Q. ${ExamState.activeQuestionIndex + 1} // SUBJECT: ${q.subject}`;
    
    const viewport = document.getElementById('hud-question-render-viewport');
    viewport.innerHTML = q.question;
    
    // Trigger MathJax render
    if (window.MathJax) {
        MathJax.typesetPromise([viewport]).catch((err) => console.log('MathJax error:', err));
    }

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
    renderCurrentQuestion(); // Re-render to show selection
}

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

export function executeFinalSubmissionSequence() {
    clearInterval(timerInterval);
    let score = 0;
    let attempted = 0;
    let correct = 0;
    let incorrect = 0;

    ExamState.questionsData.forEach(q => {
        const response = ExamState.userResponses[q.id];
        if (response) {
            attempted++;
            if (q.type === 'MCQ') {
                if (response.value === q.correctAnswerIndex) {
                    score += q.marks;
                    correct++;
                } else {
                    score -= q.negativeMarks;
                    incorrect++;
                }
            } else if (q.type === 'Numerical') {
                const userVal = parseFloat(response.value);
                const correctVal = parseFloat(q.correctAnswerIndex); // Stored in correctAnswerIndex for simplicity
                const tolerance = q.tolerance || 0.1;
                if (!isNaN(userVal) && Math.abs(userVal - correctVal) <= tolerance) {
                    score += q.marks;
                    correct++;
                } else if (!isNaN(userVal)) {
                    score -= q.negativeMarks;
                    incorrect++;
                }
            }
        }
    });

    alert(`🏆 TEST SUBMITTED!\n\nScore: ${score} / ${ExamState.totalQuestions * ExamState.posMark}\nAttempted: ${attempted}\nCorrect: ${correct}\nIncorrect: ${incorrect}`);
    location.reload(); // Reset to home
}
