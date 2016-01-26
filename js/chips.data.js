/**
 * Created by Brogan on 1/24/2016.
 */

chips.data = {
    tiles : {
        FLOOR : {
            "type" : "floor",
            "value" : 0
        },
        WALL : {
            "type" : "floor",
            "value" : 1,
            "collision" : {
                "all" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        FAKE_WALL_HOLLOW : {
            "type" : "floor",
            "value" : 2,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        chips.g.cam.setChipsNextTile(d, chips.g.tiles.FLOOR);
                        return detectCollision("player", "barrier", x, y, d);
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        FAKE_WALL_SOLID : {
            "type" : "floor",
            "value" : 3,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        chips.g.cam.setChipsNextTile(d, chips.g.tiles.WALL);
                        return detectCollision("player", "barrier", x, y, d);
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        MUD : {
            "type" : "floor",
            "value" : 5,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }

        },
        SOCKET : {
            "type" : "floor",
            "value" : 6,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        return chips.g.cam.chipsLeft > 0;
                    },
                    "interactive" : function(x, y, d) {
                        // If you're standing on this tile, you already had enough chips (same concept as locks)
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        EXIT : {
            "type" : "floor",
            "value" : 7,
            "collision" : {
                "player" : {
                    "state" : function() {
                        winChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            }
        },
        THIN_WALL_NORTH : {
            "type" : "floor",
            "value" : 10,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.NORTH;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH;
                    }
                }
            }
        },
        THIN_WALL_WEST : {
            "type" : "floor",
            "value" : 11,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.WEST;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTH : {
            "type" : "floor",
            "value" : 12,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.NORTH;
                    }
                }
            }
        },
        THIN_WALL_EAST : {
            "type" : "floor",
            "value" : 13,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.EAST;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.WEST;
                    }
                }
            }
        },
        THIN_WALL_NORTHEAST : {
            "type" : "floor",
            "value" : 14,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.NORTH || d === chips.util.dir.EAST
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.WEST
                    }
                }
            }
        },
        THIN_WALL_NORTHWEST : {
            "type" : "floor",
            "value" : 15,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.NORTH || d === chips.util.dir.WEST;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTHWEST : {
            "type" : "floor",
            "value" : 16,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.WEST;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.NORTH || d === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTHEAST : {
            "type" : "floor",
            "value" : 17,
            "collision" : {
                "all" : {
                    "locking" : function(x, y, d) {
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.EAST;
                    },
                    "barrier" : function(x, y, d) {
                        return d === chips.util.dir.NORTH || d === chips.util.dir.WEST;
                    }
                }
            }
        },
        FORCE_FLOOR_NORTH : {
            "type" : "floor",
            "value" : 20
        },
        FORCE_FLOOR_WEST : {
            "type" : "floor",
            "value" : 21
        },
        FORCE_FLOOR_SOUTH : {
            "type" : "floor",
            "value" : 22
        },
        FORCE_FLOOR_EAST : {
            "type" : "floor",
            "value" : 23
        },
        ICE_WALL_NORTHEAST : {
            "type" : "floor",
            "value" : 24
        },
        ICE_WALL_NORTHWEST : {
            "type" : "floor",
            "value" : 25
        },
        ICE_WALL_SOUTHWEST : {
            "type" : "floor",
            "value" : 26
        },
        ICE_WALL_SOUTHEAST : {
            "type" : "floor",
            "value" : 27
        },
        WATER : {
            "type" : "floor",
            "value" : 30,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        var l = chips.draw.LAYER.CHIP;

                        if (chips.g.cam.inventory["FLIPPER"].quantity > 0) {
                            // TODO: Store the "SWIM_DIFF" in a variable somewhere
                            chips.g.cam.setChipsTileLayer(l, (chips.g.cam.getChipsTileLayer(l) + 10000000));
                            return true;
                        } else {
                            chips.g.cam.setChipsTileLayer(l, chips.g.tiles.CHIP_SPLASH);
                            return true;
                        }
                    },
                    "state" : function() {
                        if (chips.g.cam.inventory["FLIPPER"].quantity === 0) {
                            killChip("Chip can't swim without flippers!");
                            return true;
                        }
                        return false;
                    }
                },
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        var thisEnemy = chips.g.tLookup[chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.ENEMY)];
                        var submerges, resists;

                        try {
                            submerges = chips.data.tiles[thisEnemy].properties["submerges"];
                        } catch(e) {
                            submerges = false;
                        }

                        if (submerges) {
                            chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                            chips.g.cam.setTileLayer(x, y, chips.draw.LAYER.FLOOR, chips.g.tiles.MUD);
                            return true;
                        }

                        try {
                            resists = chips.data.tiles[thisEnemy].resists["water"];
                        } catch(e) {
                            resists = false;
                        }

                        if (!resists) {
                            chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                            return true;
                        }

                        return false;
                    }
                }
            }
        },
        FIRE : {
            "type" : "floor",
            "value" : 31,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        if (chips.g.cam.inventory["BOOT"].quantity === 0) {
                            chips.g.cam.setChipsTileLayer(chips.draw.LAYER.CHIP, chips.g.tiles.CHIP_BURNT);
                            return true;
                        } else {
                            return false;
                        }
                    },
                    "state" : function() {
                        if (chips.g.cam.inventory["BOOT"].quantity === 0) {
                            killChip("Chip can't walk on fire without boots!");
                            return true;
                        }
                        return false;
                    }
                },
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        var thisEnemy = chips.g.cam.getTileLayer(x, y, chips.draw.LAYER.ENEMY);
                        // TODO: Make a function for detecting enemy type, or modularize "tile resistance"
                        if (!(thisEnemy >= chips.g.tiles.ENEMY_FIREBALL_NORTH && thisEnemy <= chips.g.tiles.ENEMY_FIREBALL_EAST)) {
                            chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                            return true;
                        }
                        else return false;
                    }
                }
            }
        },
        ICE : {
            "type" : "floor",
            "value" : 32
        },
        FORCE_FLOOR_RANDOM : {
            "type" : "floor",
            "value" : 33
        },
        GRAVEL : {
            "type" : "floor",
            "value" : 34,
            "collision" : {
                "enemy" : true
            }
        },
        THIEF : {
            "type" : "floor",
            "value" : 35,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.removeItem("FLIPPER", true);
                        chips.g.cam.removeItem("SUCTIONSHOES", true);
                        chips.g.cam.removeItem("BOOT", true);
                        chips.g.cam.removeItem("SKATE", true);
                        return true;
                    }
                }
            }
        },
        BOMB : {
            "type" : "floor",
            "value" : 36,
            "collision" : {
                "player" : {
                    "state" : function() {
                        killChip("Oh dear, you are dead!");
                    }
                },
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                        chips.g.cam.setTileLayer(x, y, chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                }
            }
        },
        CLONER : {
            "type" : "floor",
            "value" : 37
        },
        HINT : {
            "type" : "floor",
            "value" : 40,
            "collision" : {
                "player" : {
                    "unload" : function(x, y, d) {
                        addRequest("toggleHint", [0]);
                        addRequest("redrawAll"); // Not sure why, but this is necessary
                        return true;
                    },
                    "interactive" : function(x, y, d) {
                        addRequest("toggleHint", [1]);
                        return true;
                    }
                }
            }
        },
        RECESSED_WALL : {
            "type" : "floor",
            "value" : 41,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.WALL);
                        return true;
                    }
                }
            }
        },
        TELEPORT : {
            "type" : "floor",
            "value" : 42,
            "collision" : {
                // The teleport's destination is always the next teleport in reverse reading order
                // (bottom-right to top-left). Chip exits the teleport one space ahead in the
                // direction he was moving. If this move is not valid, the next teleport in sequence
                // is checked. If no teleports are valid, the teleport acts as a non-directional ice tile.
                // (without the effect of the ice skate, of course)
                "player" : {
                    "interactive": function (x, y, d) {
                        var destX, destY;
                        var teleports = chips.g.cam.findTilesByLayer(chips.g.tiles.TELEPORT, chips.draw.LAYER.FLOOR);

                        for (var i = 0; i < teleports.length; i++) {
                            // If this teleport is the tile that Chip is currently on
                            if (teleports[i][0] === chips.g.cam.chip_x && teleports[i][1] === chips.g.cam.chip_y) {
                                if (!destX || !destY) continue; // Destination not yet set (first iteration), keep trying
                                else break;
                            } else {
                                if (!detectCollision("player", "barrier", teleports[i][0], teleports[i][1], d)) {
                                    destX = teleports[i][0];
                                    destY = teleports[i][1];
                                }
                            }
                        }
                        // TODO: this needs to be treated like a slide
                        if (destX && destY) {
                            chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.CHIP);
                            chips.g.cam.chip_x = destX;
                            chips.g.cam.chip_y = destY;
                            moveChip(d);
                        }
                        return true;
                    }
                },
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        var destX, destY;
                        var teleports = chips.g.cam.findTilesByLayer(chips.g.tiles.TELEPORT, chips.draw.LAYER.FLOOR);

                        for (var i = 0; i < teleports.length; i++) {
                            // If this teleport is the tile that Chip is currently on
                            if (teleports[i][0] === chips.g.cam.chip_x && teleports[i][1] === chips.g.cam.chip_y) {
                                if (!destX || !destY) continue; // Destination not yet set (first iteration), keep trying
                                else break;
                            } else {
                                if (!detectCollision("player", "barrier", teleports[i][0], teleports[i][1], d)) {
                                    destX = teleports[i][0];
                                    destY = teleports[i][1];
                                }
                            }
                        }
                        // TODO: this needs to be treated like a slide
                        if (destX && destY) {
                            var thisEnemy = chips.g.cam.getTileLayer(chips.draw.LAYER.ENEMY);
                            chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                            chips.g.cam.setTileLayer(destX, destY, chips.draw.LAYER.ENEMY, thisEnemy);
                        }
                        return true;
                    }
                }
            }
        },
        BEARTRAP : {
            "type" : "floor",
            "value" : 43
        },
        SWITCH_TOGGLE : {
            "type" : "floor",
            "value" : 50,
            "collision" : {
                "all" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.toggleFloors();
                        return true;
                    }
                }
            }

        },
        SWITCH_SPAWNER : {
            "type" : "floor",
            "value" : 51
        },
        SWITCH_TANK : {
            "type" : "floor",
            "value" : 52
        },
        SWITCH_BEARTRAP : {
            "type" : "floor",
            "value" : 53
        },
        INVISIBLE_WALL : {
            "type" : "floor",
            "value" : 54,
            "collision" : {
                "all" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        INVISIBLE_WALL_SHOW : {
            "type" : "floor",
            "value" : 55,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        chips.g.cam.setNextTileLayer(x, y, d, chips.draw.LAYER.FLOOR, chips.g.tiles.WALL);
                        return detectCollision("player", "barrier", x, y, d);
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        LOCK_BLUE : {
            "type" : "floor",
            "value" : 60,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        return !chips.g.cam.inventory["KEY_BLUE"].quantity;
                    },
                    "interactive" : function(x, y, d) {
                        chips.g.cam.removeItem("KEY_BLUE");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        LOCK_RED : {
            "type" : "floor",
            "value" : 61,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        return !chips.g.cam.inventory["KEY_RED"].quantity;
                    },
                    "interactive" : function(x, y, d) {
                        chips.g.cam.removeItem("KEY_RED");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        LOCK_YELLOW : {
            "type" : "floor",
            "value" : 62,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        return !chips.g.cam.inventory["KEY_YELLOW"].quantity;
                    },
                    "interactive" : function(x, y, d) {
                        chips.g.cam.removeItem("KEY_YELLOW");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        LOCK_GREEN : {
            "type" : "floor",
            "value" : 63,
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        return !chips.g.cam.inventory["KEY_GREEN"].quantity;
                    },
                    "interactive" : function(x, y, d) {
                        // Green keys are not consumed on unlock - no item to remove
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        TOGGLE_CLOSED : {
            "type" : "floor",
            "value" : 70,
            "collision" : {
                "all" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        TOGGLE_OPEN : {
            "type" : "floor",
            "value" : 71
        },
        EXIT_ANIMATION_2 : {
            "type" : "floor",
            "value" : 76
        },
        EXIT_ANIMATION_3 : {
            "type" : "floor",
            "value" : 77
        },

        ITEM_CHIP : {
            "type" : "item",
            "value" : 100,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.decrementChipsLeft();
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) { return true; }
                }
            }
        },
        FLIPPER : {
            "type" : "item",
            "value" : 1000,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("FLIPPER");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 7
            }
        },
        BOOT : {
            "type" : "item",
            "value" : 1100,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("BOOT");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 6
            }
        },
        SKATE : {
            "type" : "item",
            "value" : 1200,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("SKATE");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 4
            }
        },
        SUCTIONSHOES : {
            "type" : "item",
            "value" : 1300,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("SUCTIONSHOES");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 5
            }
        },
        KEY_BLUE : {
            "type" : "item",
            "value" : 6000,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("KEY_BLUE");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 1
            }
        },
        KEY_RED : {
            "type" : "item",
            "value" : 6100,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("KEY_RED");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 0
            }
        },
        KEY_YELLOW : {
            "type" : "item",
            "value" : 6200,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("KEY_YELLOW");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 2
            }
        },
        KEY_GREEN : {
            "type" : "item",
            "value" : 6300,
            "collision" : {
                "player" : {
                    "interactive" : function(x, y, d) {
                        chips.g.cam.addItem("KEY_GREEN");
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                }
            },
            "inventory" : {
                "slot" : 3
            }
        },

        TANK : {
            "type" : "enemy",
            "value" : {
                "north" : 40000,
                "west" : 50000,
                "south" : 60000,
                "east" : 70000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: move forward until a barrier collision, then stop
            }
        },
        BUG : {
            "type" : "enemy",
            "value" : {
                "north" : 100000,
                "west" : 110000,
                "south" : 120000,
                "east" : 130000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: follow the barrier to its left, else circle counter-clockwise
            }
        },
        PARAMECIUM : {
            "type" : "enemy",
            "value" : {
                "base" : 140000,
                "north" : 140000,
                "west" : 150000,
                "south" : 160000,
                "east" : 170000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: follow the barrier to its right, else circle clockwise
            }
        },
        GLIDER : {
            "type" : "enemy",
            "value" : {
                "base" : 200000,
                "north" : 200000,
                "west" : 210000,
                "south" : 220000,
                "east" : 230000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "resists" : {
                "water" : true
            },
            "behavior" : function() {
                // TODO: turn left on a barrier collision, else right, else reverse
            }
        },
        FIREBALL : {
            "type" : "enemy",
            "value" : {
                "base" : 240000,
                "north" : 240000,
                "west" : 250000,
                "south" : 260000,
                "east" : 270000
            },
            "resists" : {
                "fire" : true
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: turn right on a barrier collision, else left, else reverse
            }
        },
        BALL : {
            "type" : "enemy",
            "value" : {
                "base" : 300000,
                "north" : 300000,
                "west" : 310000,
                "south" : 320000,
                "east" : 330000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: reverse direction on a barrier collision
            }
        },
        WALKER : {
            "type" : "enemy",
            "value" : {
                "base" : 340000,
                "north" : 340000,
                "west" : 350000,
                "south" : 360000,
                "east" : 370000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: random direction on a barrier collision
            }
        },
        TEETH : {
            "type" : "enemy",
            "value" : {
                "base" : 400000,
                "north" : 400000,
                "west" : 410000,
                "south" : 420000,
                "east" : 430000
            },
            "behavior" : function() {
                // TODO: walks toward Chip
            }
        },
        BLOB : {
            "type" : "enemy",
            "value" : {
                "base" : 440000,
                "north" : 440000,
                "west" : 450000,
                "south" : 460000,
                "east" : 470000
            },
            "collision" : {
                "player" : {
                    "state" : function(x, y, d) {
                        killChip();
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: moves in a random direction
            }
        },
        BLOCK : {
            "type" : "enemy",
            "value" : {
                "base" : 500000,
                "north" : 500000,
                "west" : 510000,
                "south" : 520000,
                "east" : 530000
            },
            "resists" : {
                "gravel" : true,
                "fire" : true
            },
            "properties" : {
                "submerges" : true
            },
            "collision" : {
                "player" : {
                    "barrier" : function(x, y, d) {
                        // TODO: collision object to iterate over all types of collision?
                        var locking = detectCollision("enemy", "locking", x + chips.util.dir.mod(d)[0], y + chips.util.dir.mod(d)[1], d);
                        var barrier = detectCollision("enemy", "barrier", x + chips.util.dir.mod(d)[0], y + chips.util.dir.mod(d)[1], d);
                        var interactive = detectCollision("enemy", "interactive", x + chips.util.dir.mod(d)[0], y + chips.util.dir.mod(d)[1], d);
                        return locking || barrier;
                    },
                    "interactive" : function(x, y, d) {
                        chips.g.cam.clearTileLayer(x, y, chips.draw.LAYER.ENEMY);
                        chips.g.cam.setTileLayer(x + chips.util.dir.mod(d)[0], y + chips.util.dir.mod(d)[1], chips.draw.LAYER.ENEMY, chips.g.tiles.BLOCK_BASE);
                        detectCollision("enemy", "interactive", x + chips.util.dir.mod(d)[0], y + chips.util.dir.mod(d)[1], d);
                        return true;
                    }
                },
                "enemy" : {
                    "barrier" : function(x, y, d) {
                        return true;
                    }
                }
            },
            "behavior" : function() {
                // TODO: does not move unless chip pushes it, kills Chip if block lands on Chip
            }
        },

        CHIP : {
            "type" : "player",
            "facing" : true,
            "value" : {
                "base" : 10000000,
                "north" : 10000000,
                "west" : 11000000,
                "south" : 12000000,
                "east" : 13000000
            },
            "collision" : {
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        killChip();
                    }
                }
            }
        },
        CHIP_NOSHADOW : {
            "type" : "player",
            "facing" : true,
            "value" : {
                "base" : 14000000,
                "north" : 14000000,
                "west" : 15000000,
                "south" : 16000000,
                "east" : 17000000
            },
            "collision" : {
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        killChip();
                    }
                }
            }
        },
        CHIP_SWIM : {
            "type" : "player",
            "facing" : true,
            "value" : {
                "base" : 20000000,
                "north" : 20000000,
                "west" : 21000000,
                "south" : 22000000,
                "east" : 23000000
            },
            "collision" : {
                "enemy" : {
                    "interactive" : function(x, y, d) {
                        killChip();
                    }
                }
            }
        },
        CHIP_STAND : {
            "type" : "player",
            "value" : 30000000
        },
        CHIP_SPLASH : {
            "type" : "player",
            "value" : 31000000
        },
        CHIP_BURNT : {
            "type" : "player",
            "value" : 32000000
        },
        CHIP_WIN : {
            "type" : "player",
            "value" : 70000000
        }
    }


};