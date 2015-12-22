/**
 * Created by Brogan on 12/13/2015.
 */
// Chip cannot move off the edge of the map
function edgeCollision(moveDir) {
    var cam = currentActiveMap;
    if (moveDir === dir.WEST && cam.chip_x === 0) { return true; }
    if (moveDir === dir.NORTH && cam.chip_y === 0) { return true; }
    if (moveDir === dir.EAST && cam.chip_x === cam.width - 1) { return true; }
    if (moveDir === dir.SOUTH && cam.chip_y === cam.height - 1) { return true; }
    return false;
}

// Chip cannot move onto a tile that would cause a barrier collision, and the adjacent tile must not change
function barrierCollision(currentX, currentY, moveDir) {
    var cam = currentActiveMap, x = currentX, y = currentY, d = moveDir;
    var nextX = nextCoords(x, y, d)[0], nextY = nextCoords(x, y, d)[1];


    // Is there collision with a solid tile? If so, return true;
    var thisFloor = cam.getTileLayer(x, y, drawVars.LAYER_FLOOR);
    var nextFloor = cam.getNextTileLayer(x, y, d, drawVars.LAYER_FLOOR);
    var nextItem = cam.getNextTileLayer(x, y, d, drawVars.LAYER_ITEM);
    var nextEnemy = cam.getNextTileLayer(x, y, d, drawVars.LAYER_ENEMY);

    // Check for block-pushing rules
    if (thisFloor === tiles.BLOCK) {
        if (nextItem === tiles.ITEM_CHIP) {
            return true;
        } else if (nextFloor === tiles.BLOCK) {
            return true;
        } else if (nextFloor === tiles.MUD) {
            return true;
        } else if (nextEnemy) {
            return true;
        }
    }

    // TODO: think of a more modular way to get tile solidity information
    switch (thisFloor) {
        case tiles.THIN_WALL_NORTH:
            if (d === dir.NORTH) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTH:
            if (d === dir.SOUTH) { return true; } else { break; }
        case tiles.THIN_WALL_EAST:
            if (d === dir.EAST) { return true; } else { break; }
        case tiles.THIN_WALL_WEST:
            if (d === dir.WEST) { return true; } else { break; }
        case tiles.THIN_WALL_NORTHEAST:
            if (d === dir.NORTH || d === dir.EAST) { return true; } else { break; }
        case tiles.THIN_WALL_NORTHWEST:
            if (d === dir.NORTH || d === dir.WEST) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTHEAST:
            if (d === dir.SOUTH || d === dir.EAST) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTHWEST:
            if (d === dir.SOUTH || d === dir.WEST) { return true; } else { break; }
    }

    switch (nextFloor) {
        case tiles.THIN_WALL_NORTH:
            if (d === dir.SOUTH) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTH:
            if (d === dir.NORTH) { return true; } else { break; }
        case tiles.THIN_WALL_EAST:
            if (d === dir.WEST) { return true; } else { break; }
        case tiles.THIN_WALL_WEST:
            if (d === dir.EAST) { return true; } else { break; }
        case tiles.THIN_WALL_NORTHEAST:
            if (d === dir.SOUTH || d === dir.WEST) { return true; } else { break; }
        case tiles.THIN_WALL_NORTHWEST:
            if (d === dir.SOUTH || d === dir.EAST) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTHEAST:
            if (d === dir.NORTH || d === dir.WEST) { return true; } else { break; }
        case tiles.THIN_WALL_SOUTHWEST:
            if (d === dir.NORTH || d === dir.EAST) { return true; } else { break; }
        case tiles.WALL:
            return true;
        case tiles.LOCK_GREEN:
            if (!cam.inventory[items.ITEM_KEY_GREEN]) { return true; } else { break; }
        case tiles.LOCK_BLUE:
            if (!cam.inventory[items.ITEM_KEY_BLUE]) { return true; } else { break; }
        case tiles.LOCK_YELLOW:
            if (!cam.inventory[items.ITEM_KEY_YELLOW]) { return true; } else { break; }
        case tiles.LOCK_RED:
            if (!cam.inventory[items.ITEM_KEY_RED]) { return true; } else { break; }
        case tiles.SOCKET:
            if (cam.chipsLeft > 0) { return true; } else { break; }
        case tiles.FAKE_WALL_HOLLOW:
            cam.setChipsNextTile(d, tiles.FLOOR);
            break;
        case tiles.FAKE_WALL_SOLID:
            cam.setChipsNextTile(d, tiles.WALL);
            return true;
        case tiles.INVISIBLE_WALL:
            return true;
        case tiles.BLOCK: // TODO: modularize this
            if (thisFloor === tiles.BLOCK) {
                return true;
            } else if (barrierCollision(nextX, nextY, d)) {
                return true;
            } else if (cam.getRelativeTileLayer(x, y, d, 2, drawVars.LAYER_FLOOR) === tiles.BOMB) {
                cam.clearNextTileLayer(x, y, d, drawVars.LAYER_FLOOR);
                cam.clearRelativeTileLayer(x, y, d, 2, drawVars.LAYER_FLOOR);
            } else if (cam.getRelativeTileLayer(x, y, d, 2, drawVars.LAYER_FLOOR) === tiles.WATER) {
                cam.clearNextTileLayer(x, y, d, drawVars.LAYER_FLOOR);
                cam.setRelativeTileLayer(x, y, d, 2, drawVars.LAYER_FLOOR, tiles.MUD);
            } else { // No collision, block can be pushed
                cam.clearNextTileLayer(x, y, d, drawVars.LAYER_FLOOR);
                cam.setRelativeTileLayer(x, y, d, 2, drawVars.LAYER_FLOOR, tiles.BLOCK);
            }
            break;
        default:
            break;
    }

    // Chip can move, there was no collision!
    return false;
}

