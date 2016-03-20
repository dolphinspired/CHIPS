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
            if (!chips.g.cam.player.getState(chips.vars.entityState.MOVELOCKED)) {
                chips.commands.schedule.frames.set("startMovingChip", [chips.util.dir.NORTH]);
            }
            chips.events.keydownCommon("UP");
        });

        kd.UP.up( function(e) {
            chips.commands.schedule.frames.set("stopMovingChip");
            chips.events.keyupCommon("UP");
        });

        /*-----------------------------------
         * DOWN
         *-----------------------------------*/

        kd.DOWN.down( function(e) {
            if (!chips.g.cam.player.getState(chips.vars.entityState.MOVELOCKED)) {
                chips.commands.schedule.frames.set("startMovingChip", [chips.util.dir.SOUTH]);
            }
            chips.events.keydownCommon("DOWN");
        });

        kd.DOWN.up( function() {
            chips.commands.schedule.frames.set("stopMovingChip");
            chips.events.keyupCommon("DOWN");
        });

        /*-----------------------------------
         * LEFT
         *-----------------------------------*/

        kd.LEFT.down( function() {
            if (!chips.g.cam.player.getState(chips.vars.entityState.MOVELOCKED)) {
                chips.commands.schedule.frames.set("startMovingChip", [chips.util.dir.WEST]);
            }
            chips.events.keydownCommon("LEFT");
        });

        kd.LEFT.up( function() {
            chips.commands.schedule.frames.set("stopMovingChip");
            chips.events.keyupCommon("LEFT");
        });

        /*-----------------------------------
         * RIGHT
         *-----------------------------------*/

        kd.RIGHT.down( function() {
            if (!chips.g.cam.player.getState(chips.vars.entityState.MOVELOCKED)) {
                chips.commands.schedule.frames.set("startMovingChip", [chips.util.dir.EAST]);
            }
            chips.events.keydownCommon("RIGHT");
        });

        kd.RIGHT.up( function() {
            chips.commands.schedule.frames.set("stopMovingChip");
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
                chips.commands.schedule.frames.set("redrawAll");
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
        if (chips.g.debug) { chips.commands.schedule.frames.set("updateDebug"); }
    },

    keyupCommon : function(key) {
        this.keysDown[key] = 0;
        if (!this.anotherArrowKeyIsDown(key)) {
            chips.g.keylock = 0;
        }
        if (chips.g.debug) { chips.commands.schedule.frames.set("updateDebug"); }
    },

    anotherArrowKeyIsDown : function(k) {
        for (var key in this.keysDown) {
            if (!this.keysDown.hasOwnProperty(key) || key == k) { continue; }
            if (this.keysDown[key] > 0) { return true; }
        }
        return false;
    }
};