// ============================================
// MODULE 4: PHYSICAL SECURITY - INTERACTIONS
// ============================================

// Module 4 State Management
let module4State = {
    currentPhase: 0,
    currentSection: 'briefing',
    scores: {
        walkthrough: 0,
        visitor: 0,
        social: 0,
        cleanDesk: 0,
        assessment: 0
    },
    progress: {
        hotspotsFound: 0,
        visitorsProcessed: 0,
        scenariosCompleted: 0,
        workspacesSecured: 0,
        assessmentQuestions: 0
    },
    completedPhases: [],
    achievements: []
};

// Facility locations data
const facilityLocations = {
    production: {
        title: "Production Floor",
        image: "images/module4/factory-floor-bg.jpg",
        description: "Identify security concerns: unsecured equipment, unlocked cabinets, unauthorized personnel access",
        hotspots: [
            { x: 25, y: 30, id: "equipment-1", description: "Unsecured control panel" },
            { x: 60, y: 45, id: "equipment-2", description: "Unlocked ingredient storage" },
            { x: 80, y: 25, id: "equipment-3", description: "Unattended workstation" }
        ]
    },
    warehouse: {
        title: "Warehouse",
        image: "images/module4/warehouse-area-bg.jpg", 
        description: "Check loading dock security, inventory access, and delivery verification",
        hotspots: [
            { x: 15, y: 60, id: "dock-1", description: "Unsecured loading dock" },
            { x: 50, y: 35, id: "inventory-1", description: "Open inventory area" },
            { x: 75, y: 50, id: "access-1", description: "Unmonitored side entrance" }
        ]
    },
    office: {
        title: "Office Space",
        image: "images/module4/office-space-bg.jpg",
        description: "Examine workstation locks, document security, and visitor access",
        hotspots: [
            { x: 30, y: 40, id: "desk-1", description: "Unlocked filing cabinet" },
            { x: 65, y: 30, id: "desk-2", description: "Unattended computer" },
            { x: 85, y: 60, id: "printer-1", description: "Documents left on printer" }
        ]
    },
    common: {
        title: "Common Areas", 
        image: "images/module4/common-areas-bg.jpg",
        description: "Review printer security, meeting room access, and information displays",
        hotspots: [
            { x: 20, y: 35, id: "break-1", description: "Confidential notice board" },
            { x: 55, y: 55, id: "meeting-1", description: "Unlocked meeting room" },
            { x: 80, y: 40, id: "printer-2", description: "Unsecured shared printer" }
        ]
    }
};

// Visitor scenarios data
const visitorScenarios = [
    {
        id: 1,
        name: "James Mitchell",
        type: "Expected Contractor",
        company: "Equipment Maintenance Ltd",
        purpose: "Scheduled equipment inspection",
        documentation: "Valid ID, work order, safety certification",
        photo: "images/module4/visitor-contractor.jpg",
        correctAction: "verify-escort",
        actions: [
            { id: "verify-escort", text: "Verify documentation and provide escort", correct: true },
            { id: "direct-entry", text: "Direct them to the production floor", correct: false },
            { id: "refuse-entry", text: "Refuse entry without prior notification", correct: false },
            { id: "call-manager", text: "Call manager before allowing access", correct: false }
        ]
    },
    {
        id: 2,
        name: "Sarah Johnson",
        type: "Delivery Person",
        company: "Quick Logistics",
        purpose: "Urgent honey jar delivery",
        documentation: "Temporary ID, unsigned delivery note",
        photo: "images/module4/visitor-delivery.jpg",
        correctAction: "verify-proper",
        actions: [
            { id: "accept-delivery", text: "Accept delivery immediately", correct: false },
            { id: "verify-proper", text: "Verify documentation and get signature", correct: true },
            { id: "refuse-delivery", text: "Refuse delivery due to suspicious documentation", correct: false },
            { id: "bypass-procedure", text: "Allow quick drop-off to save time", correct: false }
        ]
    },
    {
        id: 3,
        name: "Dr. Robert Hayes",
        type: "Government Inspector",
        company: "Food Standards Agency",
        purpose: "Unannounced quality inspection",
        documentation: "FSA badge, official inspection notice",
        photo: "images/module4/visitor-inspector.jpg",
        correctAction: "immediate-notify",
        actions: [
            { id: "delay-inspection", text: "Ask them to wait while you prepare", correct: false },
            { id: "immediate-notify", text: "Immediately notify management and provide access", correct: true },
            { id: "verify-appointment", text: "Check for scheduled appointment first", correct: false },
            { id: "request-later", text: "Request they return at a better time", correct: false }
        ]
    },
    {
        id: 4,
        name: "Mark Thompson",
        type: "Unannounced Visitor",
        company: "Thompson Consulting",
        purpose: "Business development meeting",
        documentation: "Business card, no appointment",
        photo: "images/module4/visitor-business.jpg",
        correctAction: "polite-appointment",
        actions: [
            { id: "immediate-meeting", text: "Find someone available to meet immediately", correct: false },
            { id: "polite-appointment", text: "Politely request they make an appointment", correct: true },
            { id: "refuse-completely", text: "Refuse to help and ask them to leave", correct: false },
            { id: "waiting-area", text: "Have them wait indefinitely in reception", correct: false }
        ]
    },
    {
        id: 5,
        name: "Lisa Brown",
        type: "Former Employee",
        company: "Previous Hilltop Honey staff",
        purpose: "Collect personal belongings",
        documentation: "Old company ID, claims items in office",
        photo: "images/module4/visitor-former.jpg",
        correctAction: "hr-verification",
        actions: [
            { id: "allow-access", text: "Allow access with escort to collect items", correct: false },
            { id: "hr-verification", text: "Contact HR to verify and arrange collection", correct: true },
            { id: "deny-access", text: "Deny access completely", correct: false },
            { id: "unsupervised-access", text: "Let them collect items unsupervised", correct: false }
        ]
    }
];

