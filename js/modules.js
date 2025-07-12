// Module Interactive Functions for Digital Shield Training

// Module 1 Global Variables
let currentPhase = 0;
let redFlagsFound = 0;
let assessmentScore = 0;
let assessmentComplete = false;
let currentAssessmentEmail = 0;

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

// Red flag scanner data
const redFlagData = {
    domain: {
        text: "Domain misspelling",
        explanation: "The domain 'hiltophonney.co.uk' is missing an 'o' - should be 'hilltophoney.co.uk'"
    },
    urgent: {
        text: "Urgent pressure tactics",
        explanation: "Creates false urgency to pressure quick action without proper verification"
    },
    generic: {
        text: "Generic greeting",
        explanation: "Uses 'Dear Customer' instead of your actual name"
    },
    request: {
        text: "Credential request",
        explanation: "Asks you to verify login details via email link"
    },
    link: {
        text: "Suspicious URL",
        explanation: "URL doesn't match claimed legitimate domain"
    }
};

// Initialize Module 1
function initializeModule1() {
    console.log("Initializing Module 1: Email Security");
    
    // Set up progress tracking
    updateModuleProgress(0);
    
    // Initialize red flag scanner
    initializeRedFlagScanner();
    
    // Set up assessment
    prepareAssessment();
}

// Start training from briefing
function startTraining() {
    showSection('training-phase-1');
    updateModuleProgress(25);
    currentPhase = 1;
}

// Complete training phase
function completePhase(phaseNumber) {
    const progressValues = { 1: 25, 2: 50, 3: 75, 4: 100 };
    
    currentPhase = phaseNumber + 1;
    updateModuleProgress(progressValues[phaseNumber] || 0);
    
    if (phaseNumber === 1) {
        showSection('training-phase-2');
    } else if (phaseNumber === 2) {
        showSection('training-phase-3');
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

// Initialize red flag scanner
function initializeRedFlagScanner() {
    const scannableElements = document.querySelectorAll('.scannable.suspicious');
    
    scannableElements.forEach(element => {
        element.addEventListener('click', function() {
            if (!this.classList.contains('found')) {
                this.classList.add('found');
                redFlagsFound++;
                
                const flagType = this.getAttribute('data-flag');
                showFlagExplanation(flagType);
                updateScannerProgress();
            }
        });
    });
}

// Show red flag explanation
function showFlagExplanation(flagType) {
    const explanationsDiv = document.getElementById('flag-explanations');
    const flagInfo = redFlagData[flagType];
    
    if (flagInfo) {
        const explanationElement = document.createElement('div');
        explanationElement.className = 'flag-explanation';
        explanationElement.innerHTML = `
            <strong>✓ ${flagInfo.text}:</strong> ${flagInfo.explanation}
        `;
        explanationsDiv.appendChild(explanationElement);
    }
}

// Update scanner progress
function updateScannerProgress() {
    const flagsFoundElement = document.getElementById('flags-found');
    const phase2Btn = document.getElementById('phase-2-btn');
    
    if (flagsFoundElement) {
        flagsFoundElement.textContent = redFlagsFound;
    }
    
    if (redFlagsFound >= 5 && phase2Btn) {
        phase2Btn.disabled = false;
    }
}

// Check progress for phase 3 habits
function checkProgress() {
    const checkboxes = document.querySelectorAll('#training-phase-3 input[type="checkbox"]');
    const checkedBoxes = document.querySelectorAll('#training-phase-3 input[type="checkbox"]:checked');
    const phase3Btn = document.getElementById('phase-3-btn');
    
    if (checkedBoxes.length >= checkboxes.length && phase3Btn) {
        phase3Btn.disabled = false;
    }
}

// Prepare assessment
function prepareAssessment() {
    // Assessment will be initialized when assessment phase starts
}

// Start final assessment
function startAssessment() {
    currentAssessmentEmail = 0;
    assessmentScore = 0;
    showAssessmentEmail();
}

// Show current assessment email
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

// Assess current email
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

// Show feedback for assessment email
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

// Show final assessment results
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

// Retake assessment
function retakeAssessment() {
    currentAssessmentEmail = 0;
    assessmentScore = 0;
    document.getElementById('assessment-results').style.display = 'none';
    showAssessmentEmail();
}

// Complete Module 1
function completeModule1() {
    // Use the navigation function to complete module and show completion dialog
    window.digitalShieldNavigation.completeModuleFromPage(1, assessmentScore);
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
    completeModule1
};

console.log('Digital Shield Modules loaded successfully');
