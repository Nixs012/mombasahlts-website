// js/match-preview.js

// Match data - same as in matches.js but with more details
const matchDetailsData = {
    1: {
        id: 1,
        competition: "Premier League",
        round: "Matchday 15",
        date: "2024-12-15",
        time: "15:00",
        status: "upcoming",
        homeTeam: "Mombasa Hamlets",
        homeLogo: "images/29.jpg",
        awayTeam: "Coastal United",
        awayLogo: "images/teams/coastal-united.png",
        score: null,
        venue: "Mombasa Municipal Stadium",
        referee: "John Smith",
        attendance: null,
        preview: `
            <h3>Match Preview: Mombasa Hamlets vs Coastal United</h3>
            <p>Mombasa Hamlets welcome Coastal United to the Municipal Stadium for what promises to be an exciting Premier League clash. Both teams are coming off impressive victories and will be looking to continue their winning momentum.</p>
            
            <h4>Team News</h4>
            <p><strong>Mombasa Hamlets:</strong> Captain Ali Mwinyi returns from suspension and is expected to lead the attack. Defender Jamal Abdi is doubtful with a minor knock sustained in training.</p>
            
            <p><strong>Coastal United:</strong> The visitors will be without their star midfielder who is serving a one-match ban. New signing David Okoth could make his debut.</p>
            
            <h4>Key Battles</h4>
            <p>The midfield duel between Hamlets' creative force and Coastal's defensive setup will be crucial. Both teams prefer possession-based football, so expect an entertaining tactical battle.</p>
            
            <h4>Predicted Lineups</h4>
            <p><strong>Mombasa Hamlets (4-3-3):</strong> Omar - Hassan, Kamau, Mwangi, Ali - Mwinyi (c), Okello, Mbugua - Adan, Mohammed, Said</p>
            
            <p><strong>Coastal United (4-2-3-1):</strong> Mwamba - Mwakio, Chengo, Mwadime, Charo - Mwamto, Mwavizo - Mwamuye, Mwanyoha, Mwafrika - Mwakinga</p>
            
            <h4>Match Officials</h4>
            <p>Referee: John Smith<br>
            Assistant Referees: Jane Doe, Mike Johnson<br>
            Fourth Official: Sarah Williams</p>
        `
    },
    2: {
        id: 2,
        competition: "FA Cup",
        round: "Round of 16",
        date: "2024-12-12",
        time: "19:30",
        status: "live",
        homeTeam: "Mombasa Hamlets",
        homeLogo: "images/29.jpg",
        awayTeam: "Nairobi City FC",
        awayLogo: "images/teams/nairobi-city.png",
        score: "2 - 1",
        venue: "Mombasa Municipal Stadium",
        referee: "Michael Johnson",
        attendance: "8,742",
        minute: "67'",
        preview: `
            <h3>Live: Mombasa Hamlets 2-1 Nairobi City FC</h3>
            <p>An electrifying FA Cup encounter is underway at the Municipal Stadium! Mombasa Hamlets came from behind to take the lead in this Round of 16 clash.</p>
            
            <h4>Match Summary</h4>
            <p><strong>23'</strong> - GOAL Nairobi City! Against the run of play, the visitors take the lead.</p>
            <p><strong>45+2'</strong> - GOAL Hamlets! Ali Mwinyi equalizes just before halftime!</p>
            <p><strong>58'</strong> - GOAL Hamlets! Jamal Abdi puts the home side ahead!</p>
            
            <h4>Current Momentum</h4>
            <p>Mombasa Hamlets are dominating possession and creating numerous chances. Nairobi City are looking dangerous on the counter-attack.</p>
            
            <h4>Key Statistics</h4>
            <p>Possession: 62% - 38%<br>
            Shots: 14 - 6<br>
            Shots on target: 7 - 3<br>
            Corners: 6 - 2</p>
        `
    },
    3: {
        id: 3,
        competition: "Premier League",
        round: "Matchday 14",
        date: "2024-12-08",
        time: "16:00",
        status: "finished",
        homeTeam: "Mombasa Hamlets",
        homeLogo: "images/29.jpg",
        awayTeam: "Malindi Stars",
        awayLogo: "images/teams/malindi-stars.png",
        score: "3 - 0",
        venue: "Mombasa Municipal Stadium",
        referee: "Sarah Williams",
        attendance: "12,358",
        preview: `
            <h3>Match Review: Mombasa Hamlets 3-0 Malindi Stars</h3>
            <p>Mombasa Hamlets produced a dominant performance to secure a comfortable 3-0 victory against Malindi Stars at the Municipal Stadium.</p>
            
            <h4>Match Report</h4>
            <p><strong>28'</strong> - GOAL! Ali Mwinyi opens the scoring with a brilliant header from a corner.</p>
            <p><strong>45+1'</strong> - GOAL! Jamal Abdi doubles the lead with a powerful strike from outside the box.</p>
            <p><strong>78'</strong> - GOAL! Substitute Hassan Mohammed seals the victory with a clinical finish.</p>
            
            <h4>Post-Match Analysis</h4>
            <p>Hamlets controlled the game from start to finish, displaying excellent passing and movement. The defensive line was solid, keeping a clean sheet against a dangerous Malindi attack.</p>
            
            <h4>Man of the Match</h4>
            <p>Ali Mwinyi - The captain led by example with a goal and an assist, controlling the midfield throughout.</p>
            
            <h4>Final Statistics</h4>
            <p>Possession: 58% - 42%<br>
            Shots: 18 - 8<br>
            Shots on target: 9 - 2<br>
            Corners: 8 - 3<br>
            Fouls: 12 - 15<br>
            Yellow cards: 2 - 4</p>
        `
    }
};

