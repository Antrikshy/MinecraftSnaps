var fs = require('fs-extra');
var path = require('path');
var gui = require('nw.gui');

var minecraftSavesDir = path.join(gui.App.dataPath, '..', 'minecraft', 'saves');
var appSnapshotsDir = path.join(gui.App.dataPath, 'snapshots');

function main() {
    $('.new-snapshot-btn').hide();
    var selectedWorld;
    var worldFolders = fs.readdirSync(minecraftSavesDir);

    for (var i = 0; i < worldFolders.length; i++) {
        var thisWorldSnapshotDir = path.join(appSnapshotsDir, worldFolders[i]);
        if (!fs.existsSync(thisWorldSnapshotDir)) fs.mkdirSync(thisWorldSnapshotDir);

        listWorldInGUI(worldFolders[i], true);
    };

    $('.world-item').click(function() {
        selectedWorld = $(this).text();
        showSnapshotInterface($(this).text());
    });

    // $('worlds-list-container').click(function() {
    //     hideSnapshotInterface();
    //     selectedWorld = null;
    // });

    $('.new-snapshot-btn').click(function() {
        if (selectedWorld) createSnapshot(selectedWorld);
    });
}

function listWorldInGUI(worldName, exists) {
    (exists) ? $('#worlds-list-container').append('<li class="world-item world-item-exists">' + worldName + '</li>')
             : $('#worlds-list-container').append('<li class="world-item world-item-deleted">' + worldName + '</li>')
}

function showSnapshotInterface(worldName) {
    $('#snapshots-list-container').empty();

    var thisWorldSnapshotDir = path.join(appSnapshotsDir, worldName);
    var thisWorldSnapshots = fs.readdirSync(thisWorldSnapshotDir);

    for (var i = 0; i < thisWorldSnapshots.length; i++) {
        $('#snapshots-list-container').append('<li class="world-snapshot-item">' + thisWorldSnapshots[i] + '</li>');
    };

    $('.new-snapshot-btn').fadeIn();
}

function createSnapshot(selectedWorld) {
    console.log('createSnapshot')
    fs.copySync(path.join(minecraftSavesDir, selectedWorld), path.join(appSnapshotsDir, selectedWorld, 'testSnapshot'));

    showSnapshotInterface(selectedWorld);
}

function hideSnapshotInterface() {
    $('#snapshots-list-container').empty();
    $('.new-snapshot-btn').fadeOut();   
}

$(document).ready(function() {
    if (!fs.existsSync(appSnapshotsDir)) fs.mkdirSync(appSnapshotsDir);
    main();
});
