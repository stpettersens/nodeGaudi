/**
nodeGaudi platform agnostic build tool.
Copyright 2014 Sam Saint-Pettersen.

Gaudi implemented with Node.js

Released under the MIT/X11 License.
Please see LICENSE file.

@file Habitat for NodeGaudi.
@author Sam Saint-Pettersen
@copyright (c) 2014 Sam Saint-Pettersen
@version 1.0.0
*/

// Node.js standard includes and modules.
var os = require('os');

var NodeGaudiHabitat = exports;

/**
 * @global
 * @name NodeGaudiHabitat_getOSFamily
 * @function
 * @description
 * Return OS family that nodeGaudi is currently running on.
 * @returns {integer} r_os Operating system family (0 to 2).
*/
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
