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

// Update the progress display on landing page
function updateProgressDisplay() {
    // Update overall progress
    const overallProgress = Math.round((trainingProgress.completedModules.length / 5) * 100);
    updateElement('overall-progress', `${overallProgress}%`);
    updateElement('modules-completed', trainingProgress.completedModules.length);
    updateElement('time-invested', `${trainingProgress.totalTimeSpent} min`);
    updateElement('badges-earned', trainingProgress.badgesEarned.length);
    
    // Update next objective
    let nextObjective = "Start Module 1";
    if (trainingProgress.completedModules.length === 5 && !trainingProgress.assessmentCompleted) {
        nextObjective = "Take Final Assessment";
    } else if (trainingProgress.completedModules.length < 5) {
        const nextModule = trainingProgress.completedModules.length + 1;
        nextObjective = `Complete Module ${nextModule}`;
    } else if (trainingProgress.assessmentCompleted) {
        nextObjective = "Training Complete! 🎉";
    }
    updateElement('next-objective', nextObjective);
    
    // Update module cards
    for (let i = 1; i <= 5; i++) {
        updateModuleCard(i);
    }
    
    // Update assessment requirements
    updateAssessmentRequirements();
    
    // Update agent rank
    updateAgentRank();
}

// Update individual module card
function updateModuleCard(moduleNumber) {
    const card = document.querySelector(`[data-module="${moduleNumber}"]`);
    const statusElement = document.getElementById(`module-${moduleNumber}-status`);
    const buttonElement = document.getElementById(`module-${moduleNumber}-btn`);
    
    if (!card || !statusElement || !buttonElement) return;
    
    const isCompleted = trainingProgress.completedModules.includes(moduleNumber);
    const isUnlocked = isModuleUnlocked(moduleNumber);
    
    // Update card appearance
    card.classList.remove('completed', 'locked');
    if (isCompleted) {
        card.classList.add('completed');
    } else if (!isUnlocked) {
        card.classList.add('locked');
    }
    
    // Update status badge
    const statusBadge = statusElement.querySelector('.status-badge');
    if (isCompleted) {
        statusBadge.textContent = 'COMPLETED';
        statusBadge.className = 'status-badge completed';
    } else if (isUnlocked) {
        statusBadge.textContent = 'AVAILABLE';
        statusBadge.className = 'status-badge available';
    } else {
        statusBadge.textContent = 'LOCKED';
        statusBadge.className = 'status-badge locked';
    }
    
    // Update button
    if (isCompleted) {
        buttonElement.textContent = 'REVIEW TRAINING';
        buttonElement.disabled = false;
        buttonElement.className = 'module-btn completed';
    } else if (isUnlocked) {
        buttonElement.textContent = 'START TRAINING';
        buttonElement.disabled = false;
        buttonElement.className = 'module-btn';
    } else {
        buttonElement.textContent = 'TRAINING LOCKED';
        buttonElement.disabled = true;
        buttonElement.className = 'module-btn';
    }
}

// Update assessment requirements
function updateAssessmentRequirements() {
    const assessmentCard = document.getElementById('final-assessment-card');
    const assessmentBtn = document.getElementById('final-assessment-btn');
    const assessmentStatus = document.getElementById('assessment-status');
    
    if (!assessmentCard || !assessmentBtn || !assessmentStatus) return;
    
    // Update requirement checkmarks
    for (let i = 1; i <= 5; i++) {
        const requirement = document.querySelector(`.requirement[data-module="${i}"]`);
        if (requirement) {
            const isCompleted = trainingProgress.completedModules.includes(i);
            requirement.className = `requirement ${isCompleted ? 'complete' : 'incomplete'}`;
            requirement.innerHTML = isCompleted ? 
                `✓ Complete ${moduleInfo[i].name} Training` : 
                `✗ Complete ${moduleInfo[i].name} Training`;
        }
    }
    
    // Update assessment availability
    if (trainingProgress.assessmentUnlocked) {
        assessmentCard.classList.remove('locked');
        assessmentBtn.disabled = false;
        assessmentBtn.textContent = 'BEGIN ASSESSMENT';
        assessmentStatus.textContent = 'AVAILABLE';
        assessmentStatus.className = 'status-badge available';
    } else {
        assessmentCard.classList.add('locked');
        assessmentBtn.disabled = true;
        assessmentBtn.textContent = 'ASSESSMENT LOCKED';
        assessmentStatus.textContent = 'LOCKED';
        assessmentStatus.className = 'status-badge locked';
    }
    
    if (trainingProgress.assessmentCompleted) {
        assessmentBtn.textContent = 'RETAKE ASSESSMENT';
        assessmentStatus.textContent = 'COMPLETED';
        assessmentStatus.className = 'status-badge completed';
    }
}

// Update agent rank based on progress
function updateAgentRank() {
    const agentRankElement = document.getElementById('agent-rank');
    if (!agentRankElement) return;
    
    let rank = 'Trainee Agent';
    const completed = trainingProgress.completedModules.length;
    
    if (trainingProgress.assessmentCompleted) {
        rank = 'Certified Digital Shield Agent';
    } else if (completed === 5) {
        rank = 'Senior Trainee Agent';
    } else if (completed >= 3) {
        rank = 'Junior Agent';
    } else if (completed >= 1) {
        rank = 'Recruit Agent';
    }
    
    agentRankElement.textContent = rank;
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
