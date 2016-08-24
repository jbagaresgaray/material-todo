(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.factory('Api2Service', Api2Service);

	Api2Service.$inject = ['CONFIG', '$resource', '$rootScope', '$http'];
	function Api2Service(CONFIG, $resource, $rootScope, $http) {

		var broadcast;
		var r;
		var service = {};
		var methods = {
			save: {method: 'POST'},
			query: {method: 'GET', isArray: true},
			get: {method: 'GET', isArray: false},
			get2: {method: 'GET', isArray: true},
			update: {method: 'PUT'},
			destroy: {method: 'DELETE'}
		};
		var collection = {
			tasks: CONFIG.APIHost + 'tasks/:id',
			tags: CONFIG.APIHost + 'tags/:id',
			tagsunions: CONFIG.APIHost + 'tagsunions/:department/:id',
			foldersunions: CONFIG.APIHost + 'foldersunions/:department/:id',
			comments: CONFIG.APIHost + 'comments/:id',
			files: CONFIG.APIHost + 'files/:department/:id',
			notes: CONFIG.APIHost + 'notes/:id',
			folders: CONFIG.APIHost + 'folders/:id'
		};
		var resource = {
			tasks: $resource(collection.tasks, {id: '@id'}, methods),
			tags: $resource(collection.tags, {id: '@id'}, methods),
			tagsunions: $resource(collection.tagsunions, {type: '@department', id: '@id'}, methods),
			foldersunions: $resource(collection.foldersunions, {department: '@department', id: '@id'}, methods),
			comments: $resource(collection.comments, {id: '@id'}, methods),
			files: $resource(collection.files, {department: '@department', id: '@id'}, methods),
			notes: $resource(collection.notes, {id: '@id'}, methods),
			folders: $resource(collection.folders, {id: '@id'}, methods)
		};

		service.save = save;
		service.check = check;
		service.custom = custom;
		service.custom2 = custom2;
		service.list = list;
		service.show = show;
		service.destroy = destroy;

		return service;

		function save(route, data, type) {
			r = route;
			if (!!data.id) {
				broadcast = r + '.update';
				resource[route].update({id: data.id}, data, onSuccess, onError);
			} else {
				if (type === 'subtasks')
					r = type;
				broadcast = r + '.create';
				resource[route].save(data, onSuccess, onError);
			}
		}
		function check(route, name) {
			broadcast = route + '.check';
			return $http.post(CONFIG.APIHost + route + '/' + name);
		}
		function custom(route, params) {
			return resource[route].get({department: params.department, id: params.id}).$promise;
		}
		function custom2(route, params) {
			return resource[route].get2({department: params.department, id: params.id}).$promise;
		}
		function list(route) {
			return resource[route].query().$promise;
		}
		function show(route, id) {
			return resource[route].get({id: id}).$promise;
		}
		function destroy(route, id, isSubtask) {
			if (!!isSubtask)
				r = 'subtasks';
			else
				r = route;
			broadcast = r + '.destroy';
			resource[route].destroy({id: id}, onSuccess, onError);
		}
		function onSuccess(data) {
			$rootScope.$broadcast(broadcast, data);
		}
		function onError(error) {
			var response = {
				error: error,
				broadcast: broadcast
			};
			console.log('Error: ', angular.toJson(error));
			$rootScope.$broadcast(r + '.error', response);
		}
	}
})();