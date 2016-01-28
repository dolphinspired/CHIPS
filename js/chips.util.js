/**
 * Created by Brogan on 1/24/2016.
 */

chips.util = {

    dir : {
        NORTH : 0,
        WEST : 1,
        SOUTH : 2,
        EAST : 3,

        mod : function(direction) {
            switch (direction) {
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

    // The Date.now() approach might not allow for level pausing...
    LevelTimer : function() {
        this.start = Date.now();
        this.elapsed_ms = 0;
        this.elapsed_sec = 0;

        this.paused = 0;
        this.paused_ms = 0;

        // TODO: Rewrite functions using the prototype approach

        // True if sec was updated, false if not
        this.tick = function() {
            if (this.paused) { this.pauseTick(); }
            this.elapsed_ms = Date.now() - this.start - this.paused_ms;
            if (Math.floor(this.elapsed_ms / 1000) > this.elapsed_sec) {
                this.elapsed_sec = Math.floor(this.elapsed_ms / 1000);
                return true;
            }
            return false;
        };

        this.pause = function() {
            if (this.paused) {
                this.paused = 0;
            } else {
                this.paused = Date.now();
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

    edgeCollision : function(moveDir) {
        if (moveDir === chips.util.dir.WEST && chips.g.cam.chip.x === 0) { return true; }
        if (moveDir === chips.util.dir.NORTH && chips.g.cam.chip.y === 0) { return true; }
        if (moveDir === chips.util.dir.EAST && chips.g.cam.chip.x === chips.g.cam.width - 1) { return true; }
        if (moveDir === chips.util.dir.SOUTH && chips.g.cam.chip.y === chips.g.cam.height - 1) { return true; }
        return false;
    },

    detectCollision : function(entity, type, x, y, d) {
        if (type === "barrier" && this.edgeCollision(d)) { return true; }

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
                floorCollision = floorCollision[type](x, y, d);
            } else {
                floorCollision = false;
            }

            if (itemCollision && typeof itemCollision[type] == "function") {
                itemCollision = itemCollision[type](x, y, d);
            } else {
                itemCollision = false;
            }

            if (enemyCollision && typeof enemyCollision[type] == "function") {
                enemyCollision = enemyCollision[type](x, y, d);
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

