/**
 * Created by Brogan on 10/13/2015.
 */

/**
 * function loadReferenceImage
 * Creates a hidden canvas and loads an image onto it.
 * This is the staging canvas for drawing images onto the main canvas (tile atlas, etc.).
 *
 * @param url - url of the image to load onto the hidden canvas
 * @param id - id of the new div and canvas to create, appended to the string "refDiv"/"refCanvas"
 */
function loadReferenceImage(url, id) {

    $("body").append("<div id='refDiv" + id + "' style='display:none'>" +
        "<canvas id='refCanvas" + id + "'></canvas></div>");

    var rCanvas = document.getElementById("refCanvas" + id);
    var rContext = rCanvas.getContext("2d");

    var imgObj = new Image();
    imgObj.src = url;

    $(imgObj).on("load", function() {
        rCanvas.width = this.width;
        rCanvas.height = this.height;
        rContext.drawImage(imgObj,0,0);
    });

}

/**
 * function loadLevel
 * Finds the 2d array corresponding with the function's argument.
 * Stores that array as an ActiveMap object in currentActiveMap.
 *
 * @param levelNumber - number of the level array to load into memory
 * @returns {*}
 */
function loadLevel(levelNumber) {
    var lvl = levelNumber;

    return loadLevel_test(lvl);
}

function loadNextLevel() {
    // TODO: Update for non-test levels
    if (currentActiveMap.levelNum < numTestLevels) {
        addRequest("loadLevel", parseInt(currentActiveMap.levelNum) + 1);
    } else {
        addRequest("loadLevel", 0);
    }
}

/**
 * function loadLevel_test
 * Used for simply loading hard-coded test levels into memory as ActiveMap objects.
 * These levels are stored in chips.testData.js
 *
 * @param levelNumber - an int 0-9
 */
function loadLevel_test(levelNumber) {

    oTestLevel = eval("levelTest" + levelNumber);
    currentActiveMap = new ActiveMap(oTestLevel, levelNumber);

}

/**
 * [Object] function ActiveMap
 * Creates an object that holds all information needed to render the current level.
 * The instance of ActiveMap that is drawn on the board is stored in currentActiveMap (global).
 *
 * @param aLevel - a 2D array of integers
 * @param levelNum - the
 * @constructor
 */
