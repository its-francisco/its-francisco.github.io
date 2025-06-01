import { CGFobject } from '../lib/CGF.js';
import { MyFireSpot } from './MyFireSpot.js';
import { MyTriangleIsosceles } from './MyTriangleIsosceles.js';
import { randomInRange } from './utilities.js';

/**
 * MyFire
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyFire extends CGFobject {
    constructor(scene) {
        super(scene);

        this.baseTriangle = new MyTriangleIsosceles(scene);

        this.initFires();
    }
    initFires() {
        this.fireSpots = [];
        this.fireSpotCoords = [];
        this.fireSpotCount = 0;

        this.topRotations = [];
        this.middleRotations = [];
        this.bottomRotations = [];
        this.phases = [];
        for (let i = 0; i < this.scene.forest.rows * this.scene.forest.cols; i++) {
            const hasFireProbability = randomInRange(0, 1);
            if (hasFireProbability < 0.5) { // 50% chance of fire
                const labaredaCount = randomInRange(3, 10);
                const fireSpot = new MyFireSpot(this.scene, labaredaCount);
                this.fireSpots.push(fireSpot);
                const [treeX, treeZ] = this.scene.forest.positions[i];
                this.fireSpotCoords.push([treeX, treeZ]);
                this.fireSpotCount++;
                this.phases.push(randomInRange(0, 2 * Math.PI)); 
                const topRotation = [randomInRange(0.1, 0.5), randomInRange(0.1, 0.5)];
                const middleRotation = [randomInRange(0.01, 0.1), randomInRange(0.01, 0.1)];
                const bottomRotation = [randomInRange(0.001, 0.1), randomInRange(0.001, 0.1)];
                this.topRotations.push(topRotation);
                this.middleRotations.push(middleRotation);
                this.bottomRotations.push(bottomRotation);
            }
        }
    }

    extinguish(ids) {
        const newFireSpots = [];
        const newFireSpotCoords = [];
        const newTopRotations = [];
        const newMiddleRotations = [];
        const newBottomRotations = [];
        const newPhases = [];
        for (let i = 0; i < this.fireSpotCount; i++) {
            if (!ids.includes(i)) {
                newFireSpots.push(this.fireSpots[i]);
                newFireSpotCoords.push(this.fireSpotCoords[i]);
                newTopRotations.push(this.topRotations[i]);
                newMiddleRotations.push(this.middleRotations[i]);
                newBottomRotations.push(this.bottomRotations[i]);
                newPhases.push(this.phases[i]);
            }
        }
        this.fireSpots = newFireSpots;
        this.fireSpotCoords = newFireSpotCoords;
        this.fireSpotCount = this.fireSpots.length;
        this.topRotations = newTopRotations;
        this.middleRotations = newMiddleRotations;
        this.bottomRotations = newBottomRotations;
        this.phases = newPhases;
    }
    display() {
        this.scene.fireMaterial.apply();
        for (let i = 0; i < this.fireSpotCount; i++) {
            this.scene.fireShader.setUniformsValues({
                phase: this.phases[i],                    // Adjust for fire spot phase
                topRotation: this.topRotations[i],        // Top rotation for the fire spot
                middleRotation: this.middleRotations[i],  // Middle rotation for the fire spot
                bottomRotation: this.bottomRotations[i]   // Bottom rotation for the fire spot
            });
            this.scene.pushMatrix();
            this.scene.translate(this.fireSpotCoords[i][0], 0, this.fireSpotCoords[i][1]);
            this.scene.scale(10, 10, 10);
            this.fireSpots[i].display();
            this.scene.popMatrix();
        }
    }
}