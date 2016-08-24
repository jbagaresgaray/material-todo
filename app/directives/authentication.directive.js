(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .directive('username', function() {
        	return {
        		restrict: 'A',
        		controller: function($scope, $sessionStorage) {
        			$scope.username = $sessionStorage.Username;
        		}
        	}
        });

})();

