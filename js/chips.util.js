/**
 * Created by Brogan on 1/24/2016.
 */

chips.util = {

    dir : {
        NORTH : 0,
        WEST : 1,
        SOUTH : 2,
        EAST : 3,

        mod : function(d) {
            switch (d) {
                case this.NORTH:
                    return [0,-1];
                case this.SOUTH:
                    return [0,1];
                case this.WEST:
                    return [-1,0];
                case this.EAST:
                    return [1,0];
                default:
                    return [0,0];
            }
        },

        left : function(d) {
            return (d + 1) % 4;
        },

        right : function(d) {
            return (d + 3) % 4;
        },

        back : function(d) {
            return (d + 2) % 4;
        },

        others : function(d) {
            switch (d) {
                case this.NORTH:
                    return [this.SOUTH, this.WEST, this.EAST];
                case this.SOUTH:
                    return [this.NORTH, this.WEST, this.EAST];
                case this.WEST:
                    return [this.NORTH, this.SOUTH, this.EAST];
                case this.EAST:
                    return [this.NORTH, this.SOUTH, this.WEST];
                default:
                    return [this.NORTH, this.SOUTH, this.WEST, this.EAST];
            }
        }
    },

    /**
     * function getLayer
     * Gets the full value of one layer of a full tile (
     * Example: getLayer(583920, 2) returns 39 if LAYER_SIZE_BITS == 10
     *
     * @param numTile - tile data
     * @param numLayer - zero-based
     */
    "getLayer" : function(numTile, numLayer) {
        var a = chips.util.getLayerCoord(numTile, 2*numLayer+1) * chips.draw.LAYER_SIZE_BITS;
        var b = chips.util.getLayerCoord(numTile, 2*numLayer);
        return a + b;
    },

    /**
     * function getLayerCoord
     * Gets a single coordinate digit, as specified, from the specified tile number
     *
     * @param num - tile number to get a coord from
     * @param radixPlace - zero-based number of the coordinate digit to get, starting from the right
     * @returns int - the number of the coordinate/digit, will be from 0 to LAYER_SIZE_BITS-1
     */
    "getLayerCoord" : function(num, radixPlace) {
        return Math.floor(num / (Math.pow(chips.draw.LAYER_SIZE_BITS,radixPlace)) % chips.draw.LAYER_SIZE_BITS);
    },

    "getLayerBase" : function(layer) {
        return Math.pow(chips.draw.LAYER_SIZE_BITS,2*layer);
    },

    /**
     * function getAllLayerCoords
     * Gets x,y "digits" for each layer of a tile
     *
     * @param num - number whose digits will be returned in an array
     * @returns array[] - all digits of the provided number, up to NUM_LAYERS * 2 (x,y for each layer)
     */
    "getAllLayerCoords" : function(num) {
        var retArray = [];

        for (var i = 0; i < chips.draw.NUM_LAYERS * 2; i++) {
            retArray[i] = chips.util.getLayerCoord(num, i);
        }

        return retArray;
    },

    TileMap : function(tData) {
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
    },

    ReverseTileMap : function(tData) {
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
    },

    InventoryMap : function(tData) {
        for (var i in tData) {
            if (!tData.hasOwnProperty(i)) { continue; }
            if (tData[i].type === "item" && tData[i].inventory && tData[i].inventory.slot >= 0) {
                this[i] = {
                    "quantity": 0,
                    "slot": tData[i].inventory.slot
                }
            }
        }
    },

    EnemyMap : function() {
        var enemyUID = 0; // unique ID to this EnemyMap

        this.list = {};

        this.sync = function() {
            var allEnemies = chips.g.cam.findTilesByLayer(chips.draw.LAYER.ENEMY);
            for (var i = 0; i < allEnemies.length; i++) {
                this.add(allEnemies[i][0], allEnemies[i][1]);
            }
        };

        this.add = function(x, y) {
            var thisEnemy = chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.ENEMY);
            this.list[enemyUID] = {
                name : chips.g.tLookup[thisEnemy],
                tile : thisEnemy,
                x : x,
                y : y
            };
            enemyUID++;
        };

        this.update = function(id, x, y, tile) {
            this.list[id].x = x;
            this.list[id].y = y;
            this.list[id].tile = tile;
        };

        this.remove = function(id) {
            delete this.list[id];
        };
    },

    // The Date.now() approach might not allow for level pausing...
    LevelTimer : function() {
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
    },

    getKeyByValue : function(obj, value, valueField, returnWholeObject) {
        var r = (returnWholeObject || false);

        if (valueField) {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) { continue; }
                if (obj[i][valueField] === value) {
                    return r ? obj[i] : i;
                }
            }
        } else {
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) { continue; }
                if (obj[i] === value) {
                    return r ? obj[i] : i;
                }
            }
        }
    },

    edgeCollision : function(x, y, d) {
        if (d === chips.util.dir.WEST && x === 0) { return true; }
        if (d === chips.util.dir.NORTH && y === 0) { return true; }
        if (d === chips.util.dir.EAST && x === chips.g.cam.width - 1) { return true; }
        if (d === chips.util.dir.SOUTH && y === chips.g.cam.height - 1) { return true; }
        return false;
    },

    detectCollision : function(entity, type, x, y, d, id) {
        if (type === "barrier" && this.edgeCollision(x, y, d)) { return true; } // If edge of map, that's an immediate barrier

        var distance = (type === "barrier" ? 1 : 0); // If type barrier, get next tile, else get this tile

        try {
            var floorData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.FLOOR)]];
            var itemData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.ITEM)]];
            var enemyData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.ENEMY)]];

            var floorCollision, itemCollision, enemyCollision;

            floorCollision = floorData.collision ? (floorData.collision.all || floorData.collision[entity]) : false;
            itemCollision = itemData.collision ? (itemData.collision.all || itemData.collision[entity]) : false;
            enemyCollision = enemyData.collision ? (enemyData.collision.all || enemyData.collision[entity]) : false;

            if (floorCollision && typeof floorCollision[type] == "function") {
                floorCollision = floorCollision[type](x, y, d, id);
            } else {
                floorCollision = false;
            }

            if (itemCollision && typeof itemCollision[type] == "function") {
                itemCollision = itemCollision[type](x, y, d, id);
            } else {
                itemCollision = false;
            }

            if (enemyCollision && typeof enemyCollision[type] == "function") {
                enemyCollision = enemyCollision[type](x, y, d, id);
            } else {
                enemyCollision = false;
            }
        } catch (e) {
            console.error(e);
            if (chips.g.debug) { debugger; }
            return false;
        }

        return floorCollision || itemCollision || enemyCollision;
    }
};

