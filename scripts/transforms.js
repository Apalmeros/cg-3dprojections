// set values of mat4x4 to the parallel projection / view matrix
function Mat4x4Parallel(mat4x4, prp, srp, vup, clip) {
    // 1. translate PRP to origin
        var translatePRP = new Matrix(4,4);
        Mat4x4Translate(translatePRP, -prp.x, -prp.y, -prp.z);
        
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
        var n_axis = new Vector(3);
        n_axis = prp.subtract(srp);
        n_axis.normalize();
        var u_axis = new Vector(3);
        u_axis = vup.cross(n_axis);
        u_axis.normalize();
        var v_axis = new Vector(3);
        v_axis = n_axis.cross(u_axis);
        
        var rotateVRC = new Matrix(4,4);
        rotateVRC.values = [[u_axis.x, u_axis.y, u_axis.z, 0],
                            [v_axis.x, v_axis.y, v_axis.z, 0],
                            [n_axis.x, n_axis.y, n_axis.z, 0],
                            [0, 0, 0, 1]];
                            
    // 3. shear such that CW is on the z-axis
        var cw = new Vector(3);
        cw.values = [(clip[0] + clip[1])/2, (clip[2] + clip[3])/2, -clip[4]];
        var dop = new Vector(3);
        var orig = Vector3(0, 0, 0);
        dop = cw.subtract(orig);
        dop.normalize();
        var shX = (-dop.x / dop.z);
        var shY = (-dop.y / dop.z);
        var shearCW = new Matrix(4,4);
        Mat4x4ShearXY(shearCW, shX, shY);
        
    // 4. translate near clipping plane to origin
        var translateNear = new Matrix(4,4);
        var final4 = Mat4x4Translate(translateNear, 0, 0, clip[4]);
        
    // 5. scale such that view volume bounds are ([-1,1], [-1,1], [-1,0])
        var sparX = 2 / (clip[1] - clip[0]);
        var sparY = 2 / (clip[3] - clip[2]);
        var sparZ = 1 / clip[5];
        var scaleVV = new Matrix(4,4);
        Mat4x4Scale(scaleVV, sparX, sparY, sparZ);

    // ...
    // var transform = Matrix.multiply([...]);
    // mat4x4.values = transform.values;
    //
        var transform = Matrix.multiply([scaleVV, translateNear, shearCW, rotateVRC, translatePRP]);
        mat4x4.values = transform.values;
}

// set values of mat4x4 to the perspective projection / view matrix
function Mat4x4Projection(mat4x4, prp, srp, vup, clip) {
    // 1. translate PRP to origin
        var translatePRP = new Matrix(4,4);
        Mat4x4Translate(translatePRP, -prp.x, -prp.y, -prp.z);
        
    // 2. rotate VRC such that (u,v,n) align with (x,y,z)
        var n_axis = new Vector(3);
        n_axis = prp.subtract(srp);
        n_axis.normalize();
        var u_axis = new Vector(3);
        u_axis = vup.cross(n_axis);
        u.axis.normalize();
        var v_axis = new Vector(3);
        v_axis = n_axis.cross(u_axis);
        
        var rotateVRC = new Matrix(4,4);
        rotateVRC.values = [[u_axis.x, u_axis.y, u_axis.z, 0],
                            [v_axis.x, v_axis.y, v_axis.z, 0],
                            [n_axis.x, n_axis.y, n_axis.z, 0],
                            [0, 0, 0, 1]];
                            
    // 3. shear such that CW is on the z-axis
        var cw = new Vector(3);
        cw.values = [(clip[0] + clip[1])/2, (clip[2] + clip[3])/2];
        var dop = new Vector(3);
        var orig = Vector3(0, 0, 0);
        dop = cw.subtract(orig);
        dop.normalize();
        var shX = (-dop.x / dop.z);
        var shY = (-dop.y / dop.z);
        var shearCW = new Matrix(4,4);
        Mat4x4ShearXY(shearCW, shX, shY);
        
    // 4. scale such that view volume bounds are ([z,-z], [z,-z], [-1,zmin])
        var sperX = (2 * clip[4]) / ((clip[1] - clip[0]) * clip[5]);
        var sperY = (2 * clip[4]) / ((clip[3] - clip[2]) * clip[5]);
        var sperZ = 1 / clip[5];
        var scaleVV = new Matrix(4,4);
        Mat4x4Scale(scaleVV, sparX, sparY, sparZ);

    // ...
    // var transform = Matrix.multiply([...]);
    // mat4x4.values = transform.values;
        var transform = Matrix.mulitply([scaleVV, shearCW, rotateVRC, translatePRP]);
        mat4x4.values = transform.values;
}

// set values of mat4x4 to project a parallel image on the z=0 plane
function Mat4x4MPar(mat4x4) {
    // mat4x4.values = ...; conversions from 3d to 2d
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 1],
                     [0, 0, 0, 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to project a perspective image on the z=-1 plane
function Mat4x4MPer(mat4x4) {
    // mat4x4.values = ...;
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, -1, 0]];
}



///////////////////////////////////////////////////////////////////////////////////
// 4x4 Transform Matrices                                                         //
///////////////////////////////////////////////////////////////////////////////////

// set values of mat4x4 to the identity matrix
function Mat4x4Identity(mat4x4) {
    mat4x4.values = [[1, 0, 0, 0],
                     [0, 1, 0, 0],
                     [0, 0, 1, 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the translate matrix
function Mat4x4Translate(mat4x4, tx, ty, tz) {
    mat4x4.values = [[1, 0, 0, tx],
                     [0, 1, 0, ty],
                     [0, 0, 1, tz],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the scale matrix
function Mat4x4Scale(mat4x4, sx, sy, sz) {
    mat4x4.values = [[sx,  0,  0, 0],
                     [ 0, sy,  0, 0],
                     [ 0,  0, sz, 0],
                     [ 0,  0,  0, 1]];
}

// set values of mat4x4 to the rotate about x-axis matrix
function Mat4x4RotateX(mat4x4, theta) {
    mat4x4.values = [[1,               0,                0, 0],
                     [0, Math.cos(theta), -Math.sin(theta), 0],
                     [0, Math.sin(theta),  Math.cos(theta), 0],
                     [0,               0,                0, 1]];
}

// set values of mat4x4 to the rotate about y-axis matrix
function Mat4x4RotateY(mat4x4, theta) {
    mat4x4.values = [[ Math.cos(theta), 0, Math.sin(theta), 0],
                     [               0, 1,               0, 0],
                     [-Math.sin(theta), 0, Math.cos(theta), 0],
                     [0, 0, 0, 1]];
}

// set values of mat4x4 to the rotate about z-axis matrix
function Mat4x4RotateZ(mat4x4, theta) {
    mat4x4.values = [[Math.cos(theta), -Math.sin(theta), 0, 0],
                     [Math.sin(theta),  Math.cos(theta), 0, 0],
                     [              0,                0, 1, 0],
                     [              0,                0, 0, 1]];
}

// set values of mat4x4 to the shear parallel to the xy-plane matrix
function Mat4x4ShearXY(mat4x4, shx, shy) {
    mat4x4.values = [[1, 0, shx, 0],
                     [0, 1, shy, 0],
                     [0, 0,   1, 0],
                     [0, 0,   0, 1]];
}

// create a new 3-component vector with values x,y,z
function Vector3(x, y, z) {
    let vec3 = new Vector(3);
    vec3.values = [x, y, z];
    return vec3;
}

// create a new 4-component vector with values x,y,z,w
function Vector4(x, y, z, w) {
    let vec4 = new Vector(4);
    vec4.values = [x, y, z, w];
    return vec4;
}
