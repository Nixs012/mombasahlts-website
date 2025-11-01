// js/players.js

let playersData = [];

// Fetch players data from the backend
async function fetchPlayers() {
    const playersGrid = document.getElementById('playersGrid');
    try {
        const response = await fetch('http://localhost:5000/api/players');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        playersData = await response.json();
        return playersData;
    } catch (error) {
        console.error("Could not fetch players:", error);
        if (playersGrid) {
            playersGrid.innerHTML = `
                <div class="players-error">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Failed to load players</h3>
                    <p>Could not connect to the server. Please try again later.</p>
                </div>
            `;
        }
        return []; // Return empty array on error
    }
}

// Initialize players page
async function initPlayers() {
    console.log("Initializing players page...");
    await fetchPlayers();
    displayPlayers();
    setupFilters();
    setupSearch();
    setupModal();
    setupPlayerCardClicks(); // Add this line
}

// Display players
function displayPlayers(filter = 'all', searchTerm = '') {
    const playersGrid = document.getElementById('playersGrid');
    if (!playersGrid) return;

    let filteredPlayers = playersData.filter(player => {
        const positionMatch = filter === 'all' ||
                            (filter === 'goalkeepers' && player.position === 'Goalkeeper') ||
                            (filter === 'defenders' && player.position === 'Defender') ||
                            (filter === 'midfielders' && player.position === 'Midfielder') ||
                            (filter === 'forwards' && player.position === 'Forward');

        const searchMatch = searchTerm === '' ||
                          player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          player.number.toString().includes(searchTerm);

        return positionMatch && searchMatch;
    });

    if (filteredPlayers.length === 0) {
        playersGrid.innerHTML = `
            <div class="players-empty">
                <i class="fas fa-search"></i>
                <h3>No players found</h3>
                <p>Try adjusting your search or filter criteria.</p>
            </div>
        `;
    } else {
        playersGrid.innerHTML = filteredPlayers.map(player => createPlayerCard(player)).join('');
    }
}

// Create player card HTML
function createPlayerCard(player) {
    return `
        <div class="player-card" data-player-id="${player.id}" data-position="${player.position}">
            <div class="player-image-container">
                <img src="${player.image}" alt="${player.name}" class="player-image" onerror="this.src='images/default-player.png'">
                <div class="player-number">${player.number}</div>
            </div>
            <h3 class="player-name">${player.name}</h3>
            <div class="player-position">${player.position}</div>
            
            <div class="player-stats">
                <div class="player-stat">
                    <div class="stat-value">${player.appearances}</div>
                    <div class="stat-label">Apps</div>
                </div>
                <div class="player-stat">
                    <div class="stat-value">${player.position === 'Goalkeeper' ? (player.cleanSheets || 0) : (player.goals || 0)}</div>
                    <div class="stat-label">${player.position === 'Goalkeeper' ? 'Clean Sheets' : 'Goals'}</div>
                </div>
            </div>
        </div>
    `;
}

// Setup filter buttons
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-buttons .filter-btn');
    if (!filterButtons.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            const searchTerm = document.getElementById('playerSearch').value;
            displayPlayers(filter, searchTerm);
        });
    });
}

// Setup search functionality
function setupSearch() {
    const searchInput = document.getElementById('playerSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        const activeFilter = document.querySelector('.filter-buttons .filter-btn.active');
        const filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        displayPlayers(filter, searchTerm);
    });
}

// Setup modal functionality
function setupPlayerCardClicks() {
    const playersGrid = document.getElementById('playersGrid');
    if (!playersGrid) return;

    playersGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.player-card');
        if (card) {
            const playerId = card.getAttribute('data-player-id');
            showPlayerModal(parseInt(playerId));
        }
    });
}

function setupModal() {
    const modal = document.getElementById('playerModal');
    const closeBtn = document.querySelector('.close-modal');
    if (!modal || !closeBtn) return;
    
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
}

// Show player modal
function showPlayerModal(playerId) {
    const player = playersData.find(p => p.id === playerId);
    const modalBody = document.getElementById('modalBody');
    const modal = document.getElementById('playerModal');
    if (!player || !modalBody || !modal) return;
    
    modalBody.innerHTML = createPlayerModalContent(player);
    modal.style.display = 'block';
}

// Create player modal content
function createPlayerModalContent(player) {
    const joinedDate = new Date(player.joined);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    
    return `
        <div class="player-details">
            <div class="player-details-image-container">
                <img src="${player.image}" alt="${player.name}" class="player-details-image" onerror="this.src='images/default-player.png'">
                <div class="player-details-number">${player.number}</div>
            </div>
            <h2 class="player-details-name">${player.name}</h2>
            <div class="player-details-position">${player.position}</div>
            
            <div class="player-info-grid">
                <div class="player-info-item">
                    <div class="info-label">Nationality</div>
                    <div class="info-value">${player.nationality}</div>
                </div>
                <div class="player-info-item">
                    <div class="info-label">Age</div>
                    <div class="info-value">${player.age}</div>
                </div>
                <div class="player-info-item">
                    <div class="info-label">Height</div>
                    <div class="info-value">${player.height}</div>
                </div>
                <div class="player-info-item">
                    <div class="info-label">Weight</div>
                    <div class="info-value">${player.weight}</div>
                </div>
                <div class="player-info-item">
                    <div class="info-label">Joined</div>
                    <div class="info-value">${joinedDate.toLocaleDateString('en-US', options)}</div>
                </div>
                <div class="player-info-item">
                    <div class="info-label">Previous Club</div>
                    <div class="info-value">${player.previousClub}</div>
                </div>
            </div>
            
            <div class="player-bio">
                <h4>About</h4>
                <p>${player.bio}</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${player.appearances}</div>
                    <div class="stat-label">Appearances</div>
                </div>
                ${player.position === 'Goalkeeper' ? `
                <div class="stat-item">
                    <div class="stat-value">${player.cleanSheets || 0}</div>
                    <div class="stat-label">Clean Sheets</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.saves || 0}</div>
                    <div class="stat-label">Saves</div>
                </div>
                ` : `
                <div class="stat-item">
                    <div class="stat-value">${player.goals || 0}</div>
                    <div class="stat-label">Goals</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.assists || 0}</div>
                    <div class="stat-label">Assists</div>
                </div>
                `}
                <div class="stat-item">
                    <div class="stat-value">${player.yellowCards || 0}</div>
                    <div class="stat-label">Yellow Cards</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${player.redCards || 0}</div>
                    <div class="stat-label">Red Cards</div>
                </div>
            </div>
        </div>
    `;
}

// Start when DOM is loaded
document.addEventListener('DOMContentLoaded', initPlayers);
