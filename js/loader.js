// jQuery must be loaded before the other scripts can load
$(document).ready( function() {
    var path = "js/";
    var scripts = [ "_console.js",
                    "_console.settings.js",
                    "chips.js",
                    "chips.settings.js"];

    for ( var i = 0; i < scripts.length; i++ ) {
        var script = document.createElement("script");
        script.src = path + scripts[i];
        document.head.appendChild(script);
    }

    chipsLoader();
});