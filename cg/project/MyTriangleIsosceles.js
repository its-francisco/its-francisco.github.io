import { CGFobject } from '../lib/CGF.js';
/**
 * MyTriangleIsosceles
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTriangleIsosceles extends CGFobject {
    constructor(scene, nrDivs) {
        super(scene);
        this.initBuffers();
        // nrDivs = 1 if not provided
		nrDivs = typeof nrDivs !== 'undefined' ? nrDivs : 1;
		this.nrDivs = nrDivs;    
        this.patchLength = 1.0 / nrDivs;
    }

    initBuffers() {
        this.vertices = [
            -1, 0, 0, //0
            0, 0, 0, //1
            -0.5, 0.5, 0, //2            
            1, 0, 0, //3
            0.5, 0.5, 0, //4
            0, 1, 0, //5

            -1, 0, 0, //0
            0, 0, 0, //1
            -0.5, 0.5, 0, //2            
            1, 0, 0, //3
            0.5, 0.5, 0, //4
            0, 1, 0, //5
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0, 1, 2,
            1, 3, 4,
            2, 4, 5,
            1, 4, 2,

            2,1,0,
            4,3,1,
            5,4,2,
            2,4,1
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
        ]
        this.texCoords = [
            0, 1,
            0.5, 1,
            0.25, 0.5,
            1, 1,
            0.75, 0.5,
            0.5, 0,
        ]
        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

