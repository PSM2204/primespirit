import { initializeTestExecutionEngine } from './modules/cockpitEngine.js';

initializeTestExecutionEngine();

const interactiveOrbitNodes = document.querySelectorAll('.orbit-node');

interactiveOrbitNodes.forEach(node => {
    const triggerExamSimulation = (e) => {
        e.preventDefault();
        const selectedTargetStream = node.getAttribute('data-ecosystem');
        
        if (selectedTargetStream) {
            swapViewportToSimulationCockpitView();
            window.dispatchEvent(new CustomEvent('startSimulation', {
                detail: { stream: selectedTargetStream }
            }));
        }
    };

    node.addEventListener('click', triggerExamSimulation);
    node.addEventListener('touchstart', triggerExamSimulation, { passive: false });
});

function swapViewportToSimulationCockpitView() {
    const mainViewBox = document.getElementById('app-view-viewport');
    mainViewBox.innerHTML = `
        <div id="screen-cockpit-simulation">
            <header class="cockpit-bar" style="background: rgba(10,15,30,0.7); backdrop-filter:blur(20px); border-bottom:1px solid var(--border-glass); border-radius:12px;">
                <div style="font-weight:900; font-size:0.8rem; letter-spacing: 0.1em; color:rgba(255,255,255,0.8);">
                    <i class="fas fa-shield-alt" style="color:var(--primary-neon); margin-right:6px;"></i> SECURE NODE ACTIVE
                </div>
                <div class="instrumentation-timer-block">
                    <div class="timer-numerical-display" id="clock-digital-hud">00:00:00</div>
                </div>
                <button id="btn-cockpit-submit" style="background:rgba(255,255,255,0.03); border:1px solid var(--border-glass); color:#fff; font-weight:800; font-size:0.7rem; padding:8px 16px; border-radius:20px; cursor:pointer;">SUBMIT CORE TEST</button>
            </header>

            <div class="cockpit-workstation-grid">
                <main class="question-workspace glass-panel" style="background: rgba(10,15,30,0.2); border:1px solid var(--border-glass); border-radius:16px; flex-direction:column; align-items:stretch;">
                    <div id="hud-question-index-number" style="font-size:0.75rem; font-family:monospace; color:var(--primary-neon); font-weight:800;">QUESTION --</div>
                    <div id="hud-question-render-viewport" style="font-size:1.05rem; font-weight:500; color:#fff; line-height:1.5; margin-top:10px;">Loading exam parameter matrices...</div>
                    <div class="options-matrix-grid" id="hud-options-render-viewport" style="margin-top:25px;"></div>
                    <div class="cockpit-control-toolbar-row" style="margin-top:auto; border-top:1px solid var(--border-glass); padding-top:15px;">
                        <div class="left-action-cluster">
                            <button id="btn-action-prev" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); color:#A0AEC0; padding:10px 18px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.75rem;">PREVIOUS</button>
                            <button id="btn-action-review" style="background:rgba(168,85,247,0.1); border:1px solid var(--status-review); color:var(--status-review); padding:10px 18px; border-radius:8px; font-weight:700; cursor:pointer; font-size:0.75rem;">MARK REVIEW</button>
                            <button id="btn-action-clear" style="background:transparent; border:none; color:#718096; padding:10px 12px; font-weight:600; cursor:pointer; font-size:0.75rem;">CLEAR</button>
                        </div>
                        <button id="btn-action-next" style="background:var(--primary-neon); color:#000; padding:10px 24px; border-radius:8px; font-weight:800; cursor:pointer; border:none;">SAVE & NEXT <i class="fas fa-chevron-right"></i></button>
                    </div>
                </main>
                <aside class="telemetry-palette-panel glass-panel" style="background: rgba(10,15,30,0.4); border:1px solid var(--border-glass); border-radius:16px; flex-direction:column; align-items:stretch;">
                    <div style="font-size:0.75rem; font-weight:800; color:#fff; border-bottom:1px solid var(--border-glass); padding-bottom:8px;">TEST TELEMETRY PALETTE</div>
                    <div class="circles-status-matrix" id="hud-palette-circles-grid"></div>
                </aside>
            </div>
        </div>
    `;
}
