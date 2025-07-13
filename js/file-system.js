/**
 * file-system.js
 *
 * Manages the main file system page interactivity, including updating
 * module statuses, handling navigation, timers, and the admin panel.
 *
 * This script is designed to be scalable. It automatically detects the
 * number of modules on the page and adjusts its logic accordingly.
 */
const fileSystemManager = {
    // --- PROPERTIES ---
    // Will be populated with the total number of modules found on the page.
    totalModules: 0,
    // Caches frequently accessed DOM elements to avoid repeated lookups.
    dom: {},
    // Holds interval IDs for timers to be cleared if needed.
    timers: {},

    // --- INITIALIZATION ---
    /**
     * Initializes the entire file system manager.
     * This is the entry point, called when the DOM is ready.
     */
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.startTimers();

        // The total number of modules is determined by how many .file-folder elements exist.
        // This makes the script automatically adapt when you add or remove modules in the HTML.
        this.totalModules = this.dom.fileFolders.length;

        this.updateDisplay();
        console.log(`Digital Shield File System loaded. Found ${this.totalModules} modules.`);
    },

    /**
     * Caches all necessary DOM elements for faster access.
     */
    cacheDOMElements() {
        this.dom.overallProgress = document.getElementById('overall-progress');
        this.dom.filesCompleted = document.getElementById('files-completed');
        this.dom.fileFolders = document.querySelectorAll('.file-folder');
        this.dom.finalAssessmentFile = document.getElementById('final-assessment-file');
        this.dom.finalAssessmentBtn = document.getElementById('final-btn');
        this.dom.clearanceRequirements = document.querySelectorAll('.requirement');
        this.dom.adminPanel = document.getElementById('admin-panel');
        this.dom.adminToggleButton = document.querySelector('.admin-access');
        this.dom.adminCloseButton = document.querySelector('.terminal-close');
        this.dom.adminCommandButtons = document.querySelectorAll('.admin-commands .cmd-btn');
        this.dom.sessionTime = document.getElementById('session-time');
        this.dom.currentTimestamp = document.getElementById('current-timestamp');
    },

    /**
     * Attaches all event listeners, removing the need for inline `onclick` attributes.
     */
    bindEvents() {
        // Event listener for each file folder.
        this.dom.fileFolders.forEach(folder => {
            const button = folder.querySelector('.file-btn');
            if (button) {
                button.addEventListener('click', () => this.handleFileOpen(folder.dataset.module));
            }
        });

        // Event listener for the final assessment button.
        if (this.dom.finalAssessmentBtn) {
            this.dom.finalAssessmentBtn.addEventListener('click', () => this.handleFinalAssessmentOpen());
        }

        // Event listeners for the admin panel.
        if (this.dom.adminToggleButton) {
            this.dom.adminToggleButton.addEventListener('click', () => this.toggleAdminPanel());
        }
        if (this.dom.adminCloseButton) {
            this.dom.adminCloseButton.addEventListener('click', () => this.toggleAdminPanel());
        }
        this.dom.adminCommandButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAdminCommand(e.currentTarget));
        });
    },

    // --- EVENT HANDLERS ---
    handleFileOpen(moduleNumber) {
        if (window.digitalShieldProgress?.isModuleUnlocked(moduleNumber)) {
            window.location.href = `module${moduleNumber}.html`;
        } else {
            this.showAccessDenied();
        }
    },

    handleFinalAssessmentOpen() {
        const stats = window.digitalShieldProgress?.getProgressStats();
        if (stats && stats.completedModules === this.totalModules) {
            window.location.href = 'final-assessment.html';
        } else {
            this.showAccessDenied();
        }
    },

    handleAdminCommand(button) {
        const command = button.dataset.command;
        const moduleNumber = button.dataset.module;

        if (command === 'reset') {
            if (confirm('⚠️ WARNING: This will reset ALL training progress. Are you sure?')) {
                window.digitalShieldProgress?.resetProgress();
                this.updateDisplay();
                alert('✅ All progress has been reset.');
            }
        } else if (command === 'complete' && moduleNumber) {
            window.digitalShieldProgress?.completeModule(moduleNumber, 100);
            this.updateDisplay();
            alert(`✅ Module ${moduleNumber} marked as complete.`);
        }
    },

    // --- UI & DISPLAY LOGIC ---
    /**
     * The main function to refresh the entire UI based on the current progress state.
     */
    updateDisplay() {
        // Ensure the progress tracking script is loaded before proceeding.
        if (!window.digitalShieldProgress) {
            console.error('Digital Shield Progress tracker not found. UI cannot be updated.');
            return;
        }

        const stats = window.digitalShieldProgress.getProgressStats();
        this.updateOverallStats(stats);
        this.updateFileFolderStates();
        this.updateFinalAssessmentState(stats);
        this.updateClearanceRequirementState();
    },

    updateOverallStats(stats) {
        if (this.dom.overallProgress) {
            this.dom.overallProgress.textContent = `${stats.overallProgress}%`;
        }
        if (this.dom.filesCompleted) {
            this.dom.filesCompleted.textContent = `${stats.completedModules}/${this.totalModules}`;
        }
    },

    updateFileFolderStates() {
        this.dom.fileFolders.forEach(folder => {
            const moduleNumber = parseInt(folder.dataset.module, 10);
            const statusElement = folder.querySelector('.status-indicator');
            const btnElement = folder.querySelector('.file-btn');

            if (!statusElement || !btnElement) return;

            const isCompleted = window.digitalShieldProgress.isModuleCompleted(moduleNumber);
            const isUnlocked = window.digitalShieldProgress.isModuleUnlocked(moduleNumber);

            if (isCompleted) {
                folder.classList.remove('locked');
                statusElement.innerHTML = '<span class="status-badge completed">✅ COMPLETE</span>';
                btnElement.textContent = 'REVIEW FILE';
                btnElement.disabled = false;
            } else if (isUnlocked) {
                folder.classList.remove('locked');
                statusElement.innerHTML = '<span class="status-badge new">AVAILABLE</span>';
                btnElement.textContent = 'OPEN FILE';
                btnElement.disabled = false;
            } else {
                folder.classList.add('locked');
                statusElement.innerHTML = '<span class="status-badge locked">🔒 LOCKED</span>';
                btnElement.textContent = 'CLEARANCE REQUIRED';
                btnElement.disabled = true;
            }
        });
    },

    updateFinalAssessmentState(stats) {
        if (this.dom.finalAssessmentFile && this.dom.finalAssessmentBtn) {
            if (stats.completedModules === this.totalModules) {
                this.dom.finalAssessmentFile.classList.remove('locked');
                this.dom.finalAssessmentBtn.textContent = '🎯 BEGIN FINAL ASSESSMENT';
                this.dom.finalAssessmentBtn.disabled = false;
            } else {
                this.dom.finalAssessmentFile.classList.add('locked');
                this.dom.finalAssessmentBtn.textContent = '🔒 ACCESS DENIED';
                this.dom.finalAssessmentBtn.disabled = true;
            }
        }
    },

    updateClearanceRequirementState() {
        this.dom.clearanceRequirements.forEach(req => {
            const moduleNum = parseInt(req.dataset.module, 10);
            const isCompleted = window.digitalShieldProgress.isModuleCompleted(moduleNum);
            const statusIcon = req.querySelector('.req-status');

            if (isCompleted) {
                req.classList.replace('incomplete', 'complete');
                if (statusIcon) statusIcon.textContent = '✅';
            } else {
                req.classList.replace('complete', 'incomplete');
                if (statusIcon) statusIcon.textContent = '❌';
            }
        });
    },

    // --- HELPER FUNCTIONS ---
    showAccessDenied() {
        alert('🔒 ACCESS DENIED\n\nClearance level insufficient. Complete prerequisite training files to gain access.');
    },

    toggleAdminPanel() {
        this.dom.adminPanel?.classList.toggle('hidden');
    },

    startTimers() {
        const sessionStartTime = Date.now();
        // Session Timer
        this.timers.session = setInterval(() => {
            const elapsed = Date.now() - sessionStartTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            if (this.dom.sessionTime) this.dom.sessionTime.textContent = timeString;
        }, 1000);

        // Current Timestamp
        const updateTimestamp = () => {
            const timestamp = new Date().toLocaleString('en-GB');
            if (this.dom.currentTimestamp) this.dom.currentTimestamp.textContent = timestamp;
        };
        this.timers.timestamp = setInterval(updateTimestamp, 1000);
        updateTimestamp(); // Call once immediately
    },
};

// --- ENTRY POINT ---
// The `defer` attribute on the script tag ensures this runs after the DOM is fully parsed.
fileSystemManager.init();
