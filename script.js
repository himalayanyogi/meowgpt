// Meow GPT - Main JavaScript File
class MeowGPT {
    constructor() {
        this.chatContainer = document.getElementById('chatContainer');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.errorMessage = document.getElementById('errorMessage');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.personalitySelect = document.getElementById('personalitySelect');
        
        this.isTyping = false;
        this.messageHistory = [];
        this.currentPersonality = CONFIG.DEFAULT_PERSONALITY;
        
        this.init();
    }
    
    init() {
        // Event listeners
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize input
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        
        // Personality selector event listener
        this.personalitySelect.addEventListener('change', (e) => {
            this.switchPersonality(e.target.value);
        });
        
        // Load chat history from localStorage
        this.loadChatHistory();
        
        // Load saved personality
        this.loadPersonality();
        
        console.log('🐱 Meow GPT initialized successfully!');
    }
    
    handleInputChange() {
        const message = this.messageInput.value.trim();
        this.sendButton.disabled = message.length === 0 || this.isTyping;
    }
    
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isTyping) return;
        
        // Add user message to chat
        this.addMessage(message, 'user');
        this.messageInput.value = '';
        this.sendButton.disabled = true;
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getGeminiResponse(message);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add bot response with typewriter effect
            this.addMessageWithTypewriter(response, 'bot');
            
        } catch (error) {
            console.error('Error getting response:', error);
            this.hideTypingIndicator();
            this.showError(this.getErrorMessage(error));
        }
        
        this.sendButton.disabled = false;
    }
    
    addMessage(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🐱';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        // Insert before typing indicator or at the end
        this.chatContainer.appendChild(messageDiv);
        
        // Save to history
        this.messageHistory.push({ content, sender, timestamp: Date.now() });
        this.saveChatHistory();
        
        // Auto scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
        }, CONFIG.UI_CONFIG.autoScrollDelay);
    }
    
    async getGeminiResponse(userMessage) {
        const requestBody = {
            message: userMessage,
            personality: this.currentPersonality
        };
        
        const response = await fetch(`${CONFIG.API_BASE_URL}${CONFIG.CHAT_ENDPOINT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API Error: ${response.status} - ${errorData.error || 'Unknown error'}`);
        }
        
        const data = await response.json();
        
        if (!data.response) {
            throw new Error('Invalid response format from API');
        }
        
        let botResponse = data.response;
        
        // Enhance with cat personality (optional additional enhancement)
        botResponse = this.enhanceWithCatPersonality(botResponse);
        
        return botResponse;
    }
    
    // Note: buildPrompt is now handled on the server side for security
    // The server will build the appropriate prompt based on the personality
    
    switchPersonality(personalityMode) {
        this.currentPersonality = personalityMode;
        
        // Update the dropdown display
        this.personalitySelect.value = personalityMode;
        
        // Apply theme colors
        this.applyTheme(personalityMode);
        
        // Save personality preference
        try {
            localStorage.setItem('meowgpt_personality', personalityMode);
        } catch (error) {
            console.warn('Could not save personality preference:', error);
        }
        
        // Update UI to show personality change
        const personalityInfo = CONFIG.PERSONALITY_MODES[personalityMode];
        if (personalityInfo) {
            this.addSystemMessage(`Switched to ${personalityInfo.name} mode! ${personalityInfo.emoji}`);
        }
        
        console.log(`🐱 Switched to ${personalityInfo?.name || 'Unknown'} personality mode`);
    }
    
    applyTheme(personalityMode) {
        const personalityInfo = CONFIG.PERSONALITY_MODES[personalityMode];
        if (!personalityInfo || !personalityInfo.colors) return;
        
        const colors = personalityInfo.colors;
        const root = document.documentElement;
        
        // Apply CSS custom properties
        root.style.setProperty('--primary-color', colors.primary);
        root.style.setProperty('--secondary-color', colors.secondary);
        root.style.setProperty('--accent-color', colors.accent);
        root.style.setProperty('--background-gradient', colors.background);
        root.style.setProperty('--header-gradient', colors.headerBg);
        
        console.log(`🎨 Applied ${personalityInfo.name} theme colors`);
    }
    
    loadPersonality() {
        try {
            const savedPersonality = localStorage.getItem('meowgpt_personality');
            if (savedPersonality && CONFIG.PERSONALITY_MODES[savedPersonality]) {
                this.currentPersonality = savedPersonality;
                this.personalitySelect.value = savedPersonality;
                // Apply the saved theme
                this.applyTheme(savedPersonality);
            } else {
                // Apply default theme
                this.applyTheme(CONFIG.DEFAULT_PERSONALITY);
            }
        } catch (error) {
            console.warn('Could not load personality preference:', error);
            // Apply default theme on error
            this.applyTheme(CONFIG.DEFAULT_PERSONALITY);
        }
    }
    
    addSystemMessage(content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message system-message';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content system-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(messageContent);
        
        this.chatContainer.appendChild(messageDiv);
        
        // Auto scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
        }, CONFIG.UI_CONFIG.autoScrollDelay);
    }
    
    enhanceWithCatPersonality(response) {
        // Randomly add cat expressions or puns (but not too frequently)
        if (Math.random() < 0.3) { // 30% chance
            const expressions = Object.values(CONFIG.CAT_EXPRESSIONS).flat();
            const randomExpression = expressions[Math.floor(Math.random() * expressions.length)];
            
            // Add expression at the end occasionally
            if (Math.random() < 0.5) {
                response += ` *${randomExpression}* 🐾`;
            }
        }
        
        return response;
    }
    
    showTypingIndicator() {
        this.isTyping = true;
        this.typingIndicator.style.display = 'block';
        this.scrollToBottom();
    }
    
    hideTypingIndicator() {
        this.isTyping = false;
        this.typingIndicator.style.display = 'none';
    }
    
    showError(message) {
        const errorText = this.errorMessage.querySelector('.error-text');
        errorText.textContent = message;
        this.errorMessage.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            this.hideError();
        }, 5000);
    }
    
    hideError() {
        this.errorMessage.style.display = 'none';
    }
    
    getErrorMessage(error) {
        const errorString = error.toString().toLowerCase();
        
        if (errorString.includes('network') || errorString.includes('fetch')) {
            return CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
        } else if (errorString.includes('429') || errorString.includes('rate limit')) {
            return CONFIG.ERROR_MESSAGES.RATE_LIMIT;
        } else if (errorString.includes('400') || errorString.includes('invalid')) {
            return CONFIG.ERROR_MESSAGES.INVALID_INPUT;
        } else if (errorString.includes('api')) {
            return CONFIG.ERROR_MESSAGES.API_ERROR;
        } else {
            return CONFIG.ERROR_MESSAGES.GENERAL_ERROR;
        }
    }
    
    scrollToBottom() {
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }
    
    saveChatHistory() {
        try {
            // Keep only last 50 messages to avoid localStorage bloat
            const historyToSave = this.messageHistory.slice(-50);
            localStorage.setItem('meowgpt_history', JSON.stringify(historyToSave));
        } catch (error) {
            console.warn('Could not save chat history:', error);
        }
    }
    
    loadChatHistory() {
        try {
            const savedHistory = localStorage.getItem('meowgpt_history');
            if (savedHistory) {
                this.messageHistory = JSON.parse(savedHistory);
                
                // Restore messages (but limit to last 10 for UI performance)
                const messagesToShow = this.messageHistory.slice(-10);
                
                // Clear welcome message if we have history
                if (messagesToShow.length > 0) {
                    const welcomeMessage = this.chatContainer.querySelector('.welcome-message');
                    if (welcomeMessage) {
                        welcomeMessage.remove();
                    }
                    
                    // Add messages
                    messagesToShow.forEach(msg => {
                        this.addMessageToUI(msg.content, msg.sender);
                    });
                }
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        }
    }
    
    addMessageToUI(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🐱';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = content;
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatContainer.appendChild(messageDiv);
    }
    
    addMessageWithTypewriter(content, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.textContent = sender === 'user' ? '👤' : '🐱';
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        const messageText = document.createElement('p');
        messageText.textContent = ''; // Start empty for typewriter effect
        
        messageContent.appendChild(messageText);
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        // Insert the message container
        this.chatContainer.appendChild(messageDiv);
        
        // Start typewriter animation
        this.typewriterEffect(messageText, content, () => {
            // Save to history after animation completes
            this.messageHistory.push({ content, sender, timestamp: Date.now() });
            this.saveChatHistory();
        });
        
        // Auto scroll to bottom
        setTimeout(() => {
            this.scrollToBottom();
        }, CONFIG.UI_CONFIG.autoScrollDelay);
    }
    
    typewriterEffect(element, text, callback) {
        let index = 0;
        const speed = CONFIG.UI_CONFIG.typewriterSpeed; // Typing speed in milliseconds
        
        const typeChar = () => {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                
                // Scroll to bottom as text appears
                this.scrollToBottom();
                
                setTimeout(typeChar, speed);
            } else if (callback) {
                callback();
            }
        };
        
        typeChar();
    }
    
    clearHistory() {
        this.messageHistory = [];
        localStorage.removeItem('meowgpt_history');
        
        // Clear UI messages except welcome
        const messages = this.chatContainer.querySelectorAll('.message');
        messages.forEach(msg => {
            if (!msg.closest('.welcome-message')) {
                msg.remove();
            }
        });
        
        console.log('🐱 Chat history cleared!');
    }
}

// Global functions for HTML event handlers
function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function clearChat() {
    if (window.meowGPT) {
        window.meowGPT.clearHistory();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.meowGPT = new MeowGPT();
});

// Add some fun console messages
console.log(`
🐱 Welcome to Meow GPT! 🐾
═══════════════════════════
Your purr-fect AI assistant is ready!
Type your messages and let's have a paw-some conversation!

Tips:
- Press Enter to send messages
- Your chat history is saved locally
- Clear history with clearChat() in console
`);