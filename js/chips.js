/* "Chip's Tribute"
 * A Chip's Challenge remake by Jacob Brogan
 * Original game by Chuck Somerville
 *
 * This file must be referenced FIRST, before any other chips modules are loaded.
 */

var chips = {};
chips.version = "Alpha v0.3.3"; // This is the version that will be shown on the page

document.addEventListener("DOMContentLoaded", function() {

    chips.assets.preload.images();
    chips.assets.preload.data();

    chips.g.loop = window.setInterval(function() {
        chips.g.frame++;
        if (chips.assets.areLoaded) {
            chips.main();
        } else {
            chips.draw.loadScreen(chips.assets.poll());
        }

    }, 1000/chips.vars.fps);
});

chips.main = function() {

    // If any commands exist in the framewise schedule, execute them now.
    if (chips.commands.schedule.frames) {
        chips.commands.schedule.frames.execute();
    }

    // If enough time has passed that we're on a new turn...
    if (chips.g.cam.elapsedTime.elapsed_ms - (chips.g.cam.turn * chips.g.turnTime) > chips.g.cam.turn) {
        chips.g.cam.updateTurn(); // TODO: refactor this into turnwise commands
        // If any commands existin the turnwise schedule, execute them now.
        if (chips.commands.schedule.turns) {
            chips.commands.schedule.turns.execute();
        }
    }

    // tick for keydrown library
    kd.tick();

    // TODO: refactor this into a framewise command
    if (chips.g.cam && chips.g.cam.elapsedTime && chips.g.cam.elapsedTime.tick()) {
        chips.g.cam.decrementTime();
    }
};