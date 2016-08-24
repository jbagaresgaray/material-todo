(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('VerifyPasswordController', VerifyPasswordController);

    VerifyPasswordController.$inject = ['$location', 'UserService', 'FlashService', '$stateParams', '$scope', '$rootScope', '$sessionStorage', '$state'];
    function VerifyPasswordController($location, UserService, FlashService, $stateParams, $scope, $rootScope, $sessionStorage, $state) {
        var vm = this;
        vm.setpassword = setpassword;
        $rootScope.userVerified = null;

        UserService.UserVerify($stateParams.evc)
            .then(function (response) {
            	if (isFinite(response.message))
            	{
            		$sessionStorage.UID = parseInt(response.message); 
                    $rootScope.userVerified = 1;
            	}
            	else
            	{
                    $rootScope.userVerified = 0;
            	}
            });


        function setpassword() {
            vm.user.user_id = parseInt($sessionStorage.UID);
            vm.dataLoading = true;
            UserService.Update(vm.user)
            .then(function (response) {
                if (response.message === 'success') {
                    $state.go('home'); 
                } else {
                    vm.dataLoading = false;
                }
            });
        }

    }

})();