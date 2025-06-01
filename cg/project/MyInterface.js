import { CGFinterface, dat } from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);

        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        this.initKeys();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');
        this.gui.add(this.scene, 'displayPanorama').name('Display Panorama');
        
        this.gui.add(this.scene, 'displayBuilding').name('Display Building');
        const buildingFolder = this.gui.addFolder('Building');
        buildingFolder.add(this.scene.building, 'totalWidth', 20, 100).step(1).name('Total Width').onChange(this.scene.building.initPrimitives.bind(this.scene.building));
        buildingFolder.add(this.scene.building, 'floors', 1, 10).step(1).name('Floors').onChange(this.scene.building.initPrimitives.bind(this.scene.building));
        buildingFolder.add(this.scene.building, 'windowPerFloor', 2, 8).step(1).name('Windows / Floor').onChange(this.scene.building.initPrimitives.bind(this.scene.building));

        this.gui.add(this.scene, 'displayPlane').name('Display Plane');
        this.gui.add(this.scene, 'displayFire').name('Display Fire');

        this.gui.add(this.scene, 'displayLake').name('Display Lake');
        const lakeFolder = this.gui.addFolder('Lake');
        lakeFolder.add(this.scene.lakePosition, '0', -200, 200).name('X Position');
        lakeFolder.add(this.scene.lakePosition, '2', -200, 200).name('Z Position');
        lakeFolder.add(this.scene.lakeSize, '0', 50, 200).step(1).name('Width');
        lakeFolder.add(this.scene.lakeSize, '2', 50, 200).step(1).name('Depth');

        this.gui.add(this.scene, 'displayForest').name('Display Forest');

        const forestFolder = this.gui.addFolder('Forest');
        forestFolder.add(this.scene.forest, 'rows', 1, 20).step(1).name('Rows').onChange(() => {
            this.scene.forest.initTrees();
            this.scene.fire.initFires();
        });
        forestFolder.add(this.scene.forest, 'cols', 1, 20).step(1).name('Cols').onChange(() => {
            this.scene.forest.initTrees();
            this.scene.fire.initFires();
        });
        forestFolder.add(this.scene.forestPosition, '0', -200, 200).name('X Position');
        forestFolder.add(this.scene.forestPosition, '2', -200, 200).name('Z Position');
        forestFolder.add(this.scene.forest, 'width', 50, 400).step(1).name('Width').onChange(() => {
            this.scene.forest.initTrees();
            this.scene.fire.initFires();
        });
        forestFolder.add(this.scene.forest, 'depth', 50, 400).step(1).name('Depth').onChange(() => {
            this.scene.forest.initTrees();
            this.scene.fire.initFires();
        });

        this.gui.add(this.scene, 'displayHeli').name('Display Heli');
        const heliFolder = this.gui.addFolder('Heli');
        heliFolder.add(this.scene.heli, 'speedFactor', 0.1, 3).step(0.1).name('SpeedFactor');
        
        const lightFolder = this.gui.addFolder('Light');
        lightFolder.add(this.scene.lights[0], 'enabled').name("Enabled").onChange(this.scene.lights[0].update.bind(this.scene.lights[0]));
        // a subfolder for grouping only the three coordinates of the light
        lightFolder.add(this.scene.lights[0].position, '0', -200,200).name("X Position").onChange(this.scene.lights[0].update.bind(this.scene.lights[0]));
        lightFolder.add(this.scene.lights[0].position, '1', -200, 200).name("Y Position").onChange(this.scene.lights[0].update.bind(this.scene.lights[0]));
        lightFolder.add(this.scene.lights[0].position, '2', -200, 200).name("Z Position").onChange(this.scene.lights[0].update.bind(this.scene.lights[0]));
        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.01, 1).name('Scale Factor');

        return true;
    }

    initKeys() {
        // create reference from the scene to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }

}