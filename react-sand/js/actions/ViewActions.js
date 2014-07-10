define([
    'js/dispatcher/AppDispatcher',
    'js/constants/Constants'
], function (AppDispatcher, Constants) {

    function create_company(info) {
        AppDispatcher.handleViewAction({
            actionType: Constants.COMPANY_CREATE,
            info: info
        });
    };

    function company_select(info) { // CompanyList.ListItem.props.company
        AppDispatcher.handleViewAction({
            actionType: Constants.COMPANY_SELECT,
            info: info
        });
    };

    return {
        create_company: create_company,
        company_select: company_select
    };

});