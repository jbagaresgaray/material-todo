(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .factory('UserService', UserService);

    UserService.$inject = ['$http', 'CONFIG','$localStorage'];
    function UserService($http, CONFIG,$localStorage) {
        var service = {};
        var currentUser = {};

        service.GetAll = GetAll;
        service.GetById = GetById;
        service.GetByUsername = GetByUsername;
        service.GetByEmail = GetByEmail;
        service.Create = Create;
        service.Update = Update;
        service.Delete = Delete;
        service.UserVerify = UserVerify;
        service.setCurrentUser = setCurrentUser;
        service.getCurrentUser = getCurrentUser;
        service.GetUserAvatar = GetUserAvatar;
        service.DeleteUserAvatar = DeleteUserAvatar;
        service.UpdateUserAvatar = UpdateUserAvatar;

        return service;

        function setCurrentUser(user){
            currentUser = user;
			$localStorage.currentUser = JSON.stringify(user);
        }

        function getCurrentUser(){
			if (!_.isNull(currentUser)) {
			   currentUser = $localStorage.currentUser;
			}
            return currentUser;
        }

        function GetAll() {
            return $http.get(CONFIG.APIHost + 'users').then(handleSuccess, handleError('Error getting all users'));
        }

        function GetById(id) {
            return $http.get(CONFIG.APIHost + 'users/' + id).then(handleSuccess, handleError('Error getting user by id'));
        }

        function GetByUsername(username) {
            return $http.get(CONFIG.APIHost + 'users/' + username).then(handleSuccess, handleError('Error getting user by username'));
        }

        function GetByEmail(email) {
            return $http.get(CONFIG.APIHost + 'users/' + email).then(handleSuccess, handleError('Error getting user by email'));
        }

        function Create(user) {
            return $http.post(CONFIG.APIHost + 'users', user).then(handleSuccess, handleError('Error creating user'));
        }

        function Update(user) {
            console.log(user);
            var update_link = CONFIG.APIHost + 'users/' + user.user_id;
            console.log(update_link);
            return $http.put(update_link, user).then(handleSuccess, handleError('Error updating user'));
        }

        function Delete(id) {
            return $http.delete(CONFIG.APIHost + 'users' + id).then(handleSuccess, handleError('Error deleting user'));
        }

        function UserVerify(evc) {
            return $http.get(CONFIG.APIHost + 'user/verify/' + evc).then(handleSuccess, handleError('Error user verification'));
        }

        function GetUserAvatar(id){
            return $http.get(CONFIG.APIHost + 'files/user_photo/' + id).then(handleSuccess, handleError('Error getting users avatar'));
        }

        function DeleteUserAvatar(filename){
            return $http.delete(CONFIG.APIHost + 'files/' + filename).then(handleSuccess, handleError('Error deleting users avatar'));
        }

        function UpdateUserAvatar(id,files){
            return $http.put(CONFIG.APIHost + 'files/' + id,files).then(handleSuccess, handleError('Error deleting users avatar'));
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
