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
    
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    if (track.match(/class(6|7|8|9|10)/)) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 5400;
    } else if (track.match(/class(11|12)/)) {
        ExamState.totalQuestions = 45; 
        ExamState.timerSecondsLeft = 5400;
    } else if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 10800;
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
        ExamState.totalQuestions = 150;
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 5;
    }

    const QuestionPool = {
        class6: { math: { text: "Calculate LCM of 12, 18, and 24.", opt: ["A) 48", "B) 72", "C) 144", "D) 36"], ans: 1 }, science: { text: "Vitamin for preventing Scurvy?", opt: ["A) Vitamin A", "B) Vitamin B1", "C) Vitamin C", "D) Vitamin D"], ans: 2 } },
        class7: { math: { text: "Angle double its complement?", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 2 }, science: { text: "Copper carbonate to green patches?", opt: ["A) Neutralization", "B) Galvanization", "C) Corrosion", "D) Crystallization"], ans: 2 } },
        class8: { math: { text: "Polygon with 9 diagonals?", opt: ["A) 6 sides", "B) 7 sides", "C) 8 sides", "D) 9 sides"], ans: 0 }, science: { text: "Yeast fermentation organism?", opt: ["A) Lactobacillus", "B) Rhizobium", "C) Saccharomyces cerevisiae", "D) Aspergillus"], ans: 2 } },
        class9: { math: { text: "Rationalize 1/(7-√6)", opt: ["A) (7+√6)/43", "B) (7-√6)/43", "C) (7+√6)/5", "D) None"], ans: 0 }, science: { text: "Displacement after 1.5 rotations?", opt: ["A) 3πR", "B) 2R", "C) πR", "D) Zero"], ans: 1 } },
        class10: { math: { text: "Root is -3, find k in (k-1)x²+kx+1", opt: ["A) 4/3", "B) -4/3", "C) 2/3", "D) 5/4"], ans: 0 }, science: { text: "Object 20cm from concave mirror f=10cm", opt: ["A) Virtual erect", "B) Real inverted same size", "C) Real inverted magnified", "D) Real diminished"], ans: 1 } },
        class11: { physics: { text: "Max range projectile angle?", opt: ["A) 30°", "B) 45°", "C) 60°", "D) 90°"], ans: 1 } },
        class12: { physics: { text: "Dielectric K introduced, capacitance?", opt: ["A) Drops 1/K", "B) Scales by K", "C) Energy quadruples", "D) Drops completely"], ans: 1 } }
    };

    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL";
        let questionText = `Question ${i}`;
        let optionsArray = ["Option A", "Option B", "Option C", "Option D"];
        let correctOptionIndex = Math.floor(Math.random() * 4);

        if (track.match(/class(6|7|8|9|10)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            if (i <= 25) {
                subjectLabel = "MATHEMATICS";
                questionText = `[Q.${i}] ${QuestionPool[classKey].math.text}`;
                optionsArray = QuestionPool[classKey].math.opt;
                correctOptionIndex = QuestionPool[classKey].math.ans;
            } else {
                subjectLabel = "SCIENCE";
                questionText = `[Q.${i}] ${QuestionPool[classKey].science.text}`;
                optionsArray = QuestionPool[classKey].science.opt;
                correctOptionIndex = QuestionPool[classKey].science.ans;
            }
        } else if (track.match(/class(11|12)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            subjectLabel = "PHYSICS";
            questionText = `[Q.${i}] ${QuestionPool[classKey].physics.text}`;
            optionsArray = QuestionPool[classKey].physics.opt;
            correctOptionIndex = QuestionPool[classKey].physics.ans;
        } else if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS";
            else if (i <= 90) subjectLabel = "CHEMISTRY";
            else if (i <= 135) subjectLabel = "BOTANY";
            else subjectLabel = "ZOOLOGY";
            questionText = `[NEET ${subjectLabel} Q.${i}] Question text`;
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS";
            else if (i <= 60) subjectLabel = "CHEMISTRY";
            else subjectLabel = "MATHEMATICS";
            questionText = `[JEE ${subjectLabel} Q.${i}] Question text`;
        } else if (track.includes('cuet')) {
            if (i <= 50) subjectLabel = "PHYSICS";
            else if (i <= 100) subjectLabel = "CHEMISTRY";
            else subjectLabel = "BIOLOGY";
            questionText = `[CUET ${subjectLabel} Q.${i}] Question text`;
        } else if (track.includes('iat') || track.includes('nest')) {
            if (i <= 15 || (track.includes('nest') && i <= 20)) subjectLabel = "PHYSICS";
            else if (i <= 30 || (track.includes('nest') && i <= 40)) subjectLabel = "CHEMISTRY";
            else if (i <= 45 || (track.includes('nest') && i <= 60)) subjectLabel = "MATHEMATICS";
            else subjectLabel = "BIOLOGY";
            questionText = `[${subjectLabel} Q.${i}] Question text`;
        }

        dataset.push({ id: i, subject: subjectLabel, text: questionText, options: optionsArray, correct: correctOptionIndex });
        ExamState.questionStatuses[i] = 'unvisited';
    }
    return dataset;
}
