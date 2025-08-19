// General Knowledge Trivia Game
class TriviaGame {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.startTime = null;
        this.questionStartTime = null;
        this.isActive = false;
        this.selectedAnswer = null;
        this.hasAnswered = false;
        this.questionTimer = null;
        this.difficulty = 'mixed';
        this.categories = [];
        this.lifelines = {
            fiftyFifty: true,
            skipQuestion: true,
            extraTime: true
        };
    }

    start() {
        this.isActive = true;
        this.startTime = Date.now();
        this.questions = QuestionUtils.getRandomQuestions('trivia', 12);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.categories = [...new Set(this.questions.map(q => q.category))];

        this.setupGameInterface();
        this.showQuestion();
    }

    setupGameInterface() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="trivia-container">
                <div class="trivia-header">
                    <div class="question-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progressFill"></div>
                        </div>
                        <div class="question-counter">
                            Question <span id="currentQuestion">1</span> of <span id="totalQuestions">${this.questions.length}</span>
                        </div>
                    </div>
                    <div class="category-indicator" id="categoryIndicator">General Knowledge</div>
                </div>

                <div class="trivia-content">
                    <div class="question-section">
                        <div class="question-text" id="questionText">Loading question...</div>
                        <div class="question-meta">
                            <div class="points-value" id="pointsValue">Points: 15</div>
                            <div class="question-timer" id="questionTimer">⏱️ 25s</div>
                        </div>
                    </div>

                    <div class="options-section">
                        <div class="options-grid" id="optionsGrid">
                            <!-- Options will be populated here -->
                        </div>
                    </div>

                    <div class="lifelines-section" id="lifelinesSection">
                        <h4>Lifelines</h4>
                        <div class="lifelines-grid">
                            <button class="lifeline-btn" id="fiftyFiftyBtn" title="Remove two wrong answers">
                                <i class="fas fa-cut"></i>
                                <span>50:50</span>
                            </button>
                            <button class="lifeline-btn" id="skipQuestionBtn" title="Skip this question">
                                <i class="fas fa-forward"></i>
                                <span>Skip</span>
                            </button>
                            <button class="lifeline-btn" id="extraTimeBtn" title="Add 15 seconds">
                                <i class="fas fa-clock"></i>
                                <span>+Time</span>
                            </button>
                        </div>
                    </div>

                    <div class="trivia-feedback" id="triviaFeedback">
                        <!-- Feedback messages will appear here -->
                    </div>

                    <div class="trivia-stats">
                        <div class="stat">
                            <span class="stat-label">Correct:</span>
                            <span class="stat-value" id="correctCount">0</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Accuracy:</span>
                            <span class="stat-value" id="accuracyRate">0%</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Streak:</span>
                            <span class="stat-value" id="currentStreak">0</span>
                        </div>
                    </div>
                </div>

                <button class="btn primary next-question-btn" id="nextQuestionBtn" style="display: none;">
                    Next Question
                </button>
            </div>
        `;

        this.addTriviaStyles();
        this.setupEventListeners();
    }

    addTriviaStyles() {
        const style = document.createElement('style');
        style.id = 'triviaGameStyles';
        style.textContent = `
            .trivia-container {
                max-width: 800px;
                margin: 0 auto;
            }
            .trivia-header {
                margin-bottom: 2rem;
                text-align: center;
            }
            .progress-bar {
                width: 100%;
                height: 10px;
                background: var(--bg-tertiary);
                border-radius: 5px;
                margin-bottom: 1rem;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                transition: width 0.3s ease;
                width: 0%;
            }
            .question-counter {
                color: var(--text-secondary);
                font-weight: 600;
                font-size: 1.1rem;
            }
            .category-indicator {
                display: inline-block;
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                padding: 0.5rem 1.5rem;
                border-radius: var(--radius-lg);
                font-weight: 600;
                margin-top: 1rem;
                font-size: 1rem;
            }
            .question-section {
                background: var(--bg-secondary);
                border-radius: var(--radius-xl);
                padding: 2rem;
                margin-bottom: 2rem;
                border: 1px solid var(--border-color);
                position: relative;
                overflow: hidden;
            }
            .question-section::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
            }
            .question-text {
                font-size: 1.4rem;
                font-weight: 600;
                color: var(--text-primary);
                line-height: 1.6;
                margin-bottom: 1.5rem;
                text-align: center;
            }
            .question-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid var(--border-color);
                padding-top: 1rem;
            }
            .points-value {
                color: var(--success-color);
                font-weight: 700;
                font-size: 1.1rem;
            }
            .question-timer {
                color: var(--warning-color);
                font-weight: 700;
                font-size: 1.1rem;
            }
            .question-timer.warning {
                color: var(--danger-color);
                animation: pulse 1s infinite;
            }
            .options-section {
                margin-bottom: 2rem;
            }
            .options-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 1rem;
            }
            .trivia-option {
                background: var(--bg-primary);
                border: 2px solid var(--border-color);
                padding: 1.2rem;
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                font-size: 1.1rem;
                position: relative;
                overflow: hidden;
            }
            .trivia-option::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.1), transparent);
                transition: left 0.5s ease;
            }
            .trivia-option:hover::before {
                left: 100%;
            }
            .trivia-option:hover {
                border-color: var(--primary-color);
                transform: translateY(-3px);
                box-shadow: var(--shadow-md);
            }
            .trivia-option.selected {
                border-color: var(--primary-color);
                background: rgba(99, 102, 241, 0.1);
                transform: scale(1.02);
            }
            .trivia-option.correct {
                border-color: var(--success-color);
                background: rgba(16, 185, 129, 0.15);
                animation: correctPulse 0.6s ease;
            }
            .trivia-option.incorrect {
                border-color: var(--danger-color);
                background: rgba(239, 68, 68, 0.15);
                animation: incorrectShake 0.5s ease;
            }
            .trivia-option.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: scale(0.95);
            }
            .trivia-option.eliminated {
                opacity: 0.3;
                cursor: not-allowed;
                transform: scale(0.95);
                filter: blur(1px);
            }
            .option-letter {
                display: inline-block;
                background: var(--primary-color);
                color: white;
                width: 30px;
                height: 30px;
                border-radius: 50%;
                text-align: center;
                line-height: 30px;
                font-weight: 700;
                margin-right: 1rem;
                font-size: 0.9rem;
            }
            .lifelines-section {
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                padding: 1.5rem;
                margin-bottom: 2rem;
                border: 1px solid var(--border-color);
            }
            .lifelines-section h4 {
                text-align: center;
                margin-bottom: 1rem;
                color: var(--text-primary);
            }
            .lifelines-grid {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            .lifeline-btn {
                background: linear-gradient(135deg, var(--warning-color), #f59e0b);
                color: white;
                border: none;
                padding: 0.8rem;
                border-radius: var(--radius-md);
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.3rem;
                min-width: 70px;
                font-weight: 600;
            }
            .lifeline-btn:hover {
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            .lifeline-btn:disabled {
                background: var(--bg-tertiary);
                color: var(--text-muted);
                cursor: not-allowed;
                transform: none;
            }
            .lifeline-btn i {
                font-size: 1.2rem;
            }
            .lifeline-btn span {
                font-size: 0.8rem;
            }
            .trivia-feedback {
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 1.2rem;
                margin-bottom: 2rem;
                border-radius: var(--radius-lg);
                padding: 1rem;
                transition: all 0.3s ease;
            }
            .trivia-feedback.success {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
                border: 1px solid var(--success-color);
            }
            .trivia-feedback.error {
                background: rgba(239, 68, 68, 0.1);
                color: var(--danger-color);
                border: 1px solid var(--danger-color);
            }
            .trivia-feedback.info {
                background: rgba(99, 102, 241, 0.1);
                color: var(--primary-color);
                border: 1px solid var(--primary-color);
            }
            .trivia-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .stat {
                text-align: center;
                padding: 1rem;
                background: var(--bg-secondary);
                border-radius: var(--radius-md);
                border: 1px solid var(--border-color);
            }
            .stat-label {
                display: block;
                color: var(--text-secondary);
                font-size: 0.9rem;
                margin-bottom: 0.3rem;
            }
            .stat-value {
                display: block;
                color: var(--primary-color);
                font-weight: 700;
                font-size: 1.3rem;
            }
            .next-question-btn {
                width: 100%;
                padding: 1rem;
                font-size: 1.1rem;
                font-weight: 600;
            }
            @keyframes correctPulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes incorrectShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
            @media (max-width: 768px) {
                .options-grid {
                    grid-template-columns: 1fr;
                }
                .question-meta {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .lifelines-grid {
                    flex-direction: column;
                    max-width: 200px;
                    margin: 0 auto;
                }
                .trivia-stats {
                    grid-template-columns: 1fr;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        // Lifeline buttons
        document.getElementById('fiftyFiftyBtn').addEventListener('click', () => {
            this.useFiftyFifty();
        });

        document.getElementById('skipQuestionBtn').addEventListener('click', () => {
            this.useSkipQuestion();
        });

        document.getElementById('extraTimeBtn').addEventListener('click', () => {
            this.useExtraTime();
        });

        // Next question button
        document.getElementById('nextQuestionBtn').addEventListener('click', () => {
            this.nextQuestion();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleKeyPress(event) {
        if (!this.isActive) return;

        // Number keys 1-4 for selecting options
        if (event.key >= '1' && event.key <= '4') {
            const optionIndex = parseInt(event.key) - 1;
            const options = document.querySelectorAll('.trivia-option');
            if (options[optionIndex] && !this.hasAnswered && !options[optionIndex].classList.contains('disabled')) {
                this.selectOption(optionIndex);
            }
        }

        // Enter key for next question
        if (event.key === 'Enter' && this.hasAnswered) {
            this.nextQuestion();
        }

        // Lifeline shortcuts
        if (event.key === 'f' && this.lifelines.fiftyFifty) {
            this.useFiftyFifty();
        }
        if (event.key === 's' && this.lifelines.skipQuestion) {
            this.useSkipQuestion();
        }
        if (event.key === 't' && this.lifelines.extraTime) {
            this.useExtraTime();
        }
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
            return;
        }

        this.hasAnswered = false;
        this.selectedAnswer = null;
        this.questionStartTime = Date.now();

        const question = this.questions[this.currentQuestionIndex];
        
        // Update UI
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.questions.length;
        document.getElementById('questionText').textContent = question.question;
        document.getElementById('categoryIndicator').textContent = question.category || 'General Knowledge';
        document.getElementById('pointsValue').textContent = `Points: ${question.points || 15}`;
        
        // Update progress bar
        const progress = (this.currentQuestionIndex / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';

        // Create options
        this.createOptions(question);

        // Update stats
        this.updateStats();

        // Hide next button
        document.getElementById('nextQuestionBtn').style.display = 'none';

        // Start question timer
        this.startQuestionTimer(25);
    }

    createOptions(question) {
        const optionsGrid = document.getElementById('optionsGrid');
        optionsGrid.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'trivia-option';
            optionElement.innerHTML = `
                <span class="option-letter">${String.fromCharCode(65 + index)}</span>
                ${option}
            `;
            optionElement.dataset.index = index;
            
            optionElement.addEventListener('click', () => {
                if (!this.hasAnswered && !optionElement.classList.contains('disabled') && 
                    !optionElement.classList.contains('eliminated')) {
                    this.selectOption(index);
                }
            });

            optionsGrid.appendChild(optionElement);
        });
    }

    selectOption(index) {
        if (this.hasAnswered) return;

        clearInterval(this.questionTimer);
        this.hasAnswered = true;
        this.selectedAnswer = index;

        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.trivia-option');
        const isCorrect = index === question.correct;

        // Mark selected option
        options[index].classList.add('selected');

        // Show correct answer after delay
        setTimeout(() => {
            options[question.correct].classList.add('correct');
            
            if (!isCorrect) {
                options[index].classList.add('incorrect');
            }

            this.processAnswer(isCorrect, question);
        }, 800);
    }

    processAnswer(isCorrect, question) {
        const timeBonus = this.calculateTimeBonus();
        let points = 0;

        if (isCorrect) {
            this.correctAnswers++;
            points = (question.points || 15) + timeBonus;
            this.score += points;
            
            // Show success feedback
            this.showFeedback(`Correct! +${points} points`, 'success');
            this.showPointsAnimation(points);
        } else {
            // Show error feedback with explanation
            this.showFeedback(`Incorrect. The correct answer was "${question.options[question.correct]}"`, 'error');
        }

        // Update score and stats with sound effects
        this.updateScore();
        this.updateStats();
        
        if (isCorrect && window.eduGameApp) {
            window.eduGameApp.playSound('correct');
        } else if (!isCorrect && window.eduGameApp) {
            window.eduGameApp.playSound('incorrect');
        }

        // Show next button after a delay
        setTimeout(() => {
            document.getElementById('nextQuestionBtn').style.display = 'block';
            document.getElementById('nextQuestionBtn').focus();
        }, 2000);
    }

    startQuestionTimer(duration) {
        let timeLeft = duration;
        const timerElement = document.getElementById('questionTimer');
        timerElement.textContent = `⏱️ ${timeLeft}s`;
        timerElement.classList.remove('warning');

        this.questionTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `⏱️ ${timeLeft}s`;
            
            if (timeLeft <= 5) {
                timerElement.classList.add('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(this.questionTimer);
                if (!this.hasAnswered) {
                    this.timeUpForQuestion();
                }
            }
        }, 1000);
    }

    timeUpForQuestion() {
        this.hasAnswered = true;
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.trivia-option');
        
        // Show correct answer
        options[question.correct].classList.add('correct');
        
        this.showFeedback(`Time's up! The correct answer was "${question.options[question.correct]}"`, 'error');

        // Update stats
        this.updateStats();

        // Show next button
        setTimeout(() => {
            document.getElementById('nextQuestionBtn').style.display = 'block';
            document.getElementById('nextQuestionBtn').focus();
        }, 2000);
    }

    // Lifeline methods
    useFiftyFifty() {
        if (!this.lifelines.fiftyFifty || this.hasAnswered) return;

        this.lifelines.fiftyFifty = false;
        document.getElementById('fiftyFiftyBtn').disabled = true;

        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.trivia-option');
        
        // Get incorrect options
        const incorrectIndices = [];
        question.options.forEach((option, index) => {
            if (index !== question.correct) {
                incorrectIndices.push(index);
            }
        });

        // Randomly eliminate 2 incorrect options
        const toEliminate = incorrectIndices.sort(() => 0.5 - Math.random()).slice(0, 2);
        
        toEliminate.forEach(index => {
            options[index].classList.add('eliminated');
        });

        this.showFeedback('50:50 used! Two incorrect answers removed.', 'info');
    }

    useSkipQuestion() {
        if (!this.lifelines.skipQuestion || this.hasAnswered) return;

        this.lifelines.skipQuestion = false;
        document.getElementById('skipQuestionBtn').disabled = true;

        clearInterval(this.questionTimer);
        this.hasAnswered = true;

        // Small penalty for skipping
        this.score = Math.max(0, this.score - 10);
        this.updateScore();

        this.showFeedback('Question skipped! (-10 points)', 'info');

        setTimeout(() => {
            this.nextQuestion();
        }, 2000);
    }

    useExtraTime() {
        if (!this.lifelines.extraTime || this.hasAnswered) return;

        this.lifelines.extraTime = false;
        document.getElementById('extraTimeBtn').disabled = true;

        // Add 15 seconds to current timer
        clearInterval(this.questionTimer);
        
        const currentTimeElement = document.getElementById('questionTimer');
        const currentTime = parseInt(currentTimeElement.textContent.match(/\d+/)[0]);
        const newTime = currentTime + 15;
        
        this.startQuestionTimer(newTime);
        this.showFeedback('+15 seconds added!', 'info');
    }

    calculateTimeBonus() {
        if (!this.questionStartTime) return 0;
        
        const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
        const maxTime = 25;
        const remainingTime = Math.max(0, maxTime - timeElapsed);
        
        // Bonus points based on speed (0-10 points)
        return Math.round((remainingTime / maxTime) * 10);
    }

    showPointsAnimation(points) {
        const pointsElement = document.createElement('div');
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            font-weight: bold;
            color: var(--success-color);
            z-index: 1000;
            pointer-events: none;
            animation: pointsFloat 2s ease-out forwards;
        `;

        document.body.appendChild(pointsElement);
        
        setTimeout(() => {
            if (document.body.contains(pointsElement)) {
                document.body.removeChild(pointsElement);
            }
        }, 2000);
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('triviaFeedback');
        feedback.textContent = message;
        feedback.className = `trivia-feedback ${type}`;

        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'trivia-feedback';
        }, 4000);
    }

    updateScore() {
        if (window.eduGameApp) {
            window.eduGameApp.updateScore(this.score);
        } else {
            document.getElementById('currentScore').textContent = this.score;
        }
    }

    updateStats() {
        const total = this.currentQuestionIndex + (this.hasAnswered ? 1 : 0);
        const accuracy = total > 0 ? Math.round((this.correctAnswers / total) * 100) : 0;
        
        // Calculate current streak
        let streak = 0;
        for (let i = this.currentQuestionIndex; i >= 0; i--) {
            // This is a simplified streak calculation
            // In a real implementation, you'd track this more accurately
            if (this.correctAnswers > 0) streak++;
            else break;
        }

        document.getElementById('correctCount').textContent = this.correctAnswers;
        document.getElementById('accuracyRate').textContent = accuracy + '%';
        document.getElementById('currentStreak').textContent = Math.min(streak, this.correctAnswers);
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame();
        } else {
            this.showQuestion();
        }
    }

    endGame() {
        this.isActive = false;
        clearInterval(this.questionTimer);
        
        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000);
        
        const result = {
            subject: 'trivia',
            score: this.score,
            correct: this.correctAnswers,
            total: this.questions.length,
            timeTaken: totalTime,
            gameType: 'trivia'
        };

        // Show completion message
        this.showFeedback('🎉 Trivia Complete! You\'re a knowledge champion!', 'success');

        // Show result modal after a delay
        setTimeout(() => {
            if (window.eduGameApp) {
                window.eduGameApp.showResultModal(result);
            }
        }, 2000);
    }

    timeUp() {
        this.endGame();
    }

    end() {
        this.isActive = false;
        clearInterval(this.questionTimer);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        
        // Remove styles
        const styleElement = document.getElementById('triviaGameStyles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    // Pause game functionality
    pause() {
        this.isActive = false;
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.pausedTimeLeft = this.getCurrentTimeLeft();
        }
    }

    // Resume game functionality
    resume() {
        this.isActive = true;
        if (!this.hasAnswered && this.pausedTimeLeft) {
            this.startQuestionTimer(this.pausedTimeLeft);
        }
    }

    getCurrentTimeLeft() {
        const timerText = document.getElementById('questionTimer')?.textContent;
        if (timerText) {
            const match = timerText.match(/(\d+)s/);
            return match ? parseInt(match[1]) : 25;
        }
        return 25;
    }

    // Get current game state
    getGameState() {
        return {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
            correctAnswers: this.correctAnswers,
            totalQuestions: this.questions.length,
            lifelines: this.lifelines,
            isActive: this.isActive
        };
    }
}

// Export for use in other modules
window.TriviaGame = TriviaGame;
