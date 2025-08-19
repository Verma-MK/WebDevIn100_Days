// Badge system for rewarding achievements
class BadgeSystem {
    static BADGE_DEFINITIONS = [
        // Score-based badges
        {
            id: 'first_game',
            name: 'First Steps',
            description: 'Complete your first game',
            icon: '🎮',
            condition: (stats, gameResult) => stats.totalGames >= 1,
            category: 'milestone'
        },
        {
            id: 'score_100',
            name: 'Century',
            description: 'Score 100 points in a single game',
            icon: '💯',
            condition: (stats, gameResult) => gameResult.score >= 100,
            category: 'score'
        },
        {
            id: 'score_200',
            name: 'Double Century',
            description: 'Score 200 points in a single game',
            icon: '🔥',
            condition: (stats, gameResult) => gameResult.score >= 200,
            category: 'score'
        },
        {
            id: 'score_500',
            name: 'High Scorer',
            description: 'Score 500 points in a single game',
            icon: '⭐',
            condition: (stats, gameResult) => gameResult.score >= 500,
            category: 'score'
        },

        // Accuracy badges
        {
            id: 'perfect_game',
            name: 'Perfect Game',
            description: 'Answer all questions correctly',
            icon: '🎯',
            condition: (stats, gameResult) => gameResult.total > 0 && gameResult.correct === gameResult.total,
            category: 'accuracy'
        },
        {
            id: 'accuracy_90',
            name: 'Sharp Shooter',
            description: 'Achieve 90% accuracy with at least 10 questions',
            icon: '🏹',
            condition: (stats, gameResult) => {
                const accuracy = gameResult.total >= 10 ? (gameResult.correct / gameResult.total) * 100 : 0;
                return accuracy >= 90;
            },
            category: 'accuracy'
        },

        // Streak badges
        {
            id: 'streak_3',
            name: 'On Fire',
            description: 'Play for 3 consecutive days',
            icon: '🔥',
            condition: (stats) => stats.streak >= 3,
            category: 'streak'
        },
        {
            id: 'streak_7',
            name: 'Weekly Warrior',
            description: 'Play for 7 consecutive days',
            icon: '⚡',
            condition: (stats) => stats.streak >= 7,
            category: 'streak'
        },
        {
            id: 'streak_30',
            name: 'Dedication Master',
            description: 'Play for 30 consecutive days',
            icon: '👑',
            condition: (stats) => stats.streak >= 30,
            category: 'streak'
        },

        // Subject-specific badges
        {
            id: 'math_master',
            name: 'Math Master',
            description: 'Play 10 math games',
            icon: '🧮',
            condition: (stats) => stats.subjects.math && stats.subjects.math.gamesPlayed >= 10,
            category: 'subject'
        },
        {
            id: 'science_explorer',
            name: 'Science Explorer',
            description: 'Play 10 science games',
            icon: '🔬',
            condition: (stats) => stats.subjects.science && stats.subjects.science.gamesPlayed >= 10,
            category: 'subject'
        },
        {
            id: 'word_wizard',
            name: 'Word Wizard',
            description: 'Play 10 English games',
            icon: '📚',
            condition: (stats) => stats.subjects.english && stats.subjects.english.gamesPlayed >= 10,
            category: 'subject'
        },
        {
            id: 'trivia_champion',
            name: 'Trivia Champion',
            description: 'Play 10 trivia games',
            icon: '🌍',
            condition: (stats) => stats.subjects.trivia && stats.subjects.trivia.gamesPlayed >= 10,
            category: 'subject'
        },

        // Game count badges
        {
            id: 'games_10',
            name: 'Getting Started',
            description: 'Play 10 games total',
            icon: '🎲',
            condition: (stats) => stats.totalGames >= 10,
            category: 'milestone'
        },
        {
            id: 'games_50',
            name: 'Enthusiast',
            description: 'Play 50 games total',
            icon: '🏆',
            condition: (stats) => stats.totalGames >= 50,
            category: 'milestone'
        },
        {
            id: 'games_100',
            name: 'Centurion',
            description: 'Play 100 games total',
            icon: '🎖️',
            condition: (stats) => stats.totalGames >= 100,
            category: 'milestone'
        },

        // Time-based badges
        {
            id: 'speed_demon',
            name: 'Speed Demon',
            description: 'Complete a game in under 60 seconds',
            icon: '💨',
            condition: (stats, gameResult) => gameResult.timeTaken && gameResult.timeTaken <= 60,
            category: 'speed'
        },
        {
            id: 'time_played_hour',
            name: 'Hour Player',
            description: 'Play for a total of 1 hour',
            icon: '⏰',
            condition: (stats) => stats.totalTimePlayed >= 3600, // 1 hour in seconds
            category: 'time'
        },

        // Special achievement badges
        {
            id: 'all_subjects',
            name: 'Well Rounded',
            description: 'Play at least one game in each subject',
            icon: '🌟',
            condition: (stats) => {
                const subjects = ['math', 'science', 'english', 'trivia'];
                return subjects.every(subject => stats.subjects[subject] && stats.subjects[subject].gamesPlayed > 0);
            },
            category: 'special'
        },
        {
            id: 'high_overall_accuracy',
            name: 'Precision Master',
            description: 'Maintain 85% overall accuracy across all games',
            icon: '🎯',
            condition: (stats) => stats.totalQuestions >= 50 && stats.averageAccuracy >= 85,
            category: 'accuracy'
        },
        {
            id: 'comeback_kid',
            name: 'Comeback Kid',
            description: 'Improve your best score in a subject by 50 points',
            icon: '📈',
            condition: (stats, gameResult) => {
                const subject = gameResult.subject;
                if (!stats.subjects[subject]) return false;
                
                const previousBest = stats.subjects[subject].bestScore - gameResult.score;
                return gameResult.score - previousBest >= 50;
            },
            category: 'improvement'
        }
    ];

