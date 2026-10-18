// ==========================================
// MAIN APPLICATION CONTROLLER
// ==========================================

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
    initAnalyticsUI(); // Initialize the new analytics listeners
    
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
        
        if (!file) return alert("️ Please select a file first!");

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
                    return alert("⚠️ Please upload a .JSON or .CSV file");
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
// ANALYTICS UI LOGIC (CLOUDFLARE D1 INTEGRATION)
// ==========================================
function initAnalyticsUI() {
    const WORKER_URL = 'https://primetestq-api.primespiritmentors.workers.dev';

    document.getElementById('btn-load-analytics')?.addEventListener('click', async () => {
        const analyticsSection = document.getElementById('analytics-section');
        analyticsSection.classList.remove('hidden');
        
        const filter = document.getElementById('analytics-exam-filter').value;
        const url = filter ? `${WORKER_URL}/submissions?exam=${encodeURIComponent(filter)}` : `${WORKER_URL}/submissions`;

        const container = document.getElementById('analytics-table-container');
        container.innerHTML = '<p style="color: var(--primary-neon); text-align: center; padding: 20px;">Loading data from Cloudflare...</p>';

        try {
            const response = await fetch(url);
            const result = await response.json();
            
            if (result.success) {
                renderAnalyticsTable(result.data);
            } else {
                container.innerHTML = '<p style="color: #FF4D4D; text-align: center; padding: 20px;">Failed to load analytics.</p>';
            }
        } catch (error) {
            console.error('Error fetching analytics:', error);
            container.innerHTML = '<p style="color: #FF4D4D; text-align: center; padding: 20px;">Network error. Check Worker URL.</p>';
        }
    });

    document.getElementById('analytics-exam-filter')?.addEventListener('change', () => {
        document.getElementById('btn-load-analytics').click();
    });
}

function renderAnalyticsTable(data) {
    const container = document.getElementById('analytics-table-container');
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="color: #A0AEC0; text-align: center; padding: 20px;">No submissions found yet.</p>';
        return;
    }

    let html = `
        <table class="analytics-table">
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Exam</th>
                    <th>Score</th>
                    <th>Accuracy</th>
                    <th>C / W / Skip</th>
                    <th>Submitted</th>
                </tr>
            </thead>
            <tbody>
    `;

    data.forEach(row => {
        const date = new Date(row.submitted_at).toLocaleString('en-IN', { 
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
        });
        const skipped = row.attempted - row.correct - row.incorrect;
        
        html += `
            <tr>
                <td><strong>${row.student_name}</strong></td>
                <td style="font-size: 0.75rem;">${row.student_email}</td>
                <td><span class="exam-badge">${row.exam_name}</span></td>
                <td class="score-cell">${row.total_score} / ${row.max_score}</td>
                <td class="accuracy-cell">${row.accuracy}</td>
                <td style="font-size: 0.75rem;">
                    <span style="color: var(--status-answered);">✓${row.correct}</span> / 
                    <span style="color: var(--status-unanswered);">${row.incorrect}</span> / 
                    <span style="color: #7F8C8D;">${skipped < 0 ? 0 : skipped}</span>
                </td>
                <td style="font-size: 0.75rem; color: #A0AEC0;">${date}</td>
            </tr>
        `;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
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
