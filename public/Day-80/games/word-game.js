// English Word Game - Word Scramble and Vocabulary Builder
class WordGame {
    constructor() {
        this.words = [];
        this.vocabularyQuestions = [];
        this.currentGameMode = 'scramble'; // 'scramble' or 'vocabulary'
        this.currentWordIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.startTime = null;
        this.wordStartTime = null;
        this.isActive = false;
        this.hasAnswered = false;
        this.wordTimer = null;
        this.currentWord = null;
        this.attempts = 0;
        this.maxAttempts = 3;
    }

    start() {
        this.isActive = true;
        this.startTime = Date.now();
        this.currentWordIndex = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.attempts = 0;
        
        // Randomly choose game mode or let user choose
        this.currentGameMode = Math.random() > 0.5 ? 'scramble' : 'vocabulary';
        
        if (this.currentGameMode === 'scramble') {
            this.words = QuestionUtils.getRandomWords(8);
        } else {
            this.vocabularyQuestions = QuestionUtils.getVocabularyQuestions(6);
        }

        this.setupGameInterface();
        this.showNextChallenge();
    }

    setupGameInterface() {
        const gameContent = document.getElementById('gameContent');
        
        if (this.currentGameMode === 'scramble') {
            this.setupScrambleInterface();
        } else {
            this.setupVocabularyInterface();
        }

        this.setupEventListeners();
    }

    setupScrambleInterface() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="word-game-container">
                <div class="game-mode-indicator">
                    <span class="mode-badge scramble">📝 Word Scramble</span>
                </div>
                <div class="word-progress">
                    <span id="currentWord">1</span> / <span id="totalWords">${this.words.length}</span>
                </div>
                <div class="scramble-content">
                    <div class="scrambled-word" id="scrambledWord">LOADING...</div>
                    <div class="word-hint" id="wordHint">Think carefully...</div>
                    <div class="word-timer" id="wordTimer">⏱️ 30s</div>
                    
                    <div class="word-input-section">
                        <input type="text" 
                               class="word-input" 
                               id="wordInput" 
                               placeholder="Type the unscrambled word..."
                               autocomplete="off"
                               spellcheck="false">
                        <div class="input-actions">
                            <button class="btn primary" id="submitWordBtn">Submit</button>
                            <button class="btn secondary" id="skipWordBtn">Skip</button>
                        </div>
                    </div>
                    
                    <div class="word-feedback" id="wordFeedback"></div>
                    
                    <div class="word-actions">
                        <button class="btn warning" id="hintBtn">💡 Show Hint</button>
                        <button class="btn secondary" id="scrambleAgainBtn">🔄 Scramble Again</button>
                    </div>
                    
                    <div class="attempts-counter">
                        Attempts: <span id="attemptsCount">0</span> / <span id="maxAttempts">${this.maxAttempts}</span>
                    </div>
                </div>
            </div>
        `;

        this.addWordGameStyles();
    }

    setupVocabularyInterface() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="word-game-container">
                <div class="game-mode-indicator">
                    <span class="mode-badge vocabulary">📖 Vocabulary Builder</span>
                </div>
                <div class="word-progress">
                    <span id="currentWord">1</span> / <span id="totalWords">${this.vocabularyQuestions.length}</span>
                </div>
                <div class="vocabulary-content">
                    <div class="vocabulary-word" id="vocabularyWord">LOADING...</div>
                    <div class="word-definition" id="wordDefinition">Definition will appear here...</div>
                    <div class="word-timer" id="wordTimer">⏱️ 20s</div>
                    
                    <div class="vocabulary-options" id="vocabularyOptions">
                        <!-- Options will be populated here -->
                    </div>
                    
                    <div class="word-feedback" id="wordFeedback"></div>
                </div>
            </div>
        `;

