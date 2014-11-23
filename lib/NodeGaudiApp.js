/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Internal includes.
var foreman = require('./NodeGaudiForeman.js');
var builder = require('./NodeGaudiBuilder.js');

// Node.js standard and module includes.
var fs = require('fs');
var g = require('generic-functions');

var nodeGaudi = exports;
var app = {};
app.program = "nodeGaudi";
app.version = "0.1";
app.errorCode = -1;
app.defaults =  [ "build.json", "build.cson" ]
app.buildFile = app.defaults[0];
app.beVerbose = true;
app.logging = false;
app.uSocket = false;

// Invokation method; pass command line arguments to the build tool.
nodeGaudi.cli = function(args) {

	var action = "build"; // Default action to invoke is "build".

	/* Default behavior is to build a project following
	the build file in the current working directory. */
	if(args.length == 2) loadBuild(action);

	// Handle command line arguments.
	else if(args.length > 2 && args.length < 7) {

		for (var i = 2; i < args.length; i++) {

			if(g.strcmp(args[i], "-i")) displayUsage();
			else if(g.strcmp(args[i], "-v")) displayVersion(0);
			else if(g.strcmp(args[i], "-l")) app.logging = true;
			else if(g.strcmp(args[i], "-s")) app.uSocket = true;
			else if(g.strcmp(args[i], "-f")) {

				if(args[i+1] == null) {
					displayError("Build file. Filename not provided")
				}
				else {
					app.buildFile = args[i+1];
					if(args[i+2] != null) action = args[i+2];
					loadBuild(action);
				}
			}
			else loadBuild(args[i]);
		}
	}
}

// Load and delegate parse and execution of build file.
function loadBuild(action) {

	var specified = app.buildFile;
	var fallbacks = "";
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
		if(err) nodeGaudi.displayError("Build file. Cannot open " + specified
		+ "\nor fallback(s): " + fallbacks); // Catch errors.

		// Shrink string by replacing tabs with null space;
		// Gaudi build files should be written using tabs.
		var buildConf = data.replace("\t", "");

		// Delegate to the foreman and builder.
		foreman.init(buildConf, action, app.buildFile);
		builder.init(action);
		builder.setTarget(foreman.getTarget());
		builder.doAction(foreman.getAction());
		process.exit(0);
	});
}

// Display version information and exit.
function displayVersion() {
	g.println(app.program + " v. " + app.version);
	process.exit(0);
}

// Display an error.
nodeGaudi.displayError = function(error) {
	g.println("\nError with: " + error + ".");
	displayUsage(app.errorCode);
}

// Display usage information and exit.
function displayUsage(exitCode) {
	g.println("\nnodeGaudi platform agnostic build tool");
	g.println("Copyright (c) 2014 Sam Saint-Pettersen");
	g.println("\nReleased under the MIT/X11 License.");
	g.println("\nUsage: " + app.program + " [-l][-i|-v|-n|m][-q]");
	g.println("[-f <build file>][<action>][\"<:command>\"]");
	g.println("\n-l: Enable logging of certain events.");
	g.println("-i: Display usage information and quit.");
	g.println("-v: Display version information and quit.");
	g.println("-q: Mute console output, except for :echo and errors (Quiet mode).");
	g.println("-f: Use <build file> instead of build.json.\n");
	process.exit(exitCode);
}
