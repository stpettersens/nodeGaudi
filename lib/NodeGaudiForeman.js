/**
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.

@file Foreman for NodeGaudi.
@author Sam Saint-Pettersen
@copyright (c) 2014 Sam Saint-Pettersen
@version 1.0.0
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

/**
 * @global
 * @name NodeGaudiForeman_init
 * @function
 * @description Initiator for NodeGaudiForeman.
 * @param {string} buildConf Build configuration as string.
 * @param {string} actionName Action name to set.
 * @param {string} fileName File name for loaded build file.
*/
NodeGaudiForeman.init = function(buildConf, actionName, fileName) {
	self.buildConf = buildConf;
	self.actionName = actionName;

	if(g.strendswith(fileName, '.json')) {
		parseBuildJSON();
	}
	else if(g.strendswith(fileName, '.cson')) {
		parseBuildCSON();
	}
};

/**
 * @global
 * @name NodeGaudiForeman_getTarget
 * @function
 * @description Get target from parsed preamble.
 * @returns {string} target Target for build action.
*/
NodeGaudiForeman.getTarget = function() {
	if(self.buildJson !== undefined) {
		return self.buildJson.preamble.target;
	}
	else { app.displayError("Build file. Badly formatted CSON"); }
};

/**
 * @global
 * @name NodeGaudiForeman_getPreamble
 * @function
 * @description Get preamble from the build object.
 * @returns {object} preamble Preamble for build file.
*/
NodeGaudiForeman.getPreamble = function() {
	return self.buildJson.preamble;
};

/**
 * @global
 * @name NodeGaudiForeman_getAction
 * @function
 * @description Get an execution action.
 * @returns {object[]} action Action (array of commands).
*/
NodeGaudiForeman.getAction = function() {
	var action = self.buildJson;
	return action[self.actionName];
};

/**
 * Parse JSON build configuration into usable objects.
*/
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

/**
 * Parse CSON build configuration into usable objects.
*/
function parseBuildCSON() {
	self.buildJson = CSON.parseSync(self.buildConf);
}
