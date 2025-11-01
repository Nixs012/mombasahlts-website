// Media Gallery Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const mediaItems = document.querySelectorAll('.photo-card, .video-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            
            // Show/hide media items based on filter
            mediaItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // Lightbox functionality for photos
    const photoCards = document.querySelectorAll('.photo-card');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentPhotoIndex = 0;
    const photos = Array.from(photoCards);
    
    // Open lightbox when a photo is clicked
    photoCards.forEach((photo, index) => {
        photo.addEventListener('click', () => {
            currentPhotoIndex = index;
            updateLightbox();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Navigate to previous photo
    lightboxPrev.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
        updateLightbox();
    });
    
    // Navigate to next photo
    lightboxNext.addEventListener('click', () => {
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        updateLightbox();
    });
    
    // Update lightbox content
    function updateLightbox() {
        const photo = photos[currentPhotoIndex];
        const imgSrc = photo.querySelector('.photo-image').src;
        const title = photo.querySelector('.photo-info h3').textContent;
        const description = photo.querySelector('.photo-info p').textContent;
        
        lightboxImage.src = imgSrc;
        lightboxImage.alt = title;
        lightboxCaption.textContent = `${title} - ${description}`;
    }
    
    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    let currentItems = 8; // Initial number of items displayed
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            const mediaItems = document.querySelectorAll('.photo-card, .video-card');
            
            for (let i = currentItems; i < currentItems + 4; i++) {
                if (mediaItems[i]) {
                    mediaItems[i].style.display = 'block';
                }
            }
            
            currentItems += 4;
            
            // Hide button when all items are loaded
            if (currentItems >= mediaItems.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
});