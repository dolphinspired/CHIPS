/**
 * Created by Brogan on 12/9/2015.
 */
var numTestLevels = 6; // UPDATE THIS so the z-toggle thing works

var levelTest0 = [ // Map drawing test
    ['Test 00','AAAA','0','0','0','First functional level created. Tests drawing and simple collision.',''],
    [1,1,1,1,1,1,1,1,1],
    [1,tiles.ITEM_KEY_GREEN,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,tiles.CHIP_SOUTH,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,tiles.HINT,0,0,0,1],
    [1,0,0,0,0,0,0,tiles.EXIT,1],
    [1,1,1,1,1,1,1,1,1]
];

var levelTest1 = [ // Scrolling test
    ['Test 01','DBCA','1','120','12','This level tests lots of things, including level scrolling. Some things don\'t work yet...',''],
    [1,1,1,1,1,1,1,1,1,1,1,1],
    [1,tiles.CHIP_SOUTH,tiles.ITEM_KEY_GREEN,tiles.ITEM_KEY_GREEN,tiles.LOCK_GREEN,tiles.LOCK_GREEN,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,tiles.ITEM_BOOT,tiles.FIRE,1],
    [1,tiles.HINT,tiles.ITEM_KEY_BLUE,tiles.ITEM_KEY_BLUE,tiles.LOCK_BLUE,tiles.LOCK_BLUE,0,0,0,0,0,1],
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
    ['Test 02','ABCD','2','0','0','Thin wall collision test. Could you tell?',''],
    [1,1,1,1,1,1,1,1,1],
    [1,tiles.EXIT,0,0,0,0,0,tiles.HINT,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,tiles.THIN_WALL_NORTHWEST,tiles.THIN_WALL_NORTH,tiles.THIN_WALL_NORTHEAST,0,0,1],
    [1,0,0,tiles.THIN_WALL_WEST,tiles.CHIP_SOUTH,0,tiles.THIN_WALL_EAST,0,1],
    [1,0,0,tiles.THIN_WALL_SOUTHWEST,tiles.THIN_WALL_SOUTH,tiles.THIN_WALL_SOUTHEAST,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1]
];

