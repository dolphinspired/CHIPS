/* "Chip's Tribute"
 * A Chip's Challenge remake by Jacob Brogan
 * Original game by Chuck Somerville
 *
 * File schema:
 *  chips.draw.js           For drawing everything onto the game's canvas.
 *  chips.load.js           For loading data onto the page (in the background).
 *  chips.events.js         For handling page events, such as user input.
 *
 *  chips.settings.js       For all read-only global variables.
 *  chips.global.js         For all object structures and mutable global variables.
 */

var chips = {};

$(document).ready(function() {

    // Validate certain global vars before starting
    if (chips.draw.LAYER_SIZE > 16 || chips.draw.LAYER_SIZE < 1) {
        console.error("LAYER_SIZE is invalid (" + chips.draw.LAYER_SIZE + "). This should be between 1 and 16.");
        return false;
    }

    chips.assets.preload();



    requests = requestsData;
    addRequest("setGameMessage", [defaultGameMessage]);


    initAllEvents(); // See chips.events.js

    chips.g.tiles = new chips.util.TileMap(chips.data.tiles);
    chips.g.tLookup = new chips.util.ReverseTileMap(chips.data.tiles);
    chips.testLevels = new getTestLevels();
    addRequest("loadLevel", [0]); // TODO: for testing only

    addRequest("redrawAll");
	// To the loop!
	window.setInterval(function() {
		chips.g.frame++;
        main();
	}, 1000/fps);
});

function main() {

    // For code that does not need to run every frame
    if (activeRequests.length > 0) { processRequests(); }

    // tick for keydrown library
    kd.tick();

    chips.g.cam.updateTurn();

    if (chips.g.cam && chips.g.cam.elapsedTime.tick()) {
        chips.g.cam.decrementTime();
    }
}

var activeRequests = [], requests;

var requestsData = {
    "loadLevel" : new GameRequest(function() {
        chips.map.load.level(this.args[0]);
        this.reset();
    }),
    "startChipResetDelay" : new GameRequest(function() {
        // TODO: figure out what I meant to do with this
    }),
    "dialog" : new GameRequest(function() {
        drawDialogBox(requests[i+1]);
        this.reset();
    }),
    "updateGameframe" : new GameRequest(function() {
        chips.draw.gameFrame();
        this.reset();
    }),
    "updateMap" : new GameRequest(function() {
        chips.draw.activeMap();
        if (chips.g.debug) { chips.draw.debug(); }
        this.reset();
    }),
    "updateDebug" : new GameRequest(function() {
        chips.draw.debug();
        this.reset();
    }),
    "updateHud" : new GameRequest(function() {
        chips.draw.hud();
        this.reset();
    }),
    "updateLevelNum" : new GameRequest(function() {
        chips.draw.levelNumber();
        this.reset();
    }),
    "updateTime" : new GameRequest(function() {
        chips.draw.time();
        this.reset();
    }),
    "updateChipsLeft" : new GameRequest(function() {
        chips.draw.chipsLeft();
        this.reset();
    }),
    "updateInventory" : new GameRequest(function() {
        chips.draw.inventory();
        this.reset();
    }),
    "toggleHint" : new GameRequest(function() {
        this.state = this.args[0];
        if (this.state > 0) {
            chips.draw.hint();
        } else {
            chips.draw.gameFrame();
            chips.draw.hud();
        }
        this.pending = 0;
        this.args = [];
    }),
    "redrawAll" : new GameRequest(function() {
        chips.draw.gameFrame();
        chips.draw.activeMap();
        chips.draw.debug();
        chips.draw.hud();
        this.reset();
    }),
    "setGameMessage" : new GameRequest(function() {
        setGameMessage(this.args[0]);
        this.reset();
    })
};

function GameRequest(func) {
    this.action = func;

    this.reset = function() {
        this.pending = 0;
        this.state = 0;
        this.args = [];
    };

    this.reset();
}

function setGameMessage(str) {
    document.getElementById("gameMessage").innerHTML = str;
}

function addRequest(req, args) {
    try {
        requests[req].pending++;
        if (args) {
            for (var i = 0; i < args.length; i++) {
                requests[req].args[requests[req].args.length] = args[i];
            }
        }
    } catch(e) {
        console.trace(e);
        if (chips.g.debug) { debugger; }
    }


    activeRequests[activeRequests.length] = req;
}

function processRequests() {
    for (var i = 0; i < activeRequests.length; i++) {
        if (requests[activeRequests[i]].pending > 0) {
            requests[activeRequests[i]].action();
        }
    }
    activeRequests = [];
}