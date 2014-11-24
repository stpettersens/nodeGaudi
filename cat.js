var spawn = require('child_process').spawn,
ls = spawn('cat', ['./nodeGaudi']);

ls.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
});
