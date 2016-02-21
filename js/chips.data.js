/**
 * Created by Brogan on 1/24/2016.
 */

chips.data = {

    levels : {
        Level : function(name, password, time, chips, hint, links, board) {
            this.name = name || "Untitled";
            this.password = password || "";
            this.timeLeft = time || 0;
            this.chips = chips || 0;
            this.hint = hint || "";
            this.links = links || {};
            this.board = board || [];
        },

        Levelset : function(name, dateCreated, author) {
            this.meta = {
                name : "",
                author : "",
                created : "",
                modified : "",
                size : 0
            };
        },

        loadLevelset : function(levelsetObj) {
            if (!levelsetObj) {
                console.error("Bad arg in addLevelset. Check JSON file.");
                if (chips.g.debug) { debugger; }
                return false;
            }

            chips.data.levels.loaded[levelsetObj.meta.name] = levelsetObj;
            chips.g.last.levelset = levelsetObj.meta.name;
            return true;
        },

        addLevel : function(objLevelset, objLevel) {
            objLevelset[++objLevelset.meta.size] = objLevel || new chips.data.levels.Level();
        },

        loaded : {

        }
    }
};