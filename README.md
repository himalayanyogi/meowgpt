# 🐱 Meow GPT - Your Purr-fect AI Assistant

A delightful web-based chat interface that combines the power of Google's Gemini AI with charming cat personalities and dynamic color themes. Now with a secure backend to protect API keys!

## ✨ Features

- 🎨 **Dynamic Color Themes** - Each personality has its own unique color scheme
- 🤖 **Powered by Gemini AI** - Advanced AI responses with cat personality enhancement
- 💬 **Real-time Chat** - Smooth messaging with typewriter animation effects
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 💾 **Chat History** - Automatically saves conversations locally
- 🎭 **5 Cat Personalities** - Each with unique speaking styles and themes
- 🔒 **Secure Backend** - API keys safely stored server-side
- ⚡ **Rate Limited** - Built-in protection against abuse

## 🐾 Cat Personalities & Themes

### 😸 **Friendly Cat** (Default) - Orange Theme
- Warm, helpful, and playful with occasional cat puns
- **Colors**: Warm orange gradients

### 😾 **Grumpy Cat** - Dark Red/Gray Theme  
- Sassy, sarcastic attitude with grumpy responses
- **Colors**: Dark reds and grays

### 😻 **Playful Kitten** - Pink Theme
- Super enthusiastic with lots of exclamation marks and emojis
- **Colors**: Bright pinks and pastels

### 🧙‍♂️ **Wise Elder Cat** - Purple Theme
- Ancient wisdom and mystical knowledge
- **Colors**: Deep purples and mystical blues

### 😴 **Lazy Cat** - Gray Theme
- Minimal, sleepy responses
- **Colors**: Soft grays and muted tones

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- A Google Gemini API key

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd meow-gpt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy the `.env` file and add your Gemini API key:
   ```bash
   GEMINI_API_KEY=your-actual-api-key-here
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3001
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-restart:
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3001`

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: Your Gemini API key
GEMINI_API_KEY=your-gemini-api-key-here

# Optional: Server configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3001
SESSION_SECRET=your-super-secret-session-key-here
```

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the key to your `.env` file

## 🛠️ Technical Details

### Architecture
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Backend**: Node.js with Express
- **API**: Google Gemini AI
- **Security**: Environment variables, rate limiting, CORS protection

### Security Features
- ✅ API keys stored server-side only
- ✅ Rate limiting (100 requests per 15 minutes per IP)
- ✅ Input validation and sanitization
- ✅ CORS protection
- ✅ Helmet.js security headers
- ✅ Request size limits

### File Structure
```
meow-gpt/
├── server.js              # Secure Express server
├── package.json           # Node.js dependencies
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore file
├── index.html            # Main frontend file
├── styles.css            # Dynamic theming CSS
├── script.js             # Frontend JavaScript
├── config.js             # Frontend configuration
└── README.md             # This file
```

## 🚀 Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Environment Setup for Production
Make sure to set these environment variables:
- `GEMINI_API_KEY`: Your Gemini API key
- `NODE_ENV=production`
- `PORT`: Your desired port (default: 3001)
- `FRONTEND_URL`: Your domain URL

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Rotate API keys** regularly
4. **Monitor usage** to detect unusual activity
5. **Use HTTPS** in production
6. **Keep dependencies updated**

## 🐛 Troubleshooting

### Common Issues

**"Server configuration error"**
- Check that `GEMINI_API_KEY` is set in your `.env` file
- Verify the API key is valid

**"Failed to get response from AI service"**
- Check your internet connection
- Verify the API key has proper permissions
- Check if you've exceeded rate limits

**Port already in use**
- Change the `PORT` in your `.env` file
- Or kill the process using the port

### Development Commands

```bash
# Install dependencies
npm install

# Start development server with auto-restart
npm run dev

# Start production server
npm start

# Check for security vulnerabilities
npm audit

# Update dependencies
npm update
```

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Never commit API keys or `.env` files
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **Google Gemini AI** - For the powerful language model
- **Express.js** - For the robust web framework
- **Node.js** - For the runtime environment

---

**Made with 💖 and lots of ☕ for cat lovers and AI enthusiasts!**

*Meow GPT - Where artificial intelligence meets feline charm* 🐾

## 🔐 Security Note

This version stores API keys securely on the server side. The frontend never has access to sensitive credentials, making it safe to deploy publicly or share the code.