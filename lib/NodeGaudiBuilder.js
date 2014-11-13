/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

var g = require('./GenericFunctions.js');
var base = require('./NodeGaudiBase.js');

var exec = require('child_process').exec;

var NodeGaudiBuilder = exports;
var self = {};
self.target = "";
self.actionName = "";
self.verbose = true;
self.passed = false;

// Initiator for NodeGaudiBuilder
NodeGaudiBuilder.init = function(actionName) {
	self.actionName = actionName;
}

// Set target for the action.
NodeGaudiBuilder.setTarget = function(target) {
	self.target = target;
}

// Set and execute an action.
NodeGaudiBuilder.doAction = function(action) {
	g.println("[ " + self.target + " => " + self.actionName + " ]");
	action.forEach(function(command) {
		for(var key in command) {
			if(command.hasOwnProperty(key)) {
				doCommand(key, command[key]);
			}
		}
	});
}

// Execute a command in the action.
function doCommand(command, param) {
	printCommand(command, param);
	var exitCode = 0;
	switch(command) {
		case "exec":
			extiCode = execExtern(param);
			break;
	}
}

// Print executed command.
function printCommand(command, param) {
	if(self.verbose && !g.strcmp(command, "echo") && !g.strcmp(command, "null"))
		g.println("\t:" + command + " " + param);
	else if(g.strcmp(command, "echo"))
		g.println("\t# " + param);
}

// Execute an external program or processs.
function execExtern(param) {
	return exec(param);
}
