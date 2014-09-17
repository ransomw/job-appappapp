/*global define: true */
/*jslint nomen: true */

define([
    'js/stores/mhoodie',
    'js/dispatcher'
], function (mhoodie, dispatcher) {
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
                get_login_state: function () {
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
                    return mhoodie.account.signUp(username, _password);
                }
            }
        );

    dispatcher.register(function (payload) {
        switch (payload.action) {
        case 'signup':
            alert("signup unimplemented");
            console.log("but got username");
            console.log(payload.data.username);
            break;
        case 'login':
            alert("login unimplemented");
            console.log("but got username");
            console.log(payload.data.username);
            break;
        default:
            return false; // unhandled action
        }
        _account_change_callback();
        return true; // handled action
    });


    return AccountStore;

});
