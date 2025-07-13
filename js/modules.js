// Module Interactive Functions for Digital Shield Training - CORRECTED VERSION 4.0

// Module 1 Global Variables
let currentPhase = 0;
let redFlagsFound = 0;
let assessmentScore = 0;
let assessmentComplete = false;
let currentAssessmentEmail = 0;
let habitsRevealed = 0;

// Email examples for threat demonstrations
const emailExamples = {
    phishing: {
        title: "Classic Phishing Example",
        content: `
            <div class="example-email">
                <div class="email-header">
                    <strong>From:</strong> security@bankofengland.co.uk.phishing-site.com<br>
                    <strong>Subject:</strong> URGENT: Your account will be suspended
                </div>
                <div class="email-body">
                    <p>Dear Customer,</p>
                    <p>We have detected suspicious activity on your account. Your account will be suspended within 24 hours unless you verify your details immediately.</p>
                    <p><a href="#">Click here to verify your account</a></p>
                    <p>Bank of England Security Team</p>
                </div>
                <div class="example-analysis">
                    <h4>🚩 Red Flags Identified:</h4>
                    <ul>
                        <li>Suspicious domain (extra text after legitimate domain)</li>
                        <li>Generic greeting ("Dear Customer")</li>
                        <li>Urgent time pressure</li>
                        <li>Request to click link for verification</li>
                        <li>Claims to be from major institution</li>
                    </ul>
                </div>
            </div>
        `
    },
    'spear-phishing': {
        title: "Spear Phishing Example",
        content: `
            <div class="example-email">
                <div class="email-header">
                    <strong>From:</strong> sarah.johnson@hilltophoney.co.uk<br>
                    <strong>Subject:</strong> Urgent Payment Required - Honey Supplier Invoice
                </div>
                <div class="email-body">
                    <p>Hi [Your Name],</p>
                    <p>I hope you're well. We have an urgent invoice from our honey supplier that needs payment today to avoid disrupting production.</p>
                    <p>The bank details have changed - please use the new account details attached.</p>
                    <p>Can you process this ASAP? The MD is asking for updates.</p>
                    <p>Thanks,<br>Sarah</p>
                </div>
                <div class="example-analysis">
                    <h4>🚩 Red Flags Identified:</h4>
                    <ul>
                        <li>Requests urgent financial action</li>
                        <li>Claims bank details have changed</li>
                        <li>Creates time pressure</li>
                        <li>May be impersonating colleague</li>
                        <li>References company-specific information</li>
                    </ul>
                </div>
            </div>
        `
    },
    malware: {
        title: "Malware Delivery Example",
        content: `
            <div class="example-email">
                <div class="email-header">
                    <strong>From:</strong> invoices@supplier-updates.com<br>
                    <strong>Subject:</strong> Invoice_Update_HH_2024.exe
                </div>
                <div class="email-body">
                    <p>Dear Hilltop Honey,</p>
                    <p>Please find attached the updated invoice for your recent order. The file requires immediate download to update our systems.</p>
                    <p>📎 Invoice_Update_HH_2024.exe (2.3MB)</p>
                    <p>Thank you,<br>Accounts Department</p>
                </div>
                <div class="example-analysis">
                    <h4>🚩 Red Flags Identified:</h4>
                    <ul>
                        <li>Executable file attachment (.exe)</li>
                        <li>Claims to be invoice but wrong file type</li>
                        <li>External domain for business communication</li>
                        <li>Requests immediate download</li>
                        <li>Generic business-sounding sender</li>
                    </ul>
                </div>
            </div>
        `
    },
    'business-email': {
        title: "Business Email Compromise Example",
        content: `
            <div class="example-email">
                <div class="email-header">
                    <strong>From:</strong> m.teece@hilltophoney.co.uk<br>
                    <strong>Subject:</strong> Confidential - Urgent Supplier Payment
                </div>
                <div class="email-body">
                    <p>Hello,</p>
                    <p>I need you to process an urgent payment to our new honey supplier. This is confidential as we're changing suppliers.</p>
                    <p>Account Name: Premium Honey Supplies Ltd<br>
                    Sort Code: 12-34-56<br>
                    Account: 87654321<br>
                    Amount: £15,000</p>
                    <p>Please don't mention this to anyone yet. Process today if possible.</p>
                    <p>M Teece</p>
                </div>
                <div class="example-analysis">
                    <h4>🚩 Red Flags Identified:</h4>
                    <ul>
                        <li>Unusual request for confidentiality</li>
                        <li>Large payment amount</li>
                        <li>Requests bypassing normal procedures</li>
                        <li>May be compromised account</li>
                        <li>Pressure to not verify with others</li>
                    </ul>
                </div>
            </div>
        `
    }
};

