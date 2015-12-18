/**
 * Created by Brogan on 10/13/2015.
 */
/*
 * params
 *  obj                 JavaScript object to be validated
 *  mustBePositive      If true, treat negative numbers in properties as empty properties (default false)
 * returns
 *  true if any properties of the object are null, undefined, or (if applicable) < 0
 *  false otherwise
 */
function hasEmptyProperties(obj, mustBePositive) {
    if (isNullOrUndefined(obj)) {
        console.warn("Null or undefined obj parameter in hasEmptyProperties.");
        return true;
    }
    var pos = (typeof mustBePositive == "undefined" ? false : mustBePositive);

    var propNames = Object.keys(obj);
    var i = 0;
    for (var prop in obj) {
        if (!obj.hasOwnProperty(prop)) { continue; }

        if (prop === "undefined") {
            console.error(obj.constructor.name + "." + propNames[i] + " cannot be undefined in this context.");
            debugger;
            return true;
        }
        if (prop === null) {
            console.error(obj.constructor.name + "." + propNames[i] + " cannot be null in this context.");
            debugger;
            return true;
        }
        if (pos && prop < 0) {
            console.error(obj.constructor.name + "." + propNames[i] + " cannot be negative in this context.");
            debugger;
            return true;
        }
        i++;
    }

    return false;
}

function isNullOrUndefined(obj) {
    if ( obj == null ) {
        return true;
    }

    return false;
}

function logOnce(msg) {
    if (!onceLogged) {
        console.log(msg);
        onceLogged = true;
    }
}