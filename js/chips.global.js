/**
 * Created by Brogan on 10/13/2015.
 */
var frame = 0; // what frame are we on?
var state = 0; // what state is the game in? 0 = first load
var keylock = 0; // how long has the current key been held down?
var requests = []; // operations that should not be performed every frame
var debug = true; // debug messages on? (where flagged)

var onceLogged = false; // for logOnce function

var canvi = {
    "gCanvas"  : null ,
    "gContext" : null ,
    "tCanvas"  : null ,
    "tContext" : null ,
    "wCanvas"  : null ,
    "wContext" : null ,
    "dCanvas"  : null ,
    "dContext" : null
};

var currentActiveMap; // The entire level that's loaded into memory
var currentVisibleMap; // X,Y bounds of the tiles currently visible to the player
var hintShown = false;

var drawVars = Object.freeze(new InitializeReferenceEnum());

function InitializeReferenceEnum() {
    this.TILE_SIZE = 32; // width/height of a single tile in px
    this.LAYER_SIZE_BITS = 10; // how many bits are currently storing tile values
    this.LAYER_SIZE_TILES = 8; // number of tiles across a single layer-group in the atlas (this is square)
    this.LAYER_SIZE_PX = this.TILE_SIZE * this.LAYER_SIZE_TILES; // number of px across a single layer-group
    this.NUM_LAYERS = 4;
    this.HALFBOARD_X = Math.floor(boardWidth_tiles / 2); // Half the visible board, rounded down
    this.HALFBOARD_Y = Math.floor(boardHeight_tiles / 2);
    this.LAYER_FLOOR = 0;
    this.LAYER_ITEM = 1;
    this.LAYER_ENEMY = 2;
    this.LAYER_CHIP = 3;
}

var layerOffsets = Object.freeze(new InitializeLayerOffsets());

function InitializeLayerOffsets() {
    this.x = [0,0,drawVars.LAYER_SIZE_PX,0,drawVars.LAYER_SIZE_PX]; // Offset on layers 2 and 4
    this.y = [0,0,0,drawVars.LAYER_SIZE_PX,drawVars.LAYER_SIZE_PX]; // Offset on layers 3 and 4
}

var tiles = Object.freeze(new InitializeTileset());

