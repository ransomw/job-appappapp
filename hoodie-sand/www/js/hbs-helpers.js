define([
    'bower_components/lodash/dist/lodash.min'
], function (_) {
    "use strict";

    function h_list(items, options) {
        var out = "<ul>";
        for(var i=0, l=items.length; i<l; i++) {
            _.extend(items[i], {num: i + 1});
            out = out + "<li>" + options.fn(items[i]) + "</li>";
        }
        return out + "</ul>";
    }

    return {
        list: h_list
    };

});