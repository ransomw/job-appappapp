
/**
 * Split a hoodie instance into stores according to Flux architecture
 * and export all the pieces seperately.
 */
define([
    'hoodie',
    'js/dispatcher'
], function (Hoodie, dispatcher) {

    var hoodie = new Hoodie(),
        _password = "password",

        _account_change_callback,

        AccountStore = Object.create(
            {'AccountStore': null},
            {

                add_app_change_listener: function (callback) {
                    _account_change_callback = callback;
                },

                /**
                 * return username of currently logged in user
                 * or undefined if noone is logged in
                 */
                get_login_state: function () {
                    return hoodie.account.username;
                },

                log_in: function (username) {
                    if (username === '') {
                        throw new Error("tried to login empty username");
                    }
                    throw new Error("login unimplemented");
                },

                sign_up: function(username) {
                    if (username === '') {
                        throw new Error("tried to sign up empty username");
                    }
                    return hoodie.account.signUp(username, _password);
                }
            });

    dispatcher.register(function (payload) {
        switch (payload.action) {
        case 'signup':
            break;
        case 'login':
            break;
        default:
            return false; // unhandled action
        }
        _account_change_callback();
        return true; // handled action
    });

    return {
        AccountStore: AccountStore,
        store: hoodie.store
    };

});
