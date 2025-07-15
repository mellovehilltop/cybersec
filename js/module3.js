const module3Manager = {
    // --- STATE ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesInspected: 0,
    currentWebsiteIndex: 0,
    redFlagsFound: 0,
    currentAssessmentQuestion: 0,
    assessmentScore: 0,

    // --- CONTENT ---
    urlExamples: [
        { url: "https://www.hilltophoney.co.uk", category: "safe", explanation: "Correct! HTTPS and the official domain are good signs." },
        { url: "http://hilltop-suppliers.net", category: "suspicious", explanation: "Correct! HTTP is not secure and this is not our official domain." },
        { url: "https://hiltophoney.tk/payment", category: "dangerous", explanation: "Correct! A misspelled domain and a .tk TLD are major red flags." },
        { url: "https://www.gov.uk/business", category: "safe", explanation: "Correct! This is a legitimate, secure government URL." },
        { url: "http://192.168.1.5/update.exe", category: "dangerous", explanation: "Correct! A direct IP address URL for a download is extremely dangerous." }
    ],
    certificates: [
        { domain: "hilltophoney.co.uk", valid: true, explanation: "VALID: Issued by a trusted authority and not expired." },
        { domain: "hiltop-honey.net", valid: false, explanation: "INVALID: Self-signed certificates cannot be trusted." },
        { domain: "suppliers.hilltophoney.co.uk", valid: true, explanation: "VALID: This is a secure, official subdomain." },
        { domain: "hilltophoney.tk", valid: false, explanation: "INVALID: Certificate has expired and is from an unknown authority." }
    ],
    assessmentQuestions: [
        { question: "Evaluate this URL for a new supplier: https://organic-honey-suppliers.co.uk", options: ["Safe to proceed", "Suspicious, verify first", "Dangerous, phishing"], correct: 1, explanation: "Correct! New supplier sites should always be verified independently first." },
        { question: "You need accounting software. Which is the safest source?", options: ["http://free-accounting.net", "https://www.sage.com/en-gb/", "A link from a forum post"], correct: 1, explanation: "Correct! Always download software directly from the official vendor's secure website." },
        { question: "Your browser shows a 'Certificate Not Valid' warning. What do you do?", options: ["Click 'Proceed anyway'", "Close the tab and report to IT", "Try the HTTP version"], correct: 1, explanation: "Correct! Never ignore certificate warnings. Close the tab and report it." }
    ],

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress(1);
    },

    cacheDOMElements() {
        this.dom = {
            sections: document.querySelectorAll('.training-section'),
            moduleProgress: document.getElementById('module-progress'),
            actionButtons: document.querySelectorAll('[data-action]'),
            // Phase 1
            urlSortingPool: document.getElementById('url-sorting-pool'),
            dropZones: document.querySelectorAll('.url-drop-zone'),
            urlFeedback: document.getElementById('url-feedback'),
            phase1Btn: document.getElementById('phase-1-btn'),
            // Phase 2
            certificateExamples: document.getElementById('certificate-examples'),
            certFeedback: document.getElementById('cert-feedback'),
            phase2Btn: document.getElementById('phase-2-btn'),
            // Phase 3
            websiteMockupContainer: document.getElementById('website-mockup-container'),
            redflagFeedback: document.getElementById('redflag-feedback'),
            flagsFound: document.getElementById('flags-found'),
            totalFlags: document.getElementById('total-flags'),
            currentWebsite: document.getElementById('current-website'),
            nextWebsiteBtn: document.getElementById('next-website-btn'),
            phase3Btn: document.getElementById('phase-3-btn'),
            // Assessment
            assessmentContainer: document.getElementById('assessment-container'),
            completeBtn: document.getElementById('complete-btn')
        };
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => btn.addEventListener('click', e => this.handleAction(e.currentTarget.dataset)));
        this.dom.urlSortingPool?.addEventListener('click', e => { if (e.target.classList.contains('url-item')) this.selectURL(e.target); });
        this.dom.dropZones?.forEach(zone => zone.addEventListener('click', e => this.placeURL(e.currentTarget)));
        this.dom.certificateExamples?.addEventListener('click', e => { if (e.target.closest('.certificate-card')) this.inspectCertificate(e.target.closest('.certificate-card')); });
        this.dom.websiteMockupContainer?.addEventListener('click', e => { if (e.target.classList.contains('red-flag')) this.handleRedFlagClick(e.target); });
        this.dom.nextWebsiteBtn?.addEventListener('click', () => this.renderNextWebsite());
        this.dom.assessmentContainer?.addEventListener('click', e => { if (e.target.matches('[data-option]')) this.handleAssessmentChoice(e.target); });
    },

    // --- GENERAL LOGIC ---
    handleAction(dataset) {
        switch (dataset.action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': this.showSection('training-phase-1'); this.updateProgress(2); this.renderURLDetectiveGame(); break;
            case 'complete-phase': this.completePhase(parseInt(dataset.phase)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    showSection(sectionId) {
        this.dom.sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const totalSteps = 4;
        this.dom.moduleProgress.textContent = `${Math.round(((step-1)/totalSteps)*100)}%`;
    },

    completePhase(phase) {
        this.updateProgress(phase + 2);
        if (phase === 1) { this.showSection('training-phase-2'); this.renderCertificateInspector(); }
        if (phase === 2) { this.showSection('training-phase-3'); this.startRedFlagHunt(); }
        if (phase === 3) { this.showSection('assessment-phase'); this.renderAssessment(); }
    },
    
    // --- PHASE 1 LOGIC ---
    renderURLDetectiveGame() { /* ... function from previous step ... */ },
    selectURL(el) { /* ... function from previous step ... */ },
    placeURL(zone) { /* ... function from previous step ... */ },
    checkPhase1Completion() { /* ... function from previous step ... */ },

    // --- PHASE 2 LOGIC ---
    renderCertificateInspector() {
        this.dom.certificateExamples.innerHTML = this.certificates.map((cert, i) => `
            <div class="certificate-card" data-index="${i}">
                <div class="certificate-header">
                    <div class="cert-icon ${cert.valid ? 'valid' : 'invalid'}">${cert.valid ? '🔒' : '⚠️'}</div>
                    <h4>${cert.domain}</h4>
                </div>
                <div class="cert-explanation">${cert.explanation}</div>
            </div>
        `).join('');
    },
    inspectCertificate(el) {
        if (el.classList.contains('revealed')) return;
        el.classList.add('revealed');
        this.certificatesInspected++;
        if (this.certificatesInspected === this.certificates.length) {
            this.dom.certFeedback.textContent = "All certificates inspected!";
            this.dom.phase2Btn.disabled = false;
        }
    },

    // --- PHASE 3 LOGIC (RED FLAG HUNT) ---
    startRedFlagHunt() {
        this.currentWebsiteIndex = 0;
        this.redFlagsFound = 0;
        this.renderNextWebsite();
    },
    
    renderNextWebsite() {
        if (this.currentWebsiteIndex >= 3) {
            this.completeRedFlagHunt();
            return;
        }
        const template = document.getElementById(`website-template-${this.currentWebsiteIndex + 1}`);
        this.dom.websiteMockupContainer.innerHTML = '';
        this.dom.websiteMockupContainer.appendChild(template.content.cloneNode(true));
        
        const flagsOnThisPage = this.dom.websiteMockupContainer.querySelectorAll('.red-flag');
        this.dom.totalFlags.textContent = flagsOnThisPage.length;
        this.dom.flagsFound.textContent = 0;
        this.dom.currentWebsite.textContent = `${this.currentWebsiteIndex + 1}`;
        this.dom.nextWebsiteBtn.style.display = 'none';
        this.dom.redflagFeedback.textContent = "Click on anything that looks suspicious.";
    },

    handleRedFlagClick(el) {
        if (el.classList.contains('found')) return;
        el.classList.add('found');
        this.redFlagsFound++;
        const currentFound = this.dom.websiteMockupContainer.querySelectorAll('.red-flag.found').length;
        const totalOnPage = this.dom.websiteMockupContainer.querySelectorAll('.red-flag').length;
        this.dom.flagsFound.textContent = currentFound;
        this.dom.redflagFeedback.textContent = el.dataset.explanation;
        if (currentFound === totalOnPage) {
            this.dom.nextWebsiteBtn.style.display = 'block';
        }
    },

    completeRedFlagHunt() {
        this.dom.websiteMockupContainer.innerHTML = '<h2>Red Flag Hunt Complete!</h2>';
        this.dom.phase3Btn.disabled = false;
    },

    // --- ASSESSMENT LOGIC ---
    renderAssessment() {
        this.currentAssessmentQuestion = 0;
        this.assessmentScore = 0;
        this.renderNextQuestion();
    },

    renderNextQuestion() {
        if (this.currentAssessmentQuestion >= this.assessmentQuestions.length) {
            this.showAssessmentResults();
            return;
        }
        const q = this.assessmentQuestions[this.currentAssessmentQuestion];
        this.dom.assessmentContainer.innerHTML = `
            <div class="scenario-card">
                <h4>Question ${this.currentAssessmentQuestion + 1}/${this.assessmentQuestions.length}: ${q.question}</h4>
                <div class="scenario-options">
                    ${q.options.map((opt, i) => `<div class="scenario-option" data-option="${i}">${opt}</div>`).join('')}
                </div>
            </div>`;
    },

    handleAssessmentChoice(el) {
        const selected = parseInt(el.dataset.option);
        const correct = this.assessmentQuestions[this.currentAssessmentQuestion].correct;
        el.parentElement.querySelectorAll('.scenario-option').forEach((opt, i) => {
            opt.classList.add(i === correct ? 'correct' : 'incorrect');
            opt.style.pointerEvents = 'none';
        });
        if (selected === correct) this.assessmentScore++;
        setTimeout(() => {
            this.currentAssessmentQuestion++;
            this.renderNextQuestion();
        }, 2000);
    },
    
    showAssessmentResults() {
        this.dom.assessmentContainer.innerHTML = `<h2>Assessment Complete! You scored ${this.assessmentScore}/${this.assessmentQuestions.length}.</h2>`;
        if (this.assessmentScore / this.assessmentQuestions.length >= 0.8) {
            this.dom.completeBtn.disabled = false;
        }
    },
    
    completeModule() {
        if (window.digitalShieldProgress) {
            window.digitalShieldProgress.completeModule(3, (this.assessmentScore / this.assessmentQuestions.length) * 100);
        }
        alert('Module 3 complete!');
        window.location.href = 'index.html';
    }
};

// Simplified placeholders for missing functions from previous steps
module3Manager.renderURLDetectiveGame = function() { console.log('renderURLDetectiveGame placeholder'); };
module3Manager.selectURL = function() { console.log('selectURL placeholder'); };
module3Manager.placeURL = function() { console.log('placeURL placeholder'); };
module3Manager.checkPhase1Completion = function() { console.log('checkPhase1Completion placeholder'); };

document.addEventListener('DOMContentLoaded', () => module3Manager.init());
