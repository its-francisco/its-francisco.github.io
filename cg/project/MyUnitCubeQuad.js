import { CGFobject } from '../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
import { to_radians } from './utilities.js';
/**
 * MyUnitCubeQuad
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
	constructor(scene, top = null, front = null, right = null, back = null, left = null, bottom = null) {
		super(scene);
		this.face = new MyQuad(scene);
		this.top = top;
		this.front = front;
		this.right = right;
		this.back = back;
		this.left = left;
		this.bottom = bottom;
	}

	display() {
		//front face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, 0.5);
		if (this.front) {
			this.front.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		} 
		this.face.display();
		if (this.front) this.front.unbind();
		this.scene.popMatrix();
		//back face
		this.scene.pushMatrix();
		this.scene.translate(0, 0, -0.5);
		this.scene.rotate(Math.PI, 0, 1, 0);
		if (this.back) {
			this.back.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		}
		this.face.display();
		if (this.back) this.back.unbind();
		this.scene.popMatrix();

		//top face
		this.scene.pushMatrix();
		this.scene.translate(0, 0.5, 0);
		this.scene.rotate(to_radians(-90), 1, 0, 0);
		if (this.top) {
			this.top.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST); 
		}
		this.face.display();
		if (this.top) this.top.unbind();
		this.scene.popMatrix();

		//bottom face
		this.scene.pushMatrix();
		this.scene.translate(0, -0.5, 0);
		this.scene.rotate(to_radians(90), 1, 0, 0);
		if (this.bottom) {
			this.bottom.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		}
		this.face.display();
		if (this.bottom) this.bottom.unbind();
		this.scene.popMatrix();

		//left face
		this.scene.pushMatrix();
		this.scene.translate(-0.5, 0, 0);
		this.scene.rotate(to_radians(-90), 0, 1, 0);
		if (this.left) {
			this.left.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		}
		this.face.display();
		if (this.left) this.left.unbind();
		this.scene.popMatrix();

		//right face
		this.scene.pushMatrix();
		this.scene.translate(0.5, 0, 0);
		this.scene.rotate(to_radians(90), 0, 1, 0);
		if (this.right) {
			this.right.bind();
			this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
		}
		this.face.display();
		if (this.right) this.right.unbind();
		this.scene.popMatrix();

	}

}

