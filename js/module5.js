// Module 5: GDPR Data Protection Training JavaScript
// Hilltop Honey Cybersecurity Training System

// Global variables for module state
let currentPhase = 1;
let moduleStartTime = Date.now();
let phaseProgress = {
    phase1: 0,
    phase2: 0,
    phase3: 0,
    phase4: 0
};

// Phase completion tracking
let completionTracking = {
    dataInventoryComplete: false,
    classificationComplete: false,
    rightsComplete: false,
    breachComplete: false,
    allBadgesEarned: false
};

// Scores for final assessment
let assessmentScores = {
    dataClassification: 0,
    rightsManagement: 0,
    breachResponse: 0,
    totalScore: 0
};

// Initialize Module 5 when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeModule5();
    updateProgressDisplay();
    setupEventListeners();
    startPhase1();
});

// Main initialization function
function initializeModule5() {
    console.log('Initializing GDPR Data Protection Training Module');
    
    // Set up phase visibility
    showPhase(1);
    
    // Initialize interactive elements
    setupICOCalculator();
    setupDataInventoryGame();
    setupClassificationGame();
    setupRightsScenarios();
    setupBreachSimulator();
    
    // Start progress tracking
    updateProgressBar('main-progress', 0);
    updateProgressBar('phase1-progress', 0);
}

// Phase Management Functions
function showPhase(phaseNumber) {
    // Hide all phases
    document.querySelectorAll('.training-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected phase
    const targetPhase = document.getElementById(`phase${phaseNumber}`);
    if (targetPhase) {
        targetPhase.classList.add('active');
        currentPhase = phaseNumber;
        
        // Update header
        document.getElementById('current-phase').textContent = `Phase ${phaseNumber}`;
        
        // Calculate overall progress
        const overallProgress = ((phaseNumber - 1) * 25) + (phaseProgress[`phase${phaseNumber}`] * 0.25);
        document.getElementById('progress-percentage').textContent = `${Math.round(overallProgress)}%`;
    }
}

function updateProgressBar(barId, percentage) {
    const progressBar = document.getElementById(barId);
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
    }
}

function updateProgressDisplay() {
    const overallProgress = (phaseProgress.phase1 + phaseProgress.phase2 + phaseProgress.phase3 + phaseProgress.phase4) / 4;
    updateProgressBar('main-progress', overallProgress);
    document.getElementById('progress-percentage').textContent = `${Math.round(overallProgress)}%`;
}

// Phase 1: Mission Briefing Functions
function startPhase1() {
    console.log('Starting Phase 1: Mission Briefing');
    
    // Initialize ICO Fine Calculator
    const breachSizeSlider = document.getElementById('breach-size');
    if (breachSizeSlider) {
        breachSizeSlider.addEventListener('input', updateFineCalculation);
        updateFineCalculation(); // Initial calculation
    }
    
    // Initialize Data Inventory Game
    setupDataInventoryInteraction();
}

function setupICOCalculator() {
    const breachSizeSlider = document.getElementById('breach-size');
    if (!breachSizeSlider) return;
    
    breachSizeSlider.addEventListener('input', updateFineCalculation);
    updateFineCalculation(); // Set initial values
}

function updateFineCalculation() {
    const breachSize = parseInt(document.getElementById('breach-size').value);
    const breachCount = document.getElementById('breach-count');
    
    // Update display
    if (breachCount) {
        breachCount.textContent = breachSize.toLocaleString();
    }
    
    // Calculate realistic UK GDPR fines based on ICO guidance
    let baseFine = Math.min(breachSize * 25, 500000); // £25 per record, max £500k for smaller companies
    
    // Adjust for company size (Hilltop Honey is SME)
    if (breachSize > 10000) {
        baseFine = baseFine * 1.5; // Higher fines for larger breaches
    }
    
    const legalCosts = Math.min(baseFine * 0.2, 100000);
    const reputationCosts = baseFine * 1.6; // Reputation damage often exceeds fine
    const compensationCosts = breachSize * 10; // £10 per affected customer
    
    const totalCost = baseFine + legalCosts + reputationCosts + compensationCosts;
    
    // Update display elements
    document.getElementById('fine-amount').textContent = baseFine.toLocaleString();
    document.getElementById('legal-costs').textContent = legalCosts.toLocaleString();
    document.getElementById('reputation-costs').textContent = reputationCosts.toLocaleString();
    document.getElementById('compensation-costs').textContent = compensationCosts.toLocaleString();
    document.getElementById('total-cost').textContent = totalCost.toLocaleString();
}

