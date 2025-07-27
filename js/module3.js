/**
 * js/module3.js - FINALIZED & CLEANED
 */
const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesDecided: 0,
    currentWebsiteIndex: 0,
    assessmentScore: 0,
    currentAssessmentQuestion: 0,

    urlExamples: [
        { url: "https://www.hilltophoney.co.uk/contact", cat: "safe", expl: "Correct! HTTPS and the official domain are good signs." },
        { url: "http://hilltop-honey-suppliers.net/login", cat: "suspicious", expl: "Correct! HTTP is not secure and '.net' is not our official domain for suppliers." },
        { url: "https://hiltophoney.tk/urgent-payment", cat: "dangerous", expl: "Correct! Misspelled domain ('hiltop') and a .tk extension are major red flags." },
        { url: "https://royalmail.com/track-and-trace", cat: "safe", expl: "Correct! A legitimate, secure URL for a known service." }
    ],
    certificates: [
        { domain: "hilltophoney.co.uk", valid: true, expl: "This is a valid certificate. It's issued by a trusted authority (e.g., Let's Encrypt) and the domain name matches exactly." },
        { domain: "hiltop-honey.net", valid: false, expl: "This is an invalid certificate. A 'self-signed' certificate means it wasn't verified by a trusted authority and should not be trusted for business." },
        { domain: "suppliers.hilltophoney.co.uk", valid: true, expl: "This is a valid certificate for a proper subdomain. It is secure." },
        { domain: "payment-update.hilltop.com", valid: false, expl: "This is an invalid certificate due to a domain mismatch. The certificate is for `hilltop.com`, not the full subdomain, which is a major red flag." }
    ],
    redFlagWebsites: [
        {
            image: "images/module3/fake-supplier-site.jpg",
            redFlags: [
                { id: "url", x: 10, y: 5, width: 65, height: 7, expl: "Spotted! The URL uses HTTP (not secure) and a suspicious '.tk' domain." },
                { id: "logo", x: 40, y: 24, width: 20, height: 12, expl: "Good catch! A blurry, low-quality, or incorrect logo is a sign of a fake site." },
                { id: "urgent", x: 25, y: 50, width: 50, height: 8, expl: "Excellent! Urgent language is a classic tactic to make you act without thinking." },
                { id: "download", x: 34, y: 78, width: 32, height: 8, expl: "Perfect! Never download unexpected '.exe' files from a website." }
            ]
        },
        {
            image: "images/module3/fake-software-site.jpg", 
            redFlags: [
                { id: "cert-warning", x: 5, y: 3, width: 90, height: 7, expl: "Correct! A browser certificate warning should never be ignored." },
                { id: "contradiction", x: 25, y: 35, width: 50, height: 10, expl: "'Free Premium Software' is a red flag. Legitimate premium software is rarely free." },
                { id: "personal-info", x: 60, y: 50, width: 35, height: 25, expl: "Good eye! Asking for personal information for a simple download is suspicious." },
                { id: "exe-direct", x: 30, y: 80, width: 40, height: 8, expl: "Correct! A direct download link to an '.exe' file is very risky." }
            ]
        },
        {
            image: "images/module3/fake-payment-site.jpg",
            redFlags: [
                { id: "complex-url", x: 15, y: 8, width: 60, height: 6, expl: "Spotted! This complex URL is designed to look official but is not." },
                { id: "poor-design", x: 10, y: 25, width: 80, height: 60, expl: "Correct! Poor grammar, blurry images, and unprofessional design are all warning signs." }
            ]
        }
    ],
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
            case 'next-website': this.renderNextWebsite(); break;
            case 'redo-training': window.location.reload(); break;
        }
    },

    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const totalSteps = 6; // Briefing, P1, P2, P3, P4, Assessment
        const percentage = Math.round(((step - 1) / totalSteps) * 100);
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

    renderURLDetectiveGame() {
        this.correctlySorted = 0;
        const pool = document.getElementById('url-sorting-pool');
        if(!pool) return;
        pool.innerHTML = this.urlExamples.map((item, i) => `<div class="url-item" data-index="${i}">${item.url}</div>`).join('');
        pool.addEventListener('click', e => {
            if (e.target.classList.contains('url-item')) this.selectURL(e.target);
        });
        document.querySelectorAll('.url-drop-zone').forEach(zone => {
            zone.onclick = (e) => this.placeURL(e.currentTarget);
        });
    },

    selectURL(el) {
        const selected = document.querySelector('.url-item.selected');
        if (selected) selected.classList.remove('selected');
        this.selectedURL = el;
        el.classList.add('selected');
        document.getElementById('url-feedback').textContent = "Now click a category box to place it.";
    },

    placeURL(zone) {
        if (!this.selectedURL) return;
        const chosenCat = zone.dataset.category;
        const urlData = this.urlExamples[this.selectedURL.dataset.index];
        const feedback = document.getElementById('url-feedback');
        if (chosenCat === urlData.cat) {
            feedback.textContent = urlData.expl;
            feedback.className = 'feedback-box correct';
            this.selectedURL.classList.add('correct');
            zone.querySelector('.url-list').innerHTML += `<li>${this.selectedURL.textContent}</li>`;
            this.selectedURL = null;
            this.correctlySorted++;
            if (this.correctlySorted === this.urlExamples.length) {
                document.getElementById('phase-2-btn').disabled = false;
            }
        } else {
            feedback.textContent = `Incorrect. Think carefully about the URL structure.`;
            feedback.className = 'feedback-box incorrect';
        }
    },

    renderCertificateInspector() {
        this.certificatesDecided = 0;
        const container = document.getElementById('certificate-examples');
        if(!container) return;
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
            feedback.textContent = `✅ CORRECT! ${certData.expl}`;
            feedback.className = 'feedback-box correct';
        } else {
            feedback.textContent = `❌ INCORRECT. Let's review why: ${certData.expl}`;
            feedback.className = 'feedback-box incorrect';
        }
        this.certificatesDecided++;
        if (this.certificatesDecided === this.certificates.length) {
            document.getElementById('phase-3-btn').disabled = false;
        }
    },

    renderRedFlagHunt() {
        this.currentWebsiteIndex = 0;
        this.renderNextWebsite();
    },
    
    renderNextWebsite() {
        const info = this.redFlagWebsites[this.currentWebsiteIndex];
        if (!info) return;

        document.getElementById('current-website').textContent = `${this.currentWebsiteIndex + 1} / ${this.redFlagWebsites.length}`;
        document.getElementById('flags-found').textContent = 0;
        document.getElementById('total-flags').textContent = info.redFlags.length;
        document.getElementById('next-website-btn').style.display = 'none';

        const container = document.getElementById('website-image-container');
        container.innerHTML = `
            <img src="${info.image}" alt="Fake Website Screenshot" class="website-screenshot">
            ${info.redFlags.map(flag => `<div class="red-flag-hotspot" data-id="${flag.id}" style="left:${flag.x}%; top:${flag.y}%; width:${flag.width}%; height:${flag.height}%;"></div>`).join('')}
        `;
        
        let flagsFoundOnThisSite = 0;
        container.onclick = (e) => {
            const hotspot = e.target.closest('.red-flag-hotspot');
            if (hotspot && !hotspot.classList.contains('found')) {
                hotspot.classList.add('found');
                const flagData = info.redFlags.find(f => f.id === hotspot.dataset.id);
                document.getElementById('redflag-feedback').innerHTML = `<p style="color:var(--success-color)">Spotted!</p><p>${flagData.expl}</p>`;
                flagsFoundOnThisSite++;
                document.getElementById('flags-found').textContent = flagsFoundOnThisSite;

                if (flagsFoundOnThisSite === info.redFlags.length) {
                    if (this.currentWebsiteIndex < this.redFlagWebsites.length - 1) {
                         document.getElementById('next-website-btn').style.display = 'block';
                    } else {
                         document.getElementById('redflag-feedback').textContent = "Excellent! All red flags on all sites found.";
                         document.getElementById('phase-4-btn').disabled = false;
                    }
                }
            }
        };
        this.currentWebsiteIndex++;
    },

    renderAssessment() {
        this.currentAssessmentQuestion = 0;
        this.assessmentScore = 0;
        this.renderNextAssessmentQuestion();
    },
    
    renderNextAssessmentQuestion() {
        const challengesContainer = document.getElementById('assessment-challenges');
        if (!challengesContainer) return;
        if (this.currentAssessmentQuestion >= this.assessmentQuestions.length) {
            this.showAssessmentResults();
            return;
        }
        const q = this.assessmentQuestions[this.currentAssessmentQuestion];
        challengesContainer.innerHTML = `
            <div class="challenge-card">
                <h4>Question ${this.currentAssessmentQuestion + 1}/${this.assessmentQuestions.length}: ${q.q}</h4>
                <div class="challenge-options">
                    ${q.opts.map((opt, i) => `<button data-index="${i}" class="btn btn-secondary">${opt}</button>`).join('')}
                </div>
                <div class="challenge-result"></div>
            </div>`;
        challengesContainer.querySelector('.challenge-options').onclick = (e) => {
            if(e.target.tagName === 'BUTTON') this.answerAssessment(parseInt(e.target.dataset.index));
        };
    },
    
    answerAssessment(selectedIndex) {
        const q = this.assessmentQuestions[this.currentAssessmentQuestion];
        const resultDiv = document.querySelector('.challenge-result');
        document.querySelectorAll('.challenge-options button').forEach(b => b.disabled = true);
        if (selectedIndex === q.correct) {
            this.assessmentScore++;
            resultDiv.innerHTML = `<p style="color:var(--success-color)">✅ Correct! ${q.expl}</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color:var(--danger-color)">❌ Incorrect. ${q.expl}</p>`;
        }
        this.currentAssessmentQuestion++;
        setTimeout(() => this.renderNextAssessmentQuestion(), 3000);
    },
    
    showAssessmentResults() {
        const score = this.assessmentScore;
        const total = this.assessmentQuestions.length;
        const passed = score / total >= 0.75;
        let badgeHTML = '';
        if (passed) {
            badgeHTML = `<img src="images/certificates/badge-internet-expert.png" alt="Internet Expert Badge" class="completion-badge">`;
            if (window.digitalShieldProgress) window.digitalShieldProgress.awardBadge(3, 'Digital Navigator');
        }
        this.dom.assessmentWrapper.innerHTML = `
            <div class="section-header"><h2>ASSESSMENT COMPLETE</h2></div>
            <div class="assessment-completion">
                ${badgeHTML}
                <h3 class="final-score">You scored: ${score}/${total}</h3>
                <p class="final-status ${passed ? 'passed' : 'failed'}">Status: ${passed ? 'PASSED' : 'FAILED'}</p>
                <p>${passed ? 'Excellent work, Agent!' : 'Review the material and try again.'}</p>
                <button data-action="${passed ? 'complete-module' : 'redo-training'}" class="btn btn-secondary">${passed ? 'COMPLETE MODULE' : 'REDO TRAINING'}</button>
            </div>`;
    },
    
    completeModule() {
        if (window.digitalShieldProgress) {
            const finalScore = Math.round((this.assessmentScore / this.assessmentQuestions.length) * 100);
            window.digitalShieldProgress.completeModule(3, finalScore);
        }
        alert('Module 3 complete! Progress saved. Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    module3Manager.init();
});
