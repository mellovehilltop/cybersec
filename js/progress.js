// Progress Tracking System for Digital Shield Training

// Global progress state
let trainingProgress = {
    completedModules: [],
    moduleScores: {},
    totalTimeSpent: 0,
    startDate: null,
    lastAccessed: null,
    badgesEarned: [],
    assessmentUnlocked: false,
    assessmentCompleted: false
};

// Module information
const moduleInfo = {
    1: { name: "Email Security", duration: 15, difficulty: 3 },
    2: { name: "Password Security", duration: 12, difficulty: 2 },
    3: { name: "Internet Security", duration: 18, difficulty: 3 },
    4: { name: "Physical Security", duration: 10, difficulty: 2 },
    5: { name: "Data Protection", duration: 20, difficulty: 4 }
};

// Load progress from localStorage
function loadProgress() {
    try {
        const saved = localStorage.getItem('digitalShieldProgress');
        if (saved) {
            trainingProgress = { ...trainingProgress, ...JSON.parse(saved) };
        }
        
        // Set start date if first time
        if (!trainingProgress.startDate) {
            trainingProgress.startDate = new Date().toISOString();
        }
        
        // Update last accessed
        trainingProgress.lastAccessed = new Date().toISOString();
        saveProgress();
        
    } catch (error) {
        console.error('Error loading progress:', error);
        resetProgress();
    }
}

// Save progress to localStorage
function saveProgress() {
    try {
        localStorage.setItem('digitalShieldProgress', JSON.stringify(trainingProgress));
    } catch (error) {
        console.error('Error saving progress:', error);
    }
}

// Check if module is unlocked
function isModuleUnlocked(moduleNumber) {
    // Module 1 is always unlocked
    if (moduleNumber === 1) return true;
    
    // Other modules require previous module completion
    return trainingProgress.completedModules.includes(moduleNumber - 1);
}

// Complete a module
function completeModule(moduleNumber, score = 100) {
    if (!trainingProgress.completedModules.includes(moduleNumber)) {
        trainingProgress.completedModules.push(moduleNumber);
        trainingProgress.moduleScores[moduleNumber] = score;
        
        // Add estimated time
        if (moduleInfo[moduleNumber]) {
            trainingProgress.totalTimeSpent += moduleInfo[moduleNumber].duration;
        }
        
        // Check for badges
        checkForBadges(moduleNumber);
        
        // Check if assessment should be unlocked
        if (trainingProgress.completedModules.length === 5) {
            trainingProgress.assessmentUnlocked = true;
        }
        
        saveProgress();
        updateProgressDisplay();
        
        console.log(`Module ${moduleNumber} completed with score: ${score}%`);
    }
}

// Check for new badges
function checkForBadges(moduleNumber) {
    const badges = [];
    
    // Module completion badges
    badges.push(`module_${moduleNumber}_complete`);
    
    // Perfect score badges
    if (trainingProgress.moduleScores[moduleNumber] === 100) {
        badges.push(`module_${moduleNumber}_perfect`);
    }
    
    // Milestone badges
    if (trainingProgress.completedModules.length === 1) {
        badges.push('first_steps');
    } else if (trainingProgress.completedModules.length === 3) {
        badges.push('halfway_hero');
    } else if (trainingProgress.completedModules.length === 5) {
        badges.push('training_complete');
    }
    
    // Add new badges
    badges.forEach(badge => {
        if (!trainingProgress.badgesEarned.includes(badge)) {
            trainingProgress.badgesEarned.push(badge);
            showBadgeNotification(badge);
        }
    });
}

