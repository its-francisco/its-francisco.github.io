import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';

/**
 * MyWindow
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyWindow extends CGFobject {
    constructor(scene, width, height, texture) {
        super(scene);
        this.width = width;
        this.height = height;       
        this.quad = new MyQuad(this.scene)
        this.texture = texture || this.scene.windowTexture;
    }
    display() {
        // Set texture and apply material
        this.scene.windowMaterial.setTexture(this.texture);
        this.scene.windowMaterial.apply();
        this.scene.pushMatrix();
        this.scene.scale(this.width, this.height, 1);
        this.quad.display(); 
        this.scene.popMatrix();
    }
}