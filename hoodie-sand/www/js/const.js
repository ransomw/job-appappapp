define([
    'js/util'
], function (util) {

    var STORE_TYPES = util.key_mirror({
        company: null
    });

    /*
     * interval in milliseconds
     * this value is apparently used by google
http://stackoverflow.com/questions/2161906/handle-url-anchor-change-event-in-js
     */
    var render_interval = 100;

    return {
        store_types: STORE_TYPES,
        render_interval: render_interval

    };

});
