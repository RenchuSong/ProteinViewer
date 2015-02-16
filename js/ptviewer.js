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
};

// Matrix 4
/**
	data : [
			m0, m4, m8, m12,
			m1, m5, m9, m13,
			m2, m6, m10, m14,
			m3, m7, m11, m15	
		]
*/
var Mat4 = function(data) {
	this.data = data;

	this.clone = function() {
		return new Mat4(this.data);
	}

	this.row = function(row) {
		return new Vec4([
			data[row],
			data[row + 4],
			data[row + 8],
			data[row + 12],
		]);
	}

	this.col = function(col) {
		return new Vec4([
			data[col * 4], 
			data[col * 4 + 1], 
			data[col * 4 + 2], 
			data[col * 4 + 3]]
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
}