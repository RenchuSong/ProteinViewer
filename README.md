# ProteinViewer

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

#### ProteinViewerWrapper(width, height, DOMObj, data):

Append a canvas to DOMObj, with width and height specified. data is a json object following the format above.

