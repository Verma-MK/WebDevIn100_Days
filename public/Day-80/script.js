// Main application controller
class EduGameApp {
    constructor() {
        this.currentGame = null;
        this.currentSubject = null;
        this.gameTimer = null;
        this.timeLeft = 0;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeTheme();
        this.updateDashboardStats();
        this.updateLeaderboard();
        this.loadUserProfile();
        this.initializeSounds();
        this.handleVisibilityChange();
        this.initializeKeyboardShortcuts();
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Profile button
        document.getElementById('profileBtn').addEventListener('click', () => {
            this.showProfile();
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            this.showSettings();
        });

        // Statistics buttons
        document.querySelectorAll('.stats-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const subject = btn.dataset.subject;
                this.showStatistics(subject);
            });
        });

        // Subject cards
        document.querySelectorAll('.subject-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.play-btn')) return;
                const subject = card.dataset.subject;
                this.startGame(subject);
            });
        });

        // Navigation buttons
        document.getElementById('backBtn').addEventListener('click', () => {
            this.showDashboard();
        });

        // Modal controls
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideResultModal();
        });

        document.getElementById('closeProfile').addEventListener('click', () => {
            this.hideProfileModal();
        });

        // Settings modal controls
        document.getElementById('closeSettings').addEventListener('click', () => {
            this.hideSettingsModal();
        });

        document.getElementById('saveSettingsBtn').addEventListener('click', () => {
            this.saveSettings();
        });

        document.getElementById('resetSettingsBtn').addEventListener('click', () => {
            this.resetSettings();
        });

        // Statistics modal controls
        document.getElementById('closeStatistics').addEventListener('click', () => {
            this.hideStatisticsModal();
        });

        // Tab switching
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        document.getElementById('playAgainBtn').addEventListener('click', () => {
            this.hideResultModal();
            this.startGame(this.currentSubject);
        });

        document.getElementById('backToDashboardBtn').addEventListener('click', () => {
            this.hideResultModal();
            this.showDashboard();
        });

        // Click outside modal to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideResultModal();
                this.hideProfileModal();
                this.hideSettingsModal();
                this.hideStatisticsModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideResultModal();
                this.hideProfileModal();
                this.hideSettingsModal();
                this.hideStatisticsModal();
            }
        });
    }

    initializeTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeIcon(savedTheme);
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        const icon = document.querySelector('#themeToggle i');
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    }

    async startGame(subject) {
        this.currentSubject = subject;
        this.showLoading();

        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            switch (subject) {
                case 'math':
                    this.currentGame = new MathQuiz();
                    break;
                case 'science':
                    this.currentGame = new SciencePuzzle();
                    break;
                case 'english':
                    this.currentGame = new WordGame();
                    break;
                case 'trivia':
                    this.currentGame = new TriviaGame();
                    break;
                default:
                    throw new Error('Unknown game type');
            }

            this.hideLoading();
            this.showGameView(subject);
            this.currentGame.start();
            this.startTimer();

        } catch (error) {
            console.error('Error starting game:', error);
            this.hideLoading();
            alert('Error starting game. Please try again.');
        }
    }

    showGameView(subject) {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('gameView').style.display = 'block';
        
        const gameTitle = document.getElementById('gameTitle');
        const subjectNames = {
            math: 'Mathematics Quiz',
            science: 'Science Puzzle',
            english: 'Word Game',
            trivia: 'General Knowledge Trivia'
        };
        
        gameTitle.textContent = subjectNames[subject] || 'Game';
        
        // Reset game stats display
        document.getElementById('currentScore').textContent = '0';
        this.updateTimer(30); // Default timer
    }

    showDashboard() {
        if (this.currentGame) {
            this.currentGame.end();
            this.currentGame = null;
        }
        
        this.stopTimer();
        document.getElementById('gameView').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        
        // Update dashboard stats
        this.updateDashboardStats();
        this.updateLeaderboard();
    }

    startTimer(duration = 30) {
        this.timeLeft = duration;
        this.updateTimer(this.timeLeft);

        this.gameTimer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer(this.timeLeft);

            if (this.timeLeft <= 0) {
                this.stopTimer();
                if (this.currentGame) {
                    this.currentGame.timeUp();
                }
            }
        }, 1000);
    }

    stopTimer() {
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
            this.gameTimer = null;
        }
    }

    updateTimer(time) {
        document.getElementById('timer').textContent = time;
        
        // Add warning class when time is running low
        const timerElement = document.querySelector('.timer');
        if (time <= 10) {
            timerElement.style.color = 'var(--danger-color)';
        } else if (time <= 20) {
            timerElement.style.color = 'var(--warning-color)';
        } else {
            timerElement.style.color = 'var(--warning-color)';
        }
    }

    updateScore(score) {
        document.getElementById('currentScore').textContent = score;
    }

    showResultModal(result) {
        const modal = document.getElementById('resultModal');
        const { score, correct, total, subject } = result;
        
        document.getElementById('finalScore').textContent = score;
        document.getElementById('correctAnswers').textContent = correct;
        document.getElementById('totalQuestions').textContent = total;
        document.getElementById('accuracy').textContent = total > 0 ? Math.round((correct / total) * 100) + '%' : '0%';
        
        // Play completion sound
        this.playSound('complete');
        
        // Save game result
        this.saveGameResult(result);
        
        // Check for new badges
        const newBadges = BadgeSystem.checkBadges(subject, result);
        this.displayEarnedBadges(newBadges);
        
        // Play badge sound if new badges earned
        if (newBadges.length > 0) {
            setTimeout(() => this.playSound('badge'), 800);
        }
        
        modal.classList.add('active');
        
        // Update dashboard stats
        setTimeout(() => {
            this.updateDashboardStats();
            this.updateLeaderboard();
        }, 500);
    }

    hideResultModal() {
        document.getElementById('resultModal').classList.remove('active');
    }

    showProfile() {
        this.updateProfileStats();
        this.updateBadgesDisplay();
        document.getElementById('profileModal').classList.add('active');
    }

    hideProfileModal() {
        document.getElementById('profileModal').classList.remove('active');
    }

    displayEarnedBadges(badges) {
        const container = document.getElementById('badgesEarned');
        container.innerHTML = '';
        
        if (badges.length > 0) {
            const title = document.createElement('h3');
            title.textContent = '🎉 New Badges Earned!';
            container.appendChild(title);
            
            const badgesContainer = document.createElement('div');
            badgesContainer.className = 'badges-grid';
            
            badges.forEach(badge => {
                const badgeElement = document.createElement('div');
                badgeElement.className = 'badge earned new';
                badgeElement.innerHTML = `
                    <span class="badge-icon">${badge.icon}</span>
                    <span class="badge-name">${badge.name}</span>
                `;
                badgesContainer.appendChild(badgeElement);
            });
            
            container.appendChild(badgesContainer);
        }
    }

    saveGameResult(result) {
        const gameData = {
            ...result,
            timestamp: Date.now(),
            date: new Date().toLocaleDateString()
        };
        
        GameStorage.saveGameResult(gameData);
    }

    updateDashboardStats() {
        const stats = GameStorage.getOverallStats();
        
        document.getElementById('totalScore').textContent = stats.totalScore.toLocaleString();
        document.getElementById('totalBadges').textContent = stats.totalBadges;
        document.getElementById('streak').textContent = stats.streak;
        
        // Update individual subject stats
        Object.keys(stats.subjects).forEach(subject => {
            const subjectStats = stats.subjects[subject];
            document.getElementById(`${subject}Best`).textContent = subjectStats.bestScore;
            document.getElementById(`${subject}Played`).textContent = subjectStats.gamesPlayed;
        });
    }

    updateLeaderboard() {
        const leaderboard = GameStorage.getLeaderboard();
        const container = document.getElementById('leaderboard');
        
        container.innerHTML = '';
        
        if (leaderboard.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No games played yet. Start playing to see the leaderboard!</p>';
            return;
        }
        
        leaderboard.slice(0, 10).forEach((entry, index) => {
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';
            
            let rankClass = '';
            if (index === 0) rankClass = 'first';
            else if (index === 1) rankClass = 'second';
            else if (index === 2) rankClass = 'third';
            
            const subjectNames = {
                math: 'Mathematics',
                science: 'Science',
                english: 'English',
                trivia: 'General Knowledge'
            };
            
            entryElement.innerHTML = `
                <div class="rank ${rankClass}">${index + 1}</div>
                <div class="player-info">
                    <div class="player-name">Player</div>
                    <div class="player-subject">${subjectNames[entry.subject] || entry.subject}</div>
                </div>
                <div class="player-score">${entry.score}</div>
            `;
            
            container.appendChild(entryElement);
        });
    }

    updateProfileStats() {
        const stats = GameStorage.getOverallStats();
        
        document.getElementById('totalGamesPlayed').textContent = stats.totalGames;
        document.getElementById('averageAccuracy').textContent = stats.averageAccuracy + '%';
        document.getElementById('totalTimePlayed').textContent = Math.round(stats.totalTimePlayed / 60);
    }

    updateBadgesDisplay() {
        const earnedBadges = BadgeSystem.getEarnedBadges();
        const allBadges = BadgeSystem.getAllBadges();
        const container = document.getElementById('badgesGrid');
        
        container.innerHTML = '';
        
        allBadges.forEach(badge => {
            const isEarned = earnedBadges.some(earned => earned.id === badge.id);
            
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge ${isEarned ? 'earned' : ''}`;
            badgeElement.innerHTML = `
                <span class="badge-icon">${badge.icon}</span>
                <span class="badge-name">${badge.name}</span>
            `;
            
            if (!isEarned) {
                badgeElement.style.opacity = '0.5';
            }
            
            container.appendChild(badgeElement);
        });
    }

    loadUserProfile() {
        // Initialize user profile if it doesn't exist
        if (!localStorage.getItem('userProfile')) {
            const defaultProfile = {
                name: 'Player',
                level: 1,
                joinDate: new Date().toISOString(),
                preferences: {
                    theme: 'light',
                    soundEnabled: true
                }
            };
            localStorage.setItem('userProfile', JSON.stringify(defaultProfile));
        }
    }

    showLoading() {
        document.getElementById('loading').style.display = 'flex';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    // Initialize sound system
    initializeSounds() {
        this.sounds = {
            correct: this.createSound('correct'),
            incorrect: this.createSound('incorrect'),
            click: this.createSound('click'),
            complete: this.createSound('complete'),
            badge: this.createSound('badge')
        };
    }

    createSound(type) {
        // Create simple audio feedback using Web Audio API
        return {
            play: () => {
                if (!localStorage.getItem('soundEnabled') || localStorage.getItem('soundEnabled') === 'true') {
                    this.playTone(type);
                }
            }
        };
    }

    playTone(type) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const frequencies = {
                correct: [523, 659, 784], // C-E-G chord
                incorrect: [200, 150], // Low, discordant
                click: [800],
                complete: [523, 659, 784, 1047], // Victory chord
                badge: [659, 523, 784]
            };
            
            const freq = frequencies[type] || [400];
            let time = audioContext.currentTime;
            
            freq.forEach((f, i) => {
                oscillator.frequency.setValueAtTime(f, time + i * 0.1);
            });
            
            gainNode.gain.setValueAtTime(0.1, time);
            gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
            
            oscillator.start(time);
            oscillator.stop(time + 0.5);
        } catch (error) {
            // Fallback for browsers without Web Audio API
            console.log('Sound:', type);
        }
    }

    // Handle tab visibility changes to pause games
    handleVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            if (this.currentGame && this.currentGame.pause && this.currentGame.resume) {
                if (document.hidden) {
                    this.currentGame.pause();
                } else {
                    this.currentGame.resume();
                }
            }
        });
    }

    // Initialize keyboard shortcuts
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Global shortcuts
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'h':
                        e.preventDefault();
                        this.showKeyboardHelp();
                        break;
                    case 't':
                        e.preventDefault();
                        this.toggleTheme();
                        break;
                }
            }
            
            // Game shortcuts
            if (e.key === '?' || e.key === '/') {
                if (!e.ctrlKey && !e.metaKey) {
                    e.preventDefault();
                    this.showKeyboardHelp();
                }
            }
        });
    }

    // Show keyboard shortcuts help modal
    showKeyboardHelp() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'keyboardHelpModal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🎮 Keyboard Shortcuts</h2>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="shortcuts-grid">
                        <div class="shortcut-section">
                            <h3>🎯 Game Controls</h3>
                            <div class="shortcut-item">
                                <kbd>1-4</kbd>
                                <span>Select answer options</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Enter</kbd>
                                <span>Next question/Submit</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Space</kbd>
                                <span>Next question</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Esc</kbd>
                                <span>Close modals/Back</span>
                            </div>
                        </div>
                        
                        <div class="shortcut-section">
                            <h3>🎪 Trivia Lifelines</h3>
                            <div class="shortcut-item">
                                <kbd>F</kbd>
                                <span>50:50 lifeline</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>S</kbd>
                                <span>Skip question</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>T</kbd>
                                <span>Extra time</span>
                            </div>
                        </div>
                        
                        <div class="shortcut-section">
                            <h3>⚙️ General</h3>
                            <div class="shortcut-item">
                                <kbd>Ctrl + T</kbd>
                                <span>Toggle theme</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>Ctrl + H</kbd>
                                <span>Show this help</span>
                            </div>
                            <div class="shortcut-item">
                                <kbd>?</kbd>
                                <span>Show this help</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add styles for shortcuts modal
        if (!document.getElementById('shortcutsStyles')) {
            const style = document.createElement('style');
            style.id = 'shortcutsStyles';
            style.textContent = `
                .shortcuts-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                }
                .shortcut-section h3 {
                    margin-bottom: 1rem;
                    color: var(--primary-color);
                }
                .shortcut-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.8rem;
                    padding: 0.5rem;
                    background: var(--bg-secondary);
                    border-radius: var(--radius-md);
                }
                .shortcut-item kbd {
                    background: var(--bg-tertiary);
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    padding: 0.3rem 0.6rem;
                    font-family: monospace;
                    font-size: 0.9rem;
                    font-weight: bold;
                    color: var(--primary-color);
                }
                @media (max-width: 768px) {
                    .shortcuts-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(modal);
    }

    // Play sound effects
    playSound(type) {
        if (this.sounds && this.sounds[type]) {
            this.sounds[type].play();
        }
    }

    // Enhanced score update with visual feedback
    updateScore(score) {
        document.getElementById('currentScore').textContent = score;
        
        // Add score animation
        const scoreElement = document.getElementById('currentScore');
        scoreElement.style.transform = 'scale(1.2)';
        scoreElement.style.color = 'var(--success-color)';
        
        setTimeout(() => {
            scoreElement.style.transform = 'scale(1)';
            scoreElement.style.color = '';
        }, 300);
    }

    // Settings functionality
    showSettings() {
        this.loadCurrentSettings();
        document.getElementById('settingsModal').classList.add('active');
    }

    hideSettingsModal() {
        document.getElementById('settingsModal').classList.remove('active');
    }

    loadCurrentSettings() {
        const settings = GameStorage.getSettings();
        document.getElementById('soundToggle').checked = settings.soundEnabled !== false;
        document.getElementById('animationsToggle').checked = settings.animationsEnabled !== false;
        document.getElementById('difficultySelect').value = settings.difficulty || 'medium';
        document.getElementById('keyboardHintsToggle').checked = settings.keyboardHints !== false;
    }

    saveSettings() {
        const settings = {
            soundEnabled: document.getElementById('soundToggle').checked,
            animationsEnabled: document.getElementById('animationsToggle').checked,
            difficulty: document.getElementById('difficultySelect').value,
            keyboardHints: document.getElementById('keyboardHintsToggle').checked
        };

        GameStorage.saveSettings(settings);
        localStorage.setItem('soundEnabled', settings.soundEnabled);
        
        // Apply animation settings
        if (settings.animationsEnabled) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }

        this.showNotification('Settings saved successfully!', 'success');
        this.hideSettingsModal();
    }

    resetSettings() {
        document.getElementById('soundToggle').checked = true;
        document.getElementById('animationsToggle').checked = true;
        document.getElementById('difficultySelect').value = 'medium';
        document.getElementById('keyboardHintsToggle').checked = true;
        this.showNotification('Settings reset to default', 'success');
    }

    // Statistics functionality
    showStatistics(subject = null) {
        this.updateStatisticsData(subject);
        document.getElementById('statisticsModal').classList.add('active');
    }

    hideStatisticsModal() {
        document.getElementById('statisticsModal').classList.remove('active');
    }

    updateStatisticsData(focusSubject = null) {
        const stats = GameStorage.getOverallStats();
        
        // Update overview tab
        document.getElementById('totalScoreStats').textContent = stats.totalScore.toLocaleString();
        document.getElementById('accuracyStats').textContent = stats.averageAccuracy + '%';
        document.getElementById('timePlayedStats').textContent = Math.round(stats.totalTimePlayed / 60);

        // Update subjects tab
        this.updateSubjectStatistics(stats.subjects);

        // Focus on specific subject if provided
        if (focusSubject) {
            this.switchTab('subjects');
        }
    }

    updateSubjectStatistics(subjects) {
        const subjectsContainer = document.getElementById('subjectStats');
        const subjectNames = {
            math: 'Mathematics',
            science: 'Science', 
            english: 'English',
            trivia: 'General Knowledge'
        };

        let html = '<div class="subject-stats-grid">';
        
        Object.keys(subjectNames).forEach(subject => {
            const data = subjects[subject] || {};
            html += `
                <div class="subject-stat-card">
                    <h4>${subjectNames[subject]}</h4>
                    <div class="subject-metrics">
                        <div class="metric">
                            <span class="metric-label">Games Played:</span>
                            <span class="metric-value">${data.gamesPlayed || 0}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Best Score:</span>
                            <span class="metric-value">${data.bestScore || 0}</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Accuracy:</span>
                            <span class="metric-value">${data.averageAccuracy || 0}%</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Total Score:</span>
                            <span class="metric-value">${data.totalScore || 0}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        subjectsContainer.innerHTML = html;
    }

    switchTab(tabName) {
        // Remove active class from all tabs and content
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to selected tab and content
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');

        // Update content based on tab
        if (tabName === 'subjects') {
            const stats = GameStorage.getOverallStats();
            this.updateSubjectStatistics(stats.subjects);
        } else if (tabName === 'progress') {
            this.updateProgressChart();
        }
    }

    updateProgressChart() {
        const progressContainer = document.getElementById('progressChart');
        const recentActivity = GameStorage.getRecentActivity(30);
        
        if (recentActivity.length === 0) {
            progressContainer.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No recent activity to display.</p>';
            return;
        }

        // Create simple progress visualization
        let html = '<div class="progress-timeline">';
        recentActivity.slice(0, 10).forEach((game, index) => {
            const date = new Date(game.timestamp).toLocaleDateString();
            const accuracy = game.total > 0 ? Math.round((game.correct / game.total) * 100) : 0;
            html += `
                <div class="timeline-item">
                    <div class="timeline-date">${date}</div>
                    <div class="timeline-subject">${game.subject}</div>
                    <div class="timeline-score">Score: ${game.score}</div>
                    <div class="timeline-accuracy">Accuracy: ${accuracy}%</div>
                </div>
            `;
        });
        html += '</div>';
        progressContainer.innerHTML = html;
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            ${message}
            <button class="notification-close" onclick="this.parentElement.remove()">&times;</button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eduGameApp = new EduGameApp();
});

// Export for other modules
window.EduGameApp = EduGameApp;