    // Check for new badges after a game
    static checkBadges(subject, gameResult) {
        const stats = GameStorage.getUserStats();
        const earnedBadges = GameStorage.getEarnedBadges();
        const newBadges = [];

        this.BADGE_DEFINITIONS.forEach(badge => {
            // Skip if already earned
            if (earnedBadges.find(earned => earned.id === badge.id)) {
                return;
            }

            // Check if condition is met
            if (badge.condition(stats, gameResult)) {
                newBadges.push(badge);
                GameStorage.saveEarnedBadge(badge);
            }
        });

        return newBadges;
    }

    // Get all badge definitions
    static getAllBadges() {
        return [...this.BADGE_DEFINITIONS];
    }

    // Get earned badges
    static getEarnedBadges() {
        return GameStorage.getEarnedBadges();
    }

    // Get badges by category
    static getBadgesByCategory(category) {
        return this.BADGE_DEFINITIONS.filter(badge => badge.category === category);
    }

    // Get badge progress (for badges that can show progress)
    static getBadgeProgress(badgeId) {
        const badge = this.BADGE_DEFINITIONS.find(b => b.id === badgeId);
        if (!badge) return null;

        const stats = GameStorage.getUserStats();
        const earnedBadges = this.getEarnedBadges();
        
        // If already earned, return 100%
        if (earnedBadges.find(earned => earned.id === badgeId)) {
            return { current: 1, target: 1, percentage: 100, earned: true };
        }

        // Calculate progress based on badge type
        let current = 0;
        let target = 1;

        switch (badgeId) {
            case 'games_10':
                current = stats.totalGames;
                target = 10;
                break;
            case 'games_50':
                current = stats.totalGames;
                target = 50;
                break;
            case 'games_100':
                current = stats.totalGames;
                target = 100;
                break;
            case 'streak_3':
                current = stats.streak;
                target = 3;
                break;
            case 'streak_7':
                current = stats.streak;
                target = 7;
                break;
            case 'streak_30':
                current = stats.streak;
                target = 30;
                break;
            case 'math_master':
                current = stats.subjects.math ? stats.subjects.math.gamesPlayed : 0;
                target = 10;
                break;
            case 'science_explorer':
                current = stats.subjects.science ? stats.subjects.science.gamesPlayed : 0;
                target = 10;
                break;
            case 'word_wizard':
                current = stats.subjects.english ? stats.subjects.english.gamesPlayed : 0;
                target = 10;
                break;
            case 'trivia_champion':
                current = stats.subjects.trivia ? stats.subjects.trivia.gamesPlayed : 0;
                target = 10;
                break;
            case 'time_played_hour':
                current = Math.floor(stats.totalTimePlayed / 60); // Convert to minutes
                target = 60; // 1 hour
                break;
            default:
                return null;
        }

        const percentage = Math.min(Math.round((current / target) * 100), 100);
        return { current, target, percentage, earned: false };
    }

    // Get recent badges (earned in last 7 days)
    static getRecentBadges(days = 7) {
        const earnedBadges = this.getEarnedBadges();
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return earnedBadges.filter(badge => badge.earnedAt >= cutoffDate)
                          .sort((a, b) => b.earnedAt - a.earnedAt);
    }

    // Get badge statistics
    static getBadgeStats() {
        const earnedBadges = this.getEarnedBadges();
        const totalBadges = this.BADGE_DEFINITIONS.length;
        const earnedCount = earnedBadges.length;
        
        const categoryStats = {};
        this.BADGE_DEFINITIONS.forEach(badge => {
            if (!categoryStats[badge.category]) {
                categoryStats[badge.category] = { total: 0, earned: 0 };
            }
            categoryStats[badge.category].total++;
            
            if (earnedBadges.find(earned => earned.id === badge.id)) {
                categoryStats[badge.category].earned++;
            }
        });

        return {
            totalBadges,
            earnedCount,
            completionPercentage: Math.round((earnedCount / totalBadges) * 100),
            categoryStats
        };
    }

    // Generate badge notification message
    static getBadgeNotification(badge) {
        const messages = [
            `🎉 Achievement Unlocked: ${badge.name}!`,
            `🏆 You earned the "${badge.name}" badge!`,
            `⭐ Congratulations! You've earned "${badge.name}"!`,
            `🎊 New badge earned: ${badge.name}!`
        ];
        
        return messages[Math.floor(Math.random() * messages.length)];
    }
}

// Export for use in other modules
window.BadgeSystem = BadgeSystem;
