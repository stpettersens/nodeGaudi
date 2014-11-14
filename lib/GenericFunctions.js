/*
	Some useful generic functions for use in Node.js applications.
	- Sam Saint-Pettersen, 2014.
*/
var g = exports;

// Compare 2 strings to ensure they match (case-sensitve).
g.strcmp = function(str1, str2) {
	var match = false;
	if(str1 == str2) match = true;
	return match;
}

// Compare 2 string to ensure they match (case-insensitive).
g.icstrcmp = function(str1, str2) {
	return g.strcmp(str1.toLowerCase(), str2.toLowerCase());
}

// Print a string to stdout.
g.println = function(message) {
	console.log(message);
}

// Print an array line-by-line to stdout.
g.printlns = function(message) {
	message.forEach(function(line) {
		g.println(line);
	});
}
