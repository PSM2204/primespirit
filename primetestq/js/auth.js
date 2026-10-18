// ==========================================
// AUTHENTICATION & DATABASE MANAGEMENT
// ==========================================

export const PrimeAuth = {
    DB_KEY_USERS: 'ptq_secure_users',
    DB_KEY_SESSION: 'ptq_active_session',
    
    // Initialize default admin account if none exists
    initMentorNode() {
        const users = this.getUsers();
        if (!users.find(u => u.role === 'admin')) {
            users.push({
                name: "Abhinav Kashyap",
                classLevel: "Mentor",
                email: "primespiritmentors@gmail.com",
                password: "Abhin@v2204",
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
        if (users.find(u => u.email === email)) return { success: false, msg: "⚠️ Email already exists." };
        
        const newUser = { name, classLevel, email, password, role: 'student', joined: Date.now() };
        users.push(newUser);
        localStorage.setItem(this.DB_KEY_USERS, JSON.stringify(users));
        return { success: true, user: this.login(email, password).user };
    },
    
    login(email, password) {
        const user = this.getUsers().find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(this.DB_KEY_SESSION, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, msg: "️ Invalid credentials." };
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
    
    // Save questions to IndexedDB with strict normalization
    async saveQuestions(examId, data) {
        const normalizedData = data.map((q, index) => ({
            id: q.id || `q_${index + 1}`,
            type: q.type || (q.options && q.options.length > 0 ? 'MCQ' : 'Numerical'),
            subject: q.subject || 'General',
            chapter: q.chapter || 'General',
            question: q.question || q.text || 'Question text missing',
            imageUrl: q.imageUrl || null, // Preserve ImgBB/Cloudinary links
            options: q.options || [],
            correctAnswerIndex: q.correctAnswerIndex !== undefined ? q.correctAnswerIndex : (parseInt(q.correct) || 0),
            marks: q.marks || 4,
            negativeMarks: q.negativeMarks !== undefined ? q.negativeMarks : 1
        }));

        const tx = this.db.transaction('questions', 'readwrite');
        tx.objectStore('questions').put({ examId, data: normalizedData, updatedAt: Date.now() });
    },
    
    async getQuestions(examId) {
        return new Promise((resolve, reject) => {
            const tx = this.db.transaction('questions', 'readonly');
            const request = tx.objectStore('questions').get(examId);
            request.onsuccess = () => resolve(request.result?.data || []);
            request.onerror = () => reject(request.error);
        });
    },
    
    // Parse CSV files uploaded by the mentor
    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const questions = [];
        
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            
            const fields = this.parseCSVLine(line);
            
            // Expected CSV: Subject, Question, OptionA, OptionB, OptionC, OptionD, CorrectIndex(0-3)
            if (fields.length >= 7) {
                questions.push({
                    id: `csv_${questions.length + 1}`,
                    type: "MCQ",
                    subject: fields[0].trim(),
                    chapter: "Imported via CSV",
                    question: fields[1].trim(),
                    imageUrl: null, // CSV doesn't easily support images, default to null
                    options: [fields[2].trim(), fields[3].trim(), fields[4].trim(), fields[5].trim()],
                    correctAnswerIndex: parseInt(fields[6].trim()) || 0,
                    marks: 4,
                    negativeMarks: 1
                });
            }
        }
        return questions;
    },
    
    // Helper to handle commas inside quotes in CSV
    parseCSVLine(line) {
        const result = []; 
        let current = ''; 
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { 
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

// Auto-initialize admin node on load
PrimeAuth.initMentorNode();
