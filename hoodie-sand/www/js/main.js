require.config({
    baseUrl: '',
    paths: {
        'hoodie': '_api/_files/hoodie',
        'jquery': 'bower_components/jquery/dist/jquery.min',
        'when': 'bower_components/when'
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
    'js/mhoodie',
    'bower_components/requirejs-domready/domReady!'
], function (mhoodie) {

    mhoodie.sign_in().then(function (sign_in_res) {
        // sign_in_res === _username
        return mhoodie._init_data();
    }, function (err) {
        alert("sign-in error; see console log");
        console.log(err);
        mhoodie._init_ui();
    }).then(function (new_company) {
        // debugger;
        mhoodie._init_ui();
    }, function (err) {
        alert("sign-in error; see console log");
        console.log(err);
        mhoodie._init_ui();
    });

});