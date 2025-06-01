import { CGFobject } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';

/**
 * MyLake
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyLake extends CGFobject {
    constructor(scene) {
        super(scene);
        this.lake = new MyPlane(scene, 50);
    }

    display() {
        this.scene.setActiveShader(this.scene.waterShader);
        this.scene.waterTexture.bind();
        this.scene.bumpTextureWater.bind(1);
        this.scene.waterShape.bind(2);
        this.lake.display();
        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
