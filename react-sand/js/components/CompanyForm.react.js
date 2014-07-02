define([
    'react',
    'lodash'
], function(React, _) {


    var CompanyForm = React.createClass({

        on_save_click: function(event) {
            var company_name = this.refs.name.getDOMNode().value.trim();
            alert("clicked save with company name '" + company_name + "'");
        },


        render: function() {
            return React.DOM.div(null, [
                React.DOM.input({type: 'text', placeholder: "company name", ref: 'name'}, {}),
                React.DOM.input({type: 'submit', value: 'Save', onClick: this.on_save_click}, {})
            ]);
        }
    });

    return CompanyForm;
});