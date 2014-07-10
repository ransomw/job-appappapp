define([
    'react',
    'lodash',
		'actions/ViewActions'
], function(React, _, actions) {

    var ListItem = React.createClass({

        on_sel_click: function (ev) {
            actions.company_select(this.props.company);
        },

        render: function() {
            return React.DOM.tr(null, [
                React.DOM.td({key: 'name'}, [
                    React.DOM.a({
                        onClick: this.on_sel_click
                    }, this.props.company.name)
                ])
            ]);
        }
    });

    var CompanyList = React.createClass({
        render: function() {
            var all_companies = this.props.all_companies;
            var companies = [];

            for (var idx in all_companies) {
                companies.push(ListItem({key: idx, company: all_companies[idx]}));
            }

            return React.DOM.table(null, companies);
        }
    });

    return CompanyList;
});