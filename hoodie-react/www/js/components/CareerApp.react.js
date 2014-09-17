/*global define: false */

define([
    'js/stores/AccountStore',
    'react',
    'components/LoginForm.react'
], function (AccountStore, React, LoginForm) {
    "use strict";

    var get_app_state = function () {
        var logged_in;

        if (AccountStore.get_login_state() === undefined) {
            logged_in = false;
        } else {
            logged_in = true;
        }

        return {
            logged_in: logged_in
        };
    },

        CareerApp = React.createClass({

            componentDidMount: function () {
                AccountStore.add_app_change_listener(this._onAccountChange);
            },

            getInitialState: function () {
                return get_app_state();
            },

            render: function () {
                if (!this.state.logged_in) {
                    return React.DOM.div(null, [
                        new LoginForm({key: 'LoginForm'})
                    ]);
                }
                return React.DOM.h3(null, "logged in view unimplemented");
            },

            _onAccountChange: function () {
                var logged_in_prev = this.state.logged_in,
                    new_app_state = get_app_state();
                this.setState(new_app_state);
            }

        });

    return CareerApp;

});
