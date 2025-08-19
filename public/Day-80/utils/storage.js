// Local storage utility for game data persistence
class GameStorage {
    static STORAGE_KEYS = {
        GAME_RESULTS: 'eduGame_results',
        USER_STATS: 'eduGame_userStats',
        BADGES: 'eduGame_badges',
        SETTINGS: 'eduGame_settings',
        USER_PROFILE: 'eduGame_profile'
    };

    // Save game result
    static saveGameResult(gameData) {
        try {
            const results = this.getGameResults();
            results.push({
                id: Date.now(),
                ...gameData,
                timestamp: Date.now()
            });

            // Keep only last 100 games to prevent storage overflow
            if (results.length > 100) {
                results.splice(0, results.length - 100);
            }

            localStorage.setItem(this.STORAGE_KEYS.GAME_RESULTS, JSON.stringify(results));
            this.updateUserStats(gameData);
        } catch (error) {
            console.error('Error saving game result:', error);
        }
    }

    // Get all game results
    static getGameResults() {
        try {
            const results = localStorage.getItem(this.STORAGE_KEYS.GAME_RESULTS);
            return results ? JSON.parse(results) : [];
        } catch (error) {
            console.error('Error getting game results:', error);
            return [];
        }
    }

    // Get results for a specific subject
    static getSubjectResults(subject) {
        const results = this.getGameResults();
        return results.filter(result => result.subject === subject);
    }

    // Update user statistics
    static updateUserStats(gameData) {
        try {
            const stats = this.getUserStats();
            const subject = gameData.subject;

            // Initialize subject stats if not exists
            if (!stats.subjects[subject]) {
                stats.subjects[subject] = {
                    gamesPlayed: 0,
                    totalScore: 0,
                    bestScore: 0,
                    totalCorrect: 0,
                    totalQuestions: 0,
                    averageAccuracy: 0,
                    timePlayed: 0
                };
            }

            // Update subject stats
            const subjectStats = stats.subjects[subject];
            subjectStats.gamesPlayed++;
            subjectStats.totalScore += gameData.score;
            subjectStats.bestScore = Math.max(subjectStats.bestScore, gameData.score);
            subjectStats.totalCorrect += gameData.correct;
            subjectStats.totalQuestions += gameData.total;
            subjectStats.timePlayed += gameData.timeTaken || 0;
            
            if (subjectStats.totalQuestions > 0) {
                subjectStats.averageAccuracy = Math.round((subjectStats.totalCorrect / subjectStats.totalQuestions) * 100);
            }

            // Update overall stats
            stats.totalGames++;
            stats.totalScore += gameData.score;
            stats.totalCorrect += gameData.correct;
            stats.totalQuestions += gameData.total;
            stats.totalTimePlayed += gameData.timeTaken || 0;

            if (stats.totalQuestions > 0) {
                stats.averageAccuracy = Math.round((stats.totalCorrect / stats.totalQuestions) * 100);
            }

            // Update streak
            this.updateStreak(stats, gameData);

            localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(stats));
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }

