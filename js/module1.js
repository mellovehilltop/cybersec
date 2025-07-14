/**
 * js/module1.js
 *
 * Manages all interactivity for the Module 1: Email Security training.
 * This includes navigation, red flag detection, and the final assessment.
 * The script is self-contained and does not rely on global functions or inline `onclick` attributes.
 */
const module1Manager = {
    // --- STATE ---
    currentTerminalStep: -1,
    terminalContent: [
        { type: 'header', text: 'INCOMING INTEL: PHISHING ATTACKS' },
        { type: 'line', text: '<strong>METHOD:</strong> Fraudsters impersonate trusted sources to steal credentials or sensitive data.' },
        { type: 'line', text: '<strong>PRIMARY TARGET:</strong> Your login details. Giving these away is like handing over the keys to our entire operation.' },
        { type: 'header', text: 'THREAT 2: SPEAR PHISHING' },
        { type: 'line', text: '<strong>METHOD:</strong> This is personal. Attackers use your name, job title, and project details to build trust before they strike.' },
        { type: 'line', text: '<strong>PRIMARY TARGET:</strong> High-value individuals with access to sensitive systems. That could be you.' },
        { type: 'header', text: 'THREAT 3: MALWARE ATTACHMENTS' },
        { type: 'line', text: '<strong>METHOD:</strong> Malicious code hidden inside seemingly harmless files like invoices, reports, or images.' },
        { type: 'line', text: '<strong>PRIMARY TARGET:</strong> Your computer and, through it, the entire Hilltop Honey network.' },
        { type: 'header', text: 'THREAT 4: BUSINESS EMAIL COMPROMISE (BEC)' },
        { type: 'line', text: '<strong>METHOD:</strong> The attacker poses as a senior executive or a supplier to trick you into making urgent, unauthorized payments.' },
        { type: 'line', text: '<strong>PRIMARY TARGET:</strong> The company’s bank account. These attacks are direct financial theft.' },
        { type: 'header', text: 'ANALYSIS COMPLETE' },
    ],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress(1);
    },

    cacheDOMElements() {
        this.dom.sections = document.querySelectorAll('.training-section');
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.actionButtons = document.querySelectorAll('[data-action]');
        // Terminal-specific elements
        this.dom.terminalOutput = document.getElementById('terminal-output');
        this.dom.terminalNextBtn = document.querySelector('[data-action="terminal-next"]');
        this.dom.phase1ContinueBtn = document.getElementById('phase-1-continue-btn');
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset));
        });
    },

    // --- EVENT HANDLERS ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training':
                this.showSection('training-phase-1');
                this.updateProgress(2);
                this.renderNextTerminalLine(); // Start the terminal
                break;
            case 'terminal-next': this.renderNextTerminalLine(); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            // ... other actions for other phases will go here later
        }
    },
    
    // --- CORE LOGIC ---
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const percentage = ((step - 1) / 4) * 100; // 5 total steps including briefing
        this.dom.moduleProgress.textContent = `${Math.round(percentage)}%`;
    },
    
    renderNextTerminalLine() {
        this.currentTerminalStep++;
        
        if (this.currentTerminalStep < this.terminalContent.length) {
            const stepData = this.terminalContent[this.currentTerminalStep];
            const newLine = document.createElement('div');
            newLine.className = `terminal-line ${stepData.type}`;
            newLine.innerHTML = stepData.text;
            
            this.dom.terminalOutput.appendChild(newLine);
            
            // Auto-scroll to the new line
            this.dom.terminalOutput.scrollTop = this.dom.terminalOutput.scrollHeight;
        }

        // Check if it's the last step
        if (this.currentTerminalStep >= this.terminalContent.length - 1) {
            this.dom.terminalNextBtn.style.display = 'none'; // Hide "NEXT" button
            this.dom.phase1ContinueBtn.style.display = 'block'; // Show "CONTINUE" button
        }
    },

    completePhase(phase) {
        const nextPhase = phase + 1;
        this.updateProgress(nextPhase + 1);
        
        // This logic will be expanded as you build out the other phases
        if (phase === 1) {
            alert("Phase 2 is not yet built."); // Placeholder
            // this.showSection('training-phase-2');
        }
    },
};

// --- ENTRY POINT ---
module1Manager.init();

// --- ENTRY POINT ---
// The 'defer' attribute ensures this runs after the DOM is fully parsed.
module1Manager.init();
