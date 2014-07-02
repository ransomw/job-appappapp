define([
    'react'
], function(React) {
    var App = React.createClass({
        render: function() {
            return React.DOM.p(null, "hello " + this.props.name);
        }
    });

    return App;
});