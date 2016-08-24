(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['$rootScope', '$timeout', '$state', 'AuthService', 'FlashService', 'UserService'];

    function LoginController($rootScope, $timeout, $state, AuthService, FlashService, UserService) {
        var vm = this;

        vm.login = login;



        function login() {
            AuthService
                .login(vm.email, vm.password)
                .then(function(isSuccess) {
                    if (isSuccess) {
                        FlashService.barSlideTop('Login successfully');

                        UserService.GetAll()
                            .then(function(response) {
                                if (response.user_details && response.user_details.length > 0) {
                                    vm.user = response.user_details[0];
                                    UserService.setCurrentUser(vm.user);
                                    $rootScope.globals.currentUser = vm.user;
                                }
                            });

                        $timeout(function() {
                            $state.go('tasks');
                        }, 1200);
                    } else {
                        FlashService.barSlideTop(isSuccess.message, 'warning');
                        vm.dataLoading = false;
                    }
                }, function(err) {
                    var error = err.error;
                    FlashService.barSlideTop(error.message, 'error');
                });
        }
    }

})();
