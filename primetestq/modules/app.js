// Clean State Matrix
const ExamState = {
    stream: '',
    activeQuestionIndex: 0,
    timerSecondsLeft: 10800, 
    totalQuestions: 0,    
    questionsData: [],
    userResponses: {},  
    questionStatuses: {}, 
    posMark: 4,
    negMark: 1
};

// Initialize interactive nodes directly
const interactiveOrbitNodes = document.querySelectorAll('.orbit-node');
interactiveOrbitNodes.forEach(node => {
    const triggerExamSimulation = (e) => {
        e.preventDefault();
        const selectedTargetStream = node.getAttribute('data-ecosystem');
        if (selectedTargetStream) {
            swapViewportToSimulationCockpitView();
            startSimulationEngine(selectedTargetStream);
        }
    };
    node.addEventListener('click', triggerExamSimulation);
    node.addEventListener('touchstart', triggerExamSimulation, { passive: false });
});

function swapViewportToSimulationCockpitView() {
    // Create DOM fragments instead of raw dynamic text evaluation to pass CSP blocks
    const mainViewBox = document.getElementById('app-view-viewport');
    mainViewBox.innerHTML = ''; 

    const containerNode = document.createElement('div');
    containerNode.id = 'screen-cockpit-simulation';

    containerNode.innerHTML = `
        <header class="cockpit-bar" style="background: rgba(10,15,30,0.7); backdrop-filter:blur(20px); border-bottom:1px solid rgba(255,255,255,0.08); border-radius:12px;">
            <div style="font-weight:900; font-size:0.8rem; letter-spacing: 0.1em; color:rgba(255,255,255,0.8);"><i class="fas fa-shield-alt" style="color:#00C6FF; margin-right:6px;"></i> SECURE NODE ACTIVE</div>
            <div class="instrumentation-timer-block"><div class="timer-numerical-display" id="clock-digital-hud">00:00:00</div></div>
            <button id="btn-cockpit-submit" style="background:rgba(15,23,42,0.6); border:1px solid rgba(255,255,255,0.08); color:#fff; font-weight:800; font-size:0.7rem; padding:8px 16px; border-radius:20px; cursor:pointer;">SUBMIT CORE TEST</button>
        </header>
        <div class="cockpit-workstation-grid">
            <main class="question-workspace glass-panel" style="background: rgba(10,15,30,0.2); border:1px solid rgba(255,255,255,0.08); border-radius:16px; flex-direction:column; align-items:stretch;">
                <div id="hud-question-index-number" style="font-size:0.75rem; font-family:monospace; color:#00C6FF; font-weight:800;">QUESTION --</div>
                <div id="hud-question-render-viewport" style="font-size:1.05rem; font-weight:500; color:#fff; line-height:1.5; margin-top:10px;">Loading exam parameters...</div>
                <div class="options-matrix-grid" id="hud-options-render-viewport" style="margin-top:25px;"></div>
                <div class="cockpit-control-toolbar-row" style="margin-top:auto; border-top:1px solid rgba(255,255,255,0.08); padding-top:15px;">
                    <div class="left-action-cluster">
                        <button id="btn-action-prev" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); color:#A0AEC0; padding:10px 18px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.75rem;">PREVIOUS</button>
                        <button id="btn-action-review" style="background:rgba(168,85,247,0.1); border:1px solid #A855F7; color:#A855F7; padding:10px 18px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.75rem;">MARK REVIEW</button>
                        <button id="btn-action-clear" style="background:transparent; border:none; color:#718096; padding:10px 12px; font-weight:600; cursor:pointer; font-size:0.75rem;">CLEAR</button>
                    </div>
                    <button id="btn-action-next" style="background:#00C6FF; color:#000; padding:10px 24px; border-radius:8px; font-weight:800; cursor:pointer; border:none;">SAVE & NEXT <i class="fas fa-chevron-right"></i></button>
                </div>
            </main>
            <aside class="telemetry-palette-panel glass-panel" style="background: rgba(10,15,30,0.4); border:1px solid rgba(255,255,255,0.08); border-radius:16px; flex-direction:column; align-items:stretch;">
                <div style="font-size:0.75rem; font-weight:800; color:#fff; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:8px;">TEST TELEMETRY PALETTE</div>
                <div class="circles-status-matrix" id="hud-palette-circles-grid"></div>
            </aside>
        </div>
    `;
    mainViewBox.appendChild(containerNode);
}

// Global Event Delegate Map
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

