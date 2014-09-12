/*global define: false */

define([
    'react',
    'components/LoginForm.react'
], function (React, LoginForm) {
    "use strict";

    var get_app_state = function () {
        return {
            logged_in: false
        };
    },

        CareerApp = React.createClass({


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
            }
        });

    return CareerApp;

});
