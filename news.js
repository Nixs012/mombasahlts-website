// backend/admin/js/modules/news.js

const API_URL = 'http://localhost:5000/api';

// Function to fetch and display news articles
async function fetchNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        if (!response.ok) throw new Error('Failed to fetch news');
        const newsItems = await response.json();
        
        const newsTableBody = document.querySelector('#news-tab .admin-table tbody');
        if (!newsTableBody) return;
        
        newsTableBody.innerHTML = ''; // Clear existing rows
        
        newsItems.forEach(article => {
            const row = `
                <tr>
                    <td>${article.title}</td>
                    <td>${article.category}</td>
                    <td>${new Date(article.created_at).toLocaleDateString()}</td>
                    <td><span class="status-${article.status || 'draft'}">${article.status || 'draft'}</span></td>
                    <td class="actions">
                        <button class="btn-edit" data-id="${article.id}" title="Edit"><i class="fas fa-edit"></i></button>
                        <button class="btn-delete" data-id="${article.id}" title="Delete"><i class="fas fa-trash"></i></button>
                        <button class="btn-publish" data-id="${article.id}" title="Toggle Status"><i class="fas fa-eye"></i></button>
                    </td>
                </tr>
            `;
            newsTableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        alert('Could not load news articles.');
    }
}

// Function to handle form submission for adding/editing news
async function handleNewsSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const articleId = form.dataset.editingId;
    
    const articleData = {
        title: document.getElementById('title').value,
        image_url: document.getElementById('image').value, // Changed from 'image'
        summary: document.getElementById('summary').value,
        category: document.getElementById('category').value,
        is_breaking: document.getElementById('breaking').checked,
        status: 'published' // Default status
    };

    const method = articleId ? 'PUT' : 'POST';
    const url = articleId ? `${API_URL}/news/${articleId}` : `${API_URL}/news`;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(articleData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to save article');
        }

        alert(`Article ${articleId ? 'updated' : 'published'} successfully!`);
        form.reset();
        delete form.dataset.editingId; // Clear editing state
        document.querySelector('#news-tab h2').textContent = 'Add New Article';
        await fetchNews(); // Refresh the list
    } catch (error) {
        console.error('Error saving article:', error);
        alert(`Error: ${error.message}`);
    }
}

// Function to handle editing an article
function handleEdit(id, title, image_url, summary, category, is_breaking) {
    const form = document.getElementById('news-form');
    form.dataset.editingId = id;

    document.getElementById('title').value = title;
    document.getElementById('image').value = image_url;
    document.getElementById('summary').value = summary;
    document.getElementById('category').value = category;
    document.getElementById('breaking').checked = is_breaking;
    
    document.querySelector('#news-tab h2').textContent = 'Edit Article';
    form.scrollIntoView({ behavior: 'smooth' });
}

// Function to handle deleting an article
async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
        const response = await fetch(`${API_URL}/news/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete article');
        
        alert('Article deleted successfully!');
        await fetchNews(); // Refresh the list
    } catch (error) {
        console.error('Error deleting article:', error);
        alert('Could not delete the article.');
    }
}

export function initNews() {
    const newsForm = document.getElementById('news-form');
    const newsTable = document.querySelector('#news-tab .admin-table');

    if (newsForm) {
        newsForm.addEventListener('submit', handleNewsSubmit);
    }

    if (newsTable) {
        newsTable.addEventListener('click', async (e) => {
            const target = e.target.closest('button');
            if (!target) return;

            const id = target.dataset.id;
            if (target.classList.contains('btn-delete')) {
                await handleDelete(id);
            } else if (target.classList.contains('btn-edit')) {
                // Fetch full article details to edit
                try {
                    const response = await fetch(`${API_URL}/news`);
                    const articles = await response.json();
                    const article = articles.find(a => a.id == id);
                    if (article) {
                        handleEdit(article.id, article.title, article.image_url, article.summary, article.category, article.is_breaking);
                    }
                } catch (error) {
                    console.error('Could not fetch article for editing:', error);
                }
            }
        });
    }

    // Initial fetch of news articles when the tab is shown
    const newsTab = document.getElementById('news-tab');
    if (newsTab && new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            fetchNews();
        }
    }).observe(newsTab));
}
