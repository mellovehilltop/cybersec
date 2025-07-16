/**
 * js/progress.js
 *
 * Manages all training progress, including loading from and saving to
 * localStorage. This ensures progress is not lost between sessions.
 * It provides a global `digitalShieldProgress` object for other scripts to use.
 */
const digitalShieldProgress = {
    // The key used to save progress in the browser's storage.
    storageKey: 'digitalShieldUserProgress',
    // The default state for progress when none is saved.
    totalModules: 5, // IMPORTANT: Update this number if you add more modules!
    progress: {},

    /**
     * Initializes the progress tracker by loading saved data or creating a new state.
     */
    init() {
        this.loadProgress();
        console.log("Digital Shield Progress Initialized.");
    },

    /**
     * Loads progress from localStorage. If no data is found, it creates a fresh state.
     */
    loadProgress() {
        const savedProgress = localStorage.getItem(this.storageKey);
        if (savedProgress) {
            this.progress = JSON.parse(savedProgress);
            // Ensure the totalModules count is up-to-date in case it changed.
            if (Object.keys(this.progress).length !== this.totalModules) {
                this.resetProgress(); // Reset if module count mismatch.
            }
        } else {
            this.resetProgress();
        }
    },

    /**
     * Saves the current progress state to localStorage.
     */
    saveProgress() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    },

    /**
     * Resets all progress to its initial state.
     */
    resetProgress() {
        this.progress = {};
        for (let i = 1; i <= this.totalModules; i++) {
            this.progress[i] = { score: 0, completed: false };
        }
        this.saveProgress();
    },

    /**
     * Checks if a specific module is unlocked.
     * @param {number | string} moduleNumber - The module to check.
     * @returns {boolean} - True if the module is unlocked.
     */
    isModuleUnlocked(moduleNumber) {
        const num = parseInt(moduleNumber, 10);
        
        // ** THE CRITICAL FIX IS HERE **
        // Module 1 is ALWAYS unlocked. It's the starting point.
        if (num === 1) {
            return true;
        }
        
        // For all other modules, check if the PREVIOUS module is completed.
        const previousModule = num - 1;
        return this.isModuleCompleted(previousModule);
    },

    /**
     * Checks if a module has been marked as complete.
     * @param {number | string} moduleNumber - The module to check.
     * @returns {boolean} - True if the module is complete.
     */
    isModuleCompleted(moduleNumber) {
        const num = parseInt(moduleNumber, 10);
        return this.progress[num]?.completed || false;
    },

    /**
     * Marks a module as complete and saves the progress.
     * @param {number | string} moduleNumber - The module to complete.
     * @param {number} score - The score achieved for this module.
     */
    completeModule(moduleNumber, score) {
        const num = parseInt(moduleNumber, 10);
        if (this.progress[num]) {
            this.progress[num].completed = true;
            this.progress[num].score = score;
            this.saveProgress();
            console.log(`Module ${num} completed with score ${score}. Progress saved.`);
        }
    },

    /**
     * Calculates and returns statistics about the current progress.
     * @returns {object} - An object with progress stats.
     */
    getProgressStats() {
        const completedModules = Object.values(this.progress).filter(m => m.completed).length;
        const overallProgress = (completedModules / this.totalModules) * 100;
        return {
            completedModules,
            overallProgress: Math.round(overallProgress),
        };
    },
};

// Expose the object to the global window scope so other scripts can access it.
window.digitalShieldProgress = digitalShieldProgress;

// Initialize the progress tracker immediately when the script loads.
window.digitalShieldProgress.init();
// Add these functions to your existing js/progress.js file for Module 5 integration

// Extended training progress object for Module 5
const module5Progress = {
    dataInventoryComplete: false,
    classificationScore: 0,
    rightsScenarios: {
        scenario1: false,
        scenario2: false,
        scenario3: false
    },
    breachResponses: {
        breach1: false,
        breach2: false,
        breach3: false
    },
    badgesEarned: [],
    finalScore: 0,
    completionTime: 0,
    startTime: null,
    phaseCompletions: {
        phase1: false,
        phase2: false,
        phase3: false,
        phase4: false
    }
};

// Initialize Module 5 progress tracking
function initializeModule5Progress() {
    if (!trainingProgress.modules.module5) {
        trainingProgress.modules.module5 = {
            started: false,
            completed: false,
            score: 0,
            timeSpent: 0,
            badgesEarned: [],
            phaseProgress: {
                phase1: 0,
                phase2: 0,
                phase3: 0,
                phase4: 0
            },
            detailedProgress: JSON.parse(JSON.stringify(module5Progress))
        };
    }
    
    // Set start time if not already set
    if (!trainingProgress.modules.module5.detailedProgress.startTime) {
        trainingProgress.modules.module5.detailedProgress.startTime = Date.now();
        trainingProgress.modules.module5.started = true;
    }
    
    saveProgress();
}

