/**
 * Module 3: Internet Security Training
 * Digital Navigator Protocol
 * 
 * Interactive training system for web security awareness
 * Includes URL detection, certificate inspection, scenarios, and assessment
 */

const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesInspected: 0,
    scenariosCompleted: 0,
    assessmentScore: 0,
    currentAssessmentQuestion: 0,
    
    // URL examples for Phase 1 - URL Detective Game
    urlExamples: [
        { 
            url: "https://www.hilltophoney.co.uk/contact", 
            category: "safe", 
            explanation: "Correct! HTTPS and the official company domain are good signs." 
        },
        { 
            url: "http://hilltop-honey-suppliers.net/login", 
            category: "suspicious", 
            explanation: "Correct! HTTP (not secure) and '-suppliers.net' is not our official domain." 
        },
        { 
            url: "https://hiltophoney.tk/urgent-payment", 
            category: "dangerous", 
            explanation: "Correct! Misspelled domain ('hiltop') and unusual .tk domain are major red flags." 
        },
        { 
            url: "https://royalmail.com/track-and-trace", 
            category: "safe", 
            explanation: "Correct! This is a legitimate, secure URL for a known service." 
        },
        { 
            url: "http://192.168.4.23/downloads/update.exe", 
            category: "dangerous", 
            explanation: "Correct! Direct IP address URL for a download is extremely dangerous." 
        },
        { 
            url: "https://www.amazon-deals.org", 
            category: "suspicious", 
            explanation: "Correct! While it has HTTPS, 'amazon-deals.org' is not the real Amazon domain." 
        },
        { 
            url: "https://hilltop-honey.co.uk-security.tk", 
            category: "dangerous", 
            explanation: "Correct! Fake domain attempting to look official with unusual subdomain structure." 
        },
        { 
            url: "https://www.gov.uk/business-support", 
            category: "safe", 
            explanation: "Correct! Official government website with proper HTTPS security." 
        }
    ],

    // Certificate examples for Phase 2 - Certificate Inspector
    certificates: [
        {
            domain: "hilltophoney.co.uk",
            valid: true,
            issuer: "Let's Encrypt Authority X3",
            expiry: "Valid until: 15/10/2025",
            explanation: "Valid certificate - issued by trusted authority, not expired, matches domain."
        },
        {
            domain: "hiltop-honey.net",
            valid: false,
            issuer: "Self-signed",
            expiry: "Invalid certificate",
            explanation: "Invalid certificate - self-signed certificates cannot be trusted for business use."
        },
        {
            domain: "hilltophoney.tk",
            valid: false,
            issuer: "Unknown Authority",
            expiry: "Expired: 12/08/2024",
            explanation: "Dangerous - expired certificate from unknown authority, likely fraudulent."
        },
        {
            domain: "suppliers.hilltophoney.co.uk",
            valid: true,
            issuer: "DigiCert Inc",
            expiry: "Valid until: 22/12/2025",
            explanation: "Valid certificate - proper subdomain of official site with trusted certificate authority."
        }
    ],

    // Scenarios for Phase 3 - Threat Recognition
    scenarios: [
        {
            title: "Supplier Email Verification",
            description: "You receive an email from 'New Honey Supplier Ltd' asking you to verify account details on their website: http://newhoneysupplier-verification.tk/login",
            options: [
                "Click the link immediately to verify",
                "Check the URL carefully before deciding",
                "Ignore the email completely",
                "Forward to IT department for verification"
            ],
            correct: 3,
            explanation: "Correct! Always verify suspicious supplier emails with IT. The .tk domain and HTTP protocol are major red flags."
        },
        {
            title: "Software Download Request",
            description: "Your manager asks you to download a supplier management tool from: http://businesstools.exe-download.org/supplier-manager.exe",
            options: [
                "Download immediately as requested",
                "Ask for official download source first",
                "Download but scan with antivirus first",
                "Refuse to download anything"
            ],
            correct: 1,
            explanation: "Correct! Always request official download sources. The .org domain for .exe files and HTTP protocol are suspicious."
        },
        {
            title: "Urgent Payment Portal",
            description: "A popup appears: 'URGENT: Hilltop Honey payment system requires immediate verification' with a link to: https://hilltop-payment-urgent.tk/verify-now",
            options: [
                "Click verify to resolve the issue",
                "Close popup and report to IT",
                "Enter details but change password after",
                "Call the number provided in popup"
            ],
            correct: 1,
            explanation: "Correct! Close suspicious popups and report them. The .tk domain and urgent language are classic phishing tactics."
        }
    ],

    // Assessment questions for final evaluation
    assessmentQuestions: [
        {
            title: "Supplier Portal Evaluation",
            description: "Evaluate this URL for a new honey supplier: https://organic-honey-suppliers.co.uk/hilltop-partnership",
            options: [
                "Safe to proceed - HTTPS and .co.uk domain",
                "Suspicious - verify supplier independently first", 
                "Dangerous - obvious phishing attempt",
                "Safe - mentions Hilltop in URL"
            ],
            correct: 1,
            explanation: "While technically secure, new supplier websites should always be independently verified before entering any business data."
        },
        {
            title: "Download Security Assessment",
            description: "You need accounting software. Which download source is safest?",
            options: [
                "http://free-accounting-software.net/download.exe",
                "https://software-downloads.org/accounting/sage.exe",
                "https://www.sage.com/en-gb/products/sage-50-accounts/",
                "https://torrent-downloads.net/sage-accounting-pro.exe"
            ],
            correct: 2,
            explanation: "Always download software from official vendor websites. Option 3 is the official Sage website with proper HTTPS security."
        },
        {
            title: "Certificate Validation",
            description: "You visit a supplier website. The browser shows a certificate warning. What should you do?",
            options: [
                "Click 'Proceed anyway' - probably just expired",
                "Close browser and report to IT department",
                "Continue but don't enter sensitive information",
                "Try accessing via HTTP instead"
            ],
            correct: 1,
            explanation: "Never ignore certificate warnings for business websites. Close and report to IT for proper verification."
        },
        {
            title: "Email Link Assessment", 
            description: "Email from 'accounts@hiltop-honey.co.uk' asks you to update payment details. The link goes to: https://payment-update.hiltop-honey.co.uk.security-check.tk",
            options: [
                "Safe - email appears to be from company",
                "Safe - has HTTPS security",
                "Dangerous - fraudulent domain structure",
                "Suspicious - verify with accounts team first"
            ],
            correct: 2,
            explanation: "This is a dangerous subdomain hijacking attempt. The .tk extension and complex subdomain structure are major red flags."
        },
        {
            title: "Policy Application",
            description: "According to Hilltop Honey's internet policy, what should you do when you encounter a suspicious website during work?",
            options: [
                "Take a screenshot and continue working",
                "Close browser and restart computer",
                "Document the URL and report to IT immediately",
                "Block the website and continue"
            ],
            correct: 2,
            explanation: "Company policy requires immediate reporting of suspicious websites to IT with documentation for investigation."
        }
    ],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        console.log('Initialising Module 3: Internet Security Training');
        this.cacheDOMElements();
        this.bindEvents();
        this.renderURLDetectiveGame();
        this.updateProgress(25);
    },

    cacheDOMElements() {
        this.dom.sections = document.querySelectorAll('.training-section');
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.actionButtons = document.querySelectorAll('[data-action]');
        
        // Game specific elements
        this.dom.urlSortingPool = document.getElementById('url-sorting-pool');
        this.dom.dropZones = document.querySelectorAll('.url-drop-zone');
        this.dom.feedbackBox = document.getElementById('url-feedback');
        this.dom.phase1Btn = document.getElementById('phase-1-btn');
        
        // Certificate elements
        this.dom.certificateExamples = document.getElementById('certificate-examples');
        this.dom.certFeedback = document.getElementById('cert-feedback');
        this.dom.phase2Btn = document.getElementById('phase-2-btn');
        
        // Scenario elements
        this.dom.scenarioContainer = document.getElementById('scenario-container');
        this.dom.scenarioFeedback = document.getElementById('scenario-feedback');
        this.dom.phase3Btn = document.getElementById('phase-3-btn');
        
        // Assessment elements
        this.dom.assessmentContainer = document.getElementById('assessment-container');
        this.dom.assessmentProgress = document.getElementById('assessment-progress');
        this.dom.assessmentScore = document.getElementById('assessment-score');
        this.dom.assessmentFeedback = document.getElementById('assessment-feedback');
        this.dom.completeBtn = document.getElementById('complete-btn');
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset));
        });
        
        // URL Detective events
        if (this.dom.urlSortingPool) {
            this.dom.urlSortingPool.addEventListener('click', (e) => {
                if (e.target.classList.contains('url-item')) {
                    this.selectURL(e.target);
                }
            });
        }

        if (this.dom.dropZones) {
            this.dom.dropZones.forEach(zone => {
                zone.addEventListener('click', (e) => this.placeURL(e.currentTarget));
            });
        }
    },

    // --- PHASE 1: URL DETECTIVE GAME ---
    renderURLDetectiveGame() {
        if (!this.dom.urlSortingPool) return;
        
        console.log('Rendering URL Detective Game');
        this.dom.urlSortingPool.innerHTML = '';
        
        this.urlExamples.forEach((item, index) => {
            const urlEl = document.createElement('div');
            urlEl.className = 'url-item';
            urlEl.textContent = item.url;
            urlEl.dataset.index = index;
            urlEl.dataset.category = item.category;
            this.dom.urlSortingPool.appendChild(urlEl);
        });
    },

    selectURL(urlElement) {
        // Remove previous selection
        if (this.selectedURL) {
            this.selectedURL.classList.remove('selected');
        }
        
        // Set new selection
        this.selectedURL = urlElement;
        this.selectedURL.classList.add('selected');
        this.dom.feedbackBox.textContent = "Now click a category box to place it.";
        this.dom.feedbackBox.className = 'feedback-box';
    },

    placeURL(zoneElement) {
        if (!this.selectedURL) {
            this.dom.feedbackBox.textContent = "Please select a URL first.";
            this.dom.feedbackBox.className = 'feedback-box incorrect';
            return;
        }

        const correctCategory = this.selectedURL.dataset.category;
        const chosenCategory = zoneElement.dataset.category;
        const urlIndex = this.selectedURL.dataset.index;
        const explanation = this.urlExamples[urlIndex].explanation;

        if (correctCategory === chosenCategory) {
            // Correct placement
            this.dom.feedbackBox.textContent = explanation;
            this.dom.feedbackBox.className = 'feedback-box correct';
            this.selectedURL.classList.remove('selected');
            this.selectedURL.classList.add('correct');
            zoneElement.querySelector('.url-list').appendChild(this.selectedURL);
            this.selectedURL = null;
            this.correctlySorted++;
            this.checkPhase1Completion();
        } else {
            // Incorrect placement
            this.dom.feedbackBox.textContent = `Incorrect. Think carefully about the URL structure and security indicators.`;
            this.dom.feedbackBox.className = 'feedback-box incorrect';
            this.selectedURL.classList.add('incorrect');
            setTimeout(() => {
                if (this.selectedURL) {
                    this.selectedURL.classList.remove('incorrect');
                }
            }, 500);
        }
    },
    
    checkPhase1Completion() {
        if (this.correctlySorted === this.urlExamples.length) {
            this.dom.feedbackBox.textContent = "Excellent! All URLs sorted correctly. Phase 1 complete.";
            this.dom.feedbackBox.className = 'feedback-box correct';
            this.dom.phase1Btn.disabled = false;
            this.showBadgeNotification("🕵️ Web Detective Badge Earned!");
        }
    },

    // --- PHASE 2: CERTIFICATE INSPECTOR ---
    renderCertificateInspector() {
        if (!this.dom.certificateExamples) return;
        
        console.log('Rendering Certificate Inspector');
        this.dom.certificateExamples.innerHTML = '';
        
        this.certificates.forEach((cert, index) => {
            const certEl = document.createElement('div');
            certEl.className = 'certificate-card';
            certEl.dataset.index = index;
            certEl.innerHTML = `
                <div class="certificate-header">
                    <div class="cert-icon ${cert.valid ? 'valid' : 'invalid'}">
                        ${cert.valid ? '🔒' : '⚠️'}
                    </div>
                    <div>
                        <h4>${cert.domain}</h4>
                        <p>Click to inspect certificate</p>
                    </div>
                </div>
                <div class="cert-details">
                    <strong>Issuer:</strong> ${cert.issuer}<br>
                    <strong>Status:</strong> ${cert.expiry}
                </div>
                <div class="cert-explanation">
                    ${cert.explanation}
                </div>
            `;
            
            certEl.addEventListener('click', () => this.inspectCertificate(certEl, index));
            this.dom.certificateExamples.appendChild(certEl);
        });
    },

    inspectCertificate(element, index) {
        if (element.classList.contains('revealed')) return;
        
        element.classList.add('revealed');
        this.certificatesInspected++;
        
        const cert = this.certificates[index];
        this.dom.certFeedback.textContent = cert.explanation;
        this.dom.certFeedback.className = `feedback-box ${cert.valid ? 'correct' : 'incorrect'}`;
        
        this.checkPhase2Completion();
    },

    checkPhase2Completion() {
        if (this.certificatesInspected === this.certificates.length) {
            this.dom.certFeedback.textContent = "Outstanding! All certificates inspected. Phase 2 complete.";
            this.dom.certFeedback.className = 'feedback-box correct';
            this.dom.phase2Btn.disabled = false;
            this.showBadgeNotification("🔐 Protocol Expert Badge Earned!");
        }
    },

    // --- PHASE 3: SCENARIO SIMULATOR ---
    renderScenarios() {
        if (!this.dom.scenarioContainer) return;
        
        console.log('Rendering Threat Scenarios');
        this.dom.scenarioContainer.innerHTML = '';
        
        this.scenarios.forEach((scenario, index) => {
            const scenarioEl = document.createElement('div');
            scenarioEl.className = 'scenario-card';
            scenarioEl.innerHTML = `
                <h3>Scenario ${index + 1}: ${scenario.title}</h3>
                <div class="scenario-description">${scenario.description}</div>
                <div class="scenario-options">
                    ${scenario.options.map((option, optIndex) => 
                        `<div class="scenario-option" data-scenario="${index}" data-option="${optIndex}">
                            ${String.fromCharCode(65 + optIndex)}. ${option}
                        </div>`
                    ).join('')}
                </div>
                <div class="scenario-result" id="result-${index}" style="display: none;"></div>
            `;
            
            this.dom.scenarioContainer.appendChild(scenarioEl);
        });

        // Add click handlers for options
        document.querySelectorAll('.scenario-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleScenarioChoice(e.target));
        });
    },

    handleScenarioChoice(optionElement) {
        const scenarioIndex = parseInt(optionElement.dataset.scenario);
        const optionIndex = parseInt(optionElement.dataset.option);
        const scenario = this.scenarios[scenarioIndex];
        
        // Disable all options for this scenario
        const scenarioCard = optionElement.closest('.scenario-card');
        const allOptions = scenarioCard.querySelectorAll('.scenario-option');
        allOptions.forEach(opt => opt.style.pointerEvents = 'none');
        
        // Mark correct/incorrect
        if (optionIndex === scenario.correct) {
            optionElement.classList.add('correct');
            this.scenariosCompleted++;
        } else {
            optionElement.classList.add('incorrect');
            allOptions[scenario.correct].classList.add('correct');
        }
        
        // Show explanation
        const resultDiv = document.getElementById(`result-${scenarioIndex}`);
        resultDiv.innerHTML = `<div class="feedback-box ${optionIndex === scenario.correct ? 'correct' : 'incorrect'}">
            ${scenario.explanation}
        </div>`;
        resultDiv.style.display = 'block';
        
        this.checkPhase3Completion();
    },

    checkPhase3Completion() {
        if (this.scenariosCompleted === this.scenarios.length) {
            this.dom.scenarioFeedback.textContent = "Brilliant! All scenarios completed successfully. Phase 3 complete.";
            this.dom.scenarioFeedback.className = 'feedback-box correct';
            this.dom.phase3Btn.disabled = false;
            this.showBadgeNotification("🎯 Threat Hunter Badge Earned!");
        }
    },

    // --- PHASE 4: FINAL ASSESSMENT ---
    renderAssessment() {
        if (!this.dom.assessmentContainer) return;
        
        console.log('Starting Final Assessment');
        this.currentAssessmentQuestion = 0;
        this.assessmentScore = 0;
        this.renderAssessmentQuestion();
    },

    renderAssessmentQuestion() {
        if (this.currentAssessmentQuestion >= this.assessmentQuestions.length) {
            this.completeAssessment();
            return;
        }

        const question = this.assessmentQuestions[this.currentAssessmentQuestion];
        this.dom.assessmentContainer.innerHTML = `
            <div class="scenario-card">
                <h3>Question ${this.currentAssessmentQuestion + 1}/5: ${question.title}</h3>
                <div class="scenario-description">${question.description}</div>
                <div class="scenario-options">
                    ${question.options.map((option, optIndex) => 
                        `<div class="scenario-option assessment-option" data-option="${optIndex}">
                            ${String.fromCharCode(65 + optIndex)}. ${option}
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;

        // Add click handlers
        document.querySelectorAll('.assessment-option').forEach(option => {
            option.addEventListener('click', (e) => this.handleAssessmentChoice(e.target));
        });
    },

    handleAssessmentChoice(optionElement) {
        const optionIndex = parseInt(optionElement.dataset.option);
        const question = this.assessmentQuestions[this.currentAssessmentQuestion];
        
        // Mark correct answer
        if (optionIndex === question.correct) {
            this.assessmentScore++;
            optionElement.classList.add('correct');
        } else {
            optionElement.classList.add('incorrect');
            document.querySelectorAll('.assessment-option')[question.correct].classList.add('correct');
        }

        // Disable all options
        document.querySelectorAll('.assessment-option').forEach(opt => opt.style.pointerEvents = 'none');
        
        // Show explanation and continue
        setTimeout(() => {
            this.dom.assessmentFeedback.textContent = question.explanation;
            this.dom.assessmentFeedback.className = `feedback-box ${optionIndex === question.correct ? 'correct' : 'incorrect'}`;
            
            // Update progress
            this.currentAssessmentQuestion++;
            const progress = (this.currentAssessmentQuestion / this.assessmentQuestions.length) * 100;
            this.dom.assessmentProgress.style.width = `${progress}%`;
            this.dom.assessmentScore.textContent = `Score: ${this.assessmentScore}/${this.assessmentQuestions.length}`;
            
            // Continue to next question
            setTimeout(() => this.renderAssessmentQuestion(), 2000);
        }, 1000);
    },

    completeAssessment() {
        const percentage = Math.round((this.assessmentScore / this.assessmentQuestions.length) * 100);
        let message = "";
        let badgeText = "";

        if (percentage >= 80) {
            message = `Outstanding! You scored ${this.assessmentScore}/${this.assessmentQuestions.length} (${percentage}%). You've mastered internet security protocols.`;
            badgeText = "🏆 Digital Navigator Master Badge Earned!";
            this.dom.completeBtn.disabled = false;
        } else {
            message = `You scored ${this.assessmentScore}/${this.assessmentQuestions.length} (${percentage}%). Review the material and retake the assessment (80% required to pass).`;
            // Setup retake functionality
            setTimeout(() => {
                this.dom.completeBtn.textContent = "RETAKE ASSESSMENT";
                this.dom.completeBtn.disabled = false;
                this.dom.completeBtn.onclick = () => {
                    this.currentAssessmentQuestion = 0;
                    this.assessmentScore = 0;
                    this.dom.completeBtn.textContent = "COMPLETE MODULE";
                    this.dom.completeBtn.onclick = null;
                    this.renderAssessment();
                };
            }, 3000);
        }

        this.dom.assessmentFeedback.textContent = message;
        this.dom.assessmentFeedback.className = `feedback-box ${percentage >= 80 ? 'correct' : 'incorrect'}`;
        
        if (percentage >= 80) {
            this.showBadgeNotification(badgeText);
        }
    },

    // --- GENERAL MODULE LOGIC ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        
        switch (action) {
            case 'return-home': 
                window.location.href = 'index.html'; 
                break;
                
            case 'start-training': 
                this.showSection('training-phase-1'); 
                this.updateProgress(25); 
                break;
                
            case 'complete-phase': 
                this.completePhase(parseInt(phase, 10)); 
                break;
                
            case 'complete-module':
                this.completeModule();
                break;
        }
    },
    
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    updateProgress(percentage) {
        if (this.dom.moduleProgress) {
            this.dom.moduleProgress.textContent = `${percentage}%`;
        }
    },

    completePhase(phase) {
        let nextSectionId = '';
        let nextProgress = 0;
        
        switch (phase) {
            case 1:
                nextSectionId = 'training-phase-2';
                nextProgress = 50;
                this.renderCertificateInspector();
                break;
            case 2:
                nextSectionId = 'training-phase-3';
                nextProgress = 75;
                this.renderScenarios();
                break;
            case 3:
                nextSectionId = 'assessment-phase';
                nextProgress = 90;
                this.renderAssessment();
                break;
        }
        
        this.showSection(nextSectionId);
        this.updateProgress(nextProgress);
    },

    completeModule() {
        this.updateProgress(100);
        this.showBadgeNotification("🎓 Module 3 Complete - Internet Security Master!");
        
        // Save progress to localStorage for integration with your progress system
        const moduleData = {
            moduleNumber: 3,
            completed: true,
            score: Math.round((this.assessmentScore / this.assessmentQuestions.length) * 100),
            completedAt: new Date().toISOString(),
            timeSpent: Date.now() - (this.startTime || Date.now())
        };
        
        localStorage.setItem('module3_progress', JSON.stringify(moduleData));
        
        // Call progress tracking function if available
        if (typeof markModuleComplete === 'function') {
            markModuleComplete(3, moduleData.score);
        }
        
        // Redirect after showing completion
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    },

    showBadgeNotification(text) {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.badge-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'badge-notification';
        notification.textContent = text;
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 4000);
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    module3Manager.startTime = Date.now();
    module3Manager.init();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = module3Manager;
}
