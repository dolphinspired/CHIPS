/**
 * Created by Brogan on 12/9/2015.
 */
var numTestLevels = 7; // UPDATE THIS so the z-toggle thing works

chips.testLevels;

function getTestLevels() {

    this.levelTest0 = [ // Map drawing test
        ['Test 00', 'AAAA', '0', '0', '0', 'First functional level created. Tests drawing and simple collision. The teleports came MUCH later...', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.KEY_GREEN, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, chips.g.tiles.TELEPORT, 0, 0, 0, chips.g.tiles.TELEPORT, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, chips.g.tiles.CHIP_SOUTH, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, chips.g.tiles.TELEPORT, 0, chips.g.tiles.HINT, 0, chips.g.tiles.TELEPORT, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, chips.g.tiles.EXIT, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

        this.levelTest1 = [ // Scrolling test
        ['Test 01', 'DBCA', '1', '120', '12', 'This level tests lots of things, including level scrolling. Some things don\'t work yet...', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.CHIP_SOUTH, chips.g.tiles.KEY_GREEN, chips.g.tiles.KEY_GREEN, chips.g.tiles.LOCK_GREEN, chips.g.tiles.LOCK_GREEN, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, chips.g.tiles.BOOT, chips.g.tiles.FIRE, 1],
        [1, chips.g.tiles.HINT, chips.g.tiles.KEY_BLUE, chips.g.tiles.KEY_BLUE, chips.g.tiles.LOCK_BLUE, chips.g.tiles.LOCK_BLUE, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, chips.g.tiles.THIEF, 0, 0, 0, chips.g.tiles.FLIPPER, chips.g.tiles.WATER, 1],
        [1, 0, chips.g.tiles.KEY_RED, chips.g.tiles.KEY_RED, chips.g.tiles.LOCK_RED, chips.g.tiles.LOCK_RED, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, chips.g.tiles.SUCTIONSHOES, chips.g.tiles.FORCE_FLOOR_NORTH, 1],
        [1, 0, chips.g.tiles.KEY_YELLOW, chips.g.tiles.KEY_YELLOW, chips.g.tiles.LOCK_YELLOW, chips.g.tiles.LOCK_YELLOW, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, chips.g.tiles.SKATE, chips.g.tiles.ICE, 1],
        [1, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.SOCKET, 1],
        [1, chips.g.tiles.TEETH_SOUTH, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.ITEM_CHIP, chips.g.tiles.SOCKET, chips.g.tiles.EXIT, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

        this.levelTest2 = [ // Thin wall collision test
        ['Test 02', 'ABCD', '2', '0', '0', 'Thin wall collision test. Could you tell?', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.EXIT, 0, 0, 0, 0, 0, chips.g.tiles.HINT, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, chips.g.tiles.THIN_WALL_NORTHWEST, chips.g.tiles.THIN_WALL_NORTH, chips.g.tiles.THIN_WALL_NORTHEAST, 0, 0, 1],
        [1, 0, 0, chips.g.tiles.THIN_WALL_WEST, chips.g.tiles.CHIP_SOUTH, 0, chips.g.tiles.THIN_WALL_EAST, 0, 1],
        [1, 0, 0, chips.g.tiles.THIN_WALL_SOUTHWEST, chips.g.tiles.THIN_WALL_SOUTH, chips.g.tiles.THIN_WALL_SOUTHEAST, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

        this.levelTest3 = [ // Actually the true Level 1
        ['LESSON 1', 'BDHP', '3', '100', '11', 'Hint: Collect chips to get past the chip socket. Use keys to open doors.', ''],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, chips.g.tiles.EXIT, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, chips.g.tiles.LOCK_GREEN, 1, chips.g.tiles.SOCKET, 1, chips.g.tiles.LOCK_GREEN, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, chips.g.tiles.KEY_YELLOW, 0, chips.g.tiles.LOCK_BLUE, 0, 0, 0, 0, 0, chips.g.tiles.LOCK_RED, 0, chips.g.tiles.KEY_YELLOW, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, chips.g.tiles.KEY_BLUE, 0, chips.g.tiles.HINT, 0, chips.g.tiles.KEY_RED, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, chips.g.tiles.ITEM_CHIP, 0, chips.g.tiles.CHIP_SOUTH, 0, chips.g.tiles.ITEM_CHIP, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, chips.g.tiles.KEY_BLUE, 0, 0, 0, chips.g.tiles.KEY_RED, 1, 0, chips.g.tiles.ITEM_CHIP, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, chips.g.tiles.LOCK_RED, 0, 0, chips.g.tiles.ITEM_CHIP, 0, 0, chips.g.tiles.LOCK_BLUE, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, chips.g.tiles.LOCK_YELLOW, 1, chips.g.tiles.LOCK_YELLOW, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, chips.g.tiles.ITEM_CHIP, 1, chips.g.tiles.ITEM_CHIP, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, chips.g.tiles.KEY_GREEN, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],

        this.levelTest4 = [ // Testing new features: fake walls, cellblocks, invis. walls
        ['Test 04', 'OKAY', '4', '999', '0', '2 invisible wall tiles: 1 and 3 spaces below this', ''],
        [chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.CHIP_SOUTH, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, 0, 0, 0, 0, 0, 0, 0, chips.g.tiles.FAKE_WALL_SOLID, 0, 0, 0, 0, chips.g.tiles.FAKE_WALL_HOLLOW, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, 0, chips.g.tiles.HINT, 0, chips.g.tiles.FAKE_WALL_SOLID, 0, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, 0, chips.g.tiles.FAKE_WALL_HOLLOW, 0, chips.g.tiles.FAKE_WALL_HOLLOW, chips.g.tiles.FAKE_WALL_HOLLOW, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, 0, chips.g.tiles.INVISIBLE_WALL, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, 0, 0, 0, chips.g.tiles.FAKE_WALL_SOLID, 0, chips.g.tiles.FAKE_WALL_SOLID, chips.g.tiles.FAKE_WALL_SOLID, 0, chips.g.tiles.FAKE_WALL_HOLLOW, 0, chips.g.tiles.FAKE_WALL_HOLLOW, chips.g.tiles.FAKE_WALL_HOLLOW, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, chips.g.tiles.RECESSED_WALL, 0, chips.g.tiles.INVISIBLE_WALL, 0, chips.g.tiles.FAKE_WALL_SOLID, 0, 0, 0, 0, chips.g.tiles.FAKE_WALL_HOLLOW, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.EXIT, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [chips.g.tiles.INVISIBLE_WALL, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW, chips.g.tiles.INVISIBLE_WALL_SHOW]
    ],

        this.levelTest5 = [ // Testing blocks with bombs and water
        ['Test 05', 'OYES', '5', '500', '2', 'Push blocks into water and bombs to make your way across', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.FLIPPER, 0, 0, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, 0, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, chips.g.tiles.SOCKET, chips.g.tiles.EXIT, 1],
        [1, 0, 0, 0, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, 0, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, 0, chips.g.tiles.SOCKET, 1],
        [1, 0, chips.g.tiles.BLOCK_BASE, chips.g.tiles.BOOT, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, chips.g.tiles.BLOCK_BASE, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, 0, 0, 1],
        [1, chips.g.tiles.CHIP_EAST, 0, 0, chips.g.tiles.WATER, chips.g.tiles.ITEM_CHIP, chips.g.tiles.WATER, 0, 0, 0, chips.g.tiles.BOMB, chips.g.tiles.ITEM_CHIP, chips.g.tiles.BOMB, 0, 0, 0, 0, 1],
        [1, chips.g.tiles.HINT, chips.g.tiles.BLOCK_BASE, chips.g.tiles.SKATE, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, chips.g.tiles.BLOCK_BASE, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, 0, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, chips.g.tiles.WATER, chips.g.tiles.WATER, chips.g.tiles.WATER, 0, 0, 0, chips.g.tiles.BOMB, chips.g.tiles.BOMB, chips.g.tiles.BOMB, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]

    ],

        this.levelTest6 = [
        ['Toggle Boggle', 'TOGG', '6', '999', '4', 'Let\'s get freaky with toggle walls', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.CHIP_NORTH, 0, 1, chips.g.tiles.SWITCH_TOGGLE, chips.g.tiles.ITEM_CHIP, 1, 0, chips.g.tiles.ITEM_CHIP, 1, 0, chips.g.tiles.ITEM_CHIP, 1],
        [1, chips.g.tiles.HINT, chips.g.tiles.SWITCH_TOGGLE, chips.g.tiles.TOGGLE_CLOSED, 0, 0, 1, chips.g.tiles.SWITCH_TOGGLE, 0, chips.g.tiles.TOGGLE_OPEN, 0, 0, 1],
        [1, 1, 1, 1, 1, chips.g.tiles.TOGGLE_OPEN, 1, 1, chips.g.tiles.TOGGLE_CLOSED, 1, 1, 1, 1],
        [1, chips.g.tiles.ITEM_CHIP, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, chips.g.tiles.SWITCH_TOGGLE, 0, chips.g.tiles.TOGGLE_CLOSED, chips.g.tiles.SWITCH_TOGGLE, 0, chips.g.tiles.TOGGLE_OPEN, 0, chips.g.tiles.SWITCH_TOGGLE, 1, 0, 0, 1],
        [1, chips.g.tiles.TOGGLE_CLOSED, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, chips.g.tiles.SOCKET, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, chips.g.tiles.EXIT, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],

        this.levelTest7 = [ // Map drawing test
        ['Slide Reel', 'SLID', '7', '250', '1', 'Ice to meet you :O', ''],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, chips.g.tiles.ICE_WALL_NORTHWEST, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.GRAVEL, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.ICE_WALL_NORTHEAST, 1],
        [1, chips.g.tiles.ICE, chips.g.tiles.SKATE, 0, 0, 0, 0, chips.g.tiles.ICE, 1],
        [1, chips.g.tiles.ICE, 0, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.ICE, 0, chips.g.tiles.ICE, 1],
        [chips.g.tiles.EXIT, chips.g.tiles.GRAVEL, 0, chips.g.tiles.ICE, chips.g.tiles.CHIP_SOUTH, chips.g.tiles.ICE, 0, chips.g.tiles.GRAVEL, 1],
        [1, chips.g.tiles.ICE, 0, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.ICE, 0, chips.g.tiles.ICE, 1],
        [1, chips.g.tiles.ICE, 0, 0, chips.g.tiles.HINT, 0, 0, chips.g.tiles.ICE, 1],
        [1, chips.g.tiles.ICE_WALL_SOUTHWEST, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.GRAVEL, chips.g.tiles.ICE, chips.g.tiles.ICE, chips.g.tiles.ICE_WALL_SOUTHEAST, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
}