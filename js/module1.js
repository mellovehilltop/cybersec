/**
 * js/module1.js
 *
 * Manages all interactivity for the Module 1: Email Security training.
 * This includes navigation, red flag detection, and the final assessment.
 * The script is self-contained and does not rely on global functions or inline `onclick` attributes.
 */
const module1Manager = {
    // --- STATE ---
    redFlagsFound: 0,
    assessmentScore: 0,
    currentAssessmentEmailIndex: 0,
    totalRedFlags: 6,
    assessmentEmails: [
        { id: 1, from: "supplier@honeyextractors.co.uk", subject: "Updated Invoice #HE-2024-0847", content: "Dear Hilltop Honey, Please find attached our updated invoice...", legitimate: true, explanation: "Legitimate business email from a known supplier with specific details." },
        { id: 2, from: "security@hiltop-honey.secure.com", subject: "URGENT: Verify Account Now", content: "Your account will be suspended unless you verify immediately. Click here: verify-now.suspicioussite.com", legitimate: false, explanation: "Phishing attempt with misspelled domain, urgent language, and suspicious link." },
        { id: 3, from: "hr@hilltophoney.com", subject: "Holiday Schedule 2024", content: "Team, Please review the attached 2024 holiday schedule...", legitimate: true, explanation: "Internal HR communication with appropriate content and sender." },
        { id: 4, from: "ceo@hilltophoney.com", subject: "Urgent Wire Transfer Required", content: "I need you to wire £50,000 to our new supplier immediately... Don't call me, I'm in meetings all day.", legitimate: false, explanation: "Business Email Compromise attempt - unusual financial request with instructions not to verify." }
    ],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress(1); // Start at step 1
        console.log("Module 1 Manager Initialized");
    },

    cacheDOMElements() {
        this.dom.sections = document.querySelectorAll('.training-section');
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.actionButtons = document.querySelectorAll('[data-action]');
        this.dom.scannableElements = document.querySelectorAll('.scannable-hidden');
        this.dom.flagsFound = document.getElementById('flags-found');
        this.dom.flagExplanations = document.getElementById('flag-explanations');
        this.dom.phase2Btn = document.getElementById('phase-2-btn');
        this.dom.assessmentContainer = document.getElementById('email-assessment-container');
        this.dom.resultsContainer = document.getElementById('assessment-results-container');
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset));
        });

        this.dom.scannableElements.forEach(el => {
            el.addEventListener('click', (e) => this.handleRedFlagClick(e.currentTarget));
        });

        // Use event delegation for dynamically created assessment buttons
        this.dom.assessmentContainer.addEventListener('click', (e) => {
            if (e.target.matches('[data-choice]')) {
                this.handleAssessmentChoice(e.target.dataset.choice === 'true');
            }
        });
    },

    // --- EVENT HANDLERS ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': this.showSection('training-phase-1'); this.updateProgress(2); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    handleRedFlagClick(element) {
        if (element.classList.contains('found')) return;

        element.classList.add('found');
        this.redFlagsFound++;
        this.updateRedFlagFeedback(element.dataset.flag);

        if (this.redFlagsFound >= this.totalRedFlags) {
            this.dom.phase2Btn.disabled = false;
        }
    },

    handleAssessmentChoice(userChoice) {
        const email = this.assessmentEmails[this.currentAssessmentEmailIndex];
        const isCorrect = (userChoice === email.legitimate);

        if (isCorrect) {
            this.assessmentScore += 100 / this.assessmentEmails.length;
        }
        
        this.showEmailFeedback(email, userChoice, isCorrect);
        this.currentAssessmentEmailIndex++;

        // Disable buttons after choice
        this.dom.assessmentContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);

        setTimeout(() => {
            this.renderAssessmentEmail();
        }, 3000);
    },

    // --- LOGIC & UI UPDATES ---
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        // There are 4 steps: Briefing, Phase 1, Phase 2, Phase 3, Assessment
        const percentage = ((step - 1) / 4) * 100;
        if (this.dom.moduleProgress) {
            this.dom.moduleProgress.textContent = `${Math.round(percentage)}%`;
        }
    },

    completePhase(phase) {
        const nextPhase = phase + 1;
        this.updateProgress(nextPhase + 1); // e.g., completing phase 1 moves to step 3 (phase 2)
        
        if (phase === 1) this.showSection('training-phase-2');
        else if (phase === 2) this.showSection('training-phase-3');
        else if (phase === 3) {
            this.showSection('assessment-phase');
            this.renderAssessmentEmail();
        }
    },

    updateRedFlagFeedback(flag) {
        this.dom.flagsFound.textContent = this.redFlagsFound;
        const explanations = {
            'sender': 'Misspelled domain name - "hiltophonney" instead of "hilltophoney".',
            'subject': 'Creates false urgency to pressure quick action.',
            'greeting': 'Generic greeting instead of your actual name.',
            'urgency': 'Suspicious activity claims designed to create panic.',
            'request': 'Requests sensitive login verification via email.',
            'link': 'Suspicious URL that doesn\'t match the real domain.'
        };
        const p = document.createElement('p');
        p.innerHTML = `<strong>FLAGGED:</strong> ${explanations[flag]}`;
        this.dom.flagExplanations.appendChild(p);
    },

    renderAssessmentEmail() {
        if (this.currentAssessmentEmailIndex >= this.assessmentEmails.length) {
            this.showAssessmentResults();
            return;
        }
        const email = this.assessmentEmails[this.currentAssessmentEmailIndex];
        this.dom.assessmentContainer.innerHTML = `
            <div class="assessment-email">
                <h4>Email ${this.currentAssessmentEmailIndex + 1} of ${this.assessmentEmails.length}</h4>
                <div class="email-preview">
                    <p><strong>From:</strong> ${email.from}</p>
                    <p><strong>Subject:</strong> ${email.subject}</p>
                    <p><strong>Content:</strong> ${email.content}</p>
                </div>
                <div class="assessment-question">
                    <h4>Is this email safe or suspicious?</h4>
                    <div class="action-buttons">
                        <button data-choice="true" class="btn assess-btn safe">✅ SAFE</button>
                        <button data-choice="false" class="btn assess-btn suspicious">⚠️ SUSPICIOUS</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    showEmailFeedback(email, userChoice, isCorrect) {
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const resultText = isCorrect ? 'CORRECT!' : 'INCORRECT';
        const choiceText = userChoice ? 'marked as SAFE' : 'marked as SUSPICIOUS';
        const actualText = email.legitimate ? 'actually SAFE' : 'actually SUSPICIOUS';

        const feedbackHtml = `
            <div class="assessment-feedback ${feedbackClass}">
                <h3>${resultText}</h3>
                <p>You ${choiceText}, and this email is ${actualText}.</p>
                <div class="explanation"><strong>Explanation:</strong> ${email.explanation}</div>
            </div>`;
        this.dom.assessmentContainer.querySelector('.assessment-email').innerHTML += feedbackHtml;
    },

    showAssessmentResults() {
        this.dom.assessmentContainer.innerHTML = ''; // Clear the assessment area
        let grade, message;

        if (this.assessmentScore >= 75) {
            grade = 'EXPERT'; message = 'Excellent! You have mastered email security.';
        } else if (this.assessmentScore >= 50) {
            grade = 'PROFICIENT'; message = 'Good work! You understand email security basics.';
        } else {
            grade = 'NEEDS IMPROVEMENT'; message = 'Consider reviewing the training materials.';
        }

        this.dom.resultsContainer.innerHTML = `
            <div class="assessment-completion">
                <h2><span aria-hidden="true">🎯 </span>ASSESSMENT COMPLETE</h2>
                <p>You scored ${Math.round(this.assessmentScore)}%</p>
                <p><strong>Grade: ${grade}</strong>. ${message}</p>
                <button data-action="complete-module" class="btn btn-secondary">COMPLETE MODULE 1</button>
            </div>`;
        this.dom.resultsContainer.style.display = 'block';
    },

    completeModule() {
        if (window.digitalShieldProgress) {
            window.digitalShieldProgress.completeModule(1, this.assessmentScore);
        }
        alert('🎉 Congratulations! You have successfully completed Module 1. You are being returned to Mission Control.');
        window.location.href = 'index.html';
    }
};

// --- ENTRY POINT ---
// The 'defer' attribute ensures this runs after the DOM is fully parsed.
module1Manager.init();
