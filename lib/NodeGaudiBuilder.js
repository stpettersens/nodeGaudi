/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Internal includes.
var habitat = require('./NodeGaudiHabitat.js');

// Node.js standard and module includes.
var fs = require('fs');
var spawn = require('child_process').spawn;
var g = require('generic-functions');
var ncp = require('ncp').ncp;
var now = require('performance-now');
var sleep = require('sleep');


var NodeGaudiBuilder = exports;
var self = {};
self.target = "";
self.actionName = "";
self.verbose = true;
self.passed = false;
self.action_start = 0;

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
	self.action_start = now();
	g.println("[ " + self.target + " => " + self.actionName + " ]");
	for(var i = 0; i < action.length; i++) {
		var command = action[i];
		for(var key in command) {
			if(command.hasOwnProperty(key)) {
				doCommand(key, command[key]);
			}
		}
	}
	var time = calculateActionTime(now());
	g.println("\nSUCCESSFUL in " + time); // !
}

// Calculate time to success or fail for a performed action.
function calculateActionTime(end) {
	var units = ' ms.';
	var time = end - self.action_start;
	if(time >= 1000) units = ' s.';
	return time.toFixed(2) + units + '\n';
}

// Execute a command in the action.
function doCommand(command, param) {
	printCommand(command, param);;
	switch(command) {
		case "exec":
			execExtern(param);
			break;
		case "pwd":
			g.println("\t~ CWD: " + process.cwd());
			break;
		case "pause":
			pause(param);
			break;
		case "chdir":
			changeDirectory(param);
			break;
		case "mkdir":
			makeDirectory(param);
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
		case "append":
			var fileMsg = param.split(">>");
			writeToFile(fileMsg[0], fileMsg[1], true);
			break;
		case "xstrip":
			if(habitat.getOSFamily() == 0) {
				param += ".exe";
			}
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
	var time = calculateActionTime(now());
	g.println("\nFAILED in " + time); // !
	process.exit(-1);
}

// Print executed command.
function printCommand(command, param) {
	if(self.verbose && !g.strcmp(command, "echo") && !g.strcmp(command, "null"))
		g.println("\t:" + command + " " + param);
	else if(g.strcmp(command, "echo"))
		g.println("\t# " + param);
}

// Do nothing for (int) n milliseconds.
function pause(ms) {
	sleep.usleep(parseInt(ms * 1000)); // Takes microseconds so times by 1000 for milliseconds.
}

// Execute an external program or process.
function execExtern(param) {
	var a_params = param.split(" ");
	var e = a_params[0];
	a_params.splice(0, 1);
	var p = spawn(e, a_params);

	p.stdout.on('data', function(data) {
  		g.println('~ ' + data);
	});

	p.stderr.on('data', function(data) {
  		g.println('~ ' + data);
	});
}

// Erase a file.
function eraseFile(file, executable) {
	//g.println(habitat.getOSFamily());
	if(fs.lstatSync(file).isFile()) {
		try {
			if(executable && habitat.getOSFamily() == 0) {
				fs.unlinkSync(file + ".exe");
			}
			else if(habitat.getOSFamily() == 1 || habitat.getOSFamily() == 2)
				fs.unlinkSync(file);
		}
		catch(err) {
			printError("Error erasing file: " + file);
		}
	}
	else if(fs.lstatSync(file).isDirectory()) {
		try {
			fs.rmdirSync(file);
		}
		catch(err) {
			printError("Error erasing directory: " + file);
		}
	}
	else printError("Error erasing: " + file);
}

// Concaternate a file.
function concaternateFile(file) {
	g.println("\n");
	fs.readFileSync(file).toString().split(/\r?\n/)
	.forEach(function(line) {
		g.println(line);
	});
}

// File writing operations
function writeToFile(file, message, append) {
	if(!append) fs.writeFileSync(file, message + "\n");
	else fs.appendFileSync(file, message + "\n");
}

// Copy a file.
function copyFileOrDir(src, dest) {
	g.println("Copy file/dir!"); // !
	ncp.limit = 16;
	ncp(src, dest, function(err) {
		if(err) printError("Problem copying file or directory: " + src);
	});
}

// Change working directory.
function changeDirectory(dir) {
	try {
		process.chdir(dir);
		g.println("\t~ CWD: " + process.cwd());
	}
	catch(err) {
		printError("Problem changing directory:\n" + err);
	}
}

// Make a directory.
function makeDirectory(dir) {
	try {
		fs.mkdirSync(dir);
	}
	catch(err) {
		printError("Problem creating directory: " + dir);
	}
}
