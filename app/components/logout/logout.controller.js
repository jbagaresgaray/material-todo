(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$location', 'UserService', 'FlashService', 'AuthenticationService', 
        '$rootScope', '$state', 'AuthorizationService', '$sessionStorage'];
    function LogoutController($location, UserService, FlashService, AuthenticationService, 
            $rootScope, $state, AuthorizationService, $sessionStorage) {
        AuthorizationService.clear();

        //log null on authorize localstorage
        $sessionStorage.Authorize = null;
        $sessionStorage.Username = null;
        $sessionStorage.UID = null;
        $sessionStorage.$reset();
        FlashService.Success('Log out successful', true);
        $location.path('/login');
    }

})();