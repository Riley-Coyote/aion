# Aion Scientific Platform

A comprehensive platform for quantum-inspired simulations featuring both the Aion Protocol and Quantum Simulator with Audio Visualization.

## Platform Components

### 1. Aion Protocol
- WebGL-based particle simulation system
- Real-time quantum-inspired physics
- Multiple visualization modes
- Scientifically accurate physical models

### 2. Quantum Simulator with Audio
- Audio-reactive particle physics
- Microphone input support
- Harmonic visualization
- File input for audio processing
- Beat detection and visualization
- AI chatbot assistant to explain quantum concepts

## Requirements

- Node.js (v12 or higher)
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone this repository
2. Run `npm install` to install dependencies
3. Run `npm run serve` to start the combined server
4. Visit `http://localhost:3000` in your browser

## Quick Start

The easiest way to get started is to use the combined server:

```bash
# Install dependencies
npm install

# Start the combined server
npm run serve
```

This will:
- Launch a web server at http://localhost:3000
- Serve the landing page with links to both applications
- Make both applications available at:
  - Aion Protocol: http://localhost:3000/aion
  - Quantum Simulator: http://localhost:3000/quantum

## Usage

### Aion Protocol
- Use the shape and color control panels to adjust the simulation
- Configure physics parameters for different effects
- Observe complex particle interactions

### Quantum Simulator
- Try the "Harmonics" mode to see audio-reactive particle patterns
- Use the Audio tab to:
  - Enable microphone input for real-time visualization
  - Load audio files
  - Generate harmonic tones with different frequencies
- Visualize music and sound as dynamic quantum particle formations
- Click the chat button to interact with the AI assistant for explanations

## Development

The main HTML file is `quantum-particle-network-debug-with-chat.html`. This contains all the core UI and JavaScript for the application.

The chatbot functionality is in the `chatbot-component` directory:
- `api.js` - Handles API communication
- `chatbot.js` - Main chatbot interface
- `connection.js` - Manages API connectivity
- `debug.js` - Provides debugging tools

## Deployment

For production deployment:

1. Run `npm run build` to build the Aion Protocol
2. Run `npm run serve` to start the combined server
3. Or, for one-step deployment: `npm run deploy`

### Cloud Deployment Options

The combined platform can be easily deployed to various cloud platforms:

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Create a Heroku app
heroku create

# Push to Heroku
git push heroku main

# Ensure the Procfile contains:
# web: node combined-server.js
```

#### Netlify or Vercel
1. Configure the build command to: `npm run build`
2. Set the publish directory to: `dist`
3. Add a `netlify.toml` or `vercel.json` configuration file:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[functions]
  directory = "functions"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### DigitalOcean App Platform
Create a new app and point it to your GitHub repository.
Set the run command to: `npm run serve`

#### GitHub Pages
The `geometric-pattern-app` can be deployed to GitHub Pages.

```bash
cd geometric-pattern-app
npm run deploy
```

After deployment, visit `https://<your-username>.github.io/geometric-pattern-app/` to view the live site.

## License

MIT License