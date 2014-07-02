define([
    'react',
    'lodash'
], function(React, _) {

    var ListItem = React.createClass({
        render: function() {
            return React.DOM.tr(null, [
                React.DOM.td({key: 'name'}, this.props.company.name)
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