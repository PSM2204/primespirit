import { PrimeAuth, PrimeDB } from './auth.js';
import { initializeOrbitEngine } from './dynamicHub.js';
import { initializeTestExecutionEngine } from './cockpitEngine.js';
import { enforceAntiCheatingProtocols } from './antiCheating.js';

document.addEventListener('DOMContentLoaded', async () => {
    await PrimeDB.init();
    enforceAntiCheatingProtocols();
    initializeTestExecutionEngine();
    initializeOrbitEngine();
    
    initAuthUI();
    initAdminUI();
    checkSessionAndRoute();
});

function initAuthUI() {
    document.getElementById('switch-to-register')?.addEventListener('click', () => {
        document.getElementById('auth-login-view').classList.add('hidden');
        document.getElementById('auth-register-view').classList.remove('hidden');
    });
    document.getElementById('switch-to-login')?.addEventListener('click', () => {
        document.getElementById('auth-register-view').classList.add('hidden');
        document.getElementById('auth-login-view').classList.remove('hidden');
    });

    document.getElementById('btn-auth-login')?.addEventListener('click', () => {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const res = PrimeAuth.login(email, pass);
        if (res.success) {
            document.getElementById('auth-gateway').classList.add('hidden');
            if (res.user.role === 'admin') openAdminPanel();
            else openTestQInterface(res.user);
        } else { showAuthMsg(res.msg); }
    });

    document.getElementById('btn-auth-register')?.addEventListener('click', () => {
        const name = document.getElementById('reg-name').value;
        const cls = document.getElementById('reg-class').value;
        const email = document.getElementById('reg-email').value;
        const pass = document.getElementById('reg-password').value;
        
        if(!name || !cls || !email || !pass) return showAuthMsg("⚠️ All fields are mandatory.");
        
        const res = PrimeAuth.register(name, cls, email, pass);
        if (res.success) {
            document.getElementById('auth-gateway').classList.add('hidden');
            openTestQInterface(res.user);
        } else { showAuthMsg(res.msg); }
    });
}

function initAdminUI() {
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
        PrimeAuth.logout();
        location.reload();
    });

    document.getElementById('btn-upload-json')?.addEventListener('click', async () => {
        const fileInput = document.getElementById('admin-json-upload');
        const examId = document.getElementById('admin-exam-select').value;
        const file = fileInput.files[0];
        
        if (!file) return alert("⚠️ Please select a JSON file first!");

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);
                await PrimeDB.saveQuestions(examId, jsonData);
                alert(`✅ Successfully injected ${jsonData.length} questions into the ${examId} matrix!`);
                fileInput.value = ''; 
            } catch (err) { alert("⚠️ Invalid JSON format. Please check your file."); }
        };
        reader.readAsText(file);
    });
}

function showAuthMsg(msg) {
    const el = document.getElementById('auth-msg');
    if(el) { el.innerText = msg; el.classList.remove('hidden'); setTimeout(() => el.classList.add('hidden'), 3000); }
}

function checkSessionAndRoute() {
    const session = PrimeAuth.getSession();
    if (session) {
        if (session.role === 'admin') openAdminPanel();
        else openTestQInterface(session);
    } else { openAuthGate(); }
}

function openAuthGate() { document.getElementById('auth-gateway').classList.remove('hidden'); }

function openTestQInterface(user) {
    document.getElementById('screen-home-hub').classList.remove('hidden');
    const badge = document.getElementById('user-profile-badge');
    if(badge && user) badge.innerText = `MENTEE: ${user.name.toUpperCase()}`;
}

function openAdminPanel() {
    document.getElementById('admin-cockpit').classList.remove('hidden');
    const users = PrimeAuth.getUsers().filter(u => u.role === 'student');
    const listEl = document.getElementById('admin-student-list');
    if(listEl) {
        listEl.innerHTML = '';
        users.forEach(u => {
            listEl.innerHTML += `<div class="admin-item"><div><strong>${u.name}</strong> <span style="color:var(--primary-neon)">(${u.classLevel})</span></div><div style="font-size:0.7rem; color:#A0AEC0;">${u.email}</div></div>`;
        });
    }
}
