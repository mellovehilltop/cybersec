// Digital Shield Training - JavaScript (Fixed Version)

// Global variables for progress tracking
let currentMission = 0;
let completedMissions = [];
let currentEmailIndex = 0;
let emailsAnalyzed = 0;
let currentScenario = 0;
let risksFound = 0;
let foundRisks = new Set();
let piiItemsFound = 0;
const totalPiiItems = 6;

// Email simulation data
const emailScenarios = [
    {
        subject: "URGENT: Update Your Hilltop Honey Account",
        from: "security@hiltophonney.co.uk", // Note the misspelling
        body: "Dear Customer,<br><br>Your account security has been compromised. Please click here immediately to verify your details: <a href='#'>www.hiltophonney-secure.com/verify</a><br><br>Failure to act within 24 hours will result in account suspension.<br><br>Best regards,<br>Security Team",
        legitimate: false,
        redFlags: ["Misspelled domain (hiltophonney vs hilltophoney)", "Generic greeting", "Urgent threat language", "Suspicious link"]
    },
    {
        subject: "Weekly Production Report - Week 28",
        from: "production@hilltophoney.co.uk",
        body: "Hi Team,<br><br>Please find attached this week's production summary:<br>- Honey processed: 2,847 litres<br>- Quality control passed: 100%<br>- Next week's schedule attached<br><br>Any questions, please let me know.<br><br>Best,<br>Production Manager",
        legitimate: true,
        redFlags: []
    },
    {
        subject: "You've Won £5000!",
        from: "winner@lottery-uk.net",
        body: "Congratulations! You are the lucky winner of our monthly draw. To claim your prize, please provide your bank details by replying to this email. Reference: WIN-2024-UK-7891<br><br>Claim within 48 hours or forfeit your winnings!",
        legitimate: false,
        redFlags: ["Unexpected prize claim", "Requesting bank details", "External domain", "Time pressure tactics"]
    },
    {
        subject: "IT Policy Update - ITPOL 3.0",
        from: "m.teece@hilltophoney.co.uk",
        body: "Dear All,<br><br>Please be aware that our antivirus policy (ITPOL 3.0) has been updated. The new version is available on SharePoint.<br><br>Key changes include automatic update frequencies and new scanning requirements.<br><br>Please review and acknowledge receipt.<br><br>Thanks,<br>M Teece",
        legitimate: true,
        redFlags: []
    }
];

// Password strength requirements
const passwordRequirements = {
    length: 12,
    hasUpperCase: /[A-Z]/,
    hasLowerCase: /[a-z]/,
    hasNumber: /\d/,
    hasSymbol: /[!@#$%^&*(),.?":{}|<>]/
};

// Scenario data for Mission 03
const scenarios = [
    {
        text: "You're at a coffee shop and need to access your work emails. You see two WiFi networks: 'Free_Public_WiFi' and your phone's 'SecureHotspot'. Which do you choose?",
        choices: [
            { text: "Connect to Free_Public_WiFi", correct: false },
            { text: "Use my phone's SecureHotspot", correct: true }
        ],
        feedback: {
            correct: "Excellent choice! Using your phone's hotspot is much safer than public WiFi, which can be monitored by attackers.",
            incorrect: "Public WiFi is risky! Attackers can intercept your data. Always use your phone's secure hotspot when possible."
        }
    },
    {
        text: "You need to download a PDF from a website for work. The URL starts with 'http://' (not https://). What should you do?",
        choices: [
            { text: "Proceed with the download", correct: false },
            { text: "Leave the site and find a secure alternative", correct: true }
        ],
        feedback: {
            correct: "Well done! HTTPS encrypts your connection. HTTP sites are not secure for downloading files or entering sensitive data.",
            incorrect: "HTTP sites are not secure! The 'S' in HTTPS means your connection is encrypted. Always look for the padlock icon."
        }
    },
    {
        text: "You receive a work file via email from a colleague, but it's a .exe file instead of the expected .pdf. What do you do?",
        choices: [
            { text: "Open it immediately", correct: false },
            { text: "Contact the colleague to verify before opening", correct: true }
        ],
        feedback: {
            correct: "Perfect! Always verify unexpected file types with the sender. Email accounts can be compromised.",
            incorrect: "Never open unexpected .exe files! They could be malware. Always verify with the sender first."
        }
    }
];

// Security risks data for Mission 04
const securityRisks = {
    'unlocked-computer': 'An unlocked computer allows anyone to access confidential data. Always lock your screen when stepping away (Windows + L).',
    'sticky-note': 'Writing passwords on sticky notes defeats the purpose of having passwords. Use a secure password manager instead.',
    'confidential-docs': 'Confidential documents should never be left visible. File them away or lock them in a secure drawer.',
    'mobile-phone': 'Unattended devices can be stolen or accessed by unauthorized people. Keep personal devices secure.'
};

// Initialize the training when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log("Digital Shield Training Loaded");
    loadProgress();
    initializeMissions();
});

