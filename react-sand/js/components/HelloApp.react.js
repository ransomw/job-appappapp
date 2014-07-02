define([
    'react'
], function(React) {
    var App = React.createClass({
        render: function() {
          return React.DOM.p(null, "hello world");
        }
      });

    return App;
});