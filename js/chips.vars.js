/**
 * Created by Brogan on 1/25/2016.
 */

chips.vars = {
    gameWindowHeight : 352,
    gameWindowWidth : 512,

    fps : 60,

    pauseOnLoseFocus : true,

    defaultGameMessage : "Welcome to Chip's Tribute!",

    gameWindowURL : "img/window.png",
    atlasURL : "img/default_tileset.png",
    hudsetURL : "img/default_hudset.png",
    levelsetURL : "levels/",

    turnTime_ms : 100,
    chipsFacingResetDelay : 3, // # of turns before Chip faces south again

    boardOffsetX_px : 32,
    boardOffsetY_px : 32,
    boardWidth_tiles : 9,
    boardHeight_tiles : 9,

    inventoryOffsetX_px : 352,
    inventoryOffsetY_px : 247,
    inventoryWidth_tiles : 4,
    inventoryHeight_tiles : 2,

    hudDigitWidth_px : 13,
    hudDigitHeight_px : 21,
    hudDigitSpacingX_px : 4,
    hudDigitSpacingY_px : 1,
    hudLevelNumOffsetX_px : 388,
    hudLevelNumOffsetY_px : 64,
    hudLevelNumWarningThreshold : -1,
    hudTimeOffsetX_px : 388,
    hudTimeOffsetY_px : 126,
    hudTimeWarningThreshold : 20,
    hudChipsLeftOffsetX_px : 388,
    hudChipsLeftOffsetY_px : 216,
    hudChipsLeftWarningThreshold : 0,
    hudHintOffsetX_px : 352,
    hudHintOffsetY_px : 170,
    hudHintWidth_px : 128,
    hudHintHeight_px : 140,
    hudHintPadding_px : 5,
    hudHintColor : "cyan",
    hudHintFont : "italic bold 11pt Arial",
    hudColorNormal : "green",
    hudColorWarning : "yellow",


    keys : {
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        ENTER: 13,
        SHIFT: 16,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        BACKSPACE: 8,
        DELETE: 46
    },

    gameState : {
        FIRSTLOAD : 0,

        TITLE : 100,

        LEVEL_LOAD : 200,
        LEVEL_ACTIVE : 210,
        LEVEL_PAUSED : 211,
        LEVEL_FAIL : 212,
        LEVEL_SUCCESS : 220,

        GAME_SUCCESS : 900
    },

    entityState : {
        FREE : 0,
        SLIDING : 1,        // Movement is forced forward
        MOVELOCKED : 2      // Player movement input is ignored
    },

    requests : {
        GameRequest : function(func) {
            this.action = func;

            this.reset = function() {
                this.state = 0;
                this.args = [];
            };

            this.reset();
        },
        add : function(req, args) {
            try {
                if (args && typeof args[0] != "undefined") {
                    for (var i = 0; i < args.length; i++) {
                        this[req].args[this[req].args.length] = args[i];
                    }
                }
            } catch(e) {
                console.trace(e);
                if (chips.g.debug) { debugger; }
            }

            this.pendingRequests[this.pendingRequests.length] = req;

            if (chips.g.logRequests && !chips.util.arrayContains(chips.g.excludeRequestsFromLogging, req)) {
                var msg = "Request \"" + req + "\" added on t" + (chips.g.cam.turn || -1) + "/f" + (chips.g.frame);
                if (args) {
                    msg += "\nArgs: [" + args + "]";
                }
                console.log(msg);
                if (req === "moveOnNextTurn" && typeof args[0] == "undefined") { debugger; }
            }
        },
        process : function() {
            var activeRequests = chips.util.arrayDeepCopy(this.pendingRequests);
            var processedRequests = [];
            this.pendingRequests = [];

            for (var i = 0; i < activeRequests.length; i++) {
                if (!chips.util.arrayContains(processedRequests, activeRequests[i])) {
                    this[activeRequests[i]].action();
                    processedRequests[processedRequests.length] = activeRequests[i];
                }
            }

            // Find any requests still pending and add them back
        },

        pendingRequests : [],

        init : function() {
            this["loadLevel"] = new this.GameRequest(function() {
                chips.map.load.level(this.args[0]);
                this.reset();
            });
            this["startChipsFacingResetDelay"] = new this.GameRequest(function() {
                chips.g.cam.chipsFacingReset = chips.vars.chipsFacingResetDelay;
                this.reset();
            });
            this["updateGameframe"] = new this.GameRequest(function() {
                chips.draw.gameFrame();
                this.reset();
            });
            this["updateMap"] = new this.GameRequest(function() {
                chips.draw.activeMap();
                if (chips.g.debug) { chips.draw.debug(); }
                this.reset();
            });
            this["updateDebug"] = new this.GameRequest(function() {
                chips.draw.debug();
                this.reset();
            });
            this["updateHud"] = new this.GameRequest(function() {
                chips.draw.hud();
                this.reset();
            });
            this["updateLevelNum"] = new this.GameRequest(function() {
                chips.draw.levelNumber();
                this.reset();
            });
            this["updateTime"] = new this.GameRequest(function() {
                chips.draw.time();
                this.reset();
            });
            this["updateChipsLeft"] = new this.GameRequest(function() {
                chips.draw.chipsLeft();
                this.reset();
            });
            this["updateInventory"] = new this.GameRequest(function() {
                chips.draw.inventory();
                this.reset();
            });
            this["toggleHint"] = new this.GameRequest(function() {
                this.state = this.args[0];
                if (this.state > 0) {
                    chips.draw.hint();
                } else {
                    chips.draw.gameFrame();
                    chips.draw.hud();
                }
                this.args = [];
            });
            this["redrawAll"] = new this.GameRequest(function() {
                chips.draw.gameFrame();
                chips.draw.activeMap();
                chips.draw.debug();
                chips.draw.hud();
                this.reset();
            });
            this["setGameMessage"] = new this.GameRequest(function() {
                document.getElementById("gameMessage").innerHTML = this.args[0];
                this.reset();
            });
            this["initEvents"] = new this.GameRequest(function() {
                chips.events.init();
                this.reset();
            });
            this["syncMonsterList"] = new this.GameRequest(function() {
                chips.g.cam.monsters = {};
                chips.g.cam.monsters = new chips.obj.MonsterList();
                chips.g.cam.monsters.sync();
                this.reset();
            });
            this["drawPauseScreen"] = new this.GameRequest(function() {
                chips.draw.pauseScreen();
                this.reset();
            });
            this["startMovingChip"] = new this.GameRequest(function() {
                // Do not start moving if the game is paused or if chip is "movelocked" (i.e., sliding on ice)
                if (!chips.g.cam.elapsedTime.paused) {
                    if (chips.g.moveStreakStart < 0) { // First move in this streak
                        chips.g.cam.player.move(this.args[0], this.args[1]);
                        chips.g.moveStreakStart = chips.g.cam.turn;
                        chips.g.cam.player.lastAction = chips.g.moveStreakStart;
                        chips.g.oddStep = chips.g.moveStreakStart % 2; // 0 (false) if even, 1 (true) if odd
                    } else { // Other moves in this streak
                        var moveTurnDiff = chips.g.cam.turn - chips.g.cam.player.lastAction;
                        var thisChip = chips.g.tLookup[chips.g.cam.getChipsTileLayer(chips.draw.LAYER.CHIP)];
                        if (moveTurnDiff >= chips.data.tiles[thisChip].speed) {
                            chips.g.cam.player.move(this.args[0], this.args[1]);
                            chips.g.cam.player.lastAction = chips.g.cam.turn;
                        }
                    }
                }
            });
            this["stopMovingChip"] = new this.GameRequest(function() {
                if (chips.g.keylock === 0) {
                    chips.g.moveStreakStart = -1; // reset move streak only if no other keys are held down (arrow keys only?)
                }
            });
            this["moveOnNextTurn"] = new this.GameRequest(function() {
                var entity = this.args[0], d = this.args[1], changeDirection = this.args[2];
                try {
                    if (entity.lastAction < chips.g.cam.turn) {
                        chips.vars.requests.add("startMovingChip", [d, changeDirection]); // TODO: This won't work for enemies!
                    } else {
                        this.reset();
                        chips.vars.requests.add("moveOnNextTurn", [entity, d, changeDirection]);
                    }
                } catch (e) {
                    if (chips.g.debug) { debugger; }
                }


            });
        }
    }
};