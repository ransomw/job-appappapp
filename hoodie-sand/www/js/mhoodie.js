define([
    'hoodie',
    'jquery',
    'bower_components/lodash/dist/lodash.min',
    'js/const',
    'js/views',
    'js/routes'
], function (Hoodie, $, _, CONST, views, routes) {

    var hoodie = new Hoodie();

    var _$list = $('#company-list');

    var _$detail = $('#company-detail');

    var render_list = function () {
        hoodie.store.findAll(CONST.store_types.company)
            .done(function (companies) {
                _$list.html(views.company_list(companies));
            });
    };

    var render_detail = function (co_id) {
        window.setInterval(function () {
            hoodie.store.find(CONST.store_types.company,
                                    routes.get_company_id())
                .done(function (co_info) {
                    _$detail.html(views.company_detail(co_info));

                    $('#salary-input').on('keypress', function(event) {
                        // ENTER & non-empty.
                        if (event.keyCode === 13 && event.target.value.length) {
                            alert("update salary unimplemented" +
                                  " but got value '" + event.target.value + "'");
                            // event.target.value
                        }});

                });
        }, CONST.render_interval);
    };

    var _username = 'ransom';
    var _password = 'password';

    var _init_data = function () {
        return hoodie.store.removeAll(CONST.store_types.company)
            .then(function (removed_companies) {
                return hoodie.store.add(CONST.store_types.company,
                                              {'name': "去哪理"});
            });
        // .done(function (new_company) {});
    };

    var _init_ui = function () {
        $('#company-input').on('keypress', function(event) {
            // ENTER & non-empty.
            if (event.keyCode === 13 && event.target.value.length) {
                add_company({name: event.target.value})
                    .done(function (company) {
                        render_list();
                    });
                event.target.value = '';
            }
        });
        render_list();
        render_detail();
    };

    var sign_in = function () {
				console.log("called mhoodie.sign_in");
        return hoodie.account.signOut()
            .then(function () {
								console.log("called signOut successfully");
                return hoodie.account.signIn(_username, _password);
            })
            .then(function (sign_in_res) {
								console.log("sign_in returning");
								console.log(sign_in_res);
                return sign_in_res;
            }, function (err) {
								console.log("sign_in error");
								console.log(err);
                if (err.name === "HoodieUnauthorizedError") {
										console.log("signing up for a new account");
                    hoodie.account.signUp(_username, _password)
                        .then(function (sign_up_res) {
														console.log("recursive sign_in call");
                            return sign_in();
                        }, function (err) {
														console.log("error signing up for new account");
                            console.log(err);
                            debugger;
                        });
                } else {
                    console.log(err);
                    debugger;
                }
            });
    };

    var _company_name_exists = function(co_name) {
        return hoodie.store.findAll(CONST.store_types.company)
            .then(function (companies) {
                var named_companies = _.filter(companies, function(co) {
                    return co.name === co_name;
                });
                return named_companies.length > 0;
            });
    };

    // todo: validation
    // - required and optional parameters
    var add_company = function (co_info) {
        return _company_name_exists(co_info.name)
            .then(function (co_name_exists) {
                if (co_name_exists) {
                    alert("company name already exists");
                    return undefined;
                } else {
                    return hoodie.store.add(CONST.store_types.company,
                                                  {name: co_info.name});
                }
            });
    };


    return {
        _init_data: _init_data,
        _init_ui: _init_ui,
        sign_in: sign_in
    };

});
