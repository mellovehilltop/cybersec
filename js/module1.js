/**
 * js/module1.js - FIXED AND UPGRADED
 *
 * Re-implements terminal typing effect and ensures all visual
 * enhancements are supported by the logic.
 */
const module1Manager = {
    // --- STATE & CONTENT ---
    // ... (All state and content from previous fix remains the same)
    redFlagsFound: 0,
    totalRedFlags: 6,
    assessmentScore: 0,
    currentAssessmentEmailIndex: 0,
    currentTerminalStep: -1,
    isTyping: false, // NEW: Flag to prevent skipping the typing animation
    currentFlowNode: 'scenario1_start',

    terminalContent: [
        { type: 'header', text: 'INTEL PACKET 1/4: PHISHING ATTACKS' },
        { type: 'line', text: '<strong>METHOD:</strong> Fraudsters impersonate trusted sources to steal credentials or data.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Look for generic greetings, urgent language, and suspicious links.' },
        { type: 'header', text: 'INTEL PACKET 2/4: SPEAR PHISHING' },
        { type: 'line', text: '<strong>METHOD:</strong> Highly targeted, personal attacks using your name or job title to build trust.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Watch for unusual requests from familiar contacts, especially those demanding secrecy or speed.' },
        { type: 'header', text: 'INTEL PACKET 3/4: MALWARE ATTACHMENTS' },
        { type: 'line', text: '<strong>METHOD:</strong> Malicious code hidden inside files like `invoice.pdf.exe`.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Never open unexpected attachments. Be wary of files that ask you to "Enable Macros".' },
        { type: 'header', text: 'INTEL PACKET 4/4: BUSINESS EMAIL COMPROMISE (BEC)' },
        { type: 'line', text: '<strong>METHOD:</strong> An attacker poses as a senior executive to trick you into making fraudulent payments.' },
        { type: 'line', text: '<strong>WARNINGS:</strong> Be extremely suspicious of any change in bank details or urgent, unverified payment requests.' },
        { type: 'header', text: 'ANALYSIS COMPLETE' },
    ],

    flowchartNodes: { /* ... (Content is unchanged) ... */
        'scenario1_start': { status: 'SCENARIO 1/3: UNEXPECTED REQUEST', text: 'You receive an email from `ceo@hilltophoney.co.uk` asking you to urgently buy £200 in gift cards. He says not to call as he is in meetings.', options: [{ text: 'Analyze This Threat', next: 'scenario1_q1' }] },'scenario1_q1': { status: 'DECISION POINT 1', text: 'Is this an unusual financial request combined with pressure not to verify?', options: [{ text: 'YES - This is a classic BEC tactic', next: 'scenario1_q2' }, { text: 'NO - The CEO often asks for this', next: 'scenario1_fail' }] },'scenario1_q2': { status: 'CORRECT ANALYSIS', text: 'Excellent. You correctly identified a Business Email Compromise attempt. What is the correct protocol?', options: [{ text: 'STOP, do not reply, and REPORT to IT', next: 'scenario2_start' }, { text: 'Reply and ask for clarification', next: 'scenario1_fail' }] },'scenario1_fail': { status: 'PROTOCOL FAILED - RETRYING', text: 'Incorrect. An urgent, un-verifiable request for money is a major red flag. Let\'s try again.', options: [{ text: 'Restart Scenario 1', next: 'scenario1_start' }] },'scenario2_start': { status: 'SCENARIO 2/3: MYSTERIOUS ATTACHMENT', text: 'An email arrives from an unknown contact with the subject "Invoice" and a `.zip` file attached.', options: [{ text: 'Analyze This Threat', next: 'scenario2_q1' }] },'scenario2_q1': { status: 'DECISION POINT 2', text: 'You were not expecting this invoice. What is the safest action?', options: [{ text: 'DELETE the email without opening it', next: 'scenario3_start' }, { text: 'Open the .zip to see if it\'s real', next: 'scenario2_fail' }] },'scenario2_fail': { status: 'PROTOCOL FAILED - RETRYING', text: 'Incorrect. Opening an unexpected attachment, especially a `.zip` file, could deploy malware instantly. The safest action is to delete it. Let\'s try again.', options: [{ text: 'Restart Scenario 2', next: 'scenario2_start' }] },'scenario3_start': { status: 'SCENARIO 3/3: LOGIN REQUIRED', text: 'You get an email from "Microsoft" saying you must click a link to re-validate your password due to a security update.', options: [{ text: 'Analyze This Threat', next: 'scenario3_q1' }] },'scenario3_q1': { status: 'DECISION POINT 3', text: 'What should you do about the link?', options: [{ text: 'Hover over it to check the real destination', next: 'scenario3_q2' }, { text: 'Click it to secure your account quickly', next: 'scenario3_fail' }] },'scenario3_q2': { status: 'CORRECT ANALYSIS', text: 'You hover and see the link goes to `micros0ft-login.ru`. This is a phishing site.', options: [{ text: 'REPORT the email as Phishing', next: 'end_success' }] },'scenario3_fail': { status: 'PROTOCOL FAILED - RETRYING', text: 'Incorrect. Never click a link in an unexpected email asking for credentials. This is the primary way phishing attacks succeed. Let\'s try again.', options: [{ text: 'Restart Scenario 3', next: 'scenario3_start' }] },'end_success': { status: 'PROTOCOL MASTERED', text: 'You have successfully navigated all threat scenarios. Your decision-making skills are sharp.', isConclusion: true, conclusionClass: 'conclusion-safe' }
    },
    
    assessmentEmails: [ /* ... (Content is unchanged) ... */
        { from: "security@hilltophoney-update.com", subject: "URGENT: Security System Update Required", body: "Dear Employee,<br><br>Our security system requires immediate updating. Click the link below to verify your access credentials:<br><br><a href='#'>Verify Account Access</a><br><br>This must be completed within 2 hours or your access will be suspended.<br><br>IT Security Team", legitimate: false, explanation: "This is a phishing attempt. It uses a suspicious domain ('-update.com'), a generic greeting, urgent time pressure, and asks for credentials via a link." },{ from: "production@hilltophoney.co.uk", subject: "Weekly Production Report - Week 29", body: "Hi Team,<br><br>Please find this week's production summary attached. Any questions, let me know.<br><br>Production Team", legitimate: true, explanation: "This is a legitimate internal email. It uses the correct domain and follows a normal, expected business communication pattern." },{ from: "supplier@premiumhoney.co.uk", subject: "Invoice Payment - Account Details Update", body: "Dear Hilltop Honey,<br><br>Please note our bank details have changed for future payments. Please update your records with the new details attached.<br><br>Best regards,<br>Premium Honey Supplies", legitimate: false, explanation: "This is a suspicious request to change payment details, a common tactic for fraud. Such requests must always be verified through an independent, trusted channel (like a phone call to a known number)." },{ from: "hr@hilltophoney.co.uk", subject: "Holiday Policy Update", body: "Dear all,<br><br>A reminder that the new holiday booking policy is now in effect. Please see the details on the company intranet.<br><br>Thanks,<br>HR Department", legitimate: true, explanation: "This is a legitimate internal HR communication. It refers to an internal resource (intranet) and does not ask for urgent action or sensitive information." }
    ],

    dom: {},

    // init() and cacheDOMElements() remain the same as previous fix
    init() { this.cacheDOMElements(); this.bindEvents(); this.updateProgress(1); },
    cacheDOMElements() { this.dom.sections = document.querySelectorAll('.training-section'); this.dom.moduleProgress = document.getElementById('module-progress'); this.dom.actionButtons = document.querySelectorAll('[data-action]'); this.dom.terminalOutput = document.getElementById('terminal-output'); this.dom.terminalNextBtn = document.querySelector('[data-action="terminal-next"]'); this.dom.phase1ContinueBtn = document.getElementById('phase-1-continue-btn'); this.dom.scannableElements = document.querySelectorAll('.scannable'); this.dom.flagsFound = document.getElementById('flags-found'); this.dom.flagExplanations = document.getElementById('flag-explanations'); this.dom.phase2Btn = document.getElementById('phase-2-btn'); this.dom.flowchart = document.getElementById('decision-flowchart'); this.dom.flowchartStatus = document.getElementById('flowchart-status'); this.dom.flowchartText = document.getElementById('flowchart-text'); this.dom.flowchartActions = document.getElementById('flowchart-actions'); this.dom.phase3Btn = document.getElementById('phase-3-btn'); this.dom.assessmentContainer = document.getElementById('email-assessment-container'); this.dom.resultsContainer = document.getElementById('assessment-results-container'); },
    bindEvents() { this.dom.actionButtons.forEach(btn => { btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset)); }); this.dom.scannableElements.forEach(el => { el.addEventListener('click', (e) => this.handleRedFlagClick(e.currentTarget)); }); this.dom.flowchartActions.addEventListener('click', (e) => { if (e.target.matches('[data-next]')) { this.handleFlowchartChoice(e.target.dataset.next); } }); this.dom.assessmentContainer.addEventListener('click', (e) => { if (e.target.matches('[data-choice]')) { this.handleAssessmentChoice(e.target.dataset.choice === 'true'); } }); },
    
    // --- MODIFIED LOGIC ---
    
    handleAction(dataset) {
        const { action, phase } = dataset;
        // PREVENT actions while typing
        if (this.isTyping && action !== 'return-home') return;

        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': if (window.digitalShieldProgress) { window.digitalShieldProgress.startModule(1); } this.showSection('training-phase-1'); this.updateProgress(2); this.renderNextTerminalLine(); break;
            case 'terminal-next': this.renderNextTerminalLine(); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    // REPLACED: renderNextTerminalLine to use the new typeLine function
    renderNextTerminalLine() {
        if (this.isTyping) return;
        this.currentTerminalStep++;
        if (this.currentTerminalStep < this.terminalContent.length) {
            const stepData = this.terminalContent[this.currentTerminalStep];
            const newLine = document.createElement('div');
            newLine.className = `terminal-line ${stepData.type}`;
            this.dom.terminalOutput.appendChild(newLine);
            this.typeLine(newLine, stepData.text);
        }
        if (this.currentTerminalStep >= this.terminalContent.length - 1) {
            this.dom.terminalNextBtn.style.display = 'none';
            // The continue button will be shown by typeLine when it finishes
        }
    },

    // NEW: Function to create the typing effect
    typeLine(element, text) {
        this.isTyping = true;
        this.dom.terminalNextBtn.disabled = true;

        let i = 0;
        let isTag = false;
        element.innerHTML = ''; // Clear the element first

        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';

        const typeWriter = () => {
            if (i < text.length) {
                const char = text.charAt(i);
                // Simple logic to handle HTML tags like <strong>
                if (char === '<') isTag = true;
                if (char === '>') isTag = false;

                element.innerHTML += char;
                i++;
                
                // Add cursor for visual effect
                element.appendChild(cursor);
                this.dom.terminalOutput.scrollTop = this.dom.terminalOutput.scrollHeight;

                const speed = isTag ? 0 : 30; // Type faster if it's an HTML tag
                setTimeout(typeWriter, speed);
            } else {
                // Typing finished for this line
                cursor.remove(); // Remove cursor when done
                this.isTyping = false;
                this.dom.terminalNextBtn.disabled = false;
                
                // If it's the very last line, show the continue button
                if (this.currentTerminalStep >= this.terminalContent.length - 1) {
                    this.dom.phase1ContinueBtn.style.display = 'block';
                }
            }
        };
        typeWriter();
    },

    // --- All other functions (completePhase, handleRedFlagClick, etc.) remain unchanged ---
    completePhase(phase) { this.updateProgress(phase + 2); if (phase === 1) { this.showSection('training-phase-2'); } else if (phase === 2) { this.showSection('training-phase-3'); this.renderFlowNode(); } else if (phase === 3) { this.showSection('assessment-phase'); this.renderAssessmentEmail(); } },
    showSection(sectionId) { this.dom.sections.forEach(section => section.classList.remove('active')); document.getElementById(sectionId)?.classList.add('active'); },
    updateProgress(step) { const percentage = Math.round(((step - 1) / 5) * 100); this.dom.moduleProgress.textContent = `${percentage}%`; },
    handleRedFlagClick(element) { if (element.classList.contains('found')) return; element.classList.add('found'); this.redFlagsFound++; this.dom.flagsFound.textContent = this.redFlagsFound; const explanations = { 'sender': 'Misspelled domain name.', 'subject': 'Creates false urgency.', 'greeting': 'Generic, non-personal greeting.', 'urgency': 'Claims of suspicious activity to cause panic.', 'request': 'Asks for login credentials via a link.', 'link': 'Hovering would reveal a suspicious URL.' }; const p = document.createElement('p'); p.innerHTML = `<strong>FLAGGED:</strong> ${explanations[element.dataset.flag]}`; this.dom.flagExplanations.appendChild(p); if (this.redFlagsFound >= this.totalRedFlags) { this.dom.phase2Btn.disabled = false; } },
    handleFlowchartChoice(nextNodeId) { this.currentFlowNode = nextNodeId; this.renderFlowNode(); },
    renderFlowNode() { const node = this.flowchartNodes[this.currentFlowNode]; if (!node) return; this.dom.flowchartStatus.textContent = node.status; this.dom.flowchartText.innerHTML = node.text; this.dom.flowchartActions.innerHTML = ''; this.dom.flowchart.className = 'decision-flowchart'; if (node.isConclusion) { this.dom.flowchart.classList.add(node.conclusionClass); this.dom.phase3Btn.style.display = 'block'; } else { node.options.forEach(option => { const button = document.createElement('button'); button.className = 'btn btn-secondary'; button.textContent = option.text; button.dataset.next = option.next; this.dom.flowchartActions.appendChild(button); }); } },
    handleAssessmentChoice(userChoice) { const email = this.assessmentEmails[this.currentAssessmentEmailIndex]; const isCorrect = (userChoice === email.legitimate); if (isCorrect) { this.assessmentScore += 25; } this.showEmailFeedback(email, isCorrect); this.currentAssessmentEmailIndex++; setTimeout(() => { if (this.currentAssessmentEmailIndex >= this.assessmentEmails.length) { this.showAssessmentResults(); } else { this.renderAssessmentEmail(); } }, 3000); },
    renderAssessmentEmail() { const email = this.assessmentEmails[this.currentAssessmentEmailIndex]; this.dom.assessmentContainer.innerHTML = ` <div class="assessment-email"> <h4>Email ${this.currentAssessmentEmailIndex + 1} of ${this.assessmentEmails.length}</h4> <div class="email-preview"> <p><strong>From:</strong> ${email.from}</p> <p><strong>Subject:</strong> ${email.subject}</p> <p>${email.body}</p> </div> <div class="action-buttons"> <button data-choice="true" class="btn assess-btn safe">✅ SAFE</button> <button data-choice="false" class="btn assess-btn suspicious">⚠️ SUSPICIOUS</button> </div> </div>`; },
    showEmailFeedback(email, isCorrect) { const feedbackClass = isCorrect ? 'correct' : 'incorrect'; const resultText = isCorrect ? 'CORRECT!' : 'INCORRECT'; this.dom.assessmentContainer.innerHTML = ` <div class="assessment-feedback ${feedbackClass}"> <h3>${resultText}</h3> <p>${email.explanation}</p> </div> `; },
    showAssessmentResults() { this.dom.assessmentContainer.style.display = 'none'; const passed = this.assessmentScore >= window.digitalShieldProgress.passingScore; this.dom.resultsContainer.innerHTML = ` <div class="assessment-completion"> <h2>ASSESSMENT COMPLETE</h2> <p class="final-score">You scored: ${this.assessmentScore}%</p> <p class="final-status ${passed ? 'passed' : 'failed'}">Status: ${passed ? 'PASSED' : 'FAILED'}</p> <p>${passed ? 'Excellent work, Agent. Your situational awareness is sharp.' : 'You did not meet the passing score. Review the material and try again.'}</p> <button data-action="complete-module" class="btn btn-secondary">COMPLETE MODULE & RETURN</button> </div>`; this.dom.resultsContainer.style.display = 'block'; },
    completeModule() { if (window.digitalShieldProgress) { window.digitalShieldProgress.completeModule(1, this.assessmentScore); } alert('Progress saved. Returning to Mission Control.'); window.location.href = 'index.html'; }
};

document.addEventListener('DOMContentLoaded', () => {
    module1Manager.init();
});
