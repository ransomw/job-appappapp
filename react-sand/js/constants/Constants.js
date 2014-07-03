define([
], function () {

    // note that there is no type-checking to ensure the argument is an Object
    var key_mirror = function(obj) {
        var ret = {};
        var key;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
        return ret;
    };

    return key_mirror({
        COMPANY_CREATE: null
    });

});