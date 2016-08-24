(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('OrganizationsController', OrganizationsController);

    OrganizationsController.$inject = ['OrganizationsService', '$location', 'FlashService', '$sessionStorage', '$scope'];
    function OrganizationsController(OrganizationsService, $location, FlashService, $sessionStorage, $scope) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.editOrganization = editOrganization;
        vm.saveOrganization = saveOrganization;
        vm.deleteOrganization = deleteOrganization;
        vm.getTemplate = getTemplate;
        vm.reset = reset;

        getAll();

        function create() {
            vm.dataLoading = true;

            //add the user id
            vm.organization.user_id = $sessionStorage.UID;

            OrganizationsService.Create(vm.organization)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create organization successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function getAll(organization) {
            OrganizationsService.GetAll()
                .then(function (response) {                   
                    $scope.organizations = { organizations: response, selected: {} };
                });
        }

        function getTemplate(organization) {
            if (organization.id === $scope.organizations.selected.id) return 'edit';
            else return 'display';
        }

        function editOrganization(organization) {
            $scope.organizations.selected = angular.copy(organization);
        }

        function saveOrganization(idx) {
            $scope.organizations.organizations[idx] = angular.copy($scope.organizations.selected);


            OrganizationsService.Update($scope.organizations.organizations[idx])
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Update organization successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });

            reset();
        }

        function deleteOrganization(id) {
            OrganizationsService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete organization successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function reset() {
            $scope.organizations.selected = {};
        }
    }

})();