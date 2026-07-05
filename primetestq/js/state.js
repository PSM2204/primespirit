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
    
    // Default National Parameters Configuration
    ExamState.posMark = 4;
    ExamState.negMark = 1;

    // 1. DYNAMIC EXAM ENGINE PARAMETERS REGISTRATION
    if (track.match(/class(6|7|8|9|10)/)) {
        ExamState.totalQuestions = 100;
        ExamState.timerSecondsLeft = 7200; // 2 Hours for school tracks
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.match(/class(11|12)/)) {
        ExamState.totalQuestions = 40; 
        ExamState.timerSecondsLeft = 3600; // 1 Hour
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.includes('neet')) {
        ExamState.totalQuestions = 180;
        ExamState.timerSecondsLeft = 10800; // 3 Hours (FIXED from 12000)
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.includes('jee')) {
        ExamState.totalQuestions = 90;
        ExamState.timerSecondsLeft = 10800; // 3 Hours
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.includes('iat')) {
        ExamState.totalQuestions = 60;
        ExamState.timerSecondsLeft = 10800; // 3 Hours
        ExamState.posMark = 4;
        ExamState.negMark = 1;
    } else if (track.includes('nest')) {
        ExamState.totalQuestions = 80;
        ExamState.timerSecondsLeft = 10800;
        ExamState.posMark = 3; // Nest Blueprint
        ExamState.negMark = 1;
    } else if (track.includes('cuet')) {
        ExamState.totalQuestions = 50;
        ExamState.timerSecondsLeft = 2700; // 45 Mins
        ExamState.posMark = 5; // CUET Blueprint
        ExamState.negMark = 1;
    }

    // 2. CLASS-LEVEL SMART REPOSITORY MATRICES
    const QuestionPool = {
        class6: {
            math: { text: "Calculate the least common multiple (LCM) of 12, 18, and 24 to organize structural baseline rows. ", opt: ["A) 48 ", "B) 72 ", "C) 144 ", "D) 36 "], ans: 1 },
            science: { text: "Identify the specialized vitamin resource primarily responsible for preventing the condition known as Scurvy. ", opt: ["A) Vitamin A ", "B) Vitamin B1 ", "C) Vitamin C ", "D) Vitamin D "], ans: 2 }
        },
        class7: {
            math: { text: "Determine the absolute value value of an angle which is exactly double its complement target matrix. ", opt: ["A) 30° ", "B) 45° ", "C) 60° ", "D) 90° "], ans: 2 },
            science: { text: "Analyze the chemical composition transformation that converts copper carbonate metrics into green patches via moisture exposure. ", opt: ["A) Neutralization ", "B) Galvanization ", "C) Corrosion / Rusting ", "D) Crystallization "], ans: 2 }
        },
        class8: {
            math: { text: "Solve for internal coordinate metrics where a regular polygon possesses exactly 9 distinct diagonals inside its mesh. ", opt: ["A) Hexagon ", "B) Heptagon ", "C) Octagon ", "D) Nonagon "], ans: 0 },
            science: { text: "Specify the distinct microbial compound agent explicitly leveraged as the fundamental catalyst for commercial yeast fermentation processes. ", opt: ["A) Lactobacillus ", "B) Rhizobium ", "C) Saccharomyces cerevisiae ", "D) Aspergillus "], ans: 2 }
        },
        class9: {
            math: { text: "Evaluate the rationalized output matrix format expression of 1 / (7 - √6) matching configuration tiers. ", opt: ["A) (7 + √6) / 43 ", "B) (7 - √6) / 43 ", "C) (7 + √6) / 5 ", "D) None of the options "], ans: 0 },
            science: { text: "A physical particle moves along a circular trajectory path loop of radius R. Calculate its total displacement scalar metric after completing exactly 1.5 rotations. ", opt: ["A) 3πR ", "B) 2R ", "C) πR ", "D) Zero value alignment "], ans: 1 }
        },
        class10: {
            math: { text: "If one zero boundary value root of the quadratic function (k-1)x² + kx + 1 is exactly -3, calculate the structural value parameter of k. ", opt: ["A) 4/3 ", "B) -4/3 ", "C) 2/3 ", "D) 5/4 "], ans: 0 },
            science: { text: "An object is placed exactly 20cm away from a concave optical mirror array layout of focal length 10cm. Characterize the resulting image canvas properties. ", opt: ["A) Virtual and erect ", "B) Real, inverted and same size ", "C) Real, inverted and magnified ", "D) Real, diminished at focus "], ans: 1 }
        },
        class11: {
            physics: { text: "Determine the terminal velocity trajectory profile vector angle scaling parameters where a projectile vector exhibits maximum horizontal range capabilities. ", opt: ["A) 30° ", "B) 45° ", "C) 60° ", "D) 90° "], ans: 1 }
        },
        class12: {
            physics: { text: "Evaluate the absolute magnitude storage density alteration parameters inside a parallel plate capacitor if a dielectric element matrix constant K is cleanly introduced inside the workspace. ", opt: ["A) Capacitance drops by 1/K factor ", "B) Capacitance scales upward by K multiplier ", "C) Electrical potential energy quadruples ", "D) Charge flow metrics drop completely "], ans: 1 }
        }
    };

    // 3. AUTOMATED SUBJECT MAP PIPELINE GENERATION LOOP
    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        let subjectLabel = "GENERAL COGNITION ";
        let questionText = `[${stream.toUpperCase()} EXAM CRITERIA LOGIC INDEX ${i}] Evaluate the structural baseline target parameters mapping system balance constraints indices.`; 
        let optionsArray = ["Option A: Matches core optimization limits perfectly. ", "Option B: Fulfills threshold boundaries criteria layer. ", "Option C: Fails matrix verification properties framework. ", "Option D: Satisfies structural baseline execution metrics. "];
        let correctOptionIndex = Math.floor(Math.random() * 4);

        if (track.match(/class(6|7|8|9|10)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            if (i <= 50) {
                subjectLabel = "MATHEMATICS ";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].math.text} (Level Assessment Variant #${i})`;
                optionsArray = QuestionPool[classKey].math.opt;
                correctOptionIndex = QuestionPool[classKey].math.ans;
            } else {
                subjectLabel = "SCIENCE ";
                questionText = `[Q.${i} // ${subjectLabel}] ${QuestionPool[classKey].science.text} (Level Assessment Variant #${i})`;
                optionsArray = QuestionPool[classKey].science.opt;
                correctOptionIndex = QuestionPool[classKey].science.ans;
            }
        } else if (track.match(/class(11|12)/)) {
            const classKey = `class${track.match(/\d+/)[0]}`;
            subjectLabel = "PHYSICS DETAILED TARGET ";
            questionText = `[Q.${i} // CORE PHYSICS] ${QuestionPool[classKey].physics.text} (Validation Rank Matrix #${i})`;
            optionsArray = QuestionPool[classKey].physics.opt;
            correctOptionIndex = QuestionPool[classKey].physics.ans;
        } else if (track.includes('neet')) {
            if (i <= 45) subjectLabel = "PHYSICS (NEET TIER) ";
            else if (i <= 90) subjectLabel = "CHEMISTRY (NEET TIER) ";
            else if (i <= 135) subjectLabel = "BOTANY (BIOLOGY) ";
            else subjectLabel = "ZOOLOGY (BIOLOGY) ";
            questionText = `[NEET HIGH-LEVEL ASSESSMENT // ${subjectLabel} Q.${i}] Analyze competitive rank validation parameters targeting core Medical entry standards.`;
        } else if (track.includes('jee')) {
            if (i <= 30) subjectLabel = "PHYSICS (JEE MAIN TIER) ";
            else if (i <= 60) subjectLabel = "CHEMISTRY (JEE MAIN TIER) ";
            else subjectLabel = "MATHEMATICS (JEE ADVANCED RANKING) ";
            questionText = `[JEE MAIN EVALUATION PIPELINE // ${subjectLabel} Q.${i}] Evaluate engineering diagnostic logic parameter limits mapped to core analytical mechanics indices.`;
        } else if (track.includes('iat') || track.includes('nest')) {
            if (i <= 15 || (track.includes('nest') && i <= 20)) subjectLabel = "PHYSICS (RESEARCH TIER) ";
            else if (i <= 30 || (track.includes('nest') && i <= 40)) subjectLabel = "CHEMISTRY (RESEARCH TIER) ";
            else if (i <= 45 || (track.includes('nest') && i <= 60)) subjectLabel = "MATHEMATICS (RESEARCH TIER) ";
            else subjectLabel = "BIOLOGY (INTEGRATED ADVANCED) ";
            questionText = `[IISER/NISER RESEARCH APTITUDE MATRIX // ${subjectLabel} Q.${i}] Conceptual synthesis testing sequence tracking fundamental advanced scientific derivatives.`;
        } else if (track.includes('cuet')) {
            if (i <= 25) subjectLabel = "SECTION II: DOMAIN PHYSICS ";
            else subjectLabel = "SECTION II: DOMAIN MATHEMATICS ";
            questionText = `[CUET UG ADMISSION CRITERIA // ${subjectLabel} Q.${i}] Central University domain matrix parameter mapping baseline conceptual syllabus accuracy.`;
        }
     
        dataset.push({
            id: i,
            subject: subjectLabel,
            text: questionText,
            options: optionsArray,
            correct: correctOptionIndex
        });
        
        ExamState.questionStatuses[i] = 'unvisited';
    }

    return dataset;
}
