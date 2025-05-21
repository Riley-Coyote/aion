#!/bin/bash
# Deployment script for Quantum Simulator with AI Chat

# Display header
echo "=========================================="
echo "  Quantum Simulator with AI Chat Deployment"
echo "=========================================="
echo ""

# Verify all required files exist
echo "Checking required files..."
FILES=(
  "quantum-simulator-refined-chat.html"
  "server.js"
  "404.html"
  "audio-analyzer.js"
  "audio-integration.js"
  "chatbot-component/api.js"
  "chatbot-component/chatbot.js"
  "chatbot-component/connection.js"
  "chatbot-component/debug.js"
  "chatbot-component/three-test.js"
)

MISSING=false
for file in "${FILES[@]}"; do
  if [ ! -f "$file" ]; then
    echo "❌ Missing file: $file"
    MISSING=true
  else
    echo "✅ Found: $file"
  fi
done

if [ "$MISSING" = true ]; then
  echo ""
  echo "❌ Error: Some required files are missing!"
  echo "Please ensure all files are present before deployment."
  exit 1
fi

echo ""
echo "All required files found! ✅"
echo ""

# Check if server.js is runnable
if ! node -c server.js > /dev/null 2>&1; then
  echo "❌ Error: server.js has syntax errors!"
  node -c server.js
  exit 1
fi

echo "server.js validation successful! ✅"
echo ""

# Setup deployment environment
echo "Setting up deployment environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  echo "❌ Error: Node.js is not installed!"
  echo "Please install Node.js before proceeding."
  exit 1
fi

echo "Node.js is installed! ✅"
echo "Node.js version: $(node -v)"
echo ""

# Install dependencies if package.json exists
if [ -f "package.json" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Creating package.json..."
  # Create a minimal package.json
  cat > package.json << EOF
{
  "name": "quantum-simulator-with-ai-chat",
  "version": "1.0.0",
  "description": "Quantum Simulator with integrated AI Chat",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {}
}
EOF
  
  # Install basic dependencies
  npm install --save
  
  echo "Created minimal package.json ✅"
fi

echo ""
echo "Environment setup complete! ✅"
echo ""

# Create a README.md file with instructions
if [ ! -f "README.md" ]; then
  echo "Creating README.md..."
  
  cat > README.md << EOF
# Quantum Simulator with AI Chat

A WebGL-based simulation of quantum-inspired particle interactions with an integrated AI chat interface.

## Features

- Real-time quantum particle simulation with WebGL
- Interactive visualization with multiple modes
- AI chatbot assistant to explain quantum concepts
- Responsive design for desktop and mobile

## Requirements

- Node.js (v12 or higher)
- Modern web browser with WebGL support (Chrome, Firefox, Safari, Edge)

## Installation

1. Clone this repository
2. Run \`npm install\` to install dependencies
3. Run \`npm start\` to start the server
4. Visit \`http://localhost:3000\` in your browser

## Usage

- Interact with the visualization by changing the shape and color modes
- Click the chat button to interact with the AI assistant
- Ask questions about quantum physics and the current simulation

## Deployment

For production deployment:

1. Run \`bash deploy.sh\` to prepare the application
2. Deploy the resulting files to your web server
3. Alternatively, deploy to services like Netlify, Vercel, or GitHub Pages

## License

MIT License
EOF
  
  echo "Created README.md ✅"
  echo ""
fi

# Start the server
echo "Starting the server for testing..."
echo "Press Ctrl+C to stop the server when done testing."
echo ""
echo "Server running at http://localhost:3000/"
echo "=========================================="

# Start the server
node server.js