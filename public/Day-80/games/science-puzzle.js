// Science Puzzle Drag and Drop Game
class SciencePuzzle {
    constructor() {
        this.matches = [];
        this.currentMatches = [];
        this.completedMatches = 0;
        this.score = 0;
        this.startTime = null;
        this.isActive = false;
        this.draggedElement = null;
        this.totalMatches = 0;
    }

    start() {
        this.isActive = true;
        this.startTime = Date.now();
        this.matches = QuestionUtils.getRandomMatches(8);
        this.currentMatches = [...this.matches];
        this.totalMatches = this.matches.length;
        this.completedMatches = 0;
        this.score = 0;

        this.setupGameInterface();
        this.createDragDropElements();
        this.setupDragAndDrop();
    }

    setupGameInterface() {
        const gameContent = document.getElementById('gameContent');
        gameContent.innerHTML = `
            <div class="puzzle-container">
                <div class="puzzle-header">
                    <h3>Match the items with their descriptions</h3>
                    <div class="puzzle-progress">
                        <span id="matchesCompleted">0</span> / <span id="totalMatches">${this.totalMatches}</span> matches
                    </div>
                </div>
                <div class="puzzle-grid">
                    <div class="drag-section">
                        <h4>Items</h4>
                        <div class="drag-items" id="dragItems">
                            <!-- Drag items will be populated here -->
                        </div>
                    </div>
                    <div class="drop-section">
                        <h4>Descriptions</h4>
                        <div class="drop-zones" id="dropZones">
                            <!-- Drop zones will be populated here -->
                        </div>
                    </div>
                </div>
                <div class="puzzle-feedback" id="puzzleFeedback">
                    <!-- Feedback messages will appear here -->
                </div>
                <div class="puzzle-actions">
                    <button class="btn secondary" id="hintButton">💡 Hint</button>
                    <button class="btn warning" id="shuffleButton">🔄 Shuffle</button>
                </div>
            </div>
        `;

        // Add puzzle-specific styles
        this.addPuzzleStyles();
        this.setupEventListeners();
    }

    addPuzzleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .puzzle-header {
                text-align: center;
                margin-bottom: 2rem;
            }
            .puzzle-progress {
                color: var(--text-secondary);
                font-weight: 600;
                margin-top: 0.5rem;
            }
            .puzzle-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 3rem;
                margin-bottom: 2rem;
            }
            .drag-section h4,
            .drop-section h4 {
                text-align: center;
                margin-bottom: 1rem;
                color: var(--primary-color);
            }
            .drag-items,
            .drop-zones {
                display: grid;
                gap: 1rem;
                min-height: 300px;
            }
            .drag-item {
                background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
                color: white;
                padding: 1rem;
                border-radius: var(--radius-lg);
                cursor: grab;
                user-select: none;
                transition: all 0.3s ease;
                text-align: center;
                font-weight: 600;
                box-shadow: var(--shadow-md);
                position: relative;
                overflow: hidden;
            }
            .drag-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                transition: left 0.5s ease;
            }
            .drag-item:hover::before {
                left: 100%;
            }
            .drag-item:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: var(--shadow-lg);
            }
            .drag-item:active {
                cursor: grabbing;
                transform: scale(1.05);
            }
            .drag-item.dragging {
                opacity: 0.7;
                transform: rotate(5deg) scale(1.1);
                z-index: 1000;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .drop-zone {
                background: var(--bg-primary);
                border: 3px dashed var(--border-color);
                padding: 1.5rem;
                border-radius: var(--radius-lg);
                min-height: 80px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                text-align: center;
                font-weight: 500;
                position: relative;
            }
            .drop-zone.drag-over {
                border-color: var(--primary-color);
                background: rgba(99, 102, 241, 0.1);
                transform: scale(1.02);
            }
            .drop-zone.correct {
                border-color: var(--success-color);
                background: rgba(16, 185, 129, 0.1);
                animation: correctMatch 0.6s ease;
            }
            .drop-zone.incorrect {
                border-color: var(--danger-color);
                background: rgba(239, 68, 68, 0.1);
                animation: incorrectMatch 0.4s ease;
            }
            .drop-zone.filled {
                border-style: solid;
                background: rgba(99, 102, 241, 0.05);
            }
            @keyframes correctMatch {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            @keyframes incorrectMatch {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            .puzzle-feedback {
                min-height: 60px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 600;
                font-size: 1.1rem;
                margin-bottom: 1rem;
                border-radius: var(--radius-lg);
                padding: 1rem;
                transition: all 0.3s ease;
            }
            .puzzle-feedback.success {
                background: rgba(16, 185, 129, 0.1);
                color: var(--success-color);
                border: 1px solid var(--success-color);
            }
            .puzzle-feedback.error {
                background: rgba(239, 68, 68, 0.1);
                color: var(--danger-color);
                border: 1px solid var(--danger-color);
            }
            .puzzle-feedback.hint {
                background: rgba(245, 158, 11, 0.1);
                color: var(--warning-color);
                border: 1px solid var(--warning-color);
            }
            .puzzle-actions {
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            .match-indicator {
                position: absolute;
                top: -10px;
                right: -10px;
                background: var(--success-color);
                color: white;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                opacity: 0;
                transform: scale(0);
                animation: showIndicator 0.5s ease forwards;
                box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
            }
            @keyframes showIndicator {
                0% { opacity: 0; transform: scale(0) rotate(-180deg); }
                50% { opacity: 1; transform: scale(1.2) rotate(-90deg); }
                100% { opacity: 1; transform: scale(1) rotate(0deg); }
            }
            .drag-item {
                position: relative;
            }
            .drag-item.completed {
                opacity: 0.6;
                transform: scale(0.95);
                filter: grayscale(50%);
                pointer-events: none;
            }
            @media (max-width: 768px) {
                .puzzle-grid {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                }
                .puzzle-actions {
                    flex-direction: column;
                }
            }
        `;
        document.head.appendChild(style);
    }

    setupEventListeners() {
        document.getElementById('hintButton').addEventListener('click', () => {
            this.showHint();
        });

        document.getElementById('shuffleButton').addEventListener('click', () => {
            this.shuffleItems();
        });
    }

    createDragDropElements() {
        const dragItemsContainer = document.getElementById('dragItems');
        const dropZonesContainer = document.getElementById('dropZones');

        // Clear containers
        dragItemsContainer.innerHTML = '';
        dropZonesContainer.innerHTML = '';

        // Shuffle the items and targets separately
        const shuffledItems = this.shuffleArray([...this.matches]);
        const shuffledTargets = this.shuffleArray([...this.matches]);

        // Create drag items
        shuffledItems.forEach((match, index) => {
            const dragItem = document.createElement('div');
            dragItem.className = 'drag-item';
            dragItem.textContent = match.item;
            dragItem.draggable = true;
            dragItem.dataset.item = match.item;
            dragItem.dataset.target = match.target;
            dragItem.id = `drag-${index}`;

            dragItemsContainer.appendChild(dragItem);
        });

        // Create drop zones
        shuffledTargets.forEach((match, index) => {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.textContent = match.target;
            dropZone.dataset.target = match.target;
            dropZone.dataset.item = match.item;
            dropZone.id = `drop-${index}`;

            dropZonesContainer.appendChild(dropZone);
        });
    }

    setupDragAndDrop() {
        const dragItems = document.querySelectorAll('.drag-item');
        const dropZones = document.querySelectorAll('.drop-zone');

        // Add drag event listeners to drag items
        dragItems.forEach(item => {
            item.addEventListener('dragstart', this.handleDragStart.bind(this));
            item.addEventListener('dragend', this.handleDragEnd.bind(this));
        });

        // Add drop event listeners to drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', this.handleDragOver.bind(this));
            zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
            zone.addEventListener('drop', this.handleDrop.bind(this));
        });

        // Add touch support for mobile devices
        this.setupTouchSupport();
    }

    setupTouchSupport() {
        const dragItems = document.querySelectorAll('.drag-item');
        
        dragItems.forEach(item => {
            item.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
            item.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
            item.addEventListener('touchend', this.handleTouchEnd.bind(this));
        });
    }

    handleDragStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        this.draggedElement = null;
    }

    handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.dataTransfer.dropEffect = 'move';
        return false;
    }

    handleDragEnter(e) {
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    handleDrop(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
        }

        e.target.classList.remove('drag-over');

        if (this.draggedElement) {
            this.checkMatch(this.draggedElement, e.target);
        }

        return false;
    }

    // Touch support methods
    handleTouchStart(e) {
        this.draggedElement = e.target;
        e.target.classList.add('dragging');
        
        // Store initial touch position
        const touch = e.touches[0];
        this.touchOffset = {
            x: touch.clientX - e.target.offsetLeft,
            y: touch.clientY - e.target.offsetTop
        };
    }

    handleTouchMove(e) {
        e.preventDefault();
        
        if (this.draggedElement) {
            const touch = e.touches[0];
            this.draggedElement.style.position = 'absolute';
            this.draggedElement.style.left = (touch.clientX - this.touchOffset.x) + 'px';
            this.draggedElement.style.top = (touch.clientY - this.touchOffset.y) + 'px';
            this.draggedElement.style.zIndex = '1000';
        }
    }

    handleTouchEnd(e) {
        if (this.draggedElement) {
            const touch = e.changedTouches[0];
            const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Reset position
            this.draggedElement.style.position = '';
            this.draggedElement.style.left = '';
            this.draggedElement.style.top = '';
            this.draggedElement.style.zIndex = '';
            this.draggedElement.classList.remove('dragging');
            
            // Check if dropped on a valid drop zone
            if (elementBelow && elementBelow.classList.contains('drop-zone')) {
                this.checkMatch(this.draggedElement, elementBelow);
            }
            
            this.draggedElement = null;
        }
    }

    checkMatch(dragItem, dropZone) {
        const dragTarget = dragItem.dataset.target;
        const dropTarget = dropZone.dataset.target;
        const isCorrect = dragTarget === dropTarget;

        if (isCorrect) {
            this.handleCorrectMatch(dragItem, dropZone);
        } else {
            this.handleIncorrectMatch(dragItem, dropZone);
        }
    }

    handleCorrectMatch(dragItem, dropZone) {
        // Calculate points based on time and attempts
        const points = this.calculatePoints();
        this.score += points;
        this.completedMatches++;

        // Visual feedback
        dropZone.classList.add('correct', 'filled');
        dropZone.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span>${dragItem.textContent}</span>
                <span>→</span>
                <span>${dropZone.dataset.target}</span>
            </div>
            <div class="match-indicator">✓</div>
        `;

        // Remove the drag item
        dragItem.remove();

        // Update progress
        document.getElementById('matchesCompleted').textContent = this.completedMatches;

        // Update score with enhanced feedback
        if (window.eduGameApp) {
            window.eduGameApp.updateScore(this.score);
            window.eduGameApp.playSound('correct');
        } else {
            document.getElementById('currentScore').textContent = this.score;
        }

        // Show success feedback
        this.showFeedback(`Correct! +${points} points`, 'success');

        // Check if game is complete
        if (this.completedMatches === this.totalMatches) {
            setTimeout(() => {
                this.endGame();
            }, 1500);
        }
    }

    handleIncorrectMatch(dragItem, dropZone) {
        // Visual feedback for incorrect match
        dropZone.classList.add('incorrect');
        
        setTimeout(() => {
            dropZone.classList.remove('incorrect');
        }, 600);

        // Show error feedback
        this.showFeedback('Not quite right! Try again.', 'error');

        // Add a small penalty to score (optional)
        this.score = Math.max(0, this.score - 5);
        if (window.eduGameApp) {
            window.eduGameApp.updateScore(this.score);
            window.eduGameApp.playSound('incorrect');
        } else {
            document.getElementById('currentScore').textContent = this.score;
        }
    }

    calculatePoints() {
        // Base points
        let points = 25;
        
        // Time bonus (faster = more points)
        const timeElapsed = (Date.now() - this.startTime) / 1000;
        const timeBonus = Math.max(0, 10 - Math.floor(timeElapsed / 10));
        
        return points + timeBonus;
    }

    showFeedback(message, type) {
        const feedback = document.getElementById('puzzleFeedback');
        feedback.textContent = message;
        feedback.className = `puzzle-feedback ${type}`;
        
        setTimeout(() => {
            feedback.textContent = '';
            feedback.className = 'puzzle-feedback';
        }, 3000);
    }

    showHint() {
        const remainingItems = document.querySelectorAll('.drag-item');
        if (remainingItems.length === 0) return;

        // Get a random remaining item
        const randomItem = remainingItems[Math.floor(Math.random() * remainingItems.length)];
        const targetDescription = randomItem.dataset.target;

        // Find the corresponding drop zone
        const targetZone = document.querySelector(`[data-target="${targetDescription}"]`);
        
        if (targetZone) {
            // Highlight the target zone
            targetZone.style.background = 'rgba(245, 158, 11, 0.2)';
            targetZone.style.borderColor = 'var(--warning-color)';
            
            // Show hint message
            this.showFeedback(`Hint: "${randomItem.textContent}" goes with the highlighted description`, 'hint');
            
            // Remove highlight after 3 seconds
            setTimeout(() => {
                targetZone.style.background = '';
                targetZone.style.borderColor = '';
            }, 3000);
        }
    }

    shuffleItems() {
        const dragItems = Array.from(document.querySelectorAll('.drag-item'));
        const container = document.getElementById('dragItems');
        
        // Shuffle the array
        const shuffled = this.shuffleArray(dragItems);
        
        // Clear container and add shuffled items
        container.innerHTML = '';
        shuffled.forEach(item => container.appendChild(item));
        
        this.showFeedback('Items shuffled!', 'hint');
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    endGame() {
        this.isActive = false;
        
        const endTime = Date.now();
        const totalTime = Math.round((endTime - this.startTime) / 1000);
        
        const result = {
            subject: 'science',
            score: this.score,
            correct: this.completedMatches,
            total: this.totalMatches,
            timeTaken: totalTime,
            gameType: 'puzzle'
        };

        // Show completion message
        this.showFeedback('🎉 Puzzle Complete! Well done!', 'success');

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
    }

    // Pause game functionality
    pause() {
        this.isActive = false;
    }

    // Resume game functionality  
    resume() {
        this.isActive = true;
    }

    // Get current game state
    getGameState() {
        return {
            completedMatches: this.completedMatches,
            totalMatches: this.totalMatches,
            score: this.score,
            isActive: this.isActive
        };
    }
}

// Export for use in other modules
window.SciencePuzzle = SciencePuzzle;
