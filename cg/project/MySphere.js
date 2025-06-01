import { CGFobject } from '../lib/CGF.js';
/**
* MySphere
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of slices
 * @param stacks - number of stacks
 * @param minS - minimum texture coordinate in S
 * @param maxS - maximum texture coordinate in S
 * @param minT - minimum texture coordinate in T
 * @param maxT - maximum texture coordinate in T
 * @param inverted - true if the sphere is viewed from the inside
*/
export class MySphere extends CGFobject {
    constructor(scene, stacks, slices, minS, maxS, minT, maxT, inverted) {
        super(scene);
        this.stacks = stacks;
        this.slices = slices;
        this.minS = minS || 0;
        this.maxS = maxS || 1;
        this.minT = minT || 0;
        this.maxT = maxT || 1;
        this.q = (this.maxS - this.minS) / this.slices;
        this.middleT = (this.maxT - this.minT) / 2;
        this.w = this.middleT / this.stacks;
        this.inverted = inverted == null ? true : inverted;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        
        const deltaAlpha = Math.PI / (2 * this.stacks);
        const deltaBeta = 2 * Math.PI / (this.slices);
        let p1 = [0, 0, 1];
        let cosBeta = Math.cos(deltaBeta);
        let sinBeta = Math.sin(deltaBeta);
        let cosAlpha = Math.cos(-deltaAlpha);
        let sinAlpha = Math.sin(-deltaAlpha);

        // Upper semisphere
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                this.vertices.push(...p1);
                this.texCoords.push(this.minS + slice * this.q, this.middleT - stack * this.w);
                p1 = [p1[0] * cosBeta + p1[2] * sinBeta, p1[1], -sinBeta * p1[0] + cosBeta * p1[2]]
            }
            this.vertices.push(...p1);
            this.texCoords.push(this.maxS, this.middleT - stack * this.w);
            p1 = [p1[0], p1[1] * cosAlpha - p1[2] * sinAlpha, sinAlpha * p1[1] + cosAlpha * p1[2]]
        }
        // Upper pole vertices
        for (let slice = 0; slice < this.slices; slice++) {
            this.vertices.push(...[0,1,0]);
            this.texCoords.push(this.minS + slice * this.q, this.minT);
            p1 = [p1[0] * cosBeta + p1[2] * sinBeta, p1[1], -sinBeta * p1[0] + cosBeta * p1[2]]
        }
        this.vertices.push(...[0,1,0]);
        this.texCoords.push(this.maxS, this.minT);

        // Lower semisphere
        let vertexNum = this.vertices.length
        for (let i = 0; i < vertexNum; i += 3) {
            // symmetric Y coordinates
            this.vertices.push(this.vertices[i], -this.vertices[i + 1], this.vertices[i+2]);
            this.texCoords.push(this.texCoords[i * 2], this.maxT - this.texCoords[i * 2 + 1])
            this.texCoords.push(this.texCoords[(i + 1) * 2], this.maxT - this.texCoords[(i + 1) * 2 + 1])
            this.texCoords.push(this.texCoords[(i + 2) * 2], this.maxT - this.texCoords[(i + 2) * 2 + 1])
        }

        this.indices = [];

        // Number of vertices in a semipshere (offset to access lower half vertices)
        let bottomVertex = vertexNum/3
        for (let stack = 0; stack < this.stacks; stack++) {
            let vertex = stack * (this.slices+1);
            for (let j = vertex; j < vertex + this.slices; j++) {
                let nextVertex = j + 1;
                // Triangles in last stack
                if (stack == this.stacks - 1) {
                    if (this.inverted) {
                        this.indices.push(j + this.slices + 1, nextVertex, j);
                        this.indices.push(j + bottomVertex, nextVertex + bottomVertex, j + this.slices + 1 + bottomVertex);
                    }
                    else {
                        this.indices.push(j, nextVertex, j + this.slices +1);
                        this.indices.push(j + this.slices + 1 + bottomVertex, nextVertex + bottomVertex, j + bottomVertex);
                    }
                }
                // Quadrilaterals in other stacks
                else {
                    if (this.inverted) {
                        this.indices.push(j + this.slices + 1, nextVertex, j);
                        this.indices.push(j + this.slices + 1, nextVertex + this.slices + 1, nextVertex);
                        this.indices.push(j + bottomVertex, nextVertex + bottomVertex, j + this.slices + 1 + bottomVertex);
                        this.indices.push(nextVertex + bottomVertex, nextVertex + this.slices + 1 + bottomVertex, j + this.slices + 1 + bottomVertex);
                    }
                    else {
                        this.indices.push(j, nextVertex, j + this.slices + 1);
                        this.indices.push(nextVertex, nextVertex + this.slices + 1, j + this.slices + 1);
                        this.indices.push(j + this.slices + 1 + bottomVertex, nextVertex + bottomVertex, j + bottomVertex);
                        this.indices.push(j + this.slices + 1 + bottomVertex, nextVertex + this.slices + 1 + bottomVertex, nextVertex + bottomVertex);
                    }   
                }
            }
        }

        if (this.inverted) this.normals = this.vertices.map(coordinate => (-coordinate))
        else this.normals = this.vertices
        this.initGLBuffers();
    }
}