// Social engineering scenarios
const socialScenarios = [
    {
        id: 1,
        title: "The Forgotten ID Request",
        description: "A person in Hilltop Honey uniform approaches you at the security door. They claim to have forgotten their ID card and ask if they can follow you through the secure entrance. They seem to know some employee names and mention they're running late for an important production meeting.",
        pressureTactics: ["urgency", "familiarity", "authority"],
        correctResponse: "polite-refuse",
        responses: [
            { id: "let-follow", text: "Let them follow me through - they seem legitimate", correct: false },
            { id: "polite-refuse", text: "Politely refuse and direct them to reception for temporary access", correct: true },
            { id: "ignore-request", text: "Ignore them and continue through the door", correct: false },
            { id: "aggressive-refuse", text: "Aggressively tell them to go away", correct: false }
        ]
    },
    {
        id: 2,
        title: "The Urgent Delivery Pressure",
        description: "A delivery driver insists they have an urgent delivery that must bypass normal receiving procedures. They claim the shipment is time-sensitive honey ingredients that will spoil if not processed immediately. They're pressuring you to let them drive directly to the production area.",
        pressureTactics: ["urgency", "financial pressure"],
        correctResponse: "maintain-procedure",
        responses: [
            { id: "bypass-procedure", text: "Allow direct access to save the ingredients", correct: false },
            { id: "maintain-procedure", text: "Insist on following normal receiving procedures", correct: true },
            { id: "partial-bypass", text: "Allow them to the loading dock but no further", correct: false },
            { id: "manager-decide", text: "Let a manager handle the decision", correct: false }
        ]
    },
    {
        id: 3,
        title: "The Fake IT Support",
        description: "Someone claiming to be from IT support approaches your workstation. They say there's been a security breach and they need immediate access to your computer to install emergency patches. They don't have a work order but insist it's urgent and affects the entire network.",
        pressureTactics: ["authority", "urgency", "fear"],
        correctResponse: "verify-it",
        responses: [
            { id: "provide-access", text: "Immediately provide computer access", correct: false },
            { id: "verify-it", text: "Contact IT department to verify the request", correct: true },
            { id: "refuse-access", text: "Refuse access without explanation", correct: false },
            { id: "ask-credentials", text: "Ask for ID but accept any response", correct: false }
        ]
    },
    {
        id: 4,
        title: "The Executive Assistant Claim",
        description: "A well-dressed person claims to be the new assistant to the Managing Director. They say they need access to the executive offices to prepare for an important meeting. They mention confidential details about company operations and seem knowledgeable about staff.",
        pressureTactics: ["authority", "familiarity", "intimidation"],
        correctResponse: "verify-employment",
        responses: [
            { id: "provide-access", text: "Provide access - they seem to know company details", correct: false },
            { id: "verify-employment", text: "Verify their employment with HR or the MD's office", correct: true },
            { id: "escort-them", text: "Escort them to reception to wait", correct: false },
            { id: "partial-access", text: "Give them access to common areas only", correct: false }
        ]
    },
    {
        id: 5,
        title: "The Emergency Contractor",
        description: "During evening hours, someone claiming to be an emergency contractor arrives. They say there's a critical equipment failure that needs immediate repair to prevent production delays. They have some tools but no proper work order or company identification.",
        pressureTactics: ["urgency", "financial pressure", "authority"],
        correctResponse: "verify-emergency",
        responses: [
            { id: "immediate-access", text: "Provide immediate access to prevent delays", correct: false },
            { id: "verify-emergency", text: "Contact management to verify the emergency", correct: true },
            { id: "deny-access", text: "Deny access until normal business hours", correct: false },
            { id: "supervise-work", text: "Allow access but supervise their work", correct: false }
        ]
    },
    {
        id: 6,
        title: "The New Employee Claim",
        description: "Someone approaches claiming to be a new employee starting today. They say their ID card hasn't been processed yet and HR told them to find their supervisor on the production floor. They seem nervous but knowledgeable about the company structure.",
        pressureTactics: ["familiarity", "authority", "sympathy"],
        correctResponse: "hr-verification",
        responses: [
            { id: "direct-supervisor", text: "Direct them to the production floor to find their supervisor", correct: false },
            { id: "hr-verification", text: "Contact HR to verify their employment status", correct: true },
            { id: "temporary-access", text: "Provide temporary visitor access", correct: false },
            { id: "wait-reception", text: "Have them wait in reception indefinitely", correct: false }
        ]
    }
];

