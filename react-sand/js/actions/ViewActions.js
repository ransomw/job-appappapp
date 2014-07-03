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

    return {
        create_company: create_company
    };

});