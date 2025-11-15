/*
  This is our new JavaScript file.
  It controls the logic for showing/hiding pages and "faking" the login.
*/

// Wait for the entire page to load before we run our code
document.addEventListener('DOMContentLoaded', () => {

    // --- Get all the HTML elements we need ---
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Links to switch between forms
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    
    // The "Logout" button
    const logoutButton = document.getElementById('logout-button');

    // --- Add click event listeners ---

    // When someone clicks the "Register" link
    showRegisterLink.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    // When someone clicks the "Login" link
    showLoginLink.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // --- Handle Form Submissions ---

    // When someone clicks the "Login" button
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the form from reloading the page
        
        // --- THIS IS THE "FAKE" LOGIN ---
        // We are not checking a real database yet.
        // We'll just pretend it worked!
        
        console.log('Login attempt');
        
        // Hide the auth page
        authContainer.classList.add('hidden');
        
        // Show the main Discord app
        appContainer.classList.remove('hidden');
    });

    // When someone clicks the "Register" button
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the form from reloading the page
        
        // --- THIS IS THE "FAKE" REGISTER ---
        // We are not saving a real user yet.
        // We'll just "log them in" right away.
        
        console.log('Register attempt');
        
        // Hide the auth page
        authContainer.classList.add('hidden');
        
        // Show the main Discord app
        appContainer.classList.remove('hidden');
    });

    // When someone clicks the "Logout" button
    logoutButton.addEventListener('click', () => {
        console.log('Logout');
        
        // Hide the main Discord app
        appContainer.classList.add('hidden');
        
        // Show the auth page
        authContainer.classList.remove('hidden');
        
        // Make sure the login form is the one showing, not register
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

});
