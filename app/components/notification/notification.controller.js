(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('NotificationsController', NotificationsController);

    NotificationsController.$inject = ['NotificationsService', '$location', 'FlashService', '$sessionStorage', '$scope'];
    function NotificationsController(NotificationsService, $location, FlashService, $sessionStorage, $scope) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.deleteNotification = deleteNotification;
        vm.getTemplate = getTemplate;

        getAll();

        function create() {

            //add the user id
            vm.notification.user_id = $sessionStorage.UID;

            NotificationsService.Create(vm.notification)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create notification successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function getAll(notification) {
            NotificationsService.GetAll()
                .then(function (response) {                   
                    $scope.notifications = { notifications: response, selected: {} };
                });
        }

        function getTemplate(notification) {
            return 'display';
        }

        
        function deleteNotification(id) {
            NotificationsService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete notification successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }
    }

})();