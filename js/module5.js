// Module 5: GDPR Data Protection Training JavaScript (Refactored)

// Data is separated from logic for easier maintenance.
const breachScenarios = [
    {
        id: 1,
        title: "INCIDENT #1: EMAIL ERROR",
        description: "A marketing team member accidentally sent a newsletter with the customer list visible to all 2,000 recipients. The email contained names, email addresses, and order preferences.",
        dataInvolved: ["2,000 customer email addresses", "Customer names", "Honey product preferences", "Premium customer status"],
        questions: [
            {
                question: "What's your immediate priority?",
                options: [
                    { value: "recall-email", text: "Try to recall the email" },
                    { value: "report-ico", text: "Report to ICO immediately" },
                    { value: "assess-data", text: "Assess what data was exposed" },
                    { value: "email-customers", text: "Email all customers about the breach" }
                ],
                correct: "recall-email",
                explanation: "Correct. The first priority is containment—try to recall the email to minimize exposure."
            },
            {
                question: "Is this a high-risk breach requiring ICO notification?",
                options: [
                    { value: "yes-high", text: "Yes - high risk, notify ICO" },
                    { value: "low-risk", text: "Low risk - just document internally" }
                ],
                correct: "low-risk",
                explanation: "Correct. This is low risk. It contains no financial, health, or sensitive special category data. It should be documented internally, but does not require an ICO report."
            },
            {
                question: "Do you need to notify the affected customers?",
                options: [
                    { value: "yes-notify", text: "Yes, notify all 2,000 customers" },
                    { value: "no-notify", text: "No notification needed as it's low risk" }
                ],
                correct: "no-notify",
                explanation: "Correct. Individual notification is not required for low-risk breaches where harm to the individual is unlikely. This avoids causing unnecessary alarm."
            }
        ]
    },
    // ... (Add your other two breach scenarios here, they are well-structured)
];

