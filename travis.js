#!/usr/bin/env node
var cp = require('child_process');
var bickle = 'bickle builds stpettersens/nodeGaudi -n 5';
cp.exec(bickle, function(err, stderr, stdout) {
	console.log(stdout);
});
