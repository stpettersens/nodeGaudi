/*
	Jakefile to test nodeGaudi on local system or on Travis CI.
*/

var task = require("jake").task;
//var exec = require("child_process").exec;

task("test", function()
{
	print("Test build action for HelloWorld program...");
	process.chdir("examples/HelloWorld");
	exec("nodeGaudi -f build.json build");
	print("\nTest clean up action...");
	exec("nodeGaudi -f build.json clean")
});
