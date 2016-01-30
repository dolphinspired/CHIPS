/**
 * Created by Brogan on 1/25/2016.
 */

chips.map = {

    load : {
        level : function(num) {
            chips.g.cam = new chips.map.ActiveMap(num);
            chips.vars.requests.add("redrawAll");
            chips.g.cam.view.update();
            return true;
        },
        nextLevel : function() {
            if (chips.g.cam.number < chips.g.cls.meta.size) {
                chips.vars.requests.add("loadLevel", [chips.g.cam.number + 1]);
            } else {
                chips.vars.requests.add("loadLevel", [1]); // TODO: Show a victory screen
            }
        },
        prevLevel : function() {
            if (chips.g.cam.number > 1) {
                chips.vars.requests.add("loadLevel", [chips.g.cam.number - 1]);
            } else {
                chips.vars.requests.add("loadLevel", [chips.g.cls.meta.size]);
                // Makes the assumption that numbers in levelset are ordered sequentially
            }
        }
    },

    ActiveMap : function(num) {
        if (typeof num == "undefined") {
            console.error("No levelNum assigned to ActiveMap");
            if (chips.g.debug) { debugger; }
            return;
        }

        var level = chips.g.cls[num];

        this.number = parseInt(num);
        this.name = level.name;
        this.password = level.password;
        this.timeLeft = parseInt(level.time);
        this.chipsLeft = parseInt(level.chips);
        this.hint = level.hint;

        this.width = level.width;
        this.height = Math.floor(level.board.length / level.width);
        this.board = [];

        this.chip = {
            x : -1,
            y : -1,
            facing : chips.util.dir.SOUTH
        };

        for (var y = 0; y < this.height; y++) {
            if (typeof this.board[y] == "undefined") { this.board[y] = [] }
            for (var x = 0; x < this.width; x++) {
                this.board[y][x] = level.board[(y * this.width) + x]; // Transform to 2D array
                // If Chip is found in the board and hasn't been found yet, set his location
                if (this.chip.x === -1) {
                    if (this.board[y][x] >= chips.g.tiles.CHIP_BASE) {
                        this.chip.x = x;
                        this.chip.y = y;
                    }
                }
            }
        }

        this.inventory = new chips.util.InventoryMap(chips.data.tiles);
        this.elapsedTime = new chips.util.LevelTimer();

        this.turn = 0;
        this.chipsFacingReset = 0;
        this.enemies = {};
        chips.vars.requests.add("generateEnemyMap");

        // VALIDATION

        // Chip's coords must be within the bounds of the board, else set to x = 0 or y = 0
        this.chip.x = (this.chip.x < 0 || this.chip.x > this.width - 1 ? 0 : this.chip.x);
        this.chip.y = (this.chip.y < 0 || this.chip.y > this.height - 1 ? 0 : this.chip.y);

        this.password = (this.password.length > 4 ? this.password.substr(0,4) : this.password); // Max 4 chars
        this.timeLeft = (this.timeLeft < 1 ? -1 : this.timeLeft); // Min 1 second, else unlimited time
        this.chipsLeft = (this.chipsLeft < 0 ? 0 : this.chipsLeft); // Min 0 chips left

        this.updateTurn = function() {
            if (this.elapsedTime.elapsed_ms - (this.turn * chips.g.turnTime) > this.turn) {
                this.turn++;
                chips.vars.requests.add("updateDebug");
                if (this.chipsFacingReset > 0) {
                    this.chipsFacingReset--;
                    if (this.chipsFacingReset === 0) {
                        this.setChipsFacing(chips.util.dir.SOUTH);
                    }
                }
                this.tickAllEnemies();
            }
        };

        this.addItem = function(item) {
            this.inventory[item].quantity++;
            chips.vars.requests.add("updateInventory");
        };

        this.removeItem = function(item, removeAll) {
            if (removeAll) {
                this.inventory[item].quantity = 0;
            } else if (this.inventory[item].quantity > 0) {
                this.inventory[item].quantity--;
            }
            chips.vars.requests.add("updateInventory");
        };

        this.reset = function() {
            chips.map.load.level(this.number);
        };

        // This also controls the update of turns
        this.updateTime = function(newTime) {
            if (this.timeLeft > 0) {
                this.timeLeft = newTime;
            }

            if (this.timeLeft === 0) { // both or either can fire in one call
                chips.events.chip.kill("Out of time!");
            }

            chips.vars.requests.add("updateTime");

            if (this.elapsedTime) {

            }
        };

        this.decrementTime = function(amount) {
            var amt = (amount ? amount : 1);
            this.updateTime(this.timeLeft - amt);
        };



        this.updateChipsLeft = function(newChipsLeft) {
            if (newChipsLeft >= 0) {
                this.chipsLeft = newChipsLeft;
                chips.vars.requests.add("updateChipsLeft");
            }
        };

        this.decrementChipsLeft = function() {
            this.updateChipsLeft(this.chipsLeft - 1);
        };

        this.slideList = []; // List of everything that needs to auto-move, as on ice, force floorts, etc.

        this.toggleFloors = function() {
            var thisFloor;
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
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
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    if (this.getTile(x, y) === tile) {
                        retCoords[retCoords.length] = [x,y];
                    }
                }
            }
            return (retCoords.length > 0 ? retCoords : false);
        };

        // Not specifying a tile will get all tiles that exist on the given layer
        this.findTilesByLayer = function(layer, tile) {
            if (typeof layer == "undefined") {
                console.error("Layer must be defined for findTilesByLayer. Tile is optional.");
                if (chips.g.debug) { debugger; }
            }
            var retCoords = [], allTiles = (typeof tile == "undefined");
            for (var y = 0; y < this.board.length; y++) {
                for (var x = 0; x < this.board[y].length; x++) {
                    if ((allTiles && this.getTileLayer(x, y, layer) > 0) || (!allTiles && this.getTileLayer(x, y, layer) === tile)) {
                        retCoords[retCoords.length] = [x,y];
                    }
                }
            }
            return (retCoords.length > 0 ? retCoords : false);
        };

        this.getTile = function (x, y) {
            try {
                return this.board[y][x];
            } catch(e) {
                debugger;
            }
        };

        this.setTile = function (x, y, tile) {
            chips.vars.requests.add("updateMap");
            this.board[y][x] = tile;
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

        this.getRelativeTile = function(x, y, d, distance) {
            distance = distance || 0; // if distance is zero or unspecified, return the current tile
            return this.getTile(x + (chips.util.dir.mod(d)[0] * distance), y + (chips.util.dir.mod(d)[1] * distance));
        };

        this.setRelativeTile = function(x, y, d, distance, tile) {
            distance = distance || 0; // if distance is zero or unspecified, return the current tile
            return this.setTile(x + (chips.util.dir.mod(d)[0] * distance), y + (chips.util.dir.mod(d)[1] * distance), tile);
        };

        this.getRelativeTileLayer = function(x, y, d, distance, layer) {
            distance = distance || 0; // if distance is zero or unspecified, return the current tile
            return this.getTileLayer(x + (chips.util.dir.mod(d)[0] * distance), y + (chips.util.dir.mod(d)[1] * distance), layer);
        };

        this.setRelativeTileLayer = function(x, y, d, distance, layer, tile) {
            distance = distance || 0; // if distance is zero or unspecified, return the current tile
            return this.setTileLayer(x + (chips.util.dir.mod(d)[0] * distance), y + (chips.util.dir.mod(d)[1] * distance), layer, tile);
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
            return this.getTile(this.chip.x, this.chip.y);
        };

        this.setChipsTile = function(tile) {
            return this.setTile(this.chip.x, this.chip.y, tile);
        };

        this.getChipsTileLayer = function(layer) {
            return this.getTileLayer(this.chip.x, this.chip.y, layer);
        };

        this.setChipsTileLayer = function(layer, tile) {
            return this.setTileLayer(this.chip.x, this.chip.y, layer, tile);
        };

        this.clearChipsTileLayer = function(layer) {
            return this.clearTileLayer(this.chip.x, this.chip.y, layer);
        };

        this.getChipsRelativeTile = function(direction, distance) {
            return this.getRelativeTile(this.chip.x, this.chip.y, direction, distance);
        };

        this.setChipsRelativeTile = function(direction, distance, tile) {
            return this.setRelativeTile(this.chip.x, this.chip.y, direction, distance, tile);
        };

        this.getChipsRelativeTileLayer = function(direction, distance, layer) {
            return this.getRelativeTileLayer(this.chip.x, this.chip.y, direction, distance, layer);
        };

        this.setChipsRelativeTileLayer = function(direction, distance, layer, tile) {
            return this.setRelativeTileLayer(this.chip.x, this.chip.y, direction, distance, layer, tile);
        };

        this.clearChipsRelativeTileLayer = function(direction, distance, layer) {
            return this.clearRelativeTileLayer(this.chip.x, this.chip.y, direction, distance, layer);
        };

        this.getChipsNextTile = function(direction) {
            return this.getNextTile(this.chip.x, this.chip.y, direction);
        };

        this.setChipsNextTile = function(direction, tile) {
            return this.setNextTile(this.chip.x, this.chip.y, direction, tile);
        };

        this.getChipsNextTileLayer = function(direction, layer) {
            return this.getNextTileLayer(this.chip.x, this.chip.y, direction, layer);
        };

        this.setChipsNextTileLayer = function(direction, layer, tile) {
            return this.setNextTileLayer(this.chip.x, this.chip.y, direction, layer, tile);
        };

        this.clearChipsNextTileLayer = function(direction, layer) {
            return this.clearNextTileLayer(this.chip.x, this.chip.y, direction, layer);
        };

        this.getEnemyFacing = function(x, y) {
            // TODO: avoid magic numbers
            return chips.util.getLayerCoord(chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.ENEMY), 4) % 4;
        };

        this.setEnemyFacing = function(x, y, d, id) {
            // TODO: Mathematical approach?
            var dirName = chips.util.getKeyByValue(chips.util.dir, d);
            var facedTile = chips.g.tiles[this.enemies.list[id].name + "_" + dirName.toUpperCase()];
            this.setTileLayer(x, y, chips.draw.LAYER.ENEMY, facedTile);
        };

        this.getChipsFacing = function() {
            // TODO: avoid magic numbers
            return chips.util.getLayerCoord(chips.g.cam.getChipsTileLayer(chips.draw.LAYER.CHIP), 6) % 4;
        };

        this.setChipsFacing = function(d) {
            var dirName = chips.util.getKeyByValue(chips.util.dir, d);
            var facedTile = chips.g.tiles["CHIP_" + dirName.toUpperCase()];
            this.setChipsTileLayer(chips.draw.LAYER.CHIP, facedTile);
        };

        this.tickAllEnemies = function() {
            for (var enemy in this.enemies.list) {
                if (!this.enemies.list.hasOwnProperty(enemy)) { continue; }
                var thisEnemy = this.enemies.list[enemy];
                if (chips.data.tiles[thisEnemy.name].speed && this.turn % chips.data.tiles[thisEnemy.name].speed === 0) {
                    chips.data.tiles[thisEnemy.name].behavior(
                        thisEnemy.x, thisEnemy.y, this.getEnemyFacing(thisEnemy.x, thisEnemy.y), enemy);
                }
            }
        };

        this.view = {
            top : 0,
            left : 0,
            bottom : 0,
            right : 0,
            update : function() {
                // Draw all tiles up to half a board away from Chip (as in, put Chip in the center)
                // These vars are zero-based tile coords
                this.left = chips.g.cam.chip.x - chips.draw.HALFBOARD_X;
                this.top = chips.g.cam.chip.y - chips.draw.HALFBOARD_Y;
                this.right = chips.g.cam.chip.x + chips.draw.HALFBOARD_X;
                this.bottom = chips.g.cam.chip.y + chips.draw.HALFBOARD_Y;

                // These rules will correct the drawing area if the "camera" is not centered on Chip
                // Must not exceed the edge of the currentActiveMap
                // Must not exceed the edge of the boardWidth
                if (this.left < 0) {
                    this.left = 0;
                    this.right = chips.vars.boardWidth_tiles - 1;
                } if (this.top < 0) {
                    this.top = 0;
                    this.bottom = chips.vars.boardHeight_tiles - 1;
                } if (this.right > chips.g.cam.width - 1) {
                    this.left = chips.g.cam.width - chips.vars.boardWidth_tiles;
                    this.right = chips.g.cam.width - 1;
                } if (this.bottom > chips.g.cam.height - 1) {
                    this.top = chips.g.cam.height - chips.vars.boardHeight_tiles;
                    this.bottom = chips.g.cam.height - 1;
                }
            }
        };
    }
};