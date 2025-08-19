// Mathematics Quiz Game
class MathQuiz {
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
    }

    start() {
        this.isActive = true;
        this.startTime = Date.now();
        this.questions = QuestionUtils.getMixedDifficultyQuestions('math', 7, 3);
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        
        this.setupGameInterface();
        this.showQuestion();
    }

    setupGameInterface() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="quiz-container">
                <div class="question-counter">
                    <span id="currentQuestion">1</span> / <span id="totalQuestions">${this.questions.length}</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="question" id="questionText">Loading...</div>
                <div class="options" id="optionsContainer">
                    <!-- Options will be populated here -->
                </div>
                <div class="question-info">
                    <div class="points-indicator" id="pointsIndicator">Points: 0</div>
                    <div class="question-timer" id="questionTimer">⏱️ 15s</div>
                </div>
                <button class="btn primary" id="nextButton" style="display: none;">Next Question</button>
            </div>
        `;

        // Add progress bar styles
        const progressStyle = document.createElement('style');
        progressStyle.textContent = `
            .progress-bar {
                width: 100%;
                height: 8px;
                background: var(--bg-tertiary);
                border-radius: 4px;
                margin-bottom: 2rem;
                overflow: hidden;
            }
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
                transition: width 0.3s ease;
                width: 0%;
            }
            .question-info {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 1rem;
                padding-top: 1rem;
                border-top: 1px solid var(--border-color);
            }
            .points-indicator {
                color: var(--success-color);
                font-weight: 600;
            }
            .question-timer {
                color: var(--warning-color);
                font-weight: 600;
            }
            .question-timer.warning {
                color: var(--danger-color);
                animation: pulse 1s infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `;
        document.head.appendChild(progressStyle);

        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('nextButton').addEventListener('click', () => {
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
            const options = document.querySelectorAll('.option');
            if (options[optionIndex] && !this.hasAnswered) {
                this.selectOption(optionIndex);
            }
        }

        // Enter key for next question
        if (event.key === 'Enter' && this.hasAnswered) {
            this.nextQuestion();
        }

        // Space bar for next question
        if (event.key === ' ' && this.hasAnswered) {
            event.preventDefault();
            this.nextQuestion();
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
        document.getElementById('pointsIndicator').textContent = `Points: ${question.points || 10}`;
        
        // Update progress bar
        const progress = ((this.currentQuestionIndex) / this.questions.length) * 100;
        document.getElementById('progressFill').style.width = progress + '%';

        // Create options
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionElement.dataset.index = index;
            
            optionElement.addEventListener('click', () => {
                if (!this.hasAnswered) {
                    this.selectOption(index);
                }
            });

            optionsContainer.appendChild(optionElement);
        });

        // Hide next button
        document.getElementById('nextButton').style.display = 'none';

        // Start question timer
        this.startQuestionTimer();
    }

    startQuestionTimer(initialTime = 15) {
        let timeLeft = initialTime;
        const timerElement = document.getElementById('questionTimer');
        if (timerElement) {
            timerElement.textContent = `⏱️ ${timeLeft}s`;
            timerElement.classList.remove('warning');
        }

        this.questionTimer = setInterval(() => {
            timeLeft--;
            const timerElement = document.getElementById('questionTimer');
            if (timerElement) {
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
            }
        }, 1000);
    }

    selectOption(index) {
        if (this.hasAnswered) return;

        clearInterval(this.questionTimer);
        this.hasAnswered = true;
        this.selectedAnswer = index;

        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        const isCorrect = index === question.correct;

        // Mark selected option
        options[index].classList.add('selected');

        // Show correct answer
        setTimeout(() => {
            options[question.correct].classList.add('correct');
            
            if (!isCorrect) {
                options[index].classList.add('incorrect');
            }

            this.processAnswer(isCorrect, question);
        }, 500);
    }

    timeUpForQuestion() {
        this.hasAnswered = true;
        const question = this.questions[this.currentQuestionIndex];
        const options = document.querySelectorAll('.option');
        
        // Show correct answer
        options[question.correct].classList.add('correct');
        
        // Show "Time's up!" message
        const timerElement = document.getElementById('questionTimer');
        timerElement.textContent = "⏰ Time's up!";
        timerElement.classList.add('warning');

        this.processAnswer(false, question);
    }

    processAnswer(isCorrect, question) {
        const timeBonus = this.calculateTimeBonus();
        let points = 0;

        if (isCorrect) {
            this.correctAnswers++;
            points = (question.points || 10) + timeBonus;
            this.score += points;
            
            // Show points earned animation
            this.showPointsAnimation(points);
        }

        // Update score display with enhanced feedback
        if (window.eduGameApp) {
            window.eduGameApp.updateScore(this.score);
            if (isCorrect) {
                window.eduGameApp.playSound('correct');
            }
        } else {
            document.getElementById('currentScore').textContent = this.score;
        }

        // Show next button after a delay
        setTimeout(() => {
            document.getElementById('nextButton').style.display = 'block';
            document.getElementById('nextButton').focus();
        }, 1500);
    }

    calculateTimeBonus() {
        if (!this.questionStartTime) return 0;
        
        const timeElapsed = (Date.now() - this.questionStartTime) / 1000;
        const maxTime = 15;
        const remainingTime = Math.max(0, maxTime - timeElapsed);
        
        // Bonus points based on speed (0-5 points)
        return Math.round((remainingTime / maxTime) * 5);
    }

    showPointsAnimation(points) {
        const pointsElement = document.createElement('div');
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            font-weight: bold;
            color: var(--success-color);
            z-index: 1000;
            pointer-events: none;
            animation: pointsFloat 2s ease-out forwards;
        `;

        // Add animation keyframes
        if (!document.getElementById('pointsAnimation')) {
            const style = document.createElement('style');
            style.id = 'pointsAnimation';
            style.textContent = `
                @keyframes pointsFloat {
                    0% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    50% { opacity: 1; transform: translate(-50%, -60%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -70%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(pointsElement);
        
        setTimeout(() => {
            document.body.removeChild(pointsElement);
        }, 2000);
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
            subject: 'math',
            score: this.score,
            correct: this.correctAnswers,
            total: this.questions.length,
            timeTaken: totalTime,
            gameType: 'quiz'
        };

        // Show result modal
        if (window.eduGameApp) {
            setTimeout(() => {
                window.eduGameApp.showResultModal(result);
            }, 1000);
        }
    }

    timeUp() {
        this.endGame();
    }

    end() {
        this.isActive = false;
        clearInterval(this.questionTimer);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
    }

    // Method to pause the game
    pause() {
        this.isActive = false;
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.pausedTimeLeft = this.getCurrentTimeLeft();
        }
    }

    // Method to resume the game
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
            return match ? parseInt(match[1]) : 15;
        }
        return 15;
    }

    // Get current game state
    getGameState() {
        return {
            currentQuestionIndex: this.currentQuestionIndex,
            score: this.score,
            correctAnswers: this.correctAnswers,
            totalQuestions: this.questions.length,
            isActive: this.isActive
        };
    }
}

// Export for use in other modules
window.MathQuiz = MathQuiz;
