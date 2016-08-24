(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .directive('toggleClass', function() {
          return {
              restrict: 'A',
              link: function(scope, elem, attrs) {

                var currentState = true;

                elem.on("click", function() {
                  if(currentState === true) {
                    angular.element(elem).removeClass(attrs.downIcon);
                    angular.element(elem).addClass(attrs.upIcon);
                  } else {
                    angular.element(elem).removeClass(attrs.upIcon);
                    angular.element(elem).addClass(attrs.downIcon);
                  }
                  
                  currentState = !currentState;
                });

              }
            };
        });
    
})();