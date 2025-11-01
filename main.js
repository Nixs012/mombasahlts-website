// Mobile Sidebar Toggle - Enhanced with Accessibility Features
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const mobileSidebar = document.querySelector('.mobile-sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const sidebarClose = document.querySelector('.sidebar-close');

    // Safely toggle sidebar with ARIA attributes
    function toggleMobileSidebar() {
        if (mobileSidebar && sidebarOverlay) {
            const isOpening = !mobileSidebar.classList.contains('active');
            
            mobileSidebar.classList.toggle('active');
            sidebarOverlay.classList.toggle('active');
            document.body.classList.toggle('sidebar-open');
            
            // Update ARIA attributes
            if (mobileToggle) mobileToggle.setAttribute('aria-expanded', isOpening);
            if (mobileSidebar) mobileSidebar.setAttribute('aria-hidden', !isOpening);
            
            // Lock scroll when sidebar is open
            document.body.style.overflow = isOpening ? 'hidden' : '';
            
            // Focus management
            if (isOpening && sidebarClose) {
                sidebarClose.focus();
            } else if (mobileToggle) {
                mobileToggle.focus();
            }
        }
    }

    // Event listeners with keyboard support
    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileSidebar);
        mobileToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleMobileSidebar();
            }
        });
    }
    
    if (sidebarClose) {
        sidebarClose.addEventListener('click', toggleMobileSidebar);
        sidebarClose.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                toggleMobileSidebar();
            }
        });
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleMobileSidebar);
    }

    // Header scroll effect with debounce
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    function handleScroll() {
        if (!header) return;
        
        const currentScroll = window.scrollY;
        if (currentScroll <= 0) {
            header.classList.remove('scrolled-up', 'scrolled-down');
            return;
        }
        
        if (currentScroll > lastScroll && currentScroll > 50) {
            header.classList.remove('scrolled-up');
            header.classList.add('scrolled-down');
        } else if (currentScroll < lastScroll) {
            header.classList.remove('scrolled-down');
            header.classList.add('scrolled-up');
        }
        
        lastScroll = currentScroll;
    }

    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(handleScroll, 50);
    });

    // Active link highlighting
    function setActiveLink() {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const links = document.querySelectorAll('.desktop-nav a, .sidebar-nav a');
        
        links.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (currentPath === linkPath) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });
    }

    // Initialize
    setActiveLink();
    handleScroll();
    setupAuthUI();

    // Hero animation
    const heroElements = document.querySelectorAll('.animate-pop-in');
    if (heroElements.length > 0) {
        heroElements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.2 + 0.2}s`;
        });
    }

    // News page specific functionality
    if (document.querySelector('.news-page')) {
        // Category filter functionality
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                categoryBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                // Filter news articles logic would go here
            });
        });
        
        // Pagination functionality
        const pageBtns = document.querySelectorAll('.page-btn');
        pageBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                if(!this.classList.contains('active')) {
                    pageBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    // Pagination logic would go here
        }
    });
});

function setupAuthUI() {
    const token = localStorage.getItem('userToken');
    const userAuthDesktop = document.getElementById('user-auth-desktop');
    const userAuthMobile = document.getElementById('user-auth-mobile');

    if (token) {
        // User is logged in
        const userDashboardLink = '<a href="user.html">My Account</a>';
        const logoutLink = '<a href="#" id="logout-link">Logout</a>';
        if (userAuthDesktop) userAuthDesktop.innerHTML = `${userDashboardLink} | ${logoutLink}`;
        if (userAuthMobile) userAuthMobile.innerHTML = `<li>${userDashboardLink}</li><li>${logoutLink}</li>`;

        const logoutLinks = document.querySelectorAll('#logout-link');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('userToken');
                window.location.href = 'login.html';
            });
        });
    } else {
        // User is logged out
        const loginLink = '<a href="login.html">Login</a>';
        const registerLink = '<a href="register.html">Register</a>';
        if (userAuthDesktop) userAuthDesktop.innerHTML = `${loginLink} | ${registerLink}`;
        if (userAuthMobile) userAuthMobile.innerHTML = `<li>${loginLink}</li><li>${registerLink}</li>`;
    }
}
    }

    // Single article page functionality
    if (document.querySelector('.article-container')) {
        loadArticleContent();
    }

    // News filtering functionality
    if (document.querySelector('.news-categories')) {
        setupNewsFiltering();
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Article data - will be replaced with database fetch later
const articles = {
    '1': {
        title: "Hamlets Secure Dramatic Last-Minute Victory",
        date: "June 15, 2025",
        category: "Match Reports",
        author: "Sports Reporter",
        image: "../images/1.jpeg",
        content: `
            <p>Mombasa Hamlets FC pulled off a stunning comeback to defeat Coastal United 2-1 in a thrilling encounter at Hamlets Arena on Saturday evening.</p>
            
            <p>The home side found themselves trailing after 35 minutes when Coastal's striker capitalized on a defensive error. Hamlets struggled to create chances in the first half, going into the break 1-0 down.</p>
            
            <img src="../images/news2.jpg" alt="Match action photo">
            
            <p>The second half saw a transformed Hamlets side, with manager Rajab Ali making two tactical substitutions at halftime. The equalizer came in the 68th minute when young midfielder Hassan Juma fired home from the edge of the box.</p>
            
            <p>As the match entered stoppage time, it looked destined to end in a draw until captain Ali Mwinyi rose highest to meet a corner in the 93rd minute, sending the home crowd into raptures.</p>
            
            <blockquote>
                "This shows the character of our team," said Mwinyi after the match. "We never give up, and the fans deserved this victory."
            </blockquote>
            
            <p>The win moves Hamlets up to 4th in the league table, just 3 points behind leaders Mombasa City. Next up is an away trip to Kisumu Rangers on Wednesday night.</p>
            
            <img src="../images/news3.jpg" alt="Team celebration">
            
            <p><strong>Lineup:</strong> Omar (GK), Kamau, Mwinyi (C), Okoth, Waweru; Juma, Ali, Mwakio; Baraka, Abdi, Mwamba</p>
            
            <p><strong>Substitutes:</strong> Simiyu (for Mwakio 63'), Kipchumba (for Baraka 71'), Onyango (for Abdi 85')</p>
            
            <p><strong>Goals:</strong> Juma 68', Mwinyi 90+3'</p>
        `
    },
    '2': {
        title: "Hamlets Sign Promising Young Striker",
        date: "June 10, 2025",
        category: "Transfers",
        author: "Club Correspondent",
        image: "../images/news2.jpg",
        content: `
            <p>The club is delighted to announce the signing of 19-year-old striker Jamal Abdi from Nairobi Youth Academy on a three-year contract.</p>
            
            <p>Abdi, who scored 22 goals in the youth league last season, is regarded as one of the most promising young talents in the country.</p>
            
            <img src="../images/news3.jpg" alt="New signing presentation">
            
            <p>"We've been following Jamal's progress for some time," said manager Rajab Ali. "He has tremendous potential and fits perfectly with our style of play."</p>
            
            <p>The young striker will wear the number 19 shirt and is expected to make his debut in next week's friendly match.</p>
        `
    },
    '3': {
        title: "Players Visit Local Children's Hospital",
        date: "June 5, 2025",
        category: "Community",
        author: "Community Reporter",
        image: "../images/news3.jpg",
        content: `
            <p>First-team players spent the afternoon at Mombasa Children's Hospital, bringing smiles and gifts to young patients as part of the club's community outreach program.</p>
            
            <p>The players visited various wards, signing autographs, taking photos, and distributing club merchandise to the children.</p>
            
            <img src="../images/news4.jpg" alt="Player visiting children's hospital">
            
            <p>Captain Ali Mwinyi said: "It's important for us to give back to the community that supports us so passionately. Seeing the smiles on these children's faces is more rewarding than any victory on the pitch."</p>
            
            <p>The hospital visit is part of the club's "Hamlets in the Community" initiative, which has been running for five years and includes various programs aimed at supporting local causes.</p>
        `
    },
    '4': {
        title: "U18s Reach National Cup Final",
        date: "May 28, 2025",
        category: "Academy",
        author: "Youth Team Reporter",
        image: "../images/news4.jpg",
        content: `
            <p>Our youth team secured their place in the National Youth Cup Final with a comprehensive 3-0 victory over Kisumu All-Stars in the semifinal.</p>
            
            <p>The young Hamlets dominated from start to finish, with goals from Said Mohammed, Fatuma Ahmed, and Brian Ochieng securing a memorable victory.</p>
            
            <img src="../images/academy-team.jpg" alt="U18s team celebration">
            
            <p>"I'm incredibly proud of these boys," said academy director James Mwangi. "They've worked hard all season and deserve this opportunity to play in the final."</p>
            
            <p>The final will be played next Saturday at the National Stadium against either Nairobi City or Nakuru United.</p>
        `
    },
    '5': {
        title: "Manager Discusses Season Objectives",
        date: "May 22, 2025",
        category: "Interviews",
        author: "Chief Sports Writer",
        image: "../images/news5.jpg",
        content: `
            <p>In an exclusive interview, head coach Rajab Ali shares his thoughts on the team's progress and targets for the remainder of the season.</p>
            
            <p>"We're exactly where we wanted to be at this stage of the season," said Ali. "The players have bought into our philosophy and we're seeing the results on the pitch."</p>
            
            <img src="../images/manager-interview.jpg" alt="Manager interview">
            
            <p>When asked about the team's objectives for the rest of the season, Ali was clear: "Our focus is on securing a top-four finish and having a good run in the cup competitions. We believe we can achieve something special this season."</p>
            
            <p>The manager also praised the club's supporters: "Our fans have been incredible. Their support home and away gives the players an extra motivation."</p>
        `
    }
};

// Load article content for single article pages
function loadArticleContent() {
    // Get article ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    // DOM elements
    const loadingEl = document.getElementById('article-loading');
    const containerEl = document.getElementById('article-container');
    const errorEl = document.getElementById('article-error');
    const titleEl = document.getElementById('article-title');
    const metaEl = document.getElementById('article-meta');
    const authorEl = document.getElementById('article-author');
    const readTimeEl = document.getElementById('read-time');
    const imageEl = document.getElementById('article-image');
    const contentEl = document.getElementById('article-content');

    // Calculate reading time (approx 200 words per minute)
    function calculateReadTime(text) {
        const wordCount = text.split(/\s+/).length;
        return Math.ceil(wordCount / 200);
    }

    // Display the article
    function showArticle(article) {
        // Update page title
        document.title = `${article.title} - Mombasa Hamlets FC`;
        
        // Update hero section
        if (titleEl) titleEl.textContent = article.title;
        if (metaEl) metaEl.textContent = `${article.category} • ${article.date}`;
        
        // Update meta info
        if (authorEl) authorEl.textContent = article.author;
        if (readTimeEl) readTimeEl.textContent = `${calculateReadTime(article.content)} min read`;
        
        // Update image
        if (imageEl) {
            imageEl.src = article.image;
            imageEl.alt = article.title;
        }
        
        // Update content
        if (contentEl) contentEl.innerHTML = article.content;
        
        // Show container and hide loader
        if (loadingEl) loadingEl.style.display = 'none';
        if (containerEl) containerEl.style.display = 'block';
    }

    // Show error state
    function showError() {
        if (loadingEl) loadingEl.style.display = 'none';
        if (errorEl) errorEl.style.display = 'block';
    }

    // Load the article
    if (articleId && articles[articleId]) {
        // Simulate loading delay (remove this in production)
        setTimeout(() => {
            showArticle(articles[articleId]);
        }, 500);
    } else {
        showError();
    }
}

// Setup news filtering functionality
function setupNewsFiltering() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const newsArticles = document.querySelectorAll('.news-article');
    
    if (categoryButtons.length === 0 || newsArticles.length === 0) return;
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get the category to filter by
            const category = button.getAttribute('data-category');
            
            // Show/hide articles based on category
            newsArticles.forEach(article => {
                if (category === 'all') {
                    article.style.display = 'block';
                } else {
                    if (article.getAttribute('data-category') === category) {
                        article.style.display = 'block';
                    } else {
                        article.style.display = 'none';
                    }
                }
            });
        });
    });
    
    // Pagination functionality
    const pageButtons = document.querySelectorAll('.page-btn');
    
    pageButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Previous' || button.textContent === 'Next') {
                alert("Pagination would load more articles here.");
                return;
            }
            
            pageButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
}

// FAQ toggle functionality
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        item.classList.toggle('active');
    });
});

// Form submission handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Smooth scrolling for table of contents
document.querySelectorAll('.toc a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        }
    });
});
