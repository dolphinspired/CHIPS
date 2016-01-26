/**
 * Created by Brogan on 10/13/2015.
 */

chips.draw = {

    TILE_SIZE : 32, // width/height of a single tile in px
    LAYER_SIZE_BITS : 10, // how many bits are currently storing tile values
    LAYER_SIZE_TILES : 8, // number of tiles across a single layer-group in the atlas (this is square)
    // TODO: Re-automate these vars via settings or something
    LAYER_SIZE_PX : 256, // number of px across a single layer-group
    LAYER_OFFSETS_X : [0,256,0,256],
    LAYER_OFFSETS_Y : [0,0,256,256],
    NUM_LAYERS : 4,
    HALFBOARD_X : Math.floor(boardWidth_tiles / 2), // Half the visible board, rounded down
    HALFBOARD_Y : Math.floor(boardHeight_tiles / 2),

    LAYER : {
        FLOOR : 0,
        ITEM : 1,
        ENEMY : 2,
        CHIP : 3
    },

    /**
     * function drawGameFrame
     * Copies the window canvas image onto the main game canvas
     */

    gameFrame : function() {
        chips.assets.canvi.gContext.clearRect(0,0,chips.assets.canvi.gCanvas.width,chips.assets.canvi.gCanvas.height);
        chips.assets.canvi.gContext.putImageData(chips.assets.canvi.wContext.getImageData(0, 0, chips.assets.canvi.wCanvas.width, chips.assets.canvi.wCanvas.height), 0, 0);
    },

    /**
     * function drawTile
     * Draws a single tile onto the board at the specified location
     *
     * @param tile
     * @param xDest_tile - destination at which to draw the tile [x] (in tiles)
     * @param yDest_tile - destination at which to draw the tile [y] (in tiles)
     * @param offsetX_px - offset of drawing destination, in px (default: boardOffsetX_px)
     * @param offsetY_px - offset of drawing destination, in px (default: boardOffsetY_px)
     * @returns {boolean} - true if draw was successful, false otherwise
     */

    tile : function(tile, xDest_tile, yDest_tile, offsetX_px, offsetY_px) {
        if (typeof xDest_tile === "undefined" || typeof yDest_tile === "undefined") {
            console.error("Destinations missing for chips.draw.tile().");
            return false;
        }

        // If no offset is supplied, it's assumed you're drawing straight to the game board
        var xOffset = (offsetX_px ? offsetX_px : boardOffsetX_px);
        var yOffset = (offsetY_px ? offsetY_px : boardOffsetY_px);

        var t = chips.draw.TILE_SIZE,
            p = chips.draw.LAYER_SIZE_PX;

        var tileImageData = chips.assets.canvi.tContext.createImageData(t,t);

        var allLayerCoords = chips.util.getAllLayerCoords(tile);
        var xSource_px,  ySource_px;

        // Grab the source px for each layer of the tile, then blend it with the layer below
        for (var curLayer = 0; curLayer < chips.draw.NUM_LAYERS; curLayer++) {
            xSource_px = allLayerCoords[2*curLayer+1] * t + chips.draw.LAYER_OFFSETS_X[curLayer];
            ySource_px = allLayerCoords[2*curLayer] * t + chips.draw.LAYER_OFFSETS_Y[curLayer];

            if (curLayer > 0 && xSource_px % p === 0 && ySource_px % p === 0) {
                // If tile is not defined in this layer (above floor layer), skip drawing
            } else if (curLayer > 0) {

                if (curLayer === chips.draw.LAYER.ITEM && this.obscuresItems(chips.util.getLayer(tile, chips.draw.LAYER.FLOOR))) {
                    // Do nothing
                    continue;
                } else {
                    // Layers > 1 need to blend into the lower layers
                    tileImageData = chips.draw.util.blendLayers(tileImageData, chips.assets.canvi.tContext.getImageData(xSource_px,ySource_px,t,t));
                }
            } else {
                // Layer 1 can skip the blend step
                try {
                    tileImageData = chips.assets.canvi.tContext.getImageData(xSource_px, ySource_px, t, t);
                } catch(e) {
                    console.error(e);
                    if (chips.g.debug) { debugger; }
                    tileImageData = chips.assets.canvi.tContext.getImageData(0, 0, t, t); // In error, draw top-left tile in group
                }
            }
        }

        // Put the completed 4-layer tile image onto the board at the specified location
        chips.assets.canvi.gContext.putImageData(
            tileImageData,
            xDest_tile * t + xOffset,
            yDest_tile * t + yOffset
        );

        // TODO: Add obscurity tag/value?
        this.obscuresItems = function(tile) {
            return (tile === chips.g.tiles.BLOCK || tile === chips.g.tiles.FAKE_WALL_HOLLOW)
        };

        return true;
    },

    /**
     * function drawActiveMap
     * Draws the part of the level that's currently visible in the game window
     */

    activeMap : function() {
        // Clear out the visible board before redrawing
        chips.assets.canvi.gContext.clearRect(boardOffsetX_px,boardOffsetY_px,
            boardOffsetX_px + (boardWidth_tiles - 1) * chips.draw.TILE_SIZE,
            boardOffsetY_px + (boardHeight_tiles - 1) * chips.draw.TILE_SIZE
        );

        var xSource, ySource, xDest = 0, yDest = 0;
        for (ySource = chips.g.cam.view.top; ySource <= chips.g.cam.view.bottom; ySource++) {
            for (xSource = chips.g.cam.view.left; xSource <= chips.g.cam.view.right; xSource++) {
                chips.draw.tile(chips.g.cam.level[ySource][xSource], xDest, yDest);
                xDest++;
            }
            xDest = 0;
            yDest++;
        }

        detectCollision("player", "state", chips.g.cam.chip_x, chips.g.cam.chip_y);
    },

    debug : function(args) {
        var debugMessage = "CHIP: " + chips.g.cam.chip_x + ", " + chips.g.cam.chip_y +
            " / keylock: " + chips.g.keylock;
        var drawX = 6, drawY = chips.assets.canvi.gCanvas.height-6;

        // Erase and redraw the background
        chips.assets.canvi.gContext.clearRect(
            0,
            boardOffsetY_px + boardHeight_tiles * chips.draw.TILE_SIZE,
            chips.assets.canvi.wCanvas.width,
            chips.assets.canvi.wCanvas.height
        );
        chips.assets.canvi.gContext.putImageData(chips.assets.canvi.wContext.getImageData(
                0, // Source top-left x
                boardOffsetY_px + boardHeight_tiles * chips.draw.TILE_SIZE, // Source top-left y
                chips.assets.canvi.wCanvas.width, // Source bottom-right x
                chips.assets.canvi.wCanvas.height), // Source bottom-right y
            0, // Dest top-right x
            boardOffsetY_px + boardHeight_tiles * chips.draw.TILE_SIZE  // Dest top-right y
        );

        // Draw the debug message
        chips.assets.canvi.gContext.font = "bold 16px Arial";
        chips.assets.canvi.gContext.fillStyle = "black";
        chips.assets.canvi.gContext.fillText( debugMessage, drawX+2, drawY+2); // shadow
        chips.assets.canvi.gContext.fillText( debugMessage, drawX+1, drawY+1); // shadow
        chips.assets.canvi.gContext.fillStyle = "yellow";
        chips.assets.canvi.gContext.fillText( debugMessage, drawX, drawY); // bottom-left
    },

    hud : function() {
        chips.draw.levelNumber();
        chips.draw.time();
        if (chips.util.getLayer(chips.g.cam.level[chips.g.cam.chip_y][chips.g.cam.chip_x], 0) === chips.g.tiles.HINT) {
            chips.draw.hint();
        } else {
            chips.draw.chipsLeft();
            chips.draw.inventory();
        }
    },

    levelNumber : function() {
        var color = (chips.g.cam.levelNum <= hudLevelNumWarningThreshold ? hudColorWarning : hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.levelNum, hudLevelNumOffsetX_px, hudLevelNumOffsetY_px, color);
    },

    time : function() {
        var color = (chips.g.cam.time <= hudTimeWarningThreshold ? hudColorWarning : hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.time, hudTimeOffsetX_px, hudTimeOffsetY_px, color);
    },

    chipsLeft : function() {
        var color = (chips.g.cam.chipsLeft <= hudChipsLeftWarningThreshold ? hudColorWarning : hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.chipsLeft, hudChipsLeftOffsetX_px, hudChipsLeftOffsetY_px, color);
    },

    hint : function() {
        // TODO: Inset border
        chips.assets.canvi.gContext.strokeStyle = "white";
        chips.assets.canvi.gContext.lineWidth = hudHintPadding_px - 1;
        var lw = chips.assets.canvi.gContext.lineWidth;
        chips.assets.canvi.gContext.strokeRect(hudHintOffsetX_px, hudHintOffsetY_px, hudHintWidth_px, hudHintHeight_px);

        chips.assets.canvi.gContext.fillStyle = "black";
        chips.assets.canvi.gContext.fillRect(hudHintOffsetX_px+lw/2, hudHintOffsetY_px+lw/2, hudHintWidth_px-lw, hudHintHeight_px-lw);

        var lines = chips.draw.util.splitForWordWrap(chips.g.cam.hint, hudHintWidth_px-(2*hudHintPadding_px));

        var fh = 12, spl = 5, h = hudHintHeight_px; // TODO: Hard-coded shit
        var both = lines.length * (fh + spl);
        if (both >= h) {
            // We won't be able to wrap the text inside the area
            // the area is too small. We should inform the user
            // about this in a meaningful way
        } else {
            // We determine the y of the first line
            var ly = hudHintOffsetY_px + 12 + 5; // TODO: Font size + border padding
            var lx = 0;
            chips.assets.canvi.gContext.fillStyle = hudHintColor;
            for (var j = 0; j < lines.length; ++j, ly+=fh+spl) {
                // We continue to centralize the lines
                lx = hudHintOffsetX_px+hudHintWidth_px/2-chips.assets.canvi.gContext.measureText(lines[j]).width/2;
                chips.assets.canvi.gContext.fillText(lines[j], lx, ly);
            }
        }
    },

    inventory : function() {
        chips.assets.canvi.gContext.clearRect(inventoryOffsetX_px, inventoryOffsetY_px,
            inventoryWidth_tiles * chips.draw.TILE_SIZE,
            inventoryHeight_tiles * chips.draw.TILE_SIZE);

        for (var y = 0; y < inventoryHeight_tiles; y++) {
            for (var x = 0; x < inventoryWidth_tiles; x++) {
                chips.draw.tile(chips.g.tiles.FLOOR, x, y, inventoryOffsetX_px, inventoryOffsetY_px);
            }
        }

        var destX, destY, inv = chips.g.cam.inventory;
        for (var i in inv) {
            if (!inv.hasOwnProperty(i)) { continue; }
            if (inv[i].quantity > 0) {
                destX = inv[i].slot % inventoryWidth_tiles;
                destY = Math.floor(inv[i].slot / inventoryWidth_tiles);
                chips.draw.tile(chips.g.tiles[i], destX, destY, inventoryOffsetX_px, inventoryOffsetY_px);
            }
        }
    },

    util : {
        /**
         * function blendLayers
         * Places one image over top of another, ignoring transparent (alpha = 0) pixels
         * TODO: Blend partial alpha values? (1-254)
         *
         * @param lowerImageData - bottom image to blend
         * @param upperImageData - top image to blend
         * @returns Image.data - the blended image data
         */

        blendLayers : function(lowerImageData, upperImageData) {
            for (var px = 0; px < upperImageData.data.length; px+=4) {
                if (upperImageData.data[px+3] > 0) { // If pixel is not transparent (alpha), overwrite prev layer
                    lowerImageData.data[px] = upperImageData.data[px];
                    lowerImageData.data[px+1] = upperImageData.data[px+1];
                    lowerImageData.data[px+2] = upperImageData.data[px+2];
                    lowerImageData.data[px+3] = upperImageData.data[px+3];
                }
            }
            return lowerImageData;
        },

        digitImageFromString : function(str, xDest_px, yDest_px, color) {
            str = chips.draw.util.prepareForHud(str, "---");
            if (str === "---") { color = "yellow" } // TODO: silly temporary override thing

            var xSource_px = 0,
                ySource_px = (color === "yellow" ? hudDigitHeight_px + hudDigitSpacingY_px : 0);

            for (var i = 0; i < 3; i++) { // TODO: Will need to expand if drawing longer numbers
                if (str[i].match(/^[0-9]$/)) { // +1 to skip "blank" character
                    xSource_px = (parseInt(str[i]) + 1) * (hudDigitWidth_px + hudDigitSpacingX_px)
                } else if (str[i] === "-") { // TODO: Hard-coded shiz
                    xSource_px = 11 * (hudDigitWidth_px + hudDigitSpacingX_px);
                } else { // "blank" character
                    xSource_px = 0;
                }

                chips.assets.canvi.gContext.putImageData(chips.assets.canvi.dContext.getImageData(
                        xSource_px,
                        ySource_px,
                        hudDigitWidth_px,
                        hudDigitHeight_px
                    ),
                    xDest_px,
                    yDest_px
                );

                xDest_px += hudDigitWidth_px + hudDigitSpacingX_px;
            }
        },

        // prepares any 3 char string for display on the digital HUD
        prepareForHud : function(str, negativeString) {
            var retStr = str.toString();

            if (str < 0 && negativeString) {
                return negativeString;
            }

            if (retStr.length < 3) {
                switch (retStr.length) {
                    case 2:
                        retStr = " " + retStr;
                        break;
                    case 1:
                        retStr = "  " + retStr;
                        break;
                    case 0:
                        return "---";
                        break;
                }
            } else if (retStr.length > 3) {
                retStr = retStr.substring(0,3);
            }
            if (!retStr.match(/^[0-9-\s]{3}$/)) {
                return "---"; // Non-matching string handled separately from negative string
            }

            return retStr;
        },

        splitForWordWrap : function(text, maxWidth_px) {
            // Adapted from andreinc.net
            chips.assets.canvi.gContext.font = hudHintFont; // TODO: Make to work outside of hint box

            var words = text.split(' ');
            var new_line = words[0];
            var lines = [];
            for(var i = 1; i < words.length; ++i) {
                if (chips.assets.canvi.gContext.measureText(new_line + " " + words[i]).width < maxWidth_px) {
                    new_line += " " + words[i];
                } else {
                    lines.push(new_line);
                    new_line = words[i];
                }
            }
            lines.push(new_line);
            return lines;
        }
    }
};