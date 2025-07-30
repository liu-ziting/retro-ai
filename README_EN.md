# RetroBot - Retro Style AI Chat Assistant

[中文版本](README.md) | [English Version](README_EN.md)

![RetroBot Screenshot](/img.png)

> 🚀 **Vibe Coding**  
> Developed using Kiro editor, implementing full-cycle development from requirements analysis, architecture design to code implementation.

A retro pixel-style AI chat application built with Vue 3 + TypeScript + Tailwind CSS, supporting multiple AI models and providing a unique retro gaming interface experience.

## 🎨 Project Features

-   **Retro Pixel UI** - 80s retro gaming design style with pixelated borders and 3D shadow effects
-   **Multi-model Support** - Compatible with OpenAI, DeepSeek and other AI model APIs
-   **Smart Session Management** - Create, switch, and delete multiple chat sessions with auto-generated titles
-   **Streaming Response** - Real-time display of AI replies with typing animation
-   **Local Data Storage** - Automatically saves chat history and settings to browser local storage
-   **Flexible Configuration** - Customizable API keys, models, temperature parameters
-   **Multiple Chat Modes** - Built-in system prompts for programming, creative, academic, casual styles
-   **Responsive Design** - Perfectly adapted for desktop and mobile (drawer navigation on mobile)
-   **Real-time Stats** - Detailed usage statistics and analytics

## 🚀 Tech Stack

### Frontend Framework

-   **Vue 3** - Modern Vue framework using Composition API
-   **TypeScript** - Type safety and better development experience
-   **Vite** - Fast build tool and dev server

### State Management

-   **Pinia** - Official Vue 3 state management library
-   **@vueuse/core** - Vue Composition API utilities

### Styling & UI

-   **Tailwind CSS** - Utility-first CSS framework
-   **PostCSS** - CSS post-processor
-   **Custom Retro Theme** - Includes retro colors and animations

### API Integration

-   **OpenAI SDK v4.28.0** - For AI API communication
-   **Multi-model Support** - Compatible with DeepSeek, OpenAI, Claude and other OpenAI-format APIs

### Core Dependency Versions

-   **Vue 3.5.18** - Core framework
-   **TypeScript 5.3.0** - Type system
-   **Vite 5.0.0** - Build tool
-   **Tailwind CSS 3.4.0** - Styling framework
-   **Pinia 2.1.7** - State management
-   **@vueuse/core 10.7.0** - Composition API utilities

## 📦 Project Structure

```
deepfuck-chat-app/
├── public/                    # Static assets
│   └── favicon.ico           # Favicon
├── src/
│   ├── components/           # Vue components
│   │   ├── ChatWindow.vue    # Chat window component
│   │   ├── ConfirmDialog.vue # Confirmation dialog
│   │   ├── Header.vue        # Header component
│   │   ├── InputArea.vue     # Input area component
│   │   ├── MessageItem.vue   # Message item component
│   │   ├── SessionList.vue   # Session list component
│   │   ├── SettingsModal.vue # Settings modal
│   │   ├── Sidebar.vue       # Sidebar component
│   │   └── StatisticsModal.vue # Stats modal
│   ├── config/               # Configuration
│   │   └── prompts.ts        # System prompts config
│   ├── stores/               # Pinia stores
│   │   └── chat.ts           # Chat state management
│   ├── types/                # TypeScript types
│   │   └── index.ts          # Main type interfaces
│   ├── utils/                # Utility functions
│   │   └── configUtils.ts    # Config validation utils
│   ├── App.vue               # Main app component
│   ├── main.ts               # App entry file
│   ├── style.css             # Global styles
│   ├── env.d.ts              # Environment type declarations
│   ├── shims-vue.d.ts        # Vue type shims
│   └── vue-shim.d.ts         # Vue component type shims
├── dist/                     # Build output
├── node_modules/             # Dependencies
├── .git/                     # Git version control
├── .gitignore                # Git ignore rules
├── DEPLOYMENT.md             # Deployment docs
├── index.html                # HTML template
├── netlify.toml              # Netlify config
├── package.json              # Project dependencies/scripts
├── package-lock.json         # Lock file
├── postcss.config.js         # PostCSS config
├── tailwind.config.js        # Tailwind config
├── test-chat.html            # Test chat page
├── tsconfig.json             # TypeScript config
├── tsconfig.node.json        # Node.js TS config
├── vite.config.ts            # Vite config
└── README.md                 # Project docs
```

## 🛠️ Installation & Usage

### Requirements

-   Node.js >= 16.0.0
-   npm or yarn or pnpm

### Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Development Mode

```bash
npm run dev
```

App will run at `http://localhost:3000`

### Production Build

```bash
npm run build
```

### Type Check Before Build

```bash
npm run build:check
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Core Features

### 1. Session Management

-   **New Chat** - Click "START NEW CHAT" to create new session
-   **Switch Sessions** - Click different sessions in left sidebar
-   **Delete Sessions** - Hover over session to show delete button
-   **Auto Titles** - Generates title from first message (max 20 chars)
-   **Timestamps** - Shows last updated time for each session
-   **Session Sorting** - Automatically sorts by last update time

### 2. Smart Chat

-   **Streaming Responses** - Real-time display of AI replies
-   **Message History** - Maintains full conversation context
-   **Loading States** - Shows typing animation and loading indicators
-   **Error Handling** - Friendly error messages for network issues
-   **Message Tools** - Supports copying message content

### 3. Configuration

-   **API Setup** - Customize API keys, base URLs, model names
-   **Parameter Tuning** - Adjust temperature (0-2) for response randomness
-   **System Prompts** - Choose different conversation styles
-   **Config Validation** - Real-time validation of parameters
-   **Preset Switching** - Quickly change system prompt types

### 4. Data Persistence

-   **Local Storage** - Automatically saves all chats and settings
-   **Data Recovery** - Restores previous sessions on refresh
-   **Reset Options** - Reset API config or clear all data
-   **Usage Stats** - Saves statistics and daily data

### 5. Analytics

-   **Real-time Stats** - Shows session count, message count, character count
-   **User/AI Analysis** - Separates stats for user and AI messages
-   **API Call Stats** - Tracks API call counts and usage
-   **Daily Data** - Stores last 30 days of usage
-   **Usage Time** - Records first use and last active time

### 6. UI Interactions

-   **Fullscreen Mode** - Fullscreen chat experience
-   **Toolbar Toggle** - Hover messages to show action toolbar
-   **Confirmation Dialogs** - Confirm important actions
-   **Responsive Layout** - Adapts to desktop and mobile

## 🎨 UI Design Features

### Retro Style Elements

-   **Pixel Fonts** - Uses monospace fonts like Courier New
-   **Retro Colors** - Bright 80s colors (yellow, pink, blue, green)
-   **3D Borders** - 4px black borders with shadow effects
-   **Button Design** - 3D buttons with hover effects

### Animations

-   **Fade-in** - Modal and message fade effects
-   **Slide-in** - Messages slide up from bottom
-   **Typing Animation** - Typing indicator for AI responses
-   **Bounce Animation** - Welcome page robot icon

### Responsive Layout

-   **Desktop** - Sidebar layout (left: sessions, right: chat)
-   **Mobile** - Drawer navigation, full-screen chat area

## 🔧 Configuration

### API Parameters

-   **API Key** - For OpenAI, DeepSeek, Claude etc.
-   **Base URL** - API service URL (e.g. https://api.deepseek.com)
-   **Model** - AI model name (e.g. deepseek-chat, gpt-4)
-   **Temperature** - Controls response randomness (0-2, recommend 0.7)

### System Prompt Types

-   **🔥 Fuck** - Direct, unfiltered style (default)
-   ** Programming** - Technical/developer assistant
-   **🎨 Creative** - For brainstorming and content creation
-   **📚 Academic** - For research and analysis
-   ** Casual** - Friendly, relaxed conversations

### Supported AI Models

-   **DeepSeek Models**
    -   `deepseek-chat` - General purpose
    -   `deepseek-coder` - Coding specialized
-   **OpenAI Models**
    -   `gpt-3.5-turbo` - Fast response
    -   `gpt-4` - High quality
    -   `gpt-4-turbo` - Enhanced GPT-4
-   **Other OpenAI-compatible APIs**

## 📱 User Guide

### First Use

1. App auto-creates default session on launch
2. Click "⚙️ Settings" to configure API
3. Enter valid API Key and other parameters
4. Select system prompt type
5. Click "Save Settings"

### API Config Examples

```javascript
// DeepSeek Example
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseUrl": "https://api.deepseek.com",
  "model": "deepseek-chat",
  "temperature": 0.7
}

