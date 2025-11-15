/*
  This is our NEW JavaScript file.
  It uses "polling" (a timer) instead of real-time replication.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    let currentUser = null;
    let messagePolling = null; // This will hold our timer
    
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
    
    // --- CHAT ELEMENTS ---
    const userEmailDisplay = document.getElementById('user-email-display');
    const messagesContainer = document.getElementById('messages-container');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    
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
        const { data, error } = await _supabase.auth.signUp({ email, password });

        if (error) {
            registerError.textContent = error.message;
            registerError.classList.remove('hidden');
        } else {
            alert('Success! Check your email to confirm your account.'); // Or not, if you turned it off
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
        }
    });
    
    // --- Handle REAL Login ---
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = loginEmail.value;
        const password = loginPassword.value;
        const { data, error } = await _supabase.auth.signInWithPassword({ email, password });

        if (error) {
            loginError.textContent = error.message;
            loginError.classList.remove('hidden');
        } else {
            console.log('Logged in user:', data.user);
        }
    });
    
    // --- Handle REAL Logout ---
    logoutButton.addEventListener('click', async () => {
        await _supabase.auth.signOut();
    });

    // --- Listen for Auth State Changes ---
    _supabase.auth.onAuthStateChange((_event, session) => {
        if (session && session.user) {
            // User is signed in!
            currentUser = session.user; // Save the user
            userEmailDisplay.textContent = `(Logged in as: ${currentUser.email})`;
            showApp();
            
            // --- NEW: Load messages and start polling ---
            loadMessages(); // Load messages once
            
            // Stop any old timer
            if (messagePolling) clearInterval(messagePolling); 
            
            // Start a new timer to check for messages every 3 seconds
            messagePolling = setInterval(loadMessages, 3000); 
            
        } else {
            // User is signed out.
            currentUser = null;
            userEmailDisplay.textContent = '';
            showAuth();
            
            // --- NEW: Stop the timer when logged out ---
            if (messagePolling) clearInterval(messagePolling);
            messagesContainer.innerHTML = ''; // Clear messages from screen
        }
    });
    
    // --- Handle Sending a Message ---
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading
        
        const content = messageInput.value; // Get the text
        
        if (content && currentUser) {
            // Send the message to the 'messages' table in Supabase
            const { error } = await _supabase.from('messages').insert({
                content: content,
                user_email: currentUser.email
            });
            
            if (error) {
                console.error('Error sending message:', error.message);
            } else {
                messageInput.value = ''; // Clear the input box
                // We'll just wait for the poll to pick up the new message
            }
        }
    });
    
    // --- A helper function to display a single message ---
    // (This is the same as before)
    const displayMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        const userEmailElement = document.createElement('strong');
        userEmailElement.textContent = `${message.user_email}: `; 
        
        const contentElement = document.createElement('span');
        contentElement.textContent = message.content;
        
        messageElement.appendChild(userEmailElement);
        messageElement.appendChild(contentElement);
        messagesContainer.appendChild(messageElement);
    };
    
    // --- Load all messages ---
    const loadMessages = async () => {
        
        // Get all messages from the 'messages' table
        const { data: messages, error } = await _supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true }); // Get oldest first
            
        if (error) {
            console.error('Error loading messages:', error.message);
        } else {
            // --- NEW: Only redraw if needed ---
            // A simple check: if the number of messages is different
            // This stops the chat from "flashing" every 3 seconds
            const currentMessageCount = messagesContainer.children.length;
            if (messages.length !== currentMessageCount) {
                
                messagesContainer.innerHTML = ''; // Clear old messages
                messages.forEach(displayMessage); // Display each message
                
                // Auto-scroll to the bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    };
    
    // --- REMOVED ---
    // The listenForMessages() function has been completely removed.

});
