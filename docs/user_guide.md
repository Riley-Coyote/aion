# Aion Protocol User Guide

## Introduction

Welcome to the Aion Protocol, a high-fidelity particle simulator with an integrated AI interface that serves as both a visualization tool and interface for a blockchain-based decentralized research funding infrastructure. This user guide will help you navigate the features and capabilities of the Aion Protocol.

## Getting Started

### System Requirements

The Aion Protocol works best with:
- A modern browser (Chrome 76+, Firefox 67+, Safari 13+, or Edge Chromium)
- WebGL2 support
- 8GB RAM recommended (4GB minimum)
- Dedicated graphics card recommended for high particle counts

### Accessing the Application

You can access the Aion Simulator by:
1. Download and run locally following the installation instructions in the README.md file

### Interface Overview

When you first open the Aion Protocol, you'll see:

1. **Main Visualization Area**: The central area displaying the particle simulation
2. **AI Chat Interface**: Located in the bottom right corner
3. **Control Panels**: On the left side for adjusting simulation parameters
4. **Status Bar**: At the top showing current simulation metrics

## Basic Controls

### Mouse Controls

- **Left-click and drag**: Rotate the view
- **Right-click**: Create a gravitational force field at the clicked position
- **Mouse wheel**: Zoom in/out
- **Click on particle**: Select particle for detailed information

### Touch Controls

- **One finger drag**: Rotate the view
- **Two finger pinch**: Zoom in/out
- **Long press**: Create a gravitational force field
- **Tap on particle**: Select particle for detailed information

### Keyboard Shortcuts

- **Space**: Pause/resume simulation
- **R**: Reset simulation
- **+/-**: Increase/decrease simulation speed
- **G**: Toggle gravity
- **Alt+A**: Toggle accessibility panel
- **F**: Toggle fullscreen mode
- **H**: Hide/show control panels
- **C**: Toggle camera mode (orbit/free)

## Using the AI Interface

The AI interface allows you to control the simulation using natural language commands.

### Text Commands

Type your commands in the chat input field. Examples include:
- "Add 10,000 particles"
- "Create a vortex field at the center"
- "Change particle color to blue"
- "Increase simulation speed to 2x"
- "Show me the network statistics"

### Voice Commands

Click the microphone icon to use voice commands:
1. Wait for the "Listening..." indicator
2. Speak your command clearly
3. The AI will process your command and respond

### Command Context

The AI remembers previous commands and simulation state, so you can use contextual references:
- "Make them bigger" (after talking about particles)
- "Move it to the left" (after creating a force field)
- "Increase that by 50%" (referring to a previously mentioned value)

## Simulation Features

### Particle System

The particle system is the core of the Aion Protocol visualization:

- **Particle Count**: Adjust from 1,000 to 1,000,000 particles (device dependent)
- **Particle Size**: Change the visual size of particles
- **Particle Color**: Set colors based on properties or custom values
- **Particle Properties**: Assign mass, charge, and other physical properties

### Force Fields

Force fields influence particle behavior:

- **Gravitational**: Attracts particles based on mass and distance
- **Vortex**: Creates spinning motion around a central point
- **Magnetic**: Affects charged particles
- **Custom**: Define your own force field equations

To create a force field:
1. Right-click (or long press on touch devices) at the desired location
2. Select the force field type from the popup menu
3. Adjust parameters using the sliders

### Fluid Dynamics

The fluid dynamics system simulates liquid-like behavior:

- **Viscosity**: Controls how "thick" the fluid appears
- **Surface Tension**: Affects how particles stick together
- **Pressure**: Influences how particles respond to compression
- **Density**: Determines the spacing between particles

Enable fluid dynamics from the Simulation menu or with the command "enable fluid dynamics".

### Constraint Systems

Constraints connect particles together:

- **Springs**: Elastic connections between particles
- **Distance**: Fixed-length connections
- **Angle**: Controls the angle between connected particles

To create constraints:
1. Select two or more particles
2. Open the Constraints panel
3. Choose the constraint type
4. Adjust parameters as needed

