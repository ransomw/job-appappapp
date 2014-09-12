/*global define: false */
/*global alert: false */

define([
    'react'
], function (React) {
    "use strict";

    var LoginForm = React.createClass({

        on_login_click: function () {
            alert("login unimplemented");
        },

        on_signup_click: function () {
            alert("sign up unimplemented");
        },

        render: function () {
            return React.DOM.div(null, [
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