function ActiveMap(aLevel, levelNum) {
    this.number = (levelNum ? levelNum : -1); // Stage number, if defined
    this.inventory = [];

    var x, y;

    // TODO: freeze original x,y so they cannot be altered?
    this.chip_x_original = -1;
    this.chip_y_original = -1;

    // Then, grab (and validate) the actual values to be used for calculations
    this.levelNum = (parseInt(aLevel[0][2]) === "NaN" ? -1 : parseInt(aLevel[0][2]));
    this.time = (parseInt(aLevel[0][3]) === "NaN" ? -1 : parseInt(aLevel[0][3]));
    this.chipsLeft = (parseInt(aLevel[0][4]) === "NaN" ? -1 : parseInt(aLevel[0][4]));

    // Disallow 0 as a base time
    if (this.time === 0) {
        this.time = -1;
    }

    // Start a new timer to track the time elapsed while in this level
    this.elapsedTime = new InitializeLevelTimer();

    // Now for the remaining non-numeric info
    this.name = aLevel[0][0];
    this.password = aLevel[0][1];
    this.hint = aLevel[0][5];
    this.tilePairings = assignTilePairingsFromString(aLevel[0][6]); // Doesn't do anything yet

    // THE MAP
    // Deep copy the 2d array into the activeMap object
    // Set activeMap properties while you're at it
    this.level = [[]];
    for (y = 1; y < aLevel.length; y++) {
        if (!this.level[y-1]) { this.level[y-1] = [] }
        for (x = 0; x < aLevel[y].length; x++) {
            this.level[y-1][x] = aLevel[y][x]; // inserted at y-1 to account for header row
            // If Chip is found in aLevel and hasn't been found yet, set his location
            if (this.level[y-1][x] > tiles.CHIP_BASE && this.chip_x_original === -1 && this.chip_y_original === -1) {
                this.chip_x_original = x;
                this.chip_y_original = y-1;
            }
        }
    }

    this.chip_x = this.chip_x_original;
    this.chip_y = this.chip_y_original;
    this.height = this.level.length;
    this.width = this.level[0].length;

    // Get just the Chip layer of the tile, then find out what direction he's facing
    switch (Math.floor(this.level[this.chip_x][this.chip_y] / tiles.CHIP_BASE) * tiles.CHIP_BASE) {
        case tiles.CHIP_NORTH:
            this.chip_facing = dir.NORTH;
            break;
        case tiles.CHIP_SOUTH:
            this.chip_facing = dir.SOUTH;
            break;
        case tiles.CHIP_EAST:
            this.chip_facing = dir.EAST;
            break;
        case tiles.CHIP_WEST:
            this.chip_facing = dir.WEST;
            break;
        default:
            this.chip_facing = dir.SOUTH;
    }

    currentVisibleMap = new VisibleMap(this);

    addRequest("redrawAll");

    this.addItem = function(item) {
        if (!this.inventory[item]) {
            this.inventory[item] = 1;
        } else {
            this.inventory[item]++;
        }
        addRequest("updateInventory");
    };

    // Returns true if item was found (according to global inventoryMap), false otherwise
    this.addItemFromTile = function(tile) {
        for (var i = 0; i < inventoryMap.length; i++) {
            if (inventoryMap[i] === tile) {
                this.addItem(i);
                return true;
            }
        }
        return false;
    };

    this.removeItem = function(item, removeAll) {
        if (removeAll) {
            this.inventory[item] = 0;
        } else {
            this.inventory[item]--;
        }
        addRequest("updateInventory");
    };

    this.removeAllItems = function() {
        this.inventory = [];
        addRequest("updateInventory");
    };

    this.reset = function() {
        loadLevel(this.number);
    };

    this.updateTime = function(newTime) {
        if (this.time > 0) {
            this.time = newTime;
        }

        if (this.time === 0) { // both or either can fire in one call
            killChip("Out of time!");
        }

        addRequest("updateTime");
    };

    this.decrementTime = function() {
        this.updateTime(this.time - 1);
    };

    this.updateChipsLeft = function(newChipsLeft) {
        if (newChipsLeft >= 0) {
            this.chipsLeft = newChipsLeft;
            addRequest("updateChipsLeft");
        }
    };

    this.decrementChipsLeft = function() {
        this.updateChipsLeft(this.chipsLeft - 1);
    };

    // TODO: the Date.now() approach might not allow for level pausing
    function InitializeLevelTimer() {
        this.start = Date.now();
        this.elapsed_ms = 0;
        this.elapsed_sec = 0;

        // True if sec was updated, false if not
        this.tick = function() {
            this.elapsed_ms = Date.now() - this.start;
            if (Math.floor(this.elapsed_ms / 1000) > this.elapsed_sec) {
                this.elapsed_sec = Math.floor(this.elapsed_ms / 1000);
                return true;
            }
            return false;
        };
    }

    this.getTile = function (x, y) {
        return this.level[y][x];
    };

    this.setTile = function (x, y, tile) {
        this.level[y][x] = tile;
        return this.getTile(x, y);
    };

    this.getTileLayer = function(x, y, layer) {
        return Math.floor((this.getTile(x, y) % getLayerBase(layer+1)) / getLayerBase(layer)) * getLayerBase(layer);
    };

    this.setTileLayer = function(x, y, layer, tile) {
        var newTile = this.getTile(x, y);
        newTile -= this.getTileLayer(x, y, layer);
        newTile += getLayer(tile, layer) * getLayerBase(layer);

        return this.setTile(x, y, newTile);
    };

    this.clearTileLayer = function(x, y, layer) {
        return this.setTileLayer(x, y, layer, 0);
    };

    this.getRelativeTile = function(currentTileX, currentTileY, direction, distance) {
        distance = distance || 0; // if distance is zero or unspecified, return the current tile

        switch (direction) {
            case dir.NORTH:
                return this.getTile(currentTileX, currentTileY-distance);
                break;
            case dir.SOUTH:
                return this.getTile(currentTileX, currentTileY+distance);
                break;
            case dir.EAST:
                return this.getTile(currentTileX+distance, currentTileY);
                break;
            case dir.WEST:
                return this.getTile(currentTileX-distance, currentTileY);
                break;
            default: // if direction is 0 or unspecified, return the current tile
                return this.getTile(currentTileX, currentTileY);
                break;
        }
    };

    this.setRelativeTile = function(currentTileX, currentTileY, direction, distance, tile) {
        distance = distance || 0; // if distance is zero or unspecified, return the current tile

        switch (direction) {
            case dir.NORTH:
                return this.setTile(currentTileX, currentTileY-distance, tile);
                break;
            case dir.SOUTH:
                return this.setTile(currentTileX, currentTileY+distance, tile);
                break;
            case dir.EAST:
                return this.setTile(currentTileX+distance, currentTileY, tile);
                break;
            case dir.WEST:
                return this.setTile(currentTileX-distance, currentTileY, tile);
                break;
            default: // if direction is 0 or unspecified, return the current tile
                return this.setTile(currentTileX, currentTileY, tile);
                break;
        }
    };

    this.getRelativeTileLayer = function(currentTileX, currentTileY, direction, distance, layer) {
        distance = distance || 0; // if distance is zero or unspecified, return the current tile

        switch (direction) {
            case dir.NORTH:
                return this.getTileLayer(currentTileX, currentTileY-distance, layer);
                break;
            case dir.SOUTH:
                return this.getTileLayer(currentTileX, currentTileY+distance, layer);
                break;
            case dir.EAST:
                return this.getTileLayer(currentTileX+distance, currentTileY, layer);
                break;
            case dir.WEST:
                return this.getTileLayer(currentTileX-distance, currentTileY, layer);
                break;
            default: // if direction is 0 or unspecified, return the current tile
                return this.getTileLayer(currentTileX, currentTileY, layer);
                break;
        }
    };

    this.setRelativeTileLayer = function(currentTileX, currentTileY, direction, distance, layer, tile) {
        distance = distance || 0; // if distance is zero or unspecified, return the current tile

        switch (direction) {
            case dir.NORTH:
                return this.setTileLayer(currentTileX, currentTileY-distance, layer, tile);
                break;
            case dir.SOUTH:
                return this.setTileLayer(currentTileX, currentTileY+distance, layer, tile);
                break;
            case dir.EAST:
                return this.setTileLayer(currentTileX+distance, currentTileY, layer, tile);
                break;
            case dir.WEST:
                return this.setTileLayer(currentTileX-distance, currentTileY, layer, tile);
                break;
            default: // if direction is 0 or unspecified, return the current tile
                return this.setTile(currentTileX, currentTileY, layer, tile);
                break;
        }
    };

    this.clearRelativeTileLayer = function(currentTileX, currentTileY, direction, distance, layer) {
        return this.setRelativeTileLayer(currentTileX, currentTileY, direction, distance, layer, 0);
    };

    this.getNextTile = function(currentTileX, currentTileY, direction) {
        return this.getRelativeTile(currentTileX, currentTileY, direction, 1);
    };

    this.setNextTile = function(currentTileX, currentTileY, direction, tile) {
        return this.setRelativeTile(currentTileX, currentTileY, direction, 1, tile);
    };

    this.getNextTileLayer = function(currentTileX, currentTileY, direction, layer) {
        return this.getRelativeTileLayer(currentTileX, currentTileY, direction, 1, layer);
    };

    this.setNextTileLayer = function(currentTileX, currentTileY, direction, layer, tile) {
        return this.setRelativeTileLayer(currentTileX, currentTileY, direction, 1, layer, tile);
    };

    this.clearNextTileLayer = function(currentTileX, currentTileY, direction, layer) {
        return this.setNextTileLayer(currentTileX, currentTileY, direction, layer, 0);
    };

    this.getChipsTile = function() {
        return this.getTile(this.chip_x, this.chip_y);
    };

    this.setChipsTile = function(tile) {
        return this.setTile(this.chip_x, this.chip_y, tile);
    };

    this.getChipsTileLayer = function(layer) {
        return this.getTileLayer(this.chip_x, this.chip_y, layer);
    };

    this.setChipsTileLayer = function(layer, tile) {
        return this.setTileLayer(this.chip_x, this.chip_y, layer, tile);
    };

    this.clearChipsTileLayer = function(layer) {
        return this.clearTileLayer(this.chip_x, this.chip_y, layer);
    };

    this.getChipsRelativeTile = function(direction, distance) {
        return this.getRelativeTile(this.chip_x, this.chip_y, direction, distance);
    };

    this.setChipsRelativeTile = function(direction, distance, tile) {
        return this.setRelativeTile(this.chip_x, this.chip_y, direction, distance, tile);
    };

    this.getChipsRelativeTileLayer = function(direction, distance, layer) {
        return this.getRelativeTileLayer(this.chip_x, this.chip_y, direction, distance, layer);
    };

    this.setChipsRelativeTileLayer = function(direction, distance, layer, tile) {
        return this.setRelativeTileLayer(this.chip_x, this.chip_y, direction, distance, layer, tile);
    };

    this.clearChipsRelativeTileLayer = function(direction, distance, layer) {
        return this.clearRelativeTileLayer(this.chip_x, this.chip_y, direction, distance, layer);
    };

    this.getChipsNextTile = function(direction) {
        return this.getNextTile(this.chip_x, this.chip_y, direction);
    };

    this.setChipsNextTile = function(direction, tile) {
        return this.setNextTile(this.chip_x, this.chip_y, direction, tile);
    };

    this.getChipsNextTileLayer = function(direction, layer) {
        return this.getNextTileLayer(this.chip_x, this.chip_y, direction, layer);
    };

    this.setChipsNextTileLayer = function(direction, layer, tile) {
        return this.setNextTileLayer(this.chip_x, this.chip_y, direction, layer, tile);
    };

    this.clearChipsNextTileLayer = function(direction, layer) {
        return this.clearNextTileLayer(direction, layer);
    };
}

