// Hardcoded user credentials for demonstration (in real app, use secure backend)
const validCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Check if user is already logged in
function checkAuthStatus() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    } else if (!isLoggedIn && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
    }
}

// Handle login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === validCredentials.username && password === validCredentials.password) {
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('currentUser', username);
        window.location.href = 'index.html';
    } else {
        document.getElementById('errorMessage').style.display = 'block';
    }
});

// Initialize auth check
checkAuthStatus();