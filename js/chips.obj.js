/**
 * Created by Brogan on 2/2/2016.
 */

chips.obj = (function() {

    var TileMap = function(tData) {
        for (var i in tData) {
            if (!tData.hasOwnProperty(i)) { continue; }
            if (typeof tData[i].value !== "object") {
                this[i] = tData[i].value;
            } else {
                for (var j in tData[i].value) {
                    if (!tData[i].value.hasOwnProperty(j)) { continue; }
                    this[i + "_" + j.toUpperCase()] = tData[i].value[j];
                }
            }
        }
    };

    var ReverseTileMap = function(tData) {
        for (var i in tData) {
            if (!tData.hasOwnProperty(i)) { continue; }
            if (typeof tData[i].value !== "object") {
                this[tData[i].value] = i;
            } else {
                for (var j in tData[i].value) {
                    if (!tData[i].value.hasOwnProperty(j)) { continue; }
                    this[tData[i].value[j]] = i;
                }
            }
        }
    };

    var Inventory = function(ruleset) {
        this.items = {};

        for (var i in ruleset) {
            if (!ruleset.hasOwnProperty(i)) { continue; }
            if (ruleset[i].type === "item" && ruleset[i].inventory && ruleset[i].inventory.slot >= 0) {
                this.items[i] = {
                    "name" : i,
                    "quantity" : 0,
                    "slot" : ruleset[i].inventory.slot
                }
            }
        }
    };

    Inventory.prototype = {
        constructor : Inventory,

        addItem : function(item) {
            this.items[item].quantity++;
            chips.commands.schedule.frames.set("updateInventory");
        },

        removeItem : function(item, removeAll) {
            if (removeAll) {
                this.items[item].quantity = 0;
            } else if (this.items[item].quantity > 0) {
                this.items[item].quantity--;
            }
            chips.commands.schedule.frames.set("updateInventory");
        }
    };

    var Timer = function() {
        this.start = Date.now();
        this.elapsed_ms = 0;
        this.elapsed_sec = 0;

        this.paused = 0;
        this.paused_ms = 0;
        this.paused_forced = false;

        // True if sec ("Time left") needs to be update updated, false if not
        this.tick = function() {
            if (this.paused) { this.pauseTick(); }
            this.elapsed_ms = Date.now() - this.start - this.paused_ms;
            if (Math.floor(this.elapsed_ms / 1000) > this.elapsed_sec) {
                this.elapsed_sec = Math.floor(this.elapsed_ms / 1000);
                return true;
            }
            return false;
        };

        this.forcePause = function() {
            this.paused = Date.now();
            chips.commands.schedule.frames.set("drawPauseScreen");
            this.paused_forced = true;
        };

        this.forceUnpause = function() {
            // Does not unpause the game, only allows manual unpausing
            this.paused_forced = false;
        };

        this.togglePause = function() {
            if (!this.paused_forced) {
                if (this.paused) {
                    this.paused = 0;
                    chips.commands.schedule.frames.set("redrawAll");
                } else {
                    this.paused = Date.now();
                    chips.commands.schedule.frames.set("drawPauseScreen");
                }
            }
        };

        this.pauseTick = function() {
            this.paused_ms += Date.now() - this.paused;
            this.paused = Date.now();
        }
    };

    var MonsterList = function() {
        var uid = 0; // unique ID to this MonsterList

        this.getUID = function() {
            return uid++;
        };

        this.list = [];
    };

    MonsterList.prototype = {
        constructor : MonsterList,

        sync : function() {
            var allMonsters = chips.g.cam.findTilesByLayer(chips.draw.LAYER.MONSTER);
            for (var i = 0; i < allMonsters.length; i++) {
                this.add(allMonsters[i][0], allMonsters[i][1]);
            }
        },

        getMonsterById : function(id) {
            return this.list[id];
        },

        getMonstersByName : function(name) {
            var retArray = [], list = this.list;

            for (var monster in list) {
                if (!list.hasOwnProperty(monster)) { continue; }
                if (list[monster].name === name) {
                    retArray[retArray.length] = list[monster];
                }
            }

            return retArray;
        },

        getAll : function() {
            return this.list;
        },

        add : function(x, y, tile) {
            var thisMonster = chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.MONSTER), uid = this.getUID();
            this.list[uid] = new Monster(uid, chips.g.tLookup[thisMonster], thisMonster, x, y);
        },

        remove : function(id) {
            delete this.list[id];
        }
    };

    var Monster = function(id, name, tile, x, y) {
        this.id = id;
        this.class = "monster";
        this.name = name;
        this.tile = tile;
        this.x = x;
        this.y = y;

        this.state = chips.vars.entityState.FREE;
        this.lastAction = 0;

        this.speed = function() {
            return chips.g.rules[this.name].speed;
        };

        this.facing = function() {
            // TODO: avoid magic numbers (4)
            return chips.util.getLayerCoord(this.tile, 4) % 4;
        };

        // MONSTER-SPECIFIC (AI)

        this.actionQueue = [];
        this.actionTiming = [];


    };

    Monster.prototype = {
        constructor : Monster,

        getState : function(stateInQuestion) {
            return Entity.getState(this, stateInQuestion);
        },

        setState : function(stateToChange, targetState) {
            return Entity.setState(this, stateToChange, targetState);
        },

        updateState : function() {
            return Entity.updateState(this);
        },

        hasItem : function(item) {
            return false; // enemies do not have any items
        },

        addAction : function(action, wait) {
            this.actionQueue[this.actionQueue.length] = action;
            this.actionTiming[this.actionTiming.length] = (wait || 0);
        },

        removeAction : function() {
            this.actionQueue.shift();
            this.actionTiming.shift();
        },

        addPattern : function(patternName, interruptCurrentPattern) {
            var interrupt = (interruptCurrentPattern || false);
            var pattern = chips.g.rules[this.name].triggers.patterns[patternName];
            var i;

            // TODO: This might need tweaking if certain actions should be non-interruptable
            if (interrupt) {
                this.actionQueue = [];
                this.actionTiming = [];
            }

            for (i = 0; i < pattern.length; i += 2) {
                this.addAction(pattern[i], pattern[i+1]);
            }
        },

        performAction : function() {
            if (this.actionTiming.length <= 0) {
                return false; // There were no actions to perform
            } else {

                // If timing is NEGATIVE, the action counts UP to -1 each move iteration
                // At -1, the action repeats indefinitely until it returns false

                if (this.actionTiming[0] < -1) {
                    this.actionTiming[0]++;
                } else if (this.actionTiming[0] === -1) {
                    if (!chips.g.rules[this.name].triggers.actions[this.actionQueue[0]](this)) {
                        this.removeAction();
                    }
                }

                // If timing is POSITIVE, the action counts DOWN to 0 each move iteration
                // At 0, the action is performed once, then removed from the queue

                if (this.actionTiming[0] > 0) {
                    this.actionTiming[0]--;
                } else if (this.actionTiming[0] === 0) {
                    var ret = chips.g.rules[this.name].triggers.actions[this.actionQueue[0]](this);
                    this.removeAction();
                }

                this.lastAction = chips.g.cam.turn;
                return true; // There was at least one pending action to perform
            }
        },

        // ACTING METHODS

        // Using this method will ensure that the Monster's tile property and the board
        // tile are updated at the same time

        set : function(tile) {
            return Action.set(this, tile);
        },

        unset : function() {
            return Action.unset(this);
        },

        turn : function(d) {
            return Action.turn(this, d);
        },

        move : function(d, changeDirection) {
            return Action.move(this, d, changeDirection);
        },

        teleport : function(x, y) {
            return Action.teleport(this, x, y);
        },

        kill : function() {
            this.unset();
            chips.g.cam.monsters.remove(this.id);
            // This monster object is now floating out there in javaspace... what to do with it?
            return true;
        }
    };

    var Player = function(tile, x, y) {
        this.id = 0;
        this.class = "player";
        this.name = "CHIP";
        this.tile = tile;
        this.x = x;
        this.y = y;

        this.state = chips.vars.entityState.FREE;
        this.lastAction = 0;

        this.speed = function() {
            return chips.g.rules[this.name].speed;
        };

        this.facing = function() {
            // TODO: avoid magic numbers (6)
            return chips.util.getLayerCoord(this.tile, 6) % 4;
        };

        // PLAYER-SPECIFIC

        this.inventory = new Inventory(chips.g.rules);
    };

    Player.prototype = {
        constructor : Player,

        getState : function(stateInQuestion) {
            return Entity.getState(this, stateInQuestion);
        },

        setState : function(stateToChange, targetState) {
            return Entity.setState(this, stateToChange, targetState);
        },

        updateState : function() {
            return Entity.updateState(this);
        },

        hasItem : function(item) {
            return this.inventory.items[item].quantity > 0;
        },

        set : function(tile) {
            return Action.set(this, tile);
        },

        unset : function() {
            return Action.unset(this);
        },

        turn : function(d) {
            return Action.turn(this, d);
        },

        move : function(d, changeDirection) {
            var ret = Action.move(this, d, changeDirection);
            chips.g.cam.view.update();
            return ret;
        },

        slide : function(d, changeDirection) {
            return Action.slide(this, d, changeDirection);
        },

        teleport : function(x, y) {
            var ret = Action.teleport(this, x, y);
            chips.g.cam.view.update();
            return ret;
        },

        kill : function(msg) {
            if (!msg) { msg = "Oh dear, you are dead!" }
            chips.commands.schedule.frames.set("setGameMessage", [msg]); // TODO: Enhance
            chips.g.cam.reset();
            chips.commands.schedule.frames.set("redrawAll");
        },

        swim : function(inWater) {
            if (inWater) {
                // TODO: Put the swim diff somewhere
                var swimTile = this.tile + 10000000;
                this.tile = chips.g.cam.setTileLayer(this.x, this.y, chips.draw.LAYER.CHIP, swimTile);
                this.name += "_SWIM";
                return this.tile;
            } else {
                var dryTile = this.tile - 10000000;
                this.tile = chips.g.cam.setTileLayer(this.x, this.y, chips.draw.LAYER.CHIP, dryTile);
                this.name = this.name.substring(0, this.name.indexOf("_SWIM"));
                return this.tile;
            }
        }
    };

    var Action = {
        getLayer : function(entity) {
            return entity.class === "player" ? chips.draw.LAYER.CHIP : chips.draw.LAYER.MONSTER;
        },

        set : function(entity, tile) {
            var tileToSet = (tile || entity.tile);
            var layerToSet = this.getLayer(entity);
            chips.g.cam.setTileLayer(entity.x, entity.y, layerToSet, tileToSet);
            entity.tile = chips.g.cam.getTileLayer(entity.x, entity.y, layerToSet);
            return entity;
        },

        unset : function(entity) {
            var layerToSet = this.getLayer(entity);
            chips.g.cam.clearTileLayer(entity.x, entity.y, layerToSet);
            return entity;
        },

        turn : function(entity, d) {
            // TODO: Mathematical approach?
            return entity.set(chips.g.tiles[entity.name + "_" + chips.util.dir.toString(d)])
        },

        move : function(entity, d, changeDirection) {
            if (typeof d == "undefined" ) {
                d = entity.facing(); // If no direction specified, move forward
            }

            var cd = (changeDirection || true);
            var retVal;

            if (cd) {
                entity.turn(d); // Updates entity.tile during the turn
            }

            var hasUnloadCollision = chips.util.detectCollision(entity, "unload", d);
            var hasLockingCollision = chips.util.detectCollision(entity, "locking", d);
            var hasBarrierCollision = chips.util.detectCollision(entity, "barrier", d);

            if (!hasLockingCollision && !hasBarrierCollision) {
                entity.unset();
                entity.x += chips.util.dir.mod(d)[0];
                entity.y += chips.util.dir.mod(d)[1];
                entity.set();
                chips.util.detectCollision(entity, "interactive", d);
                entity.lastAction = chips.g.cam.turn;
                retVal = entity;
            } else {
                retVal = false;
            }

            entity.updateState();
            return retVal;
        },

        slide : function(entity, d, changeDirection) {
            chips.commands.schedule.turns.set("forceMove", [entity, d, changeDirection], 1);
            return entity;
        },

        teleport : function(entity, x, y) {
            if (chips.x !== x || chips.y !== y) {
                chips.commands.schedule.frames.set("updateMap"); // If entity's location changes, update the map
            }
            entity.unset();
            entity.x = x;
            entity.y = y;
            entity.set();
            chips.util.detectCollision(entity, "interactive");
            return entity;
        }
    };

    var Entity = {
        // If stateInQuestion is not specified, returns the sum of all states
        getState : function(entity, stateInQuestion) {
            if (typeof stateInQuestion == "undefined") {
                return entity.state;
            } else {
                return chips.util.getBit(entity.state, stateInQuestion);
            }
        },

        // If targetState not specified, the state is toggled
        setState : function(entity, stateToChange, targetState) {
            var currentState = chips.util.getBit(entity.state, stateToChange);
            var target;

            if (typeof targetState == "undefined" ) {
                target = !currentState;
            } else {
                target = targetState;
            }

            if (currentState && !target) {
                entity.state -= stateToChange;
            } else if (!currentState && target) {
                entity.state += stateToChange;
            }
            return true;
        },

        updateState : function(entity) {
            try {
                var thisTile = chips.g.tLookup[chips.g.cam.getTileLayer(entity.x, entity.y, chips.draw.LAYER.FLOOR)];
                var thisTileProperties = chips.g.rules[thisTile].properties;
                var tempState;

                // 1: Item-based states
                // TODO: This could be more modular
                tempState = entity.hasItem("SKATE");
                entity.setState(chips.vars.entityState.ICEPROOF, tempState);

                tempState = entity.hasItem("SUCTIONSHOES");
                entity.setState(chips.vars.entityState.FORCEPROOF, tempState);

                // 2: Tile-based states
                tempState = (thisTileProperties && thisTileProperties.slippery);
                tempState = (tempState && (thisTileProperties.icy && !entity.getState(chips.vars.entityState.ICEPROOF)));
                tempState = (tempState && (thisTileProperties.forceful && !entity.getState(chips.vars.entityState.FORCEPROOF)));
                tempState = (tempState || false);
                entity.setState(chips.vars.entityState.SLIDING, tempState);

                tempState = (thisTileProperties && (thisTileProperties.icy && !entity.getState(chips.vars.entityState.ICEPROOF)));
                tempState = (tempState || false);
                entity.setState(chips.vars.entityState.MOVELOCKED, tempState);
            } catch (e) {
                if (chips.g.debug) { debugger; }
            }
        }
    };

    return {
        TileMap : TileMap,
        ReverseTileMap : ReverseTileMap,
        Timer : Timer,

        MonsterList : MonsterList,
        Player : Player
    };
})();