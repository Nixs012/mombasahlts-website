// backend/admin/js/modules/ui.js

export function initUI() {
    // Add animation to stat cards
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Form cancel buttons
    document.querySelectorAll('.btn-cancel').forEach(btn => {
        btn.addEventListener('click', () => {
            const formContainer = btn.closest('.form-container');
            if (formContainer) {
                formContainer.style.display = 'none';
            }
        });
    });
}
