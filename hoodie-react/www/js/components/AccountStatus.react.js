/*global define: false */

define([
    'react',
    'actions/ViewActions'
], function (React, actions) {
    "use strict";

    var AccountStatus = React.createClass({

        on_logout_click: function () {
            actions.logout();
        },

        render: function () {
            if (!this.props.username) {
                throw new Error("AccountStatus component expects username to be defined");
            }
            return React.DOM.button({onClick: this.on_logout_click}, "logout");
        }
    });

    return AccountStatus;
});
