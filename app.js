/*
  This is our NEW JavaScript file.
  It uses Supabase to handle real user accounts.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // Note: The '_supabase' object is created in index.html
    
    // --- Get all the HTML elements ---
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    const logoutButton = document.getElementById('logout-button');

    // Forms
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // Form Inputs
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const registerEmail = document.getElementById('register-email');
    const registerPassword = document.getElementById('register-password');

    // Error message displays
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Links to switch between forms
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    
    // --- Show/Hide Functions ---
    const showApp = () => {
        authContainer.classList.add('hidden');
        appContainer.classList.remove('hidden');
    };
    
    const showAuth = () => {
        appContainer.classList.add('hidden');
        authContainer.classList.remove('hidden');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginError.classList.add('hidden');
        registerError.classList.add('hidden');
        // Clear forms on logout
        loginEmail.value = '';
        loginPassword.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
    };

    // --- Switch between Login and Register ---
    showRegisterLink.addEventListener('click', () => {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        loginError.classList.add('hidden');
    });

    showLoginLink.addEventListener('click', () => {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        registerError.classList.add('hidden');
    });

    // --- Handle REAL Register ---
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = registerEmail.value;
        const password = registerPassword.value;

        // Supabase sign up
        const { data, error } = await _supabase.auth.signUp({
            email: email,
            password: password,
        });

        if (error) {
            registerError.textContent = error.message;
            registerError.classList.remove('hidden');
        } else {
            // Success! Supabase will send a confirmation email.
            // For now, we'll just log them in, but you should check your email!
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            alert('Success! Please check your email to confirm your account.');
        }
    });
    
    // --- Handle REAL Login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;

        // Supabase sign in
        const { data, error } = await _supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (error) {
            loginError.textContent = error.message;
            loginError.classList.remove('hidden');
        } else {
            // Success! onAuthStateChange will handle showing the app
            console.log('Logged in user:', data.user);
        }
    });
    
    // --- Handle REAL Logout ---
    logoutButton.addEventListener('click', async () => {
        const { error } = await _supabase.auth.signOut();
        if (error) {
            console.error('Error logging out:', error.message);
        }
    });

    // --- Listen for Auth State Changes ---
    // This runs when the page loads, and whenever someone logs in or out.
    _supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
            // User is signed in!
            console.log('Auth state changed: Logged in', session.user);
            showApp();
        } else {
            // User is signed out.
            console.log('Auth state changed: Logged out');
            showAuth();
        }
    });

});
