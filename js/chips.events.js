/**
 * Created by Brogan on 10/13/2015.
 */
/*
 *
 */

function initAllEvents() {

    // On-screen buttons
    $("#buttonUp").on("click", function() { moveChip(chips.util.dir.NORTH) });
    $("#buttonLeft").on("click", function() { moveChip(chips.util.dir.WEST) });
    $("#buttonDown").on("click", function() { moveChip(chips.util.dir.SOUTH) });
    $("#buttonRight").on("click", function() { moveChip(chips.util.dir.EAST) });

    // Prevent default behavior (page scrolling) with arrow keys
    $(document).on("keydown", function(e) {
        $.each(chips.vars.keys, function (k, val) {
            if (e.keyCode === val) {
                e.preventDefault();
            }
        });
    });

    /*-----------------------------------
     * UP
     *-----------------------------------*/

    kd.UP.down( function(e) {
        if (chips.g.keylock === 0) {
            moveChip(chips.util.dir.NORTH);
        }
        keydownCommon(this);
    });

    kd.UP.up( function(e) {
        keyupCommon(this);
    });

    /*-----------------------------------
     * DOWN
     *-----------------------------------*/

    kd.DOWN.down( function(e) {
        if (chips.g.keylock === 0) {
            moveChip(chips.util.dir.SOUTH);
        }
        keydownCommon(this);
    });

    kd.DOWN.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * LEFT
     *-----------------------------------*/

    kd.LEFT.down( function() {
        if (chips.g.keylock === 0) {
            moveChip(chips.util.dir.WEST);
        }
        keydownCommon(this);
    });

    kd.LEFT.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * RIGHT
     *-----------------------------------*/

    kd.RIGHT.down( function() {
        if (chips.g.keylock === 0) {
            moveChip(chips.util.dir.EAST);
        }
        keydownCommon(this);
    });

    kd.RIGHT.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * SHIFT+P
     *-----------------------------------*/

    kd.P.down( function() {
        if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
            chips.map.load.prevLevel();
        }
        keydownCommon(this);
    });

    kd.P.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * SHIFT+N
     *-----------------------------------*/

    kd.N.down( function() {
        if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
            chips.map.load.nextLevel();
        }
        keydownCommon(this);
    });

    kd.N.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * SHIFT+R
     *-----------------------------------*/

    kd.R.down( function() {
        if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
            chips.g.cam.reset();
            addRequest("redrawAll");
        }
        keydownCommon(this);
    });

    kd.R.up( function() {
        keyupCommon(this);
    });

    function keydownCommon(oKey) {
        chips.g.keylock++;
        if (chips.g.debug) { addRequest("updateDebug"); }
    }

    function keyupCommon(oKey) {
        chips.g.keylock = 0;
        if (chips.g.cam.chip_facing !== chips.util.dir.SOUTH) {
            addRequest("startChipResetDelay");
        }
        if (chips.g.debug) { addRequest("updateDebug"); }
    }
}

/**
 * function moveChip
 * Change chip's location by one tile in the directions specified
 *
 * @param direction - a number corresponding to a direction (use dir enum)
 */
function moveChip(d) {
    chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.CHIP);

    var hasUnloadCollision = detectCollision("player", "unload", chips.g.cam.chip_x, chips.g.cam.chip_y, d);
    var hasLockingCollision = detectCollision("player", "locking", chips.g.cam.chip_x, chips.g.cam.chip_y, d);
    var hasBarrierCollision = detectCollision("player", "barrier", chips.g.cam.chip_x, chips.g.cam.chip_y, d);

    if (!hasLockingCollision && !hasBarrierCollision) {
        chips.g.cam.chip_x += chips.util.dir.mod(d)[0];
        chips.g.cam.chip_y += chips.util.dir.mod(d)[1];
        chips.g.cam.setChipsFacing(d);
        detectCollision("player", "interactive", chips.g.cam.chip_x, chips.g.cam.chip_y, d);
    } else {
        chips.g.cam.setChipsFacing(d); // this actually places Chip back onto the board
    }

    chips.g.cam.view.update();
}

function killChip(msg) {
    if (!msg) { msg = "Oh dear, you are dead!" }
    addRequest("setGameMessage", [msg]); // TODO: Enhance
    chips.g.cam.reset();
    addRequest("redrawAll");
}

function winChip() {
    // TODO: in lieu of a dialog box...
    addRequest("setGameMessage", ["<span style='color:red'>Hooray, you completed Level " + chips.g.cam.levelNum +
        " with a time of " + chips.g.cam.time + " seconds!</span>"]);
    chips.map.load.nextLevel();
}

function dialog(msg) {

}