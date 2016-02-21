/**
 * Created by Brogan on 1/25/2016.
 */

chips.map = {

    load : {
        level : function(num) {
            chips.g.cam = new chips.map.ActiveMap(num);
            chips.commands.setBy.frame(0, "redrawAll");
            chips.g.cam.view.update();
            return true;
        },
        nextLevel : function() {
            if (chips.g.cam.number < chips.g.cls.meta.size) {
                chips.commands.setBy.frame(0, "loadLevel", [chips.g.cam.number + 1]);
            } else {
                chips.commands.setBy.frame(0, "loadLevel", [1]); // TODO: Show a victory screen
            }
        },
        prevLevel : function() {
            if (chips.g.cam.number > 1) {
                chips.commands.setBy.frame(0, "loadLevel", [chips.g.cam.number - 1]);
            } else {
                chips.commands.setBy.frame(0, "loadLevel", [chips.g.cls.meta.size]);
                // Makes the assumption that numbers in levelset are ordered sequentially
            }
        }
    },

    ActiveMap : function(num) {

        /**************************/
        /* VALIDATION AND LOADING */
        /**************************/

        if (typeof num == "undefined") {
            console.error("No levelNum assigned to ActiveMap");
            if (chips.g.debug) { debugger; }
            return;
        }

        var level = chips.g.cls[num];

        /**************/
        /* LEVEL DATA */
        /**************/

        this.number = parseInt(num);
        this.name = level.name;
        this.password = level.password;
        this.timeLeft = (parseInt(level.time) < 1 ? -1 : parseInt(level.time)); // Min. 1 sec, else -1 (unlimited)
        this.chipsLeft = (parseInt(level.chips) < 0 ? 0 : parseInt(level.chips)); // Min. 0
        this.hint = level.hint;
        this.width = level.width;
        this.height = Math.floor(level.board.length / level.width);

        /********************/
        /* STAGE AND ACTORS */
        /********************/

        this.board = [];
        this.player = {};

        for (var y = 0; y < this.height; y++) {
            if (typeof this.board[y] == "undefined") { this.board[y] = [] }
            for (var x = 0; x < this.width; x++) {
                this.board[y][x] = level.board[(y * this.width) + x]; // Transform to 2D array
                // If Chip is found in the board and hasn't been found yet, set his location
                if (typeof this.player.x == "undefined") {
                    if (this.board[y][x] >= chips.g.tiles.CHIP_BASE) {
                        this.player = new chips.obj.Player(this.board[y][x], x, y);
                    }
                }
            }
        }

        // If Chip was not found, put him facing south in the top-left corner of the map.
        if (typeof this.player.x == "undefined") {
            this.player = new chips.obj.Player(chips.g.tiles.CHIP_SOUTH, 0, 0);
        }

        this.view = {
            top : 0,
            left : 0,
            bottom : 0,
            right : 0
        };

        this.monsters = {};

        /*************************/
        /* SUPPORTING LEVEL DATA */
        /*************************/

        this.elapsedTime = new chips.obj.Timer();
        this.turn = 0;
        this.chipsFacingReset = 0;
        this.slideList = []; // List of everything that needs to auto-move, as on ice, force floors, etc.

        /**********************************************/
        /* BOARD DATA MANIPULATION (turns, hud, etc.) */
        /**********************************************/

        this.tickAllMonsters = function() {
            var thisMonster, monsters;

            try {
                monsters = this.monsters.getAll();
            } catch (e) {
                this.monsters = new chips.obj.MonsterList();
                this.monsters.sync();
                monsters = this.monsters.getAll();
            }

            for (var monster in monsters) {
                if (!monsters.hasOwnProperty(monster)) { continue; }
                thisMonster = monsters[monster];
                if (chips.g.rules[thisMonster.name].speed && this.turn % chips.g.rules[thisMonster.name].speed === 0) {
                    // Actions and Behaviors are mutually exclusive on any given turn
                    if (!monsters[monster].performAction()) {
                        chips.g.rules[thisMonster.name].behavior(monsters[monster]);
                    }
                }
            }
        };

        this.updateTurn = function() {
            if (this.elapsedTime.elapsed_ms - (this.turn * chips.g.turnTime) > this.turn) {
                this.turn++;
                chips.commands.setBy.frame(0, "updateDebug");
                if (this.chipsFacingReset > 0) {
                    this.chipsFacingReset--;
                    if (this.chipsFacingReset === 0) {
                        this.setChipsFacing(chips.util.dir.SOUTH);
                    }
                }
                this.tickAllMonsters();
            }
        };

        // This also controls the update of turns
        this.setTime = function(newTime) {
            if (this.timeLeft > 0) {
                this.timeLeft = newTime;
            }

            if (this.timeLeft === 0) { // both or either can fire in one call
                this.player.kill("Out of time!");
            }

            chips.commands.setBy.frame(0, "updateTime");

            if (this.elapsedTime) {

            }
        };

        this.decrementTime = function(amount) {
            var amt = (amount || 1);
            this.setTime(this.timeLeft - amt);
        };

        this.setChipsLeft = function(newChipsLeft) {
            if (newChipsLeft >= 0) {
                this.chipsLeft = newChipsLeft;
                chips.commands.setBy.frame(0, "updateChipsLeft");
            }
        };

        this.decrementChipsLeft = function(amount) {
            var amt = (amount || 1);
            this.setChipsLeft(this.chipsLeft - 1);
        };

        /**************************/
        /* TILE MANUIPULATION API */
        /**************************/

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
                if (chips.g.debug) { debugger; }
            }
        };

        this.setTile = function (x, y, tile) {
            this.board[y][x] = tile;
            chips.commands.setBy.frame(0, "updateMap"); // TODO: Optimize by only updating when something changes
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
            return this.getTile(this.player.x, this.player.y);
        };

        this.setChipsTile = function(tile) {
            return this.setTile(this.player.x, this.player.y, tile);
        };

        this.getChipsTileLayer = function(layer) {
            return this.getTileLayer(this.player.x, this.player.y, layer);
        };

        this.setChipsTileLayer = function(layer, tile) {
            return this.setTileLayer(this.player.x, this.player.y, layer, tile);
        };

        this.clearChipsTileLayer = function(layer) {
            return this.clearTileLayer(this.player.x, this.player.y, layer);
        };

        this.getChipsRelativeTile = function(direction, distance) {
            return this.getRelativeTile(this.player.x, this.player.y, direction, distance);
        };

        this.setChipsRelativeTile = function(direction, distance, tile) {
            return this.setRelativeTile(this.player.x, this.player.y, direction, distance, tile);
        };

        this.getChipsRelativeTileLayer = function(direction, distance, layer) {
            return this.getRelativeTileLayer(this.player.x, this.player.y, direction, distance, layer);
        };

        this.setChipsRelativeTileLayer = function(direction, distance, layer, tile) {
            return this.setRelativeTileLayer(this.player.x, this.player.y, direction, distance, layer, tile);
        };

        this.clearChipsRelativeTileLayer = function(direction, distance, layer) {
            return this.clearRelativeTileLayer(this.player.x, this.player.y, direction, distance, layer);
        };

        this.getChipsNextTile = function(direction) {
            return this.getNextTile(this.player.x, this.player.y, direction);
        };

        this.setChipsNextTile = function(direction, tile) {
            return this.setNextTile(this.player.x, this.player.y, direction, tile);
        };

        this.getChipsNextTileLayer = function(direction, layer) {
            return this.getNextTileLayer(this.player.x, this.player.y, direction, layer);
        };

        this.setChipsNextTileLayer = function(direction, layer, tile) {
            return this.setNextTileLayer(this.player.x, this.player.y, direction, layer, tile);
        };

        this.clearChipsNextTileLayer = function(direction, layer) {
            return this.clearNextTileLayer(this.player.x, this.player.y, direction, layer);
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

        /***************************/
        /* OTHER UTILITY FUNCTIONS */
        /***************************/

        this.reset = function() {
            chips.map.load.level(this.number);
        };

        this.win = function() {
            // TODO: in lieu of a dialog box...
            var retStr = "<span style='color:red'>Hooray, you completed Level " + this.number;
            retStr += this.timeLeft > 0 ? " with a time of " + this.timeLeft + " seconds!" : "!";
            chips.commands.setBy.frame(0, "setGameMessage", [retStr]);
            chips.map.load.nextLevel();
        };

        this.view.update = function() {
            var player = chips.g.cam.player;
            // Draw all tiles up to half a board away from Chip (as in, put Chip in the center)
            // These vars are zero-based tile coords
            this.left = player.x - chips.draw.HALFBOARD_X;
            this.top = player.y - chips.draw.HALFBOARD_Y;
            this.right = player.x + chips.draw.HALFBOARD_X;
            this.bottom = player.y + chips.draw.HALFBOARD_Y;

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
        };
    }
};