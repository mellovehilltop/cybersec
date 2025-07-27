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
    
    // CORRECTED: Red Flag Hunt data with final accurate coordinates
    redFlagWebsites: [
        {
            image: "images/module3/fake-supplier-site.jpg",
            redFlags: [
                { id: "url", x: 15, y: 6, width: 35, height: 6, expl: "Spotted! The URL uses HTTP and a suspicious '.tk' domain." },
                { id: "logo", x: 35, y: 20, width: 30, height: 15, expl: "Good catch! The 'HoneySuppliers.tk' logo reveals the fake domain." },
                { id: "verification", x: 20, y: 55, width: 60, height: 10, expl: "Excellent! This fake 'verification' message is designed to build false trust." },
                { id: "download", x: 30, y: 88, width: 40, height: 8, expl: "Perfect! Never download unexpected files from suspicious websites." }
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
                { id: "complex-url", x: 20, y: 8, width: 60, height: 6, expl: "Spotted! This complex URL is designed to look official but is not." },
                { id: "payment-portal", x: 25, y: 30, width: 50, height: 25, expl: "Good catch! This fake 'Payment Portal' header is trying to look official." },
                { id: "update-button", x: 30, y: 70, width: 40, height: 10, expl: "Well done! Clicking suspicious 'Update' buttons can lead to malware or phishing." }
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
                
                // Special handling for assessment-wrapper - create it if missing
                if (id === 'assessment-wrapper' && !document.getElementById(id)) {
                    const wrapper = document.createElement('div');
                    wrapper.id = 'assessment-wrapper';
                    wrapper.className = 'training-section';
                    wrapper.style.display = 'none';
                    document.querySelector('.module-content')?.appendChild(wrapper);
                    console.log('Created missing assessment-wrapper');
                }
            }
        });
        
        // Special handler for the assessment button if it has a specific ID
        setTimeout(() => {
            const assessBtn = document.getElementById('phase-4-btn');
            if (assessBtn) {
                console.log('Found phase-4-btn, adding direct click handler');
                assessBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Phase 4 button clicked directly');
                    this.completePhase(4);
                });
            }
        }, 1000);
        
        console.log('Module 3 Manager initialized');
    },

    cacheDOMElements() {
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.assessmentWrapper = document.getElementById('assessment-wrapper');
        
        if (!this.dom.assessmentWrapper) {
            console.warn('Assessment wrapper not found during initialization');
        }
    },

    bindEvents() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                // Check for data-action attribute
                if (e.target.dataset.action) {
                    e.preventDefault();
                    this.handleAction(e.target.dataset);
                }
                // Also check for specific button text (fallback)
                else if (e.target.textContent.includes('PROCEED TO FINAL ASSESSMENT')) {
                    e.preventDefault();
                    console.log('Final assessment button clicked');
                    this.handleAction({ action: 'complete-phase', phase: '4' });
                }
            }
        });
    },

    handleAction(dataset) {
        console.log('Handling action:', dataset);
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
                const phase = parseInt(dataset.phase, 10);
                console.log('Completing phase number:', phase);
                this.completePhase(phase);
                break;
            case 'complete-module':
                this.completeModule();
                break;
            case 'next-website':
                // Increment the index before rendering the next website
                this.currentWebsiteIndex++;
                console.log('Moving to website:', this.currentWebsiteIndex + 1);
                this.renderNextWebsite();
                break;
            case 'redo-training':
                window.location.reload();
                break;
            default:
                console.warn('Unknown action:', dataset.action);
        }
    },

    showSection(sectionId) {
        console.log('Showing section:', sectionId);
        
        // Special handling for assessment
        if (sectionId === 'training-phase-5' || sectionId === 'assessment-wrapper') {
            // Hide all training sections
            document.querySelectorAll('.training-section').forEach(section => {
                if (section.id !== 'assessment-wrapper') {
                    section.style.display = 'none';
                    section.classList.remove('active');
                }
            });
            
            // Show assessment wrapper
            const assessmentWrapper = document.getElementById('assessment-wrapper');
            if (assessmentWrapper) {
                assessmentWrapper.style.display = 'block';
                assessmentWrapper.classList.add('active');
                console.log('Assessment wrapper shown');
            } else {
                console.error('Assessment wrapper not found when trying to show it!');
            }
        } else {
            // Normal section showing
            document.querySelectorAll('.training-section').forEach(section => {
                section.classList.remove('active');
                if (section.id === sectionId) {
                    section.classList.add('active');
                }
            });
        }
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
        
        // For assessment phase, handle differently
        if (nextPhase === 5) {
            console.log('Starting Assessment - special handling');
            // Hide all training sections
            document.querySelectorAll('.training-section').forEach(section => {
                section.style.display = 'none';
            });
            // Show assessment wrapper
            const assessmentWrapper = document.getElementById('assessment-wrapper');
            if (assessmentWrapper) {
                assessmentWrapper.style.display = 'block';
                this.renderAssessment();
            } else {
                console.error('Assessment wrapper not found!');
            }
        } else {
            // Normal phase transition
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
                    `<p style="color:var(--success-color, #28a745)">Spotted!</p><p>${flagData.expl}</p>`;
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
                            '<p style="color:var(--success-color, #28a745)">Excellent! All red flags on all sites found.</p>';
                        const phase4Btn = document.getElementById('phase-4-btn');
                        if (phase4Btn) {
                            phase4Btn.disabled = false;
                            // Ensure it has the correct attributes
                            phase4Btn.setAttribute('data-action', 'complete-phase');
                            phase4Btn.setAttribute('data-phase', '4');
                            console.log('Phase 4 button enabled');
                        } else {
                            console.error('Phase 4 button not found!');
                        }
                    }
                }
            }
        };
    },

    renderAssessment() {
        console.log('Rendering assessment...');
        this.currentAssessmentQuestion = 0;
        this.assessmentScore = 0;
        
        // Try multiple ways to find the assessment wrapper
        let assessmentWrapper = this.dom.assessmentWrapper || 
                               document.getElementById('assessment-wrapper') ||
                               document.querySelector('.assessment-wrapper');
        
        // If still not found, try to find the main content area and create the wrapper
        if (!assessmentWrapper) {
            console.warn('Assessment wrapper not found, creating one...');
            const mainContent = document.querySelector('.module-content') || 
                              document.querySelector('main') || 
                              document.body;
            
            assessmentWrapper = document.createElement('div');
            assessmentWrapper.id = 'assessment-wrapper';
            assessmentWrapper.className = 'training-section active';
            mainContent.appendChild(assessmentWrapper);
        }
        
        // Clear any existing content and set up the assessment structure
        assessmentWrapper.innerHTML = `
            <div class="section-header">
                <h2>FINAL ASSESSMENT</h2>
                <p>Answer the following questions to complete Module 3</p>
            </div>
            <div id="assessment-challenges"></div>
        `;
        
        // Make sure it's visible
        assessmentWrapper.style.display = 'block';
        
        // Cache the reference
        this.dom.assessmentWrapper = assessmentWrapper;
        
        this.renderNextAssessmentQuestion();
    },

    renderNextAssessmentQuestion() {
        console.log('Rendering question:', this.currentAssessmentQuestion + 1);
        const challengesContainer = document.getElementById('assessment-challenges');
        if (!challengesContainer) {
            console.error('Assessment challenges container not found!');
            // Try to create it
            const wrapper = this.dom.assessmentWrapper || document.getElementById('assessment-wrapper');
            if (wrapper && !wrapper.querySelector('#assessment-challenges')) {
                wrapper.innerHTML += '<div id="assessment-challenges"></div>';
            }
            return;
        }
        
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
        console.log('Answer selected:', selectedIndex);
        const q = this.assessmentQuestions[this.currentAssessmentQuestion];
        const resultDiv = document.querySelector('.challenge-result');
        
        if (!resultDiv) {
            console.error('Challenge result div not found');
            return;
        }
        
        document.querySelectorAll('.challenge-options button').forEach(b => b.disabled = true);
        
        if (selectedIndex === q.correct) {
            this.assessmentScore++;
            resultDiv.innerHTML = `<p style="color:var(--success-color, #28a745)">✅ Correct! ${q.expl}</p>`;
        } else {
            resultDiv.innerHTML = `<p style="color:var(--danger-color, #dc3545)">❌ Incorrect. ${q.expl}</p>`;
        }
        
        this.currentAssessmentQuestion++;
        console.log('Moving to question:', this.currentAssessmentQuestion + 1);
        
        setTimeout(() => {
            this.renderNextAssessmentQuestion();
        }, 3000);
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
                <p class="final-status" style="color: ${passed ? 'var(--success-color, #28a745)' : 'var(--danger-color, #dc3545)'}">
                    Status: ${passed ? 'PASSED' : 'FAILED'}
                </p>
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
    },
    
    // Debug function - can be called from console
    debugStartAssessment() {
        console.log('DEBUG: Manually starting assessment');
        this.completePhase(4);
    },
    
    // Debug function to check current state
    debugState() {
        console.log('Current Module 3 State:');
        console.log('- URLs sorted:', this.correctlySorted);
        console.log('- Certificates decided:', this.certificatesDecided);
        console.log('- Current website index:', this.currentWebsiteIndex);
        console.log('- Assessment question:', this.currentAssessmentQuestion);
        console.log('- Assessment score:', this.assessmentScore);
        console.log('- DOM elements:', {
            moduleProgress: !!this.dom.moduleProgress,
            assessmentWrapper: !!this.dom.assessmentWrapper
        });
        
        // Check for important buttons
        const buttons = {
            'phase-4-btn': document.getElementById('phase-4-btn'),
            'next-website-btn': document.getElementById('next-website-btn'),
            'assessment button': document.querySelector('button[data-action="complete-phase"][data-phase="4"]'),
            'proceed button': Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('PROCEED TO FINAL ASSESSMENT'))
        };
        
        console.log('- Important buttons:', buttons);
    }
};

document.addEventListener('DOMContentLoaded', () => {
    module3Manager.init();
    
    // Make module3Manager globally accessible for debugging
    window.module3Manager = module3Manager;
    console.log('Module 3 loaded. You can use window.module3Manager.debugStartAssessment() to manually start the assessment.');
});
