require.config({
    baseUrl: '',
    waitSeconds: 30,
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
    'react',
    'components/CareerApp.react',
    'bower_components/requirejs-domready/domReady!'
], function (React, CareerApp) {
    "use strict";

    console.log("top of main");

    React.renderComponent(
        new CareerApp({key: 'CareerApp'}),
        document.getElementById('app')
    );
    console.log("called top-level render component");
});
