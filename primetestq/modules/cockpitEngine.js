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

    document.getElementById('btn-action-next').addEventListener('click', () => saveAndNavigate(1));
    document.getElementById('btn-action-prev').addEventListener('click', () => saveAndNavigate(-1));
    document.getElementById('btn-action-review').addEventListener('click', markQuestionForReviewMetric);
    document.getElementById('btn-action-clear').addEventListener('click', clearSelectedResponseMetric);
    
    document.getElementById('btn-cockpit-submit').addEventListener('click', () => {
        if (confirm("Are you sure you want to finalize your tracking logs and submit this test?")) {
            executeFinalSubmissionSequence();
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
    const fillRing = document.getElementById('timer-ring-fill');
    const durationTotal = ExamState.timerSecondsLeft;

    if(clockIntervalId) clearInterval(clockIntervalId);

    clockIntervalId = setInterval(() => {
        if (ExamState.timerSecondsLeft <= 0) {
            clearInterval(clockIntervalId);
            alert("⏰ TIME EXPIRED! Compiling test scoring matrix parameters...");
            executeFinalSubmissionSequence();
            return;
        }
        ExamState.timerSecondsLeft--;

        const hrs = Math.floor(ExamState.timerSecondsLeft / 3600);
        const mins = Math.floor((ExamState.timerSecondsLeft % 3600) / 60);
        const secs = ExamState.timerSecondsLeft % 60;
        digitalHUD.innerText = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

        const pct = (ExamState.timerSecondsLeft / durationTotal) * 100;
        if(fillRing) fillRing.setAttribute('stroke-dasharray', `${pct}, 100`);
    }, 1000);
}

export function executeFinalSubmissionSequence() {
    clearInterval(clockIntervalId);
    
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalUnanswered = 0;

    ExamState.questionsData.forEach(q => {
        const studentAns = ExamState.userResponses[q.id];
        if (studentAns === undefined) {
            totalUnanswered++;
        } else if (studentAns === q.correct) {
            totalCorrect++;
        } else {
            totalWrong++;
        }
    });

    const finalScore = (totalCorrect * ExamState.posMark) - (totalWrong * ExamState.negMark);
    const maximumPossibleScore = ExamState.totalQuestions * ExamState.posMark;

    const workspaceElement = document.getElementById('app-view-viewport');
    workspaceElement.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; padding: 20px; text-align: center;">
            <div class="glass-panel" style="padding: 50px 40px; max-width: 600px; width: 100%; box-shadow: 0 0 50px rgba(0, 198, 255, 0.15); background:rgba(13,20,38,0.75); border:1px solid rgba(255,255,255,0.08); border-radius:24px;">
                <i class="fas fa-chart-pie" style="font-size: 3.5rem; color: var(--accent-glow); margin-bottom: 20px;"></i>
                <h2 style="font-size: 2.2rem; font-weight: 900; margin-bottom: 10px; color:#fff;">Simulation Compiled</h2>
                <p style="color: #A0AEC0; font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 25px;">Track: ${ExamState.stream.toUpperCase()} Analytics</p>
                
                <div style="font-size: 4rem; font-weight: 900; color: var(--primary-neon); margin-bottom: 5px;">${finalScore} <span style="font-size: 1.5rem; color: #4A5568;">/ ${maximumPossibleScore}</span></div>
                <div style="font-size: 0.75rem; font-family: monospace; color: #718096; margin-bottom: 35px;">MARKING ENGINE CONFIG: (+${ExamState.posMark} / -${ExamState.negMark})</div>

                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; text-align: left; margin-bottom: 40px;">
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px;">
                        <div style="font-size: 0.75rem; color: #A0AEC0;">CORRECT TIER</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #00FF99;">+${totalCorrect * ExamState.posMark}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px;">
                        <div style="font-size: 0.75rem; color: #A0AEC0;">PENALTY WEIGHT</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #FF4D4D;">-${totalWrong * ExamState.negMark}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.05); padding: 15px; border-radius: 12px;">
                        <div style="font-size: 0.75rem; color: #A0AEC0;">SKIPPED</div>
                        <div style="font-size: 1.5rem; font-weight: 800; color: #718096;">${totalUnanswered}</div>
                    </div>
                </div>

                <button onclick="window.location.reload()" style="width: 100%; border:1px solid rgba(255,255,255,0.08); padding:14px; border-radius:12px; color:#fff; cursor:pointer; font-weight:700; background: rgba(255,255,255,0.03); letter-spacing:0.1em;">RETURN TO MAIN ORBIT MESH</button>
            </div>
        </div>
    `;
}
