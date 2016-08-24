(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('UserVerifyController', UserVerifyController);

    UserVerifyController.$inject = ['$location', 'UserService', 'FlashService', '$stateParams', '$scope', '$rootScope', '$sessionStorage', '$state'];
    function UserVerifyController($location, UserService, FlashService, $stateParams, $scope, $rootScope, $sessionStorage, $state) {

        $scope.email_vc = $stateParams.evc;

        UserService.UserVerify($stateParams.evc)
            .then(function (response) {
            	if (isFinite(response.message))
            	{
            		$sessionStorage.UID = parseInt(response.message); 
                    $state.go('setpassword'); 
                    FlashService.Success('Account verification successful.', true);  
            	}
            	else
            	{
            		FlashService.Error(response.message);
            	}
            });
    }

})();