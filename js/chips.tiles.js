/**
 * Created by Brogan on 12/13/2015.
 */

/**
 * function getLayer
 * Gets the full value of one layer of a full tile (
 * Example: getLayer(583920, 2) returns 39 if LAYER_SIZE_BITS == 10
 *
 * @param numTile - tile data
 * @param numLayer - zero-based
 */
function getLayer(numTile, numLayer) {
    var a = getLayerCoord(numTile, 2*numLayer+1) * drawVars.LAYER_SIZE_BITS;
    var b = getLayerCoord(numTile, 2*numLayer);
    return a + b;
}

/**
 * function getLayerCoord
 * Gets a single coordinate digit, as specified, from the specified tile number
 *
 * @param num - tile number to get a coord from
 * @param radixPlace - zero-based number of the coordinate digit to get, starting from the right
 * @returns int - the number of the coordinate/digit, will be from 0 to LAYER_SIZE_BITS-1
 */
function getLayerCoord(num, radixPlace) {
    return Math.floor(num / (Math.pow(drawVars.LAYER_SIZE_BITS,radixPlace)) % drawVars.LAYER_SIZE_BITS);
}

/**
 * function getAllLayerCoords
 * Gets x,y "digits" for each layer of a tile
 *
 * @param num - number whose digits will be returned in an array
 * @returns array[] - all digits of the provided number, up to NUM_LAYERS * 2 (x,y for each layer)
 */
function getAllLayerCoords(num) {
    var retArray = [];

    for (var i = 0; i < drawVars.NUM_LAYERS * 2; i++) {
        retArray[i] = getLayerCoord(num, i);
    }

    return retArray;
}

// TODO: This currently only works right if Chip is the top layer
function updateChip(tile) {
    if (tile > tiles.CHIP_BASE) {
        currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x] %= tiles.CHIP_BASE;
        currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x] += tile;
    }
}