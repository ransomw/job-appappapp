define([
    'handlebars',
    'bower_components/lodash/dist/lodash.min',
    'js/hbs-helpers',
    'text!views/company-list.hbs'
], function (
    Handlebars, _, hbs_helpers,
    company_list_t) {
    "use strict";

    Handlebars.registerHelper('list', hbs_helpers.list);

    var company_list_ct = Handlebars.compile(company_list_t);

    var company_list = function(companies) {
        return company_list_ct({companies: companies});
    };

    return {
        company_list: company_list
    };

});