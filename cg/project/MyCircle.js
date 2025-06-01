import { CGFobject } from '../lib/CGF.js';

/**
 * MyCircle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - Circle radius
 * @param segments - Number of segments to approximate the circle
*/
export class MyCircle extends CGFobject {
    constructor(scene, radius = 1, segments = 40) {
        super(scene);
        this.radius = radius;
        this.segments = segments;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        this.vertices.push(0, 0, 0);            
        this.normals.push(0, 1, 0); 
        this.texCoords.push(0.5, 0.5);
        
        const deltaAlpha = (2 * Math.PI) / this.segments;

        for (let i = 0; i <= this.segments; i++) {
            const angle = deltaAlpha * i;
            const x = this.radius * Math.cos(angle);
            const z = this.radius * Math.sin(angle);

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);

            const u = 0.5 + 0.5 * Math.cos(angle);
            const v = 0.5 + 0.5 * Math.sin(angle);
            this.texCoords.push(u, v);

            if (i > 0) {
                this.indices.push(i+1, i, 0);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}
