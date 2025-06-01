import { CGFobject } from '../lib/CGF.js';
import { MySphere } from './MySphere.js';
/**
 * MyPanorama
 * @constructor
 * @param scene - Reference to MyScene object
 * @param texture - Texture to be applied to the panorama
 */
export class MyPanorama extends CGFobject {
    constructor(scene, texture) {
        super(scene);
        this.initBuffers();
        this.texture = texture;
        this.sphere = new MySphere(scene, 30, 30)
    }
    display() {
        // Sphere centered in the position of the camera, but not moving y to stick the horizon 
        const cameraPosition = this.scene.camera.position;
        this.scene.panoramaMaterial.setTexture(this.texture);
        this.scene.pushMatrix();
        this.scene.translate(cameraPosition[0], 0, cameraPosition[2]);

        this.scene.scale(200,200,200)

        this.scene.panoramaMaterial.apply();
        this.sphere.display();

        this.scene.popMatrix();
    }

}