// Load progress from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem('digitalShieldProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            currentMission = progress.currentMission || 0;
            completedMissions = progress.completedMissions || [];
        }
        
        // Show appropriate mission based on progress
        showMission(currentMission);
    } catch (error) {
        console.error("Error loading progress:", error);
        currentMission = 0;
        completedMissions = [];
        showMission(0);
    }
}

// Save progress to localStorage
function saveProgress() {
    try {
        const progress = {
            currentMission: currentMission,
            completedMissions: completedMissions
        };
        localStorage.setItem('digitalShieldProgress', JSON.stringify(progress));
    } catch (error) {
        console.error("Error saving progress:", error);
    }
}

// Show specific mission
function showMission(missionNumber) {
    console.log("Showing mission:", missionNumber);
    
    // Hide all missions
    document.querySelectorAll('.mission-section').forEach(section => {
        section.classList.remove('visible');
        section.classList.add('hidden');
    });
    
    // Show target mission
    let targetMission;
    if (missionNumber < 6) {
        targetMission = document.getElementById(`mission-0${missionNumber}`);
    } else {
        targetMission = document.getElementById('final-module');
    }
    
    if (targetMission) {
        targetMission.classList.remove('hidden');
        targetMission.classList.add('visible');
        
        // Scroll to top
        window.scrollTo(0, 0);
        
        // Initialize mission-specific functionality
        switch(missionNumber) {
            case 1:
                initializeEmailSimulation();
                break;
            case 2:
                initializePasswordTester();
                break;
            case 3:
                initializeScenarios();
                break;
            case 4:
                initializeSpyGame();
                break;
            case 5:
                initializeRedactionGame();
                break;
        }
    } else {
        console.error("Could not find mission element for mission:", missionNumber);
    }
}

// Complete mission and move to next
function completeMission(missionNumber) {
    console.log("Completing mission:", missionNumber);
    
    if (!completedMissions.includes(missionNumber)) {
        completedMissions.push(missionNumber);
    }
    
    currentMission = missionNumber + 1;
    saveProgress();
    
    // Show next mission with a small delay for better UX
    setTimeout(() => {
        showMission(currentMission);
    }, 1000);
}

// Initialize all missions
function initializeMissions() {
    // Mission-specific initializations will be called when showing each mission
    console.log("Missions initialized");
}

// MISSION 01: Email Simulation
function initializeEmailSimulation() {
    currentEmailIndex = 0;
    emailsAnalyzed = 0;
    showNextEmail();
    
    // Add event listeners for email actions
    const trustBtn = document.getElementById('trust-btn');
    const deleteBtn = document.getElementById('delete-btn');
    
    if (trustBtn && deleteBtn) {
        trustBtn.onclick = () => handleEmailAction(true);
        deleteBtn.onclick = () => handleEmailAction(false);
    }
}

