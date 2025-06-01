import { CGFscene, CGFcamera, CGFaxis, CGFshader, CGFtexture, CGFappearance } from "../lib/CGF.js";
import { MyBuilding } from "./MyBuilding.js";
import { MyPanorama } from "./MyPanorama.js";
import { MyPlane } from "./MyPlane.js";
import { MyForest } from "./MyForest.js";
import { MyHeli } from "./MyHeli.js";
import { MyFire } from "./MyFire.js";
import { MyShower } from "./MyShower.js";
import { MyLake } from "./MyLake.js";
import { PI_2 } from "./utilities.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();
    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.delta_t_ms = 50;
    this.prev_t = 0;

    this.setUpdatePeriod(this.delta_t_ms);

    this.appearance = new CGFappearance(this);
    this.appearance.setAmbient(0.1, 0.1, 0.1, 1);
    this.appearance.setDiffuse(0.9, 0.9, 0.9, 1);
    this.appearance.setSpecular(0.1, 0.1, 0.1, 1);
    this.appearance.setShininess(10.0);

    this.initTextures();
    this.initShaders();
    this.initMaterials();
    //Initialize scene objects
    this.axis = new CGFaxis(this);
    this.plane = new MyPlane(this, 100, 0, 10, 0, 10);
    this.panorama = new MyPanorama(this, this.globeTexture);

    //Objects connected to MyInterface
    this.displayAxis = false;
    this.scaleFactor = 0.6;
    this.displayPlane = true;
    this.displayPanorama = true;
    this.displayBuilding = true;
    this.displayForest = true;
    this.displayHeli = true;
    this.displayFire = true;
    this.displayLake = true;
    this.forestPosition = [-150, 0, 0];
    this.lakePosition = [80, 0.2, -50];
    this.lakeSize = [ 100, 70, 150 ];
    this.buildingPosition = [-80, 0, -100];

    this.building = new MyBuilding(this, 40, 4, 3, [0.5, 0.5, 0.5],
      { relativeLateralModuleDepth: 0.5, relativeLateralModuleWidth: 0.75, windowSizeRatio: 1 / 2.4, floorSize: 5 });
    this.forest = new MyForest(this, 150, 200, 15, 16

    );
    this.fire = new MyFire(this, this.forest);
    this.shower = new MyShower(this);
    this.heli = new MyHeli(this);
    this.lake = new MyLake(this);
  }
  initLights() {
    this.lights[0].setPosition(200, 200, 200, 1);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].update();
  }
  initCameras() {
    this.camera = new CGFcamera(
      0.7,
      0.1,
      1000,
      vec3.fromValues(0, 30, 90),
      vec3.fromValues(0, 0, 0)
    );
  }
  checkKeys() {
    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      this.heli.accelerate(0.001);
    }
    if (this.gui.isKeyPressed("KeyS")) {
      this.heli.accelerate(-0.001);
    }
    if (this.gui.isKeyPressed("KeyA")) {
      this.heli.turn(0.1);
    }
    if (this.gui.isKeyPressed("KeyD")) {
      this.heli.turn(-0.1);
    }
    if (this.gui.isKeyPressed("KeyP")) {
      this.heli.up();
    }
    if (this.gui.isKeyPressed("KeyL")) {
      this.heli.down();
    }
    if (this.gui.isKeyPressed("KeyR")) {
      this.heli.reset();
    }
    if (this.gui.isKeyPressed("KeyO")) {
      this.heli.drop();
    }
  }

  update(t) {
    this.checkKeys();
    this.heli.update(t - this.prev_t);
    this.waterShader.setUniformsValues({ timeFactor: t / 30 % 1000 });
    this.heliShader.setUniformsValues({ timeFactor: t / 10 % 1000, u_mixFactor: Math.abs(Math.sin(t/300))  % 1 });
    this.fireShader.setUniformsValues({ timeFactor: (t / 300) % 360 });
    this.building.update(t - this.prev_t);
    this.shower.update(t - this.prev_t);
    this.prev_t = t;
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  display() {
    // ---- BEGIN Background, camera and axis setup
    // Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    // Initialize Model-View matrix as identity (no transformation
    this.updateProjectionMatrix();
    this.loadIdentity();
    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    this.lights[0].update();
    // Draw axis
    if (this.displayAxis) this.axis.display();
    
    this.setDefaultAppearance();
    
    
    // Display the panorama and the plane
    if (this.displayPanorama) {
      this.panorama.display();
    }
    if (this.displayPlane) {
      this.pushMatrix();
      this.grassMaterial.apply();
      this.scale(400, 1, 400);
      this.rotate(-PI_2, 1, 0, 0);
      this.plane.display();
      this.popMatrix();
      this.appearance.apply();
    }
    
    // Scaling scene objects
    const sca = [
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      this.scaleFactor,
      0.0,
      0.0,
      0.0,
      0.0,
      1.0,
    ];

    this.multMatrix(sca);

    if (this.displayBuilding) {
      this.pushMatrix();
      this.translate(...this.buildingPosition);
      this.building.display();
      this.popMatrix();
    }
    if (this.displayForest) {
      this.pushMatrix();
      this.translate(...this.forestPosition);
      this.forest.display();
      this.popMatrix();
      this.appearance.apply();
    } 
    if (this.displayFire) {
      this.pushMatrix();
      this.translate(...this.forestPosition);
      this.setActiveShader(this.fireShader);
      this.fireShape.bind(1);
      this.fire.display();
      this.setActiveShader(this.defaultShader);
      this.popMatrix();
      this.appearance.apply();
    }
    if (this.displayLake) {
      this.pushMatrix();
      this.translate(...this.lakePosition);
      this.scale(...this.lakeSize);
      this.rotate(-Math.PI / 2, 1, 0, 0);
      this.lake.display();
      this.popMatrix();
      this.appearance.apply();
    }
    if (this.displayHeli) {
      this.pushMatrix();
      this.heli.display();
      this.popMatrix();
      this.appearance.apply();
    }
    this.shower.display();
  }

  // Display an object with transparency
  transparentDisplay(object) {
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFuncSeparate(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA, this.gl.ONE, this.gl.ONE);
    object.display();
    this.gl.disable(this.gl.BLEND);
  }

  // Initialize all textures
  initTextures() {
    this.globeTexture = new CGFtexture(this, "textures/panorama.jpg");
    this.grassTexture = new CGFtexture(this, "textures/grass.jpg");
    this.windowTexture = new CGFtexture(this, "textures/window.png");
    this.doorTexture = new CGFtexture(this, "textures/door.png");
    this.heliportTexture = new CGFtexture(this, "textures/heli_h.png");
    this.heliportUpTexture = new CGFtexture(this, "textures/heli_up.png");
    this.heliportDownTexture = new CGFtexture(this, "textures/heli_down.png");
    this.signTexture = new CGFtexture(this, "textures/sign.png");
    this.trunkTexture = new CGFtexture(this, "textures/trunk.png");
    this.foliageTexture = new CGFtexture(this, "textures/foliage.jpg");
    this.metalTexture = new CGFtexture(this, "textures/metal.jpg");
    this.glassTexture = new CGFtexture(this, "textures/glass.jpg");
    this.waterTexture = new CGFtexture(this, 'textures/seamlessLake.png');
    this.bumpTextureWater = new CGFtexture(this, "textures/waterMap.jpg");
    this.waterShape = new CGFtexture(this, "textures/lakeShape2.png");
    this.waterfallTexture = new CGFtexture(this, "textures/splash6.png");
    this.fireShape = new CGFtexture(this, "textures/fire_shape2.png");
    this.plasticTexture = new CGFtexture(this, "textures/plastic.png");
    this.fireTexture1 = new CGFtexture(this, "textures/fire1.png");
    this.fireTexture2 = new CGFtexture(this, "textures/fire2.png");
    this.fireTexture3 = new CGFtexture(this, "textures/fire3.png");
    this.wallTexture = new CGFtexture(this, "textures/building.png");
  }

  // Initialize all shaders
  initShaders() {
    this.waterShader = new CGFshader(this.gl, "shaders/water.vert", "shaders/water.frag");
    this.waterShader.setUniformsValues({ uSampler3: 2, uSampler2: 1 });

    this.fireShader = new CGFshader(this.gl, "shaders/fire.vert", "shaders/fire.frag");
    this.fireShader.setUniformsValues({
      uSampler2: 1
  });

    this.heliShader = new CGFshader(this.gl, "shaders/heli.vert", "shaders/heli.frag");
    this.heliShader.setUniformsValues({ uSampler2: 1, timeFactor: 0, u_mixFactor: 0 });

    this.waterfallShader = new CGFshader(this.gl, "shaders/waterfall.vert", "shaders/waterfall.frag");
    this.waterfallShader.setUniformsValues({ timeFactor: 0 });
  }

  // Initialize all materials
  initMaterials() {
    this.grassMaterial = new CGFappearance(this);
    this.grassMaterial.setAmbient(0.1, 0.1, 0.1, 1);
    this.grassMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.grassMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.grassMaterial.setShininess(10.0);
    this.grassMaterial.setTexture(this.grassTexture);
    this.grassMaterial.setTextureWrap('MIRRORED_REPEAT', 'MIRRORED_REPEAT');

    this.plasticMaterial = new CGFappearance(this);
    this.plasticMaterial.setAmbient(0.5, 0.5, 0.5, 1);
    this.plasticMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
    this.plasticMaterial.setSpecular(0.7, 0.7, 0.7, 1);
    this.plasticMaterial.setShininess(51.0);
    this.plasticMaterial.setTexture(this.plasticTexture);
    this.plasticMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.heliMaterial = new CGFappearance(this);
    this.heliMaterial.setAmbient(1, 1, 1, 1);
    this.heliMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
    this.heliMaterial.setSpecular(0.7, 0.7, 0.7, 1);
    this.heliMaterial.setShininess(51.0);
    this.heliMaterial.setEmission(0.2, 0.2, 0.2, 1);

    this.fireMaterial = new CGFappearance(this);
    this.fireMaterial.setAmbient(1, 1, 1, 1);
    this.fireMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
    this.fireMaterial.setSpecular(0.7, 0.7, 0.7, 1);
    this.fireMaterial.setShininess(51.0);
    this.fireMaterial.setEmission(1, 1, 1, 1);
    this.fireMaterial.setTexture(this.fireTexture1);
    this.fireMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.metalMaterial = new CGFappearance(this);
    this.metalMaterial.setAmbient(0.5, 0.5, 0.5, 1);
    this.metalMaterial.setDiffuse(0.5, 0.5, 0.5, 1);
    this.metalMaterial.setSpecular(0.5, 0.5, 0.5, 1);
    this.metalMaterial.setShininess(51.0);
    this.metalMaterial.setTexture(this.metalTexture);
    this.metalMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.bodyMaterial = new CGFappearance(this);
    this.bodyMaterial.setAmbient(0.5, 0, 0, 1);
    this.bodyMaterial.setDiffuse(0.5, 0, 0, 1);
    this.bodyMaterial.setSpecular(0.5, 0, 0, 1);
    this.bodyMaterial.setShininess(51.0);
    this.bodyMaterial.setTexture(this.metalTexture);
    this.bodyMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.glassMaterial = new CGFappearance(this);
    this.glassMaterial.setAmbient(0.7, 0.7, 0.7, 1);
    this.glassMaterial.setDiffuse(0.7, 0.7, 0.7, 1);
    this.glassMaterial.setSpecular(0.9, 0.9, 0.9, 1);
    this.glassMaterial.setShininess(150.0);
    this.glassMaterial.setTexture(this.glassTexture);
    this.glassMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.lightOffMaterial = new CGFappearance(this);
    this.lightOffMaterial.setAmbient(0.2, 0.2, 0, 1);
    this.lightOffMaterial.setDiffuse(0.2, 0.2, 0, 1);
    this.lightOffMaterial.setSpecular(0.2, 0.2, 0, 1);
    this.lightOffMaterial.setEmission(0.0, 0.0, 0.0, 1);
    this.lightOffMaterial.setShininess(10.0);

    this.lightOnMaterial = new CGFappearance(this);
    this.lightOnMaterial.setAmbient(0.2, 0.2, 0, 1);
    this.lightOnMaterial.setDiffuse(0.2, 0.2, 0, 1);
    this.lightOnMaterial.setSpecular(0.2, 0.2, 0, 1);
    this.lightOnMaterial.setEmission(0.2, 0.2, 0.2, 1);
    this.lightOnMaterial.setShininess(10.0); 

    this.waterMaterial = new CGFappearance(this);
    this.waterMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.waterMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.waterMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.waterMaterial.setShininess(10.0);
    this.waterMaterial.setTexture(this.waterTexture);
    this.grassMaterial.setTextureWrap('MIRRORED_REPEAT', 'MIRRORED_REPEAT');

    this.waterfallMaterial = new CGFappearance(this);
    this.waterfallMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.waterfallMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.waterfallMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.waterfallMaterial.setShininess(10.0);
    this.waterfallMaterial.setTexture(this.waterfallTexture);
    this.waterfallMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.panoramaMaterial = new CGFappearance(this);
    this.panoramaMaterial.setAmbient(0.0, 0.0, 0.0, 1);
    this.panoramaMaterial.setDiffuse(0.0, 0.0, 0.0, 1);
    this.panoramaMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.panoramaMaterial.setEmission(1.0, 1.0, 1.0, 1);
    this.panoramaMaterial.setShininess(10.0);
    this.panoramaMaterial.setTexture(this.globeTexture);
    this.panoramaMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.trunkMaterial = new CGFappearance(this);
    this.trunkMaterial.setAmbient(0.3, 0.16, 0.12, 1);
    this.trunkMaterial.setDiffuse(0.3, 0.16, 0.12, 1);
    this.trunkMaterial.setSpecular(0.3, 0.16, 0.12, 1);
    this.trunkMaterial.setShininess(10.0);
    this.trunkMaterial.setTexture(this.trunkTexture);
    this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.treeMaterial = new CGFappearance(this);
    this.treeMaterial.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.treeMaterial.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.treeMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.treeMaterial.setShininess(10.0);
    this.treeMaterial.setTexture(this.foliageTexture);
    this.treeMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.windowMaterial = new CGFappearance(this);
    this.windowMaterial.setAmbient(0.0, 0.0, 0.0, 1);
    this.windowMaterial.setDiffuse(0.0, 0.0, 0.0, 1);
    this.windowMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.windowMaterial.setEmission(1.0, 1.0, 1.0, 1);
    this.windowMaterial.setShininess(10.0);
    this.windowMaterial.setTexture(this.windowTexture);

    this.buildingMaterial = new CGFappearance(this);
    this.buildingMaterial.setAmbient(0.0, 0.0, 0.0, 1);
    this.buildingMaterial.setDiffuse(0.0, 0.0, 0.0, 1);
    this.buildingMaterial.setSpecular(0.0, 0.0, 0.0, 1);
    this.buildingMaterial.setShininess(10.0);
    this.buildingMaterial.setTexture(this.wallTexture); 
    this.buildingMaterial.setTextureWrap('REPEAT', 'REPEAT');
  }
}
