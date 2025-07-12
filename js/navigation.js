// Navigation and Shared Functions for Digital Shield Training

// Module navigation functions
function startModule(moduleNumber) {
    // Check if module is unlocked
    if (!window.digitalShieldProgress.isModuleUnlocked(moduleNumber)) {
        alert('This module is locked. Please complete the previous modules first.');
        return;
    }
    
    // Navigate to module
    window.location.href = `module${moduleNumber}.html`;
}

// Start final assessment
function startFinalAssessment() {
    if (!trainingProgress.assessmentUnlocked) {
        alert('Complete all training modules to unlock the final assessment.');
        return;
    }
    
    window.location.href = 'final-assessment.html';
}

// Return to mission control
function returnToMissionControl() {
    window.location.href = 'index.html';
}

// Admin panel functions
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Module completion from individual modules
function completeModuleFromPage(moduleNumber, score = 100) {
    window.digitalShieldProgress.completeModule(moduleNumber, score);
    
    // Show completion message
    showCompletionDialog(moduleNumber, score);
}

// Show module completion dialog
function showCompletionDialog(moduleNumber, score) {
    const moduleNames = {
        1: "Email Security",
        2: "Password Security", 
        3: "Internet Security",
        4: "Physical Security",
        5: "Data Protection"
    };
    
    const moduleName = moduleNames[moduleNumber] || `Module ${moduleNumber}`;
    
    // Create completion dialog
    const dialog = document.createElement('div');
    dialog.className = 'completion-dialog';
    dialog.innerHTML = `
        <div class="dialog-overlay">
            <div class="dialog-content">
                <div class="completion-header">
                    <h2>🎉 MISSION ACCOMPLISHED!</h2>
                    <h3>${moduleName} Training Complete</h3>
                </div>
                <div class="completion-body">
                    <div class="score-display">
                        <div class="score-circle">
                            <span class="score-number">${score}%</span>
                            <span class="score-label">Score</span>
                        </div>
                    </div>
                    <p class="completion-message">
                        Excellent work, Agent! You have successfully completed the ${moduleName} training module.
                    </p>
                    <div class="next-steps">
                        ${moduleNumber < 5 ? 
                            `<p>🚀 <strong>Next:</strong> Module ${moduleNumber + 1} is now unlocked!</p>` :
                            `<p>🏆 <strong>Achievement:</strong> All modules complete! Final assessment unlocked!</p>`
                        }
                    </div>
                </div>
                <div class="completion-actions">
                    <button onclick="returnToMissionControl()" class="dialog-btn primary">
                        Return to Mission Control
                    </button>
                    ${moduleNumber < 5 ? 
                        `<button onclick="startModule(${moduleNumber + 1})" class="dialog-btn secondary">
                            Continue to Next Module
                        </button>` :
                        `<button onclick="startFinalAssessment()" class="dialog-btn secondary">
                            Take Final Assessment
                        </button>`
                    }
                </div>
            </div>
        </div>
    `;
    
    // Add dialog styles
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
    `;
    
    // Add CSS for dialog
    if (!document.getElementById('dialog-styles')) {
        const style = document.createElement('style');
        style.id = 'dialog-styles';
        style.textContent = `
            .dialog-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
                animation: fadeIn 0.3s ease-out;
            }
            
            .dialog-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 3px solid #00ffff;
                border-radius: 20px;
                max-width: 500px;
                width: 100%;
                padding: 0;
                box-shadow: 0 20px 60px rgba(0, 255, 255, 0.3);
                animation: slideUp 0.3s ease-out;
                overflow: hidden;
            }
            
            .completion-header {
                background: linear-gradient(45deg, #00ffff, #0099cc);
                color: #000;
                padding: 25px;
                text-align: center;
            }
            
            .completion-header h2 {
                margin: 0 0 10px 0;
                font-family: 'Orbitron', monospace;
                font-size: 1.5rem;
            }
            
            .completion-header h3 {
                margin: 0;
                font-size: 1.2rem;
                font-weight: normal;
            }
            
            .completion-body {
                padding: 30px;
                text-align: center;
                color: #fff;
            }
            
            .score-display {
                margin-bottom: 25px;
            }
            
            .score-circle {
                display: inline-block;
                width: 100px;
                height: 100px;
                border: 3px solid #00ff00;
                border-radius: 50%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: rgba(0, 255, 0, 0.1);
                margin: 0 auto 20px;
            }
            
            .score-number {
                font-size: 1.8rem;
                font-weight: bold;
                color: #00ff00;
                font-family: 'Orbitron', monospace;
            }
            
            .score-label {
                font-size: 0.8rem;
                color: #ccc;
            }
            
            .completion-message {
                font-size: 1.1rem;
                line-height: 1.5;
                margin-bottom: 20px;
                color: #ccc;
            }
            
            .next-steps {
                background: rgba(243, 156, 18, 0.1);
                border: 1px solid #f39c12;
                border-radius: 10px;
                padding: 15px;
                color: #f39c12;
            }
            
            .completion-actions {
                padding: 25px;
                display: flex;
                gap: 15px;
                flex-direction: column;
            }
            
            .dialog-btn {
                padding: 15px 25px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                font-family: 'Orbitron', monospace;
                cursor: pointer;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .dialog-btn.primary {
                background: linear-gradient(45deg, #f39c12, #e67e22);
                color: #000;
                border: 2px solid #f39c12;
            }
            
            .dialog-btn.secondary {
                background: linear-gradient(45deg, #3498db, #2980b9);
                color: #fff;
                border: 2px solid #3498db;
            }
            
            .dialog-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (max-width: 768px) {
                .completion-actions {
                    flex-direction: column;
                }
                
                .dialog-content {
                    margin: 10px;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(dialog);
}

// Shared utility functions
function createInteractiveElement(type, options = {}) {
    const element = document.createElement(type);
    
    // Add common interactive styling
    element.style.cssText = `
        transition: all 0.3s ease;
        cursor: pointer;
        user-select: none;
    `;
    
    // Add hover effects
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05)';
        this.style.filter = 'brightness(1.1)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.filter = 'brightness(1)';
    });
    
    // Add click effect
    element.addEventListener('mousedown', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    element.addEventListener('mouseup', function() {
        this.style.transform = 'scale(1.05)';
    });
    
    return element;
}

// Create progress indicator
function createProgressIndicator(current, total) {
    const container = document.createElement('div');
    container.className = 'progress-indicator';
    container.style.cssText = `
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 10px;
        margin: 20px 0;
    `;
    
    for (let i = 1; i <= total; i++) {
        const step = document.createElement('div');
        step.className = 'progress-step';
        step.textContent = i;
        step.style.cssText = `
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 0.9rem;
            border: 2px solid;
            transition: all 0.3s ease;
        `;
        
        if (i < current) {
            // Completed
            step.style.background = '#00ff00';
            step.style.borderColor = '#00ff00';
            step.style.color = '#000';
            step.innerHTML = '✓';
        } else if (i === current) {
            // Current
            step.style.background = '#f39c12';
            step.style.borderColor = '#f39c12';
            step.style.color = '#000';
            step.style.transform = 'scale(1.1)';
        } else {
            // Upcoming
            step.style.background = 'transparent';
            step.style.borderColor = '#666';
            step.style.color = '#666';
        }
        
        container.appendChild(step);
        
        // Add connector line
        if (i < total) {
            const connector = document.createElement('div');
            connector.style.cssText = `
                width: 20px;
                height: 2px;
                background: ${i < current ? '#00ff00' : '#666'};
                transition: all 0.3s ease;
            `;
            container.appendChild(connector);
        }
    }
    
    return container;
}

// Animate element entrance
function animateEntrance(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'all 0.6s ease';
    
    setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, delay);
}

// Create notification toast
function showNotification(message, type = 'info', duration = 4000) {
    const notification = document.createElement('div');
    notification.className = 'notification-toast';
    notification.textContent = message;
    
    const colors = {
        'success': '#00ff00',
        'error': '#ff0000',
        'warning': '#f39c12',
        'info': '#3498db'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type] || colors.info};
        color: ${type === 'success' ? '#000' : '#fff'};
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: bold;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    
    // Add animation keyframes if not already added
    if (!document.getElementById('notification-animations')) {
        const style = document.createElement('style');
        style.id = 'notification-animations';
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC to close dialogs
    if (e.key === 'Escape') {
        const dialogs = document.querySelectorAll('.completion-dialog, .badge-notification');
        dialogs.forEach(dialog => {
            if (dialog.parentNode) {
                dialog.parentNode.removeChild(dialog);
            }
        });
    }
    
    // Alt+H to return home
    if (e.altKey && e.key === 'h') {
        e.preventDefault();
        returnToMissionControl();
    }
});

// Export functions for global use
window.digitalShieldNavigation = {
    startModule,
    startFinalAssessment,
    returnToMissionControl,
    completeModuleFromPage,
    showCompletionDialog,
    createInteractiveElement,
    createProgressIndicator,
    animateEntrance,
    showNotification
};

// Admin panel functions for file system
function toggleAdminPanel() {
    const panel = document.getElementById('admin-panel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Complete module from admin panel (for testing)
function completeModule(moduleNumber) {
    if (window.digitalShieldProgress && window.digitalShieldProgress.completeModule) {
        window.digitalShieldProgress.completeModule(moduleNumber, 100);
        updateProgressDisplay();
        console.log(`Admin: Completed module ${moduleNumber}`);
    }
}

// Reset all progress (for testing)  
function resetAllProgress() {
    if (confirm('🚨 SECURITY WARNING 🚨\n\nThis will permanently delete all training progress and cannot be undone.\n\nProceed with system reset?')) {
        if (window.digitalShieldProgress && window.digitalShieldProgress.resetAllProgress) {
            window.digitalShieldProgress.resetAllProgress();
            updateProgressDisplay();
            alert('✅ SYSTEM RESET COMPLETE\n\nAll training data has been cleared.');
        }
    }
}

console.log('Digital Shield Navigation System loaded');
