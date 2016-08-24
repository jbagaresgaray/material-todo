(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('ProjectsController', ProjectsController);

    ProjectsController.$inject = ['ProjectsService', '$location', 'FlashService', '$sessionStorage', '$scope'];
    function ProjectsController(ProjectsService, $location, FlashService, $sessionStorage, $scope) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.editProject = editProject;
        vm.saveProject = saveProject;
        vm.deleteProject = deleteProject;
        vm.getTemplate = getTemplate;
        vm.reset = reset;

        getAll();

        function create() {
            ProjectsService.Create(vm.project)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create project successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function getAll(project) {
            ProjectsService.GetAll()
                .then(function (response) {                   
                    $scope.projects = { projects: response, selected: {} };
                });
        }

        function getTemplate(project) {
            if (project.id === $scope.projects.selected.id) return 'edit';
            else return 'display';
        }

        function editProject(project) {
            $scope.projects.selected = angular.copy(project);
        }

        function saveProject(idx) {
            $scope.projects.projects[idx] = angular.copy($scope.projects.selected);

            ProjectsService.Update($scope.projects.projects[idx])
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Update project successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });

            reset();
        }

        function deleteProject(id) {
            ProjectsService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete project successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function reset() {
            $scope.projects.selected = {};
        }

    }

})();