function InitializeTileset() {
    this.FLOOR = 0;
    this.WALL = 1;
    this.FAKE_WALL_HOLLOW = 2;
    this.FAKE_WALL_SOLID = 3;
    this.BLOCK = 4;
    this.MUD = 5;
    this.SOCKET = 6;
    this.EXIT = 7;
    this.THIN_WALL_NORTH = 10;
    this.THIN_WALL_WEST = 11;
    this.THIN_WALL_SOUTH = 12;
    this.THIN_WALL_EAST = 13;
    this.THIN_WALL_NORTHEAST = 14;
    this.THIN_WALL_NORTHWEST = 15;
    this.THIN_WALL_SOUTHWEST = 16;
    this.THIN_WALL_SOUTHEAST = 17;
    this.FORCE_FLOOR_NORTH = 20;
    this.FORCE_FLOOR_WEST = 21;
    this.FORCE_FLOOR_SOUTH = 22;
    this.FORCE_FLOOR_EAST = 23;
    this.ICE_WALL_NORTHEAST = 24;
    this.ICE_WALL_NORTHWEST = 25;
    this.ICE_WALL_SOUTHWEST = 26;
    this.ICE_WALL_SOUTHEAST = 27;
    this.WATER = 30;
    this.FIRE = 31;
    this.ICE = 32;
    this.FORCE_FLOOR_RANDOM = 33;
    this.ASPHALT = 34;
    this.THIEF = 35;
    this.BOMB = 36;
    this.SPAWNER = 37;
    this.HINT = 40;
    this.RECESSED_WALL = 41;
    this.TELEPORT = 42;
    this.BEARTRAP = 43;
    this.SWITCH_TOGGLE = 50;
    this.SWITCH_SPAWNER = 51;
    this.SWITCH_TANK = 52;
    this.SWITCH_BEARTRAP = 53;
    this.INVISIBLE_WALL = 54;
    this.LOCK_BLUE = 60;
    this.LOCK_RED = 61;
    this.LOCK_YELLOW = 62;
    this.LOCK_GREEN = 63;
    this.TOGGLE_CLOSED = 70;
    this.TOGGLE_OPEN = 71;
    this.EXIT_ANIMATION_2 = 76;
    this.EXIT_ANIMATION_3 = 77;

    this.ITEM_BASE = 100;
    this.ITEM_CHIP = 100;
    this.ITEM_FLIPPER = 1000;
    this.ITEM_BOOT = 1100;
    this.ITEM_SKATE = 1200;
    this.ITEM_SUCTIONSHOES = 1300;
    this.ITEM_KEY_BLUE = 6000;
    this.ITEM_KEY_RED = 6100;
    this.ITEM_KEY_YELLOW = 6200;
    this.ITEM_KEY_GREEN = 6300;

    this.ENEMY_BASE = 10000;
    this.ENEMY_TANK_NORTH = 40000;
    this.ENEMY_TANK_WEST = 50000;
    this.ENEMY_TANK_SOUTH = 60000;
    this.ENEMY_TANK_EAST = 70000;
    this.ENEMY_BUG_NORTH = 100000;
    this.ENEMY_BUG_WEST = 110000;
    this.ENEMY_BUG_SOUTH = 120000;
    this.ENEMY_BUG_EAST = 130000;
    this.ENEMY_PARAMECIUM_NORTH = 140000;
    this.ENEMY_PARAMECIUM_WEST = 150000;
    this.ENEMY_PARAMECIUM_SOUTH = 160000;
    this.ENEMY_PARAMECIUM_EAST = 170000;
    this.ENEMY_GLIDER_NORTH = 200000;
    this.ENEMY_GLIDER_WEST = 210000;
    this.ENEMY_GLIDER_SOUTH = 220000;
    this.ENEMY_GLIDER_EAST = 230000;
    this.ENEMY_FIREBALL_NORTH = 240000;
    this.ENEMY_FIREBALL_WEST = 250000;
    this.ENEMY_FIREBALL_SOUTH = 260000;
    this.ENEMY_FIREBALL_EAST = 270000;
    this.ENEMY_BALL_NORTH = 300000;
    this.ENEMY_BALL_WEST = 310000;
    this.ENEMY_BALL_SOUTH = 320000;
    this.ENEMY_BALL_EAST = 330000;
    this.ENEMY_SPINNER_NORTH = 340000;
    this.ENEMY_SPINNER_WEST = 350000;
    this.ENEMY_SPINNER_SOUTH = 360000;
    this.ENEMY_SPINNER_EAST = 370000;
    this.ENEMY_TEETH_NORTH = 400000;
    this.ENEMY_TEETH_WEST = 410000;
    this.ENEMY_TEETH_SOUTH = 420000;
    this.ENEMY_TEETH_EAST = 430000;
    this.ENEMY_BLOB_NORTH = 440000;
    this.ENEMY_BLOB_WEST = 450000;
    this.ENEMY_BLOB_SOUTH = 460000;
    this.ENEMY_BLOB_EAST = 470000;

    this.CHIP_BASE = 1000000;
    this.CHIP_NORTH = 10000000;
    this.CHIP_WEST = 11000000;
    this.CHIP_SOUTH = 12000000;
    this.CHIP_EAST = 13000000;
    this.CHIP_NORTH_NOSHADOW = 14000000;
    this.CHIP_WEST_NOSHADOW = 15000000;
    this.CHIP_SOUTH_NOSHADOW = 15000000;
    this.CHIP_EAST_NOSHADOW = 16000000;
    this.CHIP_NORTH_SWIM = 20000000;
    this.CHIP_WEST_SWIM = 21000000;
    this.CHIP_SOUTH_SWIM = 22000000;
    this.CHIP_EAST_SWIM = 23000000;
    this.CHIP_STAND = 30000000;
    this.CHIP_SPLASH = 31000000;
    this.CHIP_BURNT = 32000000;
    this.CHIP_WIN = 70000000;
    this.SWIM_DIFF = 10000000;
}

var dir = Object.freeze(new InitializeDirections());

function InitializeDirections() {
    this.NORTH = 0;
    this.WEST = 1;
    this.SOUTH = 2;
    this.EAST = 3;
}

var keys = Object.freeze(new InitializeKeycodes());

function InitializeKeycodes() {
    this.UP = 38;
    this.DOWN = 40;
    this.LEFT = 37;
    this.RIGHT = 39;
}

var states = Object.freeze(new InitializeGameStates());

function InitializeGameStates() {
    this.FIRSTLOAD = 0;

    this.TITLE = 100;

    this.LEVEL_LOAD = 200;
    this.LEVEL_ACTIVE = 210;
    this.LEVEL_PAUSED = 211;
    this.LEVEL_FAIL = 212;
    this.LEVEL_SUCCESS = 220;

    this.GAME_SUCCESS = 900;
}

// Stores the order of how items should appear in the inventory frame
var inventoryMap = Object.freeze([
    tiles.ITEM_KEY_BLUE,
    tiles.ITEM_KEY_RED,
    tiles.ITEM_KEY_YELLOW,
    tiles.ITEM_KEY_GREEN,
    tiles.ITEM_FLIPPER,
    tiles.ITEM_SKATE,
    tiles.ITEM_BOOT,
    tiles.ITEM_SUCTIONSHOES
]);

function InitializeLevelTimer() {
    this.start = Date.now();
    this.elapsed_ms = 0;

    this.tick = function() {
        this.elapsed_ms = Date.now() - this.start;
    };
}