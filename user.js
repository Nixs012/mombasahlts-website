document.addEventListener('DOMContentLoaded', () => {
    const userToken = localStorage.getItem('userToken');
    const usernameSpan = document.getElementById('username');
    const logoutButton = document.getElementById('logout-button');

    if (!userToken) {
        // If no token is found, redirect to the login page
        window.location.href = 'login.html';
        return;
    }

    try {
        // Decode the token to get user information
        const decodedToken = JSON.parse(atob(userToken.split('.')[1]));
        usernameSpan.textContent = decodedToken.username;
    } catch (error) {
        console.error('Error decoding token:', error);
        // If the token is invalid, redirect to the login page
        window.location.href = 'login.html';
        return;
    }

    // Add event listener for the logout button
    logoutButton.addEventListener('click', () => {
        // Remove the token from local storage
        localStorage.removeItem('userToken');
        // Redirect to the login page
        window.location.href = 'login.html';
    });
});
