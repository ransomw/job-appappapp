define([
    'handlebars',
    'bower_components/lodash/dist/lodash.min',
    'js/hbs-helpers',
    'text!views/company-list.hbs',
    'text!views/company-detail.hbs'
], function (
    Handlebars, _, hbs_helpers,
    company_list_t, company_detail_t) {
    "use strict";

    Handlebars.registerHelper('list', hbs_helpers.list);

    var company_list_ct = Handlebars.compile(company_list_t);
    var company_detail_ct = Handlebars.compile(company_detail_t);

    var company_list = function(companies) {
        return company_list_ct({companies: companies});
    };

    var company_detail = function(company) {

        return company_detail_ct(company);

/*
        return [
            '<h2>',
            "company detail view for ",
            company.name,
            '</h2>'
        ].join('');
*/

    };

    return {
        company_list: company_list,
        company_detail: company_detail
    };

});