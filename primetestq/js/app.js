import { PrimeAuth, PrimeDB } from './auth.js';
import { initializeOrbitEngine } from './dynamicHub.js';
import { initializeTestExecutionEngine } from './cockpitEngine.js';
import { enforceAntiCheatingProtocols } from './antiCheating.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize local database and security protocols
    await PrimeDB.init();
    enforceAntiCheatingProtocols();
    
    // Initialize UI engines
    initializeTestExecutionEngine();
    initializeOrbitEngine();
    
    // Setup Auth and Admin UI listeners
    initAuthUI();
    initAdminUI();
    
    // Route user based on login status
    checkSessionAndRoute();
});

// ==========================================
// AUTHENTICATION UI LOGIC
// ==========================================
function initAuthUI() {
    // Toggle between Login and Register views
    document.getElementById('switch-to-register')?.addEventListener('click', () => {
        document.getElementById('auth-login-view').classList.add('hidden');
        document.getElementById('auth-register-view').classList.remove('hidden');
        document.getElementById('auth-msg').classList.add('hidden');
    });
    
    document.getElementById('switch-to-login')?.addEventListener('click', () => {
        document.getElementById('auth-register-view').classList.add('hidden');
        document.getElementById('auth-login-view').classList.remove('hidden');
        document.getElementById('auth-msg').classList.add('hidden');
    });

    // Handle Login
    document.getElementById('btn-auth-login')?.addEventListener('click', () => {
        const email = document.getElementById('auth-email').value.trim();
        const pass = document.getElementById('auth-password').value;
        
        if (!email || !pass) return showAuthMsg("⚠️ Please enter email and password.");
        
        const res = PrimeAuth.login(email, pass);
        if (res.success) {
            document.getElementById('auth-gateway').classList.add('hidden');
            if (res.user.role === 'admin') openAdminPanel();
            else openTestQInterface(res.user);
        } else { 
            showAuthMsg(res.msg); 
        }
    });

    // Handle Registration
    document.getElementById('btn-auth-register')?.addEventListener('click', () => {
        const name = document.getElementById('reg-name').value.trim();
        const cls = document.getElementById('reg-class').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const pass = document.getElementById('reg-password').value;
        
        if (!name || !cls || !email || !pass) {
            return showAuthMsg("⚠️ All fields are mandatory.");
        }
        
        const res = PrimeAuth.register(name, cls, email, pass);
        if (res.success) {
            document.getElementById('auth-gateway').classList.add('hidden');
            openTestQInterface(res.user);
        } else { 
            showAuthMsg(res.msg); 
        }
    });
}

// ==========================================
// ADMIN PANEL UI LOGIC
// ==========================================
function initAdminUI() {
    // Handle Admin Logout
    document.getElementById('btn-admin-logout')?.addEventListener('click', () => {
        PrimeAuth.logout();
        location.reload();
    });

    // Handle Question Upload (Supports both JSON and CSV)
    document.getElementById('btn-upload-json')?.addEventListener('click', async () => {
        const fileInput = document.getElementById('admin-json-upload');
        const examId = document.getElementById('admin-exam-select').value;
        const file = fileInput.files[0];
        
        if (!file) return alert("⚠️ Please select a file first!");

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                let questions = [];
                const fileName = file.name.toLowerCase();
                
                // Detect file type and parse accordingly
                if (fileName.endsWith('.csv')) {
                    questions = PrimeDB.parseCSV(e.target.result);
                } else if (fileName.endsWith('.json')) {
                    questions = JSON.parse(e.target.result);
                } else {
                    return alert("️ Please upload a .JSON or .CSV file");
                }
                
                if (!Array.isArray(questions) || questions.length === 0) {
                    return alert("⚠️ File is empty or invalid format");
                }
                
                await PrimeDB.saveQuestions(examId, questions);
                alert(`✅ Successfully injected ${questions.length} questions into ${examId.toUpperCase()}!`);
                fileInput.value = ''; // Clear input
                
            } catch (err) { 
                console.error(err);
                alert("⚠️ Error parsing file: " + err.message); 
            }
        };
        reader.readAsText(file);
    });
}

// ==========================================
// ROUTING & HELPER FUNCTIONS
// ==========================================
function showAuthMsg(msg) {
    const el = document.getElementById('auth-msg');
    if (el) { 
        el.innerText = msg; 
        el.classList.remove('hidden'); 
        setTimeout(() => el.classList.add('hidden'), 4000); 
    }
}

function checkSessionAndRoute() {
    const session = PrimeAuth.getSession();
    if (session) {
        if (session.role === 'admin') openAdminPanel();
        else openTestQInterface(session);
    } else { 
        openAuthGate(); 
    }
}

function openAuthGate() { 
    document.getElementById('auth-gateway').classList.remove('hidden'); 
}

function openTestQInterface(user) {
    document.getElementById('screen-home-hub').classList.remove('hidden');
    const badge = document.getElementById('user-profile-badge');
    if (badge && user) badge.innerText = `MENTEE: ${user.name.toUpperCase()}`;
}

function openAdminPanel() {
    document.getElementById('admin-cockpit').classList.remove('hidden');
    const users = PrimeAuth.getUsers().filter(u => u.role === 'student');
    const listEl = document.getElementById('admin-student-list');
    
    if (listEl) {
        listEl.innerHTML = '';
        if (users.length === 0) {
            listEl.innerHTML = '<div class="admin-item" style="color:#A0AEC0;">No students registered yet.</div>';
        } else {
            users.forEach(u => {
                listEl.innerHTML += `
                    <div class="admin-item">
                        <div><strong>${u.name}</strong> <span style="color:var(--primary-neon)">(${u.classLevel})</span></div>
                        <div style="font-size:0.7rem; color:#A0AEC0;">${u.email}</div>
                    </div>
                `;
            });
        }
    }
}
