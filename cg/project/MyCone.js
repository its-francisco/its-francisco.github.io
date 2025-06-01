import {CGFobject} from '../lib/CGF.js';
import { crossProduct3D, to_radians, normalize } from './utilities.js';

/**
* MyCone
* @constructor
 * @param scene - Reference to MyScene object
 * @param slices - number of divisions around the Y axis
 * @param minS - minimum texture coordinate in S
 * @param maxS - maximum texture coordinate in S
 * @param minT - minimum texture coordinate in T
 * @param maxT - maximum texture coordinate in T
 * @param options - Extra parameters
 * @param options.peakPosition - Position of the peak of the cone
 * @param options.radius - Radius of the base of the cone
*/
export class MyCone extends CGFobject {
    constructor(scene, slices, minS, maxS, minT, maxT, {peakPosition=[0,1,0], radius=1} = {}) {
        super(scene);
        this.slices = slices;
        this.minS = minS || 0;
        this.maxS = maxS || 1;
        this.minT = minT || 0;
        this.maxT = maxT || 1;
        this.q = (this.maxS - this.minS) / this.slices;
        this.peakPosition = peakPosition;
        this.radius = radius;
        this.initBuffers();
    }
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        this.vertices.push(this.radius*Math.cos(ang), 0,this.radius* -Math.sin(ang));
        this.texCoords.push(this.minS, this.minT);
        ang += alphaAng;

        const peakNormal = normalize(this.peakPosition);

        for(let i = 1; i <= this.slices; i++){
            const cosa = Math.cos(ang);
            const sina = Math.sin(ang);
            this.vertices.push(...this.peakPosition);
            this.vertices.push(this.radius*cosa, 0, this.radius* -sina);
            let topV = i * 2 - 1
            this.indices.push(topV - 1, (topV + 1), topV);

            this.normals.push(...peakNormal);

            const VA = [
                this.peakPosition[0] - this.radius*cosa, 
                this.peakPosition[1], 
                this.peakPosition[2] + this.radius*sina
            ];
            const VB = [
                this.peakPosition[0] - this.radius*Math.cos(ang + alphaAng), 
                this.peakPosition[1], 
                this.peakPosition[2] + this.radius*Math.sin(ang + alphaAng)
            ]; 
            
            const normalface1 = normalize(crossProduct3D(VA, VB));

            const VC = [
                this.peakPosition[0] - this.radius*Math.cos(ang - alphaAng), 
                this.peakPosition[1], 
                this.peakPosition[2] + this.radius*Math.sin(ang - alphaAng)
            ];
            const normalface2 = normalize(crossProduct3D(VC, VA));

            const normal = [
                (normalface1[0] + normalface2[0]) / 2,
                (normalface1[1] + normalface2[1]) / 2,
                (normalface1[2] + normalface2[2]) / 2
            ];

            this.normals.push(...normalize(normal));

            this.texCoords.push(this.minS + (i-1) * this.q + this.q/2, this.maxT);
            this.texCoords.push(this.minS + i * this.q, this.minT);
            ang+=alphaAng;
        }
        // get last vertex normal for closing the cone
        const firstVertexNormal = this.normals.slice(-3);

        this.vertices.push(...this.peakPosition);
        this.normals.push(...normalize(this.peakPosition));

        // insert at beginning
        this.normals.unshift(...firstVertexNormal);

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}


