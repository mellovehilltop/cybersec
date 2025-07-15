const module3Manager = {
    // --- STATE & CONTENT ---
    selectedURL: null,
    correctlySorted: 0,
    urlExamples: [
        { url: "https://www.hilltophoney.co.uk/contact", category: "safe", explanation: "Correct! HTTPS and the official company domain are a good sign." },
        { url: "http://hilltop-honey-suppliers.net/login", category: "suspicious", explanation: "Correct! The 'http' means it's not secure, and '-suppliers.net' is not our official domain." },
        { url: "https://hiltophoney.tk/urgent-payment", category: "dangerous", explanation: "Correct! A misspelled domain ('hiltop') and an unusual top-level domain (.tk) are major red flags." },
        { url: "https://royalmail.com/track-and-trace", category: "safe", explanation: "Correct! This is a legitimate, secure URL for a known service." },
        { url: "http://192.168.4.23/downloads/update.exe", category: "dangerous", explanation: "Correct! A direct IP address URL for a download is extremely dangerous." },
        { url: "https://www.amazon-deals.org", category: "suspicious", explanation: "Correct! While it has HTTPS, 'amazon-deals.org' is not the real Amazon domain." }
    ],

    // --- DOM CACHE ---
    dom: {},

    // --- INITIALIZATION ---
    init() {
        this.cacheDOMElements();
        this.bindEvents();
        this.renderURLDetectiveGame();
        this.updateProgress(1);
    },

    cacheDOMElements() {
        this.dom.sections = document.querySelectorAll('.training-section');
        this.dom.moduleProgress = document.getElementById('module-progress');
        this.dom.actionButtons = document.querySelectorAll('[data-action]');
        // Game specific
        this.dom.urlSortingPool = document.getElementById('url-sorting-pool');
        this.dom.dropZones = document.querySelectorAll('.url-drop-zone');
        this.dom.feedbackBox = document.getElementById('url-feedback');
        this.dom.phase1Btn = document.getElementById('phase-1-btn');
    },

    bindEvents() {
        this.dom.actionButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleAction(e.currentTarget.dataset));
        });
        
        // Event delegation for URL items
        this.dom.urlSortingPool.addEventListener('click', (e) => {
            if (e.target.classList.contains('url-item')) {
                this.selectURL(e.target);
            }
        });

        // Event listener for drop zones
        this.dom.dropZones.forEach(zone => {
            zone.addEventListener('click', (e) => this.placeURL(e.currentTarget));
        });
    },

    // --- RENDER & GAME LOGIC ---
    renderURLDetectiveGame() {
        this.dom.urlSortingPool.innerHTML = '';
        this.urlExamples.forEach((item, index) => {
            const urlEl = document.createElement('div');
            urlEl.className = 'url-item';
            urlEl.textContent = item.url;
            urlEl.dataset.index = index;
            urlEl.dataset.category = item.category;
            this.dom.urlSortingPool.appendChild(urlEl);
        });
    },

    selectURL(urlElement) {
        if (this.selectedURL) {
            this.selectedURL.classList.remove('selected');
        }
        this.selectedURL = urlElement;
        this.selectedURL.classList.add('selected');
        this.dom.feedbackBox.textContent = "Now click a category box to place it.";
        this.dom.feedbackBox.className = 'feedback-box';
    },

    placeURL(zoneElement) {
        if (!this.selectedURL) {
            this.dom.feedbackBox.textContent = "Please select a URL first.";
            return;
        }

        const correctCategory = this.selectedURL.dataset.category;
        const chosenCategory = zoneElement.dataset.category;
        const urlIndex = this.selectedURL.dataset.index;
        const explanation = this.urlExamples[urlIndex].explanation;

        if (correctCategory === chosenCategory) {
            // Correct placement
            this.dom.feedbackBox.textContent = explanation;
            this.dom.feedbackBox.className = 'feedback-box correct';
            this.selectedURL.classList.remove('selected');
            this.selectedURL.classList.add('correct');
            zoneElement.querySelector('.url-list').appendChild(this.selectedURL);
            this.selectedURL = null;
            this.correctlySorted++;
            this.checkCompletion();
        } else {
            // Incorrect placement
            this.dom.feedbackBox.textContent = `Incorrect. Think carefully about why that URL might be misleading.`;
            this.dom.feedbackBox.className = 'feedback-box incorrect';
            this.selectedURL.classList.add('incorrect');
            setTimeout(() => this.selectedURL.classList.remove('incorrect'), 500);
        }
    },
    
    checkCompletion() {
        if (this.correctlySorted === this.urlExamples.length) {
            this.dom.feedbackBox.textContent = "All URLs sorted correctly! Phase complete.";
            this.dom.phase1Btn.disabled = false;
        }
    },
    
    // --- GENERAL MODULE LOGIC ---
    handleAction(dataset) {
        const { action, phase } = dataset;
        switch (action) {
            case 'return-home': window.location.href = 'index.html'; break;
            case 'start-training': this.showSection('training-phase-1'); this.updateProgress(2); break;
            case 'complete-phase': this.completePhase(parseInt(phase, 10)); break;
        }
    },
    
    showSection(sectionId) {
        this.dom.sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId)?.classList.add('active');
    },

    updateProgress(step) {
        const totalPhases = 3; // Briefing, Game, Assessment
        const percentage = Math.round(((step - 1) / totalPhases) * 100);
        this.dom.moduleProgress.textContent = `${percentage}%`;
    },

    completePhase(phase) {
        const nextPhase = phase + 1;
        this.updateProgress(nextPhase + 1);
        alert(`Phase ${phase + 1} content (e.g., Certificate Inspector) would go here.`);
    }
};

module3Manager.init();