// Clean desk workspace data
const workspaceData = {
    supervisor: {
        title: "Production Supervisor Desk",
        description: "Secure recipe books, quality reports, and production schedules",
        items: [
            { id: "recipe-book", name: "Recipe Formulation Book", sensitivity: "confidential", secured: false },
            { id: "quality-report", name: "Daily Quality Reports", sensitivity: "internal", secured: false },
            { id: "schedule", name: "Production Schedule", sensitivity: "internal", secured: false },
            { id: "employee-notes", name: "Employee Performance Notes", sensitivity: "confidential", secured: false },
            { id: "supplier-list", name: "Supplier Contact List", sensitivity: "internal", secured: false }
        ]
    },
    hr: {
        title: "HR Workstation",
        description: "Secure employee files, payroll information, and contracts",
        items: [
            { id: "payroll", name: "Payroll Spreadsheet", sensitivity: "confidential", secured: false },
            { id: "employee-files", name: "Employee Personnel Files", sensitivity: "confidential", secured: false },
            { id: "contracts", name: "Employment Contracts", sensitivity: "confidential", secured: false },
            { id: "disciplinary", name: "Disciplinary Records", sensitivity: "confidential", secured: false },
            { id: "medical", name: "Medical Information", sensitivity: "restricted", secured: false }
        ]
    },
    lab: {
        title: "Laboratory Bench",
        description: "Secure test results, formulation notes, and samples",
        items: [
            { id: "test-results", name: "Quality Test Results", sensitivity: "internal", secured: false },
            { id: "formulations", name: "Product Formulation Notes", sensitivity: "confidential", secured: false },
            { id: "supplier-tests", name: "Supplier Quality Reports", sensitivity: "internal", secured: false },
            { id: "research", name: "R&D Project Notes", sensitivity: "confidential", secured: false },
            { id: "samples", name: "Product Samples", sensitivity: "internal", secured: false }
        ]
    },
    reception: {
        title: "Reception Area",
        description: "Secure visitor logs, company directory, and contact information",
        items: [
            { id: "visitor-log", name: "Daily Visitor Log", sensitivity: "internal", secured: false },
            { id: "phone-list", name: "Internal Phone Directory", sensitivity: "internal", secured: false },
            { id: "org-chart", name: "Company Organization Chart", sensitivity: "internal", secured: false },
            { id: "contact-cards", name: "Business Cards Collection", sensitivity: "public", secured: false },
            { id: "delivery-schedule", name: "Delivery Schedule", sensitivity: "internal", secured: false }
        ]
    }
};

// Assessment questions data
const assessmentQuestions = {
    access: [
        {
            id: "access-1",
            question: "A contractor arrives with proper documentation but no safety certification. What do you do?",
            scenario: "Equipment maintenance contractor needs to work on production line machinery.",
            options: [
                "Allow access with safety briefing",
                "Refuse access until certification provided",
                "Allow access with constant supervision", 
                "Contact their company to verify certification"
            ],
            correct: 1,
            explanation: "Safety certification is mandatory for production area access."
        }
    ],
    workstation: [
        {
            id: "workstation-1", 
            question: "You notice a colleague has left confidential documents on their desk overnight. What should you do?",
            scenario: "Production formulation sheets are visible on an unattended workstation.",
            options: [
                "Leave them - not your responsibility",
                "Secure them in a locked drawer",
                "Move them to your desk for safekeeping",
                "Email the colleague about it"
            ],
            correct: 1,
            explanation: "Secure documents immediately to prevent unauthorized access."
        }
    ],
    equipment: [
        {
            id: "equipment-1",
            question: "A tablet used for quality control is left unattended and unlocked. Your response?",
            scenario: "The device contains sensitive production data and quality reports.",
            options: [
                "Lock the device and leave it",
                "Take it to the owner",
                "Report to security immediately",
                "Continue with your work"
            ],
            correct: 0,
            explanation: "Immediately lock the device to protect sensitive data."
        }
    ],
    incident: [
        {
            id: "incident-1",
            question: "You discover an unlocked emergency exit with no alarm. What is your first action?",
            scenario: "The exit shows signs of recent use and the alarm panel is disabled.",
            options: [
                "Check who might have used it",
                "Re-lock and reset alarm",
                "Report incident immediately",
                "Monitor the area for suspicious activity"
            ],
            correct: 2,
            explanation: "Report security breaches immediately for proper investigation."
        }
    ],
    emergency: [
        {
            id: "emergency-1",
            question: "During a fire evacuation, how do you handle access control?",
            scenario: "Fire alarm activated, employees evacuating through security doors.",
            options: [
                "Maintain all security protocols",
                "Open all doors for faster evacuation",
                "Follow emergency access procedures",
                "Lock down to prevent unauthorized entry"
            ],
            correct: 2,
            explanation: "Emergency procedures balance safety with security requirements."
        }
    ]
};

