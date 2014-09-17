/*global define: false */

define([
    'hoodie',
    'react',
    'components/LoginForm.react'
], function (Hoodie, React, LoginForm) {
    "use strict";

    console.log("top of CareerApp module");
    var hoodie = new Hoodie();
    console.log("initialized hoodie");

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