function showNextEmail() {
    if (currentEmailIndex >= emailScenarios.length) {
        // All emails analyzed
        const completeBtn = document.getElementById('mission-01-complete');
        if (completeBtn) {
            completeBtn.classList.remove('hidden');
        }
        return;
    }
    
    const email = emailScenarios[currentEmailIndex];
    const emailViewer = document.getElementById('email-viewer');
    
    if (emailViewer) {
        emailViewer.innerHTML = `
            <div class="email-header">
                <strong>From:</strong> ${email.from}<br>
                <strong>Subject:</strong> ${email.subject}
            </div>
            <div class="email-body">
                ${email.body}
            </div>
        `;
    }
    
    // Clear previous feedback
    const feedbackArea = document.getElementById('email-feedback');
    if (feedbackArea) {
        feedbackArea.innerHTML = '';
    }
}

function handleEmailAction(trusted) {
    const email = emailScenarios[currentEmailIndex];
    const feedbackArea = document.getElementById('email-feedback');
    
    if (!feedbackArea) return;
    
    // Determine if action was correct
    const correct = (trusted && email.legitimate) || (!trusted && !email.legitimate);
    
    if (correct) {
        feedbackArea.className = 'feedback-area correct';
        feedbackArea.innerHTML = trusted ? 
            'Correct! This email appears legitimate and safe.' :
            'Correct! This email was suspicious and should be deleted.';
    } else {
        feedbackArea.className = 'feedback-area incorrect';
        if (!email.legitimate) {
            // Show red flags for fake email
            feedbackArea.innerHTML = `
                <strong>THREAT DETECTED!</strong><br>
                Red flags in this email:<br>
                <ul style="text-align: left; margin-top: 10px;">
                    ${email.redFlags.map(flag => `<li>${flag}</li>`).join('')}
                </ul>
            `;
        } else {
            feedbackArea.innerHTML = 'This was actually a legitimate email from a trusted source.';
        }
    }
    
    emailsAnalyzed++;
    currentEmailIndex++;
    
    // Show next email after delay
    setTimeout(() => {
        showNextEmail();
    }, 3000);
}

// MISSION 02: Password Tester
function initializePasswordTester() {
    const passwordInput = document.getElementById('password-input');
    if (passwordInput) {
        passwordInput.addEventListener('input', checkPasswordStrength);
        
        // Reset password tester
        passwordInput.value = '';
        checkPasswordStrength();
    }
}

function checkPasswordStrength() {
    const passwordInput = document.getElementById('password-input');
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    if (!passwordInput || !strengthBar || !strengthText) return;
    
    const password = passwordInput.value;
    
    // Check each requirement
    const requirements = {
        length: password.length >= passwordRequirements.length,
        uppercase: passwordRequirements.hasUpperCase.test(password),
        lowercase: passwordRequirements.hasLowerCase.test(password),
        number: passwordRequirements.hasNumber.test(password),
        symbol: passwordRequirements.hasSymbol.test(password)
    };
    
    // Update requirement checkboxes
    updateRequirement('req-length', requirements.length);
    updateRequirement('req-case', requirements.uppercase && requirements.lowercase);
    updateRequirement('req-number', requirements.number);
    updateRequirement('req-symbol', requirements.symbol);
    
    // Calculate strength
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    const strength = metRequirements / 5;
    
    // Update strength bar
    strengthBar.style.width = `${strength * 100}%`;
    
    if (strength < 0.4) {
        strengthBar.style.background = '#e74c3c';
        strengthText.textContent = 'WEAK';
        strengthText.style.color = '#e74c3c';
    } else if (strength < 0.8) {
        strengthBar.style.background = '#f39c12';
        strengthText.textContent = 'MEDIUM';
        strengthText.style.color = '#f39c12';
    } else {
        strengthBar.style.background = '#27ae60';
        strengthText.textContent = 'STRONG';
        strengthText.style.color = '#27ae60';
    }
    
    // Show vault secured message if all requirements met
    const vaultStatus = document.getElementById('vault-status');
    const completeBtn = document.getElementById('mission-02-complete');
    
    if (metRequirements === 5) {
        if (vaultStatus) {
            vaultStatus.className = 'vault-status secured';
            vaultStatus.innerHTML = '🔒 VAULT SECURED! Password meets all security requirements.';
        }
        if (completeBtn) {
            completeBtn.classList.remove('hidden');
        }
    } else {
        if (vaultStatus) {
            vaultStatus.className = 'vault-status';
            vaultStatus.innerHTML = '';
        }
        if (completeBtn) {
            completeBtn.classList.add('hidden');
        }
    }
}

