require.config({
    baseUrl: '',
    paths: {
        'hoodie': '_api/_files/hoodie',
        'jquery': 'bower_components/jquery/dist/jquery.min'
    },
    shim: {
        'hoodie': {
            deps: ['jquery'],
            exports: 'Hoodie'
        }
    }
});

require([
    'hoodie',
    'bower_components/requirejs-domready/domReady!'
], function (Hoodie) {

    var hoodie = new Hoodie();
    console.log(hoodie);

});