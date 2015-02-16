/*  ProteinViewer JavaScript Library, version 0.1
 *  (c) 2015-2015 Renchu Song
 *
 *  ProteinViewer is freely distributable under the terms of an Apache license.
 *
 *--------------------------------------------------------------------------*/

var ProteinViewer = function(width, height, DOMObj) {
	// Map of Protein Geometry Mesh
	var protein = [];
	this.protein = protein;
	
	// Scene
	var scene = new THREE.Scene();
	this.scene = scene;
	
	// Camera
	var camera = new THREE.PerspectiveCamera( 
		width, width / height, 0.1, 1000 
	);
	this.camera = camera;
	this.camera.position.z = 400;
	this.cameraUp = new Vec3([0, 1, 0]);
	this.cameraForward = new Vec3([0, 0, 1]);
	this.cameraDist = 400;
	// Update Camera
	this.updateCamera = function() {
		this.camera.position.x = this.cameraForward.x * this.cameraDist;
		this.camera.position.y = this.cameraForward.y * this.cameraDist;
		this.camera.position.z = this.cameraForward.z * this.cameraDist;
		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		this.camera.up = new THREE.Vector3(this.cameraUp.x, this.cameraUp.y, this.cameraUp.z);
	}
	// Camera Rotate
	this.cameraRotateTo = function(rx, ry) {
		var rMat = new Mat4().createRotationMatrix(0, rx).mulBefore(
				new Mat4().createRotationMatrix(1, ry)
			);
		this.cameraForward = rMat.mulBeforeVec3(new Vec4([0, 0, 1])).getVec3();
		this.cameraUp = rMat.mulBeforeVec3(new Vec4([0, 1, 0])).getVec3();
		this.updateCamera();
	}
	this.cameraRotate = function(rx, ry) {
		var rMat = new Mat4().createRotationMatrix(0, rx).mulBefore(
				new Mat4().createRotationMatrix(1, ry)
			);
		this.cameraForward = rMat.mulBeforeVec3(this.cameraForward).getVec3();
		this.cameraUp = rMat.mulBeforeVec3(this.cameraUp).getVec3();
		this.updateCamera();
	}

	// Renderer
	var renderer = new THREE.WebGLRenderer();
	this.renderer = renderer;
	this.renderer.setSize(width, height);

	// Canvas
	DOMObj.appendChild(this.renderer.domElement);

	// Render loop function
	var render = function () {
		requestAnimationFrame( render );
		//protein[0].rotation.x += 0.01;
		renderer.render(scene, camera);
	};
	this.execute = function() {
		render();
	}

	// Append a protein
	/**
		x, y, z: protein center location
		data: json represented protein geometry
		color: init color
		lineRadius: radius of line part
		planeWidth: width of flake / roll part (thick same as diameter of line part)
		angleThreshold: directional smooth parameter, the less the threshold, the smoother the surface 
	*/
	this.appendProtein = function(x, y, z, data, color, lineRadius, planeWidth, angleThreshold) {
		var geometry = new THREE.BoxGeometry( 100, 100, 100 );
		
		var sphereMaterial = new THREE.MeshBasicMaterial( { color: color } );

		var cube = new THREE.Mesh( geometry, sphereMaterial );
		cube.position.x = x;
		cube.position.y = y;
		cube.position.z = z;
		
		this.scene.add(cube);
		this.protein.push(cube);	
	}

	// Hide a protein
	this.hideProtein = function(index) {
		if (0 <=index && index < this.protein.length) {
			this.scene.remove(this.protein[index]);
		}
	}

	// Show a protein
	this.showProtein = function(index) {
		if (0 <=index && index < this.protein.length) {
			this.scene.add(this.protein[index]);
		}
	}

	// Change protein color
	this.changeProteinColor = function(index, newColor) {
		if (0 <=index && index < this.protein.length) {
			this.protein[index].material = new THREE.MeshLambertMaterial( { color: newColor } );
		}
	}

	// Move protein
	this.moveProteinTo = function(index, x, y, z) {
		this.protein[index].position.x = x;
		this.protein[index].position.y = y;
		this.protein[index].position.z = z;
	}
	this.moveProtein = function(index, dx, dy, dz) {
		this.protein[index].position.x += dx;
		this.protein[index].position.y += dy;
		this.protein[index].position.z += dz;
	}
	
	// Rotate protein
	this.rotateProteinTo = function(index, x, y, z) {
		this.protein[index].rotation.x = x;
		this.protein[index].rotation.y = y;
		this.protein[index].rotation.z = z;
	}
	this.rotateProtein = function(index, dx, dy, dz) {
		this.protein[index].rotation.x += dx;
		this.protein[index].rotation.y += dy;
		this.protein[index].rotation.z += dz;
	}
	
};

// Vector 3
var Vec3 = function(data) {
	this.x = data[0];
	this.y = data[1];
	this.z = data[2];

	this.clone = function() {
		return new Vec3([this.x, this.y, this.z]);
	}

	this.len = function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	this.normalize = function() {
		var len = this.len();
		this.x /= len;
		this.y /= len;
		this.z /= len;
		return this;
	}

	this.dot = function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z;
	}

	this.cross = function(other) {
		return new Vec3([
			this.y * other.z - this.z * other.y,
			this.z * other.x - this.x * other.z,
			this.x * other.y - this.y * other.x,
		]);
	}
};

