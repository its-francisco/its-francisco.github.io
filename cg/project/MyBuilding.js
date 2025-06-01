import { CGFobject, CGFappearance } from '../lib/CGF.js';
import { MyHeliportLight } from './MyHeliportLight.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { MyWindow } from './MyWindow.js';
import { MyPlane } from './MyPlane.js';
/**
 * MyBuilding
 * @constructor
 * @param scene - Reference to MyScene object
 * @param width - Total width of the building
 * @param floors - Number of floors
 * @param windows - Number of windows per floor
 * @param color - Color of the building
 * @param options - Extra parameters
 * @param options.floorSize - Size of each floor
 * @param options.relativeLateralModuleWidth - Width of the lateral modules relative to the central module
 * @param options.relativeLateralModuleDepth - Depth of the lateral modules relative to the central module
 * @param options.windowSizeRatio - Ratio of the window to wall size in each "cell" of the building
 */
export class MyBuilding extends CGFobject {
    constructor(scene, width, floors, windows, color,
        {   floorSize = 4,
            relativeLateralModuleWidth = 0.75,
            relativeLateralModuleDepth = 0.75,
            windowSizeRatio = 1/3
        } = {}) {
        super(scene);
        this.totalWidth = width;
        this.floors = floors;
        this.windowPerFloor = windows;

        // Extra parameters
        this.floorSize = floorSize;
        this.relativeLateralModuleWidth = relativeLateralModuleWidth;
        this.relativeLateralModuleDepth = relativeLateralModuleDepth;
        this.windowSizeRatio = windowSizeRatio;

        // Change building material according to the color
        this.scene.buildingMaterial.setAmbient(...color, 1);
        this.scene.buildingMaterial.setDiffuse(...color, 1);
        this.scene.buildingMaterial.setSpecular(...color, 1);

        this.heliportUp = false;
        this.heliportDown = false;

        this.initPrimitives();
    }

    initPrimitives() {
        // Build the building based on the parameters
        this.centralModuleWidth = this.totalWidth / (1 + this.relativeLateralModuleWidth*2);
        this.centralModuleDepth = this.centralModuleWidth;
        this.lateralModuleWidth = (this.totalWidth - this.centralModuleWidth) / 2;
        this.lateralModuleDepth = this.relativeLateralModuleDepth * this.centralModuleDepth;
        this.lateralModuleHeight = this.floors * this.floorSize;
        this.centralModuleHeight = this.lateralModuleHeight + this.floorSize;

        this.lateralOffsetX = this.lateralModuleWidth / 2 + this.centralModuleWidth / 2;
        this.centralModuleZOffset = (this.centralModuleDepth - this.lateralModuleDepth) / 2;
        
        this.windowSize = (this.centralModuleWidth / this.windowPerFloor) * this.windowSizeRatio;

        this.doorHeight = this.floorSize * 0.75;
        this.signHeight = this.floorSize * 0.2;

        this.unitCube = new MyUnitCubeQuad(this.scene);
        this.centralCube = new MyUnitCubeQuad(this.scene);
        this.window = new MyWindow(this.scene, this.windowSize, this.windowSize, this.scene.windowTexture);
        this.sign = new MyWindow(this.scene, this.windowSize*3, this.signHeight, this.scene.signTexture);
        this.door = new MyWindow(this.scene, this.doorHeight, this.doorHeight, this.scene.doorTexture);
        this.heliport = new MyPlane(this.scene);
        this.light = new MyHeliportLight(this.scene);
        this.lightWidth = 1;
        this.lightHeight = 0.1;
        this.lightPositions = [
            [-this.centralModuleWidth/2 + this.lightWidth/2, this.centralModuleHeight + this.lightHeight / 2, this.centralModuleDepth/2 + this.centralModuleZOffset - this.lightWidth/2],
            [-this.centralModuleWidth/2 + this.lightWidth/2, this.centralModuleHeight + this.lightHeight / 2, -this.centralModuleDepth/2 + this.centralModuleZOffset + this.lightWidth/2],
            [this.centralModuleWidth/2 - this.lightWidth/2, this.centralModuleHeight + this.lightHeight / 2, this.centralModuleDepth/2 + this.centralModuleZOffset - this.lightWidth/2],
            [this.centralModuleWidth/2 - this.lightWidth/2, this.centralModuleHeight + this.lightHeight / 2, -this.centralModuleDepth/2 + this.centralModuleZOffset + this.lightWidth/2],
        ];
    }