/**
 * function interactiveCollision()
 * After Chip moves, this performs any tile changes that need to occur as a result of being on the new tile.
 *
 * returns boolean - true if a change was triggered by this function, false otherwise
 */
function interactiveCollision() {
    var cam = currentActiveMap;
    var thisItem = cam.getChipsTileLayer(drawVars.LAYER_ITEM);
    var thisFloor = cam.getChipsTileLayer(drawVars.LAYER_FLOOR);
    var retItem = false, retFloor = false;

    // First, let's unload the hint if Chip moves off the Hint tile
    // TODO: Bug - If you hit a wall while standing on a tile, hint won't dissolve on next move
    if (hintShown && thisFloor !== tiles.HINT) {
        addRequest("toggleHint");
    }

    // If tile contains an item, and item is successfully added (item exists)
    if (thisItem && cam.addItemFromTile(thisItem)) {
        retItem = true;
        cam.clearChipsTileLayer(drawVars.LAYER_ITEM);
    }
    // Handled separately but still considered an item, the illustrious COMPUTER CHIP
    if (thisItem === tiles.ITEM_CHIP) {
        cam.decrementChipsLeft();
        cam.clearChipsTileLayer(drawVars.LAYER_ITEM);
    }

    // Floor traps
    if (thisFloor !== tiles.FLOOR) {
        retFloor = true;
        switch(thisFloor) {
            case tiles.THIEF:
                cam.removeItem(items.ITEM_FLIPPER, true);
                cam.removeItem(items.ITEM_SUCTIONSHOES, true);
                cam.removeItem(items.ITEM_BOOT, true);
                cam.removeItem(items.ITEM_SKATE, true);
                break;
            case tiles.WATER:
                if (cam.inventory[items.ITEM_FLIPPER] > 0) {
                    cam.level[cam.chip_y][cam.chip_x] += tiles.SWIM_DIFF; // Make a function for this?
                } else {
                    cam.setChipsTileLayer(drawVars.LAYER_CHIP, tiles.CHIP_SPLASH);
                }
                break;
            case tiles.FIRE:
                if (cam.inventory[items.ITEM_BOOT] > 0) {
                    // No change necessary
                } else {
                    cam.setChipsTileLayer(drawVars.LAYER_CHIP, tiles.CHIP_BURNT);
                }
                break;
            case tiles.FORCE_FLOOR_NORTH:
                if (!cam.inventory[items.ITEM_SUCTIONSHOES]) {
                    // TODO: Force floor behavior
                    console.log("Force floor north");
                }
                break;
            case tiles.FORCE_FLOOR_SOUTH:
                if (!cam.inventory[items.ITEM_SUCTIONSHOES]) {
                    // TODO: Force floor behavior
                    console.log("Force floor south");
                }
                break;
            case tiles.FORCE_FLOOR_EAST:
                if (!cam.inventory[items.ITEM_SUCTIONSHOES]) {
                    // TODO: Force floor behavior
                    console.log("Force floor east");
                }
                break;
            case tiles.FORCE_FLOOR_WEST:
                if (!cam.inventory[items.ITEM_SUCTIONSHOES]) {
                    // TODO: Force floor behavior
                    console.log("Force floor west");
                }
                break;
            case tiles.FORCE_FLOOR_RANDOM:
                if (!cam.inventory[items.ITEM_SUCTIONSHOES]) {
                    // TODO: Force floor behavior
                    console.log("Force floor random");
                }
                break;
            case tiles.ICE:
                // TODO: add corners
                // TODO: add ice behavior
                if (!cam.inventory[items.ITEM_SKATE]) {
                    console.log("Ice");
                }
                break;
            case tiles.LOCK_GREEN: // Green keys are infinite, no item removed
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR); // If Chip is on a lock, he had the key
                break;
            case tiles.LOCK_BLUE:
                cam.removeItem(items.ITEM_KEY_BLUE);
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR);
                break;
            case tiles.LOCK_YELLOW:
                cam.removeItem(items.ITEM_KEY_YELLOW);
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR);
                break;
            case tiles.LOCK_RED:
                cam.removeItem(items.ITEM_KEY_RED);
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR);
                break;
            case tiles.SOCKET:
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR);
                break;
            case tiles.HINT:
                addRequest("toggleHint");
                break;
            case tiles.RECESSED_WALL:
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.WALL);
                break;
            case tiles.MUD:
                cam.setChipsTileLayer(drawVars.LAYER_FLOOR, tiles.FLOOR);
                break;
            default:
                retFloor = false;
                break;
        }
    }

    return (retItem || retFloor);
}

