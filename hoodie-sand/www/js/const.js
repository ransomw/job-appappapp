define([
    'js/util'
], function (util) {

    var STORE_TYPES = util.key_mirror({
        company: null
    });

    return {
        store_types: STORE_TYPES
    };

});
