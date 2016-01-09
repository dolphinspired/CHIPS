/**
 * Created by Brogan on 10/13/2015.
 */

/**
 * function drawGameFrame
 * Copies the window canvas image onto the main game canvas
 */
function drawGameframe() {
    canvi.gContext.clearRect(0,0,canvi.gCanvas.width,canvi.gCanvas.height);
    canvi.gContext.putImageData(canvi.wContext.getImageData(0, 0, canvi.wCanvas.width, canvi.wCanvas.height), 0, 0);
}

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
function drawTile(tile, xDest_tile, yDest_tile, offsetX_px, offsetY_px) {
    if (typeof xDest_tile === "undefined" || typeof yDest_tile === "undefined") {
        console.error("Destinations missing for drawTile().");
        return false;
    }

    // If no offset is supplied, it's assumed you're drawing straight to the game board
    var xOffset = (offsetX_px ? offsetX_px : boardOffsetX_px);
    var yOffset = (offsetY_px ? offsetY_px : boardOffsetY_px);

    // If drawing Chip and his facing does not match the cam's info, update his facing to match the cam.
    if (tile > tiles.CHIP_BASE && currentActiveMap.chip_facing !== getLayerCoord(tile, 6)) {
        var newChip = getLayerCoord(tile, 7) * drawVars.LAYER_SIZE_BITS + currentActiveMap.chip_facing;
        currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x] %= tiles.CHIP_BASE;
        currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x] += newChip * tiles.CHIP_BASE;
    }

    var t = drawVars.TILE_SIZE,
        p = drawVars.LAYER_SIZE_PX;

    var tileImageData = canvi.tContext.createImageData(t,t);

    var allLayerCoords = getAllLayerCoords(tile);
    var xSource_px,  ySource_px;

    // Grab the source px for each layer of the tile, then blend it with the layer below
    for (var curLayer = 0; curLayer < drawVars.NUM_LAYERS; curLayer++) {
        xSource_px = allLayerCoords[2*curLayer+1] * t + layerOffsets.x[curLayer+1];
        ySource_px = allLayerCoords[2*curLayer] * t + layerOffsets.y[curLayer+1];

        if (curLayer > 0 && xSource_px % p === 0 && ySource_px % p === 0) {
            // If tile is not defined in this layer (above floor layer), skip drawing
        } else if (curLayer > 0) {

            if (curLayer === drawVars.LAYER_ITEM && this.obscuresItems(getLayer(tile, drawVars.LAYER_FLOOR))) {
                // Do nothing
                continue;
            } else {
                // Layers > 1 need to blend into the lower layers
                tileImageData = blendLayers(tileImageData, canvi.tContext.getImageData(xSource_px,ySource_px,t,t));
            }
        } else {
            // Layer 1 can skip the blend step
            tileImageData = canvi.tContext.getImageData(xSource_px,ySource_px,t,t);
        }
    }

    // Put the completed 4-layer tile image onto the board at the specified location
    canvi.gContext.putImageData(
        tileImageData,
        xDest_tile * t + xOffset,
        yDest_tile * t + yOffset
    );

    // TODO: Add obscurity tag/value?
    this.obscuresItems = function(tile) {
        return (tile === tiles.BLOCK || tile === tiles.FAKE_WALL_HOLLOW)
    };

    return true;
}

/**
 * function blendLayers
 * Places one image over top of another, ignoring transparent (alpha = 0) pixels
 * TODO: Blend partial alpha values? (1-254)
 *
 * @param lowerImageData - bottom image to blend
 * @param upperImageData - top image to blend
 * @returns Image.data - the blended image data
 */
function blendLayers(lowerImageData, upperImageData) {
    for (var px = 0; px < upperImageData.data.length; px+=4) {
        if (upperImageData.data[px+3] > 0) { // If pixel is not transparent (alpha), overwrite prev layer
            lowerImageData.data[px] = upperImageData.data[px];
            lowerImageData.data[px+1] = upperImageData.data[px+1];
            lowerImageData.data[px+2] = upperImageData.data[px+2];
            lowerImageData.data[px+3] = upperImageData.data[px+3];
        }
    }
    return lowerImageData;
}

/**
 * function drawActiveMap
 * Draws the part of the level that's currently visible in the game window
 */
function drawActiveMap() {

    // Clear out the visible board before redrawing
    canvi.gContext.clearRect(boardOffsetX_px,boardOffsetY_px,
        boardOffsetX_px + (boardWidth_tiles - 1) * drawVars.TILE_SIZE,
        boardOffsetY_px + (boardHeight_tiles - 1) * drawVars.TILE_SIZE
    );

    var chipIsDead = fatalCollision(); // Check to see if Chip is dead - if so, the map will reset after the draw
    var exitReached = (chipIsDead === "WIN");

    var xSource, ySource, xDest = 0, yDest = 0, cvm = currentVisibleMap;
    for (ySource = cvm.topLeft_y; ySource <= cvm.bottomRight_y; ySource++) {
        for (xSource = cvm.topLeft_x; xSource <= cvm.bottomRight_x; xSource++) {
            drawTile(currentActiveMap.level[ySource][xSource], xDest, yDest);
            xDest++;
        }
        xDest = 0;
        yDest++;
    }

    if (exitReached) {
        winChip();
    } else if (chipIsDead.length > 0) {
        killChip(chipIsDead);
    }
}

/**
 * function drawDialogBox
 * TODO: Make something better than an alert box
 *
 * @param msg
 */
