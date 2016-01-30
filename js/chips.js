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

$(document).ready(function() {

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

    // For code that does not need to run every frame
    if (chips.vars.requests.pending.length > 0) { chips.vars.requests.process(); }

    // tick for keydrown library
    kd.tick();

    chips.g.cam.updateTurn();

    if (chips.g.cam && chips.g.cam.elapsedTime.tick()) {
        chips.g.cam.decrementTime();
    }
};