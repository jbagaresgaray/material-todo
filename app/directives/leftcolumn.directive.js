(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .directive('hideLeftColumn', ['$rootScope', function($rootScope) {
            return {
                link: function(scope, element) {
                    element.bind('click', function() {
                        var element = document.getElementsByClassName('task-body');
                        var result = angular.element(element);

                        $rootScope.tasksMenuOpen = !$rootScope.tasksMenuOpen;
                        if (!!$rootScope.tasksMenuOpen) {
                            result.removeClass('col-md-10');
                            result.addClass('col-md-8');
                        } else {
                            result.removeClass('col-md-8');
                            result.addClass('col-md-10');
                        }
                        scope.$apply();
                    });
                },
                restrict: 'A'
            };
        }]);
})();
