/**
 * Created by Brogan on 10/13/2015.
 */
/*
 *
 */

function initAllEvents() {

    // Prevent default behavior (page scrolling) with arrow keys
    $(document).on("keydown", function(e) {
        $.each(keys, function (k, val) {
            if (e.keyCode === val) {
                e.preventDefault();
            }
        });
    });

    /*-----------------------------------
     * UP
     *-----------------------------------*/

    kd.UP.down( function(e) {
        if (keylock === 0) {
            moveChip(dir.NORTH);
        }
        keydownCommon(this);
    });

    kd.UP.up( function(e) {
        keyupCommon(this);
    });

    /*-----------------------------------
     * DOWN
     *-----------------------------------*/

    kd.DOWN.down( function(e) {
        if (keylock === 0) {
            moveChip(dir.SOUTH);
        }
        keydownCommon(this);
    });

    kd.DOWN.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * LEFT
     *-----------------------------------*/

    kd.LEFT.down( function() {
        if (keylock === 0) {
            moveChip(dir.WEST);
        }
        keydownCommon(this);
    });

    kd.LEFT.up( function() {
        keyupCommon(this);
    });

    /*-----------------------------------
     * RIGHT
     *-----------------------------------*/

    kd.RIGHT.down( function() {
        if (keylock === 0) {
            moveChip(dir.EAST);
        }
        keydownCommon(this);
    });

    kd.RIGHT.up( function() {
        keyupCommon(this);
    });

    // Very hacky way to cycle through test levels
    kd.Z.down( function() {
        if (keylock === 0){
            loadNextLevel();
        }
        keydownCommon(this);
    });

    kd.Z.up( function() {
        keyupCommon(this);
    });

    function keydownCommon(oKey) {
        keylock++;
        if (debug) { drawDebug(); }
    }

    function keyupCommon(oKey) {
        keylock = 0;
        if (currentActiveMap.chip_facing !== dir.SOUTH) {
            addRequest("startChipResetDelay");
        }
        if (debug) { drawDebug(); }
    }
}

/**
 * function moveChip
 * Change chip's location by one tile in the directions specified
 *
 * @param direction - a number corresponding to a direction (use dir enum)
 */
function moveChip(direction) {
    var cam = currentActiveMap, d = direction;
    var thisTile = cam.level[cam.chip_y][cam.chip_x];
    var nextTile;

    // Remove Chip from the map*
    // *Works only as long as Chip is on the TOP layer. In the future, refactor to allow higher tile layer.
    cam.level[cam.chip_y][cam.chip_x] %= tiles.CHIP_BASE;

    /* PROCESS FOR CHIP'S MOVEMENT:
     * 1. Remove Chip from the map (statement above).
     *    Note: this currently will only work if Chip is the top layer. Can be improved later.
     * 2. Is Chip at the edge of the map? If not, get the next tile's data.
     * 3. Does the next tile cause a collision? If not, update Chip's location in the cam.
     * 4. Re-draw chip to the map using the update or not-updated location.
     * 5. Update chip_facing in the cam.
     */
    switch (d) {
        case dir.NORTH:
            if (!edgeCollision(d)) { nextTile = cam.level[cam.chip_y-1][cam.chip_x]; }
            if (typeof nextTile !== "undefined" && !barrierCollision(cam.chip_x, cam.chip_y, d)) { cam.chip_y--; }
            cam.level[cam.chip_y][cam.chip_x] += tiles.CHIP_NORTH;
            cam.chip_facing = dir.NORTH;
            break;
        case dir.WEST:
            if (!edgeCollision(d)) { nextTile = cam.level[cam.chip_y][cam.chip_x-1]; }
            if (typeof nextTile !== "undefined" && !barrierCollision(cam.chip_x, cam.chip_y, d)) { cam.chip_x--; }
            cam.level[cam.chip_y][cam.chip_x] += tiles.CHIP_WEST;
            cam.chip_facing = dir.WEST;
            break;
        case dir.SOUTH:
            if (!edgeCollision(d)) { nextTile = cam.level[cam.chip_y+1][cam.chip_x]; }
            if (typeof nextTile !== "undefined" && !barrierCollision(cam.chip_x, cam.chip_y, d)) { cam.chip_y++; }
            cam.level[cam.chip_y][cam.chip_x] += tiles.CHIP_SOUTH;
            cam.chip_facing = dir.SOUTH;
            break;
        case dir.EAST:
            if (!edgeCollision(d)) { nextTile = cam.level[cam.chip_y][cam.chip_x+1]; }
            if (typeof nextTile !== "undefined" && !barrierCollision(cam.chip_x, cam.chip_y, d)) { cam.chip_x++; }
            cam.level[cam.chip_y][cam.chip_x] += tiles.CHIP_EAST;
            cam.chip_facing = dir.EAST;
            break;
        default:
            cam.level[cam.chip_y][cam.chip_x] += tiles.CHIP_SOUTH;
            break;
    }
    interactiveCollision(); // For all events on the tile that Chip has moved onto

    currentVisibleMap.update();
    addRequest("updateMap");

}

function killChip(msg) {
    if (!msg) { msg = "Oh dear, you are dead!" }
    addRequest("setGameMessage",msg); // TODO: Enhance
    currentActiveMap.reset();
    addRequest("redrawAll");
}

function winChip() {
    // TODO: in lieu of a dialog box...
    addRequest("setGameMessage", "<span style='color:red'>Hooray, you completed Level " + currentActiveMap.levelNum +
        " with a time of " + currentActiveMap.time + " seconds!</span>");
    loadNextLevel();
}

function dialog(msg) {

}