(function() {
    'use strict';

    angular.module('youproductiveApp').controller('AppMenuCtrl', AppMenuCtrl);
    AppMenuCtrl.$inject = ['$scope', '$uibModal', '$log'];

    angular.module('youproductiveApp').controller('ModalInstanceCtrl', ModalInstanceCtrl);
    ModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'items'];

    function AppMenuCtrl($scope, $uibModal, $log) {

        $scope.items = ['Tasks', 'Projects', 'Settings'];

        $scope.animationsEnabled = true;

        $scope.open = function(size) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size,
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {
                $scope.selected = selectedItem;
            }, function() {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.toggleAnimation = function() {
            $scope.animationsEnabled = !$scope.animationsEnabled;
        };
    }

    function ModalInstanceCtrl($scope, $uibModalInstance, items) {

        $scope.items = items;
        $scope.selected = {
            item: $scope.items[0]
        };

        $scope.ok = function() {
            $uibModalInstance.close($scope.selected.item);
        };

        $scope.cancel = function() {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();
