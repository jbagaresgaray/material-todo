(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('AccountOverviewController', AccountOverviewController);


    AccountOverviewController.$inject = ['$state', 'TokenService', '$rootScope'];

    function AccountOverviewController($state, TokenService, $rootScope) {
        var vm = this;

        vm.editprofile = editprofile;

        function editprofile() {
           $state.go('editprofile');
        }
    }

})();
