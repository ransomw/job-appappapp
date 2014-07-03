// in-memory storage

define([
    'lodash',
    'util/merge',
    'js/dispatcher/AppDispatcher',
    'js/constants/Constants',
], function(_, merge, AppDispatcher, Constants) {



    var _companies = {};

    function create_company(info) {
        // Using the current timestamp in place of a real id.
        var id = Date.now();
        _companies[id] = info;
        _companies[id].id = id;
    };

    var MemStore = function () {};

		// MemStore.prototype = merge.merge(MemStore.prototype, {

    //     get_companies: function() {
    //         return _companies;
    //     }

    // });


		MemStore.prototype.get_companies = function() {
        return _companies;
    };

    AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch(action.actionType) {
        case COMPANY_CREATE:
            create_company(action.info);
            break;
        default:
            return true;
            // throw new Error("unknown action type '" + action.actionType + "'");
        }

        return true;
    });

    /// XXX
    var company_data = [
        {name: 'qunar', visa: true}
    ];
    _.map(company_data, create_company);

    return MemStore;

});