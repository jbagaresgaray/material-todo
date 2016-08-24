(function () {
	'use strict';

	angular.module('youproductiveApp').controller('TaskController', TaskController);

	TaskController.$inject = ['$scope', '$stateParams', 'Api2Service'];
	function TaskController($scope, $stateParams, Api2Service) {
		console.log($stateParams);
		Api2Service.show('tasks', $stateParams.id).then(function (response) {
			$scope.task = response.task;
			$scope.task.activeState = 'taskdetails';
			$scope.task.child = {};

			$scope.task.child.taskdetails = true;
			$scope.task.child.subtasks = response.subtasks;
			$scope.task.child.notes = response.notes;
			$scope.task.child.comments = response.comments;
			$scope.task.child.files = response.files;
			$scope.task.child.assigned_users = response.assigned_users;
			$scope.task.child.share = true;
			$scope.task.urlSlug = response.urlSlug;
			$scope.task.child.tags = response.tags;

			console.log($scope.task)

		}, function (error) {
			console.log(error);
		});
	}
})();