// Show badge notification
function showBadgeNotification(badge) {
    const badgeNames = {
        'first_steps': '🚀 First Steps',
        'halfway_hero': '⭐ Halfway Hero',
        'training_complete': '🎓 Training Master',
        'module_1_complete': '📧 Email Guardian',
        'module_2_complete': '🔐 Vault Keeper',
        'module_3_complete': '🌐 Navigator',
        'module_4_complete': '🏰 Safehouse Protector',
        'module_5_complete': '🛡️ Data Guardian',
        'module_1_perfect': '💎 Email Expert',
        'module_2_perfect': '💎 Password Expert',
        'module_3_perfect': '💎 Internet Expert',
        'module_4_perfect': '💎 Security Expert',
        'module_5_perfect': '💎 Privacy Expert'
    };
    
    const badgeName = badgeNames[badge] || badge;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'badge-notification';
    notification.innerHTML = `
        <div class="badge-content">
            <h3>🏆 BADGE EARNED!</h3>
            <p>${badgeName}</p>
        </div>
    `;
    
    // Add CSS for notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #f39c12, #e67e22);
        color: #000;
        padding: 20px;
        border-radius: 10px;
        border: 2px solid #f39c12;
        box-shadow: 0 10px 30px rgba(243, 156, 18, 0.5);
        z-index: 1000;
        animation: slideIn 0.5s ease-out;
        max-width: 300px;
        text-align: center;
        font-weight: bold;
    `;
    
    // Add animation keyframes
    if (!document.getElementById('badge-animations')) {
        const style = document.createElement('style');
        style.id = 'badge-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 4000);
}

// Update the progress display on file system landing page
function updateProgressDisplay() {
    // Update overall progress
    const overallProgress = Math.round((trainingProgress.completedModules.length / 5) * 100);
    updateElement('overall-progress', `${overallProgress}%`);
    updateElement('files-completed', trainingProgress.completedModules.length);
    
    // Update file status
    for (let i = 1; i <= 5; i++) {
        updateFileStatus(i);
    }
    
    // Update final assessment requirements
    updateFinalAssessmentStatus();
    
    // Update agent rank/clearance
    updateAgentClearance();
}

// Update individual file status
function updateFileStatus(moduleNumber) {
    const fileElement = document.getElementById(`file-${moduleNumber}`);
    const statusElement = document.getElementById(`status-${moduleNumber}`);
    const buttonElement = document.getElementById(`btn-${moduleNumber}`);
    
    if (!fileElement || !statusElement || !buttonElement) return;
    
    const isCompleted = trainingProgress.completedModules.includes(moduleNumber);
    const isUnlocked = isModuleUnlocked(moduleNumber);
    
    // Update file appearance
    fileElement.classList.remove('locked');
    if (!isUnlocked) {
        fileElement.classList.add('locked');
    }
    
    // Update status badge
    const statusBadge = statusElement.querySelector('.status-badge');
    if (isCompleted) {
        statusBadge.textContent = '✓ COMPLETED';
        statusBadge.className = 'status-badge completed';
    } else if (isUnlocked) {
        statusBadge.textContent = 'AVAILABLE';
        statusBadge.className = 'status-badge new';
    } else {
        statusBadge.textContent = '🔒 LOCKED';
        statusBadge.className = 'status-badge locked';
    }
    
    // Update button
    if (isCompleted) {
        buttonElement.textContent = 'REVIEW FILE';
        buttonElement.disabled = false;
    } else if (isUnlocked) {
        buttonElement.textContent = 'OPEN FILE';
        buttonElement.disabled = false;
    } else {
        buttonElement.textContent = 'CLEARANCE REQUIRED';
        buttonElement.disabled = true;
    }
}

// Update final assessment status
function updateFinalAssessmentStatus() {
    const finalFile = document.getElementById('final-assessment-file');
    const finalBtn = document.getElementById('final-btn');
    const requirementsList = document.getElementById('clearance-requirements');
    
    if (!finalFile || !finalBtn) return;
    
    // Update requirement checkmarks
    for (let i = 1; i <= 5; i++) {
        const requirement = document.querySelector(`.requirement[data-module="${i}"]`);
        if (requirement) {
            const isCompleted = trainingProgress.completedModules.includes(i);
            const statusSpan = requirement.querySelector('.req-status');
            
            if (isCompleted) {
                requirement.className = 'requirement complete';
                if (statusSpan) statusSpan.textContent = '✅';
            } else {
                requirement.className = 'requirement incomplete';
                if (statusSpan) statusSpan.textContent = '❌';
            }
        }
    }
    
    // Update final assessment availability
    if (trainingProgress.assessmentUnlocked) {
        finalFile.classList.remove('locked');
        finalBtn.disabled = false;
        finalBtn.textContent = '🎯 BEGIN ASSESSMENT';
    } else {
        finalFile.classList.add('locked');
        finalBtn.disabled = true;
        finalBtn.textContent = '🔒 ACCESS DENIED';
    }
    
    if (trainingProgress.assessmentCompleted) {
        finalBtn.textContent = '🏆 RETAKE ASSESSMENT';
    }
}

// Update agent clearance level
function updateAgentClearance() {
    const clearanceElement = document.querySelector('.clearance-level');
    const securityLevelElement = document.querySelector('.security-level');
    
    if (!clearanceElement) return;
    
    let clearance = 'TRAINEE CLEARANCE';
    let securityLevel = 'TRAINEE';
    const completed = trainingProgress.completedModules.length;
    
    if (trainingProgress.assessmentCompleted) {
        clearance = 'CERTIFIED AGENT';
        securityLevel = 'CERTIFIED';
    } else if (completed === 5) {
        clearance = 'SENIOR TRAINEE';
        securityLevel = 'SENIOR';
    } else if (completed >= 3) {
        clearance = 'JUNIOR CLEARANCE';
        securityLevel = 'JUNIOR';
    } else if (completed >= 1) {
        clearance = 'RECRUIT CLEARANCE';
        securityLevel = 'RECRUIT';
    }
    
    clearanceElement.textContent = clearance;
    if (securityLevelElement) {
        securityLevelElement.textContent = `SECURITY LEVEL: ${securityLevel}`;
    }
}

// Reset all progress (for testing)
function resetAllProgress() {
    if (confirm('Are you sure you want to reset ALL training progress? This cannot be undone.')) {
        localStorage.removeItem('digitalShieldProgress');
        trainingProgress = {
            completedModules: [],
            moduleScores: {},
            totalTimeSpent: 0,
            startDate: null,
            lastAccessed: null,
            badgesEarned: [],
            assessmentUnlocked: false,
            assessmentCompleted: false
        };
        updateProgressDisplay();
        alert('Progress reset successfully!');
    }
}

// Utility function to safely update element text
function updateElement(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}

// Get progress statistics
function getProgressStats() {
    const totalModules = 5;
    const completedCount = trainingProgress.completedModules.length;
    const averageScore = Object.values(trainingProgress.moduleScores).length > 0 ?
        Object.values(trainingProgress.moduleScores).reduce((a, b) => a + b, 0) / Object.values(trainingProgress.moduleScores).length : 0;
    
    return {
        overallProgress: Math.round((completedCount / totalModules) * 100),
        completedModules: completedCount,
        totalModules: totalModules,
        averageScore: Math.round(averageScore),
        timeSpent: trainingProgress.totalTimeSpent,
        badgesEarned: trainingProgress.badgesEarned.length,
        startDate: trainingProgress.startDate,
        lastAccessed: trainingProgress.lastAccessed,
        assessmentUnlocked: trainingProgress.assessmentUnlocked,
        assessmentCompleted: trainingProgress.assessmentCompleted
    };
}

// Export functions for use in other files
window.digitalShieldProgress = {
    loadProgress,
    saveProgress,
    completeModule,
    isModuleUnlocked,
    updateProgressDisplay,
    resetAllProgress,
    getProgressStats
};

// Initialize progress system
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    if (typeof updateProgressDisplay === 'function') {
        updateProgressDisplay();
    }
});

console.log('Digital Shield Progress System loaded');
