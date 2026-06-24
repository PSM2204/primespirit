export const ExamState = {
    stream: '',
    activeQuestionIndex: 0,
    timerSecondsLeft: 10800, 
    totalQuestions: 0,    
    questionsData: [],
    userResponses: {},  
    questionStatuses: {}, 
    posMark: 4,
    negMark: 1
};

export function generateMockDataset(stream) {
    const dataset = [];
    const track = stream.toLowerCase().trim();

    ExamState.posMark = 4;
    ExamState.negMark = 1;

    if (track.match(/class(6|7|8|9|10)/)) {
        ExamState.totalQuestions = 100;
        ExamState.timerSecondsLeft = 7200; // 2 Hours
        ExamState.posMark = 1;  
        ExamState.negMark = 0;  
    } else if (track.match(/class(11|12)/)) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 3600;
        ExamState.posMark = 1;
        ExamState.negMark = 0;
    } else if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 12000;
    } else if (track.includes('jee')) {
        ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800;
    } else if (track.includes('iat')) {
        ExamState.totalQuestions = 60;
        ExamState.timerSecondsLeft = 10800;
    } else if (track.includes('nest')) {
        ExamState.totalQuestions = 80; 
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 3; // NEST Rules configuration
        ExamState.negMark = 1;
    }

    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL CORE";
        
        if (track.match(/class(6|7|8|9|10)/)) {
            subjectLabel = (i <= 50) ? "MATHEMATICS" : "SCIENCE";
        } else if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS";
            else if (i <= 90) subjectLabel = "CHEMISTRY";
            else if (i <= 135) subjectLabel = "BOTANY";
            else subjectLabel = "ZOOLOGY";
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS";
            else if (i <= 60) subjectLabel = "CHEMISTRY";
            else subjectLabel = "MATHEMATICS";
        } else if (track.includes('nest') || track.includes('iat')) {
            if (i <= 15) subjectLabel = "PHYSICS";
            else if (i <= 30) subjectLabel = "CHEMISTRY";
            else if (i <= 45) subjectLabel = "MATHEMATICS";
            else subjectLabel = "BIOLOGY";
        }

        dataset.push({
            id: i,
            subject: subjectLabel,
            text: `[${subjectLabel} // SYSTEM MOCK QUESTION ${i}] Analyze the question metrics under target validation conditions mapping parameters at depth index ${i}.`,
            options: ["Option A: Evaluation aligns within bounds.", "Option B: Value satisfies equilibrium requirements.", "Option C: The variance index logs fallback profile data.", "Option D: Theoretical derivation calculates parameter values accurately."],
            correct: Math.floor(Math.random() * 4)
        });
        
        ExamState.questionStatuses[i] = 'unvisited';
    }
    
    return dataset;
}
