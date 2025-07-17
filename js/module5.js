// Module 5: GDPR Data Protection Training JavaScript
// Following the established pattern from other modules

const Module5 = {
    // DOM references
    dom: {
        sections: document.querySelectorAll('.training-section'),
        moduleProgress: document.getElementById('module-progress'),
        buttons: document.querySelectorAll('[data-action]')
    },

    // Reset scenario for retry
    resetScenario(scenarioNumber) {
        // Clear all radio button selections for this scenario
        const scenarioElement = document.getElementById(`scenario-${scenarioNumber}`);
        if (scenarioElement) {
            const radioButtons = scenarioElement.querySelectorAll('input[type="radio"]');
            radioButtons.forEach(radio => {
                radio.checked = false;
            });
            
            // Hide feedback
            const feedbackElement = document.getElementById(`scenario-${scenarioNumber}-feedback`);
            if (feedbackElement) {
                feedbackElement.classList.add('hidden');
            }
            
            // Show hint message
            this.showNotification('Questions reset! Use the procedure guide to help you answer correctly.', 'info');
        }
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

    / Phase 4 Enhanced JavaScript - Replace your existing Phase 4 JavaScript

// Enhanced breach scenarios with more detail
const breachScenarios = [
    {
        id: 1,
        title: "INCIDENT #1: EMAIL ERROR",
        description: "Marketing team member accidentally sent newsletter with customer list visible to all 2,000 recipients. Email contained names, email addresses, and order preferences of premium customers.",
        dataInvolved: [
            "2,000 customer email addresses",
            "Customer names", 
            "Honey product preferences",
            "Premium customer status"
        ],
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
                explanation: "First priority is containment - try to recall the email to minimize exposure."
            },
            {
                question: "Is this a high-risk breach requiring ICO notification?",
                options: [
                    { value: "yes-high", text: "Yes - high risk, notify ICO" },
                    { value: "medium-risk", text: "Medium risk - consider notification" },
                    { value: "low-risk", text: "Low risk - just document internally" },
                    { value: "not-breach", text: "Not a personal data breach" }
                ],
                correct: "low-risk",
                explanation: "Low risk - just email addresses and preferences. No financial data, no medical data, no passwords."
            },
            {
                question: "Do you need to notify the affected customers?",
                options: [
                    { value: "yes-notify", text: "Yes, notify all 2,000 customers" },
                    { value: "no-notify", text: "No notification needed" },
                    { value: "risk-assessment", text: "Consider based on risk assessment" },
                    { value: "ico-decide", text: "Let ICO decide" }
                ],
                correct: "no-notify",
                explanation: "Individual notification NOT needed for low-risk breaches. Just document internally."
            }
        ]
    },
    {
        id: 2,
        title: "INCIDENT #2: LAPTOP THEFT",
        description: "Production manager's laptop stolen from car containing unencrypted files with employee personal data including bank details for 45 staff members.",
        dataInvolved: [
            "45 employee records",
            "Bank account details",
            "Home addresses",
            "National Insurance numbers",
            "Salary information"
        ],
        questions: [
            {
                question: "What's your immediate priority?",
                options: [
                    { value: "call-police", text: "Call the police immediately" },
                    { value: "contain-breach", text: "Contain the breach - change passwords" },
                    { value: "notify-ico", text: "Notify ICO within 72 hours" },
                    { value: "tell-employees", text: "Tell affected employees immediately" }
                ],
                correct: "contain-breach",
                explanation: "First priority is containment - change passwords, remote wipe if possible, secure systems."
            },
            {
                question: "Is this a high-risk breach requiring ICO notification?",
                options: [
                    { value: "yes-high", text: "Yes - high risk, notify ICO" },
                    { value: "medium-risk", text: "Medium risk - consider notification" },
                    { value: "low-risk", text: "Low risk - just document internally" },
                    { value: "not-breach", text: "Not a personal data breach" }
                ],
                correct: "yes-high",
                explanation: "HIGH RISK - Financial data exposed, identity theft possible. ICO notification required within 72 hours."
            },
            {
                question: "Do you need to notify the affected employees?",
                options: [
                    { value: "yes-notify", text: "Yes, notify all affected employees" },
                    { value: "no-notify", text: "No notification needed" },
                    { value: "risk-assessment", text: "Consider based on risk assessment" },
                    { value: "ico-decide", text: "Let ICO decide" }
                ],
                correct: "yes-notify",
                explanation: "YES - High risk to individuals. They need to take action (monitor bank accounts, etc.)"
            }
        ]
    },
    {
        id: 3,
        title: "INCIDENT #3: SYSTEM HACK",
        description: "Cyber attack on order system exposed customer payment details. 500 customers affected including credit card numbers and billing addresses.",
        dataInvolved: [
            "500 customer payment cards",
            "Credit card numbers",
            "Billing addresses",
            "Order history",
            "Customer phone numbers"
        ],
        questions: [
            {
                question: "What's your immediate priority?",
                options: [
                    { value: "isolate-systems", text: "Isolate affected systems" },
                    { value: "notify-banks", text: "Notify credit card companies" },
                    { value: "tell-customers", text: "Tell customers immediately" },
                    { value: "call-police", text: "Call police cyber crime unit" }
                ],
                correct: "isolate-systems",
                explanation: "First priority is containment - isolate systems to prevent further damage."
            },
            {
                question: "Is this a high-risk breach requiring ICO notification?",
                options: [
                    { value: "yes-high", text: "Yes - high risk, notify ICO immediately" },
                    { value: "medium-risk", text: "Medium risk - consider notification" },
                    { value: "low-risk", text: "Low risk - just document internally" },
                    { value: "not-breach", text: "Not a personal data breach" }
                ],
                correct: "yes-high",
                explanation: "VERY HIGH RISK - Financial data exposed, fraud likely. ICO notification required within 72 hours."
            },
            {
                question: "Do you need to notify the affected customers?",
                options: [
                    { value: "yes-immediately", text: "Yes, notify customers immediately" },
                    { value: "no-notify", text: "No notification needed" },
                    { value: "after-investigation", text: "After investigation complete" },
                    { value: "ico-decide", text: "Let ICO decide" }
                ],
                correct: "yes-immediately",
                explanation: "YES - Customers need to cancel cards and monitor accounts. Financial fraud is likely."
            }
        ]
    }
];

