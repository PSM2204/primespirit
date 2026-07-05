export const ExamState = {
    stream: '', config: null, activeQuestionIndex: 0, timerSecondsLeft: 5400,
    totalQuestions: 0, questionsData: [], userResponses: {}, questionStatuses: {},
    posMark: 4, negMark: 1, warnings: 0, isPaused: false
};

const EXAM_CONFIG = {
    'class6':  { duration: 90,  total: 50,  marking: [4, 1], subjects: { 'Mathematics': 25, 'Science': 25 } },
    'class7':  { duration: 90,  total: 50,  marking: [4, 1], subjects: { 'Mathematics': 25, 'Science': 25 } },
    'class8':  { duration: 90,  total: 50,  marking: [4, 1], subjects: { 'Mathematics': 25, 'Science': 25 } },
    'class9':  { duration: 90,  total: 50,  marking: [4, 1], subjects: { 'Mathematics': 25, 'Science': 25 } },
    'class10': { duration: 90,  total: 50,  marking: [4, 1], subjects: { 'Mathematics': 25, 'Science': 25 } },
    'class11': { duration: 90,  total: 45,  marking: [4, 1], subjects: { 'Physics': 45 } },
    'class12': { duration: 90,  total: 45,  marking: [4, 1], subjects: { 'Physics': 45 } },
    'neet':    { duration: 180, total: 180, marking: [4, 1], subjects: { 'Physics': 45, 'Chemistry': 45, 'Botany': 45, 'Zoology': 45 } },
    'jee':     { duration: 180, total: 90,  marking: [4, 1], subjects: { 'Physics': 30, 'Chemistry': 30, 'Mathematics': 30 } },
    'iat':     { duration: 180, total: 60,  marking: [4, 1], subjects: { 'Physics': 15, 'Chemistry': 15, 'Mathematics': 15, 'Biology': 15 } },
    'nest':    { duration: 180, total: 80,  marking: [3, 1], subjects: { 'Physics': 20, 'Chemistry': 20, 'Mathematics': 20, 'Biology': 20 } },
    'cuet':    { duration: 180, total: 150, marking: [5, 1], subjects: { 'Physics': 50, 'Chemistry': 50, 'Biology': 50 } }
};

export function loadExamConfig(examId) {
    const track = examId.toLowerCase().trim();
    let config = EXAM_CONFIG['class6']; 
    for (let key in EXAM_CONFIG) {
        if (track.includes(key)) { config = EXAM_CONFIG[key]; break; }
    }
    ExamState.config = config;
    ExamState.stream = examId;
    ExamState.timerSecondsLeft = config.duration * 60;
    ExamState.totalQuestions = config.total;
    ExamState.posMark = config.marking[0];
    ExamState.negMark = config.marking[1];
}

export function generateMockDataset(stream) {
    loadExamConfig(stream);
    const config = ExamState.config;
    const dataset = [];
    let qIndex = 1;

    for (let subject in config.subjects) {
        const count = config.subjects[subject];
        for (let i = 0; i < count; i++) {
            dataset.push({
                id: qIndex, subject: subject,
                text: `[${stream.toUpperCase()} // ${subject} Q.${qIndex}] Sample question text for testing the CBT engine.`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct: Math.floor(Math.random() * 4)
            });
            ExamState.questionStatuses[qIndex] = 'unvisited';
            qIndex++;
        }
    }
    return dataset;
}
