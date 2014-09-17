/*global define: false */

/*jslint nomen: true */

define([
    'lodash',
    'when'
], function (_, when) {
    "use strict";

    var _callbacks = [],
        _promises = [],
        Dispatcher = Object.create(
            {
                register: function (callback) {
                    _callbacks.push(callback);
                    return _callbacks.length - 1; // index
                },

                dispatch: function (payload) {
                    _promises = _.map(_callbacks, function (callback) {
                        var p = when.defer();
                        p.resolve(callback(payload));
                        return p;
                    });
                },

                /**
                 * promise_indices: an array of integers corresponding to return values of register()
                 * callback: a function with no arguments that will be called after all jobs are finished
                 *
                 * call using promise style, i.e.
                 *  waitFor(indices, function () { // do things; }).then();
                 */
                waitFor: function (promise_indices, callback) {
                    var selected_promises = _.map(promise_indices, function (index) {
                        return _promises[index];
                    });
                    return when.all(selected_promises).then(callback);
                }
            }
        );

    return Dispatcher;

});
