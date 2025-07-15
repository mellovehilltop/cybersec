const module2Manager = {
    // --- STATE & CONTENT ---
    passwordVisible: false,
    challengeScores: [false, false, false],
    commonPasswords: ['password', '123456', 'qwerty', 'admin', '123456789', '111111'],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.renderStaticContent();
        this.updateProgress(1);
    },

    cacheDOMElements() {
        this.dom.sections = document.querySelectorAll('.training-section');
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.actionButtons = document.querySelectorAll('[data-action]');
        // Phase 3
        this.dom.passwordTester = document.getElementById('password-tester');
        this.dom.strengthBar = document.getElementById('strength-bar');
        this.dom.passwordFeedback = document.getElementById('password-feedback');
        this.dom.vaultStatus = document.getElementById('vault-status');
        this.dom.criteriaList = document.querySelector('.strength-criteria .criteria-list');
        this.dom.phase3Btn = document.getElementById('phase-3-btn');
        // Assessment
        this.dom.assessmentChallenges = document.querySelector('.assessment-challenges');
        this.dom.finalScore = document.getElementById('final-score');
        this.dom.scoreFeedback = document.getElementById('score-feedback');
        this.dom.completeBtn = document.getElementById('complete-btn');
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset));
        });
        if (this.dom.passwordTester) {
            this.dom.passwordTester.addEventListener('input', () => this.testPasswordStrength());
        }
    },

    renderStaticContent() {
        document.querySelector('.password-grid').innerHTML = this.commonPasswords.map(p => `<span>${p}</span>`).join('');
    },
    
    // --- EVENT HANDLERS & CORE LOGIC ---
    handleAction(dataset) {
        const { action, phase, challengeId, answer } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': this.showSection('training-phase-1'); this.updateProgress(2); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
            case 'toggle-visibility': this.togglePasswordVisibility(); break;
            case 'answer-challenge': this.answerChallenge(challengeId, answer); break;
            case 'validate-custom': this.validateCustomPassword(); break;
        }
    },
    
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const percentage = Math.round(((step - 1) / 4) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    completePhase(phase) {
        const nextPhase = phase + 1;
        this.updateProgress(nextPhase + 1);
        if (phase === 3) {
            this.showSection('assessment-phase');
            this.renderAssessment();
        } else {
            const sectionId = `training-phase-${nextPhase}`;
            this.showSection(sectionId);
        }
    },

    testPasswordStrength() {
        const password = this.dom.passwordTester.value;
        if (!password) {
            this.resetStrengthTester();
            return;
        }
        const strength = this.calculatePasswordStrength(password);
        this.dom.strengthBar.className = `strength-fill strength-${strength.level}`;
        this.dom.passwordFeedback.innerHTML = `<p><strong>Strength:</strong> ${strength.description}</p><p><strong>Est. Crack Time:</strong> ${strength.crackTime}</p>`;
        this.dom.vaultStatus.classList.toggle('unlocked', strength.level === 'strong');
        this.dom.phase3Btn.disabled = strength.level !== 'strong';
        this.updateCriteria(password);
    },

    resetStrengthTester() {
        this.dom.strengthBar.className = 'strength-fill';
        this.dom.passwordFeedback.innerHTML = '';
        this.dom.vaultStatus.classList.remove('unlocked');
        this.dom.phase3Btn.disabled = true;
        this.updateCriteria('');
    },

    calculatePasswordStrength(password) {
        let score = 0;
        if (password.length >= 12) score += 25;
        if (/[A-Z]/.test(password)) score += 15;
        if (/[a-z]/.test(password)) score += 15;
        if (/[0-9]/.test(password)) score += 15;
        if (/[^A-Za-z0-9]/.test(password)) score += 15;
        if (!this.commonPasswords.includes(password.toLowerCase())) score += 15;
        if (score >= 90) return { level: 'strong', description: 'EXCELLENT', crackTime: 'Centuries' };
        if (score >= 75) return { level: 'good', description: 'GOOD', crackTime: 'Years' };
        if (score >= 50) return { level: 'fair', description: 'FAIR', crackTime: 'Days' };
        return { level: 'weak', description: 'WEAK', crackTime: 'Seconds' };
    },
    
    updateCriteria(password) {
        const criteria = [
            { id: 'length-check', pass: password.length >= 12, text: 'At least 12 characters' },
            { id: 'uppercase-check', pass: /[A-Z]/.test(password), text: 'Contains uppercase letters' },
            { id: 'lowercase-check', pass: /[a-z]/.test(password), text: 'Contains lowercase letters' },
            { id: 'numbers-check', pass: /[0-9]/.test(password), text: 'Contains numbers' },
            { id: 'symbols-check', pass: /[^A-Za-z0-9]/.test(password), text: 'Contains symbols' },
            { id: 'common-check', pass: !this.commonPasswords.includes(password.toLowerCase()), text: 'Not a common password' },
        ];
        this.dom.criteriaList.innerHTML = criteria.map(item => `<div class="criteria-item ${item.pass ? 'pass' : 'fail'}"><span class="check-mark">${item.pass ? '✅' : '❌'}</span> ${item.text}</div>`).join('');
    },

        togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        this.dom.passwordTester.type = this.passwordVisible ? 'text' : 'password';
    },

    // ADD THIS NEW FUNCTION
    testExample(password) {
        this.dom.passwordTester.value = password;
        this.testPasswordStrength(); // Trigger the analysis
        this.dom.passwordTester.focus(); // Focus on the input field
    },
    renderAssessment()
        const challenges = [
            { id: 1, title: 'Challenge 1: Identify the Threat', question: 'You receive an email saying "Your password expires today. Click here to update: www.hilltopmoney.com". What type of attack is this?', options: [{ text: 'A) Brute Force', answer: 'A' }, { text: 'B) Phishing', answer: 'B' }, { text: 'C) Dictionary Attack', answer: 'C' }], correctAnswer: 'B' },
            { id: 2, title: 'Challenge 2: Create a Secure Password', question: 'Create a password for your work email that meets all security requirements.', isCustom: true },
            { id: 3, title: 'Challenge 3: Password Reuse', question: 'You use the same strong password for your work email and personal social media. Is this a secure practice?', options: [{ text: 'YES - As long as the password is strong', answer: 'A' }, { text: 'NO - Each account needs a unique password', answer: 'B' }], correctAnswer: 'B' }
        ];
        this.dom.assessmentChallenges.innerHTML = challenges.map(c => `
            <div class="challenge-card" id="challenge-${c.id}">
                <h4>${c.title}</h4>
                <p>${c.question}</p>
                ${c.isCustom ? `<input type="password" id="custom-password" class="password-input" placeholder="Create your secure password..."><button data-action="validate-custom" class="btn option-btn">Test My Password</button>` : `<div class="challenge-options">${c.options.map(o => `<button data-action="answer-challenge" data-challenge-id="${c.id}" data-answer="${o.answer}" class="btn option-btn">${o.text}</button>`).join('')}</div>`}
                <div class="challenge-result" id="result-${c.id}"></div>
            </div>`).join('');
        this.dom.assessmentChallenges.querySelectorAll('[data-action]').forEach(btn => btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset)));
    },

    answerChallenge(challengeId, answer) {
        const resultDiv = document.getElementById(`result-${challengeId}`);
        const correct = (challengeId === '1' && answer === 'B') || (challengeId === '3' && answer === 'B');
        if (correct) {
            resultDiv.innerHTML = '<p style="color: var(--success-color);">✅ Correct!</p>';
            this.challengeScores[parseInt(challengeId) - 1] = true;
        } else {
            resultDiv.innerHTML = '<p style="color: var(--danger-color);">❌ Incorrect. Try again.</p>';
        }
        this.updateFinalScore();
    },

    validateCustomPassword() {
        const password = document.getElementById('custom-password').value;
        const resultDiv = document.getElementById('result-2');
        const strength = this.calculatePasswordStrength(password);
        if (strength.level === 'strong' || strength.level === 'good') {
            resultDiv.innerHTML = `<p style="color: var(--success-color);">✅ Excellent! Your password is secure.</p>`;
            this.challengeScores[1] = true;
        } else {
            resultDiv.innerHTML = `<p style="color: var(--danger-color);">❌ Password needs improvement. Try making it longer with mixed characters.</p>`;
        }
        this.updateFinalScore();
    },

    updateFinalScore() {
        const score = this.challengeScores.filter(Boolean).length;
        this.dom.finalScore.textContent = `${score}/3`;
        if (score === 3) {
            this.dom.scoreFeedback.innerHTML = '<p style="color: var(--success-color);">🎉 MISSION ACCOMPLISHED!</p>';
            this.dom.completeBtn.disabled = false;
        }
    },

    completeModule() {
        if (window.digitalShieldProgress) {
            const finalScore = (this.challengeScores.filter(Boolean).length / 3) * 100;
            window.digitalShieldProgress.completeModule(2, finalScore);
        }
        alert('Module 2 complete! Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

module2Manager.init();
