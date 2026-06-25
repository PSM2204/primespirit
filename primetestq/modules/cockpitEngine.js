import { ExamState, generateMockDataset } from './state.js';

export function initializeTestExecutionEngine() {
    window.addEventListener('startSimulation', (e) => {
        ExamState.stream = e.detail.stream;
        ExamState.questionsData = generateMockDataset(e.detail.stream);
        ExamState.activeQuestionIndex = 0;
        ExamState.userResponses = {};
        
        bootTimerInstrumentation();
        buildTelemetryPaletteHUD();
        renderWorkspaceQuestionItem();
    });

    document.addEventListener('click', (e) => {
        if (e.target.id === 'btn-action-next') saveAndNavigate(1);
        if (e.target.id === 'btn-action-prev') saveAndNavigate(-1);
        if (e.target.id === 'btn-action-review') markQuestionForReviewMetric();
        if (e.target.id === 'btn-action-clear') clearSelectedResponseMetric();
        if (e.target.id === 'btn-cockpit-submit') {
            if (confirm("Are you sure you want to finalize your tracking logs and submit this test?")) {
                executeFinalSubmissionSequence();
            }
        }
    });
}

function renderWorkspaceQuestionItem() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    if (!currentQ) return;

    if (ExamState.questionStatuses[currentQ.id] === 'unvisited') {
        ExamState.questionStatuses[currentQ.id] = 'unanswered';
    }

    document.getElementById('hud-question-index-number').innerText = `Q. ${currentQ.id} // SUBJECT: ${currentQ.subject}`;
    document.getElementById('hud-question-render-viewport').innerText = currentQ.text;

    const optionsBox = document.getElementById('hud-options-render-viewport');
    optionsBox.innerHTML = '';

    currentQ.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'option-node-item';
        if (ExamState.userResponses[currentQ.id] === idx) item.classList.add('selected');
        
        item.innerHTML = `<span style="margin-right:12px; color:var(--primary-neon); font-weight:800;">${String.fromCharCode(65+idx)}.</span> ${opt}`;
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

function saveAndNavigate(direction) {
    let nextIdx = ExamState.activeQuestionIndex + direction;
    if (nextIdx >= 0 && nextIdx < ExamState.totalQuestions) {
        ExamState.activeQuestionIndex = nextIdx;
        renderWorkspaceQuestionItem();
    }
}

function markQuestionForReviewMetric() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    ExamState.questionStatuses[currentQ.id] = 'review';
    saveAndNavigate(1);
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

let clockIntervalId = null;
function bootTimerInstrumentation() {
    const digitalHUD = document.getElementById('clock-digital-hud');
    if(clockIntervalId) clearInterval(clockIntervalId);

    clockIntervalId = setInterval(() => {
        if (ExamState.timerSecondsLeft <= 0) {
            clearInterval(clockIntervalId);
            executeFinalSubmissionSequence();
            return;
        }
        ExamState.timerSecondsLeft--;

        const hrs = Math.floor(ExamState.timerSecondsLeft / 3600);
        const mins = Math.floor((ExamState.timerSecondsLeft % 3600) / 60);
        const secs = ExamState.timerSecondsLeft % 60;
        if(digitalHUD) digitalHUD.innerText = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }, 1000);
}

export function executeFinalSubmissionSequence() {
    clearInterval(clockIntervalId);
    let totalCorrect = 0, totalWrong = 0, totalUnanswered = 0;

    ExamState.questionsData.forEach(q => {
        const studentAns = ExamState.userResponses[q.id];
        if (studentAns === undefined) totalUnanswered++;
        else if (studentAns === q.correct) totalCorrect++;
        else totalWrong++;
    });

    const finalScore = (totalCorrect * ExamState.posMark) - (totalWrong * ExamState.negMark);
    const maximumPossibleScore = ExamState.totalQuestions * ExamState.posMark;

    document.getElementById('app-view-viewport').innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; text-align: center;">
            <div class="glass-panel" style="padding: 40px; max-width: 550px; width: 100%; background:rgba(7,11,22,0.9); flex-direction: column;">
                <h2 style="font-size: 1.8rem; font-weight: 900; margin-bottom: 5px;">Test Submitted</h2>
                <p style="color: #A0AEC0; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 20px;">Stream: ${ExamState.stream.toUpperCase()}</p>
                <div style="font-size: 3.5rem; font-weight: 900; color: var(--accent-glow); margin-bottom: 20px;">${finalScore} <span style="font-size: 1.2rem; color: #4A5568;">/ ${maximumPossibleScore}</span></div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%; margin-bottom: 25px;">
                    <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.65rem; color: #A0AEC0;">CORRECT</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #00FF99;">${totalCorrect}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.65rem; color: #A0AEC0;">INCORRECT</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #FF4D4D;">${totalWrong}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.02); padding: 10px; border-radius: 8px;">
                        <div style="font-size: 0.65rem; color: #A0AEC0;">SKIPPED</div>
                        <div style="font-size: 1.1rem; font-weight: 800; color: #718096;">${totalUnanswered}</div>
                    </div>
                </div>
                <button onclick="window.location.reload()" style="width: 100%; padding:12px; border-radius:8px; color:#fff; font-weight:700; background: rgba(255,255,255,0.05); border:1px solid var(--border-glass); cursor:pointer;">RETURN TO ATOMIC MESH</button>
            </div>
        </div>
    `;
}
