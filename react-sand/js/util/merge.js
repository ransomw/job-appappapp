define([
], function () {

    var mergeInto = function (one, two) {
        if (two != null) {
            for (var key in two) {
                if (!two.hasOwnProperty(key)) {
                    continue;
                }
                one[key] = two[key];
            }
        }
    }

    var merge = function(one, two) {
        var result = {};
        mergeInto(result, one);
        mergeInto(result, two);
        return result;
    };

    return {
        merge: merge
    };

});