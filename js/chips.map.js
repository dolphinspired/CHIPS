/**
 * Created by Brogan on 1/25/2016.
 */

chips.map = {

    load : {
        level : function(num) {
            return chips.map.load.testLevel(num); // TODO: temporary
        },
        nextLevel : function() {
            if (chips.g.cam.levelNum < numTestLevels) {
                addRequest("loadLevel", [parseInt(chips.g.cam.levelNum) + 1]);
            } else {
                addRequest("loadLevel", [0]);
            }
        },
        prevLevel : function() {
            if (chips.g.cam.levelNum > 0) {
                addRequest("loadLevel", [parseInt(chips.g.cam.levelNum) - 1]);
            } else {
                addRequest("loadLevel", [numTestLevels]);
            }
        },
        testLevel : function(num) { // temporary
            oTestLevel = chips.testLevels["levelTest" + num];
            chips.g.cam = new chips.map.ActiveMap(oTestLevel, num);
            chips.g.cam.view.update();
        }
    },

    ActiveMap : function(aLevel, levelNum) {
        this.number = (levelNum ? levelNum : -1); // Stage number, if defined
        this.inventory = new InventoryMap(chips.data.tiles);

        function InventoryMap(tData) {
            for (var i in tData) {
                if (!tData.hasOwnProperty(i)) { continue; }
                if (tData[i].type === "item" && tData[i].inventory && tData[i].inventory.slot >= 0) {
                    this[i] = {
                        "quantity": 0,
                        "slot": tData[i].inventory.slot
                    }
                }
            }
        }

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

        // Determines when enemies move, when anything slides, and when Chip moves in classic mode
        this.turn = 0;

        this.updateTurn = function() {
            if (this.elapsedTime.elapsed_ms - (this.turn * turnTime_ms) > this.turn) {
                this.turn++;
            }
        };

        // Start a new timer to track the time elapsed while in this level
        this.elapsedTime = new InitializeLevelTimer();

        // Now for the remaining non-numeric info
        this.name = aLevel[0][0];
        this.password = aLevel[0][1];
        this.hint = aLevel[0][5];
        this.tilePairings = null; // TODO: assignTilePairingsFromString(aLevel[0][6]); // Doesn't do anything yet

        // THE MAP
        // Deep copy the 2d array into the activeMap object
        // Set activeMap properties while you're at it
        this.level = [[]];
        for (y = 1; y < aLevel.length; y++) {
            if (!this.level[y-1]) { this.level[y-1] = [] }
            for (x = 0; x < aLevel[y].length; x++) {
                this.level[y-1][x] = aLevel[y][x]; // inserted at y-1 to account for header row
                // If Chip is found in aLevel and hasn't been found yet, set his location
                if (this.chip_x_original === -1) {
                    if (this.level[y-1][x] >= chips.g.tiles.CHIP_BASE) {
                        this.chip_x_original = x;
                        this.chip_y_original = y-1;
                    }
                }
            }
        }

        this.chip_x = (this.chip_x_original > -1 ? this.chip_x_original : 0);
        this.chip_y = (this.chip_y_original > -1 ? this.chip_y_original : 0);
        this.height = this.level.length;
        this.width = this.level[0].length;

        // Get just the Chip layer of the tile, then find out what direction he's facing
        switch (Math.floor(this.level[this.chip_x][this.chip_y] / chips.g.tiles.CHIP_BASE) * chips.g.tiles.CHIP_BASE) {
            case chips.g.tiles.CHIP_NORTH:
                this.chip_facing = chips.util.dir.NORTH;
                break;
            case chips.g.tiles.CHIP_SOUTH:
                this.chip_facing = chips.util.dir.SOUTH;
                break;
            case chips.g.tiles.CHIP_EAST:
                this.chip_facing = chips.util.dir.EAST;
                break;
            case chips.g.tiles.CHIP_WEST:
                this.chip_facing = chips.util.dir.WEST;
                break;
            default:
                this.chip_facing = chips.util.dir.SOUTH;
        }

        addRequest("redrawAll");

        this.addItem = function(item) {
            this.inventory[item].quantity++;
            addRequest("updateInventory");
        };

        this.removeItem = function(item, removeAll) {
            if (removeAll) {
                this.inventory[item].quantity = 0;
            } else if (this.inventory[item].quantity > 0) {
                this.inventory[item].quantity--;
            }
            addRequest("updateInventory");
        };

        this.reset = function() {
            chips.map.load.level(this.number);
        };

        // This also controls the update of turns
        this.updateTime = function(newTime) {
            if (this.time > 0) {
                this.time = newTime;
            }

            if (this.time === 0) { // both or either can fire in one call
                killChip("Out of time!");
            }

            addRequest("updateTime");

            if (this.elapsedTime) {

            }
        };

        this.decrementTime = function(amount) {
            var amt = (amount ? amount : 1);
            this.updateTime(this.time - amt);
        };

        // TODO: the Date.now() approach might not allow for level pausing
        function InitializeLevelTimer() {
            this.start = Date.now();
            this.elapsed_ms = 0;
            this.elapsed_sec = 0;

            this.paused = 0;
            this.paused_ms = 0;

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
        }

        this.updateChipsLeft = function(newChipsLeft) {
            if (newChipsLeft >= 0) {
                this.chipsLeft = newChipsLeft;
                addRequest("updateChipsLeft");
            }
        };

        this.decrementChipsLeft = function() {
            this.updateChipsLeft(this.chipsLeft - 1);
        };

        this.slideList = []; // List of everything that needs to auto-move, as on ice, force floorts, etc.

        this.toggleFloors = function() {
            var thisFloor;
            for (var y = 0; y < this.level.length; y++) {
                for (var x = 0; x < this.level[y].length; x++) {
                    thisFloor = this.getTileLayer(x, y, chips.draw.LAYER.FLOOR);
                    if (thisFloor === chips.g.tiles.TOGGLE_CLOSED) {
                        this.setTileLayer(x, y, chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_OPEN);
                    } else if (thisFloor === chips.g.tiles.TOGGLE_OPEN) {
                        this.setTileLayer(x, y, chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_CLOSED);
                    }
                }
            }
        };

        this.moveTanks = function() {

        };

        // Returns an array containing the x,y coordinate pairs of every instance
        // of the arg tile on the board
        // If not found, return false
        this.findTiles = function(tile) {
            var retCoords = [];
            for (var y = 0; y < this.level.length; y++) {
                for (var x = 0; x < this.level[y].length; x++) {
                    if (this.getTile(x, y) === tile) {
                        retCoords[retCoords.length] = [x,y];
                    }
                }
            }
            return (retCoords.length > 0 ? retCoords : false);
        };

        this.findTilesByLayer = function(tile, layer) {
            var retCoords = [];
            for (var y = 0; y < this.level.length; y++) {
                for (var x = 0; x < this.level[y].length; x++) {
                    if (this.getTileLayer(x, y, layer) === tile) {
                        retCoords[retCoords.length] = [x,y];
                    }
                }
            }
            return (retCoords.length > 0 ? retCoords : false);
        };

        this.getTile = function (x, y) {
            return this.level[y][x];
        };

        this.setTile = function (x, y, tile) {
            addRequest("updateMap");
            this.level[y][x] = tile;
            return this.getTile(x, y);
        };

        this.getTileLayer = function(x, y, layer) {
            var thisLayer = chips.util.getLayerBase(layer), nextLayer = chips.util.getLayerBase(layer+1);
            return Math.floor((this.getTile(x, y) % nextLayer) / thisLayer) * thisLayer;
        };

        this.setTileLayer = function(x, y, layer, tile) {
            if (typeof layer == "undefined" || typeof tile == "undefined") {
                console.trace("Bad data was about to be inserted into the map! Check your setTileLayer call!");
                if (chips.g.debug) { debugger; }
                return this.setTile(x, y, chips.g.tiles.FLOOR);
            }

            var newTile = this.getTile(x, y);
            newTile -= this.getTileLayer(x, y, layer);
            newTile += chips.util.getLayer(tile, layer) * chips.util.getLayerBase(layer);

            return this.setTile(x, y, newTile);
        };

        this.clearTileLayer = function(x, y, layer) {
            return this.setTileLayer(x, y, layer, 0);
        };

        this.getRelativeTile = function(currentTileX, currentTileY, direction, distance) {
            distance = distance || 0; // if distance is zero or unspecified, return the current tile

            switch (direction) {
                case chips.util.dir.NORTH:
                    return this.getTile(currentTileX, currentTileY-distance);
                    break;
                case chips.util.dir.SOUTH:
                    return this.getTile(currentTileX, currentTileY+distance);
                    break;
                case chips.util.dir.EAST:
                    return this.getTile(currentTileX+distance, currentTileY);
                    break;
                case chips.util.dir.WEST:
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
                case chips.util.dir.NORTH:
                    return this.setTile(currentTileX, currentTileY-distance, tile);
                    break;
                case chips.util.dir.SOUTH:
                    return this.setTile(currentTileX, currentTileY+distance, tile);
                    break;
                case chips.util.dir.EAST:
                    return this.setTile(currentTileX+distance, currentTileY, tile);
                    break;
                case chips.util.dir.WEST:
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
                case chips.util.dir.NORTH:
                    return this.getTileLayer(currentTileX, currentTileY-distance, layer);
                    break;
                case chips.util.dir.SOUTH:
                    return this.getTileLayer(currentTileX, currentTileY+distance, layer);
                    break;
                case chips.util.dir.EAST:
                    return this.getTileLayer(currentTileX+distance, currentTileY, layer);
                    break;
                case chips.util.dir.WEST:
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
                case chips.util.dir.NORTH:
                    return this.setTileLayer(currentTileX, currentTileY-distance, layer, tile);
                    break;
                case chips.util.dir.SOUTH:
                    return this.setTileLayer(currentTileX, currentTileY+distance, layer, tile);
                    break;
                case chips.util.dir.EAST:
                    return this.setTileLayer(currentTileX+distance, currentTileY, layer, tile);
                    break;
                case chips.util.dir.WEST:
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
            return this.clearNextTileLayer(this.chip_x, this.chip_y, direction, layer);
        };

        this.setEnemyFacing = function(x, y, d) {

        };

        this.setChipsFacing = function(d) {
            var dirName = chips.util.getKeyByValue(chips.util.dir, d);
            var facedTile = chips.g.tiles["CHIP_" + dirName.toUpperCase()];
            this.setChipsTileLayer(chips.draw.LAYER.CHIP, facedTile);
            this.chip_facing = d;
        };

        this.view = {
            top : 0,
            left : 0,
            bottom : 0,
            right : 0,
            update : function() {
                // Draw all tiles up to half a board away from Chip (as in, put Chip in the center)
                // These vars are zero-based tile coords
                this.left = chips.g.cam.chip_x - chips.draw.HALFBOARD_X;
                this.top = chips.g.cam.chip_y - chips.draw.HALFBOARD_Y;
                this.right = chips.g.cam.chip_x + chips.draw.HALFBOARD_X;
                this.bottom = chips.g.cam.chip_y + chips.draw.HALFBOARD_Y;

                // These rules will correct the drawing area if the "camera" is not centered on Chip
                // Must not exceed the edge of the currentActiveMap
                // Must not exceed the edge of the boardWidth
                if (this.left < 0) {
                    this.left = 0;
                    this.right = boardWidth_tiles - 1;
                } if (this.top < 0) {
                    this.top = 0;
                    this.bottom = boardHeight_tiles - 1;
                } if (this.right > chips.g.cam.width - 1) {
                    this.left = chips.g.cam.width - boardWidth_tiles;
                    this.right = chips.g.cam.width - 1;
                } if (this.bottom > chips.g.cam.height - 1) {
                    this.top = chips.g.cam.height - boardHeight_tiles;
                    this.bottom = chips.g.cam.height - 1;
                }
            }
        };
    }
};