function drawDialogBox(msg) {

}

function drawDebug(args) {
    var debugMessage = "CHIP: " + currentActiveMap.chip_x + ", " + currentActiveMap.chip_y +
        " / keylock: " + keylock;
    var drawX = 6, drawY = canvi.gCanvas.height-6;

    // Erase and redraw the background
    canvi.gContext.clearRect(
        0,
        boardOffsetY_px + boardHeight_tiles * drawVars.TILE_SIZE,
        canvi.wCanvas.width,
        canvi.wCanvas.height
    );
    canvi.gContext.putImageData(canvi.wContext.getImageData(
            0, // Source top-left x
            boardOffsetY_px + boardHeight_tiles * drawVars.TILE_SIZE, // Source top-left y
            canvi.wCanvas.width, // Source bottom-right x
            canvi.wCanvas.height), // Source bottom-right y
        0, // Dest top-right x
        boardOffsetY_px + boardHeight_tiles * drawVars.TILE_SIZE  // Dest top-right y
    );

    // Draw the debug message
    canvi.gContext.font = "bold 16px Arial";
    canvi.gContext.fillStyle = "black";
    canvi.gContext.fillText( debugMessage, drawX+2, drawY+2); // shadow
    canvi.gContext.fillText( debugMessage, drawX+1, drawY+1); // shadow
    canvi.gContext.fillStyle = "yellow";
    canvi.gContext.fillText( debugMessage, drawX, drawY); // bottom-left
}

function drawHud() {
    drawLevelNumber();
    drawTime();
    if (getLayer(currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x], 0) === tiles.HINT) {
        drawHint();
    } else {
        drawChipsLeft();
        drawInventory();
    }
}

function drawLevelNumber() {
    var color = (currentActiveMap.levelNum <= hudLevelNumWarningThreshold ? hudColorWarning : hudColorNormal);
    drawDigitImageFromString(currentActiveMap.levelNum, hudLevelNumOffsetX_px, hudLevelNumOffsetY_px, color);
}

function drawTime() {
    var color = (currentActiveMap.time <= hudTimeWarningThreshold ? hudColorWarning : hudColorNormal);
    drawDigitImageFromString(currentActiveMap.time, hudTimeOffsetX_px, hudTimeOffsetY_px, color);
}

function drawChipsLeft() {
    var color = (currentActiveMap.chipsLeft <= hudChipsLeftWarningThreshold ? hudColorWarning : hudColorNormal);
    drawDigitImageFromString(currentActiveMap.chipsLeft, hudChipsLeftOffsetX_px, hudChipsLeftOffsetY_px, color);
}

function drawHint() {
    // TODO: Inset border
    canvi.gContext.strokeStyle = "white";
    canvi.gContext.lineWidth = hudHintPadding_px - 1;
    var lw = canvi.gContext.lineWidth;
    canvi.gContext.strokeRect(hudHintOffsetX_px, hudHintOffsetY_px, hudHintWidth_px, hudHintHeight_px);

    canvi.gContext.fillStyle = "black";
    canvi.gContext.fillRect(hudHintOffsetX_px+lw/2, hudHintOffsetY_px+lw/2, hudHintWidth_px-lw, hudHintHeight_px-lw);

    var lines = splitForWordWrap(currentActiveMap.hint, hudHintWidth_px-(2*hudHintPadding_px));

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
        canvi.gContext.fillStyle = hudHintColor;
        for (var j = 0; j < lines.length; ++j, ly+=fh+spl) {
            // We continue to centralize the lines
            lx = hudHintOffsetX_px+hudHintWidth_px/2-canvi.gContext.measureText(lines[j]).width/2;
            canvi.gContext.fillText(lines[j], lx, ly);
        }
    }
}

/**
 * function drawInventory()
 * Redraws the inventory at the location specified in settings.
 */
function drawInventory() {
    canvi.gContext.clearRect(inventoryOffsetX_px, inventoryOffsetY_px,
        inventoryWidth_tiles * drawVars.TILE_SIZE,
        inventoryHeight_tiles * drawVars.TILE_SIZE);

    for (var y = 0; y < inventoryHeight_tiles; y++) {
        for (var x = 0; x < inventoryWidth_tiles; x++) {
            drawTile(tiles.FLOOR, x, y, inventoryOffsetX_px, inventoryOffsetY_px);
            if (currentActiveMap.inventory[y * inventoryWidth_tiles + x] > 0) {
                drawTile(inventoryMap[y * inventoryWidth_tiles + x], x, y, inventoryOffsetX_px, inventoryOffsetY_px);
            }
        }
    }
}

// returns an imagedata object
function drawDigitImageFromString(str, xDest_px, yDest_px, color) {
    str = prepareForHud(str, "---");
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

        canvi.gContext.putImageData(canvi.dContext.getImageData(
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
}

// prepares any 3 char string for display on the digital HUD
function prepareForHud(str, negativeString) {
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
}

function splitForWordWrap(text, maxWidth_px) {
    // Adapted from andreinc.net
    canvi.gContext.font = hudHintFont; // TODO: Make to work outside of hint box

    var words = text.split(' ');
    var new_line = words[0];
    var lines = [];
    for(var i = 1; i < words.length; ++i) {
        if (canvi.gContext.measureText(new_line + " " + words[i]).width < maxWidth_px) {
            new_line += " " + words[i];
        } else {
            lines.push(new_line);
            new_line = words[i];
        }
    }
    lines.push(new_line);
    return lines;
}