function setupDataInventoryInteraction() {
    const dataAreas = document.querySelectorAll('.data-area');
    let areasDiscovered = 0;
    
    dataAreas.forEach(area => {
        area.addEventListener('click', function() {
            if (!this.classList.contains('discovered')) {
                this.classList.add('discovered');
                const dataTypes = this.querySelector('.data-types');
                if (dataTypes) {
                    dataTypes.classList.remove('hidden');
                }
                
                areasDiscovered++;
                document.getElementById('data-inventory-score').textContent = `Areas Discovered: ${areasDiscovered}/4`;
                
                if (areasDiscovered === 4) {
                    completionTracking.dataInventoryComplete = true;
                    phaseProgress.phase1 = 100;
                    updateProgressBar('phase1-progress', 100);
                    document.getElementById('complete-phase1').disabled = false;
                    
                    // Show completion message
                    showNotification('🎯 Data Inventory Complete! All areas discovered.', 'success');
                }
            }
        });
    });
}

function completePhase1() {
    if (completionTracking.dataInventoryComplete) {
        showNotification('Phase 1 Complete! Moving to Data Classification...', 'success');
        setTimeout(() => {
            showPhase(2);
        }, 1500);
    }
}

// Phase 2: Data Classification Functions
function setupClassificationGame() {
    setupDragAndDrop();
    let correctClassifications = 0;
    const totalDocuments = 8;
    
    function updateClassificationScore() {
        document.getElementById('classification-score').textContent = `Documents Classified: ${correctClassifications}/8`;
        
        if (correctClassifications === totalDocuments) {
            completionTracking.classificationComplete = true;
            phaseProgress.phase2 = 100;
            updateProgressBar('phase2-progress', 100);
            document.getElementById('complete-phase2').disabled = false;
            assessmentScores.dataClassification = 100;
            
            showNotification('🏆 Perfect Classification! Data Classifier Badge Earned!', 'success');
            awardBadge('data-classifier');
        }
    }
    
    // Store reference for use in drag/drop handlers
    window.updateClassificationScore = updateClassificationScore;
}

