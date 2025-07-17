/**
 * progress.js - Digital Shield Training Progress Tracker
 * 
 * Comprehensive progress tracking system for all 5 cyber security training modules.
 * Handles phase progress, module completion, scoring, and persistent storage.
 */

const digitalShieldProgress = {
    // --- CONFIGURATION ---
    totalModules: 5,
    passingScore: 75,
    storageKey: 'digitalShieldProgress',
    
    // --- MODULE DEFINITIONS ---
    moduleConfig: {
        1: {
            name: 'Email Security',
            subtitle: 'The Interceptor Protocol',
            phases: 4,
            icon: '📧',
            difficulty: 'LEVEL 3',
            duration: '15 min'
        },
        2: {
            name: 'Password Security',
            subtitle: 'The Vault Protocol',
            phases: 4,
            icon: '🔐',
            difficulty: 'LEVEL 2',
            duration: '12 min'
        },
        3: {
            name: 'Internet Security Protocols',
            subtitle: 'Digital Navigator',
            phases: 4,
            icon: '🌐',
            difficulty: 'LEVEL 3',
            duration: '18 min'
        },
        4: {
            name: 'Physical Security',
            subtitle: 'Facility Guardian',
            phases: 4,
            icon: '🏢',
            difficulty: 'LEVEL 4',
            duration: '20 min'
        },
        5: {
            name: 'GDPR Data Protection',
            subtitle: 'Data Guardian',
            phases: 4,
            icon: '🛡️',
            difficulty: 'LEVEL 5',
            duration: '22 min'
        }
    },

    // --- PROGRESS DATA STRUCTURE ---
    progress: {
        agent: {
            name: '[CLASSIFIED]',
            startDate: null,
            lastAccessed: null,
            totalTimeSpent: 0,
            overallProgress: 0,
            clearanceLevel: 'TRAINEE'
        },
        modules: {
            1: { started: false, completed: false, score: 0, currentPhase: 1, phaseProgress: [0, 0, 0, 0], timeSpent: 0, attempts: 0, badges: [] },
            2: { started: false, completed: false, score: 0, currentPhase: 1, phaseProgress: [0, 0, 0, 0], timeSpent: 0, attempts: 0, badges: [] },
            3: { started: false, completed: false, score: 0, currentPhase: 1, phaseProgress: [0, 0, 0, 0], timeSpent: 0, attempts: 0, badges: [] },
            4: { started: false, completed: false, score: 0, currentPhase: 1, phaseProgress: [0, 0, 0, 0], timeSpent: 0, attempts: 0, badges: [] },
            5: { started: false, completed: false, score: 0, currentPhase: 1, phaseProgress: [0, 0, 0, 0], timeSpent: 0, attempts: 0, badges: [] }
        },
        achievements: {
            totalBadges: 0,
            unlockedBadges: [],
            completionCertificates: []
        }
    },

    // --- INITIALIZATION ---
    init() {
        this.loadProgress();
        this.updateLastAccessed();
        this.updateDisplay();
        this.unlockAvailableModules();
        
        console.log('Digital Shield Progress Tracker initialized');
        return true;
    },

    // --- PROGRESS PERSISTENCE ---
    saveProgress() {
        try {
            const progressData = {
                ...this.progress,
                version: '1.0',
                lastSaved: new Date().toISOString()
            };
            localStorage.setItem(this.storageKey, JSON.stringify(progressData));
            console.log('Progress saved successfully');
        } catch (error) {
            console.error('Failed to save progress:', error);
            this.showAlert('Warning: Progress could not be saved. Your progress may be lost.');
        }
    },

    loadProgress() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const loadedData = JSON.parse(saved);
                
                // Merge with default structure to handle version updates
                this.progress = this.mergeProgress(this.progress, loadedData);
                
                console.log('Progress loaded successfully');
            } else {
                // First time user - initialize with defaults
                this.progress.agent.startDate = new Date().toISOString();
                this.saveProgress();
            }
        } catch (error) {
            console.error('Failed to load progress:', error);
            this.showAlert('Warning: Could not load previous progress. Starting fresh.');
        }
    },

    mergeProgress(defaultProgress, savedProgress) {
        const merged = JSON.parse(JSON.stringify(defaultProgress));
        
        // Merge agent data
        if (savedProgress.agent) {
            merged.agent = { ...merged.agent, ...savedProgress.agent };
        }
        
        // Merge module data
        if (savedProgress.modules) {
            for (let moduleId = 1; moduleId <= this.totalModules; moduleId++) {
                if (savedProgress.modules[moduleId]) {
                    merged.modules[moduleId] = { 
                        ...merged.modules[moduleId], 
                        ...savedProgress.modules[moduleId] 
                    };
                }
            }
        }
        
        // Merge achievements
        if (savedProgress.achievements) {
            merged.achievements = { ...merged.achievements, ...savedProgress.achievements };
        }
        
        return merged;
    },

    // --- MODULE MANAGEMENT ---
    startModule(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) {
            console.error(`Invalid module ID: ${moduleId}`);
            return false;
        }

        if (!this.isModuleAccessible(moduleNum)) {
            this.showAlert(`Module ${moduleNum} is not yet accessible. Complete previous modules first.`);
            return false;
        }

        const module = this.progress.modules[moduleNum];
        if (!module.started) {
            module.started = true;
            module.attempts++;
            this.updateLastAccessed();
            this.saveProgress();
            
            console.log(`Module ${moduleNum} started`);
        }
        
        return true;
    },

    updateModulePhase(moduleId, phase, progress, timeSpent = 0) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum) || !this.isValidPhase(phase)) {
            console.error(`Invalid module (${moduleId}) or phase (${phase})`);
            return false;
        }

        const module = this.progress.modules[moduleNum];
        module.phaseProgress[phase - 1] = Math.max(0, Math.min(100, progress));
        module.currentPhase = Math.max(module.currentPhase, phase);
        module.timeSpent += timeSpent;
        
        this.updateOverallProgress();
        this.saveProgress();
        this.updateDisplay();
        
        console.log(`Module ${moduleNum} Phase ${phase}: ${progress}% complete`);
        return true;
    },

    completeModule(moduleId, score, timeSpent = 0) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) {
            console.error(`Invalid module ID: ${moduleId}`);
            return false;
        }

        const module = this.progress.modules[moduleNum];
        const finalScore = Math.max(0, Math.min(100, score));
        const passed = finalScore >= this.passingScore;
        
        // Update module data
        module.completed = passed;
        module.score = finalScore;
        module.timeSpent += timeSpent;
        module.phaseProgress = [100, 100, 100, 100]; // Mark all phases complete
        
        // Update agent data
        this.progress.agent.totalTimeSpent += timeSpent;
        
        // Award badges for excellent performance
        if (finalScore >= 90) {
            this.awardBadge(moduleNum, 'Excellence');
        }
        if (finalScore >= this.passingScore) {
            this.awardBadge(moduleNum, 'Completion');
        }
        
        this.updateOverallProgress();
        this.unlockAvailableModules();
        this.saveProgress();
        this.updateDisplay();
        
        console.log(`Module ${moduleNum} completed with score: ${finalScore}%`);
        return passed;
    },

    // --- BADGE SYSTEM ---
    awardBadge(moduleId, badgeType) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) return false;

        const badgeId = `module${moduleNum}_${badgeType.toLowerCase()}`;
        const module = this.progress.modules[moduleNum];
        
        if (!module.badges.includes(badgeId)) {
            module.badges.push(badgeId);
            this.progress.achievements.totalBadges++;
            this.progress.achievements.unlockedBadges.push({
                id: badgeId,
                moduleId: moduleNum,
                type: badgeType,
                name: `${this.moduleConfig[moduleNum].name} ${badgeType}`,
                earnedDate: new Date().toISOString()
            });
            
            console.log(`Badge awarded: ${badgeId}`);
            this.showBadgeNotification(badgeId, badgeType);
        }
        
        return true;
    },

    showBadgeNotification(badgeId, badgeType) {
        // This would trigger a UI notification - implement based on your UI framework
        console.log(`🏆 Achievement unlocked: ${badgeType} Badge!`);
    },

    // --- VALIDATION HELPERS ---
    isValidModule(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        return moduleNum >= 1 && moduleNum <= this.totalModules;
    },

    isValidPhase(phase) {
        return phase >= 1 && phase <= 4;
    },

    isModuleAccessible(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        if (moduleNum === 1) return true; // First module always accessible
        
        // Check if previous module is completed
        const previousModule = this.progress.modules[moduleNum - 1];
        return previousModule && previousModule.completed;
    },

    isModuleCompleted(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) return false;
        
        return this.progress.modules[moduleNum].completed;
    },

    // --- PROGRESS CALCULATIONS ---
    updateOverallProgress() {
        const completedModules = Object.values(this.progress.modules).filter(m => m.completed).length;
        this.progress.agent.overallProgress = Math.round((completedModules / this.totalModules) * 100);
        
        // Update clearance level based on progress
        if (completedModules === this.totalModules) {
            this.progress.agent.clearanceLevel = 'CERTIFIED AGENT';
        } else if (completedModules >= 3) {
            this.progress.agent.clearanceLevel = 'ADVANCED TRAINEE';
        } else if (completedModules >= 1) {
            this.progress.agent.clearanceLevel = 'ACTIVE TRAINEE';
        }
    },

    getModuleProgress(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) return null;
        
        const module = this.progress.modules[moduleNum];
        const avgPhaseProgress = module.phaseProgress.reduce((a, b) => a + b, 0) / 4;
        
        return {
            ...module,
            config: this.moduleConfig[moduleNum],
            progressPercentage: module.completed ? 100 : avgPhaseProgress,
            accessible: this.isModuleAccessible(moduleNum),
            status: this.getModuleStatus(moduleNum)
        };
    },

    getModuleStatus(moduleId) {
        const moduleNum = parseInt(moduleId, 10);
        if (!this.isValidModule(moduleNum)) return 'invalid';
        
        const module = this.progress.modules[moduleNum];
        
        if (module.completed) return 'completed';
        if (module.started) return 'in-progress';
        if (this.isModuleAccessible(moduleNum)) return 'available';
        return 'locked';
    },

    getProgressStats() {
        const completedModules = Object.values(this.progress.modules).filter(m => m.completed).length;
        const totalTimeSpent = this.progress.agent.totalTimeSpent;
        const totalBadges = this.progress.achievements.totalBadges;
        
        return {
            completedModules,
            totalModules: this.totalModules,
            overallProgress: this.progress.agent.overallProgress,
            totalTimeSpent,
            totalBadges,
            clearanceLevel: this.progress.agent.clearanceLevel,
            averageScore: this.calculateAverageScore()
        };
    },

    calculateAverageScore() {
        const completedModules = Object.values(this.progress.modules).filter(m => m.completed);
        if (completedModules.length === 0) return 0;
        
        const totalScore = completedModules.reduce((sum, module) => sum + module.score, 0);
        return Math.round(totalScore / completedModules.length);
    },

    // --- UI UPDATE METHODS ---
    updateDisplay() {
        this.updateHeaderDisplay();
        this.updateModuleCards();
        this.updateProgressBar();
    },

    updateHeaderDisplay() {
        const elements = {
            agentName: document.getElementById('agent-name'),
            overallProgress: document.getElementById('overall-progress'),
            filesCompleted: document.getElementById('files-completed'),
            sessionTime: document.getElementById('session-time'),
            currentTimestamp: document.getElementById('current-timestamp')
        };

        if (elements.agentName) {
            elements.agentName.textContent = this.progress.agent.name;
        }
        
        if (elements.overallProgress) {
            elements.overallProgress.textContent = `${this.progress.agent.overallProgress}%`;
        }
        
        if (elements.filesCompleted) {
            const completed = Object.values(this.progress.modules).filter(m => m.completed).length;
            elements.filesCompleted.textContent = `${completed}/${this.totalModules}`;
        }
        
        if (elements.currentTimestamp) {
            elements.currentTimestamp.textContent = new Date().toLocaleString();
        }
    },

    updateModuleCards() {
        for (let moduleId = 1; moduleId <= this.totalModules; moduleId++) {
            const moduleData = this.getModuleProgress(moduleId);
            const card = document.getElementById(`file-${moduleId}`);
            
            if (card && moduleData) {
                this.updateModuleCard(card, moduleData, moduleId);
            }
        }
    },

    updateModuleCard(card, moduleData, moduleId) {
        const statusBadge = card.querySelector('.status-badge');
        const button = card.querySelector('.file-btn');
        
        if (statusBadge) {
            statusBadge.className = `status-badge ${moduleData.status}`;
            statusBadge.textContent = this.getStatusText(moduleData.status);
        }
        
        if (button) {
            button.disabled = !moduleData.accessible;
            button.textContent = this.getButtonText(moduleData.status, moduleData.score);
        }
        
        // Update lock state
        if (moduleData.accessible) {
            card.classList.remove('locked');
        } else {
            card.classList.add('locked');
        }
    },

    getStatusText(status) {
        const statusMap = {
            'completed': 'COMPLETE',
            'in-progress': 'IN PROGRESS',
            'available': 'NEW',
            'locked': 'LOCKED'
        };
        return statusMap[status] || 'UNKNOWN';
    },

    getButtonText(status, score) {
        switch (status) {
            case 'completed':
                return `REVIEW (${score}%)`;
            case 'in-progress':
                return 'CONTINUE';
            case 'available':
                return 'OPEN FILE';
            case 'locked':
                return 'LOCKED';
            default:
                return 'UNAVAILABLE';
        }
    },

    updateProgressBar() {
        const progressBar = document.querySelector('.progress-fill');
        if (progressBar) {
            progressBar.style.width = `${this.progress.agent.overallProgress}%`;
        }
    },

    unlockAvailableModules() {
        // This method updates the UI to show which modules are now accessible
        for (let moduleId = 1; moduleId <= this.totalModules; moduleId++) {
            const card = document.getElementById(`file-${moduleId}`);
            if (card) {
                const isAccessible = this.isModuleAccessible(moduleId);
                card.classList.toggle('locked', !isAccessible);
            }
        }
    },

    // --- UTILITY METHODS ---
    updateLastAccessed() {
        this.progress.agent.lastAccessed = new Date().toISOString();
    },

    showAlert(message) {
        // Basic alert - replace with your preferred notification system
        alert(message);
    },

    resetProgress() {
        if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
            localStorage.removeItem(this.storageKey);
            location.reload();
        }
    },

    exportProgress() {
        const dataStr = JSON.stringify(this.progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'digital-shield-progress.json';
        link.click();
        
        URL.revokeObjectURL(url);
    }
};

// --- GLOBAL INITIALIZATION ---
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    digitalShieldProgress.init();
});

// Expose to global scope for module access
window.digitalShieldProgress = digitalShieldProgress;

// Auto-save progress every 30 seconds
setInterval(() => {
    digitalShieldProgress.saveProgress();
}, 30000);

// Save progress when page is about to unload
window.addEventListener('beforeunload', () => {
    digitalShieldProgress.saveProgress();
});

console.log('Digital Shield Progress System loaded successfully');
