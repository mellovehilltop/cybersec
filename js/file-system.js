<script>
        // File system specific functions
        function openFile(moduleNumber) {
            if (window.digitalShieldProgress && window.digitalShieldProgress.isModuleUnlocked(moduleNumber)) {
                window.location.href = `module${moduleNumber}.html`;
            } else {
                showAccessDenied();
            }
        }

        function openFinalAssessment() {
            if (window.digitalShieldProgress && window.digitalShieldProgress.getProgressStats().completedModules === 5) {
                window.location.href = 'final-assessment.html';
            } else {
                showAccessDenied();
            }
        }

        function showAccessDenied() {
            alert('🔒 ACCESS DENIED\n\nClearance level insufficient. Complete prerequisite training files to gain access.');
        }

        // Admin testing functions
        function toggleAdminPanel() {
            const panel = document.getElementById('admin-panel');
            if (panel) {
                panel.classList.toggle('hidden');
            }
        }

        function resetAllProgress() {
            if (confirm('⚠️ WARNING: This will reset ALL training progress. Are you sure?')) {
                if (window.digitalShieldProgress) {
                    window.digitalShieldProgress.resetProgress();
                    updateProgressDisplay();
                    alert('✅ All progress has been reset.');
                }
            }
        }

        function completeModule(moduleNumber) {
            if (window.digitalShieldProgress) {
                window.digitalShieldProgress.completeModule(moduleNumber, 100);
                updateProgressDisplay();
                alert(`✅ Module ${moduleNumber} marked as complete.`);
            }
        }

        // Session timer
        let sessionStartTime = Date.now();
        function updateSessionTimer() {
            const elapsed = Date.now() - sessionStartTime;
            const hours = Math.floor(elapsed / 3600000);
            const minutes = Math.floor((elapsed % 3600000) / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            
            const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            const sessionElement = document.getElementById('session-time');
            if (sessionElement) {
                sessionElement.textContent = timeString;
            }
        }

        // Update timestamp
        function updateTimestamp() {
            const now = new Date();
            const timestamp = now.toLocaleString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            const timestampElement = document.getElementById('current-timestamp');
            if (timestampElement) {
                timestampElement.textContent = timestamp;
            }
        }

        // Update progress display
        function updateProgressDisplay() {
            if (!window.digitalShieldProgress) {
                console.log('Digital Shield Progress not loaded yet');
                return;
            }

            const stats = window.digitalShieldProgress.getProgressStats();
            
            // Update overall progress
            const overallProgressElement = document.getElementById('overall-progress');
            if (overallProgressElement) {
                overallProgressElement.textContent = `${stats.overallProgress}%`;
            }

            // Update files completed
            const filesCompletedElement = document.getElementById('files-completed');
            if (filesCompletedElement) {
                filesCompletedElement.textContent = stats.completedModules;
            }

            // Update individual module status
            for (let i = 1; i <= 5; i++) {
                const fileElement = document.getElementById(`file-${i}`);
                const statusElement = document.getElementById(`status-${i}`);
                const btnElement = document.getElementById(`btn-${i}`);
                
                if (fileElement && statusElement && btnElement) {
                    const isCompleted = window.digitalShieldProgress.isModuleCompleted(i);
                    const isUnlocked = window.digitalShieldProgress.isModuleUnlocked(i);
                    
                    if (isCompleted) {
                        fileElement.classList.remove('locked');
                        statusElement.innerHTML = '<span class="status-badge completed">✅ COMPLETE</span>';
                        btnElement.textContent = 'REVIEW FILE';
                        btnElement.disabled = false;
                    } else if (isUnlocked) {
                        fileElement.classList.remove('locked');
                        statusElement.innerHTML = '<span class="status-badge new">AVAILABLE</span>';
                        btnElement.textContent = 'OPEN FILE';
                        btnElement.disabled = false;
                    } else {
                        fileElement.classList.add('locked');
                        statusElement.innerHTML = '<span class="status-badge locked">🔒 LOCKED</span>';
                        btnElement.textContent = 'CLEARANCE REQUIRED';
                        btnElement.disabled = true;
                    }
                }
            }

            // Update final assessment
            const finalFile = document.getElementById('final-assessment-file');
            const finalBtn = document.getElementById('final-btn');
            
            if (finalFile && finalBtn) {
                if (stats.completedModules === 5) {
                    finalFile.classList.remove('locked');
                    finalBtn.textContent = '🎯 BEGIN FINAL ASSESSMENT';
                    finalBtn.disabled = false;
                } else {
                    finalFile.classList.add('locked');
                    finalBtn.textContent = '🔒 ACCESS DENIED';
                    finalBtn.disabled = true;
                }
            }

            // Update clearance requirements
            const requirements = document.querySelectorAll('.requirement');
            requirements.forEach((req, index) => {
                const moduleNum = index + 1;
                const isCompleted = window.digitalShieldProgress.isModuleCompleted(moduleNum);
                
                if (isCompleted) {
                    req.classList.remove('incomplete');
                    req.classList.add('complete');
                    req.querySelector('.req-status').textContent = '✅';
                } else {
                    req.classList.remove('complete');
                    req.classList.add('incomplete');
                    req.querySelector('.req-status').textContent = '❌';
                }
            });
        }

        // Initialize file system
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for progress.js to load
            setTimeout(() => {
                updateProgressDisplay();
            }, 100);
            
            // Start timers
            setInterval(updateSessionTimer, 1000);
            setInterval(updateTimestamp, 1000);
            updateTimestamp();
            
            console.log('Digital Shield File System loaded');
        });
    </script>
    <script>
        // Module 1 JavaScript Functions
        let currentPhase = 0;
        let redFlagsFound = 0;
        let assessmentEmails = [];
        let currentAssessmentEmail = 0;
        let assessmentScore = 0;
        let assessmentComplete = false;

        // Navigation functions
        function returnToMissionControl() {
            window.location.href = 'index.html';
        }

        function startTraining() {
            showSection('training-phase-1');
            updateProgress(1);
        }

        function completePhase(phase) {
            updateProgress(phase + 1);
            
            if (phase === 1) {
                showSection('training-phase-2');
            } else if (phase === 2) {
                showSection('training-phase-3');
            } else if (phase === 3) {
                showSection('assessment-phase');
                initializeAssessment();
            }
        }

        function showSection(sectionId) {
            // Hide all sections
            const sections = document.querySelectorAll('.training-section');
            sections.forEach(section => section.classList.remove('active'));
            
            // Show target section
            document.getElementById(sectionId).classList.add('active');
        }

        function updateProgress(step) {
            const percentage = ((step - 1) / 3) * 100;
            document.getElementById('module-progress').textContent = `${Math.round(percentage)}%`;
        }

        // Red flag detection training
        function initializeRedFlagDetection() {
            const hiddenElements = document.querySelectorAll('.scannable-hidden');
            hiddenElements.forEach(element => {
                element.addEventListener('click', function() {
                    if (!this.classList.contains('found')) {
                        this.classList.add('found');
                        redFlagsFound++;
                        updateRedFlagFeedback(this.dataset.flag);
                        
                        if (redFlagsFound >= 6) {
                            document.getElementById('phase-2-btn').disabled = false;
                        }
                    }
                });
            });
        }

        function updateRedFlagFeedback(flag) {
            document.getElementById('flags-found').textContent = redFlagsFound;
            
            const explanations = {
                'sender': 'Misspelled domain name - "hiltophonney" instead of "hilltophoney"',
                'subject': 'Creates false urgency to pressure quick action',
                'greeting': 'Generic greeting instead of your actual name',
                'urgency': 'Suspicious activity claims designed to create panic',
                'request': 'Requests sensitive login verification via email',
                'link': 'Suspicious URL that doesn\'t match our real domain'
            };
            
            const explanationDiv = document.getElementById('flag-explanations');
            const flagDiv = document.createElement('div');
            flagDiv.className = 'flag-explanation';
            flagDiv.innerHTML = `<strong>Red Flag:</strong> ${explanations[flag]}`;
            explanationDiv.appendChild(flagDiv);
        }

        // Assessment functions
        function initializeAssessment() {
            assessmentEmails = [
                {
                    id: 1,
                    from: "supplier@honeyextractors.co.uk",
                    subject: "Updated Invoice #HE-2024-0847",
                    content: "Dear Hilltop Honey, Please find attached our updated invoice for the recent honey extraction equipment order. Payment terms remain net 30 days. Best regards, Sarah Johnson, Honey Extractors Ltd.",
                    legitimate: true,
                    explanation: "Legitimate business email from a known supplier with specific details."
                },
                {
                    id: 2,
                    from: "security@hiltop-honey.secure.com",
                    subject: "URGENT: Verify Account Now",
                    content: "Your account will be suspended unless you verify immediately. Click here: verify-now.suspicioussite.com",
                    legitimate: false,
                    explanation: "Phishing attempt with misspelled domain, urgent language, and suspicious link."
                },
                {
                    id: 3,
                    from: "hr@hilltophoney.com",
                    subject: "Holiday Schedule 2024",
                    content: "Team, Please review the attached 2024 holiday schedule. Note the additional closure days around Christmas. Any questions, please ask. Thanks, Michelle (HR)",
                    legitimate: true,
                    explanation: "Internal HR communication with appropriate content and sender."
                },
                {
                    id: 4,
                    from: "ceo@hilltophoney.com",
                    subject: "Urgent Wire Transfer Required",
                    content: "I need you to wire £50,000 to our new supplier immediately. Details: Account 12345678, Sort 20-20-20. This is confidential. Don't call me, I'm in meetings all day.",
                    legitimate: false,
                    explanation: "Business Email Compromise attempt - unusual financial request with instructions not to verify."
                }
            ];
            
            showAssessmentEmail();
        }

        function showAssessmentEmail() {
            if (currentAssessmentEmail >= assessmentEmails.length) {
                showAssessmentResults();
                return;
            }
            
            const email = assessmentEmails[currentAssessmentEmail];
            const assessmentDiv = document.getElementById('email-assessment');
            
            assessmentDiv.innerHTML = `
                <div class="assessment-email">
                    <h4>Email ${currentAssessmentEmail + 1} of ${assessmentEmails.length}</h4>
                    <div class="email-preview">
                        <p><strong>From:</strong> ${email.from}</p>
                        <p><strong>Subject:</strong> ${email.subject}</p>
                        <p><strong>Content:</strong> ${email.content}</p>
                    </div>
                    <div class="assessment-question">
                        <h4>Is this email safe or suspicious?</h4>
                        <div class="action-buttons">
                            <button onclick="assessEmail(true)" class="assess-btn safe">
                                ✅ SAFE
                            </button>
                            <button onclick="assessEmail(false)" class="assess-btn suspicious">
                                ⚠️ SUSPICIOUS
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        function assessEmail(userChoice) {
            const email = assessmentEmails[currentAssessmentEmail];
            const correct = (userChoice === email.legitimate);
            
            if (correct) {
                assessmentScore += 25; // 100% / 4 emails = 25% each
            }
            
            showEmailFeedback(email, userChoice, correct);
            currentAssessmentEmail++;
            
            setTimeout(() => {
                showAssessmentEmail();
            }, 3000);
        }

        function showEmailFeedback(email, userChoice, correct) {
            const assessmentDiv = document.getElementById('email-assessment');
            const feedbackClass = correct ? 'correct' : 'incorrect';
            const resultText = correct ? 'CORRECT!' : 'INCORRECT';
            const choiceText = userChoice ? 'marked as SAFE' : 'marked as SUSPICIOUS';
            const actualText = email.legitimate ? 'actually SAFE' : 'actually SUSPICIOUS';
            
            const feedbackHtml = `
                <div class="assessment-feedback ${feedbackClass}">
                    <h3>${resultText}</h3>
                    <p>You ${choiceText}, and this email is ${actualText}.</p>
                    <div class="explanation">
                        <strong>Explanation:</strong> ${email.explanation}
                    </div>
                </div>
            `;
            
            assessmentDiv.innerHTML += feedbackHtml;
        }

        function showAssessmentResults() {
            const resultsDiv = document.getElementById('assessment-results');
            let grade, message;
            
            if (assessmentScore >= 75) {
                grade = 'EXPERT';
                message = 'Excellent! You have mastered email security.';
            } else if (assessmentScore >= 50) {
                grade = 'PROFICIENT';
                message = 'Good work! You understand email security basics.';
            } else {
                grade = 'NEEDS IMPROVEMENT';
                message = 'Consider reviewing the training materials.';
            }
            
            resultsDiv.innerHTML = `
                <div class="assessment-completion">
                    <h2>🎯 ASSESSMENT COMPLETE</h2>
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-number">${assessmentScore}%</span>
                            <span class="grade">${grade}</span>
                        </div>
                    </div>
                    <p>${message}</p>
                    <button onclick="completeModule1()" class="section-btn primary">
                        COMPLETE MODULE 1
                    </button>
                </div>
            `;
            
            resultsDiv.style.display = 'block';
        }

        function completeModule1() {
            alert('🎉 Congratulations! You have successfully completed Module 1: Email Security. Return to Mission Control to continue your training.');
            returnToMissionControl();
        }

        // Initialize the module
        document.addEventListener('DOMContentLoaded', function() {
            updateProgress(1);
            initializeRedFlagDetection();
        });
    </script>
