/*global define: false */
/*global alert: false */
/*global console: false */

define([

], function () {
    "use strict";

    var signup = function (username) {
        alert("signup unimplemented");
        console.log("but got username");
        console.log(username);
    },

        login = function (username) {
            alert("login unimplemented");
            console.log("but got username");
            console.log(username);
        };

    return {
        signup: signup,
        login: login
    };

});
