/* The following variables MUST be included with any application. */

var gameWindowHeight = 352;
var gameWindowWidth = 512;

var fps = 30;

/* Debug vars (remove eventually) */

var defaultGameMessage = "Use your keyboard's arrow keys or the buttons above to move. " +
    "<br/> Press Z to cycle through available test levels." +
    "<br/> Click \"Redraw Screen\" below if the game image doesn't load immediately.";

/* Game-specific settings. */

var gameWindowURL = "img/window.png";
var atlasURL = "img/default_tileset.png";
var hudsetURL = "img/default_hudset.png";

var boardOffsetX_px = 32;
var boardOffsetY_px = 32;
var boardWidth_tiles = 9;
var boardHeight_tiles = 9;

var inventoryOffsetX_px = 352;
var inventoryOffsetY_px = 247;
var inventoryWidth_tiles = 4;
var inventoryHeight_tiles = 2;

var hudDigitWidth_px = 13;
var hudDigitHeight_px = 21;
var hudDigitSpacingX_px = 4;
var hudDigitSpacingY_px = 1;
var hudLevelNumOffsetX_px = 388;
var hudLevelNumOffsetY_px = 64;
var hudLevelNumWarningThreshold = -1;
var hudTimeOffsetX_px = 388;
var hudTimeOffsetY_px = 126;
var hudTimeWarningThreshold = 20;
var hudChipsLeftOffsetX_px = 388;
var hudChipsLeftOffsetY_px = 216;
var hudChipsLeftWarningThreshold = 0;
var hudHintOffsetX_px = 352;
var hudHintOffsetY_px = 170;
var hudHintWidth_px = 128;
var hudHintHeight_px = 140;
var hudHintPadding_px = 5;
var hudHintColor = "cyan";
var hudHintFont = "italic bold 11pt Arial";
var hudColorNormal = "green";
var hudColorWarning = "yellow";