function startSimulationEngine(stream) {
    ExamState.stream = stream;
    ExamState.userResponses = {};
    ExamState.activeQuestionIndex = 0;
    
    const track = stream.toLowerCase().trim();
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    if (track.match(/class(6|7|8|9|10)/)) { ExamState.totalQuestions = 100; ExamState.timerSecondsLeft = 7200; }
    else if (track.match(/class(11|12)/)) { ExamState.totalQuestions = 40; ExamState.timerSecondsLeft = 3600; }
    else if (track.includes('neet')) { ExamState.totalQuestions = 180; ExamState.timerSecondsLeft = 12000; }
    else if (track.includes('jee')) { ExamState.totalQuestions = 90; ExamState.timerSecondsLeft = 10800; }
    else if (track.includes('iat')) { ExamState.totalQuestions = 60; ExamState.timerSecondsLeft = 10800; }
    else if (track.includes('nest')) { ExamState.totalQuestions = 80; ExamState.timerSecondsLeft = 10800; ExamState.posMark = 3; }
    else if (track.includes('cuet')) { ExamState.totalQuestions = 50; ExamState.timerSecondsLeft = 2700; ExamState.posMark = 5; }

    const QuestionPool = {
        class6: { math: { text: "Calculate the least common multiple (LCM) of 12, 18, and 24.", opt: ["A) 48", "B) 72", "C) 144", "D) 36"], ans: 1 }, science: { text: "Identify the vitamin resource primarily responsible for preventing Scurvy.", opt: ["A) Vitamin A", "B) Vitamin B1", "C) Vitamin C", "D) Vitamin D"], ans: 2 } },
        class7: { math: { text: "Determine the value of an angle which is exactly double its complement.", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 2 }, science: { text: "Analyze the process that converts copper carbonate into green patches via moisture.", opt: ["A) Neutralization", "B) Galvanization", "C) Corrosion", "D) Crystallization"], ans: 2 } },
        class8: { math: { text: "Solve for sides where a regular polygon possesses exactly 9 distinct diagonals.", opt: ["A) 6 sides", "B) 7 sides", "C) 8 sides", "D) 9 sides"], ans: 0 }, science: { text: "Specify the organism leveraged as the catalyst for yeast fermentation.", opt: ["A) Lactobacillus", "B) Rhizobium", "C) Saccharomyces cerevisiae", "D) Aspergillus"], ans: 2 } },
        class9: { math: { text: "Evaluate the rationalized format expression of 1 / (7 - √6).", opt: ["A) (7 + √6) / 43", "B) (7 - √6) / 43", "C) (7 + √6) / 5", "D) None"], ans: 0 }, science: { text: "A particle moves along a circular path of radius R. Calculate displacement after 1.5 rotations.", opt: ["A) 3πR", "B) 2R", "C) πR", "D) Zero"], ans: 1 } },
        class10: { math: { text: "If one root of the function (k-1)x² + kx + 1 is exactly -3, calculate value of k.", opt: ["A) 4/3", "B) -4/3", "C) 2/3", "D) 5/4"], ans: 0 }, science: { text: "An object is placed 20cm away from a concave mirror of focal length 10cm. Characterize the image.", opt: ["A) Virtual and erect", "B) Real, inverted and same size", "C) Real, inverted and magnified", "D) Real, diminished"], ans: 1 } },
        class11: { physics: { text: "Determine the launch angle where a projectile exhibits maximum horizontal range capabilities.", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 1 } },
        class12: { physics: { text: "Evaluate the capacitance alteration if a dielectric constant K is introduced into a capacitor.", opt: ["A) Drops by 1/K", "B) Scales upward by K multiplier", "C) Potential energy quadruples", "D) Drops completely"], ans: 1 } }
    };

    ExamState.questionsData = [];
    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL COGNITION";
        let questionText = `[${stream.toUpperCase()} EXAM CRITERIA LOGIC INDEX ${i}] Evaluate standard parameters.`;
        let optionsArray = ["Option A", "Option B", "Option C", "Option D"];
        let correctOptionIndex = Math.floor(Math.random() * 4);

        if (track.match(/class(6|7|8|9|10)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            if (i <= 50) {
                subjectLabel = "MATHEMATICS";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].math.text}`;
                optionsArray = QuestionPool[classKey].math.opt;
                correctOptionIndex = QuestionPool[classKey].math.ans;
            } else {
                subjectLabel = "SCIENCE";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].science.text}`;
                optionsArray = QuestionPool[classKey].science.opt;
                correctOptionIndex = QuestionPool[classKey].science.ans;
            }
        } else if (track.match(/class(11|12)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            subjectLabel = "PHYSICS ASSESSMENT";
            questionText = `[Q.${i} // CORE PHYSICS] ${QuestionPool[classKey].physics.text}`;
            optionsArray = QuestionPool[classKey].physics.opt;
            correctOptionIndex = QuestionPool[classKey].physics.ans;
        } else if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS"; else if (i <= 90) subjectLabel = "CHEMISTRY"; else if (i <= 135) subjectLabel = "BOTANY"; else subjectLabel = "ZOOLOGY";
            questionText = `[NEET HIGH-LEVEL ASSESSMENT // ${subjectLabel} Q.${i}] Medical entry standard validation testing parameters.`;
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS"; else if (i <= 60) subjectLabel = "CHEMISTRY"; else subjectLabel = "MATHEMATICS";
            questionText = `[JEE MAIN EVALUATION // ${subjectLabel} Q.${i}] Analytical mechanics diagnostic logic testing parameters alignment.`;
        } else if (track.includes('iat') || track.includes('nest')) {
            if (i <= 15 || (track.includes('nest') && i <= 20)) subjectLabel = "PHYSICS"; else if (i <= 30 || (track.includes('nest') && i <= 40)) subjectLabel = "CHEMISTRY"; else if (i <= 45 || (track.includes('nest') && i <= 60)) subjectLabel = "MATHEMATICS"; else subjectLabel = "BIOLOGY";
            questionText = `[RESEARCH APTITUDE MATRIX // ${subjectLabel} Q.${i}] Conceptual advanced scientific derivatives testing matrix level.`;
        } else if (track.includes('cuet')) {
            subjectLabel = (i <= 25) ? "DOMAIN PHYSICS" : "DOMAIN MATHEMATICS";
            questionText = `[CUET UG ADMISSION // ${subjectLabel} Q.${i}] Central University criteria test question alignment format.`;
        }

        ExamState.questionsData.push({ id: i, subject: subjectLabel, text: questionText, options: optionsArray, correct: correctOptionIndex });
        ExamState.questionStatuses[i] = 'unvisited';
    }

    bootTimerInstrumentation();
    buildTelemetryPaletteHUD();
    renderWorkspaceQuestionItem();
}

