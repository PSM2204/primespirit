import { initializeTestExecutionEngine } from './modules/cockpitEngine.js';

// 1. Initialize the engine immediately (No DOMContentLoaded delay trap)
initializeTestExecutionEngine();

// 2. Bind the mobile and desktop click events directly
const interactiveOrbitNodes = document.querySelectorAll('.orbit-node');

interactiveOrbitNodes.forEach(node => {
    
    // Create a bulletproof trigger function
    const triggerExamSimulation = (e) => {
        e.preventDefault(); // Stops mobile devices from double-tapping
        const selectedTargetStream = node.getAttribute('data-ecosystem');
        
        if (selectedTargetStream) {
            swapViewportToSimulationCockpitView();
            window.dispatchEvent(new CustomEvent('startSimulation', {
                detail: { stream: selectedTargetStream }
            }));
        }
    };

    // Listen for both mouse clicks AND mobile screen taps instantly
    node.addEventListener('click', triggerExamSimulation);
    node.addEventListener('touchstart', triggerExamSimulation, { passive: false });
});

// 3. Viewport Swapper Engine
function swapViewportToSimulationCockpitView() {
    const mainViewBox = document.getElementById('app-view-viewport');
    mainViewBox.innerHTML = `
        <div id="screen-cockpit-simulation">
            <header class="cockpit-bar" style="background: rgba(13,20,38,0.6); backdrop-filter:blur(20px); border-bottom:1px solid var(--border-glass); border-radius:16px;">
                <div style="font-weight:900; font-size:0.85rem; letter-spacing:0.15em; color:rgba(255,255,255,0.8);">
                    <i class="fas fa-shield-alt" style="color:var(--primary-neon); margin-right:8px;"></i> SECURE NODE SYNC ACTIVE
                </div>
                <div class="instrumentation-timer-block">
                    <svg class="countdown-ring-svg">
                        <circle class="ring-bg" cx="14" cy="14" r="12"/>
                        <circle class="ring-fill-progress" id="timer-ring-fill" cx="14" cy="14" r="12" stroke-dasharray="100, 100"/>
                    </svg>
                    <div class="timer-numerical-display" id="clock-digital-hud">00:00:00</div>
                </div>
                <button id="btn-cockpit-submit" style="background:var(--card-glass); border:1px solid var(--border-glass); color:#fff; font-weight:800; font-size:0.75rem; letter-spacing:0.1em; padding:10px 20px; border-radius:30px; cursor:pointer;">SUBMIT CORE TEST</button>
            </header>

            <div class="cockpit-workstation-grid">
                <main class="question-workspace glass-panel" style="background: rgba(13,20,38,0.2); border:1px solid var(--border-glass); border-radius:20px;">
                    <div id="hud-question-index-number" style="font-size:0.8rem; font-family:monospace; color:var(--primary-neon); font-weight:800; letter-spacing:0.1em;">QUESTION --</div>
                    <div id="hud-question-render-viewport" style="font-size:1.15rem; font-weight:500; color:#fff; line-height:1.6; margin-top:10px;">Loading simulation parameter matrices...</div>
                    
                    <div class="options-matrix-grid" id="hud-options-render-viewport" style="margin-top:30px;"></div>

                    <div class="cockpit-control-toolbar-row" style="margin-top:40px; border-top:1px solid var(--border-glass); padding-top:25px;">
                        <div class="left-action-cluster">
                            <button id="btn-action-prev" style="background:rgba(255,255,255,0.02); border:1px solid var(--border-glass); color:#A0AEC0; padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer;"><i class="fas fa-chevron-left"></i> PREVIOUS</button>
                            <button id="btn-action-review" style="background:rgba(138,43,226,0.1); border:1px solid var(--status-review); color:var(--status-review); padding:12px 24px; border-radius:12px; font-weight:700; cursor:pointer;"><i class="fas fa-bookmark"></i> MARK REVIEW</button>
                            <button id="btn-action-clear" style="background:transparent; border:1px solid transparent; color:#718096; padding:12px 24px; font-weight:600; cursor:pointer;"><i class="fas fa-eraser"></i> CLEAR Response</button>
                        </div>
                        <button id="btn-action-next" style="background:var(--primary-neon); color:#000; padding:12px 32px; border-radius:12px; font-weight:800; cursor:pointer; border:none; box-shadow:0 4px 15px rgba(0,198,255,0.3);">SAVE & NEXT <i class="fas fa-chevron-right"></i></button>
                    </div>
                </main>

                <aside class="telemetry-palette-panel glass-panel" style="background: rgba(13,20,38,0.4); border:1px solid var(--border-glass); border-radius:20px;">
                    <div style="font-size:0.8rem; font-weight:800; letter-spacing:0.1em; color:#fff; text-transform:uppercase; border-bottom:1px solid var(--border-glass); padding-bottom:12px;">MISSION PALETTE STATUS</div>
                    <div class="circles-status-matrix" id="hud-palette-circles-grid"></div>
                </aside>
            </div>
        </div>
    `;
}
