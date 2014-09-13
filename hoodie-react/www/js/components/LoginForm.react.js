/*global define: false */
/*global alert: false */

/*jslint nomen: true */

define([
    'react',
    'actions/ViewActions'
], function (React, actions) {
    "use strict";

    var LoginForm = React.createClass({

        _get_username: function () {
            return this.refs.username.getDOMNode().value.trim();
        },

        on_login_click: function () {
            actions.login(this._get_username());
        },

        on_signup_click: function () {
            actions.signup(this._get_username());
        },

        render: function () {
            return React.DOM.form(null, [
                React.DOM.input({type: 'text',
                                 placeholder: "username",
                                 ref: 'username',
                                 key: 'username'}, {}),
                React.DOM.input({type: 'submit',
                                 value: 'Login',
                                 onClick: this.on_login_click,
                                 key: 'login'}, {}),
                React.DOM.input({type: 'submit',
                                 value: 'Sign Up',
                                 onClick: this.on_signup_click,
                                 key: 'signup'}, {})
            ]);
        }

    });

    return LoginForm;
});