function renderWorkspaceQuestionItem() {
    const currentQ = ExamState.questionsData[ExamState.activeQuestionIndex];
    if (!currentQ) return;

    if (ExamState.questionStatuses[currentQ.id] === 'unvisited') ExamState.questionStatuses[currentQ.id] = 'unanswered';

    document.getElementById('hud-question-index-number').innerText = `Q. ${currentQ.id} // SUBJECT: ${currentQ.subject}`;
    document.getElementById('hud-question-render-viewport').innerText = currentQ.text;

    const optionsBox = document.getElementById('hud-options-render-viewport');
    optionsBox.innerHTML = '';
    currentQ.options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'option-node-item';
        if (ExamState.userResponses[currentQ.id] === idx) item.classList.add('selected');
        item.innerHTML = `<span style="margin-right:12px; color:#00C6FF; font-weight:800;">${String.fromCharCode(65+idx)}.</span> ${opt}`;
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
        circle.addEventListener('click', () => { ExamState.activeQuestionIndex = idx; renderWorkspaceQuestionItem(); });
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
        if (ExamState.timerSecondsLeft <= 0) { clearInterval(clockIntervalId); executeFinalSubmissionSequence(); return; }
        ExamState.timerSecondsLeft--;
        const hrs = Math.floor(ExamState.timerSecondsLeft / 3600);
        const mins = Math.floor((ExamState.timerSecondsLeft % 3600) / 60);
        const secs = ExamState.timerSecondsLeft % 60;
        if(digitalHUD) digitalHUD.innerText = `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
    }, 1000);
}

function executeFinalSubmissionSequence() {
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
                <div style="font-size: 3.5rem; font-weight: 900; color: #00FF99; margin-bottom: 20px;">${finalScore} <span style="font-size: 1.2rem; color: #4A5568;">/ ${maximumPossibleScore}</span></div>
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
                <button onclick="window.location.reload()" style="width: 100%; padding:12px; border-radius:8px; color:#fff; font-weight:700; background: rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.08); cursor:pointer;">RETURN TO ATOMIC MESH</button>
            </div>
        </div>
    `;
}
