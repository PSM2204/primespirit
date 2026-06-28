import { ExamState } from './state.js';
import { executeFinalSubmissionSequence } from './cockpitEngine.js';

export function enforceAntiCheatingProtocols() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'j')) ||
            ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'S' || e.key === 's'))) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            ExamState.warnings = (ExamState.warnings || 0) + 1;
            showWarningToast(`⚠️ Tab Switch Detected (${ExamState.warnings}/3)`);
            
            if (ExamState.warnings >= 3) {
                showWarningToast("🚨 SECURITY BREACH: Auto-submitting test due to multiple violations!");
                setTimeout(() => executeFinalSubmissionSequence(), 1500);
            }
        }
    });

    window.addEventListener('offline', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) { syncPill.innerText = "⚠️ OFFLINE MODE COMPILING"; syncPill.style.color = "#FF4D4D"; }
    });

    window.addEventListener('online', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) { syncPill.innerText = "🔄 SECURE NODE SYNC ACTIVE"; syncPill.style.color = "var(--accent-glow)"; }
    });
}

function showWarningToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'warning-toast';
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3000);
}