const Module5 = {
    // DOM references, cached for performance
    dom: {
        moduleProgress: document.getElementById('module-progress'),
        // Dynamic elements will be queried when needed
    },

    // Centralized state for the entire module
    state: {
        currentPhase: 0,
        startTime: null,
        dataInventoryDiscovered: 0,
        classificationCorrect: 0,
        rightsScenariosCompleted: 0,
        breachScenariosCompleted: {}, // { scenarioId: isCorrect }
        timers: {} // To hold interval IDs
    },

    // Main entry point
    init() {
        console.log('Initializing Module 5: GDPR Data Protection (Refactored)');
        this.state.startTime = Date.now();
        this.bindEvents();
        this.showSection('briefing-section');
        this.updateProgress(0);
    },

    // Centralized event handler using delegation
    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const target = e.target;
            const actionTarget = target.closest('[data-action]');

            if (actionTarget) {
                const { action, phase, scenarioId } = actionTarget.dataset;
                this.handleAction(action, { phase, scenarioId });
            }
        });
    },

    // Route all actions from a single point
    handleAction(action, params) {
        switch (action) {
            case 'return-home':
                window.location.href = 'index.html';
                break;
            case 'start-training':
                this.startTraining();
                break;
            case 'complete-phase':
                this.completePhase(parseInt(params.phase, 10));
                break;
            case 'complete-module':
                this.completeModule();
                break;
            case 'discover-data-area':
                this.discoverDataArea(event.target.closest('.data-area'));
                break;
            case 'check-rights-scenario':
                this.checkRightsScenario(parseInt(params.scenarioId, 10));
                break;
            case 'show-breach-scenario':
                this.showBreachScenario(parseInt(params.scenarioId, 10));
                break;
            case 'check-breach-scenario':
                this.checkBreachScenario(parseInt(params.scenarioId, 10));
                break;
            case 'download-certificate':
                this.downloadCertificate();
                break;
        }
    },

    // --- Core UI & Progress ---

    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            window.scrollTo(0, 0);
        }
    },

    updateProgress(percentage) {
        if (this.dom.moduleProgress) {
            this.dom.moduleProgress.textContent = `${Math.round(percentage)}%`;
        }
    },

    startTraining() {
        this.showSection('training-phase-1');
        this.updateProgress(10);
        this.setupPhase1();
    },

    completePhase(phase) {
        let nextSectionId = '';
        let nextProgress = 0;

        switch (phase) {
            case 1:
                nextSectionId = 'training-phase-2';
                nextProgress = 35;
                this.setupPhase2();
                break;
            case 2:
                nextSectionId = 'training-phase-3';
                nextProgress = 60;
                this.setupPhase3();
                break;
            case 3:
                nextSectionId = 'training-phase-4';
                nextProgress = 85;
                this.setupPhase4();
                break;
        }

        if (nextSectionId) {
            this.showSection(nextSectionId);
            this.updateProgress(nextProgress);
        }
    },

    completeModule() {
        this.updateProgress(100);
        this.showSection('assessment-complete');
        this.showNotification('🎓 Module 5 Complete - GDPR Data Guardian!', 'success');

        const completionTime = Math.round((Date.now() - this.state.startTime) / 60000);
        document.getElementById('final-score').textContent = '95'; // Example score
        document.getElementById('completion-time').textContent = completionTime.toString();
    },

    // --- Phase 1: Data Discovery ---

    setupPhase1() {
        // ICO Calculator
        const breachSizeSlider = document.getElementById('breach-size');
        if (breachSizeSlider) {
            breachSizeSlider.addEventListener('input', () => this.updateFineCalculation());
            this.updateFineCalculation();
        }

        // Data Inventory Game - set up actions on clickable areas
        document.querySelectorAll('.data-area').forEach(area => {
            area.setAttribute('data-action', 'discover-data-area');
        });
    },

    updateFineCalculation() {
        const breachSize = parseInt(document.getElementById('breach-size')?.value || 5000);
        document.getElementById('breach-count').textContent = breachSize.toLocaleString();
        
        const baseFine = Math.min(breachSize * 25, 500000);
        const legalCosts = Math.min(baseFine * 0.2, 100000);
        const reputationCosts = baseFine * 1.6;
        const compensationCosts = breachSize * 10;
        const totalCost = baseFine + legalCosts + reputationCosts + compensationCosts;
        
        document.getElementById('fine-amount').textContent = baseFine.toLocaleString();
        document.getElementById('legal-costs').textContent = legalCosts.toLocaleString();
        document.getElementById('reputation-costs').textContent = reputationCosts.toLocaleString();
        document.getElementById('compensation-costs').textContent = compensationCosts.toLocaleString();
        document.getElementById('total-cost').textContent = totalCost.toLocaleString();
    },

    discoverDataArea(areaElement) {
        if (!areaElement || areaElement.classList.contains('discovered')) return;

        areaElement.classList.add('discovered');
        areaElement.querySelector('.data-types')?.classList.remove('hidden');
        
        this.state.dataInventoryDiscovered++;
        document.getElementById('data-inventory-score').textContent = `Areas Discovered: ${this.state.dataInventoryDiscovered}/4`;

        if (this.state.dataInventoryDiscovered === 4) {
            document.getElementById('complete-phase-1').disabled = false;
            this.showNotification('🎯 Data Discovery Complete!', 'success');
        }
    },

    // --- Phase 2: Classification ---

    setupPhase2() {
        const documents = document.querySelectorAll('.document-card');
        const dropZones = document.querySelectorAll('.drop-zone');
        
        documents.forEach(doc => {
            doc.addEventListener('dragstart', e => {
                e.dataTransfer.setData('text/plain', doc.dataset.document);
                doc.classList.add('dragging');
            });
            doc.addEventListener('dragend', () => doc.classList.remove('dragging'));
        });
        
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', e => e.preventDefault());
            zone.addEventListener('dragenter', e => e.currentTarget.classList.add('drag-over'));
            zone.addEventListener('dragleave', e => e.currentTarget.classList.remove('drag-over'));
            zone.addEventListener('drop', e => this.handleDocumentDrop(e));
        });
    },

    handleDocumentDrop(e) {
        e.preventDefault();
        const dropZone = e.currentTarget;
        dropZone.classList.remove('drag-over');

        const documentId = e.dataTransfer.getData('text/plain');
        const documentEl = document.querySelector(`[data-document="${documentId}"]`);
        if (!documentEl || documentEl.classList.contains('correct')) return;

        const correctClassification = documentEl.dataset.classification;
        const zoneLevel = dropZone.dataset.level;

        if (correctClassification === zoneLevel) {
            documentEl.classList.add('correct');
            dropZone.querySelector('.drop-area').appendChild(documentEl);
            
            this.state.classificationCorrect++;
            document.getElementById('classification-score').textContent = `Documents Classified: ${this.state.classificationCorrect}/8`;
            
            const countEl = dropZone.querySelector('.document-count');
            const currentCount = parseInt(countEl.textContent.charAt(0)) + 1;
            countEl.textContent = `${currentCount}/2 correct`;

            if (this.state.classificationCorrect === 8) {
                document.getElementById('complete-phase-2').disabled = false;
                this.showNotification('🏆 Perfect Classification! Badge Earned!', 'success');
            }
        } else {
            documentEl.classList.add('incorrect');
            setTimeout(() => documentEl.classList.remove('incorrect'), 1000);
            this.showNotification(`❌ Incorrect! The "${documentEl.querySelector('h4').textContent}" document is ${correctClassification.toUpperCase()}.`, 'error');
        }
    },
    
    // --- Phase 3: Rights Scenarios ---
    
    setupPhase3() {
        // Convert inline onclicks to data-actions
        document.querySelectorAll('#training-phase-3 .scenario-btn').forEach(btn => {
            btn.setAttribute('data-action', 'check-rights-scenario');
            // The scenario ID needs to be determined from the parent structure, e.g., from the parent .request-scenario
            const scenarioId = btn.closest('.request-scenario').id.split('-')[1];
            btn.setAttribute('data-scenario-id', scenarioId);
        });
    },
    
    checkRightsScenario(scenarioId) {
        // Implement the logic for checking answers for Phase 3 here
        // This is a placeholder for your existing logic
        console.log(`Checking answers for rights scenario ${scenarioId}`);
        const scenarioEl = document.getElementById(`scenario-${scenarioId}`);
        scenarioEl.classList.add('completed');
        
        // Example check:
        const isCorrect = true; // Replace with actual answer checking
        if (isCorrect) {
            this.state.rightsScenariosCompleted++;
            document.getElementById('rights-completion').textContent = `Scenarios Completed: ${this.state.rightsScenariosCompleted}/3`;
            
            if (this.state.rightsScenariosCompleted === 3) {
                 document.getElementById('complete-phase-3').disabled = false;
                 this.showNotification('👍 Rights Management Mastered!', 'success');
            }
        }
    },
    
    // --- Phase 4: Breach Response ---

    setupPhase4() {
        this.renderTimeline();
        this.renderBreachScenario(0); // Show the first scenario by default
    },
    
    renderTimeline() {
        // Your existing timeline data can be placed here
        const timelineData = [ { time: "0-1 Hours", title: "CONTAIN" /* ... */ } ];
        const timelineEl = document.querySelector('#training-phase-4 .timeline');
        // Your logic to create and append timeline items...
    },

    renderBreachScenario(index) {
        const scenario = breachScenarios[index];
        if (!scenario) return;

        const container = document.getElementById('breach-scenarios-container');
        container.innerHTML = `
            <div class="breach-scenario active" id="breach-scenario-${scenario.id}">
                <h4>${scenario.title}</h4>
                <div class="incident-details"><p>${scenario.description}</p></div>
                
                ${scenario.questions.map((q, qIndex) => `
                    <h5>${q.question}</h5>
                    <div class="question-options">
                        ${q.options.map(opt => `<label><input type="radio" name="breach-${scenario.id}-q${qIndex}" value="${opt.value}"> ${opt.text}</label>`).join('')}
                    </div>
                `).join('')}
                
                <button data-action="check-breach-scenario" data-scenario-id="${scenario.id}">Submit Response</button>
            </div>`;

        this.startTimer(`timer-${scenario.id}`, 72 * 3600);
    },

    checkBreachScenario(scenarioId) {
        // Implement checking logic for breach scenarios
        console.log(`Checking breach scenario ${scenarioId}`);
    },

    startTimer(elementId, durationInSeconds) {
        if (this.state.timers[elementId]) clearInterval(this.state.timers[elementId]);

        let timer = durationInSeconds;
        const timerEl = document.getElementById(elementId);
        if (!timerEl) return;

        this.state.timers[elementId] = setInterval(() => {
            const hours = Math.floor(timer / 3600);
            const minutes = Math.floor((timer % 3600) / 60);
            const seconds = timer % 60;

            timerEl.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (--timer < 0) {
                clearInterval(this.state.timers[elementId]);
                timerEl.textContent = "TIME EXPIRED";
            }
        }, 1000);
    },

    // --- Utilities ---
    
    downloadCertificate() {
        this.showNotification('Certificate download would start here.', 'info');
    },

    showNotification(message, type = 'info') {
        // Create a wrapper to avoid multiple notifications
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.style.cssText = 'position: fixed; top: 80px; right: 20px; z-index: 9999; display: flex; flex-direction: column; gap: 10px;';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        const colors = { success: '#00ff00', error: '#e74c3c', info: '#00ffff' };
        
        notification.textContent = message;
        notification.style.cssText = `
            background: rgba(0, 20, 40, 0.9);
            color: ${colors[type] || colors.info};
            padding: 15px 20px;
            border-radius: 8px;
            border-left: 4px solid ${colors[type] || colors.info};
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: translateX(110%);
            transition: transform 0.5s ease;
        `;
        
        container.appendChild(notification);
        
        // Animate in
        setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(110%)';
            notification.addEventListener('transitionend', () => notification.remove());
        }, 4000);
    }
};

// Single entry point when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Module5.init();
});
