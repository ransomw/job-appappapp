define([
    'react',
    'stores/MemStore',
    'components/CompanyList.react',
    'components/CompanyForm.react',
    'components/CompanyDetail.react'
], function (React, mem_store /*MemStore*/, CompanyList, CompanyForm, CompanyDetail) {
    "use strict";

    // var mem_store = new MemStore();

    var get_app_state = function () {
        var companies = mem_store.get_companies();
        var curr_company = mem_store.get_curr_company();
        return {
            companies: companies,
            curr_company: curr_company
        };
    };

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
            if (this.state.curr_company === undefined) {
                return React.DOM.div(null, [
                    CompanyList({key: 'CompanyList',
                                 all_companies: this.state.companies}),
                    CompanyForm({key: 'CompanyForm'})
                ]);
            } else {
                return React.DOM.div(null, [
                    CompanyList({key: 'CompanyList',
                                 all_companies: this.state.companies}),
                    CompanyForm({key: 'CompanyForm'}),
                    CompanyDetail({key: 'CompanyDetail',
                                   company: {name: this.state.curr_company}})
                ]);
            }
        },

        _onChange: function() {
            this.setState(get_app_state());
        }

    });

    return CompaniesApp;

});