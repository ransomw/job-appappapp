define([
    'lodash',
    'util/merge',
    'js/dispatcher/Dispatcher'
], function (_, merge, Dispatcher) {

    var AppDispatcher;
    AppDispatcher = merge.merge(Dispatcher.prototype, {

        handleViewAction: function (action) {
            this.dispatch({
                source: 'VIEW_ACTION',
                action: action
            });
        }

    });

    return AppDispatcher;
});
