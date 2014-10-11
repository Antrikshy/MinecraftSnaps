// Require dependencies
var request = require('request-json');

var macUpdater = require('./macUpdater.js');
var winUpdater = require('./winUpdater.js');

exports.checkForUpdates = function(updateManifest) {
    downloadJSON(updateManifest, function(data) {
        console.log(data);
    });
}

function downloadJSON(url, cb) {
    var client = request.newClient(url);
    client.get('/', function(err, res, body) {
        cb(body);
    });
}
