/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Internal includes.
var app = require('./NodeGaudiApp.js');

// Node.js standard includes and modules.
var g = require('generic-functions');
var CSON = require('cson');

var NodeGaudiForeman = exports;
var self = {};
self.actionName = "";
self.buildConf = "";
self.buildJson = "";

// Initiator for NodeGaudiForeman.
NodeGaudiForeman.init = function(buildConf, actionName, fileName) {
	self.buildConf = buildConf;
	self.actionName = actionName;

	if(g.strendswith(fileName, '.json')) {
		parseBuildJSON();
	}
	else if(g.strendswith(fileName, '.cson')) {
		parseBuildCSON();
	}
}

// Get target from parsed preamble.
NodeGaudiForeman.getTarget = function() {
	return self.buildJson.preamble.target;
}

// Get preamble from the build object.
NodeGaudiForeman.getPreamble = function() {
	return self.buildJson.preamble;
}

// Get an execution action.
NodeGaudiForeman.getAction = function() {
	var action = self.buildJson;
	return action[self.actionName];
}

// Parse JSON build configuration into usable objects.
function parseBuildJSON() {
	try {
		// Try to parse build file into JSON object.
		self.buildJson = JSON.parse(self.buildConf);
	}
	catch(err) {
		// Display an error if the JSON is badly formatted.
		app.displayError("Build file. Badly formatted JSON\n- " + err);
	}
}

// Parse CSON build configuration into usable objects.
function parseBuildCSON() {
	try {
		// Try to parse build file into JSON object.
		self.buildJson = CSON.parseSync(self.buildConf);
	}
	catch(err) {
		// Display an error if the CSON is badly formatted.
		app.displayError("Build file. Badly formatted CSON\n- " + err);
	}
}
