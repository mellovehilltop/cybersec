const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesInspected: 0,
    currentWebsiteIndex: 0,
    redFlagsFoundOnCurrentPage: 0,
    totalRedFlagsOnCurrentPage: 0,
    assessmentScore: 0,
    currentAssessmentQuestion: 0,
    
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

    // --- DOM CACHE ---
    dom: {},

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
            // Phase 1B
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
            case 'start-training': this.showSection('training-phase-1a'); this.updateProgress(2); break;
            case 'start-detective-game': this.showSection('training-phase-1b'); this.updateProgress(3); this.renderURLDetectiveGame(); break;
            case 'complete-phase': this.completePhase(parseInt(dataset.phase)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    showSection(sectionId) {
        this.dom.sections.forEach(s => s.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const totalSteps = 6; // Briefing, Edu, Game, Cert, Hunt, Assess
        this.dom.moduleProgress.textContent = `${Math.round(((step - 1) / totalSteps) * 100)}%`;
    },

    completePhase(phase) {
        this.updateProgress(phase + 3);
        if (phase === 1) { this.showSection('training-phase-2'); this.renderCertificateInspector(); }
        else if (phase === 2) { this.showSection('training-phase-3'); this.startRedFlagHunt(); }
        else if (phase === 3) { this.showSection('assessment-phase'); this.renderAssessment(); }
    },
    
    // --- PHASE 1B LOGIC (URL DETECTIVE) ---
    renderURLDetectiveGame() {
        this.dom.urlSortingPool.innerHTML = this.urlExamples.map((item, index) => 
            `<div class="url-item" data-index="${index}" data-category="${item.category}">${item.url}</div>`
        ).join('');
    },
    selectURL(el) {
        if (this.selectedURL) { this.selectedURL.classList.remove('selected'); }
        this.selectedURL = el;
        el.classList.add('selected');
        this.dom.urlFeedback.textContent = "Now click a category box to place it.";
        this.dom.urlFeedback.className = 'feedback-box';
    },
    placeURL(zone) {
        if (!this.selectedURL) { this.dom.urlFeedback.textContent = "Please select a URL first."; return; }
        const correctCategory = this.selectedURL.dataset.category;
        const chosenCategory = zone.dataset.category;
        if (correctCategory === chosenCategory) {
            this.dom.urlFeedback.textContent = this.urlExamples[this.selectedURL.dataset.index].explanation;
            this.dom.urlFeedback.className = 'feedback-box correct';
            this.selectedURL.classList.remove('selected');
            this.selectedURL.classList.add('correct');
            zone.querySelector('.url-list').appendChild(this.selectedURL);
            this.selectedURL = null;
            this.correctlySorted++;
            this.checkPhase1Completion();
        } else {
            this.dom.urlFeedback.textContent = `Incorrect. Think again about that URL.`;
            this.dom.urlFeedback.className = 'feedback-box incorrect';
            this.selectedURL.classList.add('incorrect');
            setTimeout(() => this.selectedURL?.classList.remove('incorrect'), 500);
        }
    },
    checkPhase1Completion() {
        if (this.correctlySorted === this.urlExamples.length) {
            this.dom.urlFeedback.textContent = "All URLs sorted correctly! Phase 1 complete.";
            this.dom.phase1Btn.disabled = false;
        }
    },

    // --- PHASE 2 LOGIC (CERTIFICATE INSPECTOR) ---
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
        this.dom.certFeedback.textContent = this.certificates[el.dataset.index].explanation;
        if (this.certificatesInspected === this.certificates.length) {
            this.dom.certFeedback.textContent = "All certificates inspected!";
            this.dom.phase2Btn.disabled = false;
        }
    },

    // --- PHASE 3 LOGIC (RED FLAG HUNT) ---
    startRedFlagHunt() {
        this.currentWebsiteIndex = 0;
        this.renderNextWebsite();
    },
    renderNextWebsite() {
        if (this.currentWebsiteIndex >= 3) {
            this.completeRedFlagHunt();
            return;
        }
        const templateId = `website-template-${this.currentWebsiteIndex + 1}`;
        const template = document.getElementById(templateId);
        if (!template) { console.error(`Template not found: ${templateId}`); return; }
        
        this.dom.websiteMockupContainer.innerHTML = '';
        this.dom.websiteMockupContainer.appendChild(template.content.cloneNode(true));
        
        const flagsOnThisPage = this.dom.websiteMockupContainer.querySelectorAll('.red-flag');
        this.totalRedFlagsOnCurrentPage = flagsOnThisPage.length;
        this.redFlagsFoundOnCurrentPage = 0;
        
        this.dom.totalFlags.textContent = this.totalRedFlagsOnCurrentPage;
        this.dom.flagsFound.textContent = 0;
        this.dom.currentWebsite.textContent = `${this.currentWebsiteIndex + 1}`;
        this.dom.nextWebsiteBtn.style.display = 'none';
        this.dom.redflagFeedback.textContent = "Click on anything that looks suspicious.";
    },
    handleRedFlagClick(el) {
        if (el.classList.contains('found')) return;
        el.classList.add('found');
        this.redFlagsFoundOnCurrentPage++;
        
        this.dom.flagsFound.textContent = this.redFlagsFoundOnCurrentPage;
        this.dom.redflagFeedback.textContent = `FLAGGED: ${el.dataset.explanation}`;

        if (this.redFlagsFoundOnCurrentPage === this.totalRedFlagsOnCurrentPage) {
            this.dom.nextWebsiteBtn.style.display = 'block';
        }
    },
    completeRedFlagHunt() {
        this.dom.websiteMockupContainer.innerHTML = `<h2><span aria-hidden="true">✅ </span>Red Flag Hunt Complete!</h2><p>Excellent work, Agent!</p>`;
        this.dom.redflagFeedback.textContent = `You found all the red flags.`;
        this.dom.phase3Btn.disabled = false;
        this.dom.nextWebsiteBtn.style.display = 'none';
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
        const passed = (this.assessmentScore / this.assessmentQuestions.length) >= 0.8;
        this.dom.assessmentContainer.innerHTML = `
            <div class="assessment-completion">
                <h2>Assessment Complete!</h2>
                <p>You scored ${this.assessmentScore}/${this.assessmentQuestions.length}.</p>
                <p><strong>Status: ${passed ? 'PASSED' : 'FAILED - Please Review Module'}</strong></p>
            </div>`;
        if (passed) { this.dom.completeBtn.disabled = false; }
    },
    
    completeModule() {
        if (window.digitalShieldProgress) {
            window.digitalShieldProgress.completeModule(3, (this.assessmentScore / this.assessmentQuestions.length) * 100);
        }
        alert('Module 3 complete! Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => module3Manager.init());
