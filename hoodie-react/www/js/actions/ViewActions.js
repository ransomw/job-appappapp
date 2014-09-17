/*global define: false */
/*global alert: false */
/*global console: false */

define([
    'js/constants',
    'js/dispatcher'
], function (CONST, dispatcher) {
    "use strict";

    var signup = function (username) {
        dispatcher.dispatch({
						action: 'signup',
						'data': {username: username}
				});
    },

        login = function (username) {
						dispatcher.dispatch({
								action: 'login',
								'data': {username: username}
						});
        };

    return {
        signup: signup,
        login: login
    };

});
