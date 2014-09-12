/*global define: false */

define([
    'react'
], function (React) {
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
                    return React.DOM.h3(null, "login in view unimplemented");
                }
                return React.DOM.h3(null, "logged in view unimplemented");
            }
        });

    return CareerApp;

});