// Enhanced Module 5 GDPR Training Manager
const Module5Manager = {
    currentScenario: 0,
    scenarioAnswers: {},
    
    // Initialize Phase 4 with enhanced timeline
    setupPhase4() {
        console.log('Setting up Phase 4: Breach Response');
        this.updateTimelineBoxes();
        this.showScenario(0);
        this.startBreachTimer();
    },
    
    // Update timeline boxes with detailed information
    updateTimelineBoxes() {
        const timelineData = [
            {
                time: "0-1 Hours",
                title: "CONTAIN", 
                actions: [
                    "Try to recall emails if possible",
                    "Change passwords if systems compromised",
                    "Isolate affected systems",
                    "Stop further data loss",
                    "Document what happened"
                ]
            },
            {
                time: "1-24 Hours", 
                title: "ASSESS",
                actions: [
                    "Risk assessment: How many people affected?",
                    "What type of data exposed?",
                    "Is it financial/medical data?",
                    "Can criminals use this data?",
                    "Are people at risk of harm?"
                ]
            },
            {
                time: "24-72 Hours",
                title: "REPORT ICO",
                actions: [
                    "ICO Notification Required for:",
                    "High risk to individuals",
                    "Financial data exposed", 
                    "Medical/health data",
                    "Large numbers affected (1000+)",
                    "Identity theft possible"
                ]
            },
            {
                time: "Within 1 Month",
                title: "NOTIFY PEOPLE",
                actions: [
                    "Tell individuals if:",
                    "High risk to them",
                    "They need to take action",
                    "Could lead to fraud",
                    "Financial loss possible",
                    "NOT needed for low-risk breaches"
                ]
            }
        ];
        
        const timeline = document.querySelector('.timeline');
        if (timeline) {
            timeline.innerHTML = timelineData.map(item => `
                <div class="timeline-item">
                    <span class="time">${item.time}</span>
                    <h4>${item.title}</h4>
                    <ul>
                        ${item.actions.map(action => `<li>${action}</li>`).join('')}
                    </ul>
                </div>
            `).join('');
        }
    },
    
    // Show specific breach scenario
    showScenario(scenarioIndex) {
        // Hide all scenarios
        document.querySelectorAll('.breach-scenario').forEach(scenario => {
            scenario.style.display = 'none';
        });
        
        const scenario = breachScenarios[scenarioIndex];
        if (!scenario) return;
        
        const scenarioHtml = `
            <div class="breach-scenario active" id="scenario-${scenario.id}">
                <div class="breach-alert">
                    <h4>${scenario.title}</h4>
                    <div class="incident-time">
                        <span>Time: Monday 09:15</span>
                        <span class="timer" id="timer-${scenario.id}">71:55:23</span>
                        <span>remaining</span>
                    </div>
                </div>
                
                <div class="incident-details">
                    <p><strong>Report:</strong> ${scenario.description}</p>
                    <p><strong>Data Involved:</strong></p>
                    <ul>
                        ${scenario.dataInvolved.map(data => `<li>${data}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="scenario-questions">
                    ${scenario.questions.map((q, index) => `
                        <div class="question-block">
                            <h5>${q.question}</h5>
                            <div class="question-options">
                                ${q.options.map(option => `
                                    <label>
                                        <input type="radio" name="scenario-${scenario.id}-q${index}" value="${option.value}">
                                        ${option.text}
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="scenario-actions">
                    <button class="scenario-btn" onclick="Module5Manager.checkScenario(${scenario.id})">
                        SUBMIT RESPONSE
                    </button>
                    ${scenarioIndex > 0 ? `<button class="scenario-btn" onclick="Module5Manager.showScenario(${scenarioIndex - 1})">← PREVIOUS</button>` : ''}
                    ${scenarioIndex < breachScenarios.length - 1 ? `<button class="scenario-btn" onclick="Module5Manager.showScenario(${scenarioIndex + 1})">NEXT →</button>` : ''}
                </div>
                
                <div id="scenario-${scenario.id}-feedback" class="feedback hidden"></div>
            </div>
        `;
        
        // Add to container
        const container = document.querySelector('#training-phase-4 .breach-guide');
        if (container) {
            // Remove existing scenarios
            container.querySelectorAll('.breach-scenario').forEach(s => s.remove());
            container.insertAdjacentHTML('beforeend', scenarioHtml);
        }
        
        // Update progress indicator
        this.updateScenarioProgress();
    },
    
    // Check scenario answers
    checkScenario(scenarioId) {
        const scenario = breachScenarios.find(s => s.id === scenarioId);
        if (!scenario) return;
        
        let correct = 0;
        let feedbackHtml = '<h4>Response Assessment</h4><div class="feedback-content">';
        
        scenario.questions.forEach((question, index) => {
            const selectedAnswer = document.querySelector(`input[name="scenario-${scenarioId}-q${index}"]:checked`);
            
            if (selectedAnswer) {
                if (selectedAnswer.value === question.correct) {
                    correct++;
                    feedbackHtml += `<p>✅ <strong>Question ${index + 1}:</strong> Correct! ${question.explanation}</p>`;
                } else {
                    feedbackHtml += `<p>❌ <strong>Question ${index + 1}:</strong> Incorrect. ${question.explanation}</p>`;
                }
            } else {
                feedbackHtml += `<p>⚠️ <strong>Question ${index + 1}:</strong> No answer selected.</p>`;
            }
        });
        
        feedbackHtml += '</div>';
        
        // Show feedback
        const feedbackElement = document.getElementById(`scenario-${scenarioId}-feedback`);
        if (feedbackElement) {
            feedbackElement.innerHTML = feedbackHtml;
            feedbackElement.classList.remove('hidden');
        }
        
        // Update progress
        this.scenarioAnswers[scenarioId] = correct;
        this.updateScenarioProgress();
        
        // Show success message if all correct
        if (correct === scenario.questions.length) {
            setTimeout(() => {
                this.showNotification(`✅ Scenario ${scenarioId} completed successfully!`, 'success');
            }, 1000);
        }
        
        // Check if all scenarios completed
        if (Object.keys(this.scenarioAnswers).length === breachScenarios.length) {
            this.checkPhaseCompletion();
        }
    },
    
    // Update scenario progress display
    updateScenarioProgress() {
        const completed = Object.keys(this.scenarioAnswers).length;
        const total = breachScenarios.length;
        
        const progressElement = document.getElementById('breach-completion');
        if (progressElement) {
            progressElement.textContent = `Scenarios Completed: ${completed}/${total}`;
        }
    },
    
    // Check if phase 4 is complete
    checkPhaseCompletion() {
        const totalCorrect = Object.values(this.scenarioAnswers).reduce((sum, score) => sum + score, 0);
        const totalQuestions = breachScenarios.reduce((sum, scenario) => sum + scenario.questions.length, 0);
        
        if (totalCorrect >= Math.floor(totalQuestions * 0.8)) { // 80% pass rate
            const completeBtn = document.getElementById('complete-module-5');
            if (completeBtn) {
                completeBtn.disabled = false;
            }
            this.showNotification('🎉 Phase 4 Complete! You are ready for data breach response.', 'success');
        }
    },
    
    // Start breach response timer
    startBreachTimer() {
        const timers = document.querySelectorAll('[id^="timer-"]');
        
        timers.forEach(timerElement => {
            let timeLeft = 72 * 60 * 60; // 72 hours in seconds
            
            const timer = setInterval(() => {
                const hours = Math.floor(timeLeft / 3600);
                const minutes = Math.floor((timeLeft % 3600) / 60);
                const seconds = timeLeft % 60;
                
                timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 0) {
                    clearInterval(timer);
                    timerElement.textContent = 'TIME EXPIRED';
                    timerElement.style.color = '#ff0000';
                    timerElement.style.textShadow = '0 0 20px #ff0000';
                }
                
                timeLeft--;
            }, 1000);
        });
    },
    
    // Show notification
    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ${type === 'success' ? 'background: rgba(0,255,0,0.1); border: 2px solid #00ff00; color: #00ff00;' : ''}
            ${type === 'error' ? 'background: rgba(255,0,0,0.1); border: 2px solid #ff0000; color: #ff0000;' : ''}
            ${type === 'warning' ? 'background: rgba(255,165,0,0.1); border: 2px solid #ffa500; color: #ffa500;' : ''}
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Make sure Module5Manager is available globally
    window.Module5Manager = Module5Manager;
    
    // Setup Phase 4 if on that phase
    if (document.getElementById('training-phase-4')) {
        Module5Manager.setupPhase4();
    }
});
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
