/**
 * Created by Brogan on 2/19/2016.
 */

chips.rules = (chips.rules || {});

chips.rules["MS_1_0_0"] = Object.freeze({
    "meta" : {
        "name" : "MS_1_0_0",
        "nicename" : "Microsoft ruleset (classic)",
        "version" : "1.0.0",
        "description" : "This ruleset invokes the classic rules of the MS version of Chip's Challenge.",
        "published" : "2016-02-19"
    },
    "data" : {
        FLOOR : {
            "type" : "floor",
            "value" : 0
        },
        WALL : {
            "type" : "floor",
            "value" : 1,
            "collision" : {
                "all" : {
                    "barrier" : function(entity) {
                        return true;
                    }
                }
            }
        },
        FAKE_WALL_HOLLOW : {
            "type" : "floor",
            "value" : 2,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        chips.g.cam.setChipsNextTile(player.facing(), chips.g.tiles.FLOOR);
                        return chips.util.detectCollision(player, "barrier");
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "properties" : {
                "obscuresItems" : true
            }
        },
        FAKE_WALL_SOLID : {
            "type" : "floor",
            "value" : 3,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        chips.g.cam.setChipsNextTileLayer(player.facing(), chips.draw.LAYER.FLOOR, chips.g.tiles.WALL);
                        return chips.util.detectCollision(player, "barrier");
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        MUD : {
            "type" : "floor",
            "value" : 4,
            "collision" : {
                "player" : {
                    "interactive" : function(player) {
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }

        },
        SOCKET : {
            "type" : "floor",
            "value" : 5,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        return chips.g.cam.chipsLeft > 0;
                    },
                    "interactive" : function(player) {
                        // If you're standing on this tile, you already had enough chips (same concept as locks)
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        EXIT : {
            "type" : "floor",
            "value" : 70,
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        chips.g.cam.win();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
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
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH;
                    }
                }
            }
        },
        THIN_WALL_WEST : {
            "type" : "floor",
            "value" : 11,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.WEST;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTH : {
            "type" : "floor",
            "value" : 12,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH;
                    }
                }
            }
        },
        THIN_WALL_EAST : {
            "type" : "floor",
            "value" : 13,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.EAST;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.WEST;
                    }
                }
            }
        },
        THIN_WALL_NORTHEAST : {
            "type" : "floor",
            "value" : 14,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH || entity.facing() === chips.util.dir.EAST
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH || entity.facing() === chips.util.dir.WEST
                    }
                }
            }
        },
        THIN_WALL_NORTHWEST : {
            "type" : "floor",
            "value" : 15,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH || entity.facing() === chips.util.dir.WEST;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH || entity.facing() === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTHWEST : {
            "type" : "floor",
            "value" : 16,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH || entity.facing() === chips.util.dir.WEST;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH || entity.facing() === chips.util.dir.EAST;
                    }
                }
            }
        },
        THIN_WALL_SOUTHEAST : {
            "type" : "floor",
            "value" : 17,
            "collision" : {
                "all" : {
                    "locking" : function(entity) {
                        return entity.facing() === chips.util.dir.SOUTH || entity.facing() === chips.util.dir.EAST;
                    },
                    "barrier" : function(entity) {
                        return entity.facing() === chips.util.dir.NORTH || entity.facing() === chips.util.dir.WEST;
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
            "value" : 24,
            "collision" : {
                "all" : {
                    "unload" : function(entity) {
                        entity.setState(chips.vars.entityState.SLIDING, false);
                        entity.setState(chips.vars.entityState.MOVELOCKED, false);
                        return true;
                    },
                    "barrier" : function(entity) {
                        var d = entity.facing();
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.WEST;
                    },
                    "interactive" : function(entity) {
                        if (entity.hasItem("SKATE")) {
                            return true;
                        } else {
                            entity.state = chips.vars.entityState.SLIDING + chips.vars.entityState.MOVELOCKED;
                            var d = entity.facing();
                            var dTarget;

                            if (d === chips.util.dir.NORTH) {
                                dTarget = chips.util.dir.WEST;
                            } else if (d === chips.util.dir.EAST) {
                                dTarget = chips.util.dir.SOUTH;
                            } else {
                                dTarget = d;
                            }

                            if (chips.util.detectCollision(entity, "barrier", dTarget)) {
                                entity.slide(chips.util.dir.back(d));
                            } else {
                                entity.slide(dTarget);
                            }
                        }
                        return true;
                    }
                }
            }
        },
        ICE_WALL_NORTHWEST : {
            "type" : "floor",
            "value" : 25,
            "collision" : {
                "all" : {
                    "unload" : function(entity) {
                        entity.setState(chips.vars.entityState.SLIDING, false);
                        entity.setState(chips.vars.entityState.MOVELOCKED, false);
                        return true;
                    },
                    "barrier" : function(entity) {
                        var d = entity.facing();
                        return d === chips.util.dir.SOUTH || d === chips.util.dir.EAST;
                    },
                    "interactive" : function(entity) {
                        if (entity.hasItem("SKATE")) {
                            return true;
                        } else {
                            entity.state = chips.vars.entityState.SLIDING + chips.vars.entityState.MOVELOCKED;
                            var d = entity.facing();
                            var dTarget;

                            if (d === chips.util.dir.NORTH) {
                                dTarget = chips.util.dir.EAST;
                            } else if (d === chips.util.dir.WEST) {
                                dTarget = chips.util.dir.SOUTH;
                            } else {
                                dTarget = d;
                            }

                            if (chips.util.detectCollision(entity, "barrier", dTarget)) {
                                entity.slide(chips.util.dir.back(d));
                            } else {
                                entity.slide(dTarget);
                            }
                        }
                        return true;
                    }
                }
            }
        },
        ICE_WALL_SOUTHWEST : {
            "type" : "floor",
            "value" : 26,
            "collision" : {
                "all" : {
                    "unload" : function(entity) {
                        entity.setState(chips.vars.entityState.SLIDING, false);
                        entity.setState(chips.vars.entityState.MOVELOCKED, false);
                        return true;
                    },
                    "barrier" : function(entity) {
                        var d = entity.facing();
                        return d === chips.util.dir.NORTH || d === chips.util.dir.EAST;
                    },
                    "interactive" : function(entity) {
                        if (entity.hasItem("SKATE")) {
                            return true;
                        } else {
                            entity.state = chips.vars.entityState.SLIDING + chips.vars.entityState.MOVELOCKED;
                            var d = entity.facing();
                            var dTarget;

                            if (d === chips.util.dir.SOUTH) {
                                dTarget = chips.util.dir.EAST;
                            } else if (d === chips.util.dir.WEST) {
                                dTarget = chips.util.dir.NORTH;
                            } else {
                                dTarget = d;
                            }

                            if (chips.util.detectCollision(entity, "barrier", dTarget)) {
                                entity.slide(chips.util.dir.back(d));
                            } else {
                                entity.slide(dTarget);
                            }
                        }
                        return true;
                    }
                }
            }
        },
        ICE_WALL_SOUTHEAST : {
            "type" : "floor",
            "value" : 27,
            "collision" : {
                "all" : {
                    "unload" : function(entity) {
                        entity.setState(chips.vars.entityState.SLIDING, false);
                        entity.setState(chips.vars.entityState.MOVELOCKED, false);
                        return true;
                    },
                    "barrier" : function(entity) {
                        var d = entity.facing();
                        return d === chips.util.dir.NORTH || d === chips.util.dir.WEST;
                    },
                    "interactive" : function(entity) {
                        if (entity.hasItem("SKATE")) {
                            return true;
                        } else {
                            entity.state = chips.vars.entityState.SLIDING + chips.vars.entityState.MOVELOCKED;
                            var d = entity.facing();
                            var dTarget;

                            if (d === chips.util.dir.SOUTH) {
                                dTarget = chips.util.dir.WEST;
                            } else if (d === chips.util.dir.EAST) {
                                dTarget = chips.util.dir.NORTH;
                            } else {
                                dTarget = d;
                            }

                            if (chips.util.detectCollision(entity, "barrier", dTarget)) {
                                entity.slide(chips.util.dir.back(d));
                            } else {
                                entity.slide(dTarget);
                            }
                        }
                        return true;
                    }
                }
            }
        },
        WATER : {
            "type" : "floor",
            "value" : 30,
            "collision" : {
                "player" : {
                    "unload" : function(player) {
                        player.swim(false);
                        return true;
                    },
                    "interactive" : function(player) {
                        var l = chips.draw.LAYER.CHIP;

                        if (player.hasItem("FLIPPER")) {
                            player.swim(true);
                            return true;
                        } else {
                            chips.g.cam.setChipsTileLayer(l, chips.g.tiles.CHIP_SPLASH);
                            return true;
                        }
                    },
                    "state" : function(player) {
                        if (!player.hasItem("FLIPPER")) {
                            player.kill("Chip can't swim without flippers!");
                            return true;
                        }
                        return false;
                    }
                },
                "monster" : {
                    "interactive" : function(monster) {
                        var submerges, resists;

                        try {
                            submerges = chips.g.rules[monster.name].properties["submerges"];
                        } catch(e) {
                            submerges = false;
                        }

                        if (submerges) {
                            chips.g.cam.setTileLayer(monster.x, monster.y, chips.draw.LAYER.FLOOR, chips.g.tiles.MUD);
                            monster.kill();
                            return true;
                        }

                        try {
                            resists = chips.g.rules[monster.name].resists["water"];
                        } catch(e) {
                            resists = false;
                        }

                        if (!resists) {
                            monster.kill();
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
                    "interactive" : function(player) {
                        if (!player.hasItem("BOOT")) {
                            chips.g.cam.setChipsTileLayer(chips.draw.LAYER.CHIP, chips.g.tiles.CHIP_BURNT);
                            return true;
                        } else {
                            return false;
                        }
                    },
                    "state" : function(player) {
                        if (!player.hasItem("BOOT")) {
                            player.kill("Chip can't walk on fire without boots!");
                            return true;
                        }
                        return false;
                    }
                },
                "monster" : {
                    "interactive" : function(monster) {
                        var resists;

                        try {
                            resists = chips.g.rules[monster.name].resists["fire"];
                        } catch(e) {
                            resists = false;
                        }

                        if (!resists) {
                            monster.kill();
                            return true;
                        }
                        else return false;
                    }
                }
            }
        },
        ICE : {
            "type" : "floor",
            "value" : 32,
            "collision" : {
                "all" : {
                    "unload" : function(entity) {
                        entity.setState(chips.vars.entityState.SLIDING, false);
                        entity.setState(chips.vars.entityState.MOVELOCKED, false);
                        return true;
                    },
                    "interactive" : function(entity) {
                        if (entity.hasItem("SKATE")) {
                            return true;
                        } else {
                            entity.state = chips.vars.entityState.SLIDING + chips.vars.entityState.MOVELOCKED;
                            var d = entity.facing();
                            if (chips.util.detectCollision(entity, "barrier", d)) {
                                entity.slide(chips.util.dir.back(d));
                            } else {
                                entity.slide();
                            }
                        }
                        return true;
                    }
                }
            }
        },
        FORCE_FLOOR_RANDOM : {
            "type" : "floor",
            "value" : 33
        },
        GRAVEL : {
            "type" : "floor",
            "value" : 34,
            "collision" : {
                "monster" : {
                    "barrier" : function(monster) {
                        var resists;

                        try {
                            resists = chips.g.rules[monster.name].resists["gravel"];
                        } catch(e) {
                            resists = false;
                        }

                        return !resists;
                    }
                }
            }
        },
        THIEF : {
            "type" : "floor",
            "value" : 35,
            "collision" : {
                "player" : {
                    "interactive" : function(player) {
                        player.inventory.removeItem("FLIPPER", true);
                        player.inventory.removeItem("SUCTIONSHOES", true);
                        player.inventory.removeItem("BOOT", true);
                        player.inventory.removeItem("SKATE", true);
                        return true;
                    }
                }
            }
        },
        RED_THIEF : {
            "type" : "floor",
            "value" : 45,
            "collision" : {
                "player" : {
                    "interactive" : function(player) {
                        player.inventory.removeItem("KEY_GREEN", true);
                        player.inventory.removeItem("KEY_BLUE", true);
                        player.inventory.removeItem("KEY_YELLOW", true);
                        player.inventory.removeItem("KEY_RED", true);
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
                    "state" : function(player) {
                        player.kill();
                    }
                },
                "monster" : {
                    "interactive" : function(monster) {
                        chips.g.cam.clearTileLayer(monster.x, monster.y, chips.draw.LAYER.FLOOR);
                        monster.kill();
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
                    "unload" : function(player) {
                        chips.commands.setBy.frame(0, "toggleHint", [0]);
                        chips.commands.setBy.frame(0, "redrawAll"); // Not sure why, but this is necessary
                        return true;
                    },
                    "interactive" : function(player) {
                        chips.commands.setBy.frame(0, "toggleHint", [1]);
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
                    "interactive" : function(player) {
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.WALL);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
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
                    "interactive": function (player) {
                        var destX, destY, d = player.facing();
                        var teleports = chips.g.cam.findTilesByLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.TELEPORT);

                        for (var i = 0; i < teleports.length; i++) {
                            // If this teleport is the tile that Chip is currently on
                            if (teleports[i][0] === player.x && teleports[i][1] === player.y) {
                                if (!destX || !destY) continue; // Destination not yet set (first iteration), keep trying
                                else break;
                            } else {
                                if (!chips.util.detectCollision(player, "barrier", d, teleports[i][0], teleports[i][1])) {
                                    destX = teleports[i][0] + chips.util.dir.mod(d)[0];
                                    destY = teleports[i][1] + chips.util.dir.mod(d)[1];
                                }
                            }
                        }
                        // TODO: this needs to be treated like a slide
                        if (destX && destY) {
                            player.teleport(destX, destY);
                        }
                        return true;
                    }
                },
                "monster" : {
                    "interactive" : function(monster) {
                        var destX, destY;
                        var teleports = chips.g.cam.findTilesByLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.TELEPORT);

                        // TODO: Monster teleports

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
                    "interactive" : function(entity) {
                        var allOpenToggles = chips.g.cam.findTilesByLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_OPEN);
                        var allClosedToggles = chips.g.cam.findTilesByLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_CLOSED);
                        var i;

                        for (i = 0; i < allOpenToggles.length; i++) {
                            chips.g.cam.setTileLayer(allOpenToggles[i][0], allOpenToggles[i][1], chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_CLOSED);
                        }

                        for (i = 0; i < allClosedToggles.length; i++) {
                            chips.g.cam.setTileLayer(allClosedToggles[i][0], allClosedToggles[i][1], chips.draw.LAYER.FLOOR, chips.g.tiles.TOGGLE_OPEN);
                        }

                        return true;
                    }
                }
            }

        },
        SWITCH_SPAWNER : {
            "type" : "floor",
            "value" : 51,
            "collision" : {
                "all" : {
                    "interactive" : function(entity) {

                    }
                }
            }
        },
        SWITCH_TANK : {
            "type" : "floor",
            "value" : 52,
            "collision" : {
                "all" : {
                    "interactive" : function(entity) {
                        var tanks = chips.g.cam.monsters.getMonstersByName("TANK");
                        for (var i = 0; i < tanks.length; i++) {
                            tanks[i].addPattern("onBlueButtonPress", true);
                        }
                    }
                }
            }
        },
        SWITCH_BEARTRAP : {
            "type" : "floor",
            "value" : 53,
            "collision" : {
                "all" : {
                    "interactive" : function(entity) {

                    }
                }
            }
        },
        INVISIBLE_WALL : {
            "type" : "floor",
            "value" : 6,
            "collision" : {
                "all" : {
                    "barrier" : function(entity) {
                        return true;
                    }
                }
            }
        },
        INVISIBLE_WALL_SHOW : {
            "type" : "floor",
            "value" : 7,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        chips.g.cam.setChipsNextTileLayer(player.facing(), chips.draw.LAYER.FLOOR, chips.g.tiles.WALL);
                        return chips.util.detectCollision(player, "barrier");
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        LOCK_BLUE : {
            "type" : "floor",
            "value" : 60,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        return !player.hasItem("KEY_BLUE");
                    },
                    "interactive" : function(player) {
                        player.inventory.removeItem("KEY_BLUE");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        LOCK_RED : {
            "type" : "floor",
            "value" : 61,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        return !player.hasItem("KEY_RED");
                    },
                    "interactive" : function(player) {
                        player.inventory.removeItem("KEY_RED");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        LOCK_YELLOW : {
            "type" : "floor",
            "value" : 62,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        return !player.hasItem("KEY_YELLOW");
                    },
                    "interactive" : function(player) {
                        player.inventory.removeItem("KEY_YELLOW");
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        LOCK_GREEN : {
            "type" : "floor",
            "value" : 63,
            "collision" : {
                "player" : {
                    "barrier" : function(player) {
                        return !player.hasItem("KEY_GREEN");
                    },
                    "interactive" : function(player) {
                        // Green keys are not consumed on unlock - no item to remove
                        chips.g.cam.setChipsTileLayer(chips.draw.LAYER.FLOOR, chips.g.tiles.FLOOR);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        TOGGLE_CLOSED : {
            "type" : "floor",
            "value" : 64,
            "collision" : {
                "all" : {
                    "barrier" : function(entity) {
                        return true;
                    }
                }
            }
        },
        TOGGLE_OPEN : {
            "type" : "floor",
            "value" : 65
        },
        EXIT_ANIMATION_2 : {
            "type" : "floor",
            "value" : 71
        },
        EXIT_ANIMATION_3 : {
            "type" : "floor",
            "value" : 72
        },

        ITEM_CHIP : {
            "type" : "item",
            "value" : 100,
            "collision" : {
                "player" : {
                    "interactive" : function(player) {
                        chips.g.cam.decrementChipsLeft();
                        chips.g.cam.clearChipsTileLayer(chips.draw.LAYER.ITEM);
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            }
        },
        FLIPPER : {
            "type" : "item",
            "value" : 1000,
            "collision" : {
                "player" : {
                    "interactive" : function(player) {
                        player.inventory.addItem("FLIPPER");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("BOOT");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("SKATE");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("SUCTIONSHOES");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("KEY_BLUE");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("KEY_RED");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("KEY_YELLOW");
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
                    "interactive" : function(player) {
                        player.inventory.addItem("KEY_GREEN");
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
            "type" : "monster",
            "value" : {
                "north" : 40000,
                "west" : 50000,
                "south" : 60000,
                "east" : 70000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // No idle behavior, it only moves by Actions
            },
            "triggers" : {
                "patterns" : {
                    "onBlueButtonPress" : ["turnLeft", 0, "moveLeft", 0, "moveForward", -1]
                },
                "actions" : {
                    "turnLeft" : function(monster) {
                        return monster.turn(chips.util.dir.left(monster.facing()));
                    },
                    "moveLeft" : function(monster) {
                        return monster.move(chips.util.dir.left(monster.facing()));
                    },
                    "moveForward" : function(monster) {
                        return monster.move(monster.facing());
                    }
                }
            },
            "speed" : 2
        },
        BUG : {
            "type" : "monster",
            "value" : {
                "north" : 100000,
                "west" : 110000,
                "south" : 120000,
                "east" : 130000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // follow the barrier to its left, else circle counter-clockwise
                var d = monster.facing();
                if (monster.move(chips.util.dir.left(d))) {
                    return true;
                } if (monster.move(d)) {
                    return true;
                } if (monster.move(chips.util.dir.right(d))) {
                    return true;
                } if (monster.move(chips.util.dir.back(d))) {
                    return true;
                }
                return false;
            },
            "speed" : 2
        },
        PARAMECIUM : {
            "type" : "monster",
            "value" : {
                "base" : 140000,
                "north" : 140000,
                "west" : 150000,
                "south" : 160000,
                "east" : 170000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // follow the barrier to its right, else circle clockwise
                var d = monster.facing();
                if (monster.move(chips.util.dir.right(d))) {
                    return true;
                } if (monster.move(d)) {
                    return true;
                } if (monster.move(chips.util.dir.left(d))) {
                    return true;
                } if (monster.move(chips.util.dir.back(d))) {
                    return true;
                }
                return false;
            },
            "speed" : 2
        },
        GLIDER : {
            "type" : "monster",
            "value" : {
                "base" : 200000,
                "north" : 200000,
                "west" : 210000,
                "south" : 220000,
                "east" : 230000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "resists" : {
                "water" : true
            },
            "behavior" : function(monster) {
                // turn left on a barrier collision, else right, else reverse
                var d = monster.facing();
                if (monster.move(d)) {
                    return true;
                } if (monster.move(chips.util.dir.left(d))) {
                    return true;
                } if (monster.move(chips.util.dir.right(d))) {
                    return true;
                } if (monster.move(chips.util.dir.back(d))) {
                    return true;
                }
                return false;
            },
            "speed" : 2
        },
        FIREBALL : {
            "type" : "monster",
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
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // turn right on a barrier collision, else left, else reverse
                var d = monster.facing();
                if (monster.move(d)) {
                    return true;
                } if (monster.move(chips.util.dir.right(d))) {
                    return true;
                } if (monster.move(chips.util.dir.left(d))) {
                    return true;
                } if (monster.move(chips.util.dir.back(d))) {
                    return true;
                }
                return false;
            },
            "speed" : 2
        },
        BALL : {
            "type" : "monster",
            "value" : {
                "base" : 300000,
                "north" : 300000,
                "west" : 310000,
                "south" : 320000,
                "east" : 330000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // reverse direction on a barrier collision
                var d = monster.facing();
                if (monster.move(d)) {
                    return true;
                } if (monster.move(chips.util.dir.back(d))) {
                    return true;
                }
                return false;
            },
            "speed" : 2
        },
        WALKER : {
            "type" : "monster",
            "value" : {
                "base" : 340000,
                "north" : 340000,
                "west" : 350000,
                "south" : 360000,
                "east" : 370000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // move forward until barrier collision, then turn in a random direction
                var d = monster.facing();
                if (monster.move(d)) {
                    return true;
                } else {
                    // Get all remaining dirs, randomly shuffled, and try to move in each dir
                    var remaining = chips.util.dir.shuffle(d);
                    for (var i = 0; i < remaining.length; i++) {
                        if (monster.move(remaining[i])) {
                            return true;
                        }
                    }
                }
                return false;
            },
            "speed" : 2
        },
        TEETH : {
            "type" : "monster",
            "value" : {
                "base" : 400000,
                "north" : 400000,
                "west" : 410000,
                "south" : 420000,
                "east" : 430000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // walks toward Chip
                var priority = chips.util.dir.approach(monster.x, monster.y, chips.g.cam.player.x, chips.g.cam.player.y, "vertical");

                for (var i = 0; i < priority.length; i++) {
                    if (monster.move(priority[i])) {
                        return true;
                    }
                }

                monster.turn(priority[0]);

                return false;
            },
            "speed" : 4
        },
        BLOB : {
            "type" : "monster",
            "value" : {
                "base" : 440000,
                "north" : 440000,
                "west" : 450000,
                "south" : 460000,
                "east" : 470000
            },
            "collision" : {
                "player" : {
                    "state" : function(player) {
                        player.kill();
                        return true;
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // moves in a random direction
                var random = chips.util.dir.shuffle();

                for (var i = 0; i < random.length; i++) {
                    if (monster.move(random[i])) {
                        return true;
                    }
                }
                return false;
            },
            "speed" : 4
        },
        BLOCK : {
            "type" : "monster",
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
                    "barrier" : function(player) {
                        var d = player.facing(),
                            xDest = player.x + chips.util.dir.mod(d)[0],
                            yDest = player.y + chips.util.dir.mod(d)[1];

                        var allBlocks = chips.g.cam.monsters.getMonstersByName("BLOCK"),
                            thisBlock;

                        for (var i = 0; i < allBlocks.length; i++) {
                            if (allBlocks[i].x === xDest && allBlocks[i].y === yDest) {
                                thisBlock = allBlocks[i];
                                break;
                            }
                        }

                        return !thisBlock.move(d);
                    }
                },
                "monster" : {
                    "barrier" : function(monster) {
                        return true;
                    }
                }
            },
            "behavior" : function(monster) {
                // does not move unless chip pushes it, kills Chip if block lands on Chip
                // this behavior should remain empty
            },
            "speed" : 0
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
                "monster" : {
                    "interactive" : function(monster) {
                        chips.g.cam.player.kill();
                    }
                }
            },
            "speed" : 2
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
                "monster" : {
                    "interactive" : function(monster) {
                        chips.g.cam.player.kill();
                    }
                }
            },
            "speed" : 2
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
                "monster" : {
                    "interactive" : function(monster) {
                        chips.g.cam.player.kill();
                    }
                }
            },
            "speed" : 2
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
});