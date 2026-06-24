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

    // Default global competitive exam score indicators
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    if (track.includes('admission')) {
        // Matches your original Admission tracking key -> Configures your 100 Qs Math & Science split
        ExamState.totalQuestions = 100;
        ExamState.timerSecondsLeft = 7200; // 2 Hours exactly
        ExamState.posMark = 4;  
        ExamState.negMark = 1;  
    } else if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 12000; // 3 Hours 20 Mins
    } else if (track.includes('jee')) {
        ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800; // 3 Hours
    } else if (track.includes('iat')) {
        ExamState.totalQuestions = 60;
        ExamState.timerSecondsLeft = 10800;
    } else if (track.includes('nest')) {
        ExamState.totalQuestions = 80; 
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 3; // Official NEST scoring constraints
        ExamState.negMark = 1;
    }

    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL CORE";
        
        if (track.includes('admission')) {
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
            if (i <= 20) subjectLabel = "PHYSICS";
            else if (i <= 40) subjectLabel = "CHEMISTRY";
            else if (i <= 60) subjectLabel = "MATHEMATICS";
            else subjectLabel = "BIOLOGY";
        }

        dataset.push({
            id: i,
            subject: subjectLabel,
            text: `[${subjectLabel} // TRACK EVALUATION CHANNELS ${i}] Evaluate the testing metrics baseline under structural exam criteria layer indices ${i}.`,
            options: ["Option A: Calculation matches baseline parameters.", "Option B: Functional transformation reaches threshold limits.", "Option C: Scalar potential output logs optimal status.", "Option D: Theoretical metric satisfies system metrics balance."],
            correct: Math.floor(Math.random() * 4)
        });
        
        ExamState.questionStatuses[i] = 'unvisited';
    }
    
    return dataset;
}
