/**
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.

@file Builder for NodeGaudi.
@author Sam Saint-Pettersen
@copyright (c) 2014 Sam Saint-Pettersen
@version 1.0.0
*/

// Internal includes.
var habitat = require('./NodeGaudiHabitat.js');

// Node.js standard and module includes.
var fs = require('fs');
var g = require('generic-functions');
var execSync = require('exec-sync');
var colors = require('colors/safe');
var ncp = require('ncp').ncp;
var now = require('performance-now');

var NodeGaudiBuilder = exports;
var self = {};
self.target = "";
self.actionName = "";
self.verbose = true;
self.passed = false;
self.action_start = 0;

/**
 * @global
 * @name NodeGaudiBuilder_init
 * @function
 * @description Initiator for NodeGaudiBuilder.
 * @param {string} actionName Name of action to set.
 * @param {boolean} verbose If true: display all action commands to console.
*/
NodeGaudiBuilder.init = function(actionName, verbose) {
	self.actionName = actionName;
	self.verbose = verbose;
};

/**
 * @global
 * @name NodeGaudiBuilder_setTarget
 * @function
 * @description Set target for the action.
 * @param {string} target Target to build.
*/
NodeGaudiBuilder.setTarget = function(target) {
	self.target = target;
};

/**
 * @global
 * @name NodeGaudiBuilder_doAction
 * @function 
 * @description Set and execute an action.
 * @param {string} action Action to execute.
*/
NodeGaudiBuilder.doAction = function(action) {
	self.action_start = now();
	g.println(colors.yellow("[ " + self.target + " => " + self.actionName + " ]"));
	for(var i = 0; i < action.length; i++) {
		var command = action[i];
		for(var key in command) {
			if(command.hasOwnProperty(key)) {
				doCommand(key, command[key]);
			}
		}
	}
	var time = calculateActionTime(now());
	g.println(colors.green("\nSUCCESSFUL in " + time)); // !
};

/**
 * Calculate time to success or fail for a performed action.
 * @param {integer} end Integer time value.
 * @returns {string} time Time action took to finish or fail.
*/
function calculateActionTime(end) {
	var units = ' ms.';
	var time = end - self.action_start;
	var ftime = time;
	if(time >= 1000) { ftime = (time / 1000) % 60; units = ' s.'; }
	return ftime.toFixed(2) + units + '\n';
}

/**
 * Execute a command in the action.
 * @param {string} command Command to execute.
 * @param {string} param Parameter(s) for command.
*/
function doCommand(command, param) {
	printCommand(command, param);
	switch(command) {
		case "doAction":
			execExtern("./nodeGaudi " + param);
			break;
		case "exec":
			execExtern(param);
			break;
		case "pwd":
			g.println(colors.cyan("\t~ CWD: " + process.cwd()));
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
			if(habitat.getOSFamily() === 0) {
				param += ".exe";
			}
			execExtern("strip " + param);
			break;
		case "cat":
			concaternateFile(param);
			break;
		case "copy":
			var srcDest = param.split("->");
			copyFileOrDir(srcDest[0], srcDest[1]);
			break;
		case "mkdir":
			makeDirectory(param);
			break;
	}
}

/**
 * Print and error related to action or command and then exit.
 * @param {string} error Error message.
*/
function printError(error) {
	g.println(colors.red(error + "."));
	var time = calculateActionTime(now());
	g.println(colors.red("\nFAILED in " + time)); // !
	process.exit(-1);
}

/**
 * Print executed command.
 * @param {string} command Command to execute.
 * @param {string} param Parameter(s) for command.
*/
function printCommand(command, param) {
	if(self.verbose && !g.strcmp(command, "echo") && !g.strcmp(command, "null"))
		{ g.println(colors.yellow("\t:" + command) + colors.yellow(" " + param)); }
	else if(g.strcmp(command, "echo"))
		{ g.println(colors.green("\t# " + param)); }
}

/**
 * Execute an external program or process.
 * @param {string} param Parameter (i.e. executable) to run.
*/
function execExtern(param) {
	var p = execSync(param, true);
	if(p.stderr !== '') { printError(p.stderr); }
	if(p.stdout !== '' && self.verbose) { g.printlns(
	[colors.gray("------------------------------------------------------------"),
	, colors.white(p.stdout),
	colors.gray("------------------------------------------------------------")]); }
}

/**
 * Erase a file.
 * @param {string} file File to erase.
 * @param {boolean} executable If true: file is executable.
 */
function eraseFile(file, executable) {
	//g.println(habitat.getOSFamily());
	if(fs.lstatSync(file).isFile()) {
		try {
			if(executable && habitat.getOSFamily() === 0) {
				fs.unlinkSync(file + ".exe");
			}
			else if(habitat.getOSFamily() === 1 || habitat.getOSFamily() === 2) {
				fs.unlinkSync(file);
			}
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
	else { printError("Error erasing: " + file); }
}

/** 
 * Concaternate a file.
 * @param {string} file File to concaternate to console.
*/
function concaternateFile(file) {
	g.println("\n");
	fs.readFileSync(file).toString().split(/\r?\n/).forEach(function(line) {
		g.println(line);
	});
}

/**
  * File writing operations.
  * @param {string} file File to write to.
  * @param {string} message Message to write to file.
  * @param {boolean} append If true: append to existing file.
 */
function writeToFile(file, message, append) {
	if(!append) { fs.writeFileSync(file, message + "\n"); }
	else { fs.appendFileSync(file, message + "\n"); }
}

/**
 * Copy a file or directory.
 * @param {string} src Original file/directory location.
 * @param {string} dest Copy destination.
*/
function copyFileOrDir(src, dest) {
	ncp.limit = 16;
	ncp(src, dest, function(err) {
		if(err) { printError("Problem copying file or directory: " + src); }
	});
}

/**
 * Change working directory.
 * @param {string} dir Directory to change into.
*/
function changeDirectory(dir) {
	try {
		process.chdir(dir);
		g.println(colors.cyan("\t~ CWD: " + process.cwd()));
	}
	catch(err) {
		printError("Problem changing directory:\n" + dir);
	}
}

/**
 * Make a directory.
 * @param {string} dir Directory to create.
*/
function makeDirectory(dir) {
	try {
		fs.mkdirSync(dir);
	}
	catch(err) {
		printError("Problem creating directory: " + dir);
	}
}