// Assessment emails for final test
const assessmentEmails = [
    {
        id: 1,
        from: "production@hilltophoney.co.uk",
        subject: "Weekly Production Report - Week 29",
        body: "Hi Team,<br><br>Please find this week's production summary:<br>- Honey processed: 3,247 litres<br>- Quality control: 100% pass rate<br>- Next week's targets attached<br><br>Any questions, let me know.<br><br>Production Team",
        legitimate: true,
        explanation: "This is a legitimate internal email with normal business content, proper domain, and expected communication pattern."
    },
    {
        id: 2,
        from: "security@hilltophoney-update.com",
        subject: "URGENT: Security System Update Required",
        body: "Dear Employee,<br><br>Our security system requires immediate updating. Click the link below to verify your access credentials:<br><br><a href='#'>Verify Account Access</a><br><br>This must be completed within 2 hours or your access will be suspended.<br><br>IT Security Team",
        legitimate: false,
        explanation: "This is a phishing attempt with suspicious domain, generic greeting, urgent time pressure, and requests credentials."
    },
    {
        id: 3,
        from: "supplier@premiumhoney.co.uk",
        subject: "Invoice Payment - Account Details Update",
        body: "Dear Hilltop Honey,<br><br>Thank you for your recent order. Please note our bank details have changed for future payments:<br><br>New Account: HSBC Bank<br>Sort: 40-12-34<br>Account: 12345678<br><br>Please update your records.<br><br>Best regards,<br>Premium Honey Supplies",
        legitimate: false,
        explanation: "Suspicious request to change payment details. Should be verified through independent communication channels."
    },
    {
        id: 4,
        from: "hr@hilltophoney.co.uk",
        subject: "Training Schedule Update - December 2024",
        body: "Dear All,<br><br>Please note the updated training schedule for December:<br><br>Health & Safety: 5th Dec<br>GDPR Refresher: 12th Dec<br>Fire Safety: 19th Dec<br><br>All sessions are mandatory. Please confirm attendance.<br><br>HR Team",
        legitimate: true,
        explanation: "Legitimate internal email from correct domain with normal HR communication content."
    }
];

// Red flag data (6 flags total)
const redFlagData = {
    domain: "Domain misspelling: 'hiltophonney' missing an 'o'",
    urgent: "Urgent pressure tactics in subject line",
    generic: "Generic greeting 'Dear Customer'",
    pressure: "Time pressure language about compromise",
    request: "Requests credential verification via email",
    link: "Suspicious URL with fake security domain"
};

// Initialize Module 1
function initializeModule1() {
    console.log("🚀 Module 1: Email Security - VERSION 4.0 CORRECTED");
    
    // Reset all counters
    currentPhase = 0;
    redFlagsFound = 0;
    habitsRevealed = 0;
    assessmentScore = 0;
    assessmentComplete = false;
    currentAssessmentEmail = 0;
    
    // Set up progress tracking
    updateModuleProgress(0);
    
    console.log("✅ Module 1 initialization complete");
}

// Start training from briefing
function startTraining() {
    showSection('training-phase-1');
    updateModuleProgress(25);
    currentPhase = 1;
    console.log("🎯 Started training Phase 1");
}

