(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('TagsController', TagsController);

    TagsController.$inject = ['TagsService', '$location', 'FlashService', '$sessionStorage', '$scope', '$timeout'];
    function TagsController(TagsService, $location, FlashService, $sessionStorage, $scope, $timeout) {
        var vm = this;

        vm.create = create;
        vm.getAll = getAll;
        vm.editTag = editTag;
        vm.saveTag = saveTag;
        vm.deleteTag = deleteTag;
        vm.getTemplate = getTemplate;
        vm.reset = reset;
        vm.getAllByUser = getAllByUser;
        vm.tagAdded = tagAdded;

        //getAll(); // call this funtion via ng-init
        //getAllByUser();
        // section methods

        getAllByUser();

        function getAllByUser() {
            TagsService.GetAllTagUnionByUser($sessionStorage.UID)
                .then(function (response) {            
                    $scope.tagssection = response;
                });
        }

        function tagAdded() {
            if ((vm.tagname != 'undefined') || (vm.tagname != '')) {
                $timeout(function () {
                    TagsService.CreateTagIfNotExist(vm.tagname)
                    .then(function (response) {
                        var tagsunion = JSON.stringify({ tag_id: response, associated_id: null, department: 'section_add', user_id: $sessionStorage.UID });
                        
                        var hasMatch = false;
                        angular.forEach($scope.tagssection,function(d){
                            if(d.name === vm.tagname){
                                hasMatch = true;
                                return false;
                            }
                        });

                        if(!hasMatch){
                            $scope.tagssection.unshift({ name : vm.tagname });
                            vm.tagname = "";
                        }

                        TagsService.AddTagUnion(tagsunion)
                        .then(function(response){
                            if(response.message=="success"){
                                //refresh tags
                                if(hasMatch!=true)
                                    getAllByUser();
                            }
                        });
                    });
                }, 0);
            }
        }


        function create() {
            vm.dataLoading = true;

            //add the user id
            vm.tag.user_id = $sessionStorage.UID;

            TagsService.Create(vm.tag)
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Create tag successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

        function getAll(tag) {
            TagsService.GetAll($sessionStorage.UID)
                .then(function (response) {                   
                    $scope.tags = { tags: response, selected: {} };
                });
        }

        function getTemplate(tag) {
            if (tag.id === $scope.tags.selected.id) return 'edit';
            else return 'display';
        }

        function editTag(tag) {
            $scope.tags.selected = angular.copy(tag);
        }

        function saveTag(idx) {
            $scope.tags.tags[idx] = angular.copy($scope.tags.selected);


            TagsService.Update($scope.tags.tags[idx])
                .then(function (response) {
                    if (response.message === 'success') {
                        FlashService.Success('Update tag successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });

            reset();
        }

        function deleteTag(id) {
            TagsService.Delete(id)
                .then(function (response) {                   
                    if (response.message === 'success') {
                        FlashService.Success('Delete tag successful');
                        getAll();
                    } else {
                        FlashService.Error(response.message);
                    }
                });
        }

        function reset() {
            $scope.tags.selected = {};
        }

    }

})();