/*
  This is our NEW JavaScript file.
  It now includes Display Name logic.
*/

document.addEventListener('DOMContentLoaded', () => {
    
    let currentUser = null;
    let messagePolling = null; 
    
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
    const registerDisplayName = document.getElementById('register-display-name'); 

    // Error message displays
    const loginError = document.getElementById('login-error');
    const registerError = document.getElementById('register-error');

    // Links to switch between forms
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    
    // --- CHAT ELEMENTS ---
    const userDisplay = document.getElementById('user-display'); 
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
        // Clear forms
        loginEmail.value = '';
        loginPassword.value = '';
        registerEmail.value = '';
        registerPassword.value = '';
        registerDisplayName.value = ''; 
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
        const displayName = registerDisplayName.value; 
        
        const { data, error } = await _supabase.auth.signUp({ 
            email, 
            password,
            options: {
                data: {
                    display_name: displayName
                }
            }
        });

        if (error) {
            registerError.textContent = error.message;
            registerError.classList.remove('hidden');
        } else {
            alert('Success! Check your email to confirm your account.');
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
            currentUser = session.user; 
            
            const displayName = currentUser.user_metadata.display_name || currentUser.email;
            userDisplay.textContent = `(Logged in as: ${displayName})`; 
            
            showApp();
            
            loadMessages(); 
            if (messagePolling) clearInterval(messagePolling); 
            messagePolling = setInterval(loadMessages, 3000); 
            
        } else {
            currentUser = null;
            userDisplay.textContent = ''; 
            showAuth();
            
            if (messagePolling) clearInterval(messagePolling);
            messagesContainer.innerHTML = ''; 
        }
    });
    
    // --- Handle Sending a Message ---
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault(); 
        
        const content = messageInput.value;
        const displayName = currentUser.user_metadata.display_name || currentUser.email;
        
        if (content && currentUser) {
            const { error } = await _supabase.from('messages').insert({
                content: content,
                user_email: currentUser.email,
                display_name: displayName 
            });
            
            if (error) {
                console.error('Error sending message:', error.message);
            } else {
                messageInput.value = ''; 
            }
        }
    });
    
    // --- A helper function to display a single message ---
    // *** THIS IS THE ONLY SECTION THAT CHANGED ***
    const displayMessage = (message) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        
        // --- 1. Create the timestamp element ---
        const timestampElement = document.createElement('span');
        timestampElement.classList.add('timestamp');
        // Convert the ugly string into a readable time
        const date = new Date(message.created_at);
        timestampElement.textContent = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        
        // --- 2. Create the display name element ---
        const userElement = document.createElement('strong');
        userElement.textContent = `${message.display_name || message.user_email}: `; 
        
        // --- 3. Create the message content element ---
        const contentElement = document.createElement('span');
        contentElement.textContent = message.content;
        
        // --- 4. Add them to the page in the right order ---
        messageElement.appendChild(userElement);
        messageElement.appendChild(contentElement);
        messageElement.appendChild(timestampElement); // Add timestamp last
        
        messagesContainer.appendChild(messageElement);
    };
    
    // --- Load all messages ---
    const loadMessages = async () => {
        
        const { data: messages, error } = await _supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: true }); 
            
        if (error) {
            console.error('Error loading messages:', error.message);
        } else {
            const currentMessageCount = messagesContainer.children.length;
            if (messages.length !== currentMessageCount) {
                
                messagesContainer.innerHTML = ''; 
                messages.forEach(displayMessage); 
                
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        }
    };

});