/**
 * function fatalCollision
 * Checks to see if the tile that Chip is currently on would cause him to die (from enemy, floor trap, etc.)
 * This is called after
 *
 * @returns {*}
 */
function fatalCollision() {
    var floorLayer = currentActiveMap.getChipsTileLayer(drawVars.LAYER_FLOOR);
    var enemyLayer = currentActiveMap.getChipsTileLayer(drawVars.LAYER_ENEMY);

    // All enemies are currently handled the same - Chip is killed
    if (enemyLayer) {
        return "Oh dear, you are dead!";
    }

    switch (floorLayer) {
        case tiles.WATER:
            if (!currentActiveMap.inventory[items.ITEM_FLIPPER]) {
                return "Chip can't swim without flippers!";
            }
            break;
        case tiles.FIRE:
            if (!currentActiveMap.inventory[items.ITEM_BOOT]) {
                return "Chip can't walk on fire without boots!";
            }
            break;
        case tiles.BOMB:
            return "Oh dear, you are dead!";
            break;
        case tiles.EXIT:
            return "WIN"; // TODO: Silly temporary hack
        default:
            break;
    }

    return "";
}

function nextCoords(currentX, currentY, direction, distance) {
    distance = (!distance || distance <= 0 ? 1 : distance);

    switch(direction) {
        case dir.NORTH:
            return [currentX,currentY-distance];
        case dir.SOUTH:
            return [currentX,currentY+distance];
        case dir.EAST:
            return [currentX+distance,currentY];
        case dir.WEST:
            return [currentX-distance,currentY];
        default:
            return [currentX,currentY];
    }
}