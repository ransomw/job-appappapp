define([
    'bower_components/lodash/dist/lodash.min'
], function (_) {

    var _get_hash_path = function () {
        var after_hash_tag = window.location.href.split('#')[1],
            split_path;
        if (after_hash_tag === undefined || after_hash_tag == '') {
            return undefined;
        }
        split_path = _.filter(after_hash_tag.split('/'), function (path_part) {
            return path_part !== '';
        });
        return split_path;
    };

    var get_company_id = function () {
        var hash_path = _get_hash_path();
        if (hash_path === undefined) {
            return undefined;
        }
        if (hash_path[0] !== 'company') {
            throw new Error("unexpected element in hash path '" +
                            hash_path[0]);
        }
        return hash_path[1];
    };

    return {
        get_company_id: get_company_id
    };

});