function updateRequirement(elementId, met) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const checkbox = element.querySelector('.checkbox');
    
    if (met) {
        element.classList.add('met');
        if (checkbox) checkbox.textContent = '☑';
    } else {
        element.classList.remove('met');
        if (checkbox) checkbox.textContent = '☐';
    }
}

// MISSION 03: Scenarios
function initializeScenarios() {
    currentScenario = 0;
    showCurrentScenario();
}

function showCurrentScenario() {
    if (currentScenario >= scenarios.length) {
        const completeBtn = document.getElementById('mission-03-complete');
        if (completeBtn) {
            completeBtn.classList.remove('hidden');
        }
        return;
    }
    
    const scenario = scenarios[currentScenario];
    const scenarioContent = document.getElementById('scenario-content');
    const choicesContainer = document.getElementById('scenario-choices');
    
    if (scenarioContent) {
        scenarioContent.innerHTML = `
            <h4>Scenario ${currentScenario + 1}</h4>
            <p>${scenario.text}</p>
        `;
    }
    
    if (choicesContainer) {
        choicesContainer.innerHTML = '';
        
        scenario.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => handleScenarioChoice(choice.correct);
            choicesContainer.appendChild(button);
        });
    }
    
    // Clear feedback
    const feedbackArea = document.getElementById('scenario-feedback');
    if (feedbackArea) {
        feedbackArea.innerHTML = '';
    }
}

function handleScenarioChoice(correct) {
    const scenario = scenarios[currentScenario];
    const feedbackArea = document.getElementById('scenario-feedback');
    
    if (feedbackArea) {
        if (correct) {
            feedbackArea.className = 'feedback-area correct';
            feedbackArea.innerHTML = scenario.feedback.correct;
        } else {
            feedbackArea.className = 'feedback-area incorrect';
            feedbackArea.innerHTML = scenario.feedback.incorrect;
        }
    }
    
    currentScenario++;
    
    // Show next scenario after delay
    setTimeout(() => {
        showCurrentScenario();
    }, 3000);
}

// MISSION 04: Spy Game
function initializeSpyGame() {
    risksFound = 0;
    foundRisks.clear();
    
    // Add click listeners to risk items
    document.querySelectorAll('.risk-item').forEach(item => {
        item.addEventListener('click', () => handleRiskClick(item));
    });
    
    updateRiskCounter();
}

function handleRiskClick(riskElement) {
    const riskType = riskElement.getAttribute('data-risk');
    
    if (!foundRisks.has(riskType)) {
        foundRisks.add(riskType);
        risksFound++;
        riskElement.classList.add('found');
        
        // Show explanation
        showRiskExplanation(riskType);
        updateRiskCounter();
        
        if (risksFound === 4) {
            setTimeout(() => {
                const completeBtn = document.getElementById('mission-04-complete');
                if (completeBtn) {
                    completeBtn.classList.remove('hidden');
                }
                const explanationsArea = document.getElementById('risk-explanations');
                if (explanationsArea) {
                    explanationsArea.innerHTML += '<div class="explanation" style="background: #d5edda; color: #155724; text-align: center; font-weight: bold;">🏆 SAFEHOUSE SECURE! All security risks identified.</div>';
                }
            }, 1000);
        }
    }
}