// ============================================
// INITIALIZATION AND NAVIGATION
// ============================================

function initializeModule4() {
    console.log('Initializing Module 4: Physical Security Training');
    
    // Initialize state from localStorage if available
    loadModule4State();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the briefing section
    showSection('briefing-section');
    
    // Update progress display
    updateModuleProgress();
    
    console.log('Module 4 initialized successfully');
}

function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', handleAction);
    });
    
    // Location selector buttons
    document.querySelectorAll('.location-btn').forEach(button => {
        button.addEventListener('click', handleLocationSelect);
    });
    
    // Workspace cards
    document.querySelectorAll('.workspace-card').forEach(card => {
        card.addEventListener('click', handleWorkspaceSelect);
    });
    
    // Category cards for assessment
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', handleCategorySelect);
    });
}

function handleAction(event) {
    const action = event.target.getAttribute('data-action');
    const phase = event.target.getAttribute('data-phase');
    
    switch(action) {
        case 'start-training':
            startPhase1();
            break;
        case 'complete-phase':
            completePhase(parseInt(phase));
            break;
        case 'complete-module':
            completeModule4();
            break;
        case 'return-home':
            window.location.href = 'index.html';
            break;
    }
}

// ============================================
// PHASE 1: FACILITY WALKTHROUGH
// ============================================

function startPhase1() {
    console.log('Starting Phase 1: Facility Walkthrough');
    module4State.currentPhase = 1;
    module4State.currentSection = 'phase-1';
    
    showSection('phase-1');
    initializeFacilityWalkthrough();
    updateModuleProgress();
    
    // Award first badge
    if (!module4State.achievements.includes('security-trainee')) {
        awardAchievement('security-trainee', '🛡️ Security Trainee', 'Started facility security training');
    }
}

function initializeFacilityWalkthrough() {
    // Initialize with production floor
    selectLocation('production');
    
    // Reset hotspot counter
    module4State.progress.hotspotsFound = 0;
    updateWalkthroughScore();
}

