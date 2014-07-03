define([
    'lodash',
    'util/merge'
], function(_, merge) {
    "use strict";

    var _callbacks = [];
    var _promises = [];

    var Dispatcher = function() {};

    Dispatcher.prototype = merge.merge(Dispatcher.prototype, {

        register: function(callback) {
            _callbacks.push(callback);
            return _callbacks.length - 1; // index
        },

        dispatch: function(payload) {
            var resolves = [];
            var rejects = [];
            _promises = _callbacks.map(function(_, i) {
                return new Promise(function(resolve, reject) {
                    resolves[i] = resolve;
                    rejects[i] = reject;
                });
            });
            // Dispatch to callbacks and resolve/reject promises.
            _callbacks.forEach(function(callback, i) {
                // Callback can return an obj, to resolve, or a promise, to chain.
                // See waitFor() for why this might be useful.
                Promise.resolve(callback(payload)).then(function() {
                    resolves[i](payload);
                }, function() {
                    rejects[i](new Error('Dispatcher callback unsuccessful'));
                });
            });
            _promises = [];
        },

        waitFor: function(/*array*/ promiseIndexes, /*function*/ callback) {
            var selectedPromises = promiseIndexes.map(function(index) {
                return _promises[index];
            });
            return Promise.all(selectedPromises).then(callback);
        }

    });

    return Dispatcher;

});