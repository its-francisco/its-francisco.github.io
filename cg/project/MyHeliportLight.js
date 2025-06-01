import { CGFobject } from '../lib/CGF.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';

/**
 * MyHeliportLight
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeliportLight extends CGFobject {
    constructor(scene) {
        super(scene);
        this.t = 0;
        this.cube = new MyUnitCubeQuad(this.scene);

        this.activeMaterial = this.scene.lightOffMaterial;
    }
    turnOff() {
        this.activeMaterial = this.scene.lightOffMaterial;
    }
    turnOn() {
        this.t = 0;
        this.activeMaterial = this.scene.lightOnMaterial;
    }
    update(delta_t) {
        this.t += delta_t;
        const emissivity = Math.sin(this.t / 100) * 0.5 + 0.5; // Oscillate emissivity between 0 and 1
        this.scene.lightOnMaterial.setEmission(emissivity, emissivity, emissivity, 1);
    }
    display() {
        this.scene.pushMatrix();
        this.activeMaterial.apply();
        this.cube.display(); 
        this.scene.popMatrix();
    }
}