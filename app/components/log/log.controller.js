(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('LogsController', LogsController);

    LogsController.$inject = ['LogsService', '$location', 'FlashService', '$sessionStorage', '$scope'];
    function LogsController(LogsService, $location, FlashService, $sessionStorage, $scope) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.deleteLog = deleteLog;
        vm.getTemplate = getTemplate;

        getAll();

        function create() {

            //add the user id
            vm.log.user_id = $sessionStorage.UID;

            LogsService.Create(vm.log)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create log successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function getAll(log) {
            LogsService.GetAll()
                .then(function (response) {                   
                    $scope.logs = { logs: response, selected: {} };
                });
        }

        function getTemplate(log) {
            return 'display';
        }

        
        function deleteLog(id) {
            LogsService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete log successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

    }

})();