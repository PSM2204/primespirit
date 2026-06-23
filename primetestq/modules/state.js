export const ExamState = {
    stream: '',
    activeQuestionIndex: 0,
    timerSecondsLeft: 3600,
    totalQuestions: 20,
    questionsData: [],
    userResponses: {},  
    questionStatuses: {}, 
};

export function generateMockDataset(stream) {
    const dataset = [];
    for (let i = 1; i <= ExamState.totalQuestions; i++) {
        dataset.push({
            id: i,
            text: `[${stream.toUpperCase()} FIELD TRACK EVALUATION TASK ${i}] Determine the architectural velocity output constraints assuming an ambient structural mass coefficient variable condition.`,
            options: [
                `Option A: Scalar acceleration matches parameters.`,
                `Option B: Vector deflection falls within threshold parameters.`,
                `Option C: Null potential equilibrium state holds true.`,
                `Option D: Variable conversion factor outputs maximum efficiency.`
            ],
            correct: Math.floor(Math.random() * 4)
        });
        ExamState.questionStatuses[i] = 'unvisited';
    }
    return dataset;
}