function showRiskExplanation(riskType) {
    const explanationsArea = document.getElementById('risk-explanations');
    const explanation = securityRisks[riskType];
    
    if (explanationsArea && explanation) {
        const explanationDiv = document.createElement('div');
        explanationDiv.className = 'explanation';
        explanationDiv.innerHTML = `<strong>Security Risk:</strong> ${explanation}`;
        
        explanationsArea.appendChild(explanationDiv);
    }
}

function updateRiskCounter() {
    const riskCountElement = document.getElementById('risk-count');
    if (riskCountElement) {
        riskCountElement.textContent = risksFound;
    }
}

// MISSION 05: Redaction Game
function initializeRedactionGame() {
    piiItemsFound = 0;
    
    // Add click listeners to PII items
    document.querySelectorAll('.pii-item').forEach(item => {
        item.addEventListener('click', () => handlePiiClick(item));
    });
    
    updatePiiCounter();
}

function handlePiiClick(piiElement) {
    if (!piiElement.classList.contains('redacted')) {
        piiElement.classList.add('redacted');
        piiItemsFound++;
        updatePiiCounter();
        
        if (piiItemsFound === totalPiiItems) {
            setTimeout(() => {
                const completeBtn = document.getElementById('mission-05-complete');
                if (completeBtn) {
                    completeBtn.classList.remove('hidden');
                }
                showCompletionMessage();
            }, 500);
        }
    }
}

function updatePiiCounter() {
    const piiCountElement = document.getElementById('pii-count');
    if (piiCountElement) {
        piiCountElement.textContent = piiItemsFound;
    }
}

function showCompletionMessage() {
    const statusElement = document.getElementById('redaction-status');
    if (statusElement) {
        statusElement.innerHTML = '<div style="background: #d5edda; color: #155724; padding: 15px; border-radius: 5px; font-weight: bold;">🛡️ SENSITIVE INTEL PROTECTED! All personal data successfully redacted.</div>';
    }
}

// Utility function to reset training (for testing)
function resetTraining() {
    localStorage.removeItem('digitalShieldProgress');
    currentMission = 0;
    completedMissions = [];
    showMission(0);
}

// Export reset function to global scope for debugging
window.resetTraining = resetTraining;

// Debug function to check if everything is loaded
window.debugCheck = function() {
    console.log("Current mission:", currentMission);
    console.log("Completed missions:", completedMissions);
    console.log("CompleteMission function exists:", typeof completeMission);
};

// Certificate generation functions
function generateCertificate() {
    const agentName = document.getElementById('agent-name').value.trim();
    
    if (!agentName) {
        alert('Please enter your name to generate the certificate.');
        return;
    }
    
    // Show certificate section
    const certSection = document.getElementById('certificate-section');
    if (certSection) {
        certSection.classList.remove('hidden');
    }
    
    // Generate the certificate
    drawCertificate(agentName);
    
    // Save completion to localStorage
    const completionData = {
        name: agentName,
        completedDate: new Date().toLocaleDateString('en-GB'),
        completedTime: new Date().toLocaleTimeString('en-GB'),
        trainingType: 'Project: Digital Shield - Cybersecurity Training'
    };
    
    localStorage.setItem('digitalShieldCompletion', JSON.stringify(completionData));
    
    // Scroll to certificate
    certSection.scrollIntoView({ behavior: 'smooth' });
}