// Update Module 5 phase progress
function updateModule5Phase(phaseNumber, percentage, details = {}) {
    if (!trainingProgress.modules.module5) {
        initializeModule5Progress();
    }
    
    trainingProgress.modules.module5.phaseProgress[`phase${phaseNumber}`] = percentage;
    
    // Update detailed progress based on phase
    const moduleProgress = trainingProgress.modules.module5.detailedProgress;
    
    switch(phaseNumber) {
        case 1:
            if (details.dataInventoryComplete) {
                moduleProgress.dataInventoryComplete = true;
                moduleProgress.phaseCompletions.phase1 = true;
                awardModule5Badge('data-spotter');
            }
            break;
            
        case 2:
            if (details.classificationScore) {
                moduleProgress.classificationScore = details.classificationScore;
                if (details.classificationScore >= 100) {
                    moduleProgress.phaseCompletions.phase2 = true;
                    awardModule5Badge('data-classifier');
                }
            }
            break;
            
        case 3:
            if (details.scenarioComplete) {
                moduleProgress.rightsScenarios[details.scenarioComplete] = true;
                const allRightsComplete = Object.values(moduleProgress.rightsScenarios).every(Boolean);
                if (allRightsComplete) {
                    moduleProgress.phaseCompletions.phase3 = true;
                    awardModule5Badge('privacy-champion');
                }
            }
            break;
            
        case 4:
            if (details.breachComplete) {
                moduleProgress.breachResponses[details.breachComplete] = true;
                const allBreachesComplete = Object.values(moduleProgress.breachResponses).every(Boolean);
                if (allBreachesComplete) {
                    moduleProgress.phaseCompletions.phase4 = true;
                    awardModule5Badge('compliance-guardian');
                    completeModule5();
                }
            }
            break;
    }
    
    saveProgress();
    updateProgressDisplay();
}

// Award Module 5 specific badges
function awardModule5Badge(badgeType) {
    if (!trainingProgress.modules.module5) {
        initializeModule5Progress();
    }
    
    const moduleProgress = trainingProgress.modules.module5;
    
    if (!moduleProgress.badgesEarned.includes(badgeType)) {
        moduleProgress.badgesEarned.push(badgeType);
        moduleProgress.detailedProgress.badgesEarned.push(badgeType);
        
        // Add to global badges
        if (!trainingProgress.badges.includes(badgeType)) {
            trainingProgress.badges.push(badgeType);
        }
        
        showBadgeNotification(badgeType);
        saveProgress();
    }
}

// Complete Module 5
function completeModule5() {
    if (!trainingProgress.modules.module5) {
        initializeModule5Progress();
    }
    
    const moduleProgress = trainingProgress.modules.module5;
    const detailedProgress = moduleProgress.detailedProgress;
    
    // Calculate completion time
    if (detailedProgress.startTime) {
        detailedProgress.completionTime = Math.round((Date.now() - detailedProgress.startTime) / 60000);
        moduleProgress.timeSpent = detailedProgress.completionTime;
    }
    
    // Calculate final score based on all activities
    let totalScore = 0;
    let activities = 0;
    
    // Data inventory completion (25 points)
    if (detailedProgress.dataInventoryComplete) {
        totalScore += 25;
    }
    activities++;
    
    // Classification score (25 points)
    totalScore += Math.round(detailedProgress.classificationScore * 0.25);
    activities++;
    
    // Rights scenarios (25 points)
    const rightsComplete = Object.values(detailedProgress.rightsScenarios).filter(Boolean).length;
    totalScore += Math.round((rightsComplete / 3) * 25);
    activities++;
    
    // Breach responses (25 points)
    const breachComplete = Object.values(detailedProgress.breachResponses).filter(Boolean).length;
    totalScore += Math.round((breachComplete / 3) * 25);
    activities++;
    
    detailedProgress.finalScore = totalScore;
    moduleProgress.score = totalScore;
    moduleProgress.completed = true;
    
    // Add to completed modules
    if (!trainingProgress.completedModules.includes('module5')) {
        trainingProgress.completedModules.push('module5');
    }
    
    // Award completion badge if score is high enough
    if (totalScore >= 85) {
        awardModule5Badge('gdpr-guardian');
    }
    
    saveProgress();
    updateProgressDisplay();
    
    console.log('Module 5 completed with score:', totalScore);
}

