/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Internal includes.
var base = require('./NodeGaudiBase.js');

// Node.js standard and module includes.
var exec = require('child_process').exec;
var fs = require('fs');
var g = require('generic-functions');
var ncp = require('ncp').ncp;

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
	g.println("\nSUCCESSFUL."); // !
}

// Execute a command in the action.
function doCommand(command, param) {
	printCommand(command, param);;
	switch(command) {
		case "exec":
			execExtern(param);
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
			eraseFile(param, false); // ! Will be true!
			break;
		case "append":
			var fileMsg = param.split(">>");
			base.writeToFile(fileMsg[0], fileMsg[1], true);
			break;
		case "xstrip":
			/*if(habitat.getOSFamily() == 0) {
				param += ".exe";
			}*/
			execExtern("strip " + param);
			break;
		case "cat":
			concaternateFile(param);
			break;
		case "copy":
			var srcDest = param.split("->");
			copyFileOrDir(srcDes[0], srcDest[1]);
			break;
		case "mkdir":
			makeDirectory(param);
			break;
	}
}

// Print and error related to action or command and then exit.
function printError(error) {
	g.println(error + ".");
	g.println("\nFAILED."); // !
	process.exit(-1);
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
	exec(param);
}

// Erase a file.
function eraseFile(file, executable) {
	var executable = false; // !
	try {
		if(executable) { // && habitat.getOSFamily() == 0) {
			fs.unlinkSync(file + ".exe");
		}
		else fs.unlinkSync(file);
	}
	catch(err) {
		printError("Error erasing file: " + file);
	}
}

// Concaternate a file.
function concaternateFile(file) {
	g.println("\n");
	fs.readFile(file, function(err, data) {
		g.println(data);
		if(err) printError("Error reading file: " + file);
		var lines = data.toString().split("\n");
		g.printlns(lines);
	});
}

// Copy a file. 
function copyFileOrDir(src, dest) {
	g.println("Copy file/dir!"); // !
	ncp.limit = 16;
	ncp(src, dest, function(err) {
		if(err) printError("Problem copying file or directory: " + src);
	});
}

// Make a directory.
function makeDirectory(dir) {
	g.println("makeDir!");
	try {
		fs.mkdirSync(dir);
	}
	catch(e) {
		if(e.code != 'EEXIST') {
			printError("Problem creating directory: " + dir);
		}
	}
}
