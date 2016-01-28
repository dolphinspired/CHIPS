/**
 * Created by Brogan on 10/13/2015.
 */

chips.g = {
    frame : 0,
    state : 0,
    keylock : 0,
    debug : 1,
    turnTime : 200,

    loop : {},
    cam : {}, // Current Active Map
    cls : {}, // Current Level Set
    tiles : {},
    tLookup : {},

    last : {
        levelset : "", // Updated in chips.data.loadLevelset()
        tileset : ""
    },

    // Refresh is run automatically when all assets are loaded
    refresh : function() {
        this.cls = chips.data.levels.loaded[this.last.levelset];
        this.tiles = new chips.util.TileMap(chips.data.tiles); // TODO: Change all these when tilesets are implemented
        this.tLookup = new chips.util.ReverseTileMap(chips.data.tiles);
    },

    test : {
        init : function() {

        }
    }
};