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
var fs = require('fs');

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
		var passed = false;
		for(var key in command) {
			if(command.hasOwnProperty(key)) {
				var exitCode = doCommand(key, command[key]);
				if(exitCode == 0) passed = true;
			}
		}
		var status = "FAILED.";
		if(passed) status ="SUCCESSFUL.";
	});
}

// Execute a command in the action.
function doCommand(command, param) {
	printCommand(command, param);
	var status = 0;
	switch(command) {
		case "exec":
			status = execExtern(param);
			g.println(status.exitCode);
			break;
		case "mkdir":
			// TODO
			break;
		case "list":
			// TODO
			break;
		case "erase":
			eraseFile(param, false);
			break;
		case "erasex":
			eraseFile(param, true);
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

// Execute an external program or process.
function execExtern(param) {
	return exec(param);
}

// Erase a file.
function eraseFile(file, executable) {
	if(executable) { // && habitat.getOSFamily() == 0) {
		fs.unlinkSync(file + ".exe");
	}
	else fs.unlinkSync(file);
}
