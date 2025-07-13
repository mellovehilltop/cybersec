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
