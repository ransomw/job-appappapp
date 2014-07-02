require.config({
    baseUrl: '',
    paths: {
        'react': 'bower_components/react/react',
        'domReady': 'bower_components/requirejs-domready/domReady',

        'components': 'js/components'
    }
});

require([
    'react', 'components/HelloApp.react', 'components/CompanyList.react',
    'domReady!'
], function (React, HelloApp, CompanyList) {

    var company_data = [
        {name: 'google', visa: true},
        {name: 'qunar', visa: true},
        {name: 'tencent', visa: true}
    ];

    React.renderComponent(
        // HelloApp({name: 'ransom'}),
        CompanyList({all_companies: company_data}),
        document.getElementById('sandapp')
    );
});