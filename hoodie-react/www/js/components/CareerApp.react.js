/*global define: false */

define([
    'js/stores/AccountStore',
    'react',
    'components/LoginForm.react',
    'components/AccountStatus.react'
], function (AccountStore, React,
             LoginForm, AccountStatus) {
    "use strict";

    var get_app_state = function () {
        var logged_in,
            username = AccountStore.get_login_state();

        if (username === undefined) {
            logged_in = false;
        } else {
            logged_in = true;
        }

        return {
            logged_in: logged_in,
            username: username
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
                return React.DOM.div(null, [
                    new AccountStatus({key: 'AccountStatus',
                                       username: this.state.username}),
                    React.DOM.h3(null, "logged in view unimplemented")
                    ]);
            },

            _onAccountChange: function () {
                var logged_in_prev = this.state.logged_in,
                    new_app_state = get_app_state();
                this.setState(new_app_state);
            }

        });

    return CareerApp;

});