var levelTest3 = [ // Actually the true Level 1
    ['LESSON 1','BDHP','3','100','11','Hint: Collect chips to get past the chip socket. Use keys to open doors.',''],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,1,0,tiles.ITEM_CHIP,0,1,tiles.EXIT,1,0,tiles.ITEM_CHIP,0,1,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,tiles.LOCK_GREEN,1,tiles.SOCKET,1,tiles.LOCK_GREEN,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,tiles.ITEM_KEY_YELLOW,0,tiles.LOCK_BLUE,0,0,0,0,0,tiles.LOCK_RED,0,tiles.ITEM_KEY_YELLOW,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,tiles.ITEM_CHIP,0,1,tiles.ITEM_KEY_BLUE,0,tiles.HINT,0,tiles.ITEM_KEY_RED,1,0,tiles.ITEM_CHIP,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,tiles.ITEM_CHIP,0,tiles.CHIP_SOUTH,0,tiles.ITEM_CHIP,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,tiles.ITEM_CHIP,0,1,tiles.ITEM_KEY_BLUE,0,0,0,tiles.ITEM_KEY_RED,1,0,tiles.ITEM_CHIP,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,0,0,0,tiles.LOCK_RED,0,0,tiles.ITEM_CHIP,0,0,tiles.LOCK_BLUE,0,0,0,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,1,1,1,1,1,1,tiles.LOCK_YELLOW,1,tiles.LOCK_YELLOW,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,tiles.ITEM_CHIP,1,tiles.ITEM_CHIP,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,tiles.ITEM_KEY_GREEN,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var levelTest4 = [ // Testing new features: fake walls, cellblocks, invis. walls
    ['Test 04','OKAY','4','999','0','2 invisible wall tiles: 1 and 3 spaces below this',''],
    [tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID],
    [tiles.INVISIBLE_WALL,tiles.CHIP_SOUTH,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,0,0,0,0,0,0,0,tiles.FAKE_WALL_SOLID,0,0,0,0,tiles.FAKE_WALL_HOLLOW,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,0,tiles.HINT,0,tiles.FAKE_WALL_SOLID,0,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,0,tiles.FAKE_WALL_HOLLOW,0,tiles.FAKE_WALL_HOLLOW,tiles.FAKE_WALL_HOLLOW,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,0,tiles.INVISIBLE_WALL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,0,0,0,tiles.FAKE_WALL_SOLID,0,tiles.FAKE_WALL_SOLID,tiles.FAKE_WALL_SOLID,0,tiles.FAKE_WALL_HOLLOW,0,tiles.FAKE_WALL_HOLLOW,tiles.FAKE_WALL_HOLLOW,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,tiles.RECESSED_WALL,0,tiles.INVISIBLE_WALL,0,tiles.FAKE_WALL_SOLID,0,0,0,0,tiles.FAKE_WALL_HOLLOW,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,tiles.EXIT,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [tiles.INVISIBLE_WALL,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

var levelTest5 = [ // Testing blocks with bombs and water
    ['Test 05','OYES','5','500','2','Push blocks into water and bombs to make your way across',''],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,tiles.ITEM_FLIPPER,0,0,tiles.WATER,tiles.WATER,tiles.WATER,0,0,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,tiles.SOCKET,tiles.EXIT,1],
    [1,0,0,0,tiles.WATER,tiles.WATER,tiles.WATER,0,0,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,0,tiles.SOCKET,1],
    [1,0,tiles.BLOCK,tiles.ITEM_BOOT,tiles.WATER,tiles.WATER,tiles.WATER,0,tiles.BLOCK,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,0,0,1],
    [1,tiles.CHIP_EAST,0,0,tiles.WATER,tiles.ITEM_CHIP,tiles.WATER,0,0,0,tiles.BOMB,tiles.ITEM_CHIP,tiles.BOMB,0,0,0,0,1],
    [1,tiles.HINT,tiles.BLOCK,tiles.ITEM_SKATE,tiles.WATER,tiles.WATER,tiles.WATER,0,tiles.BLOCK,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,0,0,1],
    [1,0,0,0,tiles.WATER,tiles.WATER,tiles.WATER,0,0,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,0,0,1],
    [1,0,0,0,tiles.WATER,tiles.WATER,tiles.WATER,0,0,0,tiles.BOMB,tiles.BOMB,tiles.BOMB,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]

];

var levelTest6 = [
    ['Toggle Boggle', 'TOGG', '6', '999', '4' , 'Let\'s get freaky with toggle walls',''],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,tiles.CHIP_NORTH,0,1,tiles.SWITCH_TOGGLE,tiles.ITEM_CHIP,1,0,tiles.ITEM_CHIP,1,0,tiles.ITEM_CHIP,1],
    [1,tiles.HINT,tiles.SWITCH_TOGGLE,tiles.TOGGLE_CLOSED,0,0,1,tiles.SWITCH_TOGGLE,0,tiles.TOGGLE_OPEN,0,0,1],
    [1,1,1,1,1,tiles.TOGGLE_OPEN,1,1,tiles.TOGGLE_CLOSED,1,1,1,1],
    [1,tiles.ITEM_CHIP,0,1,0,0,1,0,0,1,0,0,1],
    [1,tiles.SWITCH_TOGGLE,0,tiles.TOGGLE_CLOSED,tiles.SWITCH_TOGGLE,0,tiles.TOGGLE_OPEN,0,tiles.SWITCH_TOGGLE,1,0,0,1],
    [1,tiles.TOGGLE_CLOSED,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,tiles.SOCKET,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,tiles.EXIT,0,1,0,0,1,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,0,0,1,0,0,1,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1]
];