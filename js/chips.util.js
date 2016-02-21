/**
 * Created by Brogan on 1/24/2016.
 */

chips.util = {

    dir : {
        NORTH : 0,
        WEST : 1,
        SOUTH : 2,
        EAST : 3,

        // Use in conjunction with x[0] and y[1] coordinates to modify coords based on a given direction
        // If no direction provided, returns 0 for both x and y
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

        // Returns the dir to the entity's left
        left : function(d) {
            return (d + 1) % 4;
        },

        // Returns the dir to th entity's right
        right : function(d) {
            return (d + 3) % 4;
        },

        // Returns the dir behind the entity
        back : function(d) {
            return (d + 2) % 4;
        },

        // Returns "NORTH", "EAST", etc.
        toString : function(d) {
            switch (d) {
                case this.NORTH:
                    return "NORTH";
                case this.SOUTH:
                    return "SOUTH";
                case this.WEST:
                    return "WEST";
                case this.EAST:
                    return "EAST";
            }
        },

        // Returns all dirs that do not match the one provided; else returns all dirs
        others : function(dirToExclude) {
            var retArray = [this.NORTH, this.SOUTH, this.EAST, this.WEST];

            if (dirToExclude) {
                for (var i = 0; i < retArray.length; i++) {
                    if (retArray[i] === dirToExclude) {
                        retArray.splice(i, 1);
                        break;
                    }
                }
            }

            return retArray;
        },

        // Returns all dirs shuffled for randomized movement (can exclude one dir if provided)
        shuffle : function(dirToExclude) {
            var retArray = this.others(dirToExclude);

            var cur = retArray.length, temp, ran;

            while (cur !== 0) {
                ran = Math.floor(Math.random() * cur);
                cur--;

                temp = retArray[cur];
                retArray[cur] = retArray[ran];
                retArray[ran] = temp;
            }

            return retArray;
        },

        // Given 2 coordinate pairs, find the NSEW direction that would bring them closest together
        // In the case of a tie (perfect diagonal), move vertically (unless otherwise specified!)
        // returns one or two directions in an array, where the first element is the greatest priority direction
        // to take if you want to reach your destination

        approach : function(xSrc, ySrc, xDest, yDest, tiebreaker) {
            if (xSrc === xDest && ySrc === yDest) {
                return false; // coordinates are identical
            }

            if (Math.abs(xDest - xSrc) > Math.abs(yDest - ySrc)) { // X diff is greater magnitude
                if (xDest > xSrc) {
                    if (yDest > ySrc) {
                        return [this.EAST, this.SOUTH];
                    } if (yDest < ySrc) {
                        return [this.EAST, this.NORTH];
                    } else {
                        return [this.EAST];
                    }
                } else {
                    if (yDest > ySrc) {
                        return [this.WEST, this.SOUTH];
                    } if (yDest < ySrc) {
                        return [this.WEST, this.NORTH];
                    } else {
                        return [this.WEST];
                    }
                }
            } else { // Y diff is greater magnitude
                if (yDest > ySrc) {
                    if (xDest > xSrc) {
                        return [this.SOUTH, this.EAST];
                    } if (xDest < xSrc) {
                        return [this.SOUTH, this.WEST];
                    } else {
                        return [this.SOUTH];
                    }
                } else {
                    if (xDest > xSrc) {
                        return [this.NORTH, this.EAST];
                    } if (xDest < xSrc) {
                        return [this.NORTH, this.WEST];
                    } else {
                        return [this.NORTH];
                    }
                }
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

    // bitPlace === entityState.VALUE
    getBit : function(num, bitPlace) {
        return Math.floor(num / (Math.pow(2, bitPlace-1)) % 2);
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

    detectCollision : function(entity, type, direction, distantX, distantY) {
        var d = (typeof direction == "undefined" ? entity.facing() : direction), // If no direction specified, use the enemy's facing as direction (forward)
            x = (typeof distantX == "undefined" ? entity.x : distantX),// An x,y will be specified during a look-ahead for a teleport
            y = (typeof distantY == "undefined" ? entity.y : distantY);
        var distance = (type === "barrier" ? 1 : 0); // If type barrier, get next tile, else get this tile

        if (type === "barrier" && this.edgeCollision(x, y, direction)) { return true; } // If edge of map, that's an immediate barrier

        try {
            var floorData = chips.g.rules[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.FLOOR)]];
            var itemData = chips.g.rules[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.ITEM)]];
            var monsterData = chips.g.rules[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.MONSTER)]];

            var floorCollision, itemCollision, monsterCollision;

            floorCollision = floorData.collision ? (floorData.collision.all || floorData.collision[entity.class]) : false;
            itemCollision = itemData.collision ? (itemData.collision.all || itemData.collision[entity.class]) : false;
            monsterCollision = monsterData.collision ? (monsterData.collision.all || monsterData.collision[entity.class]) : false;

            if (floorCollision && typeof floorCollision[type] == "function") {
                floorCollision = floorCollision[type](entity);
            } else {
                floorCollision = false;
            }

            if (itemCollision && typeof itemCollision[type] == "function") {
                itemCollision = itemCollision[type](entity);
            } else {
                itemCollision = false;
            }

            if (monsterCollision && typeof monsterCollision[type] == "function") {
                monsterCollision = monsterCollision[type](entity);
            } else {
                monsterCollision = false;
            }
        } catch (e) {
            console.error("Failure to execute " + type + " collision of " + entity.name + ":\n" + e);
            if (chips.g.debug) { debugger; }
            return false;
        }

        return floorCollision || itemCollision || monsterCollision;
    },

    arrayDeepCopy : function(array) {
        var ret = [];

        var i;
        for (i = 0; i < array.length; i++) {
            ret[i] = array[i];
        }

        return ret;
    },

    arrayDeepCopy2d : function(array) {
        var ret = [];

        var i, j;
        for (i = 0; i < array.length; i++) {
            ret[i] = [];
            for (j = 0; j < array[i].length; j++) {
                ret[i][j] = array[i][j];
            }
        }

        return ret;
    },

    arrayContains : function(array, element) {
        for (var i = 0; i < array.length; i++) {
            if (array[i] === element) {
                return true;
            }
        }
        return false;
    }
};

