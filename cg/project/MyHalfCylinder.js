import {CGFobject} from '../lib/CGF.js';
/**
 * MyHalfCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of slices
 * @param stacks - number of stacks
 */
export class MyHalfCylinder extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        
        // For half cylinder, we only need half of the angular range (0 to π)
        const deltaAlpha = Math.PI / (this.slices - 1);
        const deltaZ = 1 / this.stacks;

        // Generate vertices and normals
        for (let stack = 0; stack <= this.stacks; stack++) {
            let z = deltaZ * stack;
            
            // Create vertices for each slice from 0 to π (half circle)
            for (let vertex = 0; vertex < this.slices; vertex++) {
                let angle = deltaAlpha * vertex;
                const x = Math.cos(angle);
                const y = Math.sin(angle);
                this.vertices.push(x, y, z);
                this.normals.push(x, y, 0);
            }
        }

        // Generate indices for triangles
        this.indices = [];

        // Generate the curved surface triangles
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let vertex = 0; vertex < this.slices - 1; vertex++) {
                // Calculate indices for current vertices and vertices in the next stack
                const currentVertex = stack * this.slices + vertex;
                const nextVertex = currentVertex + 1;
                const vertexBelowCurrent = (stack + 1) * this.slices + vertex;
                const vertexBelowNext = vertexBelowCurrent + 1;
                
                // First triangle (current, vertex below next, vertex below current)
                this.indices.push(currentVertex, vertexBelowNext, vertexBelowCurrent);
                
                // Second triangle (current, next, vertex below next)
                this.indices.push(currentVertex, nextVertex, vertexBelowNext);
            }
        }

        // Set the primitive type to triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}