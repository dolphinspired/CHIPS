/* "Chip's Tribute"
 * A Chip's Challenge remake by Jacob Brogan
 * Original game by Chuck Somerville
 *
 * This file must be referenced FIRST, before any other chips modules are loaded.
 */

var chips = {};
chips.version = "Alpha v0.3.4"; // This is the version that will be shown on the page

document.addEventListener("DOMContentLoaded", function() {

    chips.assets.preload.images();
    chips.assets.preload.data();

    chips.g.loop = window.setInterval(function() {
        if (chips.assets.areLoaded) {
            chips.main();
        } else {
            chips.draw.loadScreen(chips.assets.poll());
        }
    }, 1000/chips.vars.fps);
});

chips.main = function() {
    // require these components to be defined before proceeding
    var schedule = chips.commands.schedule;
    var cam = chips.g.cam;

    if (schedule && cam) {
        // Execute all pending commands - see chips.commands.js for more information
        for (var cmdSet in schedule) {
            if (!schedule.hasOwnProperty(cmdSet)) { continue; }
            if (schedule[cmdSet].isReadyToExecute && schedule[cmdSet].isReadyToExecute()) {
                schedule[cmdSet].execute();
            }
        }
    }

    // tick for keydrown library - allows for smooth keyboard input
    // NOTE: this did not work when moved to onAfterExecute for the frames schedule. Research this further...
    kd.tick();
};