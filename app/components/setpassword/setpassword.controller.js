(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('SetPasswordController', SetPasswordController);

    SetPasswordController.$inject = ['$location', 'UserService', 'FlashService', '$state', '$sessionStorage'];
    function SetPasswordController($location, UserService, FlashService, $state, $sessionStorage) {
        var vm = this;

        vm.setpassword = setpassword;

        function setpassword() {
            //vm.user.user_id = parseInt($sessionStorage.UID);
            vm.user.user_id = parseInt('25');
            console.log(vm.user);
            console.log('sulod dre');
            vm.dataLoading = true;
            UserService.Update(vm.user)
            .then(function (response) {
                if (response.message === 'success') {
                    $state.go('updateprofile'); 
                    FlashService.Success('Set password successful.', true);  
                } else {
                    FlashService.Error(response.message);
                    vm.dataLoading = false;
                }
            });
        }
    }

})();