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
    'jquery',
    'bower_components/lodash/dist/lodash.min',
    'js/const',
    'bower_components/requirejs-domready/domReady!'
], function (Hoodie, $, _, CONST) {

    var hoodie = new Hoodie();

    var _$list = $('#company-list');
    var render_list = function () {
        hoodie.store.findAll(CONST.store_types.company)
            .done(function (companies) {
                _$list.html('');
                _$list.append(
                    _.map(companies, function (co) {
                        return '<li>' + co.name + '</li>';
                    }).join(''));
            });
    };

    var _username = 'ransom';
    var _password = 'password';

    var _init_data = function () {
        return hoodie.store.removeAll(CONST.store_types.company)
            .then(function (removed_companies) {
                return hoodie.store.add(CONST.store_types.company, {'name': "去哪理"});
            });
        // .done(function (new_company) {});
    };

    var _init_ui = function () {
        $('#company-input').on('keypress', function(event) {
            // ENTER & non-empty.
            if (event.keyCode === 13 && event.target.value.length) {
                hoodie.store.add(CONST.store_types.company, {name: event.target.value})
                    .done(function (company) {
                        render_list();
                    });
                event.target.value = '';
            }
        });
        render_list();
    };

    var sign_in = function () {
        return hoodie.account.signOut()
            .then(function () {
                return hoodie.account.signIn(_username, _password);
            })
            .then(function (sign_in_res) {
                console.log("hoodie.account.signIn success")
                return sign_in_res;
            }, function (err) {
                if (err.message === "Name or password is incorrect.") {
                    hoodie.account.signUp(_username, _password)
                        .then(function (sign_up_res) {
                            console.log("hoodie.account.signUp success");
                            return sign_in();
                        }, function (err) {
                            console.log("hoodie.account.signUp error")
                            console.log(err);
                            debugger;
                        });
                } else {
                    console.log("hoodie.account.signIn or .signOut error")
                    console.log(err);
                    debugger;
                }
            });
    };

    sign_in().then(function (sign_in_res) {
        // sign_in_res === _username
        return _init_data();
    }, function (err) {
        alert("sign-in error; see console log");
        console.log(err);
        _init_ui();
    }).then(function (new_company) {
        // debugger;
        _init_ui();
    }, function (err) {
        alert("sign-in error; see console log");
        console.log(err);
        _init_ui();
    });

});