function VisibleMap(map) {
    var cam = (map ? map : currentActiveMap);

    this.topLeft_x = 0;
    this.topLeft_y = 0;
    this.bottomRight_x = 0;
    this.bottomRight_y = 0;

    this.update = function() {
        // Draw all tiles up to half a board away from Chip (as in, put Chip in the center)
        // These vars are zero-based tile coords
        this.topLeft_x = cam.chip_x - drawVars.HALFBOARD_X;
        this.topLeft_y = cam.chip_y - drawVars.HALFBOARD_Y;
        this.bottomRight_x = cam.chip_x + drawVars.HALFBOARD_X;
        this.bottomRight_y = cam.chip_y + drawVars.HALFBOARD_Y;

        // These rules will correct the drawing area if the "camera" is not centered on Chip
        // Must not exceed the edge of the currentActiveMap
        // Must not exceed the edge of the boardWidth
        if (this.topLeft_x < 0) {
            this.topLeft_x = 0;
            this.bottomRight_x = boardWidth_tiles - 1;
        } if (this.topLeft_y < 0) {
            this.topLeft_y = 0;
            this.bottomRight_y = boardHeight_tiles - 1;
        } if (this.bottomRight_x > cam.width - 1) {
            this.topLeft_x = cam.width - boardWidth_tiles;
            this.bottomRight_x = cam.width - 1;
        } if (this.bottomRight_y > cam.height - 1) {
            this.topLeft_y = cam.height - boardHeight_tiles;
            this.bottomRight_y = cam.height - 1;
        }
    };

    this.update();

}

function assignTilePairingsFromString(str) {
    return [str]; // TODO: literally this
}