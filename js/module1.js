/**
 * js/module1.js
 *
 * Manages all interactivity for the Module 1: Email Security training.
 * This includes navigation, red flag detection, and the final assessment.
 * The script is self-contained and does not rely on global functions or inline `onclick` attributes.
 */
const module1Manager = {
    // --- STATE & CONTENT ---
    redFlagsFound: 0,
    totalRedFlags: 6,
    assessmentScore: 0,
    currentAssessmentEmailIndex: 0,
    currentTerminalStep: -1,

    terminalContent: [
        { type: 'header', text: 'INTEL PACKET 1/4: PHISHING ATTACKS' },
        { type: 'line', text: '<strong>METHOD:</strong> Fraudsters impersonate trusted sources to steal credentials or data.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Look for generic greetings, urgent language, and suspicious links.' },
        { type: 'header', text: 'INTEL PACKET 2/4: SPEAR PHISHING' },
        { type: 'line', text: '<strong>METHOD:</strong> Highly targeted, personal attacks using your name, job title, and project details to build trust.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Watch for unusual requests from familiar contacts, especially those demanding secrecy or speed.' },
        { type: 'header', text: 'INTEL PACKET 3/4: MALWARE ATTACHMENTS' },
        { type: 'line', text: '<strong>METHOD:</strong> Malicious code hidden inside files like invoices or reports. Often uses names like `invoice.pdf.exe`.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Never open unexpected attachments. Be wary of files that ask you to "Enable Macros".' },
        { type: 'header', text: 'INTEL PACKET 4/4: BUSINESS EMAIL COMPROMISE (BEC)' },
        { type: 'line', text: '<strong>METHOD:</strong> The attacker poses as a senior executive or a supplier to trick you into making fraudulent payments.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Be extremely suspicious of any change in bank details or urgent, out-of-the-blue payment requests.' },
        { type: 'header', text: 'ANALYSIS COMPLETE' },
    ],
    
    assessmentEmails: [
        { from: "supplier@honeyextractors.co.uk", subject: "Updated Invoice #HE-2024-0847", content: "Please find attached our updated invoice<br>Best regards,<br>Honey Extractors", legitimate: true, explanation: "Legitimate: A standard business email from a known supplier with specific details." },
       
 { from: "security@hilltophoney-update.com",
        subject: "URGENT: Security System Update Required",
        body: "Dear Employee,<br><br>Our security system requires immediate updating. Click the link below to verify your access credentials:<br><br><a href='#'>Verify Account Access</a><br><br>This must be completed within 2 hours or your access will be suspended.<br><br>IT Security Team", legitimate: false, explanation: "his is a phishing attempt with suspicious domain, generic greeting, urgent time pressure, and requests credentials." },
       
 { from: "production@hilltophoney.co.uk",
        subject: "Weekly Production Report - Week 29",
        body: "Hi Team,<br><br>Please find this week's production summary:<br>- Honey processed: 3,247 litres<br>- Quality control: 100% pass rate<br>- Next week's targets attached<br><br>Any questions, let me know.<br><br>Production Team", legitimate: true, explanation: "This is a legitimate internal email with normal business content, proper domain, and expected communication pattern." },

        { from: "supplier@premiumhoney.co.uk",
        subject: "Invoice Payment - Account Details Update",
        body: "Dear Hilltop Honey,<br><br>Thank you for your recent order. Please note our bank details have changed for future payments:<br><br>New Account: HSBC Bank<br>Sort: 40-12-34<br>Account: 12345678<br><br>Please update your records.<br><br>Best regards,<br>Premium Honey Supplies", legitimate: false, explanation: "Suspicious request to change payment details. Should be verified through independent communication channels." }
    ],

   // Content and state for the Phase 3 Flowchart
    currentFlowNode: 'start',
    flowchartNodes: {
        'start': {
            status: 'DECISION POINT',
            text: 'A new email has arrived. Does it contain an <strong>unexpected request</strong> or attachment?',
            options: [
                { text: 'YES - It\'s Unexpected', next: 'q2_verify' },
                { text: 'NO - It Seems Routine', next: 'end_caution' }
            ]
        },
        'q2_verify': {
            status: 'VERIFICATION REQUIRED',
            text: 'The request is unexpected. Can you verify it with the sender through a <strong>separate, trusted channel</strong> (e.g., a known phone number, in-person chat)?',
            options: [
                { text: 'YES - I Can Verify', next: 'end_verify' },
                { text: 'NO - I Can\'t Verify', next: 'end_report' }
            ]
        },
        'end_caution': {
            status: 'PROTOCOL CONCLUSION: PROCEED WITH CAUTION',
            text: 'The email seems routine. Remain vigilant, but it is likely safe to proceed.',
            isConclusion: true,
            conclusionClass: 'conclusion-safe'
        },
        'end_verify': {
            status: 'PROTOCOL CONCLUSION: VERIFY BEFORE ACTING',
            text: 'Your action is to verify the request. If it checks out, it\'s safe. If the sender denies sending it, report the email to IT immediately.',
            isConclusion: true,
            conclusionClass: 'conclusion-safe'
        },
        'end_report': {
            status: 'PROTOCOL CONCLUSION: THREAT DETECTED',
            text: 'You cannot verify an unexpected request. This is a high-risk scenario. <strong>Do not reply, click, or download.</strong> Report the email to IT immediately.',
            isConclusion: true,
            conclusionClass: 'conclusion-danger'
        }
    },
    
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
        // Phase 2
        this.dom.scannableElements = document.querySelectorAll('.scannable');
        this.dom.flagsFound = document.getElementById('flags-found');
        this.dom.flagExplanations = document.getElementById('flag-explanations');
        this.dom.phase2Btn = document.getElementById('phase-2-btn');
        // Phase 3 Flowchart
        this.dom.flowchart = document.getElementById('decision-flowchart');
        this.dom.flowchartStatus = document.getElementById('flowchart-status');
        this.dom.flowchartText = document.getElementById('flowchart-text');
        this.dom.flowchartActions = document.getElementById('flowchart-actions');
        this.dom.phase3Btn = document.getElementById('phase-3-btn');
        // Assessment
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
        this.dom.flowchartActions.addEventListener('click', (e) => {
            if (e.target.matches('[data-next]')) {
                this.handleFlowchartChoice(e.target.dataset.next);
            }
        });
        this.dom.assessmentContainer.addEventListener('click', (e) => {
            if (e.target.matches('[data-choice]')) {
                this.handleAssessmentChoice(e.target.dataset.choice === 'true');
            }
        });
    },
    
    // --- EVENT HANDLERS & CORE LOGIC ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training':
                this.showSection('training-phase-1');
                this.updateProgress(2);
                this.renderNextTerminalLine();
                break;
            case 'terminal-next': this.renderNextTerminalLine(); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    handleFlowchartChoice(nextNodeId) {
        this.currentFlowNode = nextNodeId;
        this.renderFlowNode();
    },

    handleRedFlagClick(element) {
        if (element.classList.contains('found')) return;
        element.classList.add('found');
        this.redFlagsFound++;
        this.dom.flagsFound.textContent = this.redFlagsFound;
        const explanations = {
            'sender': 'Misspelled domain name.',
            'subject': 'Creates false urgency.',
            'greeting': 'Generic greeting.',
            'urgency': 'Claims of suspicious activity to cause panic.',
            'request': 'Asks for login credentials.',
            'link': 'Hovering would reveal a suspicious URL.'
        };
        const p = document.createElement('p');
        p.innerHTML = `<strong>FLAGGED:</strong> ${explanations[element.dataset.flag]}`;
        this.dom.flagExplanations.appendChild(p);
        if (this.redFlagsFound >= this.totalRedFlags) {
            this.dom.phase2Btn.disabled = false;
        }
    },

    handleAssessmentChoice(userChoice) {
        const email = this.assessmentEmails[this.currentAssessmentEmailIndex];
        const isCorrect = (userChoice === email.legitimate);
        if (isCorrect) { this.assessmentScore += 25; }
        this.showEmailFeedback(email, userChoice, isCorrect);
        this.currentAssessmentEmailIndex++;
        this.dom.assessmentContainer.querySelectorAll('button').forEach(btn => btn.disabled = true);
        setTimeout(() => this.renderAssessmentEmail(), 3000);
    },
    
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const percentage = Math.round(((step - 1) / 4) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    renderNextTerminalLine() {
        this.currentTerminalStep++;
        if (this.currentTerminalStep < this.terminalContent.length) {
            const stepData = this.terminalContent[this.currentTerminalStep];
            const newLine = document.createElement('div');
            newLine.className = `terminal-line ${stepData.type}`;
            newLine.innerHTML = stepData.text;
            this.dom.terminalOutput.appendChild(newLine);
            this.dom.terminalOutput.scrollTop = this.dom.terminalOutput.scrollHeight;
        }
        if (this.currentTerminalStep >= this.terminalContent.length - 1) {
            this.dom.terminalNextBtn.style.display = 'none';
            this.dom.phase1ContinueBtn.style.display = 'block';
        }
    },
    
    renderFlowNode() {
        const node = this.flowchartNodes[this.currentFlowNode];
        this.dom.flowchartStatus.textContent = node.status;
        this.dom.flowchartText.innerHTML = node.text;
        this.dom.flowchartActions.innerHTML = '';
        this.dom.flowchart.className = 'decision-flowchart';
        if (node.isConclusion) {
            this.dom.flowchart.classList.add(node.conclusionClass);
            this.dom.phase3Btn.style.display = 'block';
        } else {
            node.options.forEach(option => {
                const button = document.createElement('button');
                button.className = 'btn btn-secondary';
                button.textContent = option.text;
                button.dataset.next = option.next;
                this.dom.flowchartActions.appendChild(button);
            });
        }
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
                <div class="email-preview"><p><strong>From:</strong> ${email.from}</p><p><strong>Subject:</strong> ${email.subject}</p><p>${email.content}</p></div>
                <div class="action-buttons"><button data-choice="true" class="btn assess-btn safe">✅ SAFE</button><button data-choice="false" class="btn assess-btn suspicious">⚠️ SUSPICIOUS</button></div>
            </div>`;
    },

    showEmailFeedback(email, userChoice, isCorrect) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `assessment-feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedbackDiv.innerHTML = `<h3>${isCorrect ? 'CORRECT' : 'INCORRECT'}</h3><p>${email.explanation}</p>`;
        this.dom.assessmentContainer.querySelector('.assessment-email').appendChild(feedbackDiv);
    },

    showAssessmentResults() {
        this.dom.assessmentContainer.innerHTML = '';
        const passed = this.assessmentScore >= 75;
        this.dom.resultsContainer.innerHTML = `
            <div class="assessment-completion">
                <h2>ASSESSMENT COMPLETE</h2>
                <p>You scored ${this.assessmentScore}%</p>
                <p><strong>Status: ${passed ? 'PASSED' : 'FAILED'}</strong></p>
                <button data-action="complete-module" class="btn btn-secondary">COMPLETE MODULE 1</button>
            </div>`;
        this.dom.resultsContainer.style.display = 'block';
    },

    completePhase(phase) {
        const nextPhase = phase + 1;
        this.updateProgress(nextPhase + 1);
        if (phase === 1) {
            this.showSection('training-phase-2');
        } else if (phase === 2) {
            this.showSection('training-phase-3');
            this.renderFlowNode(); 
        } else if (phase === 3) {
            this.showSection('assessment-phase');
            this.renderAssessmentEmail();
        }
    },
    
    completeModule() {
        if (window.digitalShieldProgress) {
            window.digitalShieldProgress.completeModule(1, this.assessmentScore);
        }
        alert('Module 1 complete! Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

module1Manager.init();
