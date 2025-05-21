// ResearchFundingMechanisms.js - Implements research funding visualization for Aion Protocol
import * as THREE from 'three';

export class ResearchFundingMechanisms {
    constructor(simulationManager, blockchainVisualization) {
        this.simulationManager = simulationManager;
        this.blockchainVisualization = blockchainVisualization;
        
        // Funding pools
        this.fundingPools = [];
        
        // Research projects
        this.researchProjects = [];
        
        // Funding sources
        this.fundingSources = [];
        
        // Visualization elements
        this.poolVisualizers = [];
        this.connectionLines = null;
        
        // Initialize
        this.initialize();
    }
    
    initialize() {
        // Create line material for connections
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x62AADC,
            transparent: true,
            opacity: 0.6
        });
        
        // Create line geometry
        const lineGeometry = new THREE.BufferGeometry();
        
        // Create line mesh
        this.connectionLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        
        // Add to scene
        this.simulationManager.scene.add(this.connectionLines);
        
        // Create initial funding pools
        this.createInitialFundingPools();
    }
    
    createInitialFundingPools() {
        // Create funding pools for different research categories
        const categories = [
            { name: 'AI Research', color: 0x4285F4, position: new THREE.Vector3(-15, 15, 0) },
            { name: 'Climate Science', color: 0x34A853, position: new THREE.Vector3(15, 15, 0) },
            { name: 'Medical Research', color: 0xEA4335, position: new THREE.Vector3(15, -15, 0) },
            { name: 'Quantum Computing', color: 0xFBBC05, position: new THREE.Vector3(-15, -15, 0) }
        ];
        
        categories.forEach(category => {
            this.createFundingPool(
                category.name,
                1000000 + Math.random() * 9000000, // 1M-10M funding
                category.position,
                category.color
            );
        });
    }
    
    createFundingPool(name, amount, position, color) {
        // Create particle cluster for funding pool
        const poolIndex = this.createParticleCluster(
            position,
            Math.sqrt(amount) / 100, // Size based on funding amount
            100, // Particle count
            color
        );
        
        // Create attractor for the pool
        const attractorIndex = this.simulationManager.addGravitationalField(
            position,
            5,
            Math.sqrt(amount) / 50
        );
        
        // Store pool data
        const pool = {
            name,
            amount,
            position: position.clone(),
            clusterIndex: poolIndex,
            attractorIndex,
            projects: [],
            color: new THREE.Color(color)
        };
        
        this.fundingPools.push(pool);
        
        return pool;
    }
    
    createParticleCluster(position, radius, count, color) {
        // In a full implementation, we would:
        // 1. Create a group of particles at the specified position
        // 2. Constrain them to stay within the radius
        // 3. Color them based on the specified color
        
        // For now, this is a placeholder
        return this.fundingPools.length;
    }
    
    // Research project methods
    createResearchProject(name, category, fundingNeeded, position) {
        // Find the funding pool for the category
        const pool = this.fundingPools.find(p => p.name === category);
        
        if (!pool) return null;
        
        // Create particle group for the project
        const projectIndex = this.createParticleCluster(
            position,
            Math.sqrt(fundingNeeded) / 200, // Smaller than pools
            20, // Fewer particles
            pool.color.getHex()
        );
        
        // Store project data
        const project = {
            name,
            category,
            fundingNeeded,
            fundingReceived: 0,
            position: position.clone(),
            clusterIndex: projectIndex,
            pool: pool,
            connections: [],
            progress: 0, // 0-1 completion
            impact: 0 // 0-1 impact score
        };
        
        this.researchProjects.push(project);
        
        // Add to pool's projects
        pool.projects.push(project);
        
        // Create connection line to pool
        this.createConnectionLine(project, pool);
        
        return project;
    }
    
    createConnectionLine(project, pool) {
        // In a full implementation, we would:
        // 1. Create a line connecting the project to its funding pool
        // 2. Update the connection lines geometry
        
        // For now, this is a placeholder
        project.connections.push({
            from: project.position.clone(),
            to: pool.position.clone(),
            amount: 0
        });
        
        this.updateConnectionLines();
    }
    
    updateConnectionLines() {
        // Collect all connection points
        const linePositions = [];
        
        // Add project-pool connections
        this.researchProjects.forEach(project => {
            project.connections.forEach(connection => {
                linePositions.push(connection.from.x, connection.from.y, connection.from.z);
                linePositions.push(connection.to.x, connection.to.y, connection.to.z);
            });
        });
        
        // Update geometry
        this.connectionLines.geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(linePositions, 3)
        );
        
        this.connectionLines.geometry.attributes.position.needsUpdate = true;
    }
    
    // Funding contribution methods
    createFundingContribution(source, projectName, amount) {
        // Find the project
        const project = this.researchProjects.find(p => p.name === projectName);
        
        if (!project) return null;
        
        // Create particles for the contribution
        // In a full implementation, we would:
        // 1. Create particles at the source position
        // 2. Animate them moving to the project
        // 3. Update project funding received
        
        // Update project funding
        project.fundingReceived += amount;
        
        // Create funding source if new
        let fundingSource = this.fundingSources.find(s => s.name === source);
        
        if (!fundingSource) {
            fundingSource = {
                name: source,
                totalContributed: 0,
                projects: []
            };
            this.fundingSources.push(fundingSource);
        }
        
        // Update funding source
        fundingSource.totalContributed += amount;
        if (!fundingSource.projects.includes(project)) {
            fundingSource.projects.push(project);
        }
        
        // Create transaction in blockchain visualization
        if (this.blockchainVisualization) {
            // Find closest nodes for visualization
            const fromNodeIndex = 0; // Placeholder
            const toNodeIndex = this.fundingPools.indexOf(project.pool);
            
            this.blockchainVisualization.createTransaction(
                this.blockchainVisualization.transactionTypes.FUNDING,
                fromNodeIndex,
                toNodeIndex,
                amount
            );
        }
        
        return {
            source: fundingSource,
            project,
            amount,
            timestamp: Date.now()
        };
    }
    
    // Grant emission methods
    emitResearchGrant(poolName, amount) {
        // Find the pool
        const pool = this.fundingPools.find(p => p.name === poolName);
        
        if (!pool) return null;
        
        // In a full implementation, we would:
        // 1. Create particles emitting from the pool
        // 2. Distribute them to eligible projects
        
        // For now, we'll distribute evenly to all projects in the pool
        const projectCount = pool.projects.length;
        
        if (projectCount === 0) return null;
        
        const amountPerProject = amount / projectCount;
        
        // Distribute to projects
        pool.projects.forEach(project => {
            project.fundingReceived += amountPerProject;
            
            // Create transaction in blockchain visualization
            if (this.blockchainVisualization) {
                const fromNodeIndex = this.fundingPools.indexOf(pool);
                const toNodeIndex = (fromNodeIndex + 1) % this.blockchainVisualization.nodes.length;
                
                this.blockchainVisualization.createTransaction(
                    this.blockchainVisualization.transactionTypes.GRANT,
                    fromNodeIndex,
                    toNodeIndex,
                    amountPerProject
                );
            }
        });
        
        return {
            pool,
            amount,
            projectCount,
            amountPerProject,
            timestamp: Date.now()
        };
    }
    
    // Impact visualization methods
    visualizeResearchImpact(projectName, impactScore) {
        // Find the project
        const project = this.researchProjects.find(p => p.name === projectName);
        
        if (!project) return false;
        
        // Set impact score
        project.impact = Math.max(0, Math.min(1, impactScore));
        
        // In a full implementation, we would:
        // 1. Create visual effects showing the impact
        // 2. Adjust particle behavior based on impact
        
        return true;
    }
    
    // Selection methods
    selectProject(projectName) {
        // Find the project
        const project = this.researchProjects.find(p => p.name === projectName);
        
        if (!project) return null;
        
        // In a full implementation, we would:
        // 1. Highlight the selected project
        // 2. Show detailed information
        
        return project;
    }
    
    // Update method called each frame
    update(deltaTime) {
        // Update project progress
        this.updateProjectProgress(deltaTime);
        
        // Update connection lines
        this.updateConnectionLines();
        
        // Emit grants occasionally
        if (Math.random() < 0.01) { // 1% chance each frame
            const poolIndex = Math.floor(Math.random() * this.fundingPools.length);
            const pool = this.fundingPools[poolIndex];
            
            this.emitResearchGrant(
                pool.name,
                10000 + Math.random() * 90000 // 10k-100k grant
            );
        }
    }
    
    updateProjectProgress(deltaTime) {
        // Update progress for each project
        this.researchProjects.forEach(project => {
            // Progress based on funding received
            if (project.fundingReceived > 0 && project.progress < 1) {
                const progressRate = project.fundingReceived / project.fundingNeeded;
                project.progress = Math.min(1, project.progress + progressRate * deltaTime * 0.01);
                
                // When project completes
                if (project.progress >= 1 && !project.completed) {
                    project.completed = true;
                    this.onProjectCompleted(project);
                }
            }
        });
    }
    
    onProjectCompleted(project) {
        // In a full implementation, we would:
        // 1. Create visual effects for completion
        // 2. Generate impact based on project quality
        // 3. Add to completed research database
        
        // For now, we'll just set a random impact
        this.visualizeResearchImpact(project.name, 0.5 + Math.random() * 0.5);
    }
}
