// in-memory storage

define([
    'lodash',
    'util/merge',
    'js/dispatcher/AppDispatcher',
    'js/constants/Constants',
    'util/event'
], function(_, merge, AppDispatcher, Constants, event) {



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

    var _change_callbacks = [];

    MemStore.prototype.addChangeListener = function (callback) {
        _change_callbacks.push(callback);
    };

    MemStore.prototype.removeChangeListener = function (callback) {
        // TODO XXX
        console.log("***unimplemented***");
        throw new Error("unimplemented");
    };

    MemStore.prototype.emit_change = function () {
        for (var idx in _change_callbacks) {
            _change_callbacks[idx]();
        }
    };

    var mem_store = new MemStore();

    AppDispatcher.register(function (payload) {
        var action = payload.action;

        switch(action.actionType) {
        case 'COMPANY_CREATE':
            create_company(action.info);
            break;
        default:
            return true;
            // throw new Error("unknown action type '" + action.actionType + "'");
        }

        mem_store.emit_change();

        return true;
    });

    /// XXX
    var company_data = [
        {name: 'qunar', visa: true}
    ];
    _.map(company_data, create_company);


    // return MemStore;

    return mem_store;

});