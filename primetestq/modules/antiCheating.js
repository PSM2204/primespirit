import { ExamState } from './state.js';

export function enforceAntiCheatingProtocols() {
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    document.addEventListener('keydown', (e) => {
        if (e.key === 'F12' || 
            ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'j')) ||
            ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 's'))) {
            e.preventDefault();
            return false;
        }
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            alert("🚨 SECURITY ALERT:\n\nNavigation away from the cockpit window has been recorded.");
        }
    });

    window.addEventListener('offline', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) {
            syncPill.innerText = "⚠️ OFFLINE MODE COMPILING";
            syncPill.style.color = "#FF4D4D";
        }
    });

    window.addEventListener('online', () => {
        const syncPill = document.getElementById('network-status-indicator');
        if (syncPill) {
            syncPill.innerText = "🔄 SECURE NODE SYNC ACTIVE";
            syncPill.style.color = "var(--accent-glow)";
        }
    });
}

