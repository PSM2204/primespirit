export const PrimeAuth = {
    DB_KEY_USERS: 'ptq_secure_users',
    DB_KEY_SESSION: 'ptq_active_session',
    
    initMentorNode() {
        const users = this.getUsers();
        if (!users.find(u => u.role === 'admin')) {
            users.push({
                name: "Abhinav Kashyap",
                classLevel: "Mentor",
                email: "mentor@primespirit.co.in",
                password: "PrimeSpirit2026!",
                role: "admin"
            });
            localStorage.setItem(this.DB_KEY_USERS, JSON.stringify(users));
        }
    },
    
    getUsers() {
        return JSON.parse(localStorage.getItem(this.DB_KEY_USERS) || '[]');
    },
    
    register(name, classLevel, email, password) {
        const users = this.getUsers();
        if (users.find(u => u.email === email)) {
            return { success: false, msg: "⚠️ Email already exists." };
        }
        const newUser = { name, classLevel, email, password, role: 'student', joined: Date.now() };
        users.push(newUser);
        localStorage.setItem(this.DB_KEY_USERS, JSON.stringify(users));
        const loginResult = this.login(email, password);
        return { success: true, user: loginResult.user };
    },
    
    login(email, password) {
        const users = this.getUsers();
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(this.DB_KEY_SESSION, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, msg: "⚠️ Invalid credentials." };
    },
    
    getSession() {
        const session = localStorage.getItem(this.DB_KEY_SESSION);
        return session ? JSON.parse(session) : null;
    },
    
    logout() {
        localStorage.removeItem(this.DB_KEY_SESSION);
    }
};

export const PrimeDB = {
    db: null,
    
    init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('PrimeTestQ_LocalDB', 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('questions')) {
                    db.createObjectStore('questions', { keyPath: 'examId' });
                }
            };
            request.onsuccess = (e) => {
                this.db = e.target.result;
                resolve(this.db);
            };
            request.onerror = (e) => reject(e.target.error);
        });
    },
    
    async saveQuestions(examId, data) {
        const tx = this.db.transaction('questions', 'readwrite');
        tx.objectStore('questions').put({ examId, data, updatedAt: Date.now() });
    },
    
    async getQuestions(examId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('questions', 'readonly');
            const request = tx.objectStore('questions').get(examId);
            request.onsuccess = () => resolve(request.result?.data || []);
            request.onerror = () => reject(request.error);
        });
    },
    
    // NEW: CSV Parser Function
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const questions = [];
        
        // Skip header row (first line)
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            // Handle CSV with proper quote handling
            const fields = this.parseCSVLine(line);
            
            if (fields.length >= 6) {
                questions.push({
                    id: questions.length + 1,
                    subject: fields[0].trim(),
                    text: fields[1].trim(),
                    options: [
                        fields[2].trim(),
                        fields[3].trim(),
                        fields[4].trim(),
                        fields[5].trim()
                    ],
                    correct: parseInt(fields[6]) || 0
                });
            }
        }
        
        return questions;
    },
    
    // Helper: Parse a single CSV line (handles quoted fields)
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current);
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current);
        return result;
    }
};

PrimeAuth.initMentorNode();
