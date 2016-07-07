/**
 * Created by Brogan on 1/24/2016.
 */

chips.assets = {

    // This flag will be set to true once poll() returns >= 100%
    areLoaded : false,

    // Used for keeping track of which files have been requested and which have been loaded
    requisition : {
        images : {},
        data : {},
        scripts : {}
    },

    // Stores references to all canvasses (canvi...?) in the window that are used for CHIPS
    canvi : {},

    // These functions are intended to get the appropriate assets from the server and load them into their
    // expected memory locations within the context of the application
    preload : {
        images : function() {
            // Create and load all canvases into the chips.assets.canvi object and initialize their settings
            chips.assets.canvi.gCanvas = document.getElementById("gameCanvas"); // TODO: change to container?
            chips.assets.canvi.gContext = chips.assets.canvi.gCanvas.getContext("2d");
            chips.assets.loadAtlas("Tiles", "t", chips.vars.atlasURL);
            chips.assets.loadAtlas("Window", "w", chips.vars.gameWindowURL);
            chips.assets.loadAtlas("Hud", "d", chips.vars.hudsetURL);

            chips.assets.canvi.gCanvas.width = chips.vars.gameWindowWidth; // load from chips.settings.js
            chips.assets.canvi.gCanvas.height = chips.vars.gameWindowHeight; // load from chips.settings.js
        },
        data : function() {
            chips.assets.getLevelset("Test");
            chips.commands.init();
            chips.commands.schedule.frames.set("setGameMessage", [chips.vars.defaultGameMessage]);
            var lastLevelPlayed = (chips.util.cookie.get("lastLevelPlayed") || 1);
            chips.commands.schedule.frames.set("loadLevel", [lastLevelPlayed]); // This won't get called until all assets are loaded anyway
            chips.commands.schedule.frames.set("redrawAll"); // Is this necessary?
            chips.commands.schedule.frames.set("initEvents");
        }
    },

    /**
     * function poll
     * Returns the percentage of items that have been loaded which have been requested from the server
     *
     * @returns {number} - (requests loaded / total requests) * 100
     */
    poll : function() {
        var r = chips.assets.requisition;
        var numLoaded = 0, total = 0;

        // Iterate over the requisition object and count the total number of objects requested.
        // Also count how many of the requested objects have been loaded (value > 0).
        for (var i in r) {
            if (!r.hasOwnProperty(i)) { continue; }
            if (typeof r[i] == "object") {
                for (var j in r[i]) {
                    if (!r[i].hasOwnProperty(j)) { continue; }
                    total++;
                    if (r[i][j] > 0) numLoaded++;
                }
            }
        }

        if (total === 0) {
            return 0;
        } else {
            var percent = (numLoaded / total) * 100;
            chips.assets.areLoaded = percent >= 100.0; // If 100% of assets are loaded, set the flag to true; false otherwise
            return percent;
        }
    },

    /**
     * function loadAtlas
     * Loads an image (tile atlas) into a new canvas in the window
     * If available, this will use the element with id = chips.vars.atlasReferenceContainerID,
     * which should ideally be display: none.
     *
     * @param id - the unique id of the canvas element on which the image will be drawn (#refCanvas{id}).
     *             Will be created if it does not already exist.
     * @param prefix - name by which this canvas will be accessible in the canvi object - chips.assets.canvi.{prefix}Canvas
     * @param url - location of the image to be loaded into a canvas
     * @returns {boolean} - true if successful, false if any parameters are missing.
     */
    loadAtlas : function(id, prefix, url) {
        if (typeof id == "undefined" || typeof prefix == "undefined" || typeof url == "undefined") {
            console.error("Parameter missing from loadAtlas. Tile atlas was not loaded.");
            if (chips.g.debug) { debugger; }
            return false;
        }

        chips.assets.requisition.images[id] = 0; // Add this image to the requisition to poll for load status

        // Get the container of reference canvases if it exists, otherwise create the container
        var canvasContainer = document.getElementById(chips.vars.atlasReferenceContainerID);
        if (!canvasContainer) {
            var temp = document.createElement("div");
            temp.id = chips.vars.atlasReferenceContainerID;
            temp.style.display = "none";
            canvasContainer = document.body.appendChild(temp);
        }

        // Create the new canvas only if no other canvas exists by the provided ID
        if (!document.getElementById("refCanvas" + id)) {
            var tempCanvas = document.createElement("canvas");
            tempCanvas.id = "refCanvas" + id;
            canvasContainer.appendChild(tempCanvas);
        }

        // Establish the <canvas> and 2d-context objects in the canvi collection
        // These will be accessible using the prefix parameter, i.e. canvi.gCanvas and canvi.gContext
        chips.assets.canvi[prefix + "Canvas"] = document.getElementById("refCanvas" + id);
        chips.assets.canvi[prefix + "Context"] = chips.assets.canvi[prefix + "Canvas"].getContext("2d");

        var imgObj = new Image();
        imgObj.src = url;

        imgObj.addEventListener("load", function() {
            chips.assets.canvi[prefix + "Canvas"].width = this.width;
            chips.assets.canvi[prefix + "Canvas"].height = this.height;
            chips.assets.canvi[prefix + "Context"].drawImage(imgObj,0,0);
            chips.assets.requisition.images[id]++; // Once the image has loaded, increment its spot in the requisition
        });

        return true;
    },

    /**
     * function getLevelset
     * Asynchronously loads the levelset (JSON) file from the server.
     * Maps the JSON data to the chips.data.levels object onload.
     *
     * @param levelsetName - Name of the levelset file to get from the server. ("Test" will get Test.json)
     */
    getLevelset : function(levelsetName) {
        // Set the flag for this item in requisition.data to 0 until we know it's downloaded.
        chips.assets.requisition.data[levelsetName] = 0;

        var filepath = chips.vars.levelsetURL + levelsetName + ".json";
        var request = new XMLHttpRequest();

        request.open('GET', filepath, true);

        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                // Success
                var data = JSON.parse(this.response);
                chips.data.levels.loadLevelset(data[levelsetName]);
                chips.assets.requisition.data[levelsetName]++; // Increment the flag since it's downloaded
                chips.g.refresh(); // New levelset data is available, so refresh the global vars
            } else {
                // Error
            }
        };

        request.onerror = function() {
            console.error("Levelset didn't load. Check JSON file format.");
        };

        request.send();
    }
};