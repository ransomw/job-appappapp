require.config({
    baseUrl: '',
    paths: {
        'hoodie': '_api/_files/hoodie',
        'when': 'bower_components/when',
        'lodash': 'bower_components/lodash/dist/lodash.min'
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

require([
    'bower_components/requirejs-domready/domReady!'
], function () {

		console.log("top of main");
});