// Complete training phase
function completePhase(phaseNumber) {
    const progressValues = { 1: 25, 2: 50, 3: 75, 4: 100 };
    
    currentPhase = phaseNumber + 1;
    updateModuleProgress(progressValues[phaseNumber] || 0);
    
    console.log(`🚀 Completing Phase ${phaseNumber}, moving to Phase ${currentPhase}`);
    
    if (phaseNumber === 1) {
        showSection('training-phase-2');
        // Initialize scanner when Phase 2 becomes visible
        setTimeout(() => {
            initializeRedFlagScanner();
        }, 500);
    } else if (phaseNumber === 2) {
        showSection('training-phase-3');
        initializeClassifiedHabits();
    } else if (phaseNumber === 3) {
        showSection('assessment-phase');
        startAssessment();
    } else if (phaseNumber === 4) {
        completeModule1();
    }
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.training-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.scrollIntoView({ behavior: 'smooth' });
        console.log(`📍 Showing section: ${sectionId}`);
    }
}

// Update module progress display
function updateModuleProgress(percentage) {
    const progressElement = document.getElementById('module-progress');
    if (progressElement) {
        progressElement.textContent = percentage + '%';
    }
}

// Show email examples
function showExample(threatType) {
    const modal = document.getElementById('example-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    if (emailExamples[threatType]) {
        modalTitle.textContent = emailExamples[threatType].title;
        modalBody.innerHTML = emailExamples[threatType].content;
        modal.style.display = 'block';
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('example-modal');
    modal.style.display = 'none';
}

// RED FLAG SCANNER - CORRECTED VERSION
function initializeRedFlagScanner() {
    console.log("🔧 RED FLAG SCANNER: Starting initialization...");
    
    // Reset counter
    redFlagsFound = 0;
    
    // Find all scannable elements (CORRECT selector)
    const elements = document.querySelectorAll('.scannable-hidden');
    console.log(`📊 RED FLAG SCANNER: Found ${elements.length} elements`);
    
    if (elements.length === 0) {
        console.error("❌ RED FLAG SCANNER: No elements found! Check HTML class names.");
        return;
    }
    
    // Set up each element
    elements.forEach((element, index) => {
        const flagType = element.getAttribute('data-flag');
        console.log(`🎯 RED FLAG SCANNER: Setting up element ${index}: "${flagType}"`);
        
        // Remove any existing handlers
        element.removeEventListener('click', handleRedFlagClick);
        
        // Add click handler
        element.addEventListener('click', handleRedFlagClick);
        
        // Visual setup
        element.style.cursor = 'pointer';
        element.title = `Click if suspicious: ${flagType}`;
        
        // Hover effects for feedback
        element.onmouseenter = function() {
            if (!this.hasAttribute('data-found')) {
                this.style.backgroundColor = 'rgba(255,255,0,0.3)';
            }
        };
        
        element.onmouseleave = function() {
            if (!this.hasAttribute('data-found')) {
                this.style.backgroundColor = '';
            }
        };
        
        // Reset any previous found state
        element.removeAttribute('data-found');
        element.style.backgroundColor = '';
        element.style.color = '';
        element.style.fontWeight = '';
        element.style.padding = '';
        element.style.border = '';
    });
    
    // Reset display
    const counterElement = document.getElementById('flags-found');
    if (counterElement) {
        counterElement.textContent = '0';
    }
    
    const explanationsDiv = document.getElementById('flag-explanations');
    if (explanationsDiv) {
        explanationsDiv.innerHTML = '';
    }
    
    console.log("✅ RED FLAG SCANNER: Initialization complete!");
}

// Handle red flag clicks
function handleRedFlagClick(event) {
    console.log("🖱️ RED FLAG SCANNER: Click detected!");
    
    const element = event.target;
    const flagType = element.getAttribute('data-flag');
    
    console.log(`🎯 RED FLAG SCANNER: Clicked "${flagType}"`);
    
    // Check if already found
    if (element.hasAttribute('data-found')) {
        console.log("⚠️ RED FLAG SCANNER: Already found, ignoring");
        return;
    }
    
    // Mark as found
    element.setAttribute('data-found', 'true');
    
    // Apply visual changes immediately
    element.style.backgroundColor = '#ff0000';
    element.style.color = '#ffffff';
    element.style.fontWeight = 'bold';
    element.style.padding = '4px 8px';
    element.style.border = '2px solid #ffffff';
    element.style.borderRadius = '4px';
    element.style.boxShadow = '0 0 5px rgba(255,0,0,0.8)';
    
    // Update counter
    redFlagsFound++;
    console.log(`📈 RED FLAG SCANNER: Counter now ${redFlagsFound}`);
    
    // Update display
    const counterElement = document.getElementById('flags-found');
    if (counterElement) {
        counterElement.textContent = redFlagsFound;
        console.log(`🔄 RED FLAG SCANNER: Updated display to ${redFlagsFound}`);
    }
    
    // Add explanation
    const explanationsDiv = document.getElementById('flag-explanations');
    if (explanationsDiv) {
        const explanation = document.createElement('div');
        explanation.style.cssText = `
            background: rgba(0,255,0,0.1);
            border: 1px solid #00ff00;
            border-radius: 5px;
            padding: 10px;
            margin: 5px 0;
            color: #00ff00;
        `;
        explanation.innerHTML = `<strong>✓ ${flagType}:</strong> ${redFlagData[flagType]}`;
        explanationsDiv.appendChild(explanation);
    }
    
    // Check if all found
    if (redFlagsFound >= 6) {
        const phase2Btn = document.getElementById('phase-2-btn');
        if (phase2Btn) {
            phase2Btn.disabled = false;
            console.log("🎉 RED FLAG SCANNER: All flags found! Button enabled.");
        }
    }
}

// CLASSIFIED HABITS SYSTEM
function initializeClassifiedHabits() {
    console.log("🔒 CLASSIFIED HABITS: Initializing...");
    
    // Reset counter
    habitsRevealed = 0;
    
    const habitElements = document.querySelectorAll('.habit-classified');
    console.log(`📊 CLASSIFIED HABITS: Found ${habitElements.length} habits`);
    
    habitElements.forEach((element, index) => {
        const habitNumber = element.getAttribute('data-habit');
        console.log(`🎯 CLASSIFIED HABITS: Setting up habit ${habitNumber}`);
        
        // Reset to classified state
        element.classList.remove('revealed');
        const stamp = element.querySelector('.classified-stamp');
        const content = element.querySelector('.classified-content');
        
        if (stamp) stamp.style.display = 'block';
        if (content) content.classList.add('hidden');
        
        // Add click handler
        element.addEventListener('click', function() {
            if (!this.classList.contains('revealed')) {
                revealHabit(this);
            }
        });
    });
    
    // Reset progress display
    updateHabitsProgress();
    
    console.log("✅ CLASSIFIED HABITS: Initialization complete!");
}

function revealHabit(habitElement) {
    const habitNumber = habitElement.getAttribute('data-habit');
    console.log(`🔓 CLASSIFIED HABITS: Revealing habit ${habitNumber}`);
    
    const classifiedStamp = habitElement.querySelector('.classified-stamp');
    const classifiedContent = habitElement.querySelector('.classified-content');
    
    // Hide stamp and show content
    if (classifiedStamp) classifiedStamp.style.display = 'none';
    if (classifiedContent) classifiedContent.classList.remove('hidden');
    
    // Mark as revealed
    habitElement.classList.add('revealed');
    
    // Update counter
    habitsRevealed++;
    updateHabitsProgress();
    
    console.log(`📈 CLASSIFIED HABITS: ${habitsRevealed}/6 habits revealed`);
    
    // Check if all habits revealed
    if (habitsRevealed >= 6) {
        const phase3Btn = document.getElementById('phase-3-btn');
        if (phase3Btn) {
            phase3Btn.disabled = false;
            console.log("🎉 CLASSIFIED HABITS: All habits revealed! Button enabled.");
        }
    }
}

function updateHabitsProgress() {
    const habitsRevealedElement = document.getElementById('habits-revealed');
    if (habitsRevealedElement) {
        habitsRevealedElement.textContent = habitsRevealed;
    }
}

// Legacy function for compatibility
function checkProgress() {
    return habitsRevealed >= 6;
}

// ASSESSMENT SYSTEM
function prepareAssessment() {
    // Assessment will be initialized when assessment phase starts
}

function startAssessment() {
    console.log("🎯 ASSESSMENT: Starting final assessment");
    currentAssessmentEmail = 0;
    assessmentScore = 0;
    showAssessmentEmail();
}

function showAssessmentEmail() {
    const assessmentDiv = document.getElementById('email-assessment');
    
    if (currentAssessmentEmail >= assessmentEmails.length) {
        showAssessmentResults();
        return;
    }
    
    const email = assessmentEmails[currentAssessmentEmail];
    
    assessmentDiv.innerHTML = `
        <div class="assessment-email">
            <div class="email-number">Email ${currentAssessmentEmail + 1} of ${assessmentEmails.length}</div>
            <div class="email-viewer">
                <div class="email-header">
                    <strong>From:</strong> ${email.from}<br>
                    <strong>Subject:</strong> ${email.subject}
                </div>
                <div class="email-body">
                    ${email.body}
                </div>
            </div>
            <div class="assessment-actions">
                <p><strong>Assessment Question:</strong> Is this email safe or suspicious?</p>
                <div class="action-buttons">
                    <button onclick="assessEmail(true)" class="assess-btn safe">
                        ✓ SAFE EMAIL
                    </button>
                    <button onclick="assessEmail(false)" class="assess-btn suspicious">
                        ⚠️ SUSPICIOUS EMAIL
                    </button>
                </div>
            </div>
        </div>
    `;
}

function assessEmail(userSaysLegitimate) {
    const email = assessmentEmails[currentAssessmentEmail];
    const correct = (userSaysLegitimate === email.legitimate);
    
    if (correct) {
        assessmentScore += 25; // 100% divided by 4 emails
    }
    
    // Show feedback
    showEmailFeedback(email, correct, userSaysLegitimate);
    
    currentAssessmentEmail++;
    
    // Continue to next email after delay
    setTimeout(() => {
        showAssessmentEmail();
    }, 3000);
}

function showEmailFeedback(email, correct, userChoice) {
    const assessmentDiv = document.getElementById('email-assessment');
    const feedbackClass = correct ? 'correct' : 'incorrect';
    const resultText = correct ? 'CORRECT!' : 'INCORRECT';
    const choiceText = userChoice ? 'marked as SAFE' : 'marked as SUSPICIOUS';
    const actualText = email.legitimate ? 'actually SAFE' : 'actually SUSPICIOUS';
    
    const feedbackHtml = `
        <div class="assessment-feedback ${feedbackClass}">
            <h3>${resultText}</h3>
            <p>You ${choiceText}, and this email is ${actualText}.</p>
            <div class="explanation">
                <strong>Explanation:</strong> ${email.explanation}
            </div>
        </div>
    `;
    
    assessmentDiv.innerHTML += feedbackHtml;
}

function showAssessmentResults() {
    const resultsDiv = document.getElementById('assessment-results');
    let grade, message, badgeClass;
    
    if (assessmentScore >= 90) {
        grade = 'EXPERT';
        message = 'Outstanding! You have mastered email security.';
        badgeClass = 'expert';
    } else if (assessmentScore >= 75) {
        grade = 'PROFICIENT';
        message = 'Great work! You have strong email security skills.';
        badgeClass = 'proficient';
    } else if (assessmentScore >= 60) {
        grade = 'COMPETENT';
        message = 'Good job! You understand the basics of email security.';
        badgeClass = 'competent';
    } else {
        grade = 'NEEDS IMPROVEMENT';
        message = 'Consider reviewing the training materials and retaking the assessment.';
        badgeClass = 'needs-improvement';
    }
    
    resultsDiv.innerHTML = `
        <div class="assessment-completion">
            <div class="results-header">
                <h2>🎯 ASSESSMENT COMPLETE</h2>
                <div class="score-display ${badgeClass}">
                    <div class="score-circle">
                        <span class="score-number">${assessmentScore}%</span>
                        <span class="grade">${grade}</span>
                    </div>
                </div>
            </div>
            <div class="results-message">
                <p>${message}</p>
            </div>
            <div class="results-actions">
                ${assessmentScore >= 60 ? 
                    `<button onclick="completeModule1()" class="section-btn primary">
                        COMPLETE MODULE 1
                    </button>` :
                    `<button onclick="retakeAssessment()" class="section-btn secondary">
                        RETAKE ASSESSMENT
                    </button>`
                }
            </div>
        </div>
    `;
    
    resultsDiv.style.display = 'block';
    assessmentComplete = true;
}

function retakeAssessment() {
    currentAssessmentEmail = 0;
    assessmentScore = 0;
    document.getElementById('assessment-results').style.display = 'none';
    showAssessmentEmail();
}

// Complete Module 1
function completeModule1() {
    console.log("🏆 MODULE 1 COMPLETE!");
    // Use the navigation function to complete module and show completion dialog
    if (window.digitalShieldNavigation && window.digitalShieldNavigation.completeModuleFromPage) {
        window.digitalShieldNavigation.completeModuleFromPage(1, assessmentScore);
    } else {
        alert(`Module 1 Complete!\nScore: ${assessmentScore}%`);
    }
}

// DEBUG FUNCTIONS
function testRedFlagScanner() {
    console.log("🧪 TESTING: Red flag scanner test starting...");
    
    const elements = document.querySelectorAll('.scannable-hidden');
    console.log(`📊 TESTING: Found ${elements.length} elements`);
    
    if (elements.length > 0) {
        const firstElement = elements[0];
        console.log(`🎯 TESTING: Clicking first element (${firstElement.getAttribute('data-flag')})`);
        firstElement.click();
    } else {
        console.log("❌ TESTING: No elements to test");
    }
}

function resetRedFlagScanner() {
    console.log("🔄 RESET: Resetting red flag scanner...");
    redFlagsFound = 0;
    
    const elements = document.querySelectorAll('.scannable-hidden');
    elements.forEach(el => {
        el.removeAttribute('data-found');
        el.style.backgroundColor = '';
        el.style.color = '';
        el.style.fontWeight = '';
        el.style.padding = '';
        el.style.border = '';
    });
    
    const counterElement = document.getElementById('flags-found');
    if (counterElement) counterElement.textContent = '0';
    
    const explanationsDiv = document.getElementById('flag-explanations');
    if (explanationsDiv) explanationsDiv.innerHTML = '';
    
    console.log("✅ RESET: Red flag scanner reset complete");
}

// Modal click outside to close
window.onclick = function(event) {
    const modal = document.getElementById('example-modal');
    if (event.target === modal) {
        closeModal();
    }
}

// Export functions for global use
window.digitalShieldModules = {
    initializeModule1,
    startTraining,
    completePhase,
    showExample,
    closeModal,
    checkProgress,
    assessEmail,
    completeModule1,
    // Debug functions
    testRedFlagScanner,
    resetRedFlagScanner,
    initializeRedFlagScanner,
    initializeClassifiedHabits
};

// Make test functions available globally
window.testRedFlagScanner = testRedFlagScanner;
window.resetRedFlagScanner = resetRedFlagScanner;

console.log('🚀 Digital Shield Modules loaded successfully - VERSION 4.0 CORRECTED');
console.log('🛠️ Debug commands available:');
console.log('   testRedFlagScanner() - Test first element click');
console.log('   resetRedFlagScanner() - Reset all flags');
console.log('   window.digitalShieldModules.initializeRedFlagScanner() - Reinitialize scanner');

// Export version for checking
window.digitalShieldVersion = "4.0";
console.log("📍 Module version:", window.digitalShieldVersion);
