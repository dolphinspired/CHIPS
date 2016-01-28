/**
 * Created by Brogan on 10/13/2015.
 */

chips.events = {
    init : function() {
        // On-screen buttons
        $("#buttonUp").on("click", function() { chips.events.chip.move(chips.util.dir.NORTH) });
        $("#buttonLeft").on("click", function() { chips.events.chip.move(chips.util.dir.WEST) });
        $("#buttonDown").on("click", function() { chips.events.chip.move(chips.util.dir.SOUTH) });
        $("#buttonRight").on("click", function() { chips.events.chip.move(chips.util.dir.EAST) });

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
                chips.events.chip.move(chips.util.dir.NORTH);
            }
            chips.events.keydownCommon();
        });

        kd.UP.up( function(e) {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * DOWN
         *-----------------------------------*/

        kd.DOWN.down( function(e) {
            if (chips.g.keylock === 0) {
                chips.events.chip.move(chips.util.dir.SOUTH);
            }
            chips.events.keydownCommon();
        });

        kd.DOWN.up( function() {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * LEFT
         *-----------------------------------*/

        kd.LEFT.down( function() {
            if (chips.g.keylock === 0) {
                chips.events.chip.move(chips.util.dir.WEST);
            }
            chips.events.keydownCommon();
        });

        kd.LEFT.up( function() {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * RIGHT
         *-----------------------------------*/

        kd.RIGHT.down( function() {
            if (chips.g.keylock === 0) {
                chips.events.chip.move(chips.util.dir.EAST);
            }
            chips.events.keydownCommon();
        });

        kd.RIGHT.up( function() {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * SHIFT+P
         *-----------------------------------*/

        kd.P.down( function() {
            if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
                chips.map.load.prevLevel();
            }
            chips.events.keydownCommon();
        });

        kd.P.up( function() {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * SHIFT+N
         *-----------------------------------*/

        kd.N.down( function() {
            if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
                chips.map.load.nextLevel();
            }
            chips.events.keydownCommon();
        });

        kd.N.up( function() {
            chips.events.keyupCommon();
        });

        /*-----------------------------------
         * SHIFT+R
         *-----------------------------------*/

        kd.R.down( function() {
            if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
                chips.g.cam.reset();
                chips.vars.requests.add("redrawAll");
            }
            chips.events.keydownCommon();
        });

        kd.R.up( function() {
            chips.events.keyupCommon();
        });
    },

    keydownCommon : function() {
        chips.g.keylock++;
        if (chips.g.debug) { chips.vars.requests.add("updateDebug"); }
    },

    keyupCommon : function() {
        chips.g.keylock = 0;
        if (chips.g.cam.chip.facing !== chips.util.dir.SOUTH) {
            chips.vars.requests.add("startChipResetDelay");
        }
        if (chips.g.debug) { chips.vars.requests.add("updateDebug"); }
    },

    chip : {
        move : function(d) {
            chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.CHIP);

            var hasUnloadCollision = chips.util.detectCollision("player", "unload", chips.g.cam.chip.x, chips.g.cam.chip.y, d);
            var hasLockingCollision = chips.util.detectCollision("player", "locking", chips.g.cam.chip.x, chips.g.cam.chip.y, d);
            var hasBarrierCollision = chips.util.detectCollision("player", "barrier", chips.g.cam.chip.x, chips.g.cam.chip.y, d);

            if (!hasLockingCollision && !hasBarrierCollision) {
                chips.g.cam.chip.x += chips.util.dir.mod(d)[0];
                chips.g.cam.chip.y += chips.util.dir.mod(d)[1];
                chips.g.cam.setChipsFacing(d);
                chips.util.detectCollision("player", "interactive", chips.g.cam.chip.x, chips.g.cam.chip.y, d);
            } else {
                chips.g.cam.setChipsFacing(d); // this actually places Chip back onto the board
            }

            chips.g.cam.view.update();
        },
        kill : function(msg) {
            if (!msg) { msg = "Oh dear, you are dead!" }
            chips.vars.requests.add("setGameMessage", [msg]); // TODO: Enhance
            chips.g.cam.reset();
            chips.vars.requests.add("redrawAll");
        },
        win : function() {
            // TODO: in lieu of a dialog box...
            var retStr = "<span style='color:red'>Hooray, you completed Level " + chips.g.cam.number;
            retStr += chips.g.cam.timeLeft > 0 ? " with a time of " + chips.g.cam.timeLeft + " seconds!" : "!";
            chips.vars.requests.add("setGameMessage", [retStr]);
            chips.map.load.nextLevel();
        }
    }
};