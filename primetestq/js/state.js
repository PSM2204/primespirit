// ==========================================
// EXAM STATE MANAGEMENT
// ==========================================

export const ExamState = {
    stream: '',
    activeQuestionIndex: 0,
    timerSecondsLeft: 10800,
    totalQuestions: 0,
    questionsData: [],
    userResponses: {}, // Format: { qId: { type: 'MCQ'|'Numerical', value: index|string } }
    questionStatuses: {}, // Format: { qId: 'unvisited' | 'unanswered' | 'answered' | 'review' }
    posMark: 4,
    negMark: 1,
    warnings: 0,
    isRealDataLoaded: false,
    testResults: null // <-- Stores final score, stats, and subject breakdown
};

// Apply specific exam rules (time, marks) based on the selected track
function applyExamBlueprint(track) {
    ExamState.posMark = 4; 
    ExamState.negMark = 1;
    
    if (track.match(/class(6|7|8|9|10)/)) ExamState.timerSecondsLeft = 7200; 
    else if (track.match(/class(11|12)/)) ExamState.timerSecondsLeft = 3600; 
    else if (track.includes('neet')) ExamState.timerSecondsLeft = 12000; 
    else if (track.includes('jee')) ExamState.timerSecondsLeft = 10800; 
    else if (track.includes('iat') || track.includes('nest')) ExamState.timerSecondsLeft = 10800;
    else if (track.includes('cuet')) { 
        ExamState.timerSecondsLeft = 2700; 
        ExamState.posMark = 5; 
    }
    
    if (track.includes('nest')) ExamState.posMark = 3;
}

// Load real questions from Admin Upload or GitHub JSON
export function loadRealQuestions(jsonData, stream) {
    applyExamBlueprint(stream);
    ExamState.stream = stream;
    ExamState.questionsData = jsonData;
    ExamState.totalQuestions = jsonData.length;
    ExamState.isRealDataLoaded = true;
    ExamState.activeQuestionIndex = 0;
    ExamState.userResponses = {};
    ExamState.questionStatuses = {};
    ExamState.warnings = 0;
    ExamState.testResults = null; // Reset previous results
    
    jsonData.forEach(q => { 
        ExamState.questionStatuses[q.id] = 'unvisited'; 
    });
    
    return ExamState.questionsData;
}

// Generate mock data if no real JSON is found
export function generateMockDataset(stream) {
    applyExamBlueprint(stream);
    ExamState.stream = stream;
    ExamState.isRealDataLoaded = false;
    ExamState.warnings = 0;
    ExamState.testResults = null;
    
    const dataset = [];
    const mockTotal = stream.includes('jee') ? 30 : 20;
    
    for (let i = 1; i <= mockTotal; i++) {
        dataset.push({
            id: `mock_${i}`,
            type: "MCQ",
            subject: stream.includes('jee') ? (i <= 10 ? "PHYSICS" : (i <= 20 ? "CHEMISTRY" : "MATHEMATICS")) : "GENERAL",
            chapter: "Mock Chapter",
            question: `[MOCK DATA] This is a placeholder question ${i} for ${stream.toUpperCase()}. Please upload a real JSON file via the Admin Cockpit or GitHub.`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswerIndex: 0,
            marks: ExamState.posMark,
            negativeMarks: ExamState.negMark
        });
        ExamState.questionStatuses[`mock_${i}`] = 'unvisited';
    }

    ExamState.totalQuestions = dataset.length;
    ExamState.questionsData = dataset;
    return dataset;
}

// Helper to get the currently active question
export function getCurrentQuestion() {
    return ExamState.questionsData.length > 0 ? ExamState.questionsData[ExamState.activeQuestionIndex] : null;
}

// Helper to update the palette status
export function updateQuestionStatus(questionId, status) {
    if (['unvisited', 'unanswered', 'answered', 'review'].includes(status)) {
        ExamState.questionStatuses[questionId] = status;
    }
}
