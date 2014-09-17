/*global define: true */

/**
 * Split a hoodie instance into stores according to Flux architecture
 * and export all the pieces seperately.
 */
define([
    'hoodie'
], function (Hoodie) {
    "use strict";

    var hoodie = new Hoodie();

    return {
        store: hoodie.store,
        account: hoodie.account
    };

});
