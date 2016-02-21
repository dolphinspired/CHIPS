/**
 * Created by Brogan on 10/13/2015.
 */

chips.g = {
    frame : 0,
    state : 0,
    turnTime : 100, // in ms

    keylock : 0,
    moveStreakStart : -1,
    lastMoveTurn : -1,
    oddStep : 0,

    debug : 1,
    logRequests : 1,
    excludeRequestsFromLogging : ["updateDebug", "updateTime", "drawPauseScreen"],

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
            $(window).on("blur", function(e) {
                chips.g.cam.elapsedTime.forcePause();
            }).on("focus", function(e) {
                chips.g.cam.elapsedTime.forceUnpause();
            });
        }
    },

    test : {
        init : function() {

        }
    }
};