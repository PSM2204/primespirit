import { ExamState, generateMockDataset } from './state.js';

export function initializeTestExecutionEngine() {
    window.addEventListener('startSimulation', (e) => {
        ExamState.stream = e.detail.stream;
        ExamState.questionsData = generateMockDataset(e.detail.stream);
        ExamState.activeQuestionIndex = 0;
        
        bootTimerInstrumentation();
        buildTelemetryPaletteHUD();
        renderWorkspaceQuestionItem();
    });

    document.getElementById('btn-action-next').addEventListener('click', () => saveAndNavigateNextSequence(1));
    document.getElementById('btn-action-prev').addEventListener('click', () => saveAndNavigateNextSequence(-1));
    document.getElementById('btn-action-review').addEventListener('click', markQuestionForReviewMetric);
    document.getElementById('btn-action-clear').addEventListener('click', clearSelectedResponseMetric);

    setupSwipeGestures();
}

function renderWorkspaceQuestionItem() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    if (!currentQ) return;

    if (ExamState.questionStatuses[currentQ.id] === 'unvisited') {
        ExamState.questionStatuses[currentQ.id] = 'unanswered';
    }

    document.getElementById('hud-question-index-number').innerText = `QUESTION ${String(currentQ.id).padStart(2, '0')}`;
    document.getElementById('hud-question-render-viewport').innerText = currentQ.text;

    const optionsBox = document.getElementById('hud-options-render-viewport');
    optionsBox.innerHTML = '';

    currentQ.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'option-node-item';
        if (ExamState.userResponses[currentQ.id] === idx) item.classList.add('selected');
        
        item.innerHTML = `<span style="margin-right:15px; color:var(--primary-neon); font-weight:800;">${String.fromCharCode(65+idx)}.</span> ${opt}`;
        item.addEventListener('click', () => registerOptionSelection(currentQ.id, idx));
        optionsBox.appendChild(item);
    });

    updateTelemetryCirclesUI();
}

function registerOptionSelection(qId, optionIdx) {
    ExamState.userResponses[qId] = optionIdx;
    ExamState.questionStatuses[qId] = 'answered';
    renderWorkspaceQuestionItem();
}

function saveAndNavigateNextSequence(direction) {
    let nextIdx = ExamState.activeQuestionIndex + direction;
    if (nextIdx >= 0 && nextIdx < ExamState.totalQuestions) {
        ExamState.activeQuestionIndex = nextIdx;
        renderWorkspaceQuestionItem();
    }
}

// Function updates to prevent reference loops across files
function markQuestionForReviewMetric() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    ExamState.questionStatuses[currentQ.id] = 'review';
    saveAndNavigateNextSequence(1);
}

function clearSelectedResponseMetric() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    delete ExamState.userResponses[currentQ.id];
    ExamState.questionStatuses[currentQ.id] = 'unanswered';
    renderWorkspaceQuestionItem();
}

function buildTelemetryPaletteHUD() {
    const matrixGrid = document.getElementById('hud-palette-circles-grid');
    matrixGrid.innerHTML = '';
    ExamState.questionsData.forEach((q, idx) => {
        const circle = document.createElement('div');
        circle.className = 'status-circle-node unvisited';
        circle.id = `palette-node-circle-${q.id}`;
        circle.innerText = q.id;
        circle.addEventListener('click', () => {
            ExamState.activeQuestionIndex = idx;
            renderWorkspaceQuestionItem();
        });
        matrixGrid.appendChild(circle);
    });
}

function updateTelemetryCirclesUI() {
    ExamState.questionsData.forEach(q => {
        const el = document.getElementById(`palette-node-circle-${q.id}`);
        if (el) el.className = `status-circle-node ${ExamState.questionStatuses[q.id]}`;
    });
}

function bootTimerInstrumentation() {
    const digitalHUD = document.getElementById('clock-digital-hud');
    const fillRing = document.getElementById('timer-ring-fill');
    const durationTotal = ExamState.timerSecondsLeft;

    const timerInterval = setInterval(() => {
        if (ExamState.timerSecondsLeft <= 0) {
            clearInterval(timerInterval);
            alert("⏰ Simulation Complete. Automatically locking tracking logs.");
            return;
        }
        ExamState.timerSecondsLeft--;

        const hrs = Math.floor(ExamState.timerSecondsLeft / 3600);
        const mins = Math.floor((ExamState.timerSecondsLeft % 3600) / 60);
        const secs = ExamState.timerSecondsLeft % 60;
        digitalHUD.innerText = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

        const pct = (ExamState.timerSecondsLeft / durationTotal) * 100;
        fillRing.setAttribute('stroke-dasharray', `${pct}, 100`);
    }, 1000);
}

function setupSwipeGestures() {
    const surface = document.getElementById('swipe-surface-target');
    let startX = 0;
    surface.addEventListener('touchstart', (e) => startX = e.changedTouches[0].screenX, {passive: true});
    surface.addEventListener('touchend', (e) => {
        let endX = e.changedTouches[0].screenX;
        if (startX - endX > 60) saveAndNavigateNextSequence(1);  
        if (endX - startX > 60) saveAndNavigateNextSequence(-1); 
    }, {passive: true});
}

