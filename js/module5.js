// Module 5: GDPR Data Protection Training JavaScript
// Following the established pattern from other modules

const Module5 = {
    // DOM references
    dom: {
        sections: document.querySelectorAll('.training-section'),
        moduleProgress: document.getElementById('module-progress'),
        buttons: document.querySelectorAll('[data-action]')
    },

    // Module state
    state: {
        currentPhase: 0,
        startTime: Date.now(),
        dataInventoryComplete: false,
        classificationComplete: false,
        rightsComplete: false,
        breachComplete: false,
        scenariosCompleted: 0,
        breachesHandled: 0
    },

    // Initialize module
    init() {
        console.log('Initializing Module 5: GDPR Data Protection');
        this.bindEvents();
        this.setupInteractiveElements();
        this.updateProgress(0);
    },

    // Bind event listeners
    bindEvents() {
        // Handle action buttons
        this.dom.buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const dataset = e.target.dataset;
                this.handleAction(dataset);
            });
        });

        // Handle document click events for data areas
        document.addEventListener('click', (e) => {
            if (e.target.closest('.data-area')) {
                this.handleDataAreaClick(e.target.closest('.data-area'));
            }
        });

        // Handle scenario buttons
        window.checkScenario = this.checkScenario.bind(this);
        window.checkBreach = this.checkBreach.bind(this);
        window.downloadCertificate = this.downloadCertificate.bind(this);
    },

    // Handle button actions
    handleAction(dataset) {
        const { action, phase } = dataset;
        
        switch (action) {
            case 'return-home': 
                window.location.href = 'index.html'; 
                break;
                
            case 'start-training': 
                this.showSection('training-phase-1'); 
                this.updateProgress(10);
                this.setupPhase1();
                break;
                
            case 'complete-phase': 
                this.completePhase(parseInt(phase, 10)); 
                break;
                
            case 'complete-module':
                this.completeModule();
                break;
        }
    },

    // Show specific section
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
            console.log('Showing section:', sectionId);
        }
    },

    // Update progress display
    updateProgress(percentage) {
        if (this.dom.moduleProgress) {
            this.dom.moduleProgress.textContent = `${percentage}%`;
        }
    },

    // Setup interactive elements
    setupInteractiveElements() {
        this.setupICOCalculator();
        this.setupDragAndDrop();
    },

    // Setup Phase 1 elements
    setupPhase1() {
        this.setupICOCalculator();
        this.setupDataInventoryGame();
    },

    // Setup ICO Fine Calculator
    setupICOCalculator() {
        const breachSizeSlider = document.getElementById('breach-size');
        if (breachSizeSlider) {
            breachSizeSlider.addEventListener('input', this.updateFineCalculation);
            this.updateFineCalculation(); // Set initial values
        }
    },

    // Update fine calculation
    updateFineCalculation() {
        const breachSize = parseInt(document.getElementById('breach-size')?.value || 5000);
        const breachCount = document.getElementById('breach-count');
        
        if (breachCount) {
            breachCount.textContent = breachSize.toLocaleString();
        }
        
        // Calculate realistic UK GDPR fines
        let baseFine = Math.min(breachSize * 25, 500000);
        if (breachSize > 10000) {
            baseFine = baseFine * 1.5;
        }
        
        const legalCosts = Math.min(baseFine * 0.2, 100000);
        const reputationCosts = baseFine * 1.6;
        const compensationCosts = breachSize * 10;
        const totalCost = baseFine + legalCosts + reputationCosts + compensationCosts;
        
        // Update display elements
        const elements = {
            'fine-amount': baseFine.toLocaleString(),
            'legal-costs': legalCosts.toLocaleString(),
            'reputation-costs': reputationCosts.toLocaleString(),
            'compensation-costs': compensationCosts.toLocaleString(),
            'total-cost': totalCost.toLocaleString()
        };
        
        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });
    },

    // Setup data inventory game
    setupDataInventoryGame() {
        const dataAreas = document.querySelectorAll('.data-area');
        let areasDiscovered = 0;
        
        dataAreas.forEach(area => {
            area.addEventListener('click', () => {
                if (!area.classList.contains('discovered')) {
                    area.classList.add('discovered');
                    const dataTypes = area.querySelector('.data-types');
                    if (dataTypes) {
                        dataTypes.classList.remove('hidden');
                    }
                    
                    areasDiscovered++;
                    const scoreDisplay = document.getElementById('data-inventory-score');
                    if (scoreDisplay) {
                        scoreDisplay.textContent = `Areas Discovered: ${areasDiscovered}/4`;
                    }
                    
                    if (areasDiscovered === 4) {
                        this.state.dataInventoryComplete = true;
                        const completeBtn = document.getElementById('complete-phase-1');
                        if (completeBtn) {
                            completeBtn.disabled = false;
                        }
                        this.showBadgeNotification('🎯 Data Discovery Complete!');
                    }
                }
            });
        });
    },

    // Handle data area clicks
    handleDataAreaClick(area) {
        if (!area.classList.contains('discovered')) {
            area.classList.add('discovered');
            const dataTypes = area.querySelector('.data-types');
            if (dataTypes) {
                dataTypes.classList.remove('hidden');
            }
        }
    },

    // Setup drag and drop for Phase 2
    setupDragAndDrop() {
        const documents = document.querySelectorAll('.document-card');
        const dropZones = document.querySelectorAll('.drop-zone');
        let correctClassifications = 0;
        
        // Make documents draggable
        documents.forEach(doc => {
            doc.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', doc.dataset.document);
                e.dataTransfer.setData('classification', doc.dataset.classification);
                doc.classList.add('dragging');
            });
            
            doc.addEventListener('dragend', (e) => {
                doc.classList.remove('dragging');
            });
        });
        
        // Set up drop zones
        dropZones.forEach(zone => {
            zone.addEventListener('dragover', (e) => e.preventDefault());
            zone.addEventListener('dragenter', (e) => {
                e.preventDefault();
                zone.classList.add('drag-over');
            });
            zone.addEventListener('dragleave', () => {
                zone.classList.remove('drag-over');
            });
            
            zone.addEventListener('drop', (e) => {
                e.preventDefault();
                zone.classList.remove('drag-over');
                
                const documentId = e.dataTransfer.getData('text/plain');
                const correctClassification = e.dataTransfer.getData('classification');
                const zoneLevel = zone.dataset.level;
                
                const documentElement = document.querySelector(`[data-document="${documentId}"]`);
                
                if (correctClassification === zoneLevel) {
                    // Correct classification
                    documentElement.classList.add('correct');
                    zone.querySelector('.drop-area').appendChild(documentElement);
                    
                    correctClassifications++;
                    const scoreDisplay = document.getElementById('classification-score');
                    if (scoreDisplay) {
                        scoreDisplay.textContent = `Documents Classified: ${correctClassifications}/8`;
                    }
                    
                    if (correctClassifications === 8) {
                        this.state.classificationComplete = true;
                        const completeBtn = document.getElementById('complete-phase-2');
                        if (completeBtn) {
                            completeBtn.disabled = false;
                        }
                        this.showBadgeNotification('🏆 Perfect Classification! Data Classifier Badge Earned!');
                    }
                } else {
                    // Incorrect classification
                    documentElement.classList.add('incorrect');
                    setTimeout(() => {
                        documentElement.classList.remove('incorrect');
                    }, 1000);
                    
                    this.showNotification(`❌ Incorrect! This should be "${correctClassification.toUpperCase()}"`, 'error');
                }
            });
        });
    },

    // Complete phase
    completePhase(phase) {
        console.log('Completing phase:', phase);
        
        let nextSectionId = '';
        let nextProgress = 0;
        
        switch (phase) {
            case 1:
                nextSectionId = 'training-phase-2';
                nextProgress = 35;
                setTimeout(() => this.setupPhase2(), 100);
                break;
            case 2:
                nextSectionId = 'training-phase-3';
                nextProgress = 60;
                setTimeout(() => this.setupPhase3(), 100);
                break;
            case 3:
                nextSectionId = 'training-phase-4';
                nextProgress = 85;
                setTimeout(() => this.setupPhase4(), 100);
                break;
        }
        
        this.showSection(nextSectionId);
        this.updateProgress(nextProgress);
    },

    // Setup Phase 2
    setupPhase2() {
        this.setupDragAndDrop();
    },

    // Setup Phase 3
    setupPhase3() {
        console.log('Setting up Phase 3: Rights Management');
    },

    // Setup Phase 4
    setupPhase4() {
        this.startBreachTimers();
    },

    // Start breach timers
    startBreachTimers() {
        const timers = ['timer-1', 'timer-2', 'timer-3'];
        
        timers.forEach(timerId => {
            const timerElement = document.getElementById(timerId);
            if (timerElement) {
                let timeLeft = 72 * 60 * 60; // 72 hours in seconds
                
                const timer = setInterval(() => {
                    const hours = Math.floor(timeLeft / 3600);
                    const minutes = Math.floor((timeLeft % 3600) / 60);
                    const seconds = timeLeft % 60;
                    
                    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                    
                    if (timeLeft <= 0) {
                        clearInterval(timer);
                        timerElement.textContent = 'TIME EXPIRED';
                        timerElement.style.color = '#e74c3c';
                    }
                    
                    timeLeft--;
                }, 1000);
            }
        });
    },

    // Check scenario answers
    checkScenario(scenarioNumber) {
        let correct = 0;
        let feedback = '';
        
        if (scenarioNumber === 1) {
            const requestType = document.querySelector('input[name="request-type-1"]:checked');
            const firstStep = document.querySelector('input[name="first-step-1"]:checked');
            const deadline = document.querySelector('input[name="deadline-1"]:checked');
            
            if (requestType?.value === 'access') {
                correct++;
                feedback += '✅ Correct: This is a Subject Access Request<br>';
            } else {
                feedback += '❌ Incorrect: This is a Subject Access Request - customer wants all their data<br>';
            }
            
            if (firstStep?.value === 'verify-identity') {
                correct++;
                feedback += '✅ Correct: Always verify identity first<br>';
            } else {
                feedback += '❌ Incorrect: Must verify identity before providing personal data<br>';
            }
            
            if (deadline?.value === '1-month') {
                correct++;
                feedback += '✅ Correct: 1 month deadline for Subject Access Requests<br>';
            } else {
                feedback += '❌ Incorrect: You have 1 month to respond to Subject Access Requests<br>';
            }
        }
        
        // Display feedback
        const feedbackElement = document.getElementById(`scenario-${scenarioNumber}-feedback`);
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <h4>Scenario ${scenarioNumber} Results: ${correct}/3</h4>
                <div class="feedback-content">${feedback}</div>
            `;
            feedbackElement.classList.remove('hidden');
        }
        
        if (correct === 3) {
            this.state.scenariosCompleted++;
            if (this.state.scenariosCompleted >= 1) { // Simplified for demo
                this.state.rightsComplete = true;
                const completeBtn = document.getElementById('complete-phase-3');
                if (completeBtn) {
                    completeBtn.disabled = false;
                }
                this.showBadgeNotification('🏆 Rights Management Master!');
            }
        }
    },

    // Check breach response
    checkBreach(breachNumber) {
        let correct = 0;
        let feedback = '';
        
        if (breachNumber === 1) {
            const priority = document.querySelector('input[name="priority-1"]:checked');
            const riskLevel = document.querySelector('input[name="risk-level-1"]:checked');
            const notifyIndividuals = document.querySelector('input[name="notify-individuals-1"]:checked');
            
            if (priority?.value === 'recall-email') {
                correct++;
                feedback += '✅ Correct: Try to recall/contain the breach first<br>';
            } else {
                feedback += '❌ Incorrect: First priority is containment<br>';
            }
            
            if (riskLevel?.value === 'low') {
                correct++;
                feedback += '✅ Correct: Low risk - just email addresses and preferences<br>';
            } else {
                feedback += '❌ Incorrect: This is low risk breach<br>';
            }
            
            if (notifyIndividuals?.value === 'no') {
                correct++;
                feedback += '✅ Correct: No individual notification needed<br>';
            } else {
                feedback += '❌ Incorrect: Individual notification not required<br>';
            }
        }
        
        // Display feedback
        const feedbackElement = document.getElementById(`breach-${breachNumber}-feedback`);
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <h4>Breach ${breachNumber} Response: ${correct}/3</h4>
                <div class="feedback-content">${feedback}</div>
            `;
            feedbackElement.classList.remove('hidden');
        }
        
        if (correct === 3) {
            this.state.breachesHandled++;
            if (this.state.breachesHandled >= 1) { // Simplified for demo
                this.state.breachComplete = true;
                const completeBtn = document.getElementById('complete-module-5');
                if (completeBtn) {
                    completeBtn.disabled = false;
                }
                this.showBadgeNotification('🏆 Breach Response Expert!');
            }
        }
    },

    // Complete module
    completeModule() {
        this.updateProgress(100);
        this.showSection('assessment-complete');
        this.showBadgeNotification('🎓 Module 5 Complete - GDPR Data Guardian!');
        
        // Update final scores
        const completionTime = Math.round((Date.now() - this.state.startTime) / 60000);
        const finalScoreElement = document.getElementById('final-score');
        const completionTimeElement = document.getElementById('completion-time');
        
        if (finalScoreElement) finalScoreElement.textContent = '95';
        if (completionTimeElement) completionTimeElement.textContent = completionTime.toString();
        
        console.log('Module 5 completed successfully');
    },

    // Download certificate
    downloadCertificate() {
        this.showNotification('Certificate download started...', 'success');
        console.log('Downloading GDPR certificate');
    },

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        const colors = {
            'success': '#00ff00',
            'error': '#e74c3c',
            'info': '#00ffff',
            'warning': '#f39c12'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: ${colors[type] || colors.info};
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid ${colors[type] || colors.info};
            z-index: 999;
            max-width: 400px;
            font-weight: bold;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    },

    // Show badge notification
    showBadgeNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.innerHTML = `
            <div class="badge-content">
                <h3>${message}</h3>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #f39c12, #e67e22);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #f39c12;
            box-shadow: 0 10px 30px rgba(243, 156, 18, 0.5);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            max-width: 350px;
            text-align: center;
            font-weight: bold;
        `;
        
        // Add animation
        if (!document.getElementById('badge-animations')) {
            const style = document.createElement('style');
            style.id = 'badge-animations';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Module5.init();
});

// Export for global access
window.Module5 = Module5;