    // Update playing streak
    static updateStreak(stats, gameData) {
        const today = new Date().toDateString();
        const lastPlayDate = stats.lastPlayDate;

        if (lastPlayDate === today) {
            // Same day, don't update streak
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        if (lastPlayDate === yesterdayString) {
            // Consecutive day
            stats.streak++;
        } else if (lastPlayDate !== today) {
            // Streak broken
            stats.streak = 1;
        }

        stats.lastPlayDate = today;
        stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    }

    // Get user statistics
    static getUserStats() {
        try {
            const stats = localStorage.getItem(this.STORAGE_KEYS.USER_STATS);
            const defaultStats = {
                totalGames: 0,
                totalScore: 0,
                totalCorrect: 0,
                totalQuestions: 0,
                averageAccuracy: 0,
                totalTimePlayed: 0,
                streak: 0,
                maxStreak: 0,
                lastPlayDate: null,
                subjects: {},
                achievements: [],
                level: 1,
                experiencePoints: 0
            };
            return stats ? { ...defaultStats, ...JSON.parse(stats) } : defaultStats;
        } catch (error) {
            console.error('Error getting user stats:', error);
            return this.getUserStats(); // Return default stats
        }
    }

    // Get overall statistics for dashboard
    static getSettings() {
        try {
            const settings = localStorage.getItem('gameSettings');
            return settings ? JSON.parse(settings) : {
                soundEnabled: true,
                animationsEnabled: true,
                difficulty: 'medium',
                keyboardHints: true
            };
        } catch (e) {
            console.warn('Could not load settings:', e);
            return {
                soundEnabled: true,
                animationsEnabled: true,
                difficulty: 'medium',
                keyboardHints: true
            };
        }
    }

    static saveSettings(settings) {
        try {
            localStorage.setItem('gameSettings', JSON.stringify(settings));
        } catch (e) {
            console.error('Could not save settings:', e);
        }
    }

    static getRecentActivity(days = 30) {
        try {
            const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
            const results = this.getResults();
            return results.filter(result => result.timestamp >= cutoff)
                          .sort((a, b) => b.timestamp - a.timestamp);
        } catch (e) {
            console.warn('Could not load recent activity:', e);
            return [];
        }
    }

    static getOverallStats() {
        const stats = this.getUserStats();
        const badges = this.getEarnedBadges();

        return {
            totalScore: stats.totalScore,
            totalBadges: badges.length,
            streak: stats.streak,
            totalGames: stats.totalGames,
            averageAccuracy: stats.averageAccuracy,
            totalTimePlayed: stats.totalTimePlayed,
            subjects: stats.subjects
        };
    }

    // Get leaderboard data
    static getLeaderboard() {
        const results = this.getGameResults();
        
        // Get top scores for each subject
        const leaderboard = [];
        const subjectBests = {};

        results.forEach(result => {
            const key = result.subject;
            if (!subjectBests[key] || result.score > subjectBests[key].score) {
                subjectBests[key] = result;
            }
        });

        // Convert to array and sort by score
        Object.values(subjectBests).forEach(result => {
            leaderboard.push(result);
        });

        // Add all high scores (above certain threshold)
        results.forEach(result => {
            if (result.score >= 100 && !leaderboard.find(entry => 
                entry.subject === result.subject && entry.timestamp === result.timestamp)) {
                leaderboard.push(result);
            }
        });

        return leaderboard.sort((a, b) => b.score - a.score);
    }

    // Badge management
    static saveEarnedBadge(badge) {
        try {
            const badges = this.getEarnedBadges();
            if (!badges.find(b => b.id === badge.id)) {
                badges.push({
                    ...badge,
                    earnedAt: Date.now()
                });
                localStorage.setItem(this.STORAGE_KEYS.BADGES, JSON.stringify(badges));
            }
        } catch (error) {
            console.error('Error saving badge:', error);
        }
    }

    static getEarnedBadges() {
        try {
            const badges = localStorage.getItem(this.STORAGE_KEYS.BADGES);
            return badges ? JSON.parse(badges) : [];
        } catch (error) {
            console.error('Error getting badges:', error);
            return [];
        }
    }

    // Settings management
    static saveSettings(settings) {
        try {
            localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    }

    static getSettings() {
        try {
            const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS);
            const defaultSettings = {
                theme: 'light',
                soundEnabled: true,
                difficulty: 'medium',
                timerEnabled: true,
                autoAdvance: false
            };
            return settings ? { ...defaultSettings, ...JSON.parse(settings) } : defaultSettings;
        } catch (error) {
            console.error('Error getting settings:', error);
            return this.getSettings(); // Return default settings
        }
    }

    // Data export/import for backup
    static exportData() {
        const data = {
            results: this.getGameResults(),
            stats: this.getUserStats(),
            badges: this.getEarnedBadges(),
            settings: this.getSettings(),
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(data, null, 2);
    }

    static importData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (data.results) {
                localStorage.setItem(this.STORAGE_KEYS.GAME_RESULTS, JSON.stringify(data.results));
            }
            if (data.stats) {
                localStorage.setItem(this.STORAGE_KEYS.USER_STATS, JSON.stringify(data.stats));
            }
            if (data.badges) {
                localStorage.setItem(this.STORAGE_KEYS.BADGES, JSON.stringify(data.badges));
            }
            if (data.settings) {
                localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(data.settings));
            }
            
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }

    // Clear all data
    static clearAllData() {
        try {
            Object.values(this.STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (error) {
            console.error('Error clearing data:', error);
            return false;
        }
    }

    // Get recent activity
    static getRecentActivity(days = 7) {
        const results = this.getGameResults();
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return results.filter(result => result.timestamp >= cutoffDate)
                     .sort((a, b) => b.timestamp - a.timestamp);
    }

    // Get performance trends
    static getPerformanceTrends(subject, days = 30) {
        const results = this.getSubjectResults(subject);
        const cutoffDate = Date.now() - (days * 24 * 60 * 60 * 1000);
        
        return results.filter(result => result.timestamp >= cutoffDate)
                     .map(result => ({
                         date: new Date(result.timestamp).toLocaleDateString(),
                         score: result.score,
                         accuracy: result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0
                     }));
    }
}

// Export for use in other modules
window.GameStorage = GameStorage;