// Get Module 5 progress summary for display
function getModule5Summary() {
    if (!trainingProgress.modules.module5) {
        return {
            started: false,
            completed: false,
            score: 0,
            timeSpent: 0,
            badgesEarned: [],
            phaseProgress: { phase1: 0, phase2: 0, phase3: 0, phase4: 0 }
        };
    }
    
    return trainingProgress.modules.module5;
}

// Module 5 specific badge names mapping
const module5BadgeNames = {
    'data-spotter': 'Data Spotter',
    'data-classifier': 'Data Classifier',
    'privacy-champion': 'Privacy Champion',
    'compliance-guardian': 'Compliance Guardian',
    'gdpr-guardian': 'GDPR Guardian'
};

// Enhanced badge notification for Module 5
function showModule5BadgeNotification(badgeType) {
    const badgeName = module5BadgeNames[badgeType] || badgeType;
    
    // Create custom notification for GDPR badges
    const notification = document.createElement('div');
    notification.className = 'gdpr-badge-notification';
    notification.innerHTML = `
        <div class="badge-content">
            <div class="badge-icon">🏆</div>
            <h3>GDPR BADGE EARNED!</h3>
            <p class="badge-name">${badgeName}</p>
            <p class="badge-description">${getBadgeDescription(badgeType)}</p>
        </div>
    `;
    
    // Custom styling for GDPR badges
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #9b59b6, #8e44ad);
        color: white;
        padding: 25px;
        border-radius: 15px;
        border: 3px solid #f39c12;
        box-shadow: 0 15px 35px rgba(155, 89, 182, 0.5);
        z-index: 1001;
        animation: gdprBadgeSlide 0.6s ease-out;
        max-width: 350px;
        text-align: center;
        font-weight: bold;
    `;
    
    // Add custom animation if not exists
    if (!document.getElementById('gdpr-badge-animations')) {
        const style = document.createElement('style');
        style.id = 'gdpr-badge-animations';
        style.textContent = `
            @keyframes gdprBadgeSlide {
                from { 
                    transform: translateX(100%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translateX(0) scale(1); 
                    opacity: 1; 
                }
            }
            .gdpr-badge-notification .badge-icon {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            .gdpr-badge-notification .badge-name {
                font-size: 1.2rem;
                color: #f39c12;
                margin: 10px 0;
            }
            .gdpr-badge-notification .badge-description {
                font-size: 0.9rem;
                opacity: 0.9;
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'gdprBadgeSlide 0.5s ease-in reverse';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 5000);
}

// Get badge descriptions for Module 5
function getBadgeDescription(badgeType) {
    const descriptions = {
        'data-spotter': 'Identified all types of personal data in Hilltop Honey operations',
        'data-classifier': 'Perfect classification of sensitive business documents',
        'privacy-champion': 'Mastered all data subject rights and request handling',
        'compliance-guardian': 'Expert breach response within legal deadlines',
        'gdpr-guardian': 'Complete GDPR compliance mastery with 85%+ score'
    };
    
    return descriptions[badgeType] || 'GDPR training achievement unlocked';
}

// Enhanced progress display update for Module 5
function updateModule5ProgressDisplay() {
    const module5Data = getModule5Summary();
    
    // Update module card on main page if exists
    const module5Card = document.querySelector('[data-module="module5"]');
    if (module5Card) {
        const statusBadge = module5Card.querySelector('.status-badge');
        const progressBar = module5Card.querySelector('.module-progress .progress-fill');
        const moduleBtn = module5Card.querySelector('.module-btn');
        
        if (module5Data.completed) {
            statusBadge.textContent = 'Completed';
            statusBadge.className = 'status-badge completed';
            if (progressBar) progressBar.style.width = '100%';
            if (moduleBtn) {
                moduleBtn.textContent = `Review (${module5Data.score}%)`;
                moduleBtn.className = 'module-btn completed';
            }
        } else if (module5Data.started) {
            statusBadge.textContent = 'In Progress';
            statusBadge.className = 'status-badge in-progress';
            const avgProgress = Object.values(module5Data.phaseProgress).reduce((a, b) => a + b, 0) / 4;
            if (progressBar) progressBar.style.width = `${avgProgress}%`;
            if (moduleBtn) {
                moduleBtn.textContent = 'Continue';
                moduleBtn.disabled = false;
            }
        }
    }
    
    // Update badges display
    updateBadgesDisplay();
}

// Initialize Module 5 tracking when page loads
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('module5.html')) {
        initializeModule5Progress();
    }
    updateModule5ProgressDisplay();
});

// Export functions for global access
window.initializeModule5Progress = initializeModule5Progress;
window.updateModule5Phase = updateModule5Phase;
window.awardModule5Badge = awardModule5Badge;
window.completeModule5 = completeModule5;
window.getModule5Summary = getModule5Summary;
