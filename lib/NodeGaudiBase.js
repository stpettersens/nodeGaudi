/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Custom includes.
var g = require('./GenericFunctions.js');

// Node.js standard includes.
var fs = require('fs');

var NodeGaudiBase = exports;

// File writing operations
NodeGaudiBase.writeToFile = function(file, message, append) {
	if(!append) fs.writeFileSync(file, message + "\n");
	else fs.appendFileSync(file, message + "\n");
}
