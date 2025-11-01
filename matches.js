// js/matches.js

// Match data - this would typically come from a database or API
const matchesData = [
    {
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
        minute: null
    },
    {
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
        minute: "67'"
    },
    {
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
        minute: null
    },
    {
        id: 4,
        competition: "Premier League",
        round: "Matchday 13",
        date: "2024-12-01",
        time: "14:00",
        status: "finished",
        homeTeam: "Kilifi Warriors",
        homeLogo: "images/teams/kilifi-warriors.png",
        awayTeam: "Mombasa Hamlets",
        awayLogo: "images/29.jpg",
        score: "1 - 2",
        venue: "Kilifi Sports Complex",
        minute: null
    },
    {
        id: 5,
        competition: "Premier League",
        round: "Matchday 16",
        date: "2024-12-20",
        time: "17:00",
        status: "upcoming",
        homeTeam: "Lamu FC",
        homeLogo: "images/teams/lamu-fc.png",
        awayTeam: "Mombasa Hamlets",
        awayLogo: "images/29.jpg",
        score: null,
        venue: "Lamu Town Ground",
        minute: null
    },
    {
        id: 6,
        competition: "Champions League",
        round: "Group Stage",
        date: "2024-12-25",
        time: "20:00",
        status: "upcoming",
        homeTeam: "Mombasa Hamlets",
        homeLogo: "images/29.jpg",
        awayTeam: "Dar es Salaam SC",
        awayLogo: "images/teams/dar-es-salaam.png",
        score: null,
        venue: "Mombasa Municipal Stadium",
        minute: null
    }
];

// DOM Elements
const matchesList = document.getElementById('matchesList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Format date to display like "Sat, Dec 15"
function formatMatchDate(dateString) {
    const date = new Date(dateString);
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Format time to display like "3:00 PM"
function formatMatchTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
}

// Create match card HTML
function createMatchCard(match) {
    const formattedDate = formatMatchDate(match.date);
    const formattedTime = formatMatchTime(match.time);
    
    return `
        <div class="match-card" data-status="${match.status}">
            <div class="match-header">
                <span class="match-competition">${match.competition} • ${match.round}</span>
                <span class="match-date">${formattedDate} • ${formattedTime}</span>
            </div>
            
            <div class="match-content">
                <div class="team team-home">
                    <img src="${match.homeLogo}" alt="${match.homeTeam}" class="team-logo" onerror="this.src='images/29.jpg'">
                    <span class="team-name">${match.homeTeam}</span>
                </div>
                
                <div class="match-vs">
                    ${match.status === 'upcoming' ? 
                        '<span class="match-status status-upcoming">VS</span>' : 
                        `<span class="match-score">${match.score}</span>
                         <span class="match-status status-${match.status}">
                            ${match.status === 'live' ? `LIVE • ${match.minute}` : 'FT'}
                         </span>`
                    }
                </div>
                
                <div class="team team-away">
                    <img src="${match.awayLogo}" alt="${match.awayTeam}" class="team-logo" onerror="this.src='images/29.jpg'">
                    <span class="team-name">${match.awayTeam}</span>
                </div>
            </div>
            
            <div class="match-info">
                <span class="match-venue">${match.venue}</span>
                <a href="match-preview.html?id=${match.id}" class="match-preview">
                    ${match.status === 'upcoming' ? 'Preview' : 'Review'}
                </a>
            </div>
        </div>
    `;
}

// Display matches based on filter
function displayMatches(filter = 'all') {
    const filteredMatches = matchesData.filter(match => {
        if (filter === 'all') return true;
        return match.status === filter;
    });
    
    // Sort matches: live first, then upcoming, then finished (newest first)
    filteredMatches.sort((a, b) => {
        const statusOrder = { live: 0, upcoming: 1, finished: 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        
        // For same status, sort by date (newest first for finished, oldest first for upcoming)
        if (a.status === 'finished') {
            return new Date(b.date) - new Date(a.date);
        } else {
            return new Date(a.date) - new Date(b.date);
        }
    });
    
    if (filteredMatches.length === 0) {
        matchesList.innerHTML = `
            <div class="matches-empty">
                <i class="fas fa-calendar-times"></i>
                <h3>No matches found</h3>
                <p>There are no ${filter} matches at the moment.</p>
            </div>
        `;
    } else {
        matchesList.innerHTML = filteredMatches.map(createMatchCard).join('');
    }
}

// Filter button click handler
function handleFilterClick() {
    // Remove active class from all buttons
    filterButtons.forEach(btn => btn.classList.remove('active'));
    
    // Add active class to clicked button
    this.classList.add('active');
    
    // Get filter type from data attribute
    const filter = this.getAttribute('data-filter');
    
    // Display filtered matches
    displayMatches(filter);
}

// Initialize matches page
function initMatches() {
    // Add event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', handleFilterClick);
    });
    
    // Display all matches initially
    displayMatches();
    
    // Simulate live match updates (for demonstration)
    if (matchesData.some(match => match.status === 'live')) {
        setInterval(updateLiveMatches, 30000); // Update every 30 seconds
    }
}

// Simulate live match updates (for demonstration purposes)
function updateLiveMatches() {
    const liveMatches = matchesData.filter(match => match.status === 'live');
    
    liveMatches.forEach(match => {
        // Simulate minute progression
        if (match.minute) {
            const currentMinute = parseInt(match.minute);
            if (currentMinute < 90) {
                match.minute = `${currentMinute + 1}'`;
                
                // Simulate occasional goals
                if (Math.random() < 0.1) { // 10% chance of goal
                    const scores = match.score.split(' - ').map(Number);
                    const scoringTeam = Math.random() < 0.5 ? 0 : 1;
                    scores[scoringTeam]++;
                    match.score = scores.join(' - ');
                }
            } else if (currentMinute >= 90 && currentMinute < 95) {
                // Extra time simulation
                match.minute = `${currentMinute + 1}'`;
            } else {
                // End of match
                match.status = 'finished';
                match.minute = null;
            }
        }
    });
    
    // Refresh display if we're currently viewing live matches
    const currentFilter = document.querySelector('.filter-btn.active').getAttribute('data-filter');
    if (currentFilter === 'live' || currentFilter === 'all') {
        displayMatches(currentFilter);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initMatches);

// Fallback for team logos
function handleImageError(img) {
    img.src = 'images/29.jpg';
    img.alt = 'Team Logo';
}