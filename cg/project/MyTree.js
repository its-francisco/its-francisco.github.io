import { CGFobject } from '../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';
import { to_radians } from './utilities.js';

/**
 * MyTree
 * @constructor
 * @param scene - Reference to MyScene object
 * @param rotation - Rotation angle in degrees
 * @param axis - Axis of rotation ('X' or 'Z')
 * @param radius - Radius of the base of the trunk
 * @param height - Height of the tree
 * @param color - Color of the tree top in RGB format
 * @param options - Optional configurations 
 * @param options.relativeTreeTopHeight - Proportion of the total height used for the treetops.
 * @param options.trunkComplexity - Number of slices used for the trunk cone geometry.
 * @param options.treeTopSize - Vertical size of each pyramid layer in the foliage.
 * @param options.treeTopComplexity - Number of slice for each treetop pyramid.
 */
export class MyTree extends CGFobject {
    
    constructor(scene, rotation, axis, radius, height, color, {
        relativeTreeTopHeight = 0.8, 
        trunkComplexity = 100, 
        treeTopSize = 2, 
        treeTopComplexity = 5
    } = {}) {
        super(scene);

        this.rotation = to_radians(rotation);
        this.axis = axis === 'X' ? [1,0,0] : [0,0,1];
        this.radius = radius;
        this.height = height;
        this.color = [...color, 1];
        
        this.totalTreeTopHeight = height * relativeTreeTopHeight;
        this.visibleTrunkProportion = 1 - relativeTreeTopHeight;
        this.treeTopSize = treeTopSize;
        this.numTreeTops = Math.max(1, Math.round(this.totalTreeTopHeight / treeTopSize)); 
        // Radius of the base of the first tree top
        this.treeTopBaseRadius = radius + (this.totalTreeTopHeight / 4); 
        // Y coordenate of the first tree top
        this.treeTopStartingY = this.height * this.visibleTrunkProportion;
        // By how much the tree top shrinks
        this.treeTopShrinkFactor = (this.treeTopBaseRadius - radius) / this.numTreeTops;
        let peakPosition = [0, this.height, 0]
        if (axis == 'Z') {
            peakPosition = [-this.height * Math.sin(this.rotation), this.height * Math.cos(this.rotation), 0]
        }
        if (axis == 'X') {
            peakPosition = [0, this.height * Math.cos(this.rotation), this.height * Math.sin(this.rotation)]
        }
        this.trunk = new MyCone(scene, trunkComplexity, 0,1,0,1, {radius: this.radius, peakPosition: peakPosition} );
        this.treeTop = new MyPyramid(scene, treeTopComplexity);
    }
    display() {
        this.scene.pushMatrix();

        this.scene.treeMaterial.setAmbient(...this.color);
        this.scene.treeMaterial.setDiffuse(...this.color);
        this.scene.treeMaterial.setSpecular(...this.color);
        // Display trunk
        this.scene.pushMatrix();
        this.scene.trunkMaterial.apply();
        this.trunk.display();
        this.scene.popMatrix();

        // Display foliage
        this.scene.pushMatrix();
        this.scene.rotate(this.rotation, ...this.axis);
        this.scene.treeMaterial.apply();
        for (let i = 0; i < this.numTreeTops; i++) {
            const scaleFactor = this.treeTopBaseRadius - (this.treeTopShrinkFactor * i);

            this.scene.pushMatrix();
            this.scene.translate(0, i * this.treeTopSize + this.treeTopStartingY, 0);
            this.scene.scale(scaleFactor, 2*this.treeTopSize, scaleFactor); 
            this.treeTop.display();
            this.scene.popMatrix();
        }
        this.scene.popMatrix();        
        this.scene.popMatrix();        
    }
}