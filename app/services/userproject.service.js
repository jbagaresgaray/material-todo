(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .factory('UserProjectsService', UserProjectsService);

    UserProjectsService.$inject = ['$http', '$sessionStorage', 'CONFIG'];
    function UserProjectsService($http, $sessionStorage, CONFIG) {
        var service = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUser = GetByUser;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;

        return service;

        function GetAll() {
            return $http.get(CONFIG.APIHost + 'userproject').then(handleSuccess, handleError('Error getting all userprojects'));
        }

        function GetById(id) {
            return $http.get(CONFIG.APIHost + 'userproject/' + id).then(handleSuccess, handleError('Error getting userprojects by id'));
        }

        function GetByUser(id) {
            return $http.get(CONFIG.APIHost + 'userproject' + id).then(handleSuccess, handleError('Error getting userproject by user'));
        }

        function Create(userproject) {
            return $http.post(CONFIG.APIHost + 'userproject', userproject).then(handleSuccess, handleError('Error creating userproject'));
        }

        function Update(userproject) {
            return $http.post(CONFIG.APIHost + 'userproject/' + userproject.id, userproject).then(handleSuccess, handleError('Error updating userproject'));
        }

        function Delete(id) {
            return $http.delete(CONFIG.APIHost + 'userproject/' + id).then(handleSuccess, handleError('Error deleting userproject'));
        }

        // private functions
        function handleSuccess(res) {
            return res.data;
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }


})();
