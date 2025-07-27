/**
 * js/module3.js - CORRECTED VERSION
 *
 * - FIXED: Red Flag Hunt coordinates updated to match requirements
 * - FIXED: Certificate Inspector now uses correct property name
 * - FIXED: Third website now shows up properly
 * - All functionality is complete and working
 */
const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    certificatesDecided: 0,
    currentWebsiteIndex: 0,
    assessmentScore: 0,
    currentAssessmentQuestion: 0,

    // Full list of 8 URL examples
    urlExamples: [
        { url: "https://www.hilltophoney.co.uk/contact", cat: "safe", expl: "Correct! HTTPS and the official domain are good signs." },
        { url: "http://hilltop-honey-suppliers.net/login", cat: "suspicious", expl: "Correct! HTTP is not secure and '.net' is not our official domain for suppliers." },
        { url: "https://hiltophoney.tk/urgent-payment", cat: "dangerous", expl: "Correct! Misspelled domain ('hiltop') and a .tk extension are major red flags." },
        { url: "https://royalmail.com/track-and-trace", cat: "safe", expl: "Correct! A legitimate, secure URL for a known service." },
        { url: "http://192.168.4.23/downloads/update.exe", cat: "dangerous", expl: "Correct! A direct IP address URL for an .exe download is extremely dangerous." },
        { url: "https://www.amazon-deals.org", cat: "suspicious", expl: "Correct! While it has HTTPS, 'amazon-deals.org' is not the real Amazon domain." },
        { url: "https://hilltop-honey.co.uk-security.tk", cat: "dangerous", expl: "Correct! This is a subdomain hijacking attempt where the real domain is '.tk'."},
        { url: "https://www.gov.uk/business-support", cat: "safe", expl: "Correct! Official government websites are trustworthy." }
    ],
    
    // Certificate data
    certificates: [
        { domain: "hilltophoney.co.uk", valid: true, issuer: "Let's Encrypt Authority", expiry: "Valid", expl: "This is a VALID certificate. It's issued by a trusted authority and the domain name matches exactly." },
        { domain: "hiltop-honey.net", valid: false, issuer: "Self-signed", expiry: "Invalid", expl: "This is an INVALID certificate. A 'self-signed' certificate means it wasn't verified by a trusted authority and should not be trusted for business." },
        { domain: "suppliers.hilltophoney.co.uk", valid: true, issuer: "DigiCert Inc", expiry: "Valid", expl: "This is a VALID certificate for a proper subdomain. It is secure." },
        { domain: "hilltophoney.tk", valid: false, issuer: "Unknown Authority", expiry: "Expired", expl: "This is a DANGEROUS certificate. It is expired and from an untrusted source." }
    ],
    
    // CORRECTED: Red Flag Hunt data with accurate coordinates based on images
    redFlagWebsites: [
        {
            image: "images/module3/fake-supplier-site.jpg",
            redFlags: [
                { id: "url", x: 15, y: 6, width: 35, height: 6, expl: "Spotted! The URL uses HTTP and a suspicious '.tk' domain." },
                { id: "logo", x: 35, y: 20, width: 30, height: 15, expl: "Good catch! The 'HoneySuppliers.tk' logo reveals the fake domain." },
                { id: "verification", x: 20, y: 55, width: 60, height: 10, expl: "Excellent! This fake 'verification' message is designed to build false trust." },
                { id: "download", x: 30, y: 80, width: 40, height: 8, expl: "Perfect! Never download unexpected files from suspicious websites." }
            ]
        },
        {
            image: "images/module3/fake-software-site.jpg", 
            redFlags: [
                { id: "cert-warning", x: 0, y: 3, width: 100, height: 8, expl: "Correct! A browser certificate warning should never be ignored." },
                { id: "banner", x: 15, y: 35, width: 70, height: 15, expl: "Good eye! 'Free Premium Software' is contradictory and suspicious." },
                { id: "input-fields", x: 20, y: 60, width: 60, height: 20, expl: "Spotted! Asking for company and bank details for 'free' software is a major red flag." },
                { id: "download-button", x: 55, y: 85, width: 25, height: 10, expl: "Correct! A suspicious download button on an untrusted site is dangerous." }
            ]
        },
        {
            image: "images/module3/fake-payment-site.jpg",
            redFlags: [
                { id: "complex-url", x: 15, y: 5, width: 60, height: 6, expl: "Spotted! This complex URL is designed to look official but is not." },
                { id: "poor-design", x: 10, y: 25, width: 80, height: 60, expl: "Correct! Poor grammar, blurry images, and unprofessional design are all warning signs." },
                { id: "urgent-message", x: 20, y: 88, width: 60, height: 10, expl: "Well done! Urgent payment demands are a classic phishing tactic." }
            ]
        }
    ],
    
    assessmentQuestions: [
        { q: "Evaluate this URL: https://organic-honey-suppliers.co.uk", opts: ["Safe to proceed", "Suspicious - verify independently", "Dangerous - obvious phishing"], correct: 1, expl: "Correct. While it seems safe, new supplier sites must always be independently verified first." },
        { q: "Which download source is safest?", opts: ["http://free-accounting.net/download.exe", "https://www.sage.com/en-gb/products/", "A link from a tech blog review"], correct: 1, expl: "Correct. Always download from the official vendor website (Sage.com)." },
        { q: "Your browser shows a certificate warning. What do you do?", opts: ["Click 'Proceed anyway'", "Close the tab and report to IT", "Try accessing via HTTP"], correct: 1, expl: "Correct. Never ignore certificate warnings. Report it." },
        { q: "What is wrong with this URL: `https://hilltophoney.co.uk.security-check.com`?", opts: ["Nothing, it's a secure link", "The real domain is `security-check.com`", "It should use HTTP, not HTTPS"], correct: 1, expl: "Correct. The real domain is 'security-check.com', which is trying to impersonate us." }
    ],
    dom: {},

    init() {
        console.log('Module 3 Manager initializing...');
        this.cacheDOMElements();
        this.bindEvents();
        this.updateProgress(1);
        
        // Ensure all required elements exist
        const requiredElements = [
            'url-sorting-pool', 'certificate-examples', 'website-image-container',
            'assessment-challenges', 'module-progress', 'assessment-wrapper'
        ];
        
        requiredElements.forEach(id => {
            if (!document.getElementById(id)) {
                console.warn(`Required element missing: ${id}`);
            }
        });
        
        console.log('Module 3 Manager initialized');
    },

    cacheDOMElements() {
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.assessmentWrapper = document.getElementById('assessment-wrapper');
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' && e.target.dataset.action) {
                e.preventDefault();
                this.handleAction(e.target.dataset);
            }
        });
    },

    handleAction(dataset) {
        switch (dataset.action) {
            case 'return-home':
                window.location.href = 'index.html';
                break;
            case 'start-training':
                if (window.digitalShieldProgress) window.digitalShieldProgress.startModule(3);
                this.showSection('training-phase-1');
                this.updateProgress(2);
                break;
            case 'complete-phase':
                this.completePhase(parseInt(dataset.phase, 10));
                break;
            case 'complete-module':
                this.completeModule();
                break;
            case 'next-website':
                // Increment the index before rendering the next website
                this.currentWebsiteIndex++;
                this.renderNextWebsite();
                break;
            case 'redo-training':
                window.location.reload();
                break;
        }
    },

    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const totalSteps = 7;
        const percentage = Math.round(((step - 1) / (totalSteps - 1)) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    completePhase(phase) {
        console.log('Completing phase:', phase);
        this.updateProgress(phase + 2);
        const nextPhase = phase + 1;
        this.showSection(`training-phase-${nextPhase}`);
        
        if (nextPhase === 2) {
            console.log('Starting URL Detective Game');
            this.renderURLDetectiveGame();
        }
        if (nextPhase === 3) {
            console.log('Starting Certificate Inspector');
            this.renderCertificateInspector();
        }
        if (nextPhase === 4) {
            console.log('Starting Red Flag Hunt');
            this.renderRedFlagHunt();
        }
        if (nextPhase === 5) {
            console.log('Starting Assessment');
            this.renderAssessment();
        }
    },

    renderURLDetectiveGame() {
        this.correctlySorted = 0;
        const pool = document.getElementById('url-sorting-pool');
        if (!pool) return;
        pool.innerHTML = this.urlExamples.map((item, i) => 
            `<div class="url-item" data-index="${i}">${item.url}</div>`
        ).join('');
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
            this.selectedURL.remove();
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
        if (!container) return;
        container.innerHTML = this.certificates.map((cert, i) => `
            <div class="certificate-card" data-index="${i}">
                <div class="certificate-header">
                    <div class="cert-icon ${cert.valid ? 'valid' : 'invalid'}">${cert.valid ? '🔒' : '⚠️'}</div>
                    <div><h4>${cert.domain}</h4><p>Should you trust this website?</p></div>
                </div>
                <div class="cert-details">
                    <p><strong>Issuer:</strong> ${cert.issuer}<br><strong>Status:</strong> ${cert.expiry}</p>
                </div>
                <div class="cert-decision">
                    <button class="btn btn-secondary">Trust</button>
                    <button class="btn btn-secondary">Do Not Trust</button>
                </div>
            </div>`).join('');
        container.addEventListener('click', e => {
            const card = e.target.closest('.certificate-card');
            const button = e.target.closest('button');
            if (card && button && !card.classList.contains('revealed')) {
                const decision = button.textContent.includes('Trust') && !button.textContent.includes('Not');
                this.decideCertificate(card, decision);
            }
        });
    },

    decideCertificate(card, userTrusts) {
        card.classList.add('revealed');
        const certData = this.certificates[card.dataset.index];
        const feedback = document.getElementById('cert-feedback');
        const correctDecision = (userTrusts === certData.valid);
        
        // FIXED: Using correct property name 'expl' instead of 'explanation'
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
        console.log('Starting Red Flag Hunt');
        this.currentWebsiteIndex = 0;
        this.renderNextWebsite();
    },
    
    renderNextWebsite() {
        // Use the current index without incrementing yet
        const info = this.redFlagWebsites[this.currentWebsiteIndex];
        if (!info) {
            console.error('No website found at index:', this.currentWebsiteIndex);
            return;
        }
        
        document.getElementById('current-website').textContent = `${this.currentWebsiteIndex + 1} / ${this.redFlagWebsites.length}`;
        document.getElementById('flags-found').textContent = 0;
        document.getElementById('total-flags').textContent = info.redFlags.length;
        document.getElementById('next-website-btn').style.display = 'none';
        document.getElementById('redflag-feedback').textContent = "Click on anything that looks suspicious or dangerous on the website.";
        
        const container = document.getElementById('website-image-container');
        container.innerHTML = `
            <img src="${info.image}" alt="Fake Website Screenshot" class="website-screenshot">
            ${info.redFlags.map(flag => 
                `<div class="red-flag-hotspot" data-id="${flag.id}" 
                      style="left:${flag.x}%; top:${flag.y}%; width:${flag.width}%; height:${flag.height}%;"></div>`
            ).join('')}`;
        
        let flagsFoundOnThisSite = 0;
        container.onclick = (e) => {
            const hotspot = e.target.closest('.red-flag-hotspot');
            if (hotspot && !hotspot.classList.contains('found')) {
                hotspot.classList.add('found');
                const flagData = info.redFlags.find(f => f.id === hotspot.dataset.id);
                document.getElementById('redflag-feedback').innerHTML = 
                    `<p style="color:var(--success-color)">Spotted!</p><p>${flagData.expl}</p>`;
                flagsFoundOnThisSite++;
                document.getElementById('flags-found').textContent = flagsFoundOnThisSite;
                
                if (flagsFoundOnThisSite === info.redFlags.length) {
                    // All flags found on this website
                    if (this.currentWebsiteIndex < this.redFlagWebsites.length - 1) {
                        // More websites to go
                        const nextBtn = document.getElementById('next-website-btn');
                        if (nextBtn) {
                            nextBtn.style.display = 'block';
                            // Ensure the button has the correct data-action
                            nextBtn.setAttribute('data-action', 'next-website');
                        }
                        document.getElementById('redflag-feedback').innerHTML += 
                            '<p>Great job! Click "Next Website" to continue.</p>';
                    } else {
                        // This was the last website
                        document.getElementById('redflag-feedback').innerHTML = 
                            '<p style="color:var(--success-color)">Excellent! All red flags on all sites found.</p>';
                        const phase4Btn = document.getElementById('phase-4-btn');
                        if (phase4Btn) {
                            phase4Btn.disabled = false;
                        } else {
                            console.error('Phase 4 button not found!');
                        }
                    }
                }
            }
        };
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
            if (e.target.tagName === 'BUTTON') {
                this.answerAssessment(parseInt(e.target.dataset.index));
            }
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
            if (window.digitalShieldProgress) {
                window.digitalShieldProgress.awardBadge(3, 'Digital Navigator');
            }
        }
        
        this.dom.assessmentWrapper.innerHTML = `
            <div class="section-header"><h2>ASSESSMENT COMPLETE</h2></div>
            <div class="assessment-completion">
                ${badgeHTML}
                <h3 class="final-score">You scored: ${score}/${total}</h3>
                <p class="final-status ${passed ? 'passed' : 'failed'}">Status: ${passed ? 'PASSED' : 'FAILED'}</p>
                <p>${passed ? 'Excellent work, Agent!' : 'Review the material and try again.'}</p>
                <button data-action="${passed ? 'complete-module' : 'redo-training'}" class="btn btn-secondary">
                    ${passed ? 'COMPLETE MODULE' : 'REDO TRAINING'}
                </button>
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
