require.config({
    baseUrl: '',
    // waitSeconds: 14,
    paths: {
        'react': 'bower_components/react/react',
        'hoodie': '_api/_files/hoodie',
        'when': 'bower_components/when',
        'lodash': 'bower_components/lodash/dist/lodash.min',
        'jquery': 'bower_components/jquery/dist/jquery.min',

        'components': 'js/components',
        'actions': 'js/actions'
    },
    packages: [
        {name: 'when', path: 'bower_components/when', main: 'when'}
    ],
    shim: {
        'hoodie': {
            deps: ['jquery'],
            exports: 'Hoodie'
        }
    }
});

/*global document: false */

require([
    'hoodie',
    'react',
    'components/CareerApp.react',
    'bower_components/requirejs-domready/domReady!'
], function (Hoodie, React, CareerApp) {
    "use strict";

    console.log("top of main");

    var hoodie = new Hoodie();
    console.log("initialized hoodie");

    React.renderComponent(
        new CareerApp({key: 'CareerApp'}),
        document.getElementById('app')
    );
    console.log("called top-level render component");
});
