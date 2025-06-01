import { CGFobject } from '../lib/CGF.js';
import { MyHalfSphere } from './MyHalfSphere.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyCircle } from './MyCircle.js';
import { PI_2 } from './utilities.js';

/**
 * MyBucket
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - Height of the bucket ropes
 * @param extension - Extension of bucket's rope (optional)
 */
export class MyBucket extends CGFobject {
    constructor(scene, height, extension) {
        super(scene);

        this.base = new MyHalfSphere(scene, 10, 6, 0, 1, 0, 0.5, 0);
        this.rope = new MyUnitCubeQuad(scene);
        // Water surface for when the bucket is full
        this.waterSurface = new MyCircle(scene, 1, 6);
        this.height = height;
        this.extension = extension || 0
        this.waterFull = false;

        // Needed for rope in each vertice of the bucket
        this.ropeLength = Math.sqrt(1 + Math.pow(this.height, 2));
        this.ropeAlpha = (2 * Math.PI / (this.base.slices));
        this.ropeStartingAngle = -PI_2;
        this.ropeRotation = Math.atan(1/this.height);
    }
    display() {
        let ropeAngle = this.ropeStartingAngle;
        this.scene.pushMatrix();
        this.scene.translate(0, this.height, 0);
        for (let i = 0; i < this.base.slices ; i++) {
            this.scene.pushMatrix();
            this.scene.rotate(ropeAngle, 0, 1, 0);
            this.scene.rotate(this.ropeRotation, 0, 0, 1);
            this.scene.scale(0.05, this.ropeLength, 0.05);
            this.scene.translate(0, -0.5, 0);
            this.rope.display();
            this.scene.popMatrix();
            ropeAngle += this.ropeAlpha;
        }
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, this.height + this.extension, 0);
        this.scene.scale(0.05, this.extension, 0.05);
        this.scene.translate(0, -0.5, 0);
        this.rope.display()
        this.scene.popMatrix();

        if (this.waterFull) {
            // Show water surface inside the bucket
            this.scene.pushMatrix(); 
            this.scene.translate(0, -0.2, 0);
            this.scene.rotate(-PI_2, 0, 1, 0);
            this.scene.scale(0.9, 0.9, 0.9);
            this.scene.waterMaterial.apply();
            this.waterSurface.display();
            this.scene.popMatrix();
        }

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(1, 2, 1);
        this.scene.plasticMaterial.apply();
        this.base.display();
        this.scene.popMatrix();
    }
}