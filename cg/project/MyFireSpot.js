import { CGFobject } from '../lib/CGF.js';
import { MyTriangleIsosceles } from './MyTriangleIsosceles.js';
import { randomInRange, to_radians } from './utilities.js';

/**
 * MyFireSpot
 * @constructor
 * @param scene - Reference to MyScene object
 * @param count - Number of individual fires in the fire spot
 */
export class MyFireSpot extends CGFobject {
    constructor(scene, count) {
        super(scene);

        this.baseTriangle = new MyTriangleIsosceles(scene);
        this.textures = [this.scene.fireTexture1, this.scene.fireTexture2, this.scene.fireTexture3];
        this.rotations = [];
        this.axis = [];
        this.xOffsets = [];
        this.zOffsets = [];
        this.xScale = [];
        this.yScale = [];
        this.textureIndices = [];
        this.count = count;

        this.initFires();
    }
    initFires() {
        // [1, 0, 0,  0,0,0,  1,1,0]
        for (let i = 0; i < this.count; i++) {
            const rotation = randomInRange(-45, 45);
            const axis = Math.random() < 0.3 ? 'X' : 'Y';
            const xOffset = randomInRange(0, 0.5);
            const zOffset = randomInRange(0, 0.5);
            const yScale = randomInRange(0.5, 1);
            const xScale = randomInRange(0.25, 0.75);
            this.rotations.push(to_radians(rotation));
            this.axis.push(axis);
            this.xOffsets.push(xOffset);
            this.zOffsets.push(zOffset);
            this.xScale.push(xScale);
            this.yScale.push(yScale);
            this.textureIndices.push(Math.floor(randomInRange(0,3)))
        }
    }
    display() {
        for (let i = 0; i < this.count; i++) {
            this.textures[this.textureIndices[i]].bind();
            this.scene.pushMatrix();
            this.scene.translate(this.xOffsets[i], 0, this.zOffsets[i]);
            if (this.axis[i] === 'X') {
                this.scene.rotate(this.rotations[i], 1, 0, 0);
            } else {
                this.scene.rotate(this.rotations[i], 0, 1, 0);
            }
            this.scene.scale(this.xScale[i], 1, 1);
            this.scene.scale(1, this.yScale[i], 1);
            this.baseTriangle.display();
            this.scene.popMatrix();
        }
    }
    
}