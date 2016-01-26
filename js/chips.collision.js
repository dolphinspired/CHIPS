/**
 * Created by Brogan on 12/13/2015.
 */

// Chip cannot move off the edge of the map
function edgeCollision(moveDir) {
    if (moveDir === chips.util.dir.WEST && chips.g.cam.chip_x === 0) { return true; }
    if (moveDir === chips.util.dir.NORTH && chips.g.cam.chip_y === 0) { return true; }
    if (moveDir === chips.util.dir.EAST && chips.g.cam.chip_x === chips.g.cam.width - 1) { return true; }
    if (moveDir === chips.util.dir.SOUTH && chips.g.cam.chip_y === chips.g.cam.height - 1) { return true; }
    return false;
}

function detectCollision(entity, type, x, y, d) {
    if (type === "barrier" && edgeCollision(d)) { return true; }

    var distance = (type === "barrier" ? 1 : 0); // If type barrier, get next tile, else get this tile

    try {
        var floorData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.FLOOR)]];
        var itemData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.ITEM)]];
        var enemyData = chips.data.tiles[chips.g.tLookup[chips.g.cam.getRelativeTileLayer(x, y, d, distance, chips.draw.LAYER.ENEMY)]];

        var floorCollision, itemCollision, enemyCollision;

        floorCollision = floorData.collision ? (floorData.collision.all || floorData.collision[entity]) : false;
        itemCollision = itemData.collision ? (itemData.collision.all || itemData.collision[entity]) : false;
        enemyCollision = enemyData.collision ? (enemyData.collision.all || enemyData.collision[entity]) : false;

        if (floorCollision && typeof floorCollision[type] == "function") {
            floorCollision = floorCollision[type](x, y, d);
        } else {
            floorCollision = false;
        }

        if (itemCollision && typeof itemCollision[type] == "function") {
            itemCollision = itemCollision[type](x, y, d);
        } else {
            itemCollision = false;
        }

        if (enemyCollision && typeof enemyCollision[type] == "function") {
            enemyCollision = enemyCollision[type](x, y, d);
        } else {
            enemyCollision = false;
        }
    } catch (e) {
        console.error(e);
        return false;
    }

    return floorCollision || itemCollision || enemyCollision;
}