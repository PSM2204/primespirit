export const ExamState = {
    stream: '',
    activeQuestionIndex: 0,
    timerSecondsLeft: 5400,
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
    
    // Default National Parameters Configuration
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    // 1. DYNAMIC EXAM ENGINE PARAMETERS REGISTRATION (Fixed Rules)
    if (track.match(/class(6|7|8|9|10)/)) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 5400; // 90 Mins
    } else if (track.match(/class(11|12)/)) {
        ExamState.totalQuestions = 45; 
        ExamState.timerSecondsLeft = 5400; // 90 Mins (Physics Only)
    } else if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 10800; // 180 Mins
    } else if (track.includes('jee')) {
        ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800; // 180 Mins
    } else if (track.includes('iat')) {
        ExamState.totalQuestions = 60;
        ExamState.timerSecondsLeft = 10800; // 180 Mins
    } else if (track.includes('nest')) {
        ExamState.totalQuestions = 80;
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 3;
    } else if (track.includes('cuet')) {
        ExamState.totalQuestions = 150; // 50 Phy + 50 Chem + 50 Bio
        ExamState.timerSecondsLeft = 10800; // 60 mins per subject = 180 Mins Total
        ExamState.posMark = 5;
    }

    // 2. CLASS-LEVEL SMART REPOSITORY MATRICES (Fixed Syntax)
    const QuestionPool = {
        class6: { math: { text: "Calculate the least common multiple (LCM) of 12, 18, and 24.", opt: ["A) 48", "B) 72", "C) 144", "D) 36"], ans: 1 }, science: { text: "Identify the vitamin resource primarily responsible for preventing Scurvy.", opt: ["A) Vitamin A", "B) Vitamin B1", "C) Vitamin C", "D) Vitamin D"], ans: 2 } },
        class7: { math: { text: "Determine the value of an angle which is exactly double its complement.", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 2 }, science: { text: "Analyze the process that converts copper carbonate into green patches via moisture.", opt: ["A) Neutralization", "B) Galvanization", "C) Corrosion", "D) Crystallization"], ans: 2 } },
        class8: { math: { text: "Solve for sides where a regular polygon possesses exactly 9 distinct diagonals.", opt: ["A) 6 sides", "B) 7 sides", "C) 8 sides", "D) 9 sides"], ans: 0 }, science: { text: "Specify the organism leveraged as the catalyst for yeast fermentation.", opt: ["A) Lactobacillus", "B) Rhizobium", "C) Saccharomyces cerevisiae", "D) Aspergillus"], ans: 2 } },
        class9: { math: { text: "Evaluate the rationalized format expression of 1 / (7 - √6).", opt: ["A) (7 + √6) / 43", "B) (7 - √6) / 43", "C) (7 + √6) / 5", "D) None"], ans: 0 }, science: { text: "A particle moves along a circular path of radius R. Calculate displacement after 1.5 rotations.", opt: ["A) 3πR", "B) 2R", "C) πR", "D) Zero"], ans: 1 } },
        class10: { math: { text: "If one root of the function (k-1)x² + kx + 1 is exactly -3, calculate value of k.", opt: ["A) 4/3", "B) -4/3", "C) 2/3", "D) 5/4"], ans: 0 }, science: { text: "An object is placed 20cm away from a concave mirror of focal length 10cm. Characterize the image.", opt: ["A) Virtual and erect", "B) Real, inverted and same size", "C) Real, inverted and magnified", "D) Real, diminished"], ans: 1 } },
        class11: { physics: { text: "Determine the launch angle where a projectile exhibits maximum horizontal range capabilities.", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 1 } },
        class12: { physics: { text: "Evaluate the capacitance alteration if a dielectric constant K is introduced into a capacitor.", opt: ["A) Drops by 1/K", "B) Scales upward by K multiplier", "C) Potential energy quadruples", "D) Drops completely"], ans: 1 } }
    };

    // 3. AUTOMATED SUBJECT MAP PIPELINE GENERATION LOOP
    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL COGNITION";
        let questionText = `[${stream.toUpperCase()} EXAM] Evaluation parameter index ${i}.`;
        let optionsArray = ["Option A", "Option B", "Option C", "Option D"];
        let correctOptionIndex = Math.floor(Math.random() * 4);

        if (track.match(/class(6|7|8|9|10)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            if (i <= 25) {
                subjectLabel = "MATHEMATICS";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].math.text}`;
                optionsArray = QuestionPool[classKey].math.opt;
                correctOptionIndex = QuestionPool[classKey].math.ans;
            } else {
                subjectLabel = "SCIENCE";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].science.text}`;
                optionsArray = QuestionPool[classKey].science.opt;
                correctOptionIndex = QuestionPool[classKey].science.ans;
            }
        } else if (track.match(/class(11|12)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            subjectLabel = "PHYSICS";
            questionText = `[Q.${i} // CORE PHYSICS] ${QuestionPool[classKey].physics.text}`;
            optionsArray = QuestionPool[classKey].physics.opt;
            correctOptionIndex = QuestionPool[classKey].physics.ans;
        } else if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS"; else if (i <= 90) subjectLabel = "CHEMISTRY"; else if (i <= 135) subjectLabel = "BOTANY"; else subjectLabel = "ZOOLOGY";
            questionText = `[NEET ASSESSMENT // ${subjectLabel} Q.${i}] Medical entrance level matrix analysis.`;
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS"; else if (i <= 60) subjectLabel = "CHEMISTRY"; else subjectLabel = "MATHEMATICS";
            questionText = `[JEE MAIN TARGET ASSESSMENT // ${subjectLabel} Q.${i}] Core analytical engineering vector alignment.`;
        } else if (track.includes('iat') || track.includes('nest')) {
            if (i <= 15 || (track.includes('nest') && i <= 20)) subjectLabel = "PHYSICS"; else if (i <= 30 || (track.includes('nest') && i <= 40)) subjectLabel = "CHEMISTRY"; else if (i <= 45 || (track.includes('nest') && i <= 60)) subjectLabel = "MATHEMATICS"; else subjectLabel = "BIOLOGY";
            questionText = `[RESEARCH INTEGRATED APTITUDE // ${subjectLabel} Q.${i}] Conceptual advanced science derivatives test entry.`;
        } else if (track.includes('cuet')) {
            if (i <= 50) subjectLabel = "PHYSICS"; else if (i <= 100) subjectLabel = "CHEMISTRY"; else subjectLabel = "BIOLOGY";
            questionText = `[CUET UG ADMISSION MATRIX // ${subjectLabel} Q.${i}] Higher secondary verification level matrix element.`;
        }

        dataset.push({ id: i, subject: subjectLabel, text: questionText, options: optionsArray, correct: correctOptionIndex });
        ExamState.questionStatuses[i] = 'unvisited';
    }
    return dataset;
}
