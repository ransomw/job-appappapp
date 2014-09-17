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
						action: CONST.action_type.signup,
						'data': {username: username}
				});
    },

        login = function (username) {
						dispatcher.dispatch({
								action: CONST.action_type.login,
								'data': {username: username}
						});
        };

    return {
        signup: signup,
        login: login
    };

});
