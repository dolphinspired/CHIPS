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
function barrierCollision(thisTile, nextTile, moveDir) {
    var cam = currentActiveMap, d = moveDir;

    // Is there collision with a solid tile? If so, return true;
    var thisFloor = getLayer(thisTile, drawVars.LAYER_FLOOR);
    var nextFloor = getLayer(nextTile, drawVars.LAYER_FLOOR);

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
            if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_KEY_GREEN)]) { return true; } else { break; }
        case tiles.LOCK_BLUE:
            if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_KEY_BLUE)]) { return true; } else { break; }
        case tiles.LOCK_YELLOW:
            if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_KEY_YELLOW)]) { return true; } else { break; }
        case tiles.LOCK_RED:
            if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_KEY_RED)]) { return true; } else { break; }
        case tiles.SOCKET:
            if (cam.chipsLeft > 0) { return true; } else { break; }
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
    var thisTile = cam.level[cam.chip_y][cam.chip_x];
    var thisItem = getLayer(thisTile, drawVars.LAYER_ITEM);
    var thisFloor = getLayer(thisTile, drawVars.LAYER_FLOOR);
    var retItem = false, retFloor = false;

    // If tile contains an item, and item is successfully added (item exists)
    if (thisItem && cam.addItemFromTile(thisItem * tiles.ITEM_BASE)) {
        retItem = true;
        cam.level[cam.chip_y][cam.chip_x] -= thisItem * tiles.ITEM_BASE;
    }
    // Handled separately but still considered an item, the illustrious COMPUTER CHIP
    if (thisItem * tiles.ITEM_BASE === tiles.ITEM_CHIP) {
        cam.level[cam.chip_y][cam.chip_x] -= tiles.ITEM_CHIP;
        cam.decrementChipsLeft();
    }

    // Floor traps
    if (thisFloor !== tiles.FLOOR) {
        retFloor = true;
        switch(thisFloor) {
            case tiles.THIEF:
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_FLIPPER), true);
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES), true);
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_BOOT), true);
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_SKATE), true);
                break;
            case tiles.WATER:
                if (cam.inventory[inventoryMap.indexOf(tiles.ITEM_FLIPPER)] > 0) {
                    cam.level[cam.chip_y][cam.chip_x] += tiles.SWIM_DIFF;
                } else {
                    updateChip(tiles.CHIP_SPLASH);
                }
                break;
            case tiles.FIRE:
                if (cam.inventory[inventoryMap.indexOf(tiles.ITEM_BOOT)] > 0) {
                    // No change necessary
                } else {
                    updateChip(tiles.CHIP_BURNT);
                }
                break;
            case tiles.FORCE_FLOOR_NORTH:
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES)]) { //
                    // TODO: Force floor behavior
                    console.log("Force floor north");
                }
                break;
            case tiles.FORCE_FLOOR_SOUTH:
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES)]) {
                    // TODO: Force floor behavior
                    console.log("Force floor south");
                }
                break;
            case tiles.FORCE_FLOOR_EAST:
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES)]) {
                    // TODO: Force floor behavior
                    console.log("Force floor east");
                }
                break;
            case tiles.FORCE_FLOOR_WEST:
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES)]) {
                    // TODO: Force floor behavior
                    console.log("Force floor west");
                }
                break;
            case tiles.FORCE_FLOOR_RANDOM:
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SUCTIONSHOES)]) {
                    // TODO: Force floor behavior
                    console.log("Force floor random");
                }
                break;
            case tiles.ICE:
                // TODO: add corners
                // TODO: add ice behavior
                if (!cam.inventory[inventoryMap.indexOf(tiles.ITEM_SKATE)]) {
                    // TODO: Force floor behavior
                    console.log("Ice");
                }
                break;
            case tiles.LOCK_GREEN: // Green keys are infinite, no item removed
                cam.level[cam.chip_y][cam.chip_x] -= tiles.LOCK_GREEN; // If Chip is on a lock, he had the key
                break;
            case tiles.LOCK_BLUE:
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_KEY_BLUE));
                cam.level[cam.chip_y][cam.chip_x] -= tiles.LOCK_BLUE;
                break;
            case tiles.LOCK_YELLOW:
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_KEY_YELLOW));
                cam.level[cam.chip_y][cam.chip_x] -= tiles.LOCK_YELLOW;
                break;
            case tiles.LOCK_RED:
                cam.removeItem(inventoryMap.indexOf(tiles.ITEM_KEY_RED));
                cam.level[cam.chip_y][cam.chip_x] -= tiles.LOCK_RED;
                break;
            case tiles.SOCKET:
                cam.level[cam.chip_y][cam.chip_x] -= tiles.SOCKET;
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
    var enemyLayer = getLayer(currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x], drawVars.LAYER_ENEMY);
    var floorLayer = getLayer(currentActiveMap.level[currentActiveMap.chip_y][currentActiveMap.chip_x], drawVars.LAYER_FLOOR);

    // All enemies are currently handled the same - Chip is killed
    if (enemyLayer) {
        return "Oh dead, you are dead!";
    }

    switch (floorLayer) {
        case tiles.WATER:
            if (!currentActiveMap.inventory[inventoryMap.indexOf(tiles.ITEM_FLIPPER)]) {
                return "Chip can't swim without flippers!";
            }
            break;
        case tiles.FIRE:
            if (!currentActiveMap.inventory[inventoryMap.indexOf(tiles.ITEM_BOOT)]) {
                return "Chip can't walk on fire without boots!";
            }
            break;
        case tiles.EXIT:
            return "Hooray, you win! Now the level will reset..."; // TODO: Silly temporary hack
        default:
            break;
    }

    return "";
}