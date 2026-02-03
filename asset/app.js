/**
 * Test VOD Services - Common Logic
 * Handles LocalStorage persistence for checklists and notes.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Identify the current page context
    const pageId = document.body.dataset.pageId;
    if (!pageId) return; // Dashboard or pages without tracking don't need this

    // 2. Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }

    // 3. Handle Checkboxes (Persist State)
    const checkboxes = document.querySelectorAll('input[type="checkbox"][data-task]');
    const progressEl = document.getElementById('progress-text');
    const progressBar = document.getElementById('progress-bar-fill');

    function updateProgress() {
        if (!progressEl || !progressBar) return;
        
        const total = checkboxes.length;
        const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
        const percent = total === 0 ? 0 : Math.round((checked / total) * 100);

        progressEl.textContent = `${percent}% 완료`;
        progressBar.style.width = `${percent}%`;
    }

    checkboxes.forEach(cb => {
        const key = `${pageId}_task_${cb.dataset.task}`;
        
        // Load saved state
        const saved = localStorage.getItem(key);
        if (saved === 'true') {
            cb.checked = true;
        }

        // Save on change
        cb.addEventListener('change', (e) => {
            localStorage.setItem(key, e.target.checked);
            updateProgress();
        });
    });

    // Initial progress update
    updateProgress();


    // 4. Handle Notes (Persist Text)
    const noteArea = document.getElementById('performance-note');
    if (noteArea) {
        const noteKey = `${pageId}_notes`;
        
        // Load saved notes
        const savedNote = localStorage.getItem(noteKey);
        if (savedNote) {
            noteArea.value = savedNote;
        }

        // Save on input (debounced slightly or direct)
        noteArea.addEventListener('input', (e) => {
            localStorage.setItem(noteKey, e.target.value);
        });
    }
});
