# Deployment Guide

## Overview

AgentricAI-planner is a **Progressive Web App (PWA)** designed for deployment on AAC (Augmentative and Alternative Communication) devices — primarily Apple iPads and Samsung Galaxy tablets. The application builds to a single HTML file for maximum portability.

---

## Prerequisites

### Required
- **Node.js** ≥ 18
- **npm** ≥ 9

### Required for AI Features
- **AgentricAI-IED-ollama** running and accessible
  - Repository: [github.com/BAMmyers/AgentricAI-IED-ollama](https://github.com/BAMmyers/AgentricAI-IED-ollama.git)
  - Default endpoint: `http://localhost:11434`
  - The `AgentricAIcody:latest` model (included in the project's `.ollama/` directory)

---

## Building for Production

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Output: dist/index.html (single file, self-contained)
```

The build process:
1. Vite compiles TypeScript and bundles React
2. Tailwind CSS purges unused styles
3. `vite-plugin-singlefile` inlines all JS, CSS, and assets into one HTML file
4. Output: `dist/index.html` — the entire application in a single file

### Build Output

```
dist/
└── index.html    ← Complete application (single file)
```

This single-file output is intentional. It ensures:
- No CDN dependencies at runtime
- No external resource requests
- Full offline capability once loaded
- Simple deployment (copy one file)
- Easy installation on AAC devices

---

## Deployment Options

### Option 1: Local Network Server (Recommended for AAC Devices)

The recommended deployment for the target use case (children using AAC tablets):

```bash
# Build the application
npm run build

# Serve with any static file server
npx serve dist

# Or with Python
cd dist && python3 -m http.server 8080

# Or with Node.js
npx http-server dist -p 8080
```

Then on the tablet:
1. Open Safari (iPad) or Chrome (Galaxy Tab)
2. Navigate to `http://<your-computer-ip>:8080`
3. Add to Home Screen (creates PWA shortcut)
4. The app now launches full-screen like a native app

### Option 2: Self-Hosted Web Server

Deploy to any web server that can serve static HTML:

```bash
# Build
npm run build

# Copy to web server
cp dist/index.html /var/www/html/planner/index.html

# Or with nginx
# server {
#     listen 80;
#     root /var/www/planner;
#     index index.html;
#     location / {
#         try_files $uri /index.html;
#     }
# }
```

### Option 3: Static Hosting Platforms

Deploy to any static hosting service:

#### Netlify
```bash
npm run build
# Drag dist/ folder to Netlify dashboard
# Or use Netlify CLI:
npx netlify deploy --dir=dist --prod
```

#### Vercel
```bash
npm run build
npx vercel --prod
```

#### Cloudflare Pages
```bash
npm run build
npx wrangler pages deploy dist
```

#### GitHub Pages
```bash
npm run build
# Copy dist/index.html to your gh-pages branch
```

> **Note:** When using cloud hosting, the AgentricAI-IED-ollama backend must be accessible from the client device. This typically means running Ollama on the same local network as the tablet.

---

## Target Device Setup

### Apple iPad (Primary AAC Device)

1. **Open Safari** on the iPad
2. Navigate to the deployed application URL
3. Tap the **Share** button (square with arrow)
4. Select **"Add to Home Screen"**
5. Name it "AgentricAI" (or preferred name)
6. Tap **"Add"**

The application will now:
- Launch in full-screen mode (no browser chrome)
- Appear as a native app on the Home Screen
- Support touch gestures natively
- Work offline after first load (service worker caching)

**Recommended iPad Settings:**
- Enable **Guided Access** (Settings → Accessibility → Guided Access) to lock the student into the app
- Disable **Notification Center** during learning sessions
- Set **Do Not Disturb** schedule for learning times

### Samsung Galaxy Tab (Android AAC Device)

1. **Open Chrome** on the tablet
2. Navigate to the deployed application URL
3. Tap the **three-dot menu** (⋮)
4. Select **"Add to Home screen"**
5. Name it "AgentricAI" (or preferred name)
6. Tap **"Add"**

The application will now:
- Launch in full-screen mode
- Appear in the app drawer and Home Screen
- Support touch gestures natively

**Recommended Android Settings:**
- Enable **Screen Pinning** (Settings → Security → Screen Pinning) to lock the student into the app
- Use **Digital Wellbeing** or a launcher app to restrict access to other apps during learning sessions

---

## AgentricAI-IED-ollama Backend Setup

The backend must be running and accessible from the device running the PWA.

### Same Device (Development/Testing)

```bash
# Install Ollama
# See: https://github.com/BAMmyers/AgentricAI-IED-ollama

# Start Ollama
ollama serve

# The AgentricAIcody:latest model is included in the project's .ollama/ directory
# Ollama will detect and serve it automatically

# Verify
curl http://localhost:11434/api/tags
```

The PWA connects to `http://localhost:11434` by default.

### Separate Device (Production/Recommended)

For tablet deployments, Ollama typically runs on a more powerful machine (desktop, server, or GPU workstation):

```bash
# On the server/desktop machine
# Set Ollama to listen on all interfaces
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# Or set in environment
export OLLAMA_HOST=0.0.0.0:11434
ollama serve
```

Then update the LLM service configuration in the PWA to point to the server's IP:

```typescript
// In src/services/llmService.ts
const DEFAULT_CONFIG: LLMServiceConfig = {
  baseUrl: 'http://192.168.1.100:11434',  // Server IP
  model: 'AgentricAIcody:latest',
  timeout: 30000
};
```

> **Security Note:** Ollama should only be exposed on your local network. Do not expose port 11434 to the public internet.

### GPU-Accelerated Setup (Recommended for Production)

For optimal performance with the Agent Hive's concurrent LLM requests:

```bash
# NVIDIA GPU
# Ensure CUDA drivers are installed
nvidia-smi  # Verify GPU is detected

# Ollama automatically uses GPU when available
ollama serve

# For multiple concurrent requests (agent hive parallel execution)
OLLAMA_NUM_PARALLEL=4 ollama serve
```

| Hardware | Concurrent Agents | Response Time |
|----------|-------------------|---------------|
| CPU only | 1-2 | 5-30 seconds |
| NVIDIA GTX 1080+ | 3-4 | 1-5 seconds |
| NVIDIA RTX 3090+ | 4-6 | < 2 seconds |
| Apple M1/M2/M3 | 3-4 | 1-5 seconds |

---

## Environment Considerations

### Offline Operation

When AgentricAI-IED-ollama is not available:
- The application continues to function with locally persisted data
- Previously generated schedules, insights, and metrics remain accessible
- New AI-generated content (schedules, feedback) will show connection status
- The UI indicates backend availability clearly
- The Guardian agent continues monitoring (it never uses the network)

### Data Persistence

All data is stored in the browser's IndexedDB:
- **iPad Safari:** Data persists until the user clears website data or the OS reclaims storage
- **Android Chrome:** Data persists until the user clears app data
- **Desktop browsers:** Data persists until the user clears browser data

> **Important:** Enabling "Private Browsing" or "Incognito Mode" will prevent IndexedDB persistence. Always use normal browsing mode.

### Storage Limits

| Browser | IndexedDB Limit | Notes |
|---------|----------------|-------|
| Safari (iPad) | ~1 GB | May prompt user after 200 MB |
| Chrome (Android) | ~60% of disk | Generous allocation |
| Chrome (Desktop) | ~60% of disk | Generous allocation |
| Firefox | ~2 GB | May prompt after 50 MB |

For typical usage (one student, months of daily data), storage consumption is minimal — well under 50 MB.

---

## Troubleshooting

### PWA Won't Install on Tablet
- Ensure you're using **Safari** on iPad or **Chrome** on Android
- The app must be served over **HTTPS** (except localhost)
- Clear browser cache and try again

### Backend Connection Failed
- Verify Ollama is running: `curl http://localhost:11434/api/tags`
- Check firewall rules allow port 11434
- If Ollama is on a different machine, ensure `OLLAMA_HOST=0.0.0.0:11434`
- Check the browser console for CORS errors

### Data Not Persisting
- Ensure you are NOT in Private/Incognito mode
- Check available storage in browser settings
- On iPad: Settings → Safari → ensure "Prevent Cross-Site Tracking" doesn't affect localhost

### Canvas Drawing Not Working on Tablet
- Ensure touch events are not being intercepted by the browser
- The canvas uses `touch-action: none` to prevent scroll interference
- Try refreshing the page if touch stops responding
