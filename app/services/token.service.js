(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .service('TokenService', TokenService);

    TokenService.$inject = ['$localStorage'];

    function TokenService($localStorage) {
        var cachedToken;
        var userToken = 'userToken';

        var service = {};

        service.setToken = setToken;
        service.getToken = getToken;
        service.isAuthenticated = isAuthenticated;
        service.removeToken = removeToken;

        return service;

        function setToken(token) {
            cachedToken = token;
            $localStorage.userToken = token;
        }

        function getToken() {
            if (!cachedToken) {
                cachedToken = $localStorage.userToken;
            }
            return cachedToken;
        }

        function isAuthenticated() {
            return !!service.getToken();
        }

        function removeToken() {
            cachedToken = null;
            $localStorage.$reset();
        }
    }
})();
