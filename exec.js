
var spawn = require('child_process').spawn;
var ls = spawn('g++', ['blah.cpp', '-o', 'blah']);

ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
});
