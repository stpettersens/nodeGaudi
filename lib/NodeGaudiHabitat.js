/*
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.
*/

// Node.js standard includes and modules.
var os = require('os');

var NodeGaudiHabitat = exports;

// Return OS family ((int) 0-2) that nodeGaudi is currently running on.
NodeGaudiHabitat.getOSFamily = function() {
    var r_os = 0;
    switch(os.platform()) {
        case "linux" || "unix": // Linux or Unix, but not Mac OS X.
            r_os = 1;
            break;
        case "darwin": // Mac OS X or other Darwin-based.
            r_os = 2;
            break;
        default:       // Fallback for Windows family.
            r_os = 0;
            break;
    }
    return r_os;
};
