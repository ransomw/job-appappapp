define([
    'react',
    'stores/MemStore',
    'components/CompanyList.react',
    'components/CompanyForm.react'
], function (React, mem_store /*MemStore*/, CompanyList, CompanyForm) {
    "use strict";

    // var mem_store = new MemStore();

    var get_app_state = function () {
        var companies = mem_store.get_companies();
        return {
            companies: companies
        };
    }

    var CompaniesApp = React.createClass({

        componentDidMount: function() {
            mem_store.addChangeListener(this._onChange);
        },

        componentWillUnmount: function() {
            mem_store.removeChangeListener(this._onChange);
        },

        getInitialState: function () {
            return get_app_state();
        },

        render: function () {
            return React.DOM.div(null, [
                CompanyList({all_companies: this.state.companies}),
                CompanyForm(),
            ]);
        },

        _onChange: function() {
            this.setState(get_app_state());
        }

    });

    return CompaniesApp;

});