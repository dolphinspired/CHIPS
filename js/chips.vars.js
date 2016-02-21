/**
 * Created by Brogan on 1/25/2016.
 */

chips.vars = {
    gameWindowHeight : 352,
    gameWindowWidth : 512,

    fps : 60,

    pauseOnLoseFocus : true,

    defaultGameMessage : "Welcome to Chip's Tribute!",
    defaultRuleset : "MS_1_0_0",

    gameWindowURL : "img/window.png",
    atlasURL : "img/default_tileset.png",
    hudsetURL : "img/default_hudset.png",
    levelsetURL : "levels/",
    rulesetURL : "rulesets/",

    turnTime_ms : 100,
    chipsFacingResetDelay : 3, // # of turns before Chip faces south again

    boardOffsetX_px : 32,
    boardOffsetY_px : 32,
    boardWidth_tiles : 9,
    boardHeight_tiles : 9,

    inventoryOffsetX_px : 352,
    inventoryOffsetY_px : 247,
    inventoryWidth_tiles : 4,
    inventoryHeight_tiles : 2,

    hudDigitWidth_px : 13,
    hudDigitHeight_px : 21,
    hudDigitSpacingX_px : 4,
    hudDigitSpacingY_px : 1,
    hudLevelNumOffsetX_px : 388,
    hudLevelNumOffsetY_px : 64,
    hudLevelNumWarningThreshold : -1,
    hudTimeOffsetX_px : 388,
    hudTimeOffsetY_px : 126,
    hudTimeWarningThreshold : 20,
    hudChipsLeftOffsetX_px : 388,
    hudChipsLeftOffsetY_px : 216,
    hudChipsLeftWarningThreshold : 0,
    hudHintOffsetX_px : 352,
    hudHintOffsetY_px : 170,
    hudHintWidth_px : 128,
    hudHintHeight_px : 140,
    hudHintPadding_px : 5,
    hudHintColor : "cyan",
    hudHintFont : "italic bold 11pt Arial",
    hudColorNormal : "green",
    hudColorWarning : "yellow",


    keys : {
        A: 65,
        B: 66,
        C: 67,
        D: 68,
        E: 69,
        F: 70,
        G: 71,
        H: 72,
        I: 73,
        J: 74,
        K: 75,
        L: 76,
        M: 77,
        N: 78,
        O: 79,
        P: 80,
        Q: 81,
        R: 82,
        S: 83,
        T: 84,
        U: 85,
        V: 86,
        W: 87,
        X: 88,
        Y: 89,
        Z: 90,
        ENTER: 13,
        SHIFT: 16,
        ESC: 27,
        SPACE: 32,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        BACKSPACE: 8,
        DELETE: 46
    },

    gameState : {
        FIRSTLOAD : 0,

        TITLE : 100,

        LEVEL_LOAD : 200,
        LEVEL_ACTIVE : 210,
        LEVEL_PAUSED : 211,
        LEVEL_FAIL : 212,
        LEVEL_SUCCESS : 220,

        GAME_SUCCESS : 900
    },

    entityState : {
        FREE : 0,
        SLIDING : 1,        // Movement is forced forward
        MOVELOCKED : 2      // Player movement input is ignored
    },

    requests : {

    }
};