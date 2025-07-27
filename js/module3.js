/**
 * js/module3.js - REWRITTEN & ENHANCED
 *
 * - Improves Certificate Inspector to be an interactive decision game.
 * - Adds the new Red Flag Hunt as Phase 4.
 * - Simplifies flow and integrates perfectly with progress.js.
 */
const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesDecided: 0,
    redFlagsFound: 0,
    assessmentScore: 0,
    currentAssessmentQuestion: 0,

    urlExamples: [
        { url: "https://www.hilltophoney.co.uk/contact", cat: "safe", expl: "Correct! HTTPS and the official domain are good signs." },
        { url: "http://hilltop-honey-suppliers.net/login", cat: "suspicious", expl: "Correct! HTTP is not secure and '.net' is not our official domain for suppliers." },
        { url: "https://hiltophoney.tk/urgent-payment", cat: "dangerous", expl: "Correct! Misspelled domain ('hiltop') and a .tk extension are major red flags." },
        { url: "https://royalmail.com/track-and-trace", cat: "safe", expl: "Correct! A legitimate, secure URL for a known service." }
    ],
    certificates: [
        { domain: "hilltophoney.co.uk", valid: true, expl: "CORRECT! This is a valid certificate from a trusted authority." },
        { domain: "hiltop-honey.net", valid: false, expl: "CORRECT! This certificate is self-signed and cannot be trusted." },
        { domain: "suppliers.hilltophoney.co.uk", valid: true, expl: "CORRECT! This is a valid certificate for a proper subdomain." },
        { domain: "payment-update.hilltop.com", valid: false, expl: "CORRECT! This certificate is for a different domain (domain mismatch)." }
    ],
    redFlagWebsite: {
        image: "images/module3/fake-supplier-site.jpg",
        totalFlags: 4,
        redFlags: [
            { id: "url", x: 18, y: 12, width: 60, height: 8, expl: "Spotted! HTTP protocol and a suspicious .tk domain are major red flags." },
            { id: "urgent", x: 25, y: 60, width: 50, height: 10, expl: "Good catch! Urgent language creates panic to rush decisions." },
            { id: "download", x: 33, y: 86, width: 34, height: 6, expl: "Excellent! Never download unexpected .exe files." },
            { id: "logo", x: 40, y: 20, width: 20, height: 15, expl: "Keen eye! A low-quality or incorrect logo is a sign of a fake site." }
        ]
    },
    assessmentQuestions: [
        { q: "Evaluate this URL for a new honey supplier: https://organic-honey-suppliers.co.uk", opts: ["Safe to proceed", "Suspicious - verify independently", "Dangerous - obvious phishing"], correct: 1, expl: "Correct. While it seems safe, new supplier sites must always be independently verified first." },
        { q: "You need accounting software. Which download source is safest?", opts: ["http://free-accounting.net/download.exe", "https://www.sage.com/en-gb/products/", "A link from a tech blog review"], correct: 1, expl: "Correct. Always download from the official vendor website (Sage.com)." },
        { q: "Your browser shows a certificate warning for a supplier's website. What do you do?", opts: ["Click 'Proceed anyway'", "Close the tab and report to IT", "Try accessing via HTTP"], correct: 1, expl: "Correct. Never ignore certificate warnings. Report it." },
        { q: "An email link to `Update Details` has this URL: `https://hilltophoney.co.uk.security-check.com` What is it?", opts: ["A secure link on our domain", "A dangerous phishing link", "A link to our security partner"], correct: 1, expl: "Correct. The real domain is 'security-check.com', which is trying to impersonate us." }
    ],

    dom: {},

    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress(1);
    },

    cacheDOMElements() {
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.assessmentWrapper = document.getElementById('assessment-wrapper');
    },

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const actionTarget = e.target.closest('[data-action]');
            if (actionTarget) {
                e.preventDefault();
                this.handleAction(actionTarget.dataset);
            }
        });
    },

    handleAction(dataset) {
        switch (dataset.action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training':
                if (window.digitalShieldProgress) window.digitalShieldProgress.startModule(3);
                this.showSection('training-phase-1');
                this.updateProgress(2);
                break;
            case 'complete-phase': this.completePhase(parseInt(dataset.phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
        }
    },

    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) { // 6 steps total now
        const percentage = Math.round(((step - 1) / 6) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    completePhase(phase) {
        this.updateProgress(phase + 2);
        const nextPhase = phase + 1;
        this.showSection(`training-phase-${nextPhase}`);
        
        if (nextPhase === 2) this.renderURLDetectiveGame();
        if (nextPhase === 3) this.renderCertificateInspector();
        if (nextPhase === 4) this.renderRedFlagHunt();
        if (nextPhase > 4) this.renderAssessment();
    },

    renderURLDetectiveGame() { /* ... (This function is unchanged) ... */ },
    selectURL(el) { /* ... (This function is unchanged) ... */ },
    placeURL(zone) { /* ... (This function is unchanged) ... */ },

    renderCertificateInspector() {
        this.certificatesDecided = 0;
        const container = document.getElementById('certificate-examples');
        container.innerHTML = this.certificates.map((cert, i) => `
            <div class="certificate-card" data-index="${i}">
                <div class="certificate-header">
                    <div class="cert-icon ${cert.valid ? 'valid' : 'invalid'}">${cert.valid ? '🔒' : '⚠️'}</div>
                    <div><h4>${cert.domain}</h4><p>Should you trust this website?</p></div>
                </div>
                <div class="cert-details"><p>${cert.expl}</p></div>
                <div class="cert-decision">
                    <button class="btn btn-secondary">Trust</button>
                    <button class="btn btn-secondary">Do Not Trust</button>
                </div>
            </div>`).join('');
        container.addEventListener('click', e => {
            const card = e.target.closest('.certificate-card');
            const button = e.target.closest('button');
            if (card && button && !card.classList.contains('revealed')) {
                const decision = button.textContent.includes('Trust');
                this.decideCertificate(card, decision);
            }
        });
    },

    decideCertificate(card, userTrusts) {
        card.classList.add('revealed');
        const certData = this.certificates[card.dataset.index];
        const feedback = document.getElementById('cert-feedback');
        const correctDecision = (userTrusts === certData.valid);

        if (correctDecision) {
            feedback.textContent = certData.expl;
            feedback.className = 'feedback-box correct';
        } else {
            feedback.textContent = `Incorrect. This certificate was ${certData.valid ? 'VALID' : 'INVALID'}. Let's review why...`;
            feedback.className = 'feedback-box incorrect';
        }

        this.certificatesDecided++;
        if (this.certificatesDecided === this.certificates.length) {
            document.getElementById('phase-3-btn').disabled = false;
        }
    },

    renderRedFlagHunt() {
        this.redFlagsFound = 0;
        const info = this.redFlagWebsite;
        document.getElementById('total-flags').textContent = info.totalFlags;
        const container = document.getElementById('website-image-container');
        container.innerHTML = `
            <img src="${info.image}" alt="Fake Website Screenshot" class="website-screenshot">
            ${info.redFlags.map(flag => `<div class="red-flag-hotspot" data-id="${flag.id}" style="left:${flag.x}%; top:${flag.y}%; width:${flag.width}%; height:${flag.height}%;"></div>`).join('')}
        `;
        container.addEventListener('click', e => {
            const hotspot = e.target.closest('.red-flag-hotspot');
            if (hotspot && !hotspot.classList.contains('found')) {
                hotspot.classList.add('found');
                const flagData = info.redFlags.find(f => f.id === hotspot.dataset.id);
                document.getElementById('redflag-feedback').textContent = flagData.expl;
                document.getElementById('redflag-feedback').className = 'feedback-box correct';
                this.redFlagsFound++;
                document.getElementById('flags-found').textContent = this.redFlagsFound;
                if (this.redFlagsFound === info.totalFlags) {
                    document.getElementById('phase-4-btn').disabled = false;
                }
            }
        });
    },

    renderAssessment() { /* ... (This function is unchanged) ... */ },
    renderNextAssessmentQuestion() { /* ... (This function is unchanged) ... */ },
    answerAssessment(selectedIndex) { /* ... (This function is unchanged) ... */ },
    showAssessmentResults() { /* ... (This function is unchanged) ... */ },
    completeModule() { /* ... (This function is unchanged) ... */ }
};

// --- Helper Functions (pasted from previous correct versions) ---
module3Manager.renderURLDetectiveGame = function() { this.correctlySorted = 0; const pool = document.getElementById('url-sorting-pool'); pool.innerHTML = this.urlExamples.map((item, i) => `<div class="url-item" data-index="${i}">${item.url}</div>`).join(''); pool.addEventListener('click', e => { if (e.target.classList.contains('url-item')) this.selectURL(e.target); }); document.querySelectorAll('.url-drop-zone').forEach(zone => { zone.onclick = (e) => this.placeURL(e.currentTarget); }); };
module3Manager.selectURL = function(el) { if (this.selectedURL) this.selectedURL.classList.remove('selected'); this.selectedURL = el; el.classList.add('selected'); document.getElementById('url-feedback').textContent = "Now click a category box to place it."; };
module3Manager.placeURL = function(zone) { if (!this.selectedURL) return; const chosenCat = zone.dataset.category; const urlData = this.urlExamples[this.selectedURL.dataset.index]; const feedback = document.getElementById('url-feedback'); if (chosenCat === urlData.cat) { feedback.textContent = urlData.expl; feedback.className = 'feedback-box correct'; this.selectedURL.classList.add('correct'); zone.querySelector('.url-list').innerHTML += `<li>${this.selectedURL.textContent}</li>`; this.selectedURL = null; this.correctlySorted++; if (this.correctlySorted === this.urlExamples.length) { document.getElementById('phase-2-btn').disabled = false; } } else { feedback.textContent = `Incorrect. Think carefully about the URL structure.`; feedback.className = 'feedback-box incorrect'; } };
module3Manager.renderAssessment = function() { this.currentAssessmentQuestion = 0; this.assessmentScore = 0; this.renderNextAssessmentQuestion(); };
module3Manager.renderNextAssessmentQuestion = function() { const challengesContainer = document.getElementById('assessment-challenges'); if (this.currentAssessmentQuestion >= this.assessmentQuestions.length) { this.showAssessmentResults(); return; } const q = this.assessmentQuestions[this.currentAssessmentQuestion]; challengesContainer.innerHTML = `<div class="challenge-card"><h4>Question ${this.currentAssessmentQuestion + 1}/${this.assessmentQuestions.length}: ${q.q}</h4><div class="challenge-options">${q.opts.map((opt, i) => `<button data-index="${i}" class="btn btn-secondary">${opt}</button>`).join('')}</div><div class="challenge-result"></div></div>`; challengesContainer.querySelector('.challenge-options').onclick = (e) => { if(e.target.tagName === 'BUTTON') this.answerAssessment(parseInt(e.target.dataset.index)); }; };
module3Manager.answerAssessment = function(selectedIndex) { const q = this.assessmentQuestions[this.currentAssessmentQuestion]; const resultDiv = document.querySelector('.challenge-result'); document.querySelectorAll('.challenge-options button').forEach(b => b.disabled = true); if (selectedIndex === q.correct) { this.assessmentScore++; resultDiv.innerHTML = `<p style="color:var(--success-color)">✅ Correct! ${q.expl}</p>`; } else { resultDiv.innerHTML = `<p style="color:var(--danger-color)">❌ Incorrect. ${q.expl}</p>`; } this.currentAssessmentQuestion++; setTimeout(() => this.renderNextAssessmentQuestion(), 3000); };
module3Manager.showAssessmentResults = function() { const score = this.assessmentScore; const total = this.assessmentQuestions.length; const passed = score / total >= 0.75; let badgeHTML = ''; if (passed) { badgeHTML = `<img src="images/certificates/badge-internet-expert.png" alt="Internet Expert Badge" class="completion-badge">`; if (window.digitalShieldProgress) window.digitalShieldProgress.awardBadge(3, 'Digital Navigator'); } this.dom.assessmentWrapper.innerHTML = `<div class="section-header"><h2>ASSESSMENT COMPLETE</h2></div><div class="assessment-completion">${badgeHTML}<h3 class="final-score">You scored: ${score}/${total}</h3><p class="final-status ${passed ? 'passed' : 'failed'}">Status: ${passed ? 'PASSED' : 'FAILED'}</p><p>${passed ? 'Excellent work, Agent!' : 'Review the material and try again.'}</p><button data-action="${passed ? 'complete-module' : 'redo-training'}" class="btn btn-secondary">${passed ? 'COMPLETE MODULE' : 'REDO TRAINING'}</button></div>`; };
module3Manager.completeModule = function() { if (window.digitalShieldProgress) { const finalScore = Math.round((this.assessmentScore / this.assessmentQuestions.length) * 100); window.digitalShieldProgress.completeModule(3, finalScore); } alert('Module 3 complete! Progress saved. Returning to Mission Control.'); window.location.href = 'index.html'; };

document.addEventListener('DOMContentLoaded', () => {
    module3Manager.init();
});
