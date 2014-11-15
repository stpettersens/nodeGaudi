/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Internal includes.
var base = require('./NodeGaudiBase.js');
var app = require('./NodeGaudiApp.js');

var NodeGaudiForeman = exports;
var self = {};
self.actionName = "";
self.buildConf = "";
self.buildJson = "";

// Initiator for NodeGaudiForeman.
NodeGaudiForeman.init = function(buildConf, actionName) {
	self.buildConf = buildConf;
	self.actionName = actionName;
	parseBuildJSON();
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

// Parse build configuration into usable objects.
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
