 // DOM Elements
        const modal = document.getElementById('ticketModal');
        const modalEventTitle = document.getElementById('modalEventTitle');
        const modalBody = document.getElementById('modalBody');
        const modalClose = document.getElementById('modalClose');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileNav = document.getElementById('mobileNav');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const eventCards = document.querySelectorAll('.event-card');
        const newsletterForm = document.getElementById('newsletterForm');
        
        // Get all action buttons
        const getTicketsBtns = document.querySelectorAll('.get-tickets-btn');
        const buyTicketsBtns = document.querySelectorAll('.buy-tickets-btn');
        const registerBtns = document.querySelectorAll('.register-btn');
        const rsvpBtns = document.querySelectorAll('.rsvp-btn');
        const bookTourBtns = document.querySelectorAll('.book-tour-btn');
        
        // Mobile menu toggle
        mobileMenuToggle.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
        });
        
        // Event filtering functionality
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                button.classList.add('active');
                
                const filter = button.getAttribute('data-filter');
                
                // Filter events
                eventCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.getAttribute('data-category') === filter) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
        
        // Add event listeners to all action buttons
        getTicketsBtns.forEach(btn => {
            btn.addEventListener('click', () => openTicketModal(btn.dataset.event, 'match'));
        });
        
        buyTicketsBtns.forEach(btn => {
            btn.addEventListener('click', () => openTicketModal(btn.dataset.event, 'special'));
        });
        
        registerBtns.forEach(btn => {
            btn.addEventListener('click', () => openRegistrationModal(btn.dataset.event, 'clinic'));
        });
        
        rsvpBtns.forEach(btn => {
            btn.addEventListener('click', () => openRegistrationModal(btn.dataset.event, 'rsvp'));
        });
        
        bookTourBtns.forEach(btn => {
            btn.addEventListener('click', () => openTourModal(btn.dataset.event));
        });
        
        // Close modal when clicking on X
        modalClose.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Newsletter form submission
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            alert(`Thank you for subscribing with ${email}! You'll now receive our latest updates.`);
            newsletterForm.reset();
        });
        
        // Function to open ticket modal
        function openTicketModal(eventName, type) {
            modalEventTitle.textContent = `Tickets for ${eventName}`;
            
            if (type === 'match') {
                modalBody.innerHTML = `
                    <div class="ticket-types">
                        <div class="ticket-type">
                            <div>
                                <strong>General Admission</strong>
                                <div>KES 500</div>
                            </div>
                            <div class="ticket-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('ga', -1)">-</button>
                                <input type="number" class="quantity-input" id="gaQty" value="0" min="0" max="10">
                                <button class="quantity-btn" onclick="updateQuantity('ga', 1)">+</button>
                            </div>
                        </div>
                        <div class="ticket-type">
                            <div>
                                <strong>VIP Stand</strong>
                                <div>KES 1,500</div>
                            </div>
                            <div class="ticket-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('vip', -1)">-</button>
                                <input type="number" class="quantity-input" id="vipQty" value="0" min="0" max="10">
                                <button class="quantity-btn" onclick="updateQuantity('vip', 1)">+</button>                            </div>
                        </div>
                        <div class="ticket-type">
                            <div>
                                <strong>Family Package (4 tickets)</strong>
                                <div>KES 1,600</div>
                            </div>
                            <div class="ticket-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('family', -1)">-</button>
                                <input type="number" class="quantity-input" id="familyQty" value="0" min="0" max="5">
                                <button class="quantity-btn" onclick="updateQuantity('family', 1)">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="ticketName">Full Name</label>
                        <input type="text" id="ticketName" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketEmail">Email Address</label>
                        <input type="email" id="ticketEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="ticketPhone">Phone Number</label>
                        <input type="tel" id="ticketPhone" required>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="processTicketPurchase()">Purchase Tickets</button>
                    </div>
                `;
            } else if (type === 'special') {
                modalBody.innerHTML = `
                    <div class="ticket-types">
                        <div class="ticket-type">
                            <div>
                                <strong>Standard Ticket</strong>
                                <div>KES 3,000</div>
                            </div>
                            <div class="ticket-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('standard', -1)">-</button>
                                <input type="number" class="quantity-input" id="standardQty" value="0" min="0" max="10">
                                <button class="quantity-btn" onclick="updateQuantity('standard', 1)">+</button>
                            </div>
                        </div>
                        <div class="ticket-type">
                            <div>
                                <strong>VIP Table (10 seats)</strong>
                                <div>KES 40,000</div>
                            </div>
                            <div class="ticket-quantity">
                                <button class="quantity-btn" onclick="updateQuantity('vipTable', -1)">-</button>
                                <input type="number" class="quantity-input" id="vipTableQty" value="0" min="0" max="2">
                                <button class="quantity-btn" onclick="updateQuantity('vipTable', 1)">+</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="galaName">Full Name</label>
                        <input type="text" id="galaName" required>
                    </div>
                    <div class="form-group">
                        <label for="galaEmail">Email Address</label>
                        <input type="email" id="galaEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="galaPhone">Phone Number</label>
                        <input type="tel" id="galaPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="galaGuests">Number of Guests (if applicable)</label>
                        <input type="number" id="galaGuests" min="0" max="10">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="processGalaPurchase()">Purchase Tickets</button>
                    </div>
                `;
            }
            
            modal.style.display = 'flex';
        }
        
        // Function to open registration modal
        function openRegistrationModal(eventName, type) {
            modalEventTitle.textContent = `Register for ${eventName}`;
            
            if (type === 'clinic') {
                modalBody.innerHTML = `
                    <div class="form-group">
                        <label for="participantName">Participant's Full Name</label>
                        <input type="text" id="participantName" required>
                    </div>
                    <div class="form-group">
                        <label for="participantAge">Age</label>
                        <input type="number" id="participantAge" min="8" max="16" required>
                    </div>
                    <div class="form-group">
                        <label for="guardianName">Parent/Guardian Name</label>
                        <input type="text" id="guardianName" required>
                    </div>
                    <div class="form-group">
                        <label for="guardianEmail">Email Address</label>
                        <input type="email" id="guardianEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="guardianPhone">Phone Number</label>
                        <input type="tel" id="guardianPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="experienceLevel">Football Experience Level</label>
                        <select id="experienceLevel" required>
                            <option value="">Select Level</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="processClinicRegistration()">Register Now</button>
                    </div>
                `;
            } else if (type === 'rsvp') {
                modalBody.innerHTML = `
                    <div class="form-group">
                        <label for="rsvpName">Full Name</label>
                        <input type="text" id="rsvpName" required>
                    </div>
                    <div class="form-group">
                        <label for="rsvpEmail">Email Address</label>
                        <input type="email" id="rsvpEmail" required>
                    </div>
                    <div class="form-group">
                        <label for="rsvpPhone">Phone Number</label>
                        <input type="tel" id="rsvpPhone" required>
                    </div>
                    <div class="form-group">
                        <label for="rsvpGuests">Number of Additional Guests</label>
                        <input type="number" id="rsvpGuests" min="0" max="2" value="0">
                    </div>
                    <div class="form-group">
                        <label for="rsvpDietary">Dietary Restrictions (if any)</label>
                        <input type="text" id="rsvpDietary" placeholder="e.g., Vegetarian, Allergies">
                    </div>
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                        <button type="button" class="btn btn-primary" onclick="processRSVP()">Confirm RSVP</button>
                    </div>
                `;
            }
            
            modal.style.display = 'flex';
        }
        
        // Function to open tour booking modal
        function openTourModal(eventName) {
            modalEventTitle.textContent = `Book ${eventName}`;
            
            modalBody.innerHTML = `
                <div class="form-group">
                    <label for="tourDate">Preferred Date</label>
                    <input type="date" id="tourDate" required>
                </div>
                <div class="form-group">
                    <label for="tourTime">Preferred Time</label>
                    <select id="tourTime" required>
                        <option value="">Select Time</option>
                        <option value="10:00">10:00 AM</option>
                        <option value="14:00">2:00 PM</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="tourParticipants">Number of Participants</label>
                    <input type="number" id="tourParticipants" min="1" max="15" value="1" required>
                </div>
                <div class="form-group">
                    <label for="tourName">Contact Person Name</label>
                    <input type="text" id="tourName" required>
                </div>
                <div class="form-group">
                    <label for="tourEmail">Email Address</label>
                    <input type="email" id="tourEmail" required>
                </div>
                <div class="form-group">
                    <label for="tourPhone">Phone Number</label>
                    <input type="tel" id="tourPhone" required>
                </div>
                <div class="modal-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                    <button type="button" class="btn btn-primary" onclick="processTourBooking()">Book Tour</button>
                </div>
            `;
            
            // Set minimum date to tomorrow
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            document.getElementById('tourDate').min = tomorrow.toISOString().split('T')[0];
            
            modal.style.display = 'flex';
        }
        
        // Function to close modal
        function closeModal() {
            modal.style.display = 'none';
        }
        
        // Function to update quantity
        function updateQuantity(type, change) {
            const input = document.getElementById(`${type}Qty`);
            let value = parseInt(input.value) + change;
            
            if (value < 0) value = 0;
            if (value > parseInt(input.max)) value = parseInt(input.max);
            
            input.value = value;
        }
        
        // Function to process ticket purchase
        function processTicketPurchase() {
            const gaQty = parseInt(document.getElementById('gaQty').value);
            const vipQty = parseInt(document.getElementById('vipQty').value);
            const familyQty = parseInt(document.getElementById('familyQty').value);
            const name = document.getElementById('ticketName').value;
            const email = document.getElementById('ticketEmail').value;
            const phone = document.getElementById('ticketPhone').value;
            
            if (gaQty + vipQty + familyQty === 0) {
                alert('Please select at least one ticket.');
                return;
            }
            
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Calculate total
            const total = (gaQty * 500) + (vipQty * 1500) + (familyQty * 1600);
            
            // In a real application, this would process payment
            alert(`Thank you, ${name}! Your ticket purchase for KES ${total} has been processed. A confirmation has been sent to ${email}.`);
            closeModal();
        }
        
        // Function to process gala purchase
        function processGalaPurchase() {
            const standardQty = parseInt(document.getElementById('standardQty').value);
            const vipTableQty = parseInt(document.getElementById('vipTableQty').value);
            const name = document.getElementById('galaName').value;
            const email = document.getElementById('galaEmail').value;
            const phone = document.getElementById('galaPhone').value;
            
            if (standardQty + vipTableQty === 0) {
                alert('Please select at least one ticket.');
                return;
            }
            
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Calculate total
            const total = (standardQty * 3000) + (vipTableQty * 40000);
            
            // In a real application, this would process payment
            alert(`Thank you, ${name}! Your gala ticket purchase for KES ${total} has been processed. A confirmation has been sent to ${email}.`);
            closeModal();
        }
        
        // Function to process clinic registration
        function processClinicRegistration() {
            const participantName = document.getElementById('participantName').value;
            const age = document.getElementById('participantAge').value;
            const guardianName = document.getElementById('guardianName').value;
            const email = document.getElementById('guardianEmail').value;
            const phone = document.getElementById('guardianPhone').value;
            const experienceLevel = document.getElementById('experienceLevel').value;
            
            if (!participantName || !age || !guardianName || !email || !phone || !experienceLevel) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, this would save the registration
            alert(`Thank you for registering ${participantName} for the Youth Football Clinic! A confirmation has been sent to ${email}.`);
            closeModal();
        }
        
        // Function to process RSVP
        function processRSVP() {
            const name = document.getElementById('rsvpName').value;
            const email = document.getElementById('rsvpEmail').value;
            const phone = document.getElementById('rsvpPhone').value;
            
            if (!name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, this would save the RSVP
            alert(`Thank you, ${name}! Your RSVP has been confirmed. A confirmation has been sent to ${email}.`);
            closeModal();
        }
        
        // Function to process tour booking
        function processTourBooking() {
            const date = document.getElementById('tourDate').value;
            const time = document.getElementById('tourTime').value;
            const participants = document.getElementById('tourParticipants').value;
            const name = document.getElementById('tourName').value;
            const email = document.getElementById('tourEmail').value;
            const phone = document.getElementById('tourPhone').value;
            
            if (!date || !time || !participants || !name || !email || !phone) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // In a real application, this would save the booking
            alert(`Thank you, ${name}! Your stadium tour has been booked for ${date} at ${time}. A confirmation has been sent to ${email}.`);
            closeModal();
        }
        
        // Initialize page
        document.addEventListener('DOMContentLoaded', function() {
            // Add animation to event cards
            const observerOptions = {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Apply animation to event cards
            document.querySelectorAll('.event-card').forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        });