import { PrimeDB } from './auth.js';

export const ExamState = {
    stream: '', config: null, activeQuestionIndex: 0, timerSecondsLeft: 10800,
    totalQuestions: 0, questionsData: [], userResponses: {}, questionStatuses: {},
    posMark: 4, negMark: 1, warnings: 0, isPaused: false
};

export async function loadExamConfig(examId) {
    try {
        const res = await fetch(`./configs/${examId}.json`);
        const config = await res.json();
        ExamState.config = config;
        ExamState.stream = examId;
        ExamState.totalQuestions = config.totalQuestions;
        ExamState.timerSecondsLeft = config.durationMinutes * 60;
        ExamState.posMark = config.correctMarks;
        ExamState.negMark = config.negativeMarks;
    } catch (e) {
        ExamState.stream = examId; ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800; ExamState.posMark = 4; ExamState.negMark = 1;
    }

    let questions = [];
    try { questions = await PrimeDB.getQuestions(examId); } catch(e) {}

    if (!questions || questions.length === 0) {
        try {
            const res = await fetch(`./questions/${examId}.json`);
            questions = await res.json();
        } catch (e) {
            questions = generateMockDataset(examId);
        }
    }

    ExamState.questionsData = questions;
    ExamState.userResponses = {};
    ExamState.questionStatuses = {};
    questions.forEach(q => ExamState.questionStatuses[q.id] = 'unvisited');
}

function generateMockDataset(stream) {
    const dataset = [];
    const track = stream.toLowerCase().trim();

    if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 10800; // EXACTLY 3 HOURS
        ExamState.posMark = 4; ExamState.negMark = 1;
    } else if (track.includes('jee')) {
        ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 4; ExamState.negMark = 1;
    } else if (track.includes('cuet')) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 2700;
        ExamState.posMark = 5; ExamState.negMark = 1;
    } else if (track.includes('iat') || track.includes('nest')) {
        ExamState.totalQuestions = track.includes('nest') ? 80 : 60;
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = track.includes('nest') ? 3 : 4; ExamState.negMark = 1;
    }

    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL COGNITION";
        let questionText = `[${stream.toUpperCase()}] Evaluation parameter index ${i}.`;
        let optionsArray = ["Option A", "Option B", "Option C", "Option D"];
        let correctOptionIndex = Math.floor(Math.random() * 4);

        if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS";
            else if (i <= 90) subjectLabel = "CHEMISTRY";
            else if (i <= 135) subjectLabel = "BOTANY";
            else subjectLabel = "ZOOLOGY";
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS";
            else if (i <= 60) subjectLabel = "CHEMISTRY";
            else subjectLabel = "MATHEMATICS";
        } else if (track.includes('cuet')) {
            if (i <= 25) subjectLabel = "DOMAIN PHYSICS";
            else subjectLabel = "DOMAIN MATHEMATICS";
        } else if (track.includes('iat') || track.includes('nest')) {
            if (i <= 15 || (track.includes('nest') && i <= 20)) subjectLabel = "PHYSICS";
            else if (i <= 30 || (track.includes('nest') && i <= 40)) subjectLabel = "CHEMISTRY";
            else if (i <= 45 || (track.includes('nest') && i <= 60)) subjectLabel = "MATHEMATICS";
            else subjectLabel = "BIOLOGY";
        } else if (track.match(/class(6|7|8|9|10)/)) {
            if (i <= (ExamState.totalQuestions / 2)) subjectLabel = "MATHEMATICS";
            else subjectLabel = "SCIENCE";
        } else if (track.match(/class(11|12)/)) {
            subjectLabel = "PHYSICS";
        }

        dataset.push({ id: i, subject: subjectLabel, text: questionText, options: optionsArray, correct: correctOptionIndex });
        ExamState.questionStatuses[i] = 'unvisited';
    }
    return dataset;
}
