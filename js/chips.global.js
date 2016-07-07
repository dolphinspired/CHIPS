/**
 * Created by Brogan on 10/13/2015.
 */

chips.g = {
    frame : 0,
    state : 0,
    turnTime : 100, // in ms

    // Movement pattern variables
    keylock : 0,
    moveStreakStart : -1,
    lastMoveTurn : -1,
    oddStep : 0,

    // Debugging variables - should be removed before release
    debug : 1,
    logCommands : 0,
    excludeCommandsFromLogging : [
        "updateDebug",
        "startMovingChip",
        "stopMovingChip",
        "updateMap",
        "updateTime",
        "redrawAll"
    ],

    // Objects that need to be globally accessible
    // TODO: Surely there is a better way to structure this app than using assorted global objects...?
    loop : {},
    cam : {}, // Current Active Map
    cls : {}, // Current Level Set
    tiles : {},
    tLookup : {},
    rules : {},

    last : {
        levelset : "", // Updated in chips.data.loadLevelset()
        tileset : ""
    },

    // Refresh is run automatically when all assets are loaded
    refresh : function() {
        this.cls = chips.data.levels.loaded[this.last.levelset];
        this.tiles = new chips.obj.TileMap(chips.rules[chips.vars.defaultRuleset].data);
        this.tLookup = new chips.obj.ReverseTileMap(chips.rules[chips.vars.defaultRuleset].data);
        this.rules = chips.rules[chips.vars.defaultRuleset].data;

        if (chips.vars.pauseOnLoseFocus) {
            window.addEventListener("blur", function(e) {
                chips.g.cam.elapsedTime.forcePause();
            });
            window.addEventListener("focus", function(e) {
                chips.g.cam.elapsedTime.forceUnpause();
            });
        }
    }
};