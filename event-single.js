document.addEventListener('DOMContentLoaded', function() {
    const eventsData = [
        {
            id: 1,
            title: "Coastal Derby: Hamlets vs. Sharks FC",
            date: "JUN 28",
            time: "3:00 PM",
            location: "Mombasa Municipal Stadium",
            category: "matches",
            image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Don't miss the biggest derby of the season as we take on our rivals Sharks FC in what promises to be an electrifying match. The atmosphere will be electric and the stakes are high. Get your tickets now and be part of the action.",
            ticketType: 'match'
        },
        {
            id: 2,
            title: "Youth Football Training Clinic",
            date: "JUL 05",
            time: "9:00 AM - 12:00 PM",
            location: "Hamlets Training Ground",
            category: "community",
            image: "https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80",
            description: "Our annual youth clinic for ages 8-16. Learn from first-team players and coaches. This is a great opportunity for young aspiring footballers to hone their skills. Limited spots available, so register early!",
            ticketType: 'clinic'
        },
        {
            id: 3,
            title: "Season Ticket Holder Meet & Greet",
            date: "JUL 12",
            time: "2:00 PM - 4:00 PM",
            location: "Club Lounge",
            category: "meet-greet",
            image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1306&q=80",
            description: "An exclusive event for our loyal season ticket holders. Meet the players, get autographs, and enjoy light refreshments. This is our way of saying thank you for your incredible support.",
            ticketType: 'rsvp'
        },
        {
            id: 4,
            title: "Annual Charity Gala Dinner",
            date: "JUL 20",
            time: "7:00 PM",
            location: "Mombasa Serena Hotel",
            category: "special",
            image: "https://images.unsplash.com/photo-1551796886-9e7932323dfe?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Join us for an elegant evening of fine dining and auctions to support the Mombasa Youth Sports Foundation. All proceeds go towards providing sports equipment and facilities for underprivileged youth.",
            ticketType: 'special'
        },
        {
            id: 5,
            title: "Coastal Cup Quarter Final",
            date: "AUG 02",
            time: "4:30 PM",
            location: "Mombasa Municipal Stadium",
            category: "matches",
            image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "A crucial cup match as we face Malindi Stars for a place in the semi-finals. The team needs your support to advance in the tournament. Come and cheer them on!",
            ticketType: 'match'
        },
        {
            id: 6,
            title: "Behind-the-Scenes Stadium Tour",
            date: "AUG 15",
            time: "10:00 AM & 2:00 PM",
            location: "Mombasa Municipal Stadium",
            category: "community",
            image: "https://images.unsplash.com/photo-1577741314755-048c852f5a4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Get exclusive access to areas normally off-limits to fans. Visit the dressing rooms, walk down the tunnel, and stand pitchside. A must for any true Hamlets fan.",
            ticketType: 'tour'
        },
        {
            id: 7,
            title: "Hamlets 3 - 1 Coastal United",
            date: "JUN 14",
            location: "Mombasa Municipal Stadium",
            category: "matches",
            image: "https://images.unsplash.com/photo-1596510913920-85d87a1800d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "A dominant performance secured all three points in our opening match of the season. Read the full match report and watch the highlights here.",
            isPast: true
        },
        {
            id: 8,
            title: "Beach Cleanup Initiative",
            date: "JUN 01",
            location: "Nyali Beach",
            category: "community",
            image: "https://images.unsplash.com/photo-1580375605115-2e6489393e6e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
            description: "Players and fans joined forces to clean up our local beach and promote environmental awareness. It was a great day for the community and our club.",
            isPast: true
        }
    ];

    const eventDetailContainer = document.getElementById('event-detail-container');
    const params = new URLSearchParams(window.location.search);
    const eventId = parseInt(params.get('id'));
    const event = eventsData.find(e => e.id === eventId);

    if (event) {
        document.title = `${event.title} - Mombasa Hamlets FC`;
        let eventHTML = `
            <section class="page-hero" style="background-image: url('${event.image}');">
                <div class="hero-overlay"></div>
                <div class="container hero-content">
                    <h1 class="animate-pop-in">${event.title}</h1>
                    <div class="event-meta-single animate-pop-in">
                        ${event.date ? `<span><i class="far fa-calendar-alt"></i> ${event.date}</span>` : ''}
                        ${event.time ? `<span><i class="far fa-clock"></i> ${event.time}</span>` : ''}
                        <span><i class="fas fa-map-marker-alt"></i> ${event.location}</span>
                    </div>
                </div>
            </section>
            <section class="event-content-section">
                <div class="container">
                    <div class="event-details-layout">
                        <div class="event-description">
                            <h2>About the Event</h2>
                            <p>${event.description}</p>
                        </div>
                        <aside class="event-sidebar">
                            <h3>Event Details</h3>
                            <ul class="details-list">
                                ${event.date ? `<li><strong>Date:</strong> ${event.date}</li>` : ''}
                                ${event.time ? `<li><strong>Time:</strong> ${event.time}</li>` : ''}
                                <li><strong>Location:</strong> ${event.location}</li>
                                <li><strong>Category:</strong> ${event.category.charAt(0).toUpperCase() + event.category.slice(1)}</li>
                            </ul>
                            ${!event.isPast ? `<button class="btn btn-primary btn-block action-btn" data-event-name="${event.title}" data-ticket-type="${event.ticketType}">Get Tickets / Register</button>` : `<a href="events.html" class="btn btn-secondary btn-block">Back to Events</a>`}
                        </aside>
                    </div>
                </div>
            </section>
        `;
        eventDetailContainer.innerHTML = eventHTML;
    } else {
        eventDetailContainer.innerHTML = '<section class="container"><p>Event not found. Please check the URL or go back to the <a href="events.html">events page</a>.</p></section>';
    }
});