    display() {
        this.scene.buildingMaterial.apply()
        // Left module
        this.scene.pushMatrix();
        this.scene.translate(-this.lateralOffsetX, this.lateralModuleHeight / 2, 0)
        this.scene.scale(this.lateralModuleWidth, this.lateralModuleHeight, this.lateralModuleDepth)
        this.unitCube.display();
        this.scene.popMatrix();

        // Middle module
        this.scene.pushMatrix();
        this.scene.translate(0, this.centralModuleHeight / 2, this.centralModuleZOffset)
        this.scene.scale(this.centralModuleWidth, this.centralModuleHeight, this.centralModuleDepth)
        this.centralCube.display();
        this.scene.popMatrix();

        // Heliport
        this.scene.pushMatrix();
        this.scene.translate(0, this.centralModuleHeight + 0.1, this.centralModuleZOffset)
        this.scene.scale(this.centralModuleWidth, 1, this.centralModuleDepth)
        this.scene.rotate(-Math.PI/2, 1, 0, 0)
        this.scene.heliMaterial.apply();
        if (this.heliportUp || this.heliportDown) {
            this.scene.setActiveShader(this.scene.heliShader);
            if (this.heliportUp) this.scene.heliportUpTexture.bind(1);
            if (this.heliportDown) this.scene.heliportDownTexture.bind(1);
        }
        this.scene.heliportTexture.bind(0)
        this.scene.transparentDisplay(this.heliport);
        this.scene.popMatrix();
        if (this.heliportUp || this.heliportDown) this.scene.setActiveShader(this.scene.defaultShader);

        // Right module
        this.scene.buildingMaterial.apply()
        this.scene.pushMatrix();
        this.scene.translate(this.lateralOffsetX, this.lateralModuleHeight / 2, 0)
        this.scene.scale(this.lateralModuleWidth, this.lateralModuleHeight, this.lateralModuleDepth)
        this.unitCube.display();
        this.scene.popMatrix();

        // Windows
        const windowSepCentral = this.centralModuleWidth/this.windowPerFloor;
        const windowSepLateral = this.lateralModuleWidth/this.windowPerFloor;
        const leftModuleWindowX = - this.centralModuleWidth/2 - windowSepLateral/2;
        const centralModuleWindowX = -this.centralModuleWidth/2 + windowSepCentral/2;
        for (let floor = 0; floor < this.floors; floor++) {
            for (let i = 0; i < this.windowPerFloor; i++) {
                // Left module
                this.scene.pushMatrix();
                this.scene.translate(leftModuleWindowX - windowSepLateral*i, floor * this.floorSize + this.floorSize / 2, this.lateralModuleDepth / 2 + 0.1)
                this.window.display();
                this.scene.popMatrix();
                // Central module
                this.scene.pushMatrix();
                this.scene.translate(windowSepCentral * i + centralModuleWindowX, (floor + 1) * this.floorSize + this.floorSize / 2, (this.centralModuleDepth) / 2 +  this.centralModuleZOffset + 0.1)
                this.window.display();
                this.scene.popMatrix();
                // Right module
                this.scene.pushMatrix();
                this.scene.translate(-leftModuleWindowX + windowSepLateral*i, floor * this.floorSize + this.floorSize / 2, this.lateralModuleDepth / 2 + 0.01)
                this.window.display();
                this.scene.popMatrix();
            }
        }
        // Door
        this.scene.pushMatrix();
        this.scene.translate(0, this.doorHeight/2, (this.centralModuleDepth) / 2 + this.centralModuleZOffset + 0.1)
        this.door.display();
        this.scene.popMatrix();

        // Sign
        this.scene.pushMatrix();
        this.scene.translate(0, this.signHeight/2 + (this.floorSize+this.doorHeight)/2, (this.centralModuleDepth) / 2 +  this.centralModuleZOffset + 0.1)
        this.sign.display();
        this.scene.popMatrix();

        //lights
        for (let i = 0; i < this.lightPositions.length; i++) {
            this.scene.pushMatrix();
            this.scene.translate(...this.lightPositions[i]);
            this.scene.scale(this.lightWidth, this.lightHeight, this.lightWidth);
            this.light.display();
            this.scene.popMatrix();
        }
    }

    getHeliportAbsolutePosition() {
        const buildingPosition = this.scene.buildingPosition;
        return [buildingPosition[0], this.centralModuleHeight + buildingPosition[1], this.centralModuleDepth/2 - 3 + buildingPosition[2]];
    }

    heliportUpManeuver() {
        this.light.turnOn();
        this.heliportDown = false;
        this.heliportUp = true;
    }

    heliportDownManeuver() {
        this.light.turnOn();
        this.heliportUp = false;
        this.heliportDown = true;
    }

    heliportStopManeuver() {
        this.light.turnOff();
        this.heliportUp = false;
        this.heliportDown = false; 
    }

    update(delta_t) {
        this.light.update(delta_t);
    }
}