(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['UserService', '$location', 'FlashService'];
    function RegisterController(UserService, $location, FlashService) {
        var vm = this;

        vm.register = register;

        function register() {
            vm.dataLoading = true;
            console.log(vm.user);
            UserService.Create(vm.user)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.barSlideTop('Registration successful');
                        $location.path('/login');
                    } else {
                        FlashService.barSlideTop(response.message);

                        vm.dataLoading = false;
                    }
                });
        }
    }

})();