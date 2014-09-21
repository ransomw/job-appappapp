/*global define: true */
/*jslint nomen: true */

define([
    'js/stores/mhoodie',
    'js/dispatcher',
		'js/constants'
], function (mhoodie, dispatcher, CONST) {
    "use strict";

    console.log("top of AccountStore has dispatcher");
    console.log(dispatcher);

    var _password = "password",

        _account_change_callback,

        AccountStore = Object.create(
            {

                add_app_change_listener: function (callback) {
										if (_account_change_callback !== undefined) {
												throw new Error("tried to define app account change listener twice");
										}
                    _account_change_callback = callback;
                },

                /**
                 * return username of currently logged in user
                 * or undefined if noone is logged in
                 */
                get_username: function () {
                    return mhoodie.account.username;
                },

                log_in: function (username) {
                    if (username === '') {
                        throw new Error("tried to login empty username");
                    }
                    throw new Error("login unimplemented");
                },

                sign_up: function (username) {
                    if (username === '') {
                        throw new Error("tried to sign up empty username");
                    }
                    return mhoodie.account.signUp(username, _password)
												.then(function (new_username) {
														console.log("signed up for account with new username");
														console.log(new_username);
														return mhoodie.account.signIn(new_username, _password);
												});
                }
            }
        );

    dispatcher.register(function (payload) {
				var p;
        switch (payload.action) {
        case CONST.action_type.signup:
						p = AccountStore.sign_up(payload.data.username);
            break;
        case CONST.action_type.logout:
            p = mhoodie.account.signOut();
            break;
        case CONST.action_type.login:
            alert("login unimplemented");
            console.log("but got username");
            console.log(payload.data.username);
            break;
        default:
            return false; // unhandled action
        }
				if (p) {
						p.done(function () {
								_account_change_callback();
						});
				} else {
						_account_change_callback();
				}
        return true; // handled action
    });


    return AccountStore;

});
