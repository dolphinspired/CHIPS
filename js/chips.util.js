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
    }
};

