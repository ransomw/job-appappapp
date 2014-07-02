define([
    'react'
], function(React) {

    var ListItem = React.createClass({
        render: function() {
            return React.DOM.li(null, this.props.company.name);
        }
    });

    var CompanyList = React.createClass({
        render: function() {
            var all_companies = this.props.all_companies;
            var companies = [];

            for (var idx in all_companies) {
                companies.push(ListItem({key: idx, company: all_companies[idx]}));
            }

            return React.DOM.ul(null, companies);
        }
    });

    return CompanyList;
});