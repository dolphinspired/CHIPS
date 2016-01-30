/**
 * Created by Brogan on 10/13/2015.
 */

chips.events = {
    keysDown : {
        UP : 0,
        DOWN : 0,
        LEFT : 0,
        RIGHT : 0
    },

    init : function() {
        // On-screen buttons
        $("#buttonUp").on("mousedown", function() { kd.UP.down(); }).on("mouseup", function() { kd.UP.up(); });
        $("#buttonLeft").on("mousedown", function() { kd.LEFT.down(); }).on("mouseup", function() { kd.LEFT.up(); });
        $("#buttonDown").on("mousedown", function() { kd.DOWN.down(); }).on("mouseup", function() { kd.DOWN.up(); });
        $("#buttonRight").on("mousedown", function() { kd.RIGHT.down(); }).on("mouseup", function() { kd.RIGHT.up(); });

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
            chips.vars.requests.add("startMovingChip", [chips.util.dir.NORTH]);
            chips.events.keydownCommon("UP");
        });

        kd.UP.up( function(e) {
            chips.vars.requests.add("stopMovingChip");
            chips.events.keyupCommon("UP");
        });

        /*-----------------------------------
         * DOWN
         *-----------------------------------*/

        kd.DOWN.down( function(e) {
            chips.vars.requests.add("startMovingChip", [chips.util.dir.SOUTH]);
            chips.events.keydownCommon("DOWN");
        });

        kd.DOWN.up( function() {
            chips.vars.requests.add("stopMovingChip");
            chips.events.keyupCommon("DOWN");
        });

        /*-----------------------------------
         * LEFT
         *-----------------------------------*/

        kd.LEFT.down( function() {
            chips.vars.requests.add("startMovingChip", [chips.util.dir.WEST]);
            chips.events.keydownCommon("LEFT");
        });

        kd.LEFT.up( function() {
            chips.vars.requests.add("stopMovingChip");
            chips.events.keyupCommon("LEFT");
        });

        /*-----------------------------------
         * RIGHT
         *-----------------------------------*/

        kd.RIGHT.down( function() {
            chips.vars.requests.add("startMovingChip", [chips.util.dir.EAST]);
            chips.events.keydownCommon("RIGHT");
        });

        kd.RIGHT.up( function() {
            chips.vars.requests.add("stopMovingChip");
            chips.events.keyupCommon("RIGHT");
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

        /*-----------------------------------
         * SHIFT+C
         *-----------------------------------*/

        kd.C.down( function() {
            if (chips.g.keylock === 0 && kd.SHIFT.isDown()){
                chips.g.cam.elapsedTime.togglePause();
            }
            chips.events.keydownCommon();
        });

        kd.C.up( function() {
            chips.events.keyupCommon();
        });
    },

    keydownCommon : function(key) {
        chips.g.keylock++;
        this.keysDown[key]++;
        if (chips.g.debug) { chips.vars.requests.add("updateDebug"); }
    },

    keyupCommon : function(key) {
        this.keysDown[key] = 0;
        if (!this.anotherArrowKeyIsDown(key)) {
            chips.g.keylock = 0;
        }
        if (chips.g.debug) { chips.vars.requests.add("updateDebug"); }
    },

    anotherArrowKeyIsDown : function(k) {
        for (var key in this.keysDown) {
            if (!this.keysDown.hasOwnProperty(key) || key == k) { continue; }
            if (this.keysDown[key] > 0) { return true; }
        }
        return false;
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
                if (d !== chips.util.dir.SOUTH) {
                    chips.vars.requests.add("startChipsFacingResetDelay");
                }
                chips.util.detectCollision("player", "interactive", chips.g.cam.chip.x, chips.g.cam.chip.y, d);
            } else {
                chips.g.cam.setChipsFacing(d); // this actually places Chip back onto the board
                if (d !== chips.util.dir.SOUTH) {
                    chips.vars.requests.add("startChipsFacingResetDelay");
                }
                return false;
            }

            chips.g.cam.view.update();
            return true;
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
    },

    enemy : {
        move : function(x, y, d, id) {
            // For some enemies, barrier collision may have already been called once
            var hasLockingCollision = chips.util.detectCollision("enemy", "locking", x, y, d);
            var hasBarrierCollision = chips.util.detectCollision("enemy", "barrier", x, y, d);

            if (!hasLockingCollision && !hasBarrierCollision) {
                chips.g.cam.setEnemyFacing(x, y, d, id);
                var xDest = x + chips.util.dir.mod(d)[0],
                    yDest = y + chips.util.dir.mod(d)[1],
                    layer = chips.draw.LAYER.ENEMY,
                    newEnemyTile = chips.g.cam.getTileLayer(x, y, layer);
                chips.g.cam.setTileLayer(xDest, yDest, layer, newEnemyTile);
                chips.g.cam.clearTileLayer(x, y, layer);
                chips.g.cam.enemies.update(id, xDest, yDest, newEnemyTile);
                chips.util.detectCollision("enemy", "interactive", xDest, yDest, d, id);
                return true;
            } else {
                return false;
            }
        },
        kill : function(x, y, id) {
            chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
            chips.g.cam.enemies.remove(id);
        }
    }
};