(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('FoldersController', FoldersController);

    FoldersController.$inject = ['FoldersService', '$location', 'FlashService', '$sessionStorage', '$scope'];
    function FoldersController(FoldersService, $location, FlashService, $sessionStorage, $scope) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.editFolder = editFolder;
        vm.saveFolder = saveFolder;
        vm.deleteFolder = deleteFolder;
        vm.getTemplate = getTemplate;
        vm.reset = reset;

        getAll();

        function create() {
            vm.dataLoading = true;

            //add the user id
            vm.folder.user_id = $sessionStorage.UID;

            FoldersService.Create(vm.folder)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create folder successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function getAll(folder) {
            FoldersService.GetAll($sessionStorage.UID)
                .then(function (response) {                   
                    $scope.folders = { folders: response, selected: {} };
                });
        }

        function getTemplate(folder) {
            if (folder.id === $scope.folders.selected.id) return 'edit';
            else return 'display';
        }

        function editFolder(folder) {
            $scope.folders.selected = angular.copy(folder);
        }

        function saveFolder(idx) {
            $scope.folders.folders[idx] = angular.copy($scope.folders.selected);


            FoldersService.Update($scope.folders.folders[idx])
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Update folder successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });

            reset();
        }

        function deleteFolder(id) {
            FoldersService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete folder successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function reset() {
            $scope.folders.selected = {};
        }

    }

})();