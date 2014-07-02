require.config({
    baseUrl: '',
    paths: {
        'react': 'bower_components/react/react',
        'domReady': 'bower_components/requirejs-domready/domReady',

        'components': 'js/components'
    }
});

require([
    'react', 'components/HelloApp.react',
    'domReady!'
], function (React, HelloApp) {
    React.renderComponent(
        HelloApp(),
        document.getElementById('sandapp')
    );
});