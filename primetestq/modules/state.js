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

    // Default Competitive Mapping Setup Rules
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    if (track.match(/class(6|7|8|9|10)/)) {
        ExamState.totalQuestions = 100;
        ExamState.timerSecondsLeft = 7200; // 2 Hours for Secondary Admission Checks
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.match(/class(11|12)/)) {
        ExamState.totalQuestions = 100;
        ExamState.timerSecondsLeft = 10800; // 3 Hours
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
        ExamState.posMark = 3;
    } else if (track.includes('cuet')) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 2700; // 45 Mins
        ExamState.posMark = 5;
    }

    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL TRACK";
        
        if (track.match(/class(6|7|8|9|10)/)) {
            subjectLabel = (i <= 50) ? "MATHEMATICS" : "SCIENCE";
        } else if (track.match(/class(11|12)/)) {
            subjectLabel = (i <= 50) ? "PHYSICS" : "CHEMISTRY";
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
            if (i <= 20) subjectLabel = "PHYSICS";
            else if (i <= 40) subjectLabel = "CHEMISTRY";
            else if (i <= 60) subjectLabel = "MATHEMATICS";
            else subjectLabel = "BIOLOGY";
        }

        dataset.push({
            id: i,
            subject: subjectLabel,
            text: `[${subjectLabel} Sample Evaluation Question ${i}] Analyze structural metrics logic framework mapping standard testing constraints parameters.`,
            options: ["Option A: Matches target core calibration parameters perfectly.", "Option B: Fulfills benchmark limits mapping structural metrics.", "Option C: Fails optimization bounds forcing error fallback logic.", "Option D: Outputs equilibrium state across execution levels."],
            correct: Math.floor(Math.random() * 4)
        });
        
        ExamState.questionStatuses[i] = 'unvisited';
    }
    
    return dataset;
}
