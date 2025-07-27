/**
 * js/module2.js - FINALIZED VERSION v2
 *
 * FIXES:
 * - Example password buttons in Phase 3 are now functional.
 * - Final assessment content now renders correctly.
 * - All previous fixes retained for a stable module.
 */
const module2Manager = {
    // --- STATE & CONTENT ---
    passwordVisible: false,
    challengeScores: [false, false, false], // [Challenge1, Challenge2, Challenge3]
    commonPasswords: ['password', '123456', 'qwerty', 'admin', '123456789', '111111', 'hilltophoney'],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.renderStaticContent();
        this.updateProgress(1);
        this.testPasswordStrength();
    },

    cacheDOMElements() {
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.passwordGrid = document.getElementById('password-grid');
        this.dom.passwordTester = document.getElementById('password-tester');
        this.dom.strengthBar = document.getElementById('strength-bar');
        this.dom.passwordFeedback = document.getElementById('password-feedback');
        this.dom.vaultStatus = document.getElementById('vault-status');
        this.dom.criteriaList = document.getElementById('criteria-list');
        this.dom.phase3Btn = document.getElementById('phase-3-btn');
        this.dom.assessmentWrapper = document.getElementById('assessment-wrapper');
        this.dom.finalScore = document.getElementById('final-score');
        this.dom.scoreFeedback = document.getElementById('score-feedback');
        this.dom.completeBtn = document.getElementById('complete-btn');
    },

    bindEvents() {
        document.body.addEventListener('click', (e) => {
            const actionTarget = e.target.closest('[data-action]');
            if (actionTarget) {
                e.preventDefault();
                this.handleAction(actionTarget.dataset);
            }
        });
        if (this.dom.passwordTester) {
            this.dom.passwordTester.addEventListener('input', () => this.testPasswordStrength());
        }
    },

    renderStaticContent() {
        this.dom.passwordGrid.innerHTML = this.commonPasswords.map(p => `<span>${p}</span>`).join('');
    },
    
    handleAction(dataset) {
        const { action, phase, challengeId, answer, password } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training':
                if (window.digitalShieldProgress) window.digitalShieldProgress.startModule(2);
                this.showSection('training-phase-1');
                this.updateProgress(2);
                break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
            case 'toggle-visibility': this.togglePasswordVisibility(); break;
            case 'test-example': this.testExample(password); break;
            case 'answer-challenge': this.answerChallenge(challengeId, answer); break;
            case 'validate-custom': this.validateCustomPassword(); break;
        }
    },
    
    showSection(sectionId) {
        document.querySelectorAll('.training-section').forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const percentage = Math.round(((step - 1) / 5) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    completePhase(phase) {
        this.updateProgress(phase + 2);
        if (phase === 3) {
            this.showSection('assessment-phase');
            this.renderAssessment();
        } else {
            this.showSection(`training-phase-${phase + 1}`);
        }
    },

    testPasswordStrength() {
        const password = this.dom.passwordTester.value;
        const strength = this.calculatePasswordStrength(password);
        this.dom.strengthBar.className = `strength-fill strength-${strength.level}`;
        this.dom.passwordFeedback.innerHTML = password ? `<p><strong>Strength:</strong> ${strength.description}</p>` : '';
        this.dom.vaultStatus.classList.toggle('unlocked', strength.level === 'strong');
        this.dom.phase3Btn.disabled = strength.level !== 'strong';
        this.updateCriteria(password);
    },

    calculatePasswordStrength(password) {
        let score = 0;
        if (!password) return { level: 'none', description: 'Awaiting Input' };
        if (password.length >= 14) score += 25; else if (password.length >= 12) score += 15;
        if (/[A-Z]/.test(password)) score += 20;
        if (/[a-z]/.test(password)) score += 20;
        if (/[0-9]/.test(password)) score += 20;
        if (/[^A-Za-z0-9]/.test(password)) score += 20;
        if (this.commonPasswords.includes(password.toLowerCase())) score = 0;
        if (score >= 90) return { level: 'strong', description: 'VAULT-GRADE' };
        if (score >= 75) return { level: 'good', description: 'GOOD' };
        if (score >= 50) return { level: 'fair', description: 'FAIR' };
        return { level: 'weak', description: 'WEAK' };
    },
    
    updateCriteria(password) {
        const criteria = [
            { pass: password.length >= 12, text: 'At least 12 characters' },
            { pass: /[A-Z]/.test(password), text: 'Contains uppercase letters' },
            { pass: /[a-z]/.test(password), text: 'Contains lowercase letters' },
            { pass: /[0-9]/.test(password), text: 'Contains numbers' },
            { pass: /[^A-Za-z0-9]/.test(password), text: 'Contains symbols (!@#$)' },
            { pass: password.length > 0 && !this.commonPasswords.includes(password.toLowerCase()), text: 'Not a common password' },
        ];
        this.dom.criteriaList.innerHTML = criteria.map(item => `<div class="criteria-item ${item.pass ? 'pass' : 'fail'}"><span class="check-mark">${item.pass ? '✅' : '❌'}</span> ${item.text}</div>`).join('');
    },

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        this.dom.passwordTester.type = this.passwordVisible ? 'text' : 'password';
    },

    testExample(password) {
        this.dom.passwordTester.value = password;
        this.testPasswordStrength();
        this.dom.passwordTester.focus();
    },

    // FIX: This is the corrected assessment rendering function.
    renderAssessment(){
        // Get the container *inside* the function, after it's visible.
        const challengesContainer = document.getElementById('assessment-challenges');
        if (!challengesContainer) return;

        const challenges = [
            { id: 1, title: 'Challenge 1: Identify the Threat', question: 'An attacker uses a massive list of leaked passwords from other websites to try and log into your account. What is this attack called?', options: [{ text: 'A) Brute Force', answer: 'A' }, { text: 'B) Phishing', answer: 'B' }, { text: 'C) Credential Stuffing', answer: 'C' }], correctAnswer: 'C' },
            { id: 2, title: 'Challenge 2: Create a Secure Password', question: 'Create a password that meets all security requirements.', isCustom: true },
            { id: 3, title: 'Challenge 3: Password Reuse', question: 'You use a very strong, unique password for your work email. Is it safe to also use this password for a non-critical social media account?', options: [{ text: 'YES - It\'s a strong password', answer: 'A' }, { text: 'NO - Every account needs a unique password', answer: 'B' }], correctAnswer: 'B' }
        ];
        challengesContainer.innerHTML = challenges.map(c => `
            <div class="challenge-card" id="challenge-${c.id}">
                <h4>${c.title}</h4>
                <p>${c.question}</p>
                ${c.isCustom ? `<div><input type="password" id="custom-password" class="password-input" placeholder="Create your secure password..."><button data-action="validate-custom" class="btn btn-secondary">Test My Password</button></div>` : `<div class="challenge-options">${c.options.map(o => `<button data-action="answer-challenge" data-challenge-id="${c.id}" data-answer="${o.answer}" class="btn btn-secondary">${o.text}</button>`).join('')}</div>`}
                <div class="challenge-result" id="result-${c.id}"></div>
            </div>`).join('');
    },

    answerChallenge(challengeId, answer) {
        const resultDiv = document.getElementById(`result-${challengeId}`);
        document.querySelectorAll(`#challenge-${challengeId} button`).forEach(b => b.disabled = true);
        const isCorrect = (challengeId === '1' && answer === 'C') || (challengeId === '3' && answer === 'B');
        if (isCorrect) {
            resultDiv.innerHTML = '<p style="color: var(--success-color);">✅ Correct! Excellent knowledge.</p>';
            this.challengeScores[parseInt(challengeId) - 1] = true;
        } else {
            resultDiv.innerHTML = '<p style="color: var(--danger-color);">❌ Incorrect. Review the material on attack vectors and password reuse.</p>';
        }
        this.updateFinalScore();
    },

    validateCustomPassword() {
        const passwordInput = document.getElementById('custom-password');
        const password = passwordInput.value;
        const resultDiv = document.getElementById('result-2');
        const strength = this.calculatePasswordStrength(password);
        if (strength.level === 'strong') {
            resultDiv.innerHTML = `<p style="color: var(--success-color);">✅ VAULT-GRADE! This is an excellent, secure password.</p>`;
            this.challengeScores[1] = true;
            passwordInput.disabled = true;
            document.querySelector('#challenge-2 button').disabled = true;
        } else {
            resultDiv.innerHTML = `<p style="color: var(--danger-color);">❌ This password is too weak. Try making it longer with more mixed characters and symbols.</p>`;
        }
        this.updateFinalScore();
    },

    updateFinalScore() {
        const score = this.challengeScores.filter(Boolean).length;
        this.dom.finalScore.textContent = `${score}/3`;
        if (score === 3) {
            this.dom.scoreFeedback.innerHTML = '<p style="color: var(--success-color);">🎉 MISSION ACCOMPLISHED! All security challenges passed.</p>';
            this.dom.completeBtn.disabled = false;
            if(window.digitalShieldProgress) {
                window.digitalShieldProgress.awardBadge(2, 'Vault Guardian');
            }
        }
    },

    completeModule() {
        if (window.digitalShieldProgress) {
            const passedChallenges = this.challengeScores.filter(Boolean).length;
            const finalScore = Math.round((passedChallenges / 3) * 100);
            window.digitalShieldProgress.completeModule(2, finalScore);
        }
        alert('Module 2 complete! Progress saved. Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    module2Manager.init();
});
