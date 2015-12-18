/**
 * Created by Brogan on 12/9/2015.
 */
var levelTest0 = [ // Map drawing test
    [1,1,1,1,1,1,1,1,1],
    [1,tiles.ITEM_KEY_GREEN,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,tiles.CHIP_SOUTH,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1]
];

var levelTest1 = [ // Scrolling test
    ["789","120","12","This is a helpful hint so you can survive the level.",""],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,tiles.CHIP_SOUTH,tiles.ITEM_KEY_GREEN,tiles.ITEM_KEY_GREEN,tiles.LOCK_GREEN,tiles.LOCK_GREEN,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,tiles.ITEM_BOOT,tiles.FIRE,1],
    [1,0,tiles.ITEM_KEY_BLUE,tiles.ITEM_KEY_BLUE,tiles.LOCK_BLUE,tiles.LOCK_BLUE,0,0,0,0,0,1],
    [1,0,0,0,0,tiles.THIEF,0,0,0,tiles.ITEM_FLIPPER,tiles.WATER,1],
    [1,0,tiles.ITEM_KEY_RED,tiles.ITEM_KEY_RED,tiles.LOCK_RED,tiles.LOCK_RED,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,tiles.ITEM_SUCTIONSHOES,tiles.FORCE_FLOOR_NORTH,1],
    [1,0,tiles.ITEM_KEY_YELLOW,tiles.ITEM_KEY_YELLOW,tiles.LOCK_YELLOW,tiles.LOCK_YELLOW,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,tiles.ITEM_SKATE,tiles.ICE,1],
    [1,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.SOCKET,1],
    [1,tiles.ENEMY_TEETH_SOUTH,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.ITEM_CHIP,tiles.SOCKET,tiles.EXIT,1],
    [1,1,1,1,1,1,1,1,1,1,1,1]
];

var levelTest2 = [ // Thin wall collision test
    [1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,tiles.THIN_WALL_NORTHWEST,tiles.THIN_WALL_NORTH,tiles.THIN_WALL_NORTHEAST,0,0,1],
    [1,0,0,tiles.THIN_WALL_WEST,tiles.CHIP_SOUTH,0,tiles.THIN_WALL_EAST,0,1],
    [1,0,0,tiles.THIN_WALL_SOUTHWEST,tiles.THIN_WALL_SOUTH,tiles.THIN_WALL_SOUTHEAST,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1]
];