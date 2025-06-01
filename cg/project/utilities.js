export function to_radians(gra) {
    return (Math.PI * gra) / 180
}

export const PI_2 = Math.PI / 2;

export function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

export const matrixRotateZaxis = (alpha) => {
    const cosA = Math.cos(alpha);
    const sinA = Math.sin(alpha);
    return [
        cosA, 
        sinA, 
        0, 
        0,

        -sinA, 
        cosA, 
        0, 
        0,

        0, 
        0, 
        1, 
        0,         
        
        0, 
        0, 
        0, 
        1,          
    ];
}
export const matrixRotateXaxis = (alpha) => {
    const cosA = Math.cos(alpha);
    const sinA = Math.sin(alpha);
    return [
        1,
        0,
        0,
        0,

        0,
        cosA, 
        sinA, 
        0,

        0,
        -sinA, 
        cosA, 
        0,       
        
        0, 
        0, 
        0, 
        1,          
    ];
}

export const matrixRotateYaxis = (alpha) => {
    const cosA = Math.cos(alpha);
    const sinA = Math.sin(alpha);
    return [
        cosA, 
        0,
        -sinA, 
        0,
        
        0, 
        1,
        0, 
        0,      

        sinA, 
        0,
        cosA, 
        0,

        
        0, 
        0, 
        0, 
        1,          
    ];
}

export const multMatrixes = (m1, m2, dim1=[4,4], dim2=[4,4]) => {
    const [rows1, cols1] = dim1;
    const cols2 = dim2[1];
    const res = new Array(rows1 * cols2).fill(0);
    for (let i = 0; i < rows1; i++) {
        for (let j = 0; j < cols2; j++) {
            let temp = 0;
            for (let k = 0; k < cols1; k++) {
                temp += m1[k * rows1 + i] * m2[j * cols1 + k]; // Column-major multiplication
            }
            res[j * rows1 + i] = temp; // Store in column-major order
        }
    }

    return res;
}

export const crossProduct3D = (v1, v2) => {
    return [
        v1[1] * v2[2] - v1[2] * v2[1],
        v1[2] * v2[0] - v1[0] * v2[2],
        v1[0] * v2[1] - v1[1] * v2[0]
    ];
}

export const normalize = (v) => {
    const length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
    return length > 0 ? [v[0] / length, v[1] / length, v[2] / length] : [0, 0, 0];
}

export const pointInRectangle = ([px, pz], [x, y, z], [xSize, ySize, zSize]) => {
    const halfX = xSize / 2;
    const halfZ = zSize / 2;
    return (
        px >= x - halfX && px <= x + halfX &&
        pz >= z - halfZ && pz <= z + halfZ
    );
}