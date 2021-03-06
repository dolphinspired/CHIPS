/**
 * Created by Brogan on 2/19/2016.
 */

chips.commands = {
    /*******************************
     * PART I : COMMAND SCHEDULING *
     *******************************/
    CommandQueue : function() {
        var _list = [];

        var CommandCall = function(command, args) {
            this.timestamp = Date.now();
            this.command = command;
            this.args = (args || []);
        };

        // Returns the command list at tne index specified
        // If no index is specified, returns the whole command list
        this.get = function(scheduleOrder) {
            if (typeof scheduleOrder == "undefined") {
                return _list;
            } else {
                return _list[scheduleOrder];
            }
        };

        // Check to see if a command already exists in a given scheduleOrder (i.e. during a specific frame)
        // If so, return its executeOrder (index of a CommandCall object)
        // If not, return undefined
        this.query = function(command, scheduleOrder) {
            scheduleOrder = (scheduleOrder || 0);

            for (var executeOrder = 0; executeOrder < _list[scheduleOrder].length; executeOrder++) {
                if (_list[scheduleOrder][executeOrder].command === command) {
                    // If the command exists, replace its args with the most recent one
                    return executeOrder;
                }
            }
        };

        /**
         * function CommandQueue.set
         * Adds a command to this CommandQueue.
         *
         * @param command - Required. Name of the command to be added to the queue.
         * @param args - Default empty array. Array of arguments to be supplied to command's function.
         * @param scheduleOrder - Default 0. Number of executions after which the command will be performed.
         *                        A value of 0 means it occurs in the next execution.
         * @returns {boolean} - true if command was successfully added, false otherwise
         */
        this.set = function(command, args, scheduleOrder) {
            if (!command) {
                console.error("No command supplied to CommandQueue.set()");
                if (chips.g.debug) { debugger; }
                return false;
            }
            args = (args || []);
            scheduleOrder = (scheduleOrder && scheduleOrder >= 0 ? scheduleOrder : 0);
            var enableLogging = (
                chips.g.debug &&
                chips.g.logCommands &&
                !chips.util.arrayContains(chips.g.excludeCommandsFromLogging, command)
            );

            if (enableLogging) {
                console.log("Cmd set START: " + command + "; [" + args + "]; " + scheduleOrder);
            }

            var objCommandCall = new CommandCall(command, args);

            try {
                if (typeof _list[scheduleOrder] == "undefined") { // Initialize if it's the first command of the frame
                    _list[scheduleOrder] = [];
                    _list[scheduleOrder][0] = objCommandCall;
                } else {
                    var executeOrder = this.query(command, scheduleOrder);

                    if (typeof executeOrder == "undefined") { // Command does not exist for this scheduleOrder
                        _list[scheduleOrder][_list[scheduleOrder].length] = objCommandCall;
                    } else { // Command already exists for this scheduleOrder, replace old args with new args
                        _list[scheduleOrder][executeOrder].args = objCommandCall.args;
                    }
                }
                if (enableLogging) {
                    console.log("Cmd set   END: " + command + "; [" + args + "]; " + scheduleOrder);
                }
                return true;
            } catch (e) {
                console.error("Error setting command into schedule.\nwait : " + scheduleOrder + " / command : " + command + " / args : " + args);
                if (chips.g.debug) { debugger; }
                return false;
            }
        };

        // Set this property to tell the main loop when you want this CommandQueue to execute automatically
        // Return TRUE under conditions where this CommandQueue should run, FALSE if you want it not to run
        // By default, this condition always returns true
        this.isReadyToExecute = function() { return true; };

        // Set these properties to behaviors that you want to occur before/after this CommandQueue is executed
        // Note that these properties will be executed even if the queue is empty
        this.onBeforeExecute = function() {};
        this.onAfterExecute = function() {};

        /**
         * function CommandQueue.execute
         * Runs the functions associated with all commands at index 0 in this CommandQueue's list.
         * Then, shifts the list so that the next set of commands will be run on the next execute call.
         *
         * @returns {Array} the array of the command schedule after removing (shifting) the currently executed set
         */
        this.execute = function() {
            this.onBeforeExecute();
            if (typeof _list[0] != "undefined") {
                for (var executeOrder = 0; executeOrder < _list[0].length; executeOrder++) {
                    if (typeof chips.commands.lib[_list[0][executeOrder].command] != "undefined") {
                        chips.commands.lib[_list[0][executeOrder].command](_list[0][executeOrder].args);
                    } else {
                        console.error("Command '" + _list[0][executeOrder].command + "' not recognized.");
                    }
                }
            }
            this.onAfterExecute();

            return _list.shift();
        };
    },

    /*********************************
     * PART II : THE COMMAND LIBRARY *
     *********************************/

    schedule : {},
    lib : {}, // This is the command library, defined when the init function is run

    init : function() {
        /*****************************************************
         * Define the command schedules and their properties *
         *****************************************************/
        this.schedule["frames"] = new this.CommandQueue();
        this.schedule["frames"].onBeforeExecute = function() {
            chips.g.frame++;

            // Before all frame commands are executed, check to see if the level's time needs to be decremented
            var cam = chips.g.cam;
            if (cam && cam.elapsedTime && cam.elapsedTime.tick()) {
                cam.decrementTime();
            }
        };

        this.schedule["turns"] = new this.CommandQueue();
        this.schedule["turns"].onBeforeExecute = function() {
            chips.g.cam.updateTurn();
        };
        this.schedule["turns"].isReadyToExecute = function() {
            var cam = chips.g.cam;
            if (cam && cam.elapsedTime) {
                return cam.elapsedTime.elapsed_ms - (cam.turn * chips.g.turnTime) > cam.turn;
            }
        };

        /*****************************************************
         * Populate the command library (chips.commands.lib) *
         *****************************************************/
        this.lib["loadLevel"] = function(args) {
            chips.map.load.level(args[0]);
        };
        this.lib["startChipsFacingResetDelay"] = function(args) {
            chips.g.cam.chipsFacingReset = chips.vars.chipsFacingResetDelay;
        };
        // TODO: Combine all these "update" commands into a single "redraw" command with a parameter
        // TODO: Possible idea: an object with flags telling what to redraw, rather than adding commands each time
        this.lib["updateGameframe"] = function(args) {
            chips.draw.gameFrame();
        };
        this.lib["updateMap"] = function(args) {
            chips.draw.activeMap();
            if (chips.g.debug) { chips.draw.debug(); }
        };
        this.lib["updateDebug"] = function(args) {
            chips.draw.debug();
        };
        this.lib["updateHud"] = function(args) {
            chips.draw.hud();
        };
        this.lib["updateLevelNum"] = function(args) {
            chips.draw.levelNumber();
        };
        this.lib["updateTime"] = function(args) {
            chips.draw.time();
        };
        this.lib["updateChipsLeft"] = function(args) {
            chips.draw.chipsLeft();
        };
        this.lib["updateInventory"] = function(args) {
            chips.draw.inventory();
        };
        this.lib["toggleHint"] = function(args) {
            // use argument if supplied, otherwise toggle it
            if (args && args.length) {
                chips.g.cam.hintShown = args[0];
            } else {
                chips.g.cam.hintShown = (chips.g.cam.hintShown > 0 ? 0 : 1);
            }

            // Redraw based on the state of hintShown
            // TODO: Incorporate this condition into HUD redraw?
            if (chips.g.cam.hintShown > 0) {
                chips.draw.hint();
            } else {
                chips.draw.gameFrame(args);
                chips.draw.hud();
            }
        };
        this.lib["redrawAll"] = function(args) {
            chips.draw.gameFrame();
            chips.draw.activeMap();
            chips.draw.debug();
            chips.draw.hud();
        };
        this.lib["setGameMessage"] = function(args) {
            document.getElementById("gameMessage").innerHTML = args[0];
        };
        this.lib["initEvents"] = function(args) {
            chips.events.init();
        };
        this.lib["syncMonsterList"] = function(args) {
            chips.g.cam.monsters = {};
            chips.g.cam.monsters = new chips.obj.MonsterList();
            chips.g.cam.monsters.sync();
        };
        this.lib["drawPauseScreen"] = function(args) {
            chips.draw.pauseScreen();
        };
        this.lib["startMovingChip"] = function(args) {
            // Do not start moving if the game is paused or if chip is "movelocked" (i.e., sliding on ice)
            if (!chips.g.cam.elapsedTime.paused) {
                if (chips.g.moveStreakStart < 0) { // First move in this streak
                    chips.g.cam.player.move(args[0]);
                    chips.g.moveStreakStart = chips.g.cam.turn;
                    chips.g.cam.player.lastAction = chips.g.moveStreakStart;
                    chips.g.oddStep = chips.g.moveStreakStart % 2; // 0 (false) if even, 1 (true) if odd
                } else { // Other moves in this streak
                    var moveTurnDiff = chips.g.cam.turn - chips.g.cam.player.lastAction;
                    if (moveTurnDiff >= chips.g.cam.player.speed()) {
                        chips.g.cam.player.move(args[0]);
                        chips.g.cam.player.lastAction = chips.g.cam.turn;
                    }
                }
            }
        };
        this.lib["stopMovingChip"] = function(args) {
            if (chips.g.keylock === 0) {
                chips.g.moveStreakStart = -1; // reset move streak only if no other keys are held down (arrow keys only?)
            }
        };
        this.lib["forceMove"] = function(args) {
            var entity = args[0], d = args[1], changeDirection = args[2];
            try {
                entity.move(d, changeDirection);
            } catch (e) {
                if (chips.g.debug) { debugger; }
            }
        };
    }
};