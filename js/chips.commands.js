/**
 * Created by Brogan on 2/19/2016.
 */

chips.commands = {
    /*******************************
     * PART I : COMMAND SCHEDULING *
     *******************************/

    setBy : {
        time : function(wait, command, args) {
            wait = (wait || 0);

            if (wait === 0) {
                return this.frame(0, command, args);
            } else {
                // What does this calculation do?
                // It takes the "wait" time (in ms) and figures out how many FRAMES ahead it needs to schedule
                // this command in order to make it sync up with the requested time.
                // It rounds down because it needs to surpass frame x's length before it gets pushed to frame x+1
                var framesAhead = Math.floor((chips.g.frame % (1000 / chips.vars.fps) + wait) / (1000 / chips.vars.fps));
                return this.frame(framesAhead, command, args);
            }

        },
        frame : function(wait, command, args) {
            wait = (wait || 0);
            args = (args || []);
            try {
                if (typeof chips.commands.schedule[wait] == "undefined") { // Initialize if it's the first command of the frame
                    chips.commands.schedule[wait] = [];
                    chips.commands.schedule[wait][0] = [command, args];
                } else { // Otherwise check for duplicates and either overwrite or add in
                    for (var i = 0; i < chips.commands.schedule[wait].length; i++) {
                        if (chips.commands.schedule[wait][i][0] === command) {
                            // If the command exists, replace its args with the most recent one
                            chips.commands.schedule[wait][i][1] = args;
                            return true;
                        }
                    }
                    // If the command doesn't yet exist, add it to the end of the current frame's queue with its args
                    chips.commands.schedule[wait][chips.commands.schedule[wait].length] = [command, args];
                }
                return true;
            } catch (e) {
                console.error("Error setting command into schedule.\nwait : " + wait + " / command : " + command + " / args : " + args);
                if (chips.g.debug) { debugger; }
                return false;
            }
        },
        turn : function(wait, command, args) {
            wait = (wait || 0);

            if (wait === 0) {
                return this.frame(0, command, args);
            } else {
                // The length of one turn in ms is a constant that we already know,
                // so we can reliably schedule ahead by that
                return this.time(wait * chips.g.turnTime, command, args);
            }
        }
    },

    getBy : {
        time : function(skip) {
            skip = (skip || 0);

            if (skip === 0) {
                return this.frame(0);
            } else {
                var framesAhead = Math.floor((chips.g.frame % (1000 / chips.vars.fps) + skip) / (1000 / chips.vars.fps));
                return this.frame(framesAhead);
            }
        },
        frame : function(skip) {
            skip = (skip || 0);
            return chips.commands.schedule[skip];
        },
        turn : function(skip) {
            skip = (skip || 0);

            if (skip === 0) {
                return this.frame(0);
            } else {
                return this.time(skip * chips.g.turnTime);
            }
        }
    },

    // Executes the next batch of commands in the queue
    // TODO: execution needs to paused while the game is paused
    execute : function() {
        if (typeof this.schedule[0] != "undefined") {
            for (var i = 0; i < this.schedule[0].length; i++) {
                if (typeof this.lib[this.schedule[0][i][0]] != "undefined") {
                    this.lib[this.schedule[0][i][0]].action(this.schedule[0][i][1]);
                }
            }
            this.schedule.shift();
            return true;
        } else {
            return false;
        }
    },

    // Other possibilities: by time? by # actions (timing varies by speed of entity)?
    schedule : [], // The index of schedule is the relative frame at which to execute the action (with 0 being now)

    /*********************************
     * PART II : THE COMMAND LIBRARY *
     *********************************/

    lib : {}, // This is the command library, defined when the init function is run


    Command : function(func, args) {
        this.action = func;

        this.reset = function() {
            this.state = 0;
        };

        this.reset();
    },

    init : function() {
        this.lib["loadLevel"] = new this.Command(function(args) {
            chips.map.load.level(args[0]);
            this.reset();
        });
        this.lib["startChipsFacingResetDelay"] = new this.Command(function(args) {
            chips.g.cam.chipsFacingReset = chips.vars.chipsFacingResetDelay;
            this.reset();
        });
        this.lib["updateGameframe"] = new this.Command(function(args) {
            chips.draw.gameFrame();
            this.reset();
        });
        this.lib["updateMap"] = new this.Command(function(args) {
            chips.draw.activeMap();
            if (chips.g.debug) { chips.draw.debug(); }
            this.reset();
        });
        this.lib["updateDebug"] = new this.Command(function(args) {
            chips.draw.debug();
            this.reset();
        });
        this.lib["updateHud"] = new this.Command(function(args) {
            chips.draw.hud();
            this.reset();
        });
        this.lib["updateLevelNum"] = new this.Command(function(args) {
            chips.draw.levelNumber();
            this.reset();
        });
        this.lib["updateTime"] = new this.Command(function(args) {
            chips.draw.time();
            this.reset();
        });
        this.lib["updateChipsLeft"] = new this.Command(function(args) {
            chips.draw.chipsLeft();
            this.reset();
        });
        this.lib["updateInventory"] = new this.Command(function(args) {
            chips.draw.inventory();
            this.reset();
        });
        this.lib["toggleHint"] = new this.Command(function(args) {
            this.state = args[0];
            if (this.state > 0) {
                chips.draw.hint();
            } else {
                chips.draw.gameFrame(args);
                chips.draw.hud();
            }
            args = [];
        });
        this.lib["redrawAll"] = new this.Command(function(args) {
            chips.draw.gameFrame();
            chips.draw.activeMap();
            chips.draw.debug();
            chips.draw.hud();
            this.reset();
        });
        this.lib["setGameMessage"] = new this.Command(function(args) {
            document.getElementById("gameMessage").innerHTML = args[0];
            this.reset();
        });
        this.lib["initEvents"] = new this.Command(function(args) {
            chips.events.init();
            this.reset();
        });
        this.lib["syncMonsterList"] = new this.Command(function(args) {
            chips.g.cam.monsters = {};
            chips.g.cam.monsters = new chips.obj.MonsterList();
            chips.g.cam.monsters.sync();
            this.reset();
        });
        this.lib["drawPauseScreen"] = new this.Command(function(args) {
            chips.draw.pauseScreen();
            this.reset();
        });
        this.lib["startMovingChip"] = new this.Command(function(args) {
            // Do not start moving if the game is paused or if chip is "movelocked" (i.e., sliding on ice)
            if (!chips.g.cam.elapsedTime.paused) {
                if (chips.g.moveStreakStart < 0) { // First move in this streak
                    chips.g.cam.player.move(args[0], args[1]);
                    chips.g.moveStreakStart = chips.g.cam.turn;
                    chips.g.cam.player.lastAction = chips.g.moveStreakStart;
                    chips.g.oddStep = chips.g.moveStreakStart % 2; // 0 (false) if even, 1 (true) if odd
                } else { // Other moves in this streak
                    var moveTurnDiff = chips.g.cam.turn - chips.g.cam.player.lastAction;
                    if (moveTurnDiff >= chips.g.cam.player.speed()) {
                        chips.g.cam.player.move(args[0], args[1]);
                        chips.g.cam.player.lastAction = chips.g.cam.turn;
                    }
                }
            }
        });
        this.lib["stopMovingChip"] = new this.Command(function(args) {
            if (chips.g.keylock === 0) {
                chips.g.moveStreakStart = -1; // reset move streak only if no other keys are held down (arrow keys only?)
            }
        });
        this.lib["moveOnNextTurn"] = new this.Command(function(args) {
            var entity = args[0], d = args[1], changeDirection = args[2];
            try {
                if (entity.lastAction < chips.g.cam.turn) {
                    chips.commands.setBy.frame(0, "startMovingChip", [d, changeDirection]); // TODO: This won't work for enemies!
                } else {
                    this.reset();
                    chips.commands.setBy.frame(0, "moveOnNextTurn", [entity, d, changeDirection]);
                }
            } catch (e) {
                if (chips.g.debug) { debugger; }
            }


        });
    }
};