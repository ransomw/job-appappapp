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
    'bower_components/requirejs-domready/domReady!'
], function (Hoodie, $, _) {


    // note that there is no type-checking to ensure the argument is an Object
    var _key_mirror = function(obj) {
        var ret = {};
        var key;
        for (key in obj) {
            if (!obj.hasOwnProperty(key)) {
                continue;
            }
            ret[key] = key;
        }
        return ret;
    };

    var STORE_TYPES = _key_mirror({
        company: null
    });

    var hoodie = new Hoodie();
    console.log(hoodie);

    var _$list = $('#company-list');
    var render_list = function () {
        hoodie.store.findAll(STORE_TYPES.company)
            .done(function (companies) {
                console.log(companies);
                console.log(
                    _.map(companies, function (co) { return co.name; })
                );
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
        console.log("init_data unimplemented");
        return hoodie.store.removeAll(STORE_TYPES.company)
            .then(function (removed_companies) {
                console.log("removed companies");
                console.log(removed_companies);
                return hoodie.store.add(STORE_TYPES.company, {'name': "去哪理"});
            });
        // .done(function (new_company) {});
    };

    var _init_ui = function () {
        $('#company-input').on('keypress', function(event) {
            // ENTER & non-empty.
            if (event.keyCode === 13 && event.target.value.length) {
                hoodie.store.add(STORE_TYPES.company, {name: event.target.value})
                    .done(function (company) {
                        console.log(company);
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