// OpenAI Example
{
  "apiKey": "sk-xxxxxxxxxxxxxxxx",
  "baseUrl": "https://api.openai.com/v1",
  "model": "gpt-3.5-turbo",
  "temperature": 0.7
}
```

### Starting Chat

1. Type message in input box
2. Press Enter or click "SEND!"
3. AI replies in real-time
4. Conversations auto-save
5. Toggle fullscreen anytime

### Managing Sessions

1. Click "START NEW CHAT" for new session
2. Click sessions in sidebar to switch
3. Hover over session to delete
4. Use "🗑️ Clear All" to remove all sessions
5. Sessions sort by last update time

### Viewing Stats

1. Click "📊 Stats" button
2. View detailed usage statistics
3. Includes message counts, API calls etc.
4. Daily data analysis available

## 🔒 Security Notes

-   API keys only stored in browser (never uploaded)
-   All chat data stays in browser storage
-   Recommend backing up important chats
-   Clear browser data after use on public devices

## ⚠️ Important Notes

### Key Features

-   **Unique Chat Style** - Default "Fuck" mode provides direct conversation
-   **Streaming Responses** - Real-time AI replies
-   **Fully Local** - All data stays in browser
-   **Multi-model** - Works with any OpenAI-compatible API

### Usage Notes

-   Runs entirely in browser (no server uploads)
-   API keys stored locally - keep them safe
-   Recommend regular chat backups
-   Clear browser data after public use

## 🐛 Common Issues

### API Failures

-   Check API Key validity
-   Verify Base URL accessibility
-   Check network connection
-   Review browser console errors
-   Confirm API supports streaming

### Lost Chats

-   Check if browser cleared storage
-   Confirm not using private mode
-   Try refreshing to restore
-   Check if localStorage disabled

### Styling Issues

-   Confirm browser supports modern CSS
-   Check for extension conflicts
-   Try clearing cache
-   Ensure JavaScript enabled

### Streaming Problems

-   Confirm API supports streaming
-   Check network stability
-   Try lowering temperature
-   Review network panel requests

## 🔧 Technical Details

### Component Architecture

Key components:

-   **App.vue** - Main container, manages modals
-   **Header.vue** - Top nav with settings/stats
-   **Sidebar.vue** - Session list management
-   **ChatWindow.vue** - Chat display and input
-   **MessageItem.vue** - Single message with tools
-   **InputArea.vue** - Message input
-   **SettingsModal.vue** - API configuration
-   **StatisticsModal.vue** - Usage stats
-   **ConfirmDialog.vue** - Action confirmations

### State Management

Using Pinia for:

-   **Session Management** - CRUD operations
-   **Message Handling** - Adding/updating
-   **Configuration** - API settings, prompts
-   **Statistics** - Usage tracking
-   **Local Storage** - Auto save/load

### API Integration

-   Uses OpenAI SDK
-   Supports streaming responses
-   Error handling/retries
-   Works with OpenAI-compatible APIs

### Styling System

-   Tailwind CSS utility classes
-   Custom retro theme/animations
-   Responsive desktop/mobile
-   3D borders/shadow effects

## 🤝 Contributing

Issues and PRs welcome!

### Dev Setup

1. Fork repo
2. Clone locally
    ```bash
    git clone https://github.com/your-username/deepfuck-chat-app.git
    cd deepfuck-chat-app
    ```
3. Install deps
    ```bash
    npm install
    ```
4. Start dev server
    ```bash
    npm run dev
    ```
5. Make changes and test
6. Submit PR

### Code Standards

-   TypeScript
-   Vue 3 Composition API
-   Clean, commented code
-   Type safety
-   ESLint/Prettier
-   PascalCase components
-   kebab-case filenames

### Commit Style

-   Semantic messages
-   Format: `type(scope): description`
-   Types: feat, fix, docs, style, refactor, test, chore

## 📄 License

MIT - See [LICENSE](LICENSE)

## 👨‍💻 Author

**Liuziting**

-   GitHub: [@liu-ziting](https://github.com/liu-ziting/)

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for details

### Netlify Quick Deploy

1. Build project
    ```bash
    npm run build
    ```
2. Deploy `dist` folder to Netlify
3. Or connect GitHub repo for auto-deploy

### Local Preview

```bash
npm run preview
```

## 🙏 Acknowledgements

-   [Vue.js](https://vuejs.org/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Vite](https://vitejs.dev/)
-   [Tailwind CSS](https://tailwindcss.com/)
-   [Pinia](https://pinia.vuejs.org/)
-   [VueUse](https://vueuse.org/)
-   [OpenAI](https://openai.com/)
-   [DeepSeek](https://www.deepseek.com/)
-   [PostCSS](https://postcss.org/)
-   [Autoprefixer](https://autoprefixer.github.io/)

---

**RetroBot - Bringing AI chat back to the retro gaming era!** 🤖✨🎮
