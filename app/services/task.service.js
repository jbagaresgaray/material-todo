(function () {
    'use strict';

    angular
        .module('youproductiveApp')
        .factory('TasksService', TasksService);

    TasksService.$inject = ['$q','$rootScope', 'Restangular'];
    function TasksService($q, $rootScope, Restangular) {

        var _tasksService = Restangular.all('tasks');
        var _broadcastType = null;

        var service = {};

        // Restangular methods
        service.list = _list;
        service.get = _get;
        service.getByType = _getByType;
        service.create = _create;
        service.update = _update;
        service.delete = _delete;

        return service;

        // Restangular functions
        function _getByType(type, callback) {
            // POST, GET, PUT, DELETE /v1/tasks/type
            var deferred = $q.defer();
            _tasksService.customGETLIST(type).then(function (response) {
                if (_.isFunction(callback))
                    callback(response);
                deferred.resolve();
            }, function (error) {
                deferred.reject(error);
            });
            return deferred.promise;
        }
        function _list() {
            // GET /v1/tasks
            return _tasksService.getList();
        }
        function _get(id) {
            // GET /v1/tasks/:id
            $rootScope.$broadcast('task.get');
            return _taskService.get(id);
        }
        function _create(task, hasTask) {
            // POST /v1/tasks
            if (!!hasTask)
                _broadcastType = 'subtask.create';
            else
                _broadcastType = 'task.create';
            _tasksService.post(task).then(successHandler, errorHandler);
        }
        function _update(task) {
            // PUT /v1/tasks/:id
            _broadcastType = 'task.update';
            Restangular.all('tasks/' + task.id).customPUT(task).then(successHandler, errorHandler);
        }
        function _delete(task) {
            // DELETE /v1/tasks/:id
            _broadcastType = 'task.delete';
            task.remove().then(successHandler, errorHandler);
        }
        // Restangular handlers
        function successHandler (response) {
            var data = response.task;
            if (_broadcastType == 'task.update' || _broadcastType == 'task.delete')
                data = response.message;
            $rootScope.$broadcast(_broadcastType, data);
        }
        function errorHandler (error) {
            console.log(angular.toJson(error));
            $rootScope.$broadcast('task.error', error);
        }
    }
})();
