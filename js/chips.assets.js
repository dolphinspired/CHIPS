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
        chips.g.refresh(); // Now that all assets are loaded, refresh the global vars

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
            chips.vars.requests.init();
            chips.vars.requests.add("setGameMessage", [chips.vars.defaultGameMessage]);
            chips.vars.requests.add("loadLevel", [1]); // This won't get called until all assets are loaded anyway
            chips.vars.requests.add("redrawAll"); // Is this necessary?
            chips.vars.requests.add("initEvents");
        }
    },

    loadAtlas : function(id, prefix, url) {
        if (typeof id == "undefined" || typeof prefix == "undefined" || typeof url == "undefined") {
            console.error("Parameter missing from loadAtlas. Tile atlas was not loaded.");
            if (chips.g.debug) { debugger; }
            return false;
        }

        chips.assets.requisition.images[id] = 0; // Add this image to the requisition to poll for load status

        var $container;

        if (document.getElementById("refContainer" + id)) {
            $container = $("#refContainer" + id);
            if (!document.getElementById("refCanvas" + id)) {
                $container.append("<canvas id='refCanvas" + id + "'></canvas>");
            }
        } else {
            $(document.body).append("<div id='refContainer" + id + "' style='display:none'></canvas>");
            $container = $("#refContainer" + id);
            $container.append("<canvas id='refCanvas" + id + "'></canvas>");
        }

        chips.assets.canvi[prefix + "Canvas"] = document.getElementById("refCanvas" + id);
        chips.assets.canvi[prefix + "Context"] = chips.assets.canvi[prefix + "Canvas"].getContext("2d");

        var imgObj = new Image();
        imgObj.src = url;

        $(imgObj).on("load", function() {
            chips.assets.canvi[prefix + "Canvas"].width = this.width;
            chips.assets.canvi[prefix + "Canvas"].height = this.height;
            chips.assets.canvi[prefix + "Context"].drawImage(imgObj,0,0);
            chips.assets.requisition.images[id]++; // Once the image has loaded, increment its spot in the requisition
        });
    },

    getLevelset : function(levelsetName) {
        chips.assets.requisition.data[levelsetName] = 0;

        var filepath = chips.vars.levelsetURL + levelsetName + ".json";
        $.getJSON(filepath, function(data) {
            chips.data.levels.loadLevelset(data[levelsetName]);
            chips.assets.requisition.data[levelsetName]++;
        }).fail(function() {
            console.error("Levelset didn't load. Check JSON file format.");
        });
    }
};