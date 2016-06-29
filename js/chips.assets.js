/**
 * Created by Brogan on 1/24/2016.
 */

chips.assets = {

    areLoaded : false,

    poll : function(group) {
        var r = chips.assets.requisition;
        var numLoaded = 0, total = 0;

        if (group) {
            for (var i in r) {
                if (!r.hasOwnProperty(i)) { continue; }
                total++;
                if (r[i] > 0) numLoaded++;
            }
        } else {
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
        }

        var percent = (numLoaded / total) * 100;

        chips.assets.areLoaded = percent >= 100.0; // If 100% of assets are loaded, set the flag to true; false otherwise


        return percent;
    },

    requisition : {
        images : {

        },
        data : {

        },
        scripts : {

        }
    },

    canvi : {},

    preload : {
        images : function() {
            // Create and load all canvases into the chips.assets.canvi object and initialize their settings
            chips.assets.canvi.gCanvas = document.getElementById("gameCanvas");
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
    },

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