var util  = require('util'),
    spawn = require('child_process').spawn,
    ls    = spawn('cat', ['cat.js']);

ls.stdout.on('data', function (data) {
  console.log('stdout: ' + data);
});
