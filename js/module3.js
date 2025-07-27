/**
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
    
    certificates: [
        {
            domain: "hilltophoney.co.uk",
            valid: true,
            explanation: "This is a valid certificate. It's issued by a trusted authority (e.g., Let's Encrypt) and the domain name matches exactly."
        },
        {
            domain: "hiltop-honey.net",
            valid: false,
            explanation: "This is an invalid certificate. A 'self-signed' certificate means it wasn't verified by a trusted authority and should not be trusted for business."
        },
        {
            domain: "suppliers.hilltophoney.co.uk",
            valid: true,
            explanation: "This is a valid certificate for a proper subdomain. It is secure."
        },
        {
            domain: "payment-update.hilltop.com",
            valid: false,
            explanation: "This is an invalid certificate due to a domain mismatch. The certificate is for `hilltop.com`, not the full subdomain, which is a major red flag."
        }
    ],

    redFlagWebsites: [
        {
            image: "images/module3/fake-supplier-site.jpg",
            redFlags: [
                {
                    id: "url",
                    x: 10, y: 5,
                    width: 65, height: 7,
                    explanation: "Spotted! The URL uses HTTP (not secure) and a suspicious '.tk' domain."
                },
                {
                    id: "logo",
                    x: 40, y: 24,
                    width: 20, height: 12,
                    explanation: "Good catch! A blurry, low-quality, or incorrect logo is a sign of a fake site."
                },
                {
                    id: "urgent",
                    x: 25, y: 50,
                    width: 50, height: 8,
                    explanation: "Excellent! Urgent language is a classic tactic to make you act without thinking."
                },
                {
                    id: "download",
                    x: 34, y: 78,
                    width: 32, height: 8,
                    explanation: "Perfect! Never download unexpected '.exe' files from a website."
                }
            ]
        },
        {
            image: "images/module3/fake-software-site.jpg", 
            redFlags: [
                {
                    id: "cert-warning",
                    x: 5, y: 3,
                    width: 90, height: 7,
                    explanation: "Correct! A browser certificate warning should never be ignored."
                },
                {
                    id: "contradiction",
                    x: 25, y: 35,
                    width: 50, height: 10,
                    explanation: "'Free Premium Software' is a red flag. Legitimate premium software is rarely free."
                },
                {
                    id: "personal-info",
                    x: 60, y: 50,
                    width: 35, height: 25,
                    explanation: "Good eye! Asking for personal information for a simple download is suspicious."
                },
                {
                    id: "exe-direct",
                    x: 30, y: 80,
                    width: 40, height: 8,
                    explanation: "Correct! A direct download link to an '.exe' file is very risky."
                }
            ]
        },
        {
            image: "images/module3/fake-payment-site.jpg",
            redFlags: [
                {
                    id: "complex-url",
                    x: 15, y: 8,
                    width: 60, height: 6,
                    explanation: "Spotted! This complex URL is designed to look official but is not."
                },
                {
                    id: "poor-design",
                    x: 10, y: 25,
                    width: 80, height: 60,
                    explanation: "Correct! Poor grammar, blurry images, and unprofessional design are all warning signs."
                }
            ]
        }
    ],

    assessmentQuestions: [
        {
            question: "Evaluate this URL for a new honey supplier: https://organic-honey-suppliers.co.uk",
            options: ["Safe to proceed", "Suspicious - verify independently", "Dangerous - obvious phishing"],
            correct: 1,
            explanation: "Correct. While it seems safe, new supplier sites must always be independently verified first."
        },
        {
            question: "You need accounting software. Which download source is safest?",
            options: ["http://free-accounting.net/download.exe", "https://www.sage.com/en-gb/products/", "A link from a tech blog review"],
            correct: 1,
            explanation: "Correct. Always download from the official vendor website (Sage.com)."
        },
        {
            question: "Your browser shows a certificate warning for a supplier's website. What do you do?",
            options: ["Click 'Proceed anyway'", "Close the tab and report to IT", "Try accessing via HTTP"],
            correct: 1,
            explanation: "Correct. Never ignore certificate warnings. Report it."
        },
        {
            question: "An email link to 'Update Details' has this URL: 'https://hilltophoney.co.uk.security-check.com' What is it?",
            options: ["A secure link on our domain", "A dangerous phishing link", "A link to our security partner"],
            correct: 1,
            explanation: "Correct. The real domain is 'security-check.com', which is trying to impersonate us."
        }
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
        this.dom.urlFeedback = document.getElementById('url-feedback');
        this.dom.certFeedback = document.getElementById('cert-feedback');
        this.dom.redFlagFeedback = document.getElementById('redflag-feedback');
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
            case 'return-home':
                window.location.href = 'index.html';
                break;
            case 'start-training':
                if (window.digitalShieldProgress) {
                    window.digitalShieldProgress.startModule(3);
                }
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
                this.renderNextWebsite();
                break;
            case 'redo-training':
                window.location.reload();
                break;
        }
    },

    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => {
            section.classList.remove('active');
        });
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
    },

    updateProgress(step) {
        const totalSteps = 6; // Briefing, P1, P2, P3, P4, Assessment
        const percentage = Math.round(((step - 1) / (totalSteps - 1)) * 100);
        if (this.dom.moduleProgress) {
            this.dom.moduleProgress.textContent = `${percentage}%`;
        }
    },

    completePhase(phase) {
        this.updateProgress(phase + 2);
        const nextPhase = phase + 1;
        this.showSection(`training-phase-${nextPhase}`);
        
        if (nextPhase === 2) {
            this.renderURLDetectiveGame();
        }
        if (nextPhase === 3) {
            this.renderCertificateInspector();
        }
        if (nextPhase === 4) {
            this.renderRedFlagHunt();
        }
        if (nextPhase > 4) {
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
            if (e.target.classList.contains('url-item')) {
                this.selectURL(e.target);
            }
        });

        document.querySelectorAll('.url-drop-zone').forEach(zone => {
            zone.onclick = (e) => this.placeURL(e.currentTarget);
        });
    },

    selectURL(element) {
        const selected = document.querySelector('.url-item.selected');
        if (selected) {
            selected.classList.remove('selected');
        }
        this.selectedURL = element;
        element.classList.add('selected');
        
        if (this.dom.urlFeedback) {
            this.dom.urlFeedback.textContent = "Now click a category box to place it.";
        }
    },

    placeURL(zone) {
        if (!this.selectedURL) return;

        const chosenCategory = zone.dataset.category;
        const urlData = this.urlExamples[this.selectedURL.dataset.index];
        const feedback = this.dom.urlFeedback;

        if (chosenCategory === urlData.category) {
            if (feedback) {
                feedback.textContent = urlData.explanation;
                feedback.className = 'feedback-box correct';
            }
            this.selectedURL.classList.add('correct');
            
            const urlList = zone.querySelector('.url-list');
            if (urlList) {
                urlList.innerHTML += `<li>${this.selectedURL.textContent}</li>`;
            }
            
            this.selectedURL.remove();
            this.selectedURL = null;
            this.correctlySorted++;

            if (this.correctlySorted === this.urlExamples.length) {
                const phase2Btn = document.getElementById('phase-2-btn');
                if (phase2Btn) {
                    phase2Btn.disabled = false;
                }
            }
        } else {
            if (feedback) {
                feedback.textContent = "Incorrect. Think carefully about the URL structure.";
                feedback.className = 'feedback-box incorrect';
            }
        }
    },

    renderCertificateInspector() {
        this.certificatesDecided = 0;
        const container = document.getElementById('certificate-examples');
        if (!container) return;

        container.innerHTML = this.certificates.map((cert, i) => `
            <div class="certificate-card" data-index="${i}">
                <div class="certificate-header">
                    <div class="cert-icon ${cert.valid ? 'valid' : 'invalid'}">
                        ${cert.valid ? '🔒' : '⚠️'}
                    </div>
                    <div>
                        <h4>${cert.domain}</h4>
                        <p>Should you trust this website?</p>
                    </div>
                </div>
                <div class="cert-details">
                    <p>${cert.explanation}</p>
                </div>
                <div class="cert-decision">
                    <button class="btn btn-secondary">Trust</button>
                    <button class="btn btn-secondary">Do Not Trust</button>
                </div>
            </div>
        `).join('');

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
        const feedback = this.dom.certFeedback;
        const correctDecision = (userTrusts === certData.valid);

        if (feedback) {
            if (correctDecision) {
                feedback.textContent = `✅ CORRECT! ${certData.explanation}`;
                feedback.className = 'feedback-box correct';
            } else {
                feedback.textContent = `❌ INCORRECT. Let's review why: ${certData.explanation}`;
                feedback.className = 'feedback-box incorrect';
            }
        }

        this.certificatesDecided++;
        if (this.certificatesDecided === this.certificates.length) {
            const phase3Btn = document.getElementById('phase-3-btn');
            if (phase3Btn) {
                phase3Btn.disabled = false;
            }
        }
    },

    renderRedFlagHunt() {
        this.currentWebsiteIndex = 0;
        this.renderNextWebsite();
    },
    
    renderNextWebsite() {
        const info = this.redFlagWebsites[this.currentWebsiteIndex];
        if (!info) return;

        // Update display counters
        const currentWebsiteSpan = document.getElementById('current-website');
        const flagsFoundSpan = document.getElementById('flags-found');
        const totalFlagsSpan = document.getElementById('total-flags');

        if (currentWebsiteSpan) {
            currentWebsiteSpan.textContent = `${this.currentWebsiteIndex + 1} / ${this.redFlagWebsites.length}`;
        }
        if (flagsFoundSpan) {
            flagsFoundSpan.textContent = '0';
        }
        if (totalFlagsSpan) {
            totalFlagsSpan.textContent = info.redFlags.length;
        }

        const nextBtn = document.getElementById('next-website-btn');
        if (nextBtn) {
            nextBtn.style.display = 'none';
        }

        const container = document.getElementById('website-image-container');
        if (!container) return;

        container.innerHTML = `
            <img src="${info.image}" alt="Fake Website Screenshot" class="website-screenshot">
            ${info.redFlags.map(flag => 
                `<div class="red-flag-hotspot" data-id="${flag.id}" 
                    style="left:${flag.x}%; top:${flag.y}%; width:${flag.width}%; height:${flag.height}%;">
                </div>`
            ).join('')}
        `;
        
        let flagsFoundOnThisSite = 0;
        container.onclick = (e) => {
            const hotspot = e.target.closest('.red-flag-hotspot');
            if (hotspot && !hotspot.classList.contains('found')) {
                hotspot.classList.add('found');
                const flagData = info.redFlags.find(f => f.id === hotspot.dataset.id);
                
                if (this.dom.redFlagFeedback && flagData) {
                    this.dom.redFlagFeedback.innerHTML = `
                        <p style="color:var(--success-color)">Spotted!</p>
                        <p>${flagData.explanation}</p>
                    `;
                }

                flagsFoundOnThisSite++;
                if (flagsFoundSpan) {
                    flagsFoundSpan.textContent = flagsFoundOnThisSite;
                }

                if (flagsFoundOnThisSite === info.redFlags.length) {
                    if (this.currentWebsiteIndex < this.redFlagWebsites.length - 1) {
                        if (nextBtn) {
                            nextBtn.style.display = 'block';
                        }
                    } else {
                        if (this.dom.redFlagFeedback) {
                            this.dom.redFlagFeedback.textContent = "Excellent! All red flags on all sites found.";
                        }
                        const phase4Btn = document.getElementById('phase-4-btn');
                        if (phase4Btn) {
                            phase4Btn.disabled = false;
                        }
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
                <h4>Question ${this.currentAssessmentQuestion + 1}/${this.assessmentQuestions.length}: ${q.question}</h4>
                <div class="challenge-options">
                    ${q.options.map((opt, i) => 
                        `<button data-index="${i}" class="btn btn-secondary">${opt}</button>`
                    ).join('')}
                </div>
                <div class="challenge-result"></div>
            </div>
        `;

        const optionsContainer = challengesContainer.querySelector('.challenge-options');
        if (optionsContainer) {
            optionsContainer.onclick = (e) => {
                if (e.target.tagName === 'BUTTON') {
                    this.answerAssessment(parseInt(e.target.dataset.index));
                }
            };
        }
    },
    
    answerAssessment(selectedIndex) {
        const q = this.assessmentQuestions[this.currentAssessmentQuestion];
        const resultDiv = document.querySelector('.challenge-result');
        
        // Disable all buttons
        document.querySelectorAll('.challenge-options button').forEach(b => {
            b.disabled = true;
        });

        if (resultDiv) {
            if (selectedIndex === q.correct) {
                this.assessmentScore++;
                resultDiv.innerHTML = `<p style="color:var(--success-color)">✅ Correct! ${q.explanation}</p>`;
            } else {
                resultDiv.innerHTML = `<p style="color:var(--danger-color)">❌ Incorrect. ${q.explanation}</p>`;
            }
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

        if (this.dom.assessmentWrapper) {
            this.dom.assessmentWrapper.innerHTML = `
                <div class="section-header">
                    <h2>ASSESSMENT COMPLETE</h2>
                </div>
                <div class="assessment-completion">
                    ${badgeHTML}
                    <h3 class="final-score">You scored: ${score}/${total}</h3>
                    <p class="final-status ${passed ? 'passed' : 'failed'}">
                        Status: ${passed ? 'PASSED' : 'FAILED'}
                    </p>
                    <p>${passed ? 'Excellent work, Agent!' : 'Review the material and try again.'}</p>
                    <button data-action="${passed ? 'complete-module' : 'redo-training'}" class="btn btn-secondary">
                        ${passed ? 'COMPLETE MODULE' : 'REDO TRAINING'}
                    </button>
                </div>
            `;
        }
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

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    module3Manager.init();
});
