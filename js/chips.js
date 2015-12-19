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
	
$(document).ready(function() {

    // Validate certain global vars before starting
    if (drawVars.LAYER_SIZE > 16 || drawVars.LAYER_SIZE < 1) {
        console.error("LAYER_SIZE is invalid (" + drawVars.LAYER_SIZE + "). This should be between 1 and 16.");
        return false;
    }

	// Create and load all canvases into the canvi object and initialize their settings
	canvi.gCanvas = document.getElementById("gameCanvas");
	canvi.gContext = canvi.gCanvas.getContext("2d");
    loadReferenceImage(atlasURL, "Tiles");
    canvi.tCanvas = document.getElementById("refCanvasTiles");
    canvi.tContext = canvi.tCanvas.getContext("2d");
    loadReferenceImage(gameWindowURL, "ChipsWindow");
    canvi.wCanvas = document.getElementById("refCanvasChipsWindow");
    canvi.wContext = canvi.wCanvas.getContext("2d");
    loadReferenceImage(hudsetURL, "Hud");
    canvi.dCanvas = document.getElementById("refCanvasHud");
    canvi.dContext = canvi.dCanvas.getContext("2d");

	canvi.gCanvas.width = gameWindowWidth; // load from chips.settings.js
	canvi.gCanvas.height = gameWindowHeight; // load from chips.settings.js

    drawGameframe();
    initAllEvents(); // See chips.events.js

    addRequest("loadLevel", 0); // TODO: for testing only

    addRequest("updateGameframe");
    addRequest("updateMap");
    addRequest("updateDebug");

	// To the loop!
	window.setInterval(function() {
		frame++;
        main();
	}, 1000/fps);
});

function main() {

    // For code that does not need to run every frame
    if (requests.length > 0) { processRequests(); }

    // tick for keydrown library
    kd.tick();

    if (currentActiveMap && currentActiveMap.elapsedTime.tick()) {
        currentActiveMap.decrementTime();
    }
}

function addRequest(str, param) {
    requests[requests.length] = str;
    if (typeof param !== "undefined") { requests[requests.length] = param }
}

function processRequests() {
    for (var i = 0; i < requests.length; i++) {
        switch (requests[i]) {
            case "loadLevel":
                loadLevel(requests[i+1]); // get next num in requests
                i++; // skip over next num for request handling
                break;
            case "startChipResetDelay":
                // TODO: add something here
                break;
            case "dialog":
                drawDialogBox(requests[i+1]);
                i++;
                break;
            case "updateGameframe":
                drawGameframe();
                break;
            case "updateMap":
                drawActiveMap();
                if (debug) { drawDebug(); }
                break;
            case "updateDebug":
                drawDebug();
                break;
            case "updateHud":
                drawHud();
                break;
            case "updateLevelNum":
                drawLevelNumber();
                break;
            case "updateTime":
                drawTime();
                break;
            case "updateChipsLeft":
                drawChipsLeft();
                break;
            case "updateInventory":
                drawInventory();
                break;
            case "toggleHint":
                if (hintShown) {
                    drawGameframe();
                    drawHud();
                    hintShown = false;
                } else {
                    drawHint();
                    hintShown = true;
                }
                break;
            case "redrawAll":
                drawGameframe();
                drawActiveMap();
                drawDebug();
                drawHud();
                hintShown = false;
                break;
            case "setGameMessage":
                setGameMessage(requests[i+1]);
                i++;
                break;
            default:
                console.warn("Unhandled request in processRequests(): " + requests[i]);
                break;
        }
    }
    requests = []; // empty all requests, assume they are handled
}

function setGameMessage(str) {
    document.getElementById("gameMessage").innerHTML = str;
}
