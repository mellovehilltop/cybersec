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
        // Populate elements that don't need to be re-rendered
        // This is a great pattern for keeping content out of HTML if desired
        document.querySelector('.password-grid').innerHTML = this.commonPasswords.map(p => `<span>${p}</span>`).join('');
    },
    
    // --- EVENT HANDLERS & CORE LOGIC ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': this.showSection('training-phase-1'); this.updateProgress(2); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
            case 'complete-module': this.completeModule(); break;
            case 'toggle-visibility': this.togglePasswordVisibility(); break;
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
        const sectionId = phase === 3 ? 'assessment-phase' : `training-phase-${nextPhase}`;
        this.showSection(sectionId);
    },

    // --- Phase 3: Password Strength Tester ---
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
        
        this.dom.criteriaList.innerHTML = criteria.map(item => `
            <div class="criteria-item ${item.pass ? 'pass' : 'fail'}">
                <span class="check-mark">${item.pass ? '✅' : '❌'}</span> ${item.text}
            </div>
        `).join('');
    },

    togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
        this.dom.passwordTester.type = this.passwordVisible ? 'text' : 'password';
    },

    completeModule() {
        // Logic to save progress and redirect
        if (window.digitalShieldProgress) {
            const finalScore = (this.challengeScores.filter(Boolean).length / 3) * 100;
            window.digitalShieldProgress.completeModule(2, finalScore);
        }
        alert('Module 2 complete! Returning to Mission Control.');
        window.location.href = 'index.html';
    }
};

module2Manager.init();