function drawCertificate(agentName) {
    const canvas = document.getElementById('certificate-canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size for high quality
    canvas.width = 800;
    canvas.height = 600;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Border
    ctx.strokeStyle = '#00ffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    
    // Inner border
    ctx.strokeStyle = '#f39c12';
    ctx.lineWidth = 2;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);
    
    // Company logo area (placeholder)
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('HILLTOP HONEY LTD', canvas.width / 2, 80);
    
    // Certificate title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('CERTIFICATE OF COMPLETION', canvas.width / 2, 140);
    
    // Project title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('PROJECT: DIGITAL SHIELD', canvas.width / 2, 180);
    
    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText('Cybersecurity Training Program', canvas.width / 2, 210);
    
    // This certifies text
    ctx.fillStyle = '#cccccc';
    ctx.font = '20px Arial';
    ctx.fillText('This certifies that', canvas.width / 2, 260);
    
    // Agent name
    ctx.fillStyle = '#f39c12';
    ctx.font = 'bold 32px Arial';
    ctx.fillText(agentName.toUpperCase(), canvas.width / 2, 310);
    
    // Completion text
    ctx.fillStyle = '#cccccc';
    ctx.font = '18px Arial';
    ctx.fillText('has successfully completed the Digital Shield cybersecurity training', canvas.width / 2, 350);
    ctx.fillText('and demonstrated competency in:', canvas.width / 2, 375);
    
    // Skills list
    ctx.fillStyle = '#00ffff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    const skills = [
        '• Email Security & Phishing Detection',
        '• Password Security Best Practices',
        '• Safe Internet & WiFi Usage',
        '• Physical Security & Clear Desk Policy',
        '• GDPR Data Protection & PII Handling'
    ];
    
    skills.forEach((skill, index) => {
        ctx.fillText(skill, 150, 410 + (index * 20));
    });
    
    // Date and signature area
    const currentDate = new Date().toLocaleDateString('en-GB');
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Completed: ${currentDate}`, canvas.width / 2, 540);
    
    // Security badge
    ctx.fillStyle = '#ff0066';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('🛡️ CERTIFIED DIGITAL SHIELD AGENT 🛡️', canvas.width / 2, 570);
}

function downloadCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    const agentName = document.getElementById('agent-name').value.trim();
    
    // Create download link
    const link = document.createElement('a');
    link.download = `Digital_Shield_Certificate_${agentName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Track completion
    console.log(`Certificate downloaded for: ${agentName}`);
}

function printCertificate() {
    const canvas = document.getElementById('certificate-canvas');
    
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Digital Shield Certificate</title>
            <style>
                body { 
                    margin: 0; 
                    padding: 20px; 
                    text-align: center; 
                    background: white;
                }
                img { 
                    max-width: 100%; 
                    height: auto; 
                    border: 2px solid #333;
                }
                @media print {
                    body { padding: 0; }
                    img { border: none; }
                }
            </style>
        </head>
        <body>
            <img src="${canvas.toDataURL()}" alt="Digital Shield Certificate">
        </body>
        </html>
    `);
    
    printWindow.document.close();
    
    // Wait for image to load, then print
    setTimeout(() => {
        printWindow.print();
        printWindow.close();
    }, 1000);
}

function emailCertificate() {
    const agentName = document.getElementById('agent-name').value.trim();
    const currentDate = new Date().toLocaleDateString('en-GB');
    
    // Create email content
    const subject = `Cybersecurity Training Completion - ${agentName}`;
    const body = `Dear Manager,

I am pleased to inform you that ${agentName} has successfully completed the "Project: Digital Shield" cybersecurity training program on ${currentDate}.

Training Completed:
✅ Email Security & Phishing Detection
✅ Password Security Best Practices  
✅ Safe Internet & WiFi Usage
✅ Physical Security & Clear Desk Policy
✅ GDPR Data Protection & PII Handling

${agentName} has demonstrated competency in all areas and is now certified as a Digital Shield Agent.

A certificate has been generated and can be downloaded from the training portal.

Best regards,
${agentName}
Digital Shield Training System`;

    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Also provide a backup option
    setTimeout(() => {
        if (confirm('Email client opened. Would you like to copy the message to clipboard as backup?')) {
            navigator.clipboard.writeText(`${subject}\n\n${body}`).then(() => {
                alert('Message copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = `${subject}\n\n${body}`;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Message copied to clipboard!');
            });
        }
    }, 2000);
}

console.log("Digital Shield script loaded successfully!");
