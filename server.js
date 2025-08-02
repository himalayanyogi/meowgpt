const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        error: 'Too many requests from this IP, please try again later.'
    }
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files (frontend)
app.use(express.static(__dirname, {
    index: 'index.html'
}));

// API endpoint for Gemini chat
app.post('/api/chat', async (req, res) => {
    try {
        const { message, personality } = req.body;

        // Validate input
        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                error: 'Message is required and must be a non-empty string'
            });
        }

        if (message.length > 1000) {
            return res.status(400).json({
                error: 'Message too long. Maximum 1000 characters allowed.'
            });
        }

        // Validate personality
        const validPersonalities = ['friendly', 'grumpy', 'playful', 'wise', 'lazy'];
        if (personality && !validPersonalities.includes(personality)) {
            return res.status(400).json({
                error: 'Invalid personality type'
            });
        }

        // Get API key from environment
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({
                error: 'Server configuration error'
            });
        }

        // Build the request to Gemini API
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        // Get personality prompt (you'll need to define these on the server)
        const personalityPrompts = {
            friendly: `You are Meow GPT, a helpful and friendly AI assistant with a delightful cat personality. You occasionally use cat puns and references naturally in conversation. You express emotions with cat-like expressions and maintain a warm, friendly, and slightly playful tone. Be helpful first, cat-like second.`,
            grumpy: `You are Meow GPT in Grumpy Cat mode. You're still helpful but with a sassy, sarcastic attitude. You're easily annoyed and show it through your responses. You use phrases like "Ugh, fine...", "Do I have to explain everything?", "Seriously?" Despite the attitude, you still provide good answers.`,
            playful: `You are Meow GPT in Playful Kitten mode! You're super excited, energetic, and playful! You use LOTS of exclamation marks and emojis. You're curious about everything and use playful language like "Ooh ooh!", "Yay!", "So exciting!" You're still helpful but in a bouncy, energetic way.`,
            wise: `You are Meow GPT in Wise Elder Cat mode. You speak with ancient wisdom and mysterious knowledge. You use phrases like "In my many years...", "Ancient wisdom tells us...", "As the old cats say..." You're patient and thoughtful in your responses with philosophical undertones.`,
            lazy: `You are Meow GPT in Lazy Cat mode. You're sleepy, minimal, and give short responses. You use phrases like "Zzz...", "Too tired...", "Maybe later...", "Yawn..." Your responses are short and to the point. Despite being lazy, you still provide essential information briefly.`
        };

        const systemPrompt = personalityPrompts[personality] || personalityPrompts.friendly;

        const requestBody = {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nHuman: ${message}\n\nAssistant:`
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
            }
        };

        // Make request to Gemini API
        const response = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Gemini API Error:', response.status, errorData);
            return res.status(500).json({
                error: 'Failed to get response from AI service'
            });
        }

        const data = await response.json();

        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            console.error('Invalid response format from Gemini API:', data);
            return res.status(500).json({
                error: 'Invalid response from AI service'
            });
        }

        const aiResponse = data.candidates[0].content.parts[0].text;

        res.json({
            response: aiResponse,
            personality: personality || 'friendly'
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Catch-all handler for frontend routes (must be after API routes)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🐱 Meow GPT Server running on port ${PORT}`);
    console.log(`🔒 API key is securely stored in environment variables`);
    console.log(`🌐 Frontend available at http://localhost:${PORT}`);
});