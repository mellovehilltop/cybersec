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
    { from: "supplier@honeyextractors.co.uk", subject: "Updated Invoice #HE-2024-0847", body: "Please find attached our updated invoice.<br>Best regards,<br>Honey Extractors", legitimate: true, explanation: "Legitimate: A standard business email from a known supplier with specific details." },
   
    { from: "security@hilltophoney-update.com",
      subject: "URGENT: Security System Update Required",
      body: "Dear Employee,<br>Our security system requires immediate updating. Click the link below to verify your access credentials:<br><a href='#'>Verify Account Access</a><br>This must be completed within 2 hours or your access will be suspended.<br>IT Security Team", legitimate: false, explanation: "This is a phishing attempt with suspicious domain, generic greeting, urgent time pressure, and requests credentials." },
   
    { from: "production@hilltophoney.co.uk",
      subject: "Weekly Production Report - Week 29",
      body: "Hi Team,<br>Please find this week's production summary:<br>- Honey processed: 3,247 litres<br>- Quality control: 100% pass rate<br>- Next week's targets attached<br>Any questions, let me know.<br>Production Team", legitimate: true, explanation: "This is a legitimate internal email with normal business content, proper domain, and expected communication pattern." },
      
    { from: "supplier@premiumhoney.co.uk",
      subject: "Invoice Payment - Account Details Update",
      body: "Dear Hilltop Honey,<br>Thank you for your recent order. Please note our bank details have changed for future payments:<br>New Account: HSBC Bank<br>Sort: 40-12-34<br>Account: 12345678<br>Please update your records.<br>Best regards,<br>Premium Honey Supplies", legitimate: false, explanation: "Suspicious request to change payment details. Should be verified through independent communication channels." }
],
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
        // Phase 1 Terminal
        this.dom.terminalOutput = document.getElementById('terminal-output');
        this.dom.terminalNextBtn = document.querySelector('[data-action="terminal-next"]');
        this.dom.phase1ContinueBtn = document.getElementById('phase-1-continue-btn');
        // Phase 2 Red Flags
        this.dom.scannableElements = document.querySelectorAll('.scannable');
        this.dom.flagsFound = document.getElementById('flags-found');
        this.dom.flagExplanations = document.getElementById('flag-explanations');
        this.dom.phase2Btn = document.getElementById('phase-2-btn');
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
            this.showSection('training-phase-2');/**
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
  // INSIDE js/module1.js

    // EXPANDED: Content and state for the Phase 3 Flowchart with multiple scenarios
    currentFlowNode: 'scenario1_start',
    flowchartNodes: {
        // --- SCENARIO 1: The Unexpected Request ---
        'scenario1_start': {
            status: 'SCENARIO 1/3: UNEXPECTED REQUEST',
            text: 'You receive an email from `ceo@hilltophoney.co.uk` asking you to urgently buy £200 in gift cards. He says not to call as he is in meetings.',
            options: [ { text: 'Analyze This Threat', next: 'scenario1_q1' } ]
        },
        'scenario1_q1': {
            status: 'DECISION POINT 1',
            text: 'Is this an unusual financial request combined with pressure not to verify?',
            options: [
                { text: 'YES - This is a classic BEC tactic', next: 'scenario1_q2' },
                { text: 'NO - The CEO often asks for this', next: 'scenario1_fail' }
            ]
        },
        'scenario1_q2': {
            status: 'CORRECT ANALYSIS',
            text: 'Excellent. You correctly identified a Business Email Compromise attempt. What is the correct protocol?',
            options: [
                { text: 'STOP, do not reply, and REPORT to IT', next: 'scenario2_start' },
                { text: 'Reply and ask for clarification', next: 'scenario1_fail' }
            ]
        },
        'scenario1_fail': {
            status: 'PROTOCOL FAILED - RETRYING',
            text: 'Incorrect. An urgent, un-verifiable request for money is a major red flag. Let\'s try again.',
            options: [ { text: 'Restart Scenario 1', next: 'scenario1_start' } ]
        },
        // --- SCENARIO 2: The Mysterious Attachment ---
        'scenario2_start': {
            status: 'SCENARIO 2/3: MYSTERIOUS ATTACHMENT',
            text: 'An email arrives from an unknown contact with the subject "Invoice" and a `.zip` file attached.',
            options: [ { text: 'Analyze This Threat', next: 'scenario2_q1' } ]
        },
        'scenario2_q1': {
            status: 'DECISION POINT 2',
            text: 'You were not expecting this invoice. What is the safest action?',
            options: [
                { text: 'DELETE the email without opening it', next: 'scenario3_start' },
                { text: 'Open the .zip to see if it\'s real', next: 'scenario2_fail' }
            ]
        },
        'scenario2_fail': {
            status: 'PROTOCOL FAILED - RETRYING',
            text: 'Incorrect. Opening an unexpected attachment, especially a `.zip` file, could deploy malware instantly. The safest action is to delete it. Let\'s try again.',
            options: [ { text: 'Restart Scenario 2', next: 'scenario2_start' } ]
        },
        // --- SCENARIO 3: The "Login Required" Link ---
        'scenario3_start': {
            status: 'SCENARIO 3/3: LOGIN REQUIRED',
            text: 'You get an email from "Microsoft" saying you must click a link to re-validate your password due to a security update.',
            options: [ { text: 'Analyze This Threat', next: 'scenario3_q1' } ]
        },
        'scenario3_q1': {
            status: 'DECISION POINT 3',
            text: 'What should you do about the link?',
            options: [
                { text: 'Hover over it to check the real destination', next: 'scenario3_q2' },
                { text: 'Click it to secure your account quickly', next: 'scenario3_fail' }
            ]
        },
        'scenario3_q2': {
            status: 'CORRECT ANALYSIS',
            text: 'You hover and see the link goes to `micros0ft-login.ru`. This is a phishing site.',
            options: [
                { text: 'REPORT the email as Phishing', next: 'end_success' }
            ]
        },
        'scenario3_fail': {
            status: 'PROTOCOL FAILED - RETRYING',
            text: 'Incorrect. Never click a link in an unexpected email asking for credentials. This is the primary way phishing attacks succeed. Let\'s try again.',
            options: [ { text: 'Restart Scenario 3', next: 'scenario3_start' } ]
        },
        // --- End Node ---
        'end_success': {
            status: 'PROTOCOL MASTERED',
            text: 'You have successfully navigated all threat scenarios. Your decision-making skills are sharp.',
            isConclusion: true,
            conclusionClass: 'conclusion-safe'
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

// INSIDE js/module1.js

    showEmailFeedback(email, userChoice, isCorrect) {
        const feedbackClass = isCorrect ? 'correct' : 'incorrect';
        const resultText = isCorrect ? 'CORRECT!' : 'INCORRECT';
        this.dom.assessmentContainer.innerHTML = `
            <div class="assessment-feedback ${feedbackClass}">
                <h3>${resultText}</h3>
                <p>${email.explanation}</p>
            </div>
        `;
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
        } else if (phase === 2) {
            this.showSection('training-phase-3');
        } else if (phase === 3) {
            this.showSection('assessment-phase');
            // ** THE FIX IS HERE: **
            // We need to tell the script to draw the first question.
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
