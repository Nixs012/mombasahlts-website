// Admin Panel JavaScript
import { initNews } from './modules/news.js';
import { initPlayers } from './modules/players.js';
import { initShop } from './modules/shop.js';
import { initMatches } from './modules/matches.js';
import { initUI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', function() {
    // Check for admin token
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // You might want to verify the token with the backend here
    // For now, we'll just check for its presence.

    // Initialize core UI and modules
    initUI();
    initNews();
    initPlayers();
    initShop();
    initMatches();
    
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.querySelector('.sidebar-overlay');

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            sidebarOverlay.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
        });

        sidebarOverlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            sidebarOverlay.style.display = 'none';
        });
    }

    // Tab functionality
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('page-title');
    
    function switchTab(tabName) {
        tabContents.forEach(tab => tab.classList.remove('active'));
        const selectedTab = document.getElementById(`${tabName}-tab`);
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        const tabTitle = Array.from(sidebarLinks).find(link => link.getAttribute('data-tab') === tabName);
        if (tabTitle) {
            pageTitle.textContent = tabTitle.textContent.trim();
        }
        
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-tab') === tabName) {
                link.classList.add('active');
            }
        });
        
        sessionStorage.setItem('activeTab', tabName);
    }
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
    
    const activeTab = sessionStorage.getItem('activeTab');
    if (activeTab) {
        switchTab(activeTab);
    } else {
        switchTab('dashboard'); // Default to dashboard
    }

    // Logout functionality
    const logoutButton = document.getElementById('logout-button');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('adminToken');
            window.location.href = 'login.html';
        });
    }
});