function handleLocationSelect(event) {
    const location = event.target.getAttribute('data-location');
    selectLocation(location);
    
    // Update active button
    document.querySelectorAll('.location-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function selectLocation(locationId) {
    const location = facilityLocations[locationId];
    if (!location) return;
    
    // Update location display
    document.getElementById('location-image').src = location.image;
    document.getElementById('location-image').alt = location.title;
    document.getElementById('location-title').textContent = location.title;
    document.getElementById('location-description').textContent = location.description;
    
    // Clear existing hotspots
    document.querySelectorAll('.security-hotspot').forEach(hotspot => hotspot.remove());
    
    // Add hotspots for this location
    addSecurityHotspots(location.hotspots);
}

function addSecurityHotspots(hotspots) {
    const container = document.querySelector('.location-image-container');
    
    hotspots.forEach(hotspot => {
        const hotspotElement = document.createElement('div');
        hotspotElement.className = 'security-hotspot';
        hotspotElement.style.left = hotspot.x + '%';
        hotspotElement.style.top = hotspot.y + '%';
        hotspotElement.setAttribute('data-hotspot-id', hotspot.id);
        hotspotElement.setAttribute('title', hotspot.description);
        
        hotspotElement.addEventListener('click', () => handleHotspotClick(hotspot));
        
        container.appendChild(hotspotElement);
    });
}

function handleHotspotClick(hotspot) {
    const hotspotElement = document.querySelector(`[data-hotspot-id="${hotspot.id}"]`);
    
    if (hotspotElement.classList.contains('found')) return;
    
    // Mark as found
    hotspotElement.classList.add('found');
    module4State.progress.hotspotsFound++;
    
    // Update score
    module4State.scores.walkthrough += 10;
    updateWalkthroughScore();
    
    // Show feedback
    showFeedback('walkthrough-feedback', `✅ Security concern identified: ${hotspot.description}`, 'success');
    
    // Check if phase complete
    if (module4State.progress.hotspotsFound >= 12) {
        document.getElementById('phase-1-btn').disabled = false;
        showFeedback('walkthrough-feedback', '🎉 Facility walkthrough complete! All security concerns identified.', 'success');
    }
}

function updateWalkthroughScore() {
    document.getElementById('hotspots-found').textContent = module4State.progress.hotspotsFound;
    document.getElementById('total-hotspots').textContent = '12';
    document.getElementById('walkthrough-score').textContent = module4State.scores.walkthrough;
    
    const progress = (module4State.progress.hotspotsFound / 12) * 100;
    document.getElementById('walkthrough-progress').style.width = progress + '%';
}

// ============================================
// PHASE 2: VISITOR MANAGEMENT
// ============================================

function startPhase2() {
    console.log('Starting Phase 2: Visitor Management');
    module4State.currentPhase = 2;
    module4State.currentSection = 'phase-2';
    
    showSection('phase-2');
    initializeVisitorManagement();
    updateModuleProgress();
    
    // Award achievement
    if (!module4State.achievements.includes('access-controller')) {
        awardAchievement('access-controller', '🚪 Access Controller', 'Mastered facility access procedures');
    }
}

function initializeVisitorManagement() {
    module4State.progress.visitorsProcessed = 0;
    showVisitor(0);
}

function showVisitor(index) {
    if (index >= visitorScenarios.length) {
        completeVisitorPhase();
        return;
    }
    
    const visitor = visitorScenarios[index];
    const visitorCard = document.getElementById('visitor-card');
    
    visitorCard.innerHTML = `
        <div class="visitor-details">
            <img src="${visitor.photo}" alt="${visitor.name}" class="visitor-photo">
            <h3>${visitor.name}</h3>
            <p><strong>Type:</strong> ${visitor.type}</p>
            <p><strong>Company:</strong> ${visitor.company}</p>
            <p><strong>Purpose:</strong> ${visitor.purpose}</p>
            <p><strong>Documentation:</strong> ${visitor.documentation}</p>
        </div>
    `;
    
    // Update counter
    document.getElementById('current-visitor').textContent = index + 1;
    document.getElementById('total-visitors').textContent = visitorScenarios.length;
    
    // Show action buttons
    showVisitorActions(visitor);
}

function showVisitorActions(visitor) {
    const actionsContainer = document.getElementById('visitor-actions');
    
    actionsContainer.innerHTML = visitor.actions.map(action => `
        <button class="action-btn" onclick="handleVisitorAction('${action.id}', ${visitor.correct}, ${visitor.id})">
            ${action.text}
        </button>
    `).join('');
}

function handleVisitorAction(actionId, isCorrect, visitorId) {
    const buttons = document.querySelectorAll('#visitor-actions .action-btn');
    const visitor = visitorScenarios.find(v => v.id === visitorId);
    const action = visitor.actions.find(a => a.id === actionId);
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show result
    if (action.correct) {
        document.querySelector(`[onclick*="${actionId}"]`).classList.add('correct');
        module4State.scores.visitor += 20;
        showFeedback('visitor-feedback', '✅ Correct! Proper security protocol followed.', 'success');
    } else {
        document.querySelector(`[onclick*="${actionId}"]`).classList.add('incorrect');
        // Highlight correct answer
        const correctAction = visitor.actions.find(a => a.correct);
        document.querySelector(`[onclick*="${correctAction.id}"]`).classList.add('correct');
        showFeedback('visitor-feedback', '❌ Incorrect. The correct action has been highlighted.', 'error');
    }
    
    // Continue to next visitor after delay
    setTimeout(() => {
        module4State.progress.visitorsProcessed++;
        showVisitor(module4State.progress.visitorsProcessed);
    }, 2000);
}

function completeVisitorPhase() {
    document.getElementById('phase-2-btn').disabled = false;
    showFeedback('visitor-feedback', '🎉 Visitor management training complete!', 'success');
    
    // Award achievement for perfect score
    if (module4State.scores.visitor === 100) {
        awardAchievement('visitor-manager', '👥 Visitor Manager', 'Perfect score on visitor scenarios');
    }
}

// ============================================
// PHASE 3: SOCIAL ENGINEERING DEFENCE
// ============================================

function startPhase3() {
    console.log('Starting Phase 3: Social Engineering Defence');
    module4State.currentPhase = 3;
    module4State.currentSection = 'phase-3';
    
    showSection('phase-3');
    initializeSocialEngineering();
    updateModuleProgress();
    
    // Award achievement
    if (!module4State.achievements.includes('workspace-guardian')) {
        awardAchievement('workspace-guardian', '💼 Workspace Guardian', 'Advanced to social engineering defence');
    }
}

function initializeSocialEngineering() {
    module4State.progress.scenariosCompleted = 0;
    showSocialScenario(0);
}

function showSocialScenario(index) {
    if (index >= socialScenarios.length) {
        completeSocialPhase();
        return;
    }
    
    const scenario = socialScenarios[index];
    const scenarioContainer = document.getElementById('social-scenario');
    
    scenarioContainer.innerHTML = `
        <div class="scenario-title">${scenario.title}</div>
        <div class="scenario-description">${scenario.description}</div>
        <div class="pressure-indicators">
            ${scenario.pressureTactics.map(tactic => `<span class="pressure-tag">${tactic}</span>`).join('')}
        </div>
    `;
    
    // Update counter
    document.getElementById('current-scenario').textContent = index + 1;
    document.getElementById('total-scenarios').textContent = socialScenarios.length;
    
    // Show response options
    showResponseOptions(scenario);
}

function showResponseOptions(scenario) {
    const optionsContainer = document.getElementById('response-options');
    
    optionsContainer.innerHTML = scenario.responses.map(response => `
        <button class="action-btn" onclick="handleSocialResponse('${response.id}', ${response.correct}, ${scenario.id})">
            ${response.text}
        </button>
    `).join('');
}

function handleSocialResponse(responseId, isCorrect, scenarioId) {
    const buttons = document.querySelectorAll('#response-options .action-btn');
    const scenario = socialScenarios.find(s => s.id === scenarioId);
    const response = scenario.responses.find(r => r.id === responseId);
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    // Show result
    if (response.correct) {
        document.querySelector(`[onclick*="${responseId}"]`).classList.add('correct');
        module4State.scores.social += 15;
        document.getElementById('correct-responses').textContent = parseInt(document.getElementById('correct-responses').textContent) + 1;
        showFeedback('social-feedback', '✅ Excellent! You successfully identified and countered the social engineering attempt.', 'success');
    } else {
        document.querySelector(`[onclick*="${responseId}"]`).classList.add('incorrect');
        // Highlight correct answer
        const correctResponse = scenario.responses.find(r => r.correct);
        document.querySelector(`[onclick*="${correctResponse.id}"]`).classList.add('correct');
        showFeedback('social-feedback', '❌ Be careful! This response could compromise security. The correct action is highlighted.', 'error');
    }
    
    // Continue to next scenario after delay
    setTimeout(() => {
        module4State.progress.scenariosCompleted++;
        showSocialScenario(module4State.progress.scenariosCompleted);
    }, 3000);
}

function completeSocialPhase() {
    document.getElementById('phase-3-btn').disabled = false;
    showFeedback('social-feedback', '🎉 Social engineering defence training complete!', 'success');
    
    // Award achievement for high score
    if (module4State.scores.social >= 75) {
        awardAchievement('social-engineer-stopper', '🕵️ Social Engineer Stopper', 'Identified most manipulation attempts');
    }
}

// ============================================
// PHASE 4: CLEAN DESK CHALLENGE
// ============================================

function startPhase4() {
    console.log('Starting Phase 4: Clean Desk Challenge');
    module4State.currentPhase = 4;
    module4State.currentSection = 'phase-4';
    
    showSection('phase-4');
    initializeCleanDesk();
    updateModuleProgress();
    
    // Award achievement
    if (!module4State.achievements.includes('incident-responder')) {
        awardAchievement('incident-responder', '🚨 Incident Responder', 'Reached final training phase');
    }
}

function initializeCleanDesk() {
    module4State.progress.workspacesSecured = 0;
    updateCleanDeskScore();
}

function handleWorkspaceSelect(event) {
    const workspaceId = event.target.closest('.workspace-card').getAttribute('data-workspace');
    if (!workspaceId) return;
    
    startWorkspaceCleaning(workspaceId);
}

function startWorkspaceCleaning(workspaceId) {
    const workspace = workspaceData[workspaceId];
    if (!workspace) return;
    
    // Hide workspace selector, show cleaning interface
    document.querySelector('.workspace-selector').style.display = 'none';
    const cleaningArea = document.getElementById('clean-desk-workspace');
    cleaningArea.style.display = 'block';
    
    cleaningArea.innerHTML = `
        <h3>Securing: ${workspace.title}</h3>
        <p>${workspace.description}</p>
        
        <div class="document-items">
            ${workspace.items.map(item => `
                <div class="document-item" data-item-id="${item.id}" data-sensitivity="${item.sensitivity}">
                    <h4>${item.name}</h4>
                    <span class="sensitivity-level">${item.sensitivity}</span>
                </div>
            `).join('')}
        </div>
        
        <div class="security-zones">
            <div class="security-zone" data-zone="public">
                <h4>🌐 Public Access</h4>
                <p>No security required</p>
            </div>
            <div class="security-zone" data-zone="locked">
                <h4>🔒 Locked Storage</h4>
                <p>Locked drawer/cabinet</p>
            </div>
            <div class="security-zone" data-zone="safe">
                <h4>🛡️ Safe/Vault</h4>
                <p>High security storage</p>
            </div>
        </div>
        
        <div class="workspace-actions">
            <button class="btn btn-primary" onclick="checkWorkspaceSecurity('${workspaceId}')">Check Security</button>
            <button class="btn btn-secondary" onclick="returnToWorkspaceSelector()">Back to Workspace Selection</button>
        </div>
    `;
    
    // Add drag and drop functionality
    setupDragAndDrop();
}

function setupDragAndDrop() {
    // Make documents draggable
    document.querySelectorAll('.document-item').forEach(item => {
        item.draggable = true;
        item.addEventListener('dragstart', handleDragStart);
    });
    
    // Make zones droppable
    document.querySelectorAll('.security-zone').forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragenter', handleDragEnter);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

function handleDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.getAttribute('data-item-id'));
    event.dataTransfer.setData('sensitivity', event.target.getAttribute('data-sensitivity'));
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDragEnter(event) {
    event.target.closest('.security-zone').classList.add('drop-target');
}

function handleDragLeave(event) {
    if (!event.target.closest('.security-zone').contains(event.relatedTarget)) {
        event.target.closest('.security-zone').classList.remove('drop-target');
    }
}

function handleDrop(event) {
    event.preventDefault();
    const zone = event.target.closest('.security-zone');
    zone.classList.remove('drop-target');
    
    const itemId = event.dataTransfer.getData('text/plain');
    const sensitivity = event.dataTransfer.getData('sensitivity');
    const zoneType = zone.getAttribute('data-zone');
    
    const item = document.querySelector(`[data-item-id="${itemId}"]`);
    
    // Check if placement is correct
    const correctPlacement = isCorrectPlacement(sensitivity, zoneType);
    
    if (correctPlacement) {
        item.classList.add('secured');
        zone.appendChild(item);
        item.style.backgroundColor = 'rgba(0, 255, 0, 0.2)';
    } else {
        // Show error feedback
        showFeedback('clean-desk-feedback', `❌ ${sensitivity} documents don't belong in ${zoneType} storage`, 'error');
        return;
    }
}

function isCorrectPlacement(sensitivity, zoneType) {
    const placements = {
        'public': ['public'],
        'locked': ['internal'],
        'safe': ['confidential', 'restricted']
    };
    
    return placements[zoneType] && placements[zoneType].includes(sensitivity);
}

function checkWorkspaceSecurity(workspaceId) {
    const workspace = workspaceData[workspaceId];
    const securedItems = document.querySelectorAll('.document-item.secured').length;
    const totalItems = workspace.items.length;
    
    if (securedItems === totalItems) {
        // Workspace secured
        module4State.progress.workspacesSecured++;
        document.querySelector(`#${workspaceId}-status`).textContent = 'Secured';
        document.querySelector(`[data-workspace="${workspaceId}"]`).classList.add('secured');
        
        showFeedback('clean-desk-feedback', '✅ Workspace secured successfully!', 'success');
        
        returnToWorkspaceSelector();
        updateCleanDeskScore();
        
        // Check if all workspaces secured
        if (module4State.progress.workspacesSecured === 4) {
            document.getElementById('phase-4-btn').disabled = false;
            awardAchievement('document-guardian', '📄 Document Guardian', 'Secured all workspaces perfectly');
        }
    } else {
        showFeedback('clean-desk-feedback', `❌ ${totalItems - securedItems} items still need proper security`, 'error');
    }
}

function returnToWorkspaceSelector() {
    document.querySelector('.workspace-selector').style.display = 'block';
    document.getElementById('clean-desk-workspace').style.display = 'none';
}

function updateCleanDeskScore() {
    document.getElementById('secured-count').textContent = module4State.progress.workspacesSecured;
    const score = Math.round((module4State.progress.workspacesSecured / 4) * 100);
    document.getElementById('clean-desk-score').textContent = score;
    module4State.scores.cleanDesk = score;
}

// ============================================
// FINAL ASSESSMENT
// ============================================

function startFinalAssessment() {
    console.log('Starting Final Assessment');
    module4State.currentSection = 'assessment-phase';
    
    showSection('assessment-phase');
    initializeAssessment();
    updateModuleProgress();
}

function initializeAssessment() {
    module4State.progress.assessmentQuestions = 0;
    module4State.scores.assessment = 0;
    showAssessmentCategory('access');
}

function handleCategorySelect(event) {
    const category = event.target.closest('.category-card').getAttribute('data-category');
    showAssessmentCategory(category);
}

function showAssessmentCategory(category) {
    const questions = assessmentQuestions[category];
    if (!questions) return;
    
    // Mark category as active
    document.querySelectorAll('.category-card').forEach(card => card.classList.remove('active'));
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
    
    // Show questions
    const container = document.getElementById('assessment-container');
    container.innerHTML = questions.map((q, index) => `
        <div class="assessment-question" data-question-id="${q.id}">
            <div class="question-title">Question ${index + 1}: ${q.question}</div>
            <div class="question-scenario">${q.scenario}</div>
            <div class="answer-options">
                ${q.options.map((option, optIndex) => `
                    <button class="answer-option" onclick="selectAnswer('${q.id}', ${optIndex}, ${q.correct})">
                        ${option}
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');
}

function selectAnswer(questionId, selectedIndex, correctIndex) {
    const question = document.querySelector(`[data-question-id="${questionId}"]`);
    const options = question.querySelectorAll('.answer-option');
    
    // Disable all options
    options.forEach(opt => opt.disabled = true);
    
    // Show results
    options[selectedIndex].classList.add('selected');
    options[correctIndex].classList.add('correct');
    
    if (selectedIndex === correctIndex) {
        module4State.scores.assessment += 20;
        showFeedback('assessment-feedback', '✅ Correct!', 'success');
    } else {
        options[selectedIndex].classList.add('incorrect');
        showFeedback('assessment-feedback', '❌ Incorrect. The correct answer is highlighted.', 'error');
    }
    
    module4State.progress.assessmentQuestions++;
    updateAssessmentProgress();
    
    // Mark category as completed
    const activeCategory = document.querySelector('.category-card.active');
    setTimeout(() => {
        activeCategory.classList.add('completed');
        activeCategory.classList.remove('active');
        
        // Check if assessment complete
        if (module4State.progress.assessmentQuestions >= 5) {
            completeAssessment();
        }
    }, 1500);
}

function updateAssessmentProgress() {
    const progress = (module4State.progress.assessmentQuestions / 5) * 100;
    document.getElementById('assessment-progress').style.width = progress + '%';
    document.getElementById('assessment-score').textContent = `Score: ${module4State.scores.assessment}/100 (Pass: 80+)`;
}

function completeAssessment() {
    if (module4State.scores.assessment >= 80) {
        document.getElementById('complete-btn').disabled = false;
        showFeedback('assessment-feedback', '🎉 Assessment passed! You are now certified as a Facility Guardian.', 'success');
        
        // Award final achievement
        awardAchievement('site-protector', '🏰 Site Protector', 'Passed the security audit assessment');
        
        if (module4State.scores.assessment >= 95) {
            awardAchievement('security-champion', '🎯 Security Champion', 'Achieved excellence in security assessment');
        }
    } else {
        showFeedback('assessment-feedback', '❌ Assessment failed. You need 80% to pass. Review the material and try again.', 'error');
    }
}

// ============================================
// MODULE COMPLETION
// ============================================

function completePhase(phaseNumber) {
    if (!module4State.completedPhases.includes(phaseNumber)) {
        module4State.completedPhases.push(phaseNumber);
        saveModule4State();
    }
    
    switch(phaseNumber) {
        case 1:
            startPhase2();
            break;
        case 2:
            startPhase3();
            break;
        case 3:
            startPhase4();
            break;
        case 4:
            startFinalAssessment();
            break;
    }
}

function completeModule4() {
    console.log('Completing Module 4');
    
    // Calculate final score
    const totalScore = Math.round(
        (module4State.scores.walkthrough + 
         module4State.scores.visitor + 
         module4State.scores.social + 
         module4State.scores.cleanDesk + 
         module4State.scores.assessment) / 5
    );
    
    // Use the global progress system
    if (typeof window.digitalShieldProgress !== 'undefined') {
        window.digitalShieldProgress.completeModule(4, totalScore);
    }
    
    // Award final achievement
    awardAchievement('facility-guardian', '🏰 Facility Guardian', 'Completed all physical security training');
    
    // Show completion message
    alert(`🎉 Module 4 Complete!\n\nFinal Score: ${totalScore}%\n\nYou are now certified in Physical Security protocols!`);
    
    // Return to main menu after delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.training-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        module4State.currentSection = sectionId;
        saveModule4State();
    }
}

function showFeedback(containerId, message, type = 'info') {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.textContent = message;
    container.className = `feedback-box ${type}`;
    
    // Add visual feedback
    container.style.animation = 'none';
    container.offsetHeight; // Trigger reflow
    container.style.animation = 'pulse 0.5s ease-in-out';
}

function updateModuleProgress() {
    const totalPhases = 4;
    const completedPhases = module4State.completedPhases.length;
    const progressPercentage = Math.round((completedPhases / totalPhases) * 100);
    
    const progressElement = document.getElementById('module-progress');
    if (progressElement) {
        progressElement.textContent = progressPercentage + '%';
    }
}

function awardAchievement(id, name, description) {
    if (module4State.achievements.includes(id)) return;
    
    module4State.achievements.push(id);
    saveModule4State();
    
    // Show achievement modal
    showAchievementModal(name, description);
    
    // Use global badge system if available
    if (typeof showBadgeNotification !== 'undefined') {
        showBadgeNotification(name);
    }
}

function showAchievementModal(name, description) {
    const modal = document.getElementById('achievement-modal');
    const badgeDisplay = document.getElementById('badge-display');
    
    badgeDisplay.innerHTML = `
        <div class="badge-icon">🏆</div>
        <div class="badge-name">${name}</div>
        <div class="badge-description">${description}</div>
    `;
    
    modal.style.display = 'flex';
    
    // Auto-close after 3 seconds
    setTimeout(() => {
        closeAchievementModal();
    }, 3000);
}

function closeAchievementModal() {
    const modal = document.getElementById('achievement-modal');
    modal.style.display = 'none';
}

function saveModule4State() {
    try {
        localStorage.setItem('module4State', JSON.stringify(module4State));
    } catch (error) {
        console.error('Error saving module state:', error);
    }
}

function loadModule4State() {
    try {
        const saved = localStorage.getItem('module4State');
        if (saved) {
            module4State = { ...module4State, ...JSON.parse(saved) };
        }
    } catch (error) {
        console.error('Error loading module state:', error);
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeModule4();
});

// Export functions for global access
window.Module4 = {
    initializeModule4,
    startPhase1,
    startPhase2, 
    startPhase3,
    startPhase4,
    completeModule4,
    closeAchievementModal
};

console.log('Module 4: Physical Security Training loaded successfully');
