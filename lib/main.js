// TODO: Change opacity of restored world
// TODO: Undo restore functionality?

// Require dependencies
var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');
var gui = require('nw.gui');

// Some constantly reused directories
var minecraftSavesDir = path.join(gui.App.dataPath, '..', 'minecraft', 'saves');
var appSnapshotsDir = path.join(gui.App.dataPath, 'snapshots');

function main() {
    $('.new-snapshot-btn').hide();

    var selectedWorldName;
    var selectedWorldItem;
    var worldFolders = fs.readdirSync(minecraftSavesDir);

    for (var i = 0; i < worldFolders.length; i++) {
        var thisWorldSnapshotDir = path.join(appSnapshotsDir, worldFolders[i]);
        if (!fs.existsSync(thisWorldSnapshotDir)) fs.mkdirSync(thisWorldSnapshotDir);

        listWorldInGUI(worldFolders[i], true);
    };

    var snapshotFolders = fs.readdirSync(appSnapshotsDir);

    for (var i = 0; i < snapshotFolders.length; i++) {
        if (!fs.existsSync(path.join(minecraftSavesDir, snapshotFolders[i]))) {
            if (fs.readdirSync(path.join(appSnapshotsDir, snapshotFolders[i])).length > 0)
                listWorldInGUI(snapshotFolders[i], false);

            else fs.removeSync(path.join(appSnapshotsDir, snapshotFolders[i]));
        }
    };

    $('.world-item').click(function() {
        if (selectedWorldItem) unselectWorldItem(selectedWorldItem);

        selectedWorldItem = $(this);
        selectWorldItem(selectedWorldItem);
        selectedWorldName = selectedWorldItem.text();

        showSnapshotInterface(selectedWorldName);
    });

    // $('worlds-list-container').click(function() {
    //     console.log('test')
    //     hideSnapshotInterface();
    //     selectedWorldName = null;
    // });

    $('.new-snapshot-btn').click(function() {
        if (selectedWorldName) createSnapshot(selectedWorldName);
    });

    $(document.body).on('click', '.remove-snapshot-btn', function() {

        var snapshotToRemove = $(this).parent().parent().text();
        snapshotToRemove = snapshotToRemove.substr(0, snapshotToRemove.length - 13);

        fs.removeSync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRemove));
        showSnapshotInterface(selectedWorldName);
    });

    $(document.body).on('click', '.restore-snapshot-btn', function() {
        var snapshotToRestore = $(this).parent().parent().text();
        snapshotToRestore = snapshotToRestore.substr(0, snapshotToRestore.length - 13);

        fs.removeSync(path.join(minecraftSavesDir, selectedWorldName));
        fs.copySync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRestore), path.join(minecraftSavesDir, selectedWorldName));
        fs.removeSync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRestore));

        selectedWorldItem.toggleClass('world-item-deleted world-item-exists');
        showSnapshotInterface(selectedWorldName);
    });
}

function listWorldInGUI(worldName, exists) {
    (exists) ? $('#worlds-list-container').append('<li class="world-item world-item-exists">' + worldName + '</li>')
             : $('#worlds-list-container').append('<li class="world-item world-item-deleted">' + worldName + '</li>');
}

function selectWorldItem(worldItem) {
    worldItem.css('border-right', '10px solid #f1c40f');
}

function unselectWorldItem(worldItem) {
    worldItem.css('border-right', '10px solid #c0392b');
}

function createSnapshot(selectedWorldName) {
    var snapshotTimestampDate = moment().format('MMM DD');
    var snapshotTimestampTime = moment().format('HH:mm:ss');
    var snapshotTimestamp = snapshotTimestampDate + ', ' + snapshotTimestampTime;

    fs.copySync(path.join(minecraftSavesDir, selectedWorldName), path.join(appSnapshotsDir, selectedWorldName, snapshotTimestamp));

    showSnapshotInterface(selectedWorldName);
}

function showSnapshotInterface(worldName) {
    $('#snapshots-list-container').empty();

    var thisWorldSnapshotDir = path.join(appSnapshotsDir, worldName);
    var thisWorldSnapshots = fs.readdirSync(thisWorldSnapshotDir);

    for (var i = 0; i < thisWorldSnapshots.length; i++) {
        $('#snapshots-list-container').append('<li class="world-snapshot-item">'
                + thisWorldSnapshots[i]
                + '<div class="btn-group snapshot-action-btns">'
                + '<button class="btn btn-default btn-primary restore-snapshot-btn">Restore</button>'
                + '<button class="btn btn-default btn-danger remove-snapshot-btn">Delete</button>'
                + '</div></li>');
    };

    $('.new-snapshot-btn').fadeIn();
}

function hideSnapshotInterface() {
    $('#snapshots-list-container').empty();
    $('.new-snapshot-btn').fadeOut();   
}

$(document).ready(function() {
    // Creates snapshots folder inside app-data folder on first run
    if (!fs.existsSync(appSnapshotsDir)) fs.mkdirSync(appSnapshotsDir);

    // Close/minimize/fullscreen button logic
    $('.titlebar-close-btn').click(function() {
        gui.Window.get().close();
    });

    $('.titlebar-minimize-btn').click(function() {
        gui.Window.get().minimize();
    });

    $('.titlebar-fullscreen-btn').click(function() {
        gui.Window.get().toggleFullscreen();
    });

    main();
});
