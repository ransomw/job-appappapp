require.config({
    baseUrl: '',
    paths: {
        'react': 'bower_components/react/react',
        'domReady': 'bower_components/requirejs-domready/domReady',
        'lodash': 'bower_components/lodash/dist/lodash.min',

        'components': 'js/components'
    }
});

require([
    'react',
    'components/HelloApp.react',
    'components/CompanyList.react',
    'components/CompanyForm.react',
    'domReady!'
], function (React, HelloApp, CompanyList, CompanyForm) {

    var company_data = [
        {name: 'google', visa: true},
        {name: 'qunar', visa: true},
        {name: 'tencent', visa: true}
    ];

    React.renderComponent(
        // HelloApp({name: 'ransom'}),
        // CompanyList({all_companies: company_data}),
        CompanyForm(),
        document.getElementById('sandapp')
    );
});