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