// Vector 4
var Vec4 = function(data) {
	this.x = data[0];
	this.y = data[1];
	this.z = data[2];
	this.w = data.length > 3 ? data[3] : 1;

	this.clone = function() {
		return new Vec4([this.x, this.y, this.z, this.w]);
	}

	this.dot = function(other) {
		return this.x * other.x + this.y * other.y + this.z * other.z + this.w * other.w;
	}

	this.getVec3 = function() {
		return new Vec3([this.x, this.y, this.z]);
	}
};

// Matrix 4
/**
	data : [
			m0, m1, m2, m3,
			m4, m5, m6, m7,
			m8, m9, m10, m11,
			m12, m13, m14, m15	
		]
*/
var Mat4 = function(data) {
	this.data = data;

	this.clone = function() {
		return new Mat4(this.data);
	}

	this.col = function(col) {
		return new Vec4([
			this.data[col],
			this.data[col + 4],
			this.data[col + 8],
			this.data[col + 12],
		]);
	}

	this.row = function(row) {
		return new Vec4([
			this.data[row * 4], 
			this.data[row * 4 + 1], 
			this.data[row * 4 + 2], 
			this.data[row * 4 + 3]]
		);
	}

	this.mulBefore = function(other) {
		this.data = [
			this.row(0).dot(other.col(0)), this.row(0).dot(other.col(1)), this.row(0).dot(other.col(2)), this.row(0).dot(other.col(3)),
			this.row(1).dot(other.col(0)), this.row(1).dot(other.col(1)), this.row(1).dot(other.col(2)), this.row(1).dot(other.col(3)),
			this.row(2).dot(other.col(0)), this.row(2).dot(other.col(1)), this.row(2).dot(other.col(2)), this.row(2).dot(other.col(3)),
			this.row(3).dot(other.col(0)), this.row(3).dot(other.col(1)), this.row(3).dot(other.col(2)), this.row(3).dot(other.col(3)),
		];
		return this;
	}

	this.mulAfter = function(other) {
		this.data = [
			other.row(0).dot(this.col(0)), other.row(0).dot(this.col(1)), other.row(0).dot(this.col(2)), other.row(0).dot(this.col(3)),
			other.row(1).dot(this.col(0)), other.row(1).dot(this.col(1)), other.row(1).dot(this.col(2)), other.row(1).dot(this.col(3)),
			other.row(2).dot(this.col(0)), other.row(2).dot(this.col(1)), other.row(2).dot(this.col(2)), other.row(2).dot(this.col(3)),
			other.row(3).dot(this.col(0)), other.row(3).dot(this.col(1)), other.row(3).dot(this.col(2)), other.row(3).dot(this.col(3)),
		];
		return this;
	}

	this.mulBeforeVec4 = function(vec4) {
		return new Vec4([
			this.row(0).dot(vec4),
			this.row(1).dot(vec4),
			this.row(2).dot(vec4),
			this.row(3).dot(vec4),
		]);
	}

	this.mulBeforeVec3 = function(vec3) {
		var vec4 = new Vec4([vec3.x, vec3.y, vec3.z]);
		return new Vec4([
			this.row(0).dot(vec4),
			this.row(1).dot(vec4),
			this.row(2).dot(vec4),
			this.row(3).dot(vec4),
		]);
	}

	this.getVal = function(row, col) {
		return this.data[row * 4 + col];
	}

	// Create a translation matrix
	this.createTranslateMatrix = function(x, y, z) {
		this.data = [
			1, 0, 0, x,
			0, 1, 0, y,
			0, 0, 1, z,
			0, 0, 0, 1,
		];
		return this;
	}

	// Create a rotation matrix
	/**
		axes: 0 -> x, 1 -> y, 2 -> z
		radius: 0 ~ 2PI
	*/
	this.createRotationMatrix = function(axes, radius) {
		switch (axes) {
			case 0:
				this.data = [
					1, 0, 0, 0,
					0, Math.cos(radius), -Math.sin(radius), 0, 
					0, Math.sin(radius), Math.cos(radius), 0,
					0, 0, 0, 1,
				];
				break;
			case 1:
				this.data = [
					Math.cos(radius), 0, Math.sin(radius), 0,
					0, 1, 0, 0,
					-Math.sin(radius), 0, Math.cos(radius), 0,
					0, 0, 0, 1,
				];
				break;
			case 2:
				this.data = [
					Math.cos(radius), -Math.sin(radius), 0, 0,
					Math.sin(radius), Math.cos(radius), 0, 0,
					0, 0, 1, 0,
					0, 0, 0, 1,
				];
				break;
		}
		return this;
	}

	// Create a scale matrix
	this.createScaleMatrix = function(sx, sy, sz) {
		this.data = [
			sx, 0, 0, 0,
			0, sy, 0, 0,
			0, 0, sz, 0,
			0, 0, 0, 1,
		];
		return this;
	}
}