## Aion Protocol Features

### Blockchain Visualization

The blockchain visualization represents:

- **Nodes**: Shown as force fields in the simulation
- **Transactions**: Visualized as particles moving between nodes
- **Consensus**: Represented by particle density and color patterns

Different transaction types are color-coded:
- **Blue**: Standard transfers
- **Green**: Research grants
- **Yellow**: Voting actions
- **Purple**: Research submissions
- **Orange**: Funding allocations

### Research Funding

The research funding visualization shows:

- **Funding Pools**: Large particle clusters with distinct colors
- **Research Projects**: Smaller particle groups connected to funding pools
- **Funding Flow**: Particles moving from sources to projects

To interact with research funding:
1. Select a funding pool or project for details
2. Use the "Fund Project" button to contribute
3. View impact metrics in the project details panel

### Governance Interface

The governance system allows for decentralized decision-making:

- **Proposals**: Represented as force fields with particle accumulation
- **Voting**: Visualized as particles moving toward proposals
- **Policy Effects**: Shown through changes in simulation parameters

To participate in governance:
1. Browse active proposals in the Governance panel
2. Select a proposal to view details
3. Cast your vote using the voting buttons
4. Watch as your vote affects the consensus visualization

## Advanced Features

### Data Import/Export

You can import external data and export simulation states:

#### Importing Data

1. Click "Import" in the File menu
2. Select data type (Scientific, Blockchain, Network)
3. Choose your data file
4. Map data fields to simulation properties
5. Click "Import" to visualize the data

#### Exporting Results

1. Click "Export" in the File menu
2. Choose export format (JSON, Image, Video)
3. Select export options
4. Click "Export" to save the file

### Custom Simulations

Create and save custom simulations:

1. Set up your desired particle configuration and force fields
2. Click "Save Simulation" in the File menu
3. Name your simulation and add a description
4. Click "Save" to store it in your library

Load saved simulations from the "Load Simulation" option in the File menu.

### Performance Settings

Adjust performance based on your device capabilities:

1. Open Settings menu
2. Go to Performance tab
3. Choose quality preset (Low, Medium, High, Ultra) or
4. Customize individual settings:
   - Particle Count
   - Render Quality
   - Physics Accuracy
   - Effect Detail

## Accessibility Features

The Aion Protocol includes several accessibility features:

- **High Contrast Mode**: Enhances visibility with stronger color contrast
- **Screen Reader Support**: Compatible with screen readers for audio navigation
- **Reduced Motion**: Minimizes animation for users sensitive to motion
- **Large Text**: Increases text size throughout the interface
- **Keyboard Navigation**: Full control without requiring a mouse

Access these features by pressing Alt+A or through the Accessibility option in the Settings menu.

## Troubleshooting

### Common Issues

1. **Low Performance**:
   - Reduce particle count in the Performance settings
   - Disable fluid dynamics and complex force fields
   - Close other browser tabs and applications

2. **Visual Glitches**:
   - Refresh the page
   - Update your graphics drivers
   - Try a different browser

3. **AI Not Responding**:
   - Check your internet connection
   - Try rephrasing your command
   - Restart the application

### Getting Help

If you encounter issues not covered in this guide:

1. Check the FAQ section on our website
2. Visit the community forum at [forum.aion-protocol.org](https://forum.aion-protocol.org)
3. Contact support at support@aion-protocol.org

## Glossary

- **Particle**: The basic unit of visualization in the simulation
- **Force Field**: An area of influence that affects particle behavior
- **Node**: A participant in the blockchain network
- **Transaction**: An exchange of value or information between nodes
- **Funding Pool**: A collection of resources for research projects
- **Proposal**: A suggested change to the system's governance
- **Constraint**: A connection between particles that limits their movement
- **SPH (Smoothed Particle Hydrodynamics)**: The method used for fluid simulation

Thank you for using the Aion Protocol! We hope this guide helps you explore the full potential of this powerful visualization and interaction tool.
