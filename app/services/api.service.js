(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.factory('ApiService', ApiService);

	ApiService.$inject = ['$http', '$q', '$rootScope', 'Restangular', 'CONFIG'];
	function ApiService($http, $q, $rootScope, Restangular, CONFIG) {

		var broadcastType = null;
		var service = {};

		// Collection
		service.collection = {
			userstasks: Restangular.all('userstasks'),
			tasks: Restangular.all('tasks'),
			tags: Restangular.all('tags'),
			tagsunions: Restangular.all('tagsunions'),
			foldersunions: Restangular.all('foldersunions'),
			comments: Restangular.all('comments'),
			notes: Restangular.all('notes'),
			projects: Restangular.all('projects'),
			folders: Restangular.all('folders'),
			logs: Restangular.all('logs'),
			notifications: Restangular.all('notifications'),
			organizations: Restangular.all('organizations')
		};

		// API CRUD methods
		service.list = list;
		service.customList = customList;
		service.show = show;
		service.create = create;
		service.update = update;
		service.remove = remove;

		// Special functions
		service.createTagIfNotExist = createTagIfNotExist;
		service.createFolderIfNotExist = createFolderIfNotExist;
		service.customDelete = customDelete;

		return service;

		// API functions
		function list(route) {
			// GET /v1/route
			return service.collection[route].getList();
		}
		function customList(route, group, id) {
			// GET /v1/route/:group/:id
			return Restangular.all(route + '/' + group)
							.customGETLIST(id);
		}
		function show(route, id) {
			// GET /v1/route/:id
			broadcastType = route + '.show';
			return service.collection[route].get(id);
		}
		function create(route, data) {
			// POST /v1/route/:id
			broadcastType = route + '.create';
			service.collection[route].post(data).then(success, error);
		}
		function update(route, data) {
			// PUT /v1/route/:id
			broadcastType = route + '.update';
			Restangular.all(route + '/' + data.id).customPUT(data).then(success, error);
		}
		function remove(route, data) {
			// DELETE /v1/route/:id
			broadcastType = route + '.delete';
			data.remove().then(success, error);
		}
		// Restangular handlers
		function success (response) {
			$rootScope.$broadcast(broadcastType, response);
		}
		function error (error) {
			console.log(angular.toJson(error));
			$rootScope.$broadcast(service.current + '.error', error);
		}

		// Tags special function
		function createTagIfNotExist (tag) {
			return $http.post(CONFIG.APIHost + 'tagcheck/' + tag);
		}
		// folders special function
		function createFolderIfNotExist (folder) {
			return $http.post(CONFIG.APIHost + 'foldercheck/' + folder);
		}
		// remove this in the future when backend is able to change the route compatible with restangular
		// or maybe check restangular docs for other solution.
		// http delete
		function customDelete (route, o) {
			broadcastType = route + '.delete';
			return $http.delete(CONFIG.APIHost + route + '/' + o.id).then(success, error);
		}
	}
})();