(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.service('AuthService', AuthService);

	AuthService.$inject = ['$http', '$q', 'TokenService', 'CONFIG'];
	function AuthService($http, $q, TokenService, CONFIG) {

		this.login = function (email, password) {
			var deferred = $q.defer();
			var success = function (response) {
				deferred.resolve(true);
				TokenService.setToken(response.token);
			};
			var error = function (error) {
				console.log('Error => ' + angular.toJson(error));
				deferred.reject(error);
			};
			$http
				.post(CONFIG.APIHost + 'auth/login', {email: email, password: password})
				.success(success)
				.error(error);
			return deferred.promise;
		};
		
		this.logout = function () {
			TokenService.removeToken();
		};
	}
})();