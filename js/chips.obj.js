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

    var InventoryMap = function(tData) {
        for (var i in tData) {
            if (!tData.hasOwnProperty(i)) { continue; }
            if (tData[i].type === "item" && tData[i].inventory && tData[i].inventory.slot >= 0) {
                this[i] = {
                    "quantity": 0,
                    "slot": tData[i].inventory.slot
                }
            }
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
            chips.g.cam.updateTurn(); // TODO: I feel like this *shouldn't* go here...
            if (Math.floor(this.elapsed_ms / 1000) > this.elapsed_sec) {
                this.elapsed_sec = Math.floor(this.elapsed_ms / 1000);
                return true;
            }
            return false;
        };

        this.forcePause = function() {
            this.paused = Date.now();
            chips.vars.requests.add("drawPauseScreen");
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
                    chips.vars.requests.add("redrawAll");
                } else {
                    this.paused = Date.now();
                    chips.vars.requests.add("drawPauseScreen");
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
            $.each(list, function(i, monster) {
                if (list.hasOwnProperty(i)) {
                    if (monster.name === name) {
                        retArray[retArray.length] = monster;
                    }
                }
            });
            return retArray;
        },

        getAll : function() {
            return this.list;
        },

        add : function(x, y, tile) {
            var thisMonster = chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.MONSTER), uid = this.getUID();
            this.list[uid] = new chips.obj.Monster(uid, chips.g.tLookup[thisMonster], thisMonster, x, y);
        },

        remove : function(id) {
            delete this.list[id];
        }
    };

    var Monster = function(id, name, tile, x, y) {
        this.id = id;
        this.name = name;
        this.tile = tile;
        this.x = x;
        this.y = y;

        this.speed = function() {
            return chips.data.tiles[this.name].speed;
        };

        this.facing = function() {
            // TODO: avoid magic numbers (4)
            return chips.util.getLayerCoord(this.tile, 4) % 4;
        };

        // PROCESSING NON-BEHAVIORAL ACTIONS

        this.actionQueue = [];
        this.actionTiming = [];


    };

    Monster.prototype = {
        constructor : Monster,

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
            var pattern = chips.data.tiles[this.name].triggers.patterns[patternName];

            if (interrupt) {
                this.actionQueue = [];
                this.actionTiming = [];
            }

            for (var i = 0; i < pattern.length; i += 2) {
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
                    if (!chips.data.tiles[this.name].triggers.actions[this.actionQueue[0]](this)) {
                        this.removeAction();
                    }
                }

                // If timing is POSITIVE, the action counts DOWN to 0 each move iteration
                // At 0, the action is performed once, then removed from the queue

                if (this.actionTiming[0] > 0) {
                    this.actionTiming[0]--;
                } else if (this.actionTiming[0] === 0) {
                    var ret = chips.data.tiles[this.name].triggers.actions[this.actionQueue[0]](this);
                    this.removeAction();
                }

                return true; // There was at least one pending action to perform
            }
        },

        // ACTING METHODS

        // Using this method will ensure that the Monster's tile property and the board
        // tile are updated at the same time

        set : function(tile) {
            this.tile = chips.g.cam.setTileLayer(this.x, this.y, chips.draw.LAYER.MONSTER, tile);
            return this.tile;
        },

        turn : function(d) {
            // TODO: Mathematical approach?
            return this.set(chips.g.tiles[this.name + "_" + chips.util.dir.toString(d)])
        },

        move : function(d, changeDirection) {
            var cd = (changeDirection || true);

            if (cd) {
                this.turn(d); // Updates this.tile during the turn
            }

            var hasLockingCollision = chips.util.detectCollision("monster", "locking", this.x, this.y, d);
            var hasBarrierCollision = chips.util.detectCollision("monster", "barrier", this.x, this.y, d);

            if (!hasLockingCollision && !hasBarrierCollision) {
                // Clear out the old tile's monster layer
                chips.g.cam.clearTileLayer(this.x, this.y, chips.draw.LAYER.MONSTER);

                // Update this Monster's location
                this.x += chips.util.dir.mod(d)[0];
                this.y += chips.util.dir.mod(d)[1];

                // Draw this Monster in its new location
                chips.g.cam.setTileLayer(this.x, this.y, chips.draw.LAYER.MONSTER, this.tile);

                chips.util.detectCollision("monster", "interactive", this.x, this.y, d, this.id);
                return true;
            } else {
                return false;
            }
        },

        kill : function() {
            chips.g.cam.clearTileLayer(this.x, this.y, chips.draw.LAYER.MONSTER);
            chips.g.cam.monsters.remove(this.id);
            return true;
            // This monster object is now floating out there in javaspace... what to do with it?
        }
    };

    var Player = function() {

    };

    return {
        TileMap : TileMap,
        ReverseTileMap : ReverseTileMap,
        InventoryMap : InventoryMap,
        Timer : Timer,

        MonsterList : MonsterList,
        Monster : Monster,
        Player : Player
    };
})();