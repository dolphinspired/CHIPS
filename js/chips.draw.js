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
    HALFBOARD_X : Math.floor(chips.vars.boardWidth_tiles / 2), // Half the visible board, rounded down
    HALFBOARD_Y : Math.floor(chips.vars.boardHeight_tiles / 2),

    LAYER : {
        FLOOR : 0,
        ITEM : 1,
        MONSTER : 2,
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
     * @param offsetX_px - offset of drawing destination, in px (default: chips.vars.boardOffsetX_px)
     * @param offsetY_px - offset of drawing destination, in px (default: chips.vars.boardOffsetY_px)
     * @returns {boolean} - true if draw was successful, false otherwise
     */

    tile : function(tile, xDest_tile, yDest_tile, offsetX_px, offsetY_px) {
        if (typeof xDest_tile === "undefined" || typeof yDest_tile === "undefined") {
            console.error("Destinations missing for chips.draw.tile().");
            return false;
        }

        // If no offset is supplied, it's assumed you're drawing straight to the game board
        var xOffset = (offsetX_px ? offsetX_px : chips.vars.boardOffsetX_px);
        var yOffset = (offsetY_px ? offsetY_px : chips.vars.boardOffsetY_px);

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
                // Layers > 1 need to blend into the lower layers
                tileImageData = chips.draw.util.blendLayers(tileImageData, chips.assets.canvi.tContext.getImageData(xSource_px,ySource_px,t,t));
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

        return true;
    },

    /**
     * function drawActiveMap
     * Draws the part of the level that's currently visible in the game window
     */

    activeMap : function() {
        // Clear out the visible board before redrawing
        chips.assets.canvi.gContext.clearRect(chips.vars.boardOffsetX_px,chips.vars.boardOffsetY_px,
            chips.vars.boardOffsetX_px + (chips.vars.boardWidth_tiles - 1) * chips.draw.TILE_SIZE,
            chips.vars.boardOffsetY_px + (chips.vars.boardHeight_tiles - 1) * chips.draw.TILE_SIZE
        );

        var xSource, ySource, xDest = 0, yDest = 0;
        for (ySource = chips.g.cam.view.top; ySource <= chips.g.cam.view.bottom; ySource++) {
            for (xSource = chips.g.cam.view.left; xSource <= chips.g.cam.view.right; xSource++) {
                chips.draw.tile(chips.g.cam.board[ySource][xSource], xDest, yDest);
                xDest++;
            }
            xDest = 0;
            yDest++;
        }

        chips.util.detectCollision("player", "state", chips.g.cam.chip.x, chips.g.cam.chip.y);
    },

    debug : function(args) {
        var ctx = chips.assets.canvi.gContext;
        var debugMessage = "CHIP: " + chips.g.cam.chip.x + ", " + chips.g.cam.chip.y +
            " / keylock: " + chips.g.keylock + " / turn: " + chips.g.cam.turn;
        var drawX = 6, drawY = chips.assets.canvi.gCanvas.height-6;

        // Erase and redraw the background
        ctx.clearRect(
            0,
            chips.vars.boardOffsetY_px + chips.vars.boardHeight_tiles * chips.draw.TILE_SIZE,
            chips.assets.canvi.wCanvas.width,
            chips.assets.canvi.wCanvas.height
        );
        ctx.putImageData(chips.assets.canvi.wContext.getImageData(
                0, // Source top-left x
                chips.vars.boardOffsetY_px + chips.vars.boardHeight_tiles * chips.draw.TILE_SIZE, // Source top-left y
                chips.assets.canvi.wCanvas.width, // Source bottom-right x
                chips.assets.canvi.wCanvas.height), // Source bottom-right y
            0, // Dest top-right x
            chips.vars.boardOffsetY_px + chips.vars.boardHeight_tiles * chips.draw.TILE_SIZE  // Dest top-right y
        );

        // Draw the debug message
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = "black";
        ctx.textAlign = "start";
        ctx.fillText( debugMessage, drawX+2, drawY+2); // shadow
        ctx.fillText( debugMessage, drawX+1, drawY+1); // shadow
        ctx.fillStyle = "yellow";
        ctx.fillText( debugMessage, drawX, drawY); // bottom-left
    },

    hud : function() {
        chips.draw.levelNumber();
        chips.draw.time();
        if (chips.util.getLayer(chips.g.cam.board[chips.g.cam.chip.y][chips.g.cam.chip.x], 0) === chips.g.tiles.HINT) {
            chips.draw.hint();
        } else {
            chips.draw.chipsLeft();
            chips.draw.inventory();
        }
    },

    levelNumber : function() {
        var color = (chips.g.cam.number <= chips.vars.hudLevelNumWarningThreshold ? chips.vars.hudColorWarning : chips.vars.hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.number, chips.vars.hudLevelNumOffsetX_px, chips.vars.hudLevelNumOffsetY_px, color);
    },

    time : function() {
        var color = (chips.g.cam.timeLeft <= chips.vars.hudTimeWarningThreshold ? chips.vars.hudColorWarning : chips.vars.hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.timeLeft, chips.vars.hudTimeOffsetX_px, chips.vars.hudTimeOffsetY_px, color);
    },

    chipsLeft : function() {
        var color = (chips.g.cam.chipsLeft <= chips.vars.hudChipsLeftWarningThreshold ? chips.vars.hudColorWarning : chips.vars.hudColorNormal);
        chips.draw.util.digitImageFromString(chips.g.cam.chipsLeft, chips.vars.hudChipsLeftOffsetX_px, chips.vars.hudChipsLeftOffsetY_px, color);
    },

    hint : function() {
        // TODO: Inset border
        chips.assets.canvi.gContext.strokeStyle = "white";
        chips.assets.canvi.gContext.lineWidth = chips.vars.hudHintPadding_px - 1;
        var lw = chips.assets.canvi.gContext.lineWidth;
        chips.assets.canvi.gContext.strokeRect(chips.vars.hudHintOffsetX_px, chips.vars.hudHintOffsetY_px, chips.vars.hudHintWidth_px, chips.vars.hudHintHeight_px);

        chips.assets.canvi.gContext.fillStyle = "black";
        chips.assets.canvi.gContext.fillRect(chips.vars.hudHintOffsetX_px+lw/2, chips.vars.hudHintOffsetY_px+lw/2, chips.vars.hudHintWidth_px-lw, chips.vars.hudHintHeight_px-lw);

        var lines = chips.draw.util.splitForWordWrap(chips.g.cam.hint, chips.vars.hudHintWidth_px-(2*chips.vars.hudHintPadding_px));

        var fh = 12, spl = 5, h = chips.vars.hudHintHeight_px; // TODO: Hard-coded shit
        var both = lines.length * (fh + spl);
        if (both >= h) {
            // We won't be able to wrap the text inside the area
            // the area is too small. We should inform the user
            // about this in a meaningful way
        } else {
            // We determine the y of the first line
            var ly = chips.vars.hudHintOffsetY_px + 12 + 5; // TODO: Font size + border padding
            var lx = 0;
            chips.assets.canvi.gContext.fillStyle = chips.vars.hudHintColor;
            chips.assets.canvi.gContext.textAlign = "start";
            for (var j = 0; j < lines.length; ++j, ly+=fh+spl) {
                // We continue to centralize the lines
                lx = chips.vars.hudHintOffsetX_px+chips.vars.hudHintWidth_px/2-chips.assets.canvi.gContext.measureText(lines[j]).width/2;
                chips.assets.canvi.gContext.fillText(lines[j], lx, ly);
            }
        }
    },

    inventory : function() {
        chips.assets.canvi.gContext.clearRect(chips.vars.inventoryOffsetX_px, chips.vars.inventoryOffsetY_px,
            chips.vars.inventoryWidth_tiles * chips.draw.TILE_SIZE,
            chips.vars.inventoryHeight_tiles * chips.draw.TILE_SIZE);

        for (var y = 0; y < chips.vars.inventoryHeight_tiles; y++) {
            for (var x = 0; x < chips.vars.inventoryWidth_tiles; x++) {
                chips.draw.tile(chips.g.tiles.FLOOR, x, y, chips.vars.inventoryOffsetX_px, chips.vars.inventoryOffsetY_px);
            }
        }

        var destX, destY, inv = chips.g.cam.inventory;
        for (var i in inv) {
            if (!inv.hasOwnProperty(i)) { continue; }
            if (inv[i].quantity > 0) {
                destX = inv[i].slot % chips.vars.inventoryWidth_tiles;
                destY = Math.floor(inv[i].slot / chips.vars.inventoryWidth_tiles);
                chips.draw.tile(chips.g.tiles[i], destX, destY, chips.vars.inventoryOffsetX_px, chips.vars.inventoryOffsetY_px);
            }
        }
    },

    loadScreen : function(percentLoaded) {
        var ctx = chips.assets.canvi.gContext;

        ctx.clearRect(0, 0, chips.vars.gameWindowWidth, chips.vars.gameWindowHeight);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, chips.vars.gameWindowWidth, chips.vars.gameWindowHeight);

        ctx.font = "bold 16px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Loading - " + Math.floor(percentLoaded) + "%", chips.vars.gameWindowWidth/2, chips.vars.gameWindowHeight/2);
    },

    pauseScreen : function() {
        var ctx = chips.assets.canvi.gContext;
        var top = chips.vars.boardOffsetY_px;
        var left = chips.vars.boardOffsetX_px;
        var height = chips.vars.boardHeight_tiles * chips.draw.TILE_SIZE;
        var width = chips.vars.boardWidth_tiles * chips.draw.TILE_SIZE;
        var textX = left + width/2;
        var textY = top + height/2;

        ctx.clearRect(left, top, width, height);
        ctx.fillStyle = "black";
        ctx.fillRect(left, top, width, height);

        ctx.font = "48px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "red";
        ctx.fillText("PAUSED", textX, textY);

        ctx.font = "bold 16px Arial";
        ctx.fillText("Level " + chips.g.cam.number + ": \"" + chips.g.cam.name +"\"", textX, textY + 48);
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
                ySource_px = (color === "yellow" ? chips.vars.hudDigitHeight_px + chips.vars.hudDigitSpacingY_px : 0);

            for (var i = 0; i < 3; i++) { // TODO: Will need to expand if drawing longer numbers
                if (str[i].match(/^[0-9]$/)) { // +1 to skip "blank" character
                    xSource_px = (parseInt(str[i]) + 1) * (chips.vars.hudDigitWidth_px + chips.vars.hudDigitSpacingX_px)
                } else if (str[i] === "-") { // TODO: Hard-coded shiz
                    xSource_px = 11 * (chips.vars.hudDigitWidth_px + chips.vars.hudDigitSpacingX_px);
                } else { // "blank" character
                    xSource_px = 0;
                }

                chips.assets.canvi.gContext.putImageData(chips.assets.canvi.dContext.getImageData(
                        xSource_px,
                        ySource_px,
                        chips.vars.hudDigitWidth_px,
                        chips.vars.hudDigitHeight_px
                    ),
                    xDest_px,
                    yDest_px
                );

                xDest_px += chips.vars.hudDigitWidth_px + chips.vars.hudDigitSpacingX_px;
            }
        },

        // prepares any 3 char string for display on the digital HUD
        prepareForHud : function(str, negativeString) {
            if (typeof str == "undefined") {
                console.error("No string defined for prepareForHud().")
                if (chips.g.debug) { debugger; }
                return "---";
            }

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
            chips.assets.canvi.gContext.font = chips.vars.hudHintFont; // TODO: Make to work outside of hint box

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