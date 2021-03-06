/**
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.

@file Entry point for NodeGaudi.
@author Sam Saint-Pettersen
@copyright (c) 2014 Sam Saint-Pettersen
@version 1.0.0
*/

// Internal includes.
var foreman = require('./NodeGaudiForeman.js');
var builder = require('./NodeGaudiBuilder.js');

// Node.js standard and module includes.
var fs = require('fs');
var os = require('os');
var g = require('generic-functions');
var colors = require('colors/safe');

var nodeGaudi = exports;
var app = {};
app.program = "nodeGaudi";
app.version = "1.0.0";
app.errorCode = -1;
app.defaults =  [ "build.json", "build.cson" ];
app.buildFile = app.defaults[0];
app.verbose = true;
app.logging = false;
app.uSocket = false;

/**
 * @global
 * @name nodeGaudi_cli
 * @function
 * @description
 * Invokation method; pass command line arguments to the build tool.
 * @param {string[]} args Command line arguments.
*/
nodeGaudi.cli = function(args) {

	var action = "build"; // Default action to invoke is "build".

	/* Default behavior is to build a project following
	the build file in the current working directory. */
	if(args.length === 2) { loadBuild(action); }

	// Handle command line arguments.
	else if(args.length > 2 && args.length < 7) {

		for (var i = 2; i < args.length; i++) {

			if(g.strcmp(args[i], "-i")) { displayUsage(); }
			else if(g.strcmp(args[i], "-v")) { displayVersion(0); }
			else if(g.strcmp(args[i], "-q")) { app.verbose = false; }
			else if(g.strcmp(args[i], "-l")) { app.logging = true; }
			else if(g.strcmp(args[i], "-s")) { app.uSocket = true; }
			else if(g.strcmp(args[i], "-f")) {

				if(args[i+1] === null) {
					nodeGaudi.displayError("Build file. Filename not provided");
				}
				else {
					app.buildFile = args[i+1];
					if(args[i+2] !== null) { action = args[i+2]; }
					loadBuild(action);
				}
			}
			else {
				loadBuild(args[i]);
			}
		}
	}
};

/**
 * Load and delegate parse and execution of build file.
 * @param {string} action Action to execute from loaded build file.
*/
function loadBuild(action) {

	var specified = app.buildFile;
	var fallbacks = '';
	fs.exists(app.buildFile, function(exists) {
		if(!exists && !g.strcmp(app.buildFile, "build.json")) {
			app.buildFile = app.defaults[0];
			fallbacks = app.defaults[0] + " or " + app.defaults[1];
		}
		else if(!exists && g.strcmp(app.buildFile, "build.json")) {
			app.buildFile = app.defaults[1];
			fallbacks = app.defaults[1];
		}
	});

	fs.readFile(app.buildFile, "utf-8", function(err, data) {
		if(err) { nodeGaudi.displayError("Build file. Cannot open " + specified +
		"\nor fallback(s): " + fallbacks); } // Catch errors.

		// Shrink string by replacing tabs with null space;
		// Gaudi build files should be written using tabs.
		var buildConf = data.replace("\t", "");

		// Delegate to the foreman and builder.
		foreman.init(buildConf, action, app.buildFile);
		builder.init(action, app.verbose);
		builder.setTarget(foreman.getTarget());
		builder.doAction(foreman.getAction());
		process.exit(0);
	});
}

/**
 * Display version information and exit.
*/
function displayVersion() {
	g.println(colors.bold(app.program) + " v" + app.version + colors.italic(" running on ") +
	colors.green.bold("Node.js ") + colors.green(process.version) + " (" + os.platform() + ")");
	process.exit(0);
}

/**
 * @global
 * @name nodeGaudi_displayError
 * @function
 * @description Display an error, usage information and exit.
 * @param {string} error Error message.
*/
nodeGaudi.displayError = function(error) {
	g.println(colors.red.bold("\nError with: " + error + "."));
	displayUsage(app.errorCode);
};

/**
 * Display usage information and exit.
 * @param {integer} exitCode Exit code.
*/
function displayUsage(exitCode) {
	var usage = ["\nnodeGaudi platform agnostic build tool",
	"Copyright (c) 2014 Sam Saint-Pettersen",
	"\nReleased under the MIT/X11 License.",
	"\nUsage: " + colors.bold(app.program) + " [-l][-i|-v|-n|m][-q]",
	"[-f " + colors.italic("<build file>") + "][" +
	colors.italic("<action>") + "][" + colors.italic("\"<:command>\"") + "][--no-color]",
	"\n-l: Enable logging of certain events.",
	"-i: Display usage information and quit.",
	"-v: Display version information and quit.",
	"-q: Mute console output, except for " + colors.yellow(":echo") +
	" and " + colors.red.bold("errors") + " (Quiet mode).",
	"-f: Use " + colors.italic("<build file>") + " instead of " +
	colors.italic("build.json") + ".",
	"\n--no-color: Disable coloring and styling in stdout.\n"];
	g.printlns(usage);
	process.exit(exitCode);
}
