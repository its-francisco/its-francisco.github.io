import { CGFobject } from '../lib/CGF.js';
import { MyPlane } from './MyPlane.js';
import { randomInRange, to_radians } from './utilities.js';

/**
 * MyShower
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyShower extends CGFobject {
    constructor(scene) {
        super(scene);
        this.baseDroplet = new MyPlane(scene);
        this.xPosition = [];
        this.yPosition = [];
        this.zPosition = [];
        this.yVelocities = [];
        this.xVelocities = [];
        this.zVelocities = [];
        this.scales = [];
        this.dropletsToDrop = 40;
        this.showerDropletsCount = 40;
        this.enabled = false;
    }
    start() {
        this.enabled = true;
    }
    reset() {
        this.enabled = false;

        this.xPosition = [];
        this.yPosition = [];
        this.zPosition = [];
        this.yVelocities = [];
        this.xVelocities = [];
        this.zVelocities = [];
        this.scales = [];
        this.dropletsToDrop = this.showerDropletsCount;
    }
    isOver() {
        return this.dropletsToDrop <= 0 && this.xPosition.length === 0;
    }
    initDroplet(x, y, z) {
        if (this.dropletsToDrop <= 0) return;

        this.dropletsToDrop--;
        const xOffset = randomInRange(-1.5, 1.5);
        const zOffset = randomInRange(-1.5, 1.5);
        this.xPosition.push(x + xOffset);
        this.yPosition.push(y);
        this.zPosition.push(z + zOffset);
        this.scales.push(randomInRange(2,3))
        this.yVelocities.push(randomInRange(0.01, 0.02))
        this.xVelocities.push(randomInRange(-0.005, 0.005))
        this.zVelocities.push(randomInRange(-0.005, 0.005))
    }
    display() {
        if (!this.enabled) return;

        this.scene.setActiveShader(this.scene.waterfallShader);
        this.scene.waterfallMaterial.apply();
        for (let i = 0; i < this.xPosition.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(this.xPosition[i], this.yPosition[i], this.zPosition[i]);
            this.scene.scale(this.scales[i], this.scales[i], this.scales[i]);
            this.scene.transparentDisplay(this.baseDroplet);
            this.scene.popMatrix();
        }
        this.scene.setActiveShader(this.scene.defaultShader);
    }
    update(delta_t) {
        if (!this.enabled) return;

        for (let i = this.yPosition.length - 1; i >= 0; i--) {
            this.yPosition[i] -= this.yVelocities[i] * delta_t;
            this.xPosition[i] -= this.xVelocities[i] * delta_t;
            this.zPosition[i] -= this.zVelocities[i] * delta_t;
            this.yVelocities[i] += 0.001 ; 
        }
    }
    removeDroplet(index) {
        this.xPosition.splice(index, 1);
        this.yPosition.splice(index, 1);
        this.zPosition.splice(index, 1);
        this.yVelocities.splice(index, 1);
        this.xVelocities.splice(index, 1);
        this.zVelocities.splice(index, 1);
        this.scales.splice(index, 1);
    }
    extinguishFire(coords, offsetx, offsetz, minDistance) {
        let overFires = [];
        for (let i = this.yPosition.length - 1; i >= 0; i--) {
            if (this.yPosition[i] <= 0) {
                overFires = overFires.concat(coords.reduce((indices, fireSpot, index) => {
                    // heli is over a fire if inside radius 10
                    const [x, z] = fireSpot;
                    const real_x = x + offsetx;
                    const real_z = z + offsetz;
                    const distance = Math.pow(this.xPosition[i] - real_x, 2) + Math.pow(this.zPosition[i] - real_z, 2);
                    if (distance < minDistance) {
                        indices.push(index);
                    }
                    return indices;
                }, []));
                this.removeDroplet(i);
            }
        }
        return overFires;
    }    
}