// Initialize match preview page
function initMatchPreview() {
    // Get match ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const matchId = urlParams.get('id');
    
    if (!matchId || !matchDetailsData[matchId]) {
        showError('Match not found');
        return;
    }
    
    const match = matchDetailsData[matchId];
    displayMatchDetails(match);
    setupTabNavigation();
}

// Display match details
function displayMatchDetails(match) {
    // Update page title
    document.title = `${match.homeTeam} vs ${match.awayTeam} - Mombasa Hamlets FC`;
    
    // Update hero section
    document.getElementById('matchTitle').textContent = `${match.homeTeam} vs ${match.awayTeam}`;
    
    const matchDate = new Date(match.date);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('matchDate').textContent = `${matchDate.toLocaleDateString('en-US', options)} • ${match.time} • ${match.venue}`;
    
    // Update match overview
    const overviewHTML = `
        <div class="match-teams">
            <div class="match-team">
                <img src="${match.homeLogo}" alt="${match.homeTeam}" class="team-logo-large" onerror="this.src='images/29.jpg'">
                <div class="team-name-large">${match.homeTeam}</div>
            </div>
            
            <div class="match-vs-large">
                ${match.status === 'upcoming' ? 'VS' : match.score}
            </div>
            
            <div class="match-team">
                <img src="${match.awayLogo}" alt="${match.awayTeam}" class="team-logo-large" onerror="this.src='images/29.jpg'">
                <div class="team-name-large">${match.awayTeam}</div>
            </div>
        </div>
        
        ${match.status !== 'upcoming' ? `<div class="match-score-large">${match.score}</div>` : ''}
        
        <div class="match-details">
            <div class="match-detail">
                <div class="detail-label">Competition</div>
                <div class="detail-value">${match.competition}</div>
            </div>
            
            <div class="match-detail">
                <div class="detail-label">Round</div>
                <div class="detail-value">${match.round}</div>
            </div>
            
            <div class="match-detail">
                <div class="detail-label">Venue</div>
                <div class="detail-value">${match.venue}</div>
            </div>
            
            <div class="match-detail">
                <div class="detail-label">Referee</div>
                <div class="detail-value">${match.referee}</div>
            </div>
            
            ${match.attendance ? `
            <div class="match-detail">
                <div class="detail-label">Attendance</div>
                <div class="detail-value">${match.attendance}</div>
            </div>
            ` : ''}
            
            ${match.status === 'live' ? `
            <div class="match-detail">
                <div class="detail-label">Status</div>
                <div class="detail-value" style="color: #d32f2f;">LIVE • ${match.minute}</div>
            </div>
            ` : ''}
        </div>
    `;
    
    document.getElementById('matchOverview').innerHTML = overviewHTML;
    
    // Update preview content
    document.getElementById('previewContent').innerHTML = match.preview;
}

// Setup tab navigation
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Update active button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Show corresponding tab
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

// Show error message
function showError(message) {
    document.getElementById('matchOverview').innerHTML = `
        <div class="matches-empty">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>${message}</h3>
            <p>Please check the URL or go back to <a href="matches.html">all matches</a>.</p>
        </div>
    `;
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMatchPreview);