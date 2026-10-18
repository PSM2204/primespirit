// ==========================================
// ANTI-CHEATING & SECURITY PROTOCOLS
// ==========================================

import { ExamState } from './state.js';

let isTestPaused = false;
let debuggerInterval = null;

// Toggle pause state (called from cockpitEngine.js)
export function setTestPauseState(paused) {
    isTestPaused = paused;
    if (paused) {
        stopDebuggerTrap();
    } else {
        startDebuggerTrap();
    }
}

export function enforceAntiCheatingProtocols() {
    
    // 1. Disable Right-Click
    document.addEventListener('contextmenu', (e) => {
        if (!isTestPaused) {
            e.preventDefault();
            showWarningToast("⚠️ Right-click is disabled during active simulation.");
        }
    });

    // 2. Disable Copy, Cut, and Paste
    ['copy', 'cut', 'paste'].forEach(event => {
        document.addEventListener(event, (e) => {
            if (!isTestPaused) {
                e.preventDefault();
                showWarningToast("️ Clipboard actions are restricted.");
            }
        });
    });

    // 3. Disable Developer Tools Shortcuts
    document.addEventListener('keydown', (e) => {
        if (isTestPaused) return; // Allow shortcuts if test is paused
        
        const isDevTools = 
            e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'j')) ||
            ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'S' || e.key === 's'));
            
        if (isDevTools) {
            e.preventDefault();
            showWarningToast("🚨 Developer tools access is strictly prohibited.");
            return false;
        }
    });

    // 4. Tab Switch / Window Minimize Detection
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && !isTestPaused) {
            ExamState.warnings = (ExamState.warnings || 0) + 1;
            const remaining = 3 - ExamState.warnings;
            
            if (remaining > 0) {
                showWarningToast(`⚠️ TAB SWITCH DETECTED! Warning ${ExamState.warnings}/3. ${remaining} remaining.`);
            } else {
                showWarningToast("🚨 SECURITY BREACH: Maximum warnings exceeded. Auto-submitting test!");
                // Dispatch event to cockpitEngine to handle submission safely
                window.dispatchEvent(new CustomEvent('forceSubmitTest'));
            }
        }
    });

    // 5. Network Status Monitoring
    window.addEventListener('offline', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) { 
            syncPill.innerText = "⚠️ OFFLINE MODE: LOCAL CACHE ACTIVE"; 
            syncPill.style.color = "#FF4D4D"; 
        }
    });

    window.addEventListener('online', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) { 
            syncPill.innerText = "🟢 SECURE NODE SYNC ACTIVE"; 
            syncPill.style.color = "var(--accent-glow)"; 
        }
    });

    // Initialize the debugger trap on load
    startDebuggerTrap();
}

// ️‍♂️ HELPER: The Debugger Trap (Freezes browser if DevTools is open)
function startDebuggerTrap() {
    if (debuggerInterval) return;
    debuggerInterval = setInterval(() => {
        // This will pause execution indefinitely if the DevTools console is open
        // eslint-disable-next-line no-debugger
        debugger; 
    }, 1000);
}

function stopDebuggerTrap() {
    if (debuggerInterval) {
        clearInterval(debuggerInterval);
        debuggerInterval = null;
    }
}

// 🎨 HELPER: Smooth Warning Toast
function showWarningToast(msg) {
    // Prevent spamming multiple toasts at once
    if (document.querySelector('.warning-toast')) return;

    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    
    // Smooth fade out
    setTimeout(() => { 
        toast.style.opacity = '0'; 
        toast.style.transform = 'translateX(-50%) translateY(-20px)';
        setTimeout(() => toast.remove(), 300); 
    }, 3000);
}
