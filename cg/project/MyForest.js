import { CGFobject } from '../lib/CGF.js';
import { randomInRange } from './utilities.js';
import { MyTree } from './MyTree.js';

/**
 * MyForest
 * @constructor
 * @param scene - Reference to MyScene object
 * @param width - Total width of the forest
 * @param depth - Total depth of the forest
 * @param rows - Number of rows of trees
 * @param cols - Number of columns of trees
 * @param trunkTexture - Texture for the trunk of the trees
 * @param foliageTexture - Texture for the foliage of the trees
 */
export class MyForest extends CGFobject {
    constructor(scene, width, depth, rows, cols) {
        super(scene);

        this.width = width;
        this.depth = depth;
        this.rows = rows;
        this.cols = cols;

        this.initTrees();
        
    }
    initTrees() {
        this.trees = [];
        this.positions = [];
        
        this.treeCount = this.cols * this.rows;

        const rowDist = this.width/this.rows;
        const colDist = this.depth/this.cols;
        
        const minDist = Math.min(rowDist, colDist);
        
        const rotationRange = [-15, 15];
        const radiusRange = [minDist / 8, minDist / 4];
        const heightRange = [4, 20];
        const offsetRange = [minDist / 4, minDist];
        for(let row = 0; row < this.rows; row++) {
            for(let col = 0; col < this.cols; col++) {
                const rotation = randomInRange(...rotationRange);
                const axis = Math.random() < 0.5 ? 'X' : 'Z';
                const radius = randomInRange(...radiusRange);
                const height = randomInRange(...heightRange);
                const color = [0, Math.random(), 0];
                const xOffset = randomInRange(...offsetRange);
                const zOffset = randomInRange(...offsetRange);
                let tree = new MyTree(this.scene, rotation, axis, radius, height, color);
                this.trees.push(tree);
                this.positions.push([row*rowDist + xOffset, col * colDist + zOffset]);
            }
        }
    }
    display() {
        for (let index = 0; index < this.treeCount; index++) {
            const [x, z] = this.positions[index]
            this.scene.pushMatrix()
            this.scene.translate(x, 0, z);
            this.trees[index].display();
            this.scene.popMatrix()
        }
    }
}