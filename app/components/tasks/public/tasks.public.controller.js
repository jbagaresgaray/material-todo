(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.controller('PublicController', PublicController);

	PublicController.$inject = ['$stateParams', '$http', 'CONFIG', '$filter'];
	function PublicController($stateParams, $http, CONFIG, $filter) {

		var vm = this;

		var PublicController = {
			init: function () {
				vm.taskgroup = {};
				vm.taskgroup.inbox = [];

				vm.activeState = 'inbox';
			},
			regroup: function (collection) {

				console.log(collection);

				var task = collection.task;

				task.created_at = $filter('date')(new Date(task.created_at), "dd MMM yy");
				task.activeState = 'taskdetails';

				task.child = {};
				task.child.taskdetails = true;
				task.child.subtasks = collection.subtasks;
				task.child.notes = collection.notes;
				task.child.comments = collection.comments;
				task.child.files = collection.files;
				task.child.assigned_users = collection.assigned_users;
				task.child.share = true;
				task.urlSlug = collection.urlSlug;
				task.child.tags = collection.tags;

				vm.taskgroup.inbox.push(task);
				return task;
			}
		};
		PublicController.init();

		// TODO: refactor later
		var slug = $stateParams.link;
		$http
			.get(CONFIG.APIHost + 'urlshorts/' + slug)
			.success(function (response) {
				console.log(response);
				if (!!response.task) {
					vm.type = 'tasks';
					PublicController.regroup(response);
				} else {
					vm.type = 'files';
					vm.files = response;
				}
			})
			.error(function (error) {
				console.log(error);
			});
	}
})();