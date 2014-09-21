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
                        var p = when.defer(),
                            callback_res = callback(payload),
                            t = typeof callback_res;


                        if (callback_res && (t === 'object' || t === 'function')
                            && callback_res.then
                            && typeof callback_res.then === 'function') {
                            // callback result is a promise
                            return callback_res;
                        }


                        p.resolve(callback_res);
                        return p;
                    });
                },

                /**
                 * promise_indices: an array of integers corresponding to return values of register()
                 * callback: a function with no arguments that will be called after all jobs are finished
                 *
                 * call using promise style, i.e.
                 *  wait_for(indices, function () { // do things; }).then();
                 */
                wait_for: function (promise_indices, callback) {
                    var selected_promises = _.map(promise_indices, function (index) {
                        return _promises[index];
                    });
                    return when.all(selected_promises).done(callback);
                }
            }
        );

    return Dispatcher;

});
