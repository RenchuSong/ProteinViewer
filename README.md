# ProteinViewer V0.1

A light weight easy using JavaScript protein display library based on three.js 

Import two JavaScript files in your webpage to use ProteinViewer:
	
	<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r70/three.min.js"></script>
	
	<script src="http://renchusong.github.io/ProteinViewer/js/ptviewer.js"></script>

See [Demo Code](https://github.com/RenchuSong/ProteinViewer/blob/master/demo.html) as a fast tutorial.
Visit [Online Demo Page](https://renchusong.github.io/ProteinViewer/demo.html) to get an intuition about ProteinViewer.

## ProteinViewerWrapper

The wrapper class to load json data and append proteins according to their format.

Json data format:

	{
	
		"atoms":[
	
			{"x" : -12.7110, "y" : -76.6390, "z" : 20.3000, "type" : 0, "ID" : "A44"},
	
			{"x" : -14.6360, "y" : -73.3960, "z" : 19.7790, "type" : 0, "ID" : "A45"},
	
			{"x" : -15.7110, "y" : -70.6390, "z" : 18.3000, "type" : 1, "ID" : "A46"},
	
			{"x" : -16.6360, "y" : -68.3960, "z" : 17.7790, "type" : 1, "ID" : "A47"},
	
			...
	
			{"x" : -13.2180, "y" : -72.1640, "z" : 16.4780, "type" : 0, "ID" : "B46"},
	
			{"x" : -14.7430, "y" : -69.8440, "z" : 13.8510, "type" : 0, "ID" : "B47"},
	
			...
	
		]
	}

"x", "y", "z": Protein node position

"type": 0 is line, 1 is slice, and 2 is roll

"ID": First character identifies protein, following number records order

### API:

#### ProteinViewerWrapper(width, height, DOMObj, data, [lineRadius, planeWidth, splitThreshold]):

Append a protein viewing canvas to DOMObj, with width and height specified. data is a json object following the format above.

lineRadius specifies the radius of line geometry

planeWidth specifies the width of slice / roll

splitThreshold spefifies the distance above which to be considered as non-connected segments within one protein

## ProteinViewer

Customizable protein viewing class.

### API:

##### ProteinViewer(width, height, DOMObj, [sceneMinX, sceneMaxX, sceneMinY, sceneMaxY]):

Append an empty protein viewing canvas to DOMObj, with width and height specified. Optional parameters can specify the range of camera, default to [-width / 2, width / 2] * [-height / 2, height / 2].

#### appendProtein(x, y, z, data, [color, scale, lineRadius, planeWidth]):

Append a protein to the canvas. 

x, y, z specifies the center location of the protein.

data follows the following format:

	[
	
		{"x" : -12.7110, "y" : -76.6390, "z" : 20.3000, "type" : 0},
	
		{"x" : -14.6360, "y" : -73.3960, "z" : 19.7790, "type" : 0},
	
		{"x" : -15.7110, "y" : -70.6390, "z" : 18.3000, "type" : 1},
	
		{"x" : -16.6360, "y" : -68.3960, "z" : 17.7790, "type" : 1},
	
		...
	
	]

color is a hex number, e.g, 0xff0000

scale is used to scaling the protein proportionally.

lineRadius defines the radius of line and thickness of slice / roll. Default to 1.0.

planeWidth defines the width of the slice / roll. Default to 6.0.

#### hideProtein(index):

Hide the index_{th} added protein.

#### showProtein(index):

Show the index_{th} added protein.

#### changeProteinColor(index, newColor):

Change the index_{th} protein's color to newColor (hex value).

#### moveProteinTo(index, x, y, z):

Move the index_{th} protein to new location (x, y, z)

#### moveProtein(index, dx, dy, dz):

Move the index_{th} protein by (dx, dy, dz)

#### rotateProteinTo(index, rx, ry, rz):

Rotate the index_{th} protein to the direction of (rx, ry, rz) radians in three axes.

#### rotateProtein(index, rdx, rdy, rdz):

Rotate the index_{th} protein in three axes of (rx, ry, rz) radians.

#### sceneRotateTo(theta, phi):

Rotate the whole scene to the direction of (theta, phi) radians in polar coordinate system.

#### sceneRotate(rdx, rdy):

Rotate the whole scene in three axes of (rdx, rdy) radians relative to current direction.

# Converting pdb file to json file

Supporting pdb format is our future work. Currently we provide a tool to convert pdb file to json file.

See more at [PDB2JSON](https://github.com/RenchuSong/ProteinViewer/tree/master/PDB2JSON)
