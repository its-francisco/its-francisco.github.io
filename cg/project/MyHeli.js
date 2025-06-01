import { CGFobject } from '../lib/CGF.js';
import { MyHalfSphere } from './MyHalfSphere.js';
import { MySphere } from './MySphere.js';
import { MyHalfCylinder } from './MyHalfCylinder.js';
import { MyCone } from './MyCone.js';
import { MyTriangle } from './MyTriangle.js';
import { MyUnitCubeQuad } from './MyUnitCubeQuad.js';
import { PI_2, pointInRectangle, to_radians } from './utilities.js';
import { MyBucket } from './MyBucket.js';

const HeliState = {
    UP: 0,
    DOWN: 1,
    CRUISE: 2,
    BACK: 3,
    STOP: 4,
    GETWATER: 5,
    DROPPING: 6,
    HOVERING: 7
};
const MIN_DISTANCE_TO_EXTINGUISH_FIRE_SQUARED = 100;

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);
        this.topHead = new MyHalfSphere(scene, 10, 10, 0, 1, 0, 0.5, 0);
        this.bottomHead = new MyHalfSphere(scene, 10, 10, 0, 1, 0.5, 1, 0);
        this.body = new MyHalfCylinder(scene, 15, 15);
        this.tail = new MyCone(scene, 10, 0, 1, 0, 1, {radius: 0.75, peakPosition:[0,9,-0.75]});
        this.tailPropellerTriangle = new MyTriangle(scene);
        this.tailPropellerSquare = new MyUnitCubeQuad(scene);
        this.maxH = 40;

        this.landingGear = new MyUnitCubeQuad(scene);
        this.propellerBlade = new MyUnitCubeQuad(scene);
        this.socket = new MySphere(scene, 10, 10, 0, 1, 0, 1, 0);
        this.bucket = new MyBucket(scene, 3, 10);

        this.openBucket = false; 

        this.heliportPos = this.scene.building.getHeliportAbsolutePosition();
        this.heliportPos = [this.heliportPos[0], this.heliportPos[1] + 1.2, this.heliportPos[2]];
        this.position = [...this.heliportPos];
        this.orientation = -Math.PI/2;
        this.velocity = [0,0,0];
        this.heliceRotation = 0;
        this.state = HeliState.STOP;
        this.speedFactor = 1.5;
        this.resistence = 0.02; 
        // angle to zx plane
        this.inclination = 0;
        this.accelerationInclinationStep = to_radians(5);
        this.maxInclination = to_radians(30);
        this.inclinationCorrectionStep = to_radians(1);
    }
    displayBody() {
        // top half of head
        this.scene.glassMaterial.apply(); 
        this.scene.pushMatrix();
        this.scene.scale(2,2,2);
        this.topHead.display();
        this.scene.popMatrix();

        this.scene.bodyMaterial.apply();

        // bottom half of head
        this.scene.pushMatrix();
        this.scene.scale(2,1.25,2);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.bottomHead.display();
        this.scene.popMatrix();

        // Top half of cylinder body
        this.scene.pushMatrix();
        this.scene.scale(2,2.01,3);
        this.body.display();
        this.scene.popMatrix();

        // Bottom half of cylinder body
        this.scene.pushMatrix();
        this.scene.scale(2,1.26,3);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.body.display();
        this.scene.popMatrix();

        // Top half of back of body
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(2,2,2);
        this.topHead.display();
        this.scene.popMatrix();

        // Bottom half of back of body
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 3);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(2,1.25,2);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.topHead.display();
        this.scene.popMatrix();

        this.scene.appearance.apply();
    }

    displayTail() {
        this.scene.bodyMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0.75, 4);
        this.scene.rotate(PI_2, 1, 0, 0);
        this.tail.display();
        this.scene.popMatrix();

        // Triangle + Square -> Trapezoid 
        this.scene.pushMatrix();
        this.scene.translate(0,2.5,10);
        this.scene.rotate(-3*PI_2, 0, 1, 0);

        this.scene.pushMatrix();
        this.tailPropellerTriangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.5, 0, 0);
        this.scene.scale(1,2,0.1);
        this.tailPropellerSquare.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.5, 0.5, 0.1)
        this.scene.rotate(this.heliceRotation, 0, 0, 1)
        this.displayBackPropeller();
        this.scene.popMatrix();

        this.scene.popMatrix();
        this.scene.appearance.apply();
    }

    displayLandingGear() {
        this.scene.metalMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1);

        // Big bars
        this.scene.pushMatrix();
        this.scene.translate(1.5, -1.75, 1);
        this.scene.scale(0.5,0.2,6);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.5, -1.75, 1);
        this.scene.scale(0.5,0.2,6);
        this.landingGear.display();
        this.scene.popMatrix();

        // Bent bars on ends of big bars
        this.scene.pushMatrix();
        this.scene.translate(1.5, -1.585, -2.45);
        this.scene.rotate(to_radians(20), 1, 0, 0);
        this.scene.scale(0.501,0.2,1);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1.5, -1.585, -2.45);
        this.scene.rotate(to_radians(20), 1, 0, 0);
        this.scene.scale(0.501,0.2,1);
        this.landingGear.display();
        this.scene.popMatrix();

        // Connecting bars
        this.scene.pushMatrix();
        this.scene.translate(-1, -1.25, -1);
        this.scene.rotate(to_radians(45), 0, 0, 1);
        this.scene.rotate(to_radians(90), 0, 1, 0);
        this.scene.scale(0.2,0.2,1.5);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-1, -1.25, 2);
        this.scene.rotate(to_radians(45), 0, 0, 1);
        this.scene.rotate(to_radians(90), 0, 1, 0);
        this.scene.scale(0.2,0.2,1.5);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, -1.25, 2);
        this.scene.rotate(to_radians(-45), 0, 0, 1);
        this.scene.rotate(to_radians(90), 0, 1, 0);
        this.scene.scale(0.2,0.2,1.5);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1, -1.25, -1);
        this.scene.rotate(to_radians(-45), 0, 0, 1);
        this.scene.rotate(to_radians(90), 0, 1, 0);
        this.scene.scale(0.2,0.2,1.5);
        this.landingGear.display();
        this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.appearance.apply();
    }

    displayBlade() {
        this.scene.pushMatrix();
        this.scene.scale(0.2,0.1,12);
        this.propellerBlade.display();
        this.scene.popMatrix();
    }

    displayTopPropeller() {
        this.scene.metalMaterial.apply();
        
        this.displayBlade();
        
        this.scene.pushMatrix();
        this.scene.rotate(PI_2, 0, 1, 0);
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.appearance.apply();

        this.scene.pushMatrix();
        this.scene.scale(0.4,0.2,0.4);
        this.socket.display();
        this.scene.popMatrix();
    }

    displayBackPropeller() {
        this.scene.metalMaterial.apply();
        this.scene.pushMatrix();
        this.scene.rotate(PI_2, 1, 0, 0);
        this.scene.scale(0.2,0.2,0.2);

        this.scene.pushMatrix();
        this.scene.scale(2,2,1);
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(PI_2, 0, 1, 0);
        this.scene.scale(2,2,1);
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.appearance.apply();

        this.scene.pushMatrix();
        this.scene.scale(0.4,0.4,0.4);
        this.socket.display();
        this.scene.popMatrix();
        this.scene.popMatrix();
    }

    displayBucket() {
        this.scene.pushMatrix();
        this.scene.translate(0, -10, 2);
        this.bucket.display();
        this.scene.popMatrix();
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(...this.position);
        this.scene.rotate(this.orientation, 0, 1, 0);
        this.scene.rotate(this.inclination, 0, 0, 1);
        this.scene.rotate(-PI_2, 0, 1, 0);
        this.scene.scale(10 / 16, 10 / 16, 10 / 16); // Make it ~10units length 
       
        this.displayBody();

        this.displayTail();

        this.displayLandingGear();

        this.scene.pushMatrix();
        this.scene.translate(0,1.8,1.5);
        this.scene.scale(0.8,0.6,1);
        this.topHead.display();
        this.scene.popMatrix();
        
        this.scene.pushMatrix();
        this.scene.translate(0, 2.35, 1.5);
        this.scene.rotate(this.heliceRotation, 0, 1, 0)
        this.displayTopPropeller();
        this.scene.popMatrix();

        if (this.openBucket) this.displayBucket();
        this.scene.popMatrix();
    }
    
    update(delta_t) {
        if (this.state == HeliState.STOP) {
            this.inclination = 0;
            return;
        }
        this.heliceRotation += 0.3;
        if (this.state == HeliState.HOVERING) return;
        if (this.state == HeliState.UP && this.position[1] >= this.maxH) {
            this.position[1] = this.maxH;
            this.state = HeliState.CRUISE;
            this.openBucket = true;
            this.scene.building.heliportStopManeuver();
        }
        if (this.state == HeliState.DOWN && (this.position[1]-1 <= this.heliportPos[1])) {
            this.position = [...this.heliportPos]
            this.state = HeliState.STOP;
            this.velocity = [0,0,0]
            this.scene.building.heliportStopManeuver();
        }
        if (this.state == HeliState.GETWATER && (this.position[1] - 1 <= 8)) {
            this.position[1] = 8; 
            this.state = HeliState.HOVERING;
            this.velocity = [0, 0, 0]
            this.bucket.waterFull = true;
        }
        if (this.state == HeliState.BACK && (Math.round(this.position[0]) == Math.round(this.heliportPos[0]) && Math.round(this.position[2]) == Math.round(this.heliportPos[2]))) {
            this.state = HeliState.DOWN;
            this.openBucket = false;
            this.scene.building.heliportDownManeuver();
        }
        if (this.state == HeliState.UP) this.position[1] += 0.5;
        else if (this.state == HeliState.DOWN || this.state == HeliState.GETWATER) this.position[1] -= 0.5; 
        else if (this.state == HeliState.CRUISE || this.state == HeliState.DROPPING) {
            this.velocity[0] *= (1 - this.resistence);
            this.velocity[1] *= (1 - this.resistence);
            this.velocity[2] *= (1 - this.resistence);
        }
        if (this.state == HeliState.CRUISE || this.state == HeliState.BACK || this.state == HeliState.DROPPING) {
            this.position[0] += this.velocity[0] * delta_t;
            this.position[1] += this.velocity[1] * delta_t;
            this.position[2] += this.velocity[2] * delta_t;

            if (Math.sign(this.inclination) > 0 && this.inclination < this.inclinationCorrectionStep) this.inclination = 0;
            else this.inclination -= Math.sign(this.inclination) * this.inclinationCorrectionStep;
        }
        if (this.state == HeliState.DROPPING) {
            if (this.scene.shower.isOver()) {
                this.state = HeliState.CRUISE;
                this.bucket.waterFull = false;
                this.overFiresIds = [];
                this.scene.shower.reset();
            }
            else {
                let tip = vec3.fromValues(0, -13, 2);
                let modelMatrix = mat4.create();

                // Apply bucket transformations to the tip of the bucket
                mat4.translate(modelMatrix, modelMatrix, this.position);
                mat4.rotateY(modelMatrix, modelMatrix, this.orientation);
                mat4.rotateZ(modelMatrix, modelMatrix, this.inclination);
                mat4.rotateY(modelMatrix, modelMatrix, -Math.PI / 2);
                mat4.scale(modelMatrix, modelMatrix, [10 / 16, 10 / 16, 10 / 16]);

                let realTip = vec3.create();
                vec3.transformMat4(realTip, tip, modelMatrix);

                this.scene.shower.initDroplet(...realTip);
                this.scene.shower.initDroplet(...realTip);
                const fires = this.scene.shower.extinguishFire(this.scene.fire.fireSpotCoords, 
                    this.scene.forestPosition[0], this.scene.forestPosition[2], MIN_DISTANCE_TO_EXTINGUISH_FIRE_SQUARED);
                if (fires.length > 0) {
                    this.scene.fire.extinguish(fires);
                }
            }
        }
    }

    accelerate(v) {
        v *= this.speedFactor;
        if (this.state == HeliState.CRUISE || this.state == HeliState.DROPPING) {
            this.inclination -= this.accelerationInclinationStep * Math.sign(v);
            if (this.inclination > this.maxInclination) {
                this.inclination = this.maxInclination;
            }
            else if (this.inclination < -this.maxInclination) {
                this.inclination = -this.maxInclination;
            }
           
            let [x, y, z] = this.velocity;

            const magnitude = Math.sqrt(x * x + z * z);

            let dirX, dirZ;
            if (magnitude === 0) {
                dirX = Math.cos(this.orientation);
                dirZ = -Math.sin(this.orientation);
            }
            else {
                dirX = x / magnitude;
                dirZ = z / magnitude;
            }
            
            const newMagnitude = magnitude + v;
            let newX, newZ;
            if (magnitude*newMagnitude < 0 || (magnitude == 0 && newMagnitude <0)) {
                newX = 0;
                newZ = 0;
            }
            else {
                newX = dirX * newMagnitude;
                newZ = dirZ * newMagnitude;
            }

            this.velocity = [newX, y, newZ];
        }
    }

    turn(v) {
        v *= this.speedFactor;
        if (this.state == HeliState.CRUISE || this.state == HeliState.DROPPING) {
            this.orientation += v;

            const [x, y, z] = this.velocity;

            const cos = Math.cos(v);
            const sin = Math.sin(v);

            const newX = x * cos + z * sin;
            const newZ = -x * sin + z * cos;

            this.velocity = [newX, y, newZ];
        }
    }
    up() {
        if (this.state == HeliState.CRUISE) return;
        this.velocity = [0,0,0];
        if (this.state == HeliState.STOP || this.state == HeliState.DOWN) {
            this.scene.building.heliportUpManeuver();
        }
        this.state = HeliState.UP;
    }
    down() {
        // stoped and above lake
        if (this.velocity.every((e) => e == 0) && pointInRectangle([this.position[0], this.position[2]], this.scene.lakePosition, this.scene.lakeSize)) {
            this.state = HeliState.GETWATER;
            this.inclination = 0;
        }
        else if (this.position[0] != this.heliportPos[0] || this.position[2] != this.heliportPos[2]) {
            const directionX = this.heliportPos[0] - this.position[0];
            const directionZ = this.heliportPos[2] - this.position[2];

            const magnitude = Math.sqrt(directionX * directionX + directionZ * directionZ);
            if (magnitude !== 0) {
                const normalizedDirectionX = directionX / magnitude;
                const normalizedDirectionZ = directionZ / magnitude;
                this.orientation = Math.atan2(-normalizedDirectionZ, normalizedDirectionX);
                const speed = 0.01; 
                this.velocity = [
                    normalizedDirectionX * speed, 
                    this.velocity[1],             
                    normalizedDirectionZ * speed 
                ];
            }
            this.state = HeliState.BACK;
        }
        else if (this.position[1] == this.heliportPos[1]) return;
        else {
            this.state = HeliState.DOWN;
            this.scene.building.heliportDownManeuver();
            this.openBucket = false;
        }
    }
    drop() {
        if (this.state == HeliState.DROPPING) return;
        
        if (!this.bucket.waterFull) return;
        const overFires = this.scene.fire.fireSpotCoords.reduce((indices, fireSpot, index) => {
            // heli is over a fire if inside radius 10
            const [x, z] = fireSpot;
            const real_x = x + this.scene.forestPosition[0];
            const real_z = z + this.scene.forestPosition[2];
            const distance = Math.pow(this.position[0] - real_x, 2) + Math.pow(this.position[2] - real_z, 2);
            if (distance < MIN_DISTANCE_TO_EXTINGUISH_FIRE_SQUARED) {
                indices.push(index);
            }
            return indices;
        }, []);
        if (overFires.length == 0) return;
        this.droplets = 40;
        this.state = HeliState.DROPPING;
        this.scene.shower.start()
    }
    reset() {
        this.position = [...this.heliportPos];
        this.orientation = - Math.PI / 2;
        this.velocity = [0,0,0];
        this.scene.building.heliportStopManeuver();
        this.openBucket = false;
        this.waterFull = false;
        this.state = HeliState.STOP;
    }
}