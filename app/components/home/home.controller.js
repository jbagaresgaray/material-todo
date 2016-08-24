(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('HomeController', HomeController);


    HomeController.$inject = ['UserService', 'TokenService', '$rootScope', '$timeout', '$state'];

    function HomeController(UserService, TokenService, $rootScope, $timeout, $state) {
        var vm = this;
        vm.user = {};

        $rootScope.logout = logout;

        initController();

        function initController() {
            loadCurrentUser();
        }

        function loadCurrentUser() {
            if (!_.isUndefined($rootScope.localUser)) {
                UserService.GetAll()
                    .then(function(response) {
                        if (response.user_details && response.user_details.length > 0) {
                            vm.user = response.user_details[0];
                            UserService.setCurrentUser(vm.user);
                            $rootScope.globals.currentUser = vm.user;
                        }
                    });
            }
        }

        function logout() {
            console.log('logout');
            TokenService.removeToken();
            UserService.setCurrentUser(null);

            $timeout(function() {
                $state.go('login', null, { reload: true });
            }, 200);
        }
    }

})();
