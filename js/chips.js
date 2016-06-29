/* "Chip's Tribute"
 * A Chip's Challenge remake by Jacob Brogan
 * Original game by Chuck Somerville
 *
 * File schema:
 *  chips.draw.js           For drawing everything onto the game's canvas.
 *  chips.load.js           For loading data onto the page (in the background).
 *  chips.events.js         For handling page events, such as user input.
 *
 *  chips.settings.js       For all read-only global variables.
 *  chips.global.js         For all object structures and mutable global variables.
 */

var chips = {};
chips.version = "Alpha v0.3.3";

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

    if (chips.commands.schedule.frames) {
        chips.commands.schedule.frames.execute();
    }

    if (chips.g.cam.elapsedTime.elapsed_ms - (chips.g.cam.turn * chips.g.turnTime) > chips.g.cam.turn) {
        chips.g.cam.updateTurn(); // TODO: refactor this into turnwise commands
        if (chips.commands.schedule.turns) {
            chips.commands.schedule.turns.execute();
        }
    }

    // tick for keydrown library
    kd.tick();

    if (chips.g.cam && chips.g.cam.elapsedTime && chips.g.cam.elapsedTime.tick()) {
        chips.g.cam.decrementTime();
    }
};