/**
 * Created by Brogan on 1/24/2016.
 */

chips.assets = {

    canvi : {},

    preload : function() {
        // Create and load all canvases into the chips.assets.canvi object and initialize their settings
        chips.assets.canvi.gCanvas = document.getElementById("gameCanvas");
        chips.assets.canvi.gContext = chips.assets.canvi.gCanvas.getContext("2d");
        chips.assets.loadAtlas("Tiles", "t", atlasURL);
        chips.assets.loadAtlas("Window", "w", gameWindowURL);
        chips.assets.loadAtlas("Hud", "d", hudsetURL);

        chips.assets.canvi.gCanvas.width = gameWindowWidth; // load from chips.settings.js
        chips.assets.canvi.gCanvas.height = gameWindowHeight; // load from chips.settings.js
    },

    loadAtlas : function(id, prefix, url) {
        if (typeof id == "undefined" || typeof prefix == "undefined" || typeof url == "undefined") {
            console.error("Parameter missing from loadAtlas. Tile atlas was not loaded.");
            if (chips.g.debug) { debugger; }
            return false;
        }

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
        });
    }
};