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
 <script>
        // Global variables
        let currentPhase = 0;
        let challengeScores = [false, false, false];
        let passwordVisible = false;
        
        // Common passwords list for validation
        const commonPasswords = [
            'password', '123456', '123456789', 'qwerty', 'abc123', 
            'password123', 'admin', 'letmein', 'welcome', 'monkey'
        ];

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
            // Update progress indicator
            for (let i = 1; i <= 5; i++) {
                const stepElement = document.getElementById(`step-${i}`);
                if (i < step) {
                    stepElement.className = 'progress-step completed';
                } else if (i === step) {
                    stepElement.className = 'progress-step active';
                } else {
                    stepElement.className = 'progress-step';
                }
            }
            
            // Update progress percentage
            const percentage = ((step - 1) / 4) * 100;
            document.getElementById('module-progress').textContent = `${Math.round(percentage)}%`;
        }

        // Password strength testing
        function testPasswordStrength() {
            const password = document.getElementById('password-tester').value;
            const strengthBar = document.getElementById('strength-bar');
            const feedback = document.getElementById('password-feedback');
            const vault = document.getElementById('vault-status');
            const vaultLock = document.getElementById('vault-lock');
            const vaultMessage = document.getElementById('vault-message');
            
            if (!password) {
                strengthBar.className = 'strength-fill';
                feedback.innerHTML = '<h4>Password Analysis:</h4><p>Enter a password above to see detailed security analysis...</p>';
                vault.classList.remove('vault-unlocked');
                vaultMessage.textContent = 'Enter a password to test the vault security';
                updateCriteria(password);
                return;
            }

            const strength = calculatePasswordStrength(password);
            const analysis = analyzePassword(password);
            
            // Update strength bar
            strengthBar.className = `strength-fill strength-${strength.level}`;
            
            // Update feedback
            feedback.innerHTML = `
                <h4>Password Analysis:</h4>
                <p><strong>Strength Level:</strong> ${strength.description}</p>
                <p><strong>Crack Time:</strong> ${strength.crackTime}</p>
                <div class="analysis-details">
                    ${analysis.map(item => `<p>• ${item}</p>`).join('')}
                </div>
            `;
            
            // Update vault status
            if (strength.level === 'strong') {
                vault.classList.add('vault-unlocked');
                vaultMessage.textContent = 'VAULT SECURED - Excellent password strength!';
                document.getElementById('phase-3-btn').disabled = false;
            } else {
                vault.classList.remove('vault-unlocked');
                vaultMessage.textContent = 'VAULT VULNERABLE - Password needs strengthening';
                document.getElementById('phase-3-btn').disabled = true;
            }
            
            updateCriteria(password);
        }

        function calculatePasswordStrength(password) {
            let score = 0;
            let crackTime = '';
            
            // Length score
            if (password.length >= 12) score += 25;
            else if (password.length >= 8) score += 15;
            else if (password.length >= 6) score += 5;
            
            // Character variety
            if (/[a-z]/.test(password)) score += 15;
            if (/[A-Z]/.test(password)) score += 15;
            if (/[0-9]/.test(password)) score += 15;
            if (/[^A-Za-z0-9]/.test(password)) score += 15;
            
            // Bonus for good practices
            if (password.length >= 16) score += 10;
            if (!commonPasswords.includes(password.toLowerCase())) score += 5;
            
            // Penalties
            if (/(.)\1{2,}/.test(password)) score -= 10; // Repeated characters
            if (commonPasswords.includes(password.toLowerCase())) score -= 30;
            
            // Determine level and crack time
            if (score >= 80) {
                return { level: 'strong', description: 'EXCELLENT', crackTime: 'Centuries to crack' };
            } else if (score >= 60) {
                return { level: 'good', description: 'GOOD', crackTime: 'Years to crack' };
            } else if (score >= 40) {
                return { level: 'fair', description: 'FAIR', crackTime: 'Days to crack' };
            } else {
                return { level: 'weak', description: 'WEAK', crackTime: 'Minutes to crack' };
            }
        }

        function analyzePassword(password) {
            const analysis = [];
            
            if (password.length < 12) {
                analysis.push('Consider making it longer (12+ characters recommended)');
            }
            if (!/[A-Z]/.test(password)) {
                analysis.push('Add uppercase letters for better security');
            }
            if (!/[a-z]/.test(password)) {
                analysis.push('Add lowercase letters for better security');
            }
            if (!/[0-9]/.test(password)) {
                analysis.push('Add numbers for better security');
            }
            if (!/[^A-Za-z0-9]/.test(password)) {
                analysis.push('Add symbols (!@#$%^&*) for better security');
            }
            if (commonPasswords.includes(password.toLowerCase())) {
                analysis.push('This is a commonly used password - avoid it!');
            }
            if (/(.)\1{2,}/.test(password)) {
                analysis.push('Avoid repeating the same character multiple times');
            }
            
            if (analysis.length === 0) {
                analysis.push('Excellent password structure!');
                analysis.push('This password follows all security best practices');
            }
            
            return analysis;
        }

        function updateCriteria(password) {
            const criteria = {
                'length-check': password.length >= 12,
                'uppercase-check': /[A-Z]/.test(password),
                'lowercase-check': /[a-z]/.test(password),
                'numbers-check': /[0-9]/.test(password),
                'symbols-check': /[^A-Za-z0-9]/.test(password),
                'common-check': !commonPasswords.includes(password.toLowerCase())
            };
            
            Object.keys(criteria).forEach(id => {
                const element = document.getElementById(id);
                const checkMark = element.querySelector('.check-mark');
                if (criteria[id]) {
                    checkMark.textContent = '✅';
                    element.style.color = '#00ff00';
                } else {
                    checkMark.textContent = '❌';
                    element.style.color = '#e74c3c';
                }
            });
        }

        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password-tester');
            passwordVisible = !passwordVisible;
            passwordInput.type = passwordVisible ? 'text' : 'password';
        }

        function testExample(password) {
            document.getElementById('password-tester').value = password;
            testPasswordStrength();
        }

        // Assessment functions
        function answerChallenge(challengeNum, answer) {
            const resultDiv = document.getElementById(`result-${challengeNum}`);
            
            if (challengeNum === 1) {
                if (answer === 'B') {
                    resultDiv.innerHTML = '<p style="color: #00ff00;">✅ Correct! This is a phishing attempt targeting password credentials.</p>';
                    challengeScores[0] = true;
                } else {
                    resultDiv.innerHTML = '<p style="color: #e74c3c;">❌ Incorrect. This is a phishing attack trying to steal login credentials.</p>';
                }
            }
            
            updateFinalScore();
        }

        function checkRanking() {
            // For simplicity, we'll just provide the correct answer
            const resultDiv = document.getElementById('result-2');
            resultDiv.innerHTML = `
                <p style="color: #00ffff;">Correct ranking (weakest to strongest):</p>
                <ol>
                    <li>admin123 (Very weak - common pattern)</li>
                    <li>Summer2024 (Weak - predictable)</li>
                    <li>MyDog$Loves2Run! (Good - long with mixed characters)</li>
                    <li>Tr33$@r3T@ll&Gr33n#F0r3st! (Excellent - very long and complex)</li>
                </ol>
            `;
            challengeScores[1] = true;
            updateFinalScore();
        }

        function validateCustomPassword() {
            const password = document.getElementById('custom-password').value;
            const resultDiv = document.getElementById('result-3');
            
            if (!password) {
                resultDiv.innerHTML = '<p style="color: #e74c3c;">Please enter a password to test.</p>';
                return;
            }
            
            const strength = calculatePasswordStrength(password);
            
            if (strength.level === 'strong' || strength.level === 'good') {
                resultDiv.innerHTML = `<p style="color: #00ff00;">✅ Excellent! Your password strength is ${strength.description}.</p>`;
                challengeScores[2] = true;
            } else {
                resultDiv.innerHTML = `<p style="color: #e74c3c;">❌ Password needs improvement. Current strength: ${strength.description}. Try making it longer with mixed characters.</p>`;
            }
            
            updateFinalScore();
        }

        function updateFinalScore() {
            const score = challengeScores.filter(Boolean).length;
            document.getElementById('final-score').textContent = `${score}/3`;
            
            const feedback = document.getElementById('score-feedback');
            
            if (score === 3) {
                feedback.innerHTML = '<p style="color: #00ff00;">🎉 MISSION ACCOMPLISHED! You are now a certified Password Security Expert!</p>';
                document.getElementById('complete-btn').disabled = false;
            } else if (score === 2) {
                feedback.innerHTML = '<p style="color: #f39c12;">Good work! Complete one more challenge to earn your certification.</p>';
            } else if (score === 1) {
                feedback.innerHTML = '<p style="color: #e74c3c;">Keep going! Complete the remaining challenges to prove your skills.</p>';
            } else {
                feedback.innerHTML = '<p>Complete all challenges to see your final score.</p>';
            }
        }

        function completeModule() {
            // Show completion message with certificate
            const completionMessage = `
                🎉 CONGRATULATIONS! 🎉
                
                You have successfully completed Module 2: Password Security!
                
                You've earned your Password Expert certification and are now qualified to:
                • Create unbreakable passwords
                • Identify password threats
                • Implement secure password management
                • Protect Hilltop Honey's digital assets
                
                Return to Mission Control to continue your cybersecurity training.
            `;
            
            alert(completionMessage);
            
            // Here you would typically save progress and redirect
            returnToMissionControl();
        }

        // Initialize the module
        document.addEventListener('DOMContentLoaded', function() {
            updateProgress(1);
        });
    </script>