function setupDragAndDrop() {
    const documents = document.querySelectorAll('.document-card');
    const dropZones = document.querySelectorAll('.drop-zone');
    
    // Make documents draggable
    documents.forEach(doc => {
        doc.addEventListener('dragstart', handleDragStart);
        doc.addEventListener('dragend', handleDragEnd);
    });
    
    // Set up drop zones
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.document);
    e.dataTransfer.setData('classification', e.target.dataset.classification);
    e.target.classList.add('dragging');
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDragEnter(e) {
    e.preventDefault();
    e.target.closest('.drop-zone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.target.closest('.drop-zone').classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    const dropZone = e.target.closest('.drop-zone');
    dropZone.classList.remove('drag-over');
    
    const documentId = e.dataTransfer.getData('text/plain');
    const correctClassification = e.dataTransfer.getData('classification');
    const zoneLevel = dropZone.dataset.level;
    
    const documentElement = document.querySelector(`[data-document="${documentId}"]`);
    
    if (correctClassification === zoneLevel) {
        // Correct classification
        documentElement.classList.add('correct');
        dropZone.querySelector('.drop-area').appendChild(documentElement);
        
        // Update score
        const countElement = dropZone.querySelector('.document-count');
        const currentCount = parseInt(countElement.textContent.split('/')[0]) + 1;
        const totalNeeded = parseInt(countElement.textContent.split('/')[1]);
        countElement.textContent = `${currentCount}/${totalNeeded} correct`;
        
        // Update global score
        if (window.updateClassificationScore) {
            const allCorrect = document.querySelectorAll('.document-card.correct').length;
            window.updateClassificationScore(allCorrect);
        }
    } else {
        // Incorrect classification
        documentElement.classList.add('incorrect');
        setTimeout(() => {
            documentElement.classList.remove('incorrect');
        }, 1000);
        
        showNotification(`❌ Incorrect! This document should be classified as "${correctClassification.toUpperCase()}"`, 'error');
    }
}

function completePhase2() {
    if (completionTracking.classificationComplete) {
        showNotification('Phase 2 Complete! Moving to Rights Management...', 'success');
        setTimeout(() => {
            showPhase(3);
        }, 1500);
    }
}

// Phase 3: Rights Request Processing Functions
function setupRightsScenarios() {
    // Initialize scenario tracking
    let completedScenarios = 0;
    
    // Store functions globally for onclick handlers
    window.checkScenario1 = () => checkRightsScenario(1);
    window.checkScenario2 = () => checkRightsScenario(2);
    window.checkScenario3 = () => checkRightsScenario(3);
    
    function checkRightsScenario(scenarioNumber) {
        let correct = 0;
        let total = 0;
        let feedback = '';
        
        if (scenarioNumber === 1) {
            // Scenario 1: Sarah's Subject Access Request
            total = 3;
            
            const requestType = document.querySelector('input[name="request-type-1"]:checked');
            const firstStep = document.querySelector('input[name="first-step-1"]:checked');
            const deadline = document.querySelector('input[name="deadline-1"]:checked');
            
            if (requestType && requestType.value === 'access') {
                correct++;
                feedback += '✅ Correct: This is a Subject Access Request<br>';
            } else {
                feedback += '❌ Incorrect: This is a Subject Access Request - customer wants all their data<br>';
            }
            
            if (firstStep && firstStep.value === 'verify-identity') {
                correct++;
                feedback += '✅ Correct: Always verify identity first<br>';
            } else {
                feedback += '❌ Incorrect: Must verify identity before providing personal data<br>';
            }
            
            if (deadline && deadline.value === '1-month') {
                correct++;
                feedback += '✅ Correct: 1 month deadline for Subject Access Requests<br>';
            } else {
                feedback += '❌ Incorrect: You have 1 month to respond to Subject Access Requests<br>';
            }
            
        } else if (scenarioNumber === 2) {
            // Scenario 2: Mike's Marketing Objection
            total = 3;
            
            const requestType = document.querySelector('input[name="request-type-2"]:checked');
            const keepEmail = document.querySelector('input[name="keep-email-2"]:checked');
            const speed = document.querySelector('input[name="speed-2"]:checked');
            
            if (requestType && requestType.value === 'objection') {
                correct++;
                feedback += '✅ Correct: This is an objection to marketing processing<br>';
            } else {
                feedback += '❌ Incorrect: This is an objection to processing for marketing purposes<br>';
            }
            
            if (keepEmail && keepEmail.value === 'ask') {
                correct++;
                feedback += '✅ Correct: Ask what processing is acceptable for legitimate business needs<br>';
            } else {
                feedback += '❌ Incorrect: You can keep email for legitimate business needs (order confirmations) but should ask what\'s acceptable<br>';
            }
            
            if (speed && speed.value === 'immediately') {
                correct++;
                feedback += '✅ Correct: Stop marketing emails immediately<br>';
            } else {
                feedback += '❌ Incorrect: Must stop marketing processing immediately when customer objects<br>';
            }
            
        } else if (scenarioNumber === 3) {
            // Scenario 3: Jenny's Employee Request
            total = 3;
            
            const requestType = document.querySelector('input[name="request-type-3"]:checked');
            const emergency = document.querySelector('input[name="emergency-3"]:checked');
            const review = document.querySelector('input[name="review-3"]:checked');
            
            if (requestType && requestType.value === 'both') {
                correct++;
                feedback += '✅ Correct: Both rectification (correct contact) and access (get review copy)<br>';
            } else {
                feedback += '❌ Incorrect: This includes both rectification and access requests<br>';
            }
            
            if (emergency && emergency.value === 'verify-first') {
                correct++;
                feedback += '✅ Correct: Verify identity then update emergency contact promptly<br>';
            } else {
                feedback += '❌ Incorrect: Verify identity first, then update emergency contact - it\'s a safety issue<br>';
            }
            
            if (review && review.value === 'yes-immediately') {
                correct++;
                feedback += '✅ Correct: Employees have right to access their own performance reviews<br>';
            } else {
                feedback += '❌ Incorrect: Employee has right to access their own performance review data<br>';
            }
        }
        
        // Display feedback
        const feedbackElement = document.getElementById(`scenario-${scenarioNumber}-feedback`);
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <h4>Scenario ${scenarioNumber} Results: ${correct}/${total}</h4>
                <div class="feedback-content">${feedback}</div>
            `;
            feedbackElement.classList.remove('hidden');
        }
        
        // Update scenario completion
        if (correct === total) {
            completedScenarios++;
            document.getElementById('rights-completion').textContent = `Scenarios Completed: ${completedScenarios}/3`;
            
            // Mark scenario as complete
            document.getElementById(`scenario-${scenarioNumber}`).classList.add('completed');
            
            if (completedScenarios === 3) {
                completionTracking.rightsComplete = true;
                phaseProgress.phase3 = 100;
                updateProgressBar('phase3-progress', 100);
                document.getElementById('complete-phase3').disabled = false;
                assessmentScores.rightsManagement = 100;
                
                showNotification('🏆 Rights Management Master! Privacy Champion Badge Earned!', 'success');
                awardBadge('privacy-champion');
            } else {
                // Show next scenario
                const nextScenario = document.getElementById(`scenario-${scenarioNumber + 1}`);
                if (nextScenario) {
                    nextScenario.classList.add('active');
                }
            }
        }
        
        // Hide current scenario and show next
        if (correct === total && scenarioNumber < 3) {
            setTimeout(() => {
                document.getElementById(`scenario-${scenarioNumber}`).classList.remove('active');
                document.getElementById(`scenario-${scenarioNumber + 1}`).classList.add('active');
            }, 2000);
        }
    }
}

function completePhase3() {
    if (completionTracking.rightsComplete) {
        showNotification('Phase 3 Complete! Moving to Breach Response...', 'success');
        setTimeout(() => {
            showPhase(4);
        }, 1500);
    }
}

// Phase 4: Breach Response Simulation Functions
function setupBreachSimulator() {
    // Initialize breach scenario tracking
    let completedBreaches = 0;
    
    // Start timers for each breach
    startBreachTimer('timer-1');
    startBreachTimer('timer-2');
    startBreachTimer('timer-3');
    
    // Store functions globally for onclick handlers
    window.checkBreach1 = () => checkBreachScenario(1);
    window.checkBreach2 = () => checkBreachScenario(2);
    window.checkBreach3 = () => checkBreachScenario(3);
    
    function checkBreachScenario(breachNumber) {
        let correct = 0;
        let total = 0;
        let feedback = '';
        
        if (breachNumber === 1) {
            // Email Error Breach
            total = 3;
            
            const priority = document.querySelector('input[name="priority-1"]:checked');
            const riskLevel = document.querySelector('input[name="risk-level-1"]:checked');
            const notifyIndividuals = document.querySelector('input[name="notify-individuals-1"]:checked');
            
            if (priority && priority.value === 'recall-email') {
                correct++;
                feedback += '✅ Correct: Try to recall/contain the breach first<br>';
            } else {
                feedback += '❌ Incorrect: First priority is containment - try to recall the email<br>';
            }
            
            if (riskLevel && riskLevel.value === 'low') {
                correct++;
                feedback += '✅ Correct: Low risk - just email addresses and preferences, no special category data<br>';
            } else {
                feedback += '❌ Incorrect: This is low risk - basic contact details, not highly sensitive<br>';
            }
            
            if (notifyIndividuals && notifyIndividuals.value === 'no') {
                correct++;
                feedback += '✅ Correct: No individual notification needed for low-risk email exposure<br>';
            } else {
                feedback += '❌ Incorrect: Individual notification not required for this low-risk breach<br>';
            }
            
        } else if (breachNumber === 2) {
            // Laptop Theft Breach
            total = 3;
            
            const breachType = document.querySelector('input[name="breach-type-2"]:checked');
            const risk = document.querySelector('input[name="risk-2"]:checked');
            const employeeNotification = document.querySelector('input[name="employee-notification-2"]:checked');
            
            if (breachType && breachType.value === 'confidentiality') {
                correct++;
                feedback += '✅ Correct: Confidentiality breach - unauthorised access to personal data<br>';
            } else {
                feedback += '❌ Incorrect: This is a confidentiality breach - data accessed by unauthorised persons<br>';
            }
            
            if (risk && risk.value === 'high') {
                correct++;
                feedback += '✅ Correct: High risk - payroll and medical data of 45 employees<br>';
            } else {
                feedback += '❌ Incorrect: High risk due to financial and special category medical data<br>';
            }
            
            if (employeeNotification && employeeNotification.value === 'immediately') {
                correct++;
                feedback += '✅ Correct: Notify employees immediately so they can protect themselves<br>';
            } else {
                feedback += '❌ Incorrect: Notify employees immediately - they need to monitor for fraud<br>';
            }
            
        } else if (breachNumber === 3) {
            // Cyber Attack Breach
            total = 3;
            
            const containment = document.querySelector('input[name="containment-3"]:checked');
            const icoNotification = document.querySelector('input[name="ico-notification-3"]:checked');
            const customerNotification = document.querySelector('input[name="customer-notification-3"]:checked');
            
            if (containment && containment.value === 'isolate-breach') {
                correct++;
                feedback += '✅ Correct: Isolate compromised systems while maintaining business operations<br>';
            } else {
                feedback += '❌ Incorrect: Isolate compromised systems but keep essential operations running<br>';
            }
            
            if (icoNotification && icoNotification.value === 'definitely') {
                correct++;
                feedback += '✅ Correct: Definitely notify ICO - payment data and 8,500+ customers affected<br>';
            } else {
                feedback += '❌ Incorrect: Must notify ICO within 72 hours - this is high risk to individuals<br>';
            }
            
            if (customerNotification && customerNotification.value === 'urgent') {
                correct++;
                feedback += '✅ Correct: Urgent notification - customers need to protect their finances<br>';
            } else {
                feedback += '❌ Incorrect: Urgent notification needed - payment card details compromised<br>';
            }
        }
        
        // Display feedback
        const feedbackElement = document.getElementById(`breach-${breachNumber}-feedback`);
        if (feedbackElement) {
            feedbackElement.innerHTML = `
                <h4>Breach ${breachNumber} Response: ${correct}/${total}</h4>
                <div class="feedback-content">${feedback}</div>
            `;
            feedbackElement.classList.remove('hidden');
        }
        
        // Update breach completion
        if (correct === total) {
            completedBreaches++;
            document.getElementById('breach-completion').textContent = `Breaches Handled: ${completedBreaches}/3`;
            
            // Mark breach as complete
            document.getElementById(`breach-${breachNumber}`).classList.add('completed');
            
            if (completedBreaches === 3) {
                completionTracking.breachComplete = true;
                phaseProgress.phase4 = 100;
                updateProgressBar('phase4-progress', 100);
                document.getElementById('complete-phase4').disabled = false;
                assessmentScores.breachResponse = 100;
                
                // Update readiness checklist
                updateReadinessChecklist();
                
                showNotification('🏆 Breach Response Expert! Compliance Guardian Badge Earned!', 'success');
                awardBadge('compliance-guardian');
            } else {
                // Show next breach scenario
                const nextBreach = document.getElementById(`breach-${breachNumber + 1}`);
                if (nextBreach) {
                    nextBreach.classList.add('active');
                }
            }
        }
        
        // Hide current breach and show next
        if (correct === total && breachNumber < 3) {
            setTimeout(() => {
                document.getElementById(`breach-${breachNumber}`).classList.remove('active');
                document.getElementById(`breach-${breachNumber + 1}`).classList.add('active');
            }, 2000);
        }
    }
}

function startBreachTimer(timerId) {
    const timerElement = document.getElementById(timerId);
    if (!timerElement) return;
    
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

function updateReadinessChecklist() {
    const checkboxes = {
        'check-classification': completionTracking.classificationComplete,
        'check-rights': completionTracking.rightsComplete,
        'check-breaches': completionTracking.breachComplete,
        'check-understanding': true // Set to true when all phases complete
    };
    
    Object.keys(checkboxes).forEach(id => {
        const checkbox = document.getElementById(id);
        if (checkbox && checkboxes[id]) {
            checkbox.textContent = '✓';
            checkbox.style.color = '#00ff00';
        }
    });
}

function completePhase4() {
    if (completionTracking.breachComplete) {
        // Calculate final assessment score
        assessmentScores.totalScore = Math.round(
            (assessmentScores.dataClassification + 
             assessmentScores.rightsManagement + 
             assessmentScores.breachResponse) / 3
        );
        
        showNotification('🎉 Module 5 Complete! Preparing final assessment...', 'success');
        
        setTimeout(() => {
            showFinalAssessment();
        }, 2000);
    }
}

// Badge and Achievement System
function awardBadge(badgeType) {
    const badgeMap = {
        'data-classifier': 'Data Classifier',
        'privacy-champion': 'Privacy Champion', 
        'compliance-guardian': 'Compliance Guardian'
    };
    
    const badgeName = badgeMap[badgeType];
    if (badgeName) {
        // Show badge notification
        showBadgeNotification(badgeName);
        
        // Update progress tracking
        if (typeof updateTrainingProgress === 'function') {
            updateTrainingProgress('module5', 25, badgeName);
        }
    }
}

function showBadgeNotification(badgeName) {
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-content">
            <h3>🏆 BADGE EARNED!</h3>
            <p>${badgeName}</p>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #f39c12, #e67e22);
        color: #000;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #f39c12;
        box-shadow: 0 10px 30px rgba(243, 156, 18, 0.5);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        text-align: center;
        font-weight: bold;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Final Assessment and Module Completion
function showFinalAssessment() {
    const modal = document.getElementById('final-assessment-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Calculate completion time
        const completionTime = Math.round((Date.now() - moduleStartTime) / 60000);
        
        // Update final assessment display
        document.getElementById('final-score').textContent = assessmentScores.totalScore;
        document.getElementById('completion-time').textContent = completionTime;
        
        // Show earned badges
        const badges = ['data-classifier-badge', 'privacy-champion-badge', 'compliance-guardian-badge'];
        badges.forEach(badgeId => {
            const badge = document.getElementById(badgeId);
            if (badge) {
                badge.classList.add('earned');
            }
        });
        
        // Update progress tracking
        if (typeof markModuleComplete === 'function') {
            markModuleComplete('module5', assessmentScores.totalScore, completionTime);
        }
    }
}

// Utility Functions
function showNotification(message, type = 'info') {
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
}

function setupEventListeners() {
    // Phase completion buttons
    const phaseButtons = [
        { id: 'complete-phase1', handler: completePhase1 },
        { id: 'complete-phase2', handler: completePhase2 },
        { id: 'complete-phase3', handler: completePhase3 },
        { id: 'complete-phase4', handler: completePhase4 }
    ];
    
    phaseButtons.forEach(button => {
        const element = document.getElementById(button.id);
        if (element) {
            element.addEventListener('click', button.handler);
        }
    });
}

// Navigation Functions
function goBack() {
    if (currentPhase > 1) {
        showPhase(currentPhase - 1);
    } else {
        window.history.back();
    }
}

function goToMenu() {
    window.location.href = 'index.html';
}

function downloadCertificate() {
    // Certificate download functionality
    const certificateData = {
        name: 'GDPR Data Protection Training',
        score: assessmentScores.totalScore,
        date: new Date().toLocaleDateString(),
        badges: ['Data Classifier', 'Privacy Champion', 'Compliance Guardian']
    };
    
    console.log('Certificate download:', certificateData);
    showNotification('Certificate download started...', 'success');
}

function returnToMenu() {
    window.location.href = 'index.html';
}

// Export functions for global access
window.completePhase1 = completePhase1;
window.completePhase2 = completePhase2;
window.completePhase3 = completePhase3;
window.completePhase4 = completePhase4;
window.goBack = goBack;
window.goToMenu = goToMenu;
window.downloadCertificate = downloadCertificate;
window.returnToMenu = returnToMenu;
