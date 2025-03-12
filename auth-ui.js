// Function to update authentication UI elements
function updateAuthUI() {
    const loginBtn = document.querySelector('.auth-btn.login-btn');
    const signoutBtn = document.querySelector('.auth-btn.signout-btn');
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn) {
        loginBtn.style.display = 'none';
        signoutBtn.style.display = 'flex';
    } else {
        loginBtn.style.display = 'flex';
        signoutBtn.style.display = 'none';
    }
}

// Handle sign out
function handleSignOut() {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize auth UI
document.addEventListener('DOMContentLoaded', updateAuthUI);