        this.addWordGameStyles();
    }

    addWordGameStyles() {
        const style = document.createElement('style');
        style.id = 'wordGameStyles';
        style.textContent = `
            .word-game-container {
                max-width: 600px;
                margin: 0 auto;
                text-align: center;
            }
            .game-mode-indicator {
                margin-bottom: 1.5rem;
            }
            .mode-badge {
                display: inline-block;
                padding: 0.5rem 1rem;
                border-radius: var(--radius-lg);
                font-weight: 600;
                font-size: 1.1rem;
            }
            .mode-badge.scramble {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
            }
            .mode-badge.vocabulary {
                background: linear-gradient(135deg, #4facfe, #00f2fe);
                color: white;
            }
            .word-progress {
                color: var(--text-secondary);
                margin-bottom: 2rem;
                font-weight: 600;
            }
            .scrambled-word {
                font-size: 2.5rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 1rem;
                letter-spacing: 0.3em;
                text-transform: uppercase;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: pulse 2s infinite;
            }
            .vocabulary-word {
                font-size: 2.2rem;
                font-weight: 700;
                color: var(--primary-color);
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .word-definition {
                font-size: 1.2rem;
                color: var(--text-secondary);
                margin-bottom: 2rem;
                font-style: italic;
                line-height: 1.6;
                padding: 1rem;
                background: var(--bg-secondary);
                border-radius: var(--radius-lg);
                border-left: 4px solid var(--primary-color);
            }
            .word-hint {
                color: var(--text-secondary);
                margin-bottom: 1rem;
                font-style: italic;
                font-size: 1.1rem;
                padding: 0.5rem 1rem;
                background: var(--bg-secondary);
                border-radius: var(--radius-md);
                display: none;
            }
            .word-hint.visible {
                display: block;
                animation: slideDown 0.3s ease;
            }
            .word-timer {
                color: var(--warning-color);
                font-weight: 600;
                margin-bottom: 1.5rem;
                font-size: 1.1rem;
            }
            .word-timer.warning {
                color: var(--danger-color);
                animation: pulse 1s infinite;
            }
            .word-input-section {
                margin-bottom: 2rem;
            }
            .word-input {
                width: 100%;
                max-width: 400px;
                padding: 1rem 1.5rem;
                font-size: 1.3rem;
                border: 3px solid var(--border-color);
                border-radius: var(--radius-lg);
                background: var(--bg-primary);
                color: var(--text-primary);
                text-align: center;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 0.1em;
            }
            .word-input:focus {
                outline: none;
                border-color: var(--primary-color);
                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                transform: scale(1.02);
            }
            .word-input.correct {
                border-color: var(--success-color);
                background: rgba(16, 185, 129, 0.1);
            }
            .word-input.incorrect {
                border-color: var(--danger-color);
                background: rgba(239, 68, 68, 0.1);
                animation: shake 0.5s ease;
            }
            .input-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            .vocabulary-options {
                display: grid;
                gap: 1rem;
                margin-bottom: 2rem;
            }
            .vocab-option {
                background: var(--bg-primary);
                border: 2px solid var(--border-color);
                padding: 1rem;
                border-radius: var(--radius-lg);
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
                font-size: 1.1rem;
            }
            .vocab-option:hover {
                border-color: var(--primary-color);
                transform: translateY(-2px);
                box-shadow: var(--shadow-md);
            }
            .vocab-option.selected {
                border-color: var(--primary-color);
                background: rgba(99, 102, 241, 0.1);
            }
            .vocab-option.correct {
                border-color: var(--success-color);
                background: rgba(16, 185, 129, 0.1);
            }
            .vocab-option.incorrect {
                border-color: var(--danger-color);
                background: rgba(239, 68, 68, 0.1);
            }
            .word-feedback {
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 2rem;
                border-radius: var(--radius-lg);
                padding: 1rem;
                transition: all 0.3s ease;
            }
            .word-feedback.success {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
                border: 1px solid var(--success-color);
            }
            .word-feedback.error {
                background: rgba(239, 68, 68, 0.1);
                color: var(--danger-color);
                border: 1px solid var(--danger-color);
            }
            .word-feedback.hint {
                background: rgba(245, 158, 11, 0.1);
                color: var(--warning-color);
                border: 1px solid var(--warning-color);
            }
            .word-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
                margin-bottom: 1rem;
            }
            .attempts-counter {
                color: var(--text-secondary);
                font-weight: 600;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.7; }
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            @keyframes slideDown {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @media (max-width: 768px) {
                .scrambled-word, .vocabulary-word {
                    font-size: 2rem;
                }
                .word-input {
                    font-size: 1.1rem;
                }
                .word-actions, .input-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        if (this.currentGameMode === 'scramble') {
            const wordInput = document.getElementById('wordInput');
            const submitBtn = document.getElementById('submitWordBtn');
            const skipBtn = document.getElementById('skipWordBtn');
            const hintBtn = document.getElementById('hintBtn');
            const scrambleBtn = document.getElementById('scrambleAgainBtn');

            submitBtn.addEventListener('click', () => this.submitAnswer());
            skipBtn.addEventListener('click', () => this.skipWord());
            hintBtn.addEventListener('click', () => this.showHint());
            scrambleBtn.addEventListener('click', () => this.scrambleAgain());

            wordInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.submitAnswer();
                }
            });

            wordInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.toUpperCase();
            });
        } else {
            // Vocabulary mode event listeners will be added when options are created
        }

        // Global keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
    }

    handleKeyPress(event) {
        if (!this.isActive) return;

        if (this.currentGameMode === 'vocabulary' && !this.hasAnswered) {
            // Number keys 1-4 for selecting vocabulary options
            if (event.key >= '1' && event.key <= '4') {
                const optionIndex = parseInt(event.key) - 1;
                const options = document.querySelectorAll('.vocab-option');
                if (options[optionIndex]) {
                    this.selectVocabularyOption(optionIndex);
                }
            }
        }
    }

    showNextChallenge() {
        if (this.currentGameMode === 'scramble') {
            this.showNextWord();
        } else {
            this.showNextVocabulary();
        }
    }

    showNextWord() {
        if (this.currentWordIndex >= this.words.length) {
            this.endGame();
            return;
        }

        this.hasAnswered = false;
        this.attempts = 0;
        this.wordStartTime = Date.now();
        this.currentWord = this.words[this.currentWordIndex];

        // Update UI
        document.getElementById('currentWord').textContent = this.currentWordIndex + 1;
        document.getElementById('totalWords').textContent = this.words.length;
        document.getElementById('scrambledWord').textContent = this.currentWord.scrambled;
        document.getElementById('wordInput').value = '';
        document.getElementById('wordInput').classList.remove('correct', 'incorrect');
        document.getElementById('wordFeedback').textContent = '';
        document.getElementById('wordFeedback').className = 'word-feedback';
        document.getElementById('wordHint').classList.remove('visible');
        document.getElementById('attemptsCount').textContent = this.attempts;

        // Focus input
        document.getElementById('wordInput').focus();

        // Start word timer
        this.startWordTimer(30);
    }

    showNextVocabulary() {
        if (this.currentWordIndex >= this.vocabularyQuestions.length) {
            this.endGame();
            return;
        }

        this.hasAnswered = false;
        this.wordStartTime = Date.now();
        const question = this.vocabularyQuestions[this.currentWordIndex];

        // Update UI
        document.getElementById('currentWord').textContent = this.currentWordIndex + 1;
        document.getElementById('totalWords').textContent = this.vocabularyQuestions.length;
        document.getElementById('vocabularyWord').textContent = question.word;
        document.getElementById('wordDefinition').textContent = question.definition;
        document.getElementById('wordFeedback').textContent = '';
        document.getElementById('wordFeedback').className = 'word-feedback';

        // Create options
        this.createVocabularyOptions(question);

        // Start word timer
        this.startWordTimer(20);
    }

    createVocabularyOptions(question) {
        const optionsContainer = document.getElementById('vocabularyOptions');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'vocab-option';
            optionElement.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            optionElement.dataset.index = index;

            optionElement.addEventListener('click', () => {
                if (!this.hasAnswered) {
                    this.selectVocabularyOption(index);
                }
            });

            optionsContainer.appendChild(optionElement);
        });
    }

    selectVocabularyOption(index) {
        if (this.hasAnswered) return;

        clearInterval(this.wordTimer);
        this.hasAnswered = true;

        const question = this.vocabularyQuestions[this.currentWordIndex];
        const options = document.querySelectorAll('.vocab-option');
        const isCorrect = index === question.correct;

        // Mark selected option
        options[index].classList.add('selected');

        // Show correct answer after delay
        setTimeout(() => {
            options[question.correct].classList.add('correct');
            
            if (!isCorrect) {
                options[index].classList.add('incorrect');
            }

            this.processVocabularyAnswer(isCorrect, question);
        }, 500);
    }

    processVocabularyAnswer(isCorrect, question) {
        if (isCorrect) {
            this.correctAnswers++;
            const timeBonus = this.calculateTimeBonus(20);
            const points = (question.points || 20) + timeBonus;
            this.score += points;
            
            this.showFeedback(`Excellent! +${points} points`, 'success');
            this.showPointsAnimation(points);
        } else {
            this.showFeedback(`Incorrect. The answer was "${question.options[question.correct]}"`, 'error');
        }

        // Update score
        this.updateScore();

        // Move to next question after delay
        setTimeout(() => {
            this.currentWordIndex++;
            this.showNextChallenge();
        }, 3000);
    }

    startWordTimer(duration) {
        let timeLeft = duration;
        const timerElement = document.getElementById('wordTimer');
        timerElement.textContent = `⏱️ ${timeLeft}s`;
        timerElement.classList.remove('warning');

        this.wordTimer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `⏱️ ${timeLeft}s`;

            if (timeLeft <= 5) {
                timerElement.classList.add('warning');
            }

            if (timeLeft <= 0) {
                clearInterval(this.wordTimer);
                if (!this.hasAnswered) {
                    this.timeUpForWord();
                }
            }
        }, 1000);
    }

    submitAnswer() {
        if (this.hasAnswered) return;

        const input = document.getElementById('wordInput');
        const userAnswer = input.value.trim().toUpperCase();
        const correctAnswer = this.currentWord.word.toUpperCase();

        this.attempts++;
        document.getElementById('attemptsCount').textContent = this.attempts;

        if (userAnswer === correctAnswer) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer(userAnswer);
        }
    }

    handleCorrectAnswer() {
        clearInterval(this.wordTimer);
        this.hasAnswered = true;
        this.correctAnswers++;

        const timeBonus = this.calculateTimeBonus(30);
        const attemptBonus = Math.max(0, (this.maxAttempts - this.attempts) * 5);
        const difficultyBonus = this.currentWord.difficulty === 'hard' ? 10 : 
                               this.currentWord.difficulty === 'medium' ? 5 : 0;
        const points = (this.currentWord.points || 15) + timeBonus + attemptBonus + difficultyBonus;
        
        this.score += points;

        // Visual feedback
        const input = document.getElementById('wordInput');
        input.classList.add('correct');
        this.showFeedback(`Perfect! +${points} points`, 'success');
        this.showPointsAnimation(points);
        
        // Play success sound
        if (window.eduGameApp) {
            window.eduGameApp.playSound('correct');
        }

        // Update score
        this.updateScore();

        // Move to next word after delay
        setTimeout(() => {
            this.currentWordIndex++;
            this.showNextChallenge();
        }, 2500);
    }

    handleIncorrectAnswer(userAnswer) {
        const input = document.getElementById('wordInput');
        input.classList.add('incorrect');
        
        setTimeout(() => {
            input.classList.remove('incorrect');
        }, 500);

        if (this.attempts >= this.maxAttempts) {
            this.hasAnswered = true;
            clearInterval(this.wordTimer);
            this.showFeedback(`Out of attempts! The word was "${this.currentWord.word}"`, 'error');
            
            setTimeout(() => {
                this.currentWordIndex++;
                this.showNextChallenge();
            }, 3000);
        } else {
            this.showFeedback(`Try again! ${this.maxAttempts - this.attempts} attempts left`, 'error');
            input.focus();
        }
    }

    timeUpForWord() {
        this.hasAnswered = true;
        
        if (this.currentGameMode === 'scramble') {
            this.showFeedback(`Time's up! The word was "${this.currentWord.word}"`, 'error');
        } else {
            const question = this.vocabularyQuestions[this.currentWordIndex];
            const options = document.querySelectorAll('.vocab-option');
            options[question.correct].classList.add('correct');
            this.showFeedback(`Time's up! The answer was "${question.options[question.correct]}"`, 'error');
        }

        setTimeout(() => {
            this.currentWordIndex++;
            this.showNextChallenge();
        }, 3000);
    }

    skipWord() {
        if (this.hasAnswered) return;

        clearInterval(this.wordTimer);
        this.hasAnswered = true;
        
        // Small penalty for skipping
        this.score = Math.max(0, this.score - 5);
        this.updateScore();

        this.showFeedback(`Skipped! The word was "${this.currentWord.word}"`, 'hint');

        setTimeout(() => {
            this.currentWordIndex++;
            this.showNextChallenge();
        }, 2000);
    }

    showHint() {
        const hintElement = document.getElementById('wordHint');
        hintElement.textContent = this.currentWord.hint;
        hintElement.classList.add('visible');
        
        // Small penalty for using hint
        this.score = Math.max(0, this.score - 3);
        this.updateScore();
        
        this.showFeedback('Hint revealed! (-3 points)', 'hint');
    }

    scrambleAgain() {
        // Create a new scrambled version
        const word = this.currentWord.word;
        const newScrambled = this.scrambleWord(word);
        document.getElementById('scrambledWord').textContent = newScrambled;
        this.currentWord.scrambled = newScrambled;
        
        this.showFeedback('Word re-scrambled!', 'hint');
    }

    scrambleWord(word) {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
    }

    calculateTimeBonus(maxTime) {
        if (!this.wordStartTime) return 0;
        
        const timeElapsed = (Date.now() - this.wordStartTime) / 1000;
        const remainingTime = Math.max(0, maxTime - timeElapsed);
        
        return Math.round((remainingTime / maxTime) * 10);
    }

    showPointsAnimation(points) {
        const pointsElement = document.createElement('div');
        pointsElement.textContent = `+${points}`;
        pointsElement.style.cssText = `
            position: fixed;
            top: 40%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2.5rem;
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
        const feedback = document.getElementById('wordFeedback');
        feedback.textContent = message;
        feedback.className = `word-feedback ${type}`;
    }

    updateScore() {
        if (window.eduGameApp) {
            window.eduGameApp.updateScore(this.score);
        } else {
            document.getElementById('currentScore').textContent = this.score;
        }
    }

    endGame() {
        this.isActive = false;
        clearInterval(this.wordTimer);
        
        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000);
        const totalChallenges = this.currentGameMode === 'scramble' ? this.words.length : this.vocabularyQuestions.length;
        
        const result = {
            subject: 'english',
            score: this.score,
            correct: this.correctAnswers,
            total: totalChallenges,
            timeTaken: totalTime,
            gameType: this.currentGameMode
        };

        // Show completion message
        this.showFeedback('🎉 Game Complete! Great job with words!', 'success');

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
        clearInterval(this.wordTimer);
        
        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyPress);
        
        // Remove styles
        const styleElement = document.getElementById('wordGameStyles');
        if (styleElement) {
            styleElement.remove();
        }
    }

    // Pause game functionality
    pause() {
        this.isActive = false;
        if (this.wordTimer) {
            clearInterval(this.wordTimer);
            this.pausedTimeLeft = this.getCurrentTimeLeft();
        }
    }

    // Resume game functionality
    resume() {
        this.isActive = true;
        if (!this.hasAnswered && this.pausedTimeLeft) {
            this.startWordTimer(this.pausedTimeLeft);
        }
    }

    getCurrentTimeLeft() {
        const timerText = document.getElementById('wordTimer')?.textContent;
        if (timerText) {
            const match = timerText.match(/(\d+)s/);
            return match ? parseInt(match[1]) : 30;
        }
        return 30;
    }

    // Get current game state
    getGameState() {
        return {
            currentWordIndex: this.currentWordIndex,
            score: this.score,
            correctAnswers: this.correctAnswers,
            gameMode: this.currentGameMode,
            totalChallenges: this.currentGameMode === 'scramble' ? this.words.length : this.vocabularyQuestions.length,
            isActive: this.isActive
        };
    }
}

// Export for use in other modules
window.WordGame = WordGame;
