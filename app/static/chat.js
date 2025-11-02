// DOM Elements
const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');

// Configuration
const AI_NAME = 'ModAI';
const TYPING_DELAY = 1000; // Simulate AI typing delay in ms

// Format current time as HH:MM
function getCurrentTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Create a typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingDiv;
}

// Remove typing indicator
function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Format message with markdown support (basic)
function formatMessage(text) {
    // Simple markdown to HTML conversion (bold, italic, links)
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
        .replace(/`(.*?)`/g, '<code>$1</code>') // `code`
        .replace(/\n/g, '<br>'); // New lines
}

// Add a new message to the chat
function appendMessage(content, type) {
    // Remove typing indicator if it exists
    hideTypingIndicator();

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    // Add avatar based on message type
    let avatar = '';
    if (type === 'ai') {
        avatar = '🤖';
    } else if (type === 'user') {
        avatar = '👤';
    } else if (type === 'error') {
        avatar = '⚠️';
    }
    
    // Format message content with markdown support
    const formattedContent = type === 'error' ? content : formatMessage(content);
    
    messageDiv.innerHTML = `
        <div class="message-content">
            ${type !== 'error' ? `<span class="message-avatar">${avatar}</span>` : ''}
            <div class="message-text">${formattedContent}</div>
        </div>
        <div class="message-time">${getCurrentTime()}</div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle sending a message
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    // Disable input and button while sending
    userInput.value = '';
    userInput.disabled = true;
    sendButton.disabled = true;
    
    // Add user message to chat
    appendMessage(message, 'user');
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: message })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Simulate typing delay for better UX
        setTimeout(() => {
            hideTypingIndicator();
            
            if (data.error) {
                appendMessage(data.error, 'error');
            } else {
                appendMessage(data.response, 'ai');
                
                // If there's a warning about moderation, show it
                if (data.warning) {
                    appendMessage(`Note: ${data.warning}`, 'ai');
                }
            }
        }, TYPING_DELAY);
        
    } catch (error) {
        hideTypingIndicator();
        console.error('Error:', error);
        appendMessage(`Sorry, I encountered an error: ${error.message}`, 'error');
    } finally {
        // Re-enable input and button
        userInput.disabled = false;
        sendButton.disabled = false;
        userInput.focus();
    }
}

// Event Listeners
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

sendButton.addEventListener('click', sendMessage);

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Initial focus on input
window.addEventListener('load', () => {
    userInput.focus();
});
