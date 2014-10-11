// TODO: Undo restore functionality?
// TODO: Add mouse-hover snapshot descriptions

// Require dependencies
var fs = require('fs-extra');
var path = require('path');
var moment = require('moment');
var gui = require('nw.gui');

// var update = require(path.resolve('lib', 'update', 'update.js'));

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
        if (selectedWorldItem) selectedWorldItem.removeClass('world-item-selected');

        selectedWorldItem = $(this);
        selectedWorldItem.addClass('world-item-selected');
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
        snapshotToRemove = snapshotToRemove.substr(2, snapshotToRemove.length - 15);

        fs.removeSync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRemove));
        showSnapshotInterface(selectedWorldName);
    });

    $(document.body).on('click', '.restore-snapshot-btn', function() {
        onClickRestore($(this), selectedWorldItem);
    });
}

function onClickRestore(clickedButton, selectedWorldItem) {
    var snapshotToRestore = clickedButton.parent().parent().text();
    snapshotToRestore = snapshotToRestore.substr(2, snapshotToRestore.length - 15);
    console.log(snapshotToRestore)
    selectedWorldName = selectedWorldItem.text();

    fs.removeSync(path.join(minecraftSavesDir, selectedWorldName));
    fs.copySync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRestore), path.join(minecraftSavesDir, selectedWorldName));
    fs.removeSync(path.join(appSnapshotsDir, selectedWorldName, snapshotToRestore));

    if (selectedWorldItem.hasClass('world-item-deleted'))
        selectedWorldItem.toggleClass('world-item-deleted world-item-exists');
    showSnapshotInterface(selectedWorldName);
}

function listWorldInGUI(worldName, exists) {
    (exists) ? $('#worlds-list-container').append('<li class="world-item world-item-exists">' + worldName + '</li>')
             : $('#worlds-list-container').append('<li class="world-item world-item-deleted">' + worldName + '</li>');
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
                + '<div class="snapshots-index">' + (i + 1) + '</div>' + ' '
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
    // update.checkForUpdates('https://s3-us-west-1.amazonaws.com/antrikshyprojects/package.json');

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
