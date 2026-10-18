export function executeFinalSubmissionSequence() {
    clearInterval(timerInterval);
    
    // 1. Calculate Detailed Results
    let totalScore = 0;
    let attempted = 0, correct = 0, incorrect = 0;
    let subjectStats = {};

    ExamState.questionsData.forEach(q => {
        if (!subjectStats[q.subject]) {
            subjectStats[q.subject] = { correct: 0, incorrect: 0, unattempted: 0, score: 0, total: 0 };
        }
        subjectStats[q.subject].total++;

        const response = ExamState.userResponses[q.id];
        
        if (!response) {
            subjectStats[q.subject].unattempted++;
        } else {
            attempted++;
            let isCorrect = false;
            
            if (q.type === 'MCQ') {
                isCorrect = response.value === q.correctAnswerIndex;
            } else {
                const userVal = parseFloat(response.value);
                const correctVal = parseFloat(q.correctAnswerIndex); 
                const tolerance = q.tolerance || 0.1;
                isCorrect = !isNaN(userVal) && Math.abs(userVal - correctVal) <= tolerance;
            }

            if (isCorrect) {
                totalScore += q.marks;
                correct++;
                subjectStats[q.subject].correct++;
                subjectStats[q.subject].score += q.marks;
            } else {
                totalScore -= q.negativeMarks;
                incorrect++;
                subjectStats[q.subject].incorrect++;
                subjectStats[q.subject].score -= q.negativeMarks;
            }
        }
    });

    ExamState.testResults = { totalScore, attempted, correct, incorrect, subjectStats };

    // 2. Hide Cockpit and Show Result Dashboard
    document.getElementById('screen-cockpit-simulation').classList.add('hidden');
    document.getElementById('screen-result-dashboard').classList.remove('hidden');

    // 3. Render the Dashboard
    renderResultDashboard();
}

// ==========================================
// RESULT DASHBOARD RENDERER (ADD THIS BELOW THE FUNCTION ABOVE)
// ==========================================

function renderResultDashboard() {
    const res = ExamState.testResults;
    const maxScore = ExamState.totalQuestions * ExamState.posMark;
    const accuracy = res.attempted > 0 ? Math.round((res.correct / res.attempted) * 100) : 0;

    // Update Top Stats
    document.getElementById('res-total-score').innerText = res.totalScore;
    document.getElementById('res-max-score').innerText = maxScore;
    document.getElementById('res-accuracy').innerText = `${accuracy}%`;
    document.getElementById('res-attempted').innerText = res.attempted;
    document.getElementById('res-correct').innerText = res.correct;
    document.getElementById('res-incorrect').innerText = res.incorrect;

    // Update Subject Breakdown
    const subjectGrid = document.getElementById('res-subject-breakdown');
    subjectGrid.innerHTML = '';
    for (const [subject, stats] of Object.entries(res.subjectStats)) {
        subjectGrid.innerHTML += `
            <div class="subject-stat-item">
                <div>
                    <h4>${subject}</h4>
                    <p>C: ${stats.correct} | W: ${stats.incorrect} | Skip: ${stats.unattempted}</p>
                </div>
                <div class="subject-stat-score">${stats.score}</div>
            </div>
        `;
    }

    // Render Detailed Question Review with Explanations
    const reviewList = document.getElementById('res-question-review-list');
    reviewList.innerHTML = '';

    ExamState.questionsData.forEach((q, index) => {
        const response = ExamState.userResponses[q.id];
        let statusClass = 'is-unattempted';
        let statusText = 'UNATTEMPTED';
        
        if (response) {
            let isCorrect = false;
            if (q.type === 'MCQ') isCorrect = response.value === q.correctAnswerIndex;
            else isCorrect = Math.abs(parseFloat(response.value) - parseFloat(q.correctAnswerIndex)) <= (q.tolerance || 0.1);
            
            if (isCorrect) { statusClass = 'is-correct'; statusText = 'CORRECT'; }
            else { statusClass = 'is-incorrect'; statusText = 'INCORRECT'; }
        }

        // Build Options HTML
        let optionsHtml = '';
        if (q.type === 'MCQ' && q.options) {
            q.options.forEach((opt, i) => {
                let optClass = '';
                if (i === q.correctAnswerIndex) optClass = 'actual-correct'; 
                if (response && response.value === i && i !== q.correctAnswerIndex) optClass = 'user-wrong'; 
                
                optionsHtml += `<div class="review-option-item ${optClass}"><strong>${String.fromCharCode(65 + i)}.</strong> ${opt}</div>`;
            });
        } else {
            const userAns = response ? response.value : 'No Answer';
            optionsHtml = `<div class="review-option-item">Your Answer: <strong>${userAns}</strong></div>
                           <div class="review-option-item actual-correct">Correct Answer: <strong>${q.correctAnswerIndex}</strong></div>`;
        }

        // Build Explanation HTML
        const explanationHtml = q.explanation ? `
            <div class="explanation-box">
                <h4><i class="fas fa-lightbulb"></i> DETAILED EXPLANATION</h4>
                <p>${q.explanation}</p>
            </div>
        ` : '';

        // Assemble Card
        const card = document.createElement('div');
        card.className = `review-question-card ${statusClass}`;
        card.innerHTML = `
            <div class="review-q-header">
                <span>Q. ${index + 1} // ${q.subject}</span>
                <span style="color: ${statusClass === 'is-correct' ? 'var(--status-answered)' : (statusClass === 'is-incorrect' ? 'var(--status-unanswered)' : '#7F8C8D')}">${statusText}</span>
            </div>
            <div class="review-q-text">${q.question}</div>
            ${q.imageUrl ? `<div class="question-image-container"><img src="${q.imageUrl}" alt="Diagram"></div>` : ''}
            <div class="review-options-list">${optionsHtml}</div>
            ${explanationHtml}
        `;
        reviewList.appendChild(card);
    });

    // Trigger MathJax to render any math in the explanations
    if (window.MathJax) {
        MathJax.typesetPromise([reviewList]).catch((err) => console.log('MathJax error:', err));
    }
}
