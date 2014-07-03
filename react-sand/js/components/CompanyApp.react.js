define([
    'react',
    'stores/MemStore',
    'components/CompanyList.react',
    'components/CompanyForm.react'
], function (React, MemStore, CompanyList, CompanyForm) {
    "use strict";

    var mem_store = new MemStore();

    var get_app_state = function () {
        var companies = mem_store.get_companies();
        return {
            companies: companies
        };
    }

    var CompaniesApp = React.createClass({

        getInitialState: function () {
            return get_app_state();
        },

        render: function () {
            return React.DOM.div(null, [
                CompanyList({all_companies: this.state.companies}),
                CompanyForm(),
            ]);
        }

    });

    return CompaniesApp;

});