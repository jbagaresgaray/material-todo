(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('TasksController', TasksController);

    TasksController.$inject = ['$window', 'SocketService', '$mdpDatePicker', '$mdpTimePicker', '$uibModal', '$rootScope', 'Api2Service', '$location', '$state', 'Restangular', '$timeout', 'ApiService', 'TasksService', 'FlashService', '$scope', '$http', '$q', '$filter', '_', 'dt', 'CONFIG', 'Upload'];

    function TasksController($window, SocketService, $mdpDatePicker, $mdpTimePicker, $uibModal, $rootScope, Api2Service, $location, $state, Restangular, $timeout, ApiService, TasksService, FlashService, $scope, $http, $q, $filter, _, dt, CONFIG, Upload) {
        var vm = this;

        vm.createTask = createTask; //
        vm.updateTask = updateTask; //
        vm.deleteTask = deleteTask; //
        vm.activeSubTab = activeSubTab; //
        vm.taskLoadChildSection = taskLoadChildSection;
        vm.changeState = changeState;
        vm.changeToTime = changeToTime;
        vm.changeToDate = changeToDate;
        vm.dateSelection = dateSelection;
        vm.chatDate = chatDate;
        vm.downloadFile = downloadFile;
        vm.commentDetails = commentDetails;
        vm.hasCreateTaskProperty = hasCreateTaskProperty;
        vm.showDatePicker = showDatePicker;
        vm.showTimePicker = showTimePicker;

        vm.noteCommand = noteCommand;

        vm.openStatuses = openStatuses;
        vm.addTag = addTag; //
        vm.deleteTag = deleteTag; //
        vm.loadTags = loadTags; //

        vm.createComment = createComment;
        vm.updateComment = updateComment;
        vm.deleteComment = deleteComment;

        vm.saveNote = saveNote;
        vm.deleteNote = deleteNote;

        vm.saveFolder = saveFolder;

        vm.assignUserTask = assignUserTask;
        vm.generateLink = generateLink;

        vm.deleteFile = deleteFile;

        $rootScope.notifications = 0; // temporary;

        // Use $scope for taskGroup and taskLists because vm
        // is not compatible with ui-tabs

        //$scope.taskGroup = [];
        //$scope.taskLists = dt.lists.task;


        /**
         * @object
         * @description
         * Initialize view models, load tasks and re-group
         */
        var TaskController = {
            init: function() {
                vm.priorityOptions = dt.options.priority;
                vm.repeats = {
                    repeat: dt.repeat,
                    from: dt.repeat_from
                };
                vm.isRequesting = true;
                vm.task = {};
                vm.create_task = {};
                vm.subtask = {};
                vm.comment = {};
                vm.folder = {};
                vm.folders = {};
                vm.slug = {};

                vm.taskEntryMode = false;

                vm.taskgroup = {};
                vm.taskgroup.inbox = [];
                vm.taskgroup.starred = [];
                vm.taskgroup.priorities = [];
                vm.taskgroup.duedate = [];
                vm.taskgroup.recentlyadded = [];
                vm.taskgroup.completed = [];

                vm.active = dt.active;
                vm.activeState = 'inbox';

                this.load();
            },
            regroup: function(collection) {

                var task = collection.task;

                console.log('regroup', collection);

                task.created_at = task.created_at ? $filter('date')(new Date(task.created_at), "dd MMM yy") : null;
                task.start_date = task.start_date ? new Date(task.start_date) : null;
                task.end_date = task.end_date ? new Date(task.end_date) : null;
                task.activeState = 'taskdetails';

                console.log(collection);

                task.child = {};
                task.child.taskdetails = true;
                task.child.subtasks = collection.subtasks;
                task.child.notes = collection.notes.length > 0 ? collection.notes[0] : {};
                task.child.comments = collection.comments;

                task.child.comments = _.map(task.child.comments, function (comment) {
                    //comment.created_at = moment(comment.created_at).format();
                    comment.fromNow = moment(comment.created_at).fromNow();
                    comment.isEdit = false;
                    return comment;
                });

                task.child.files = collection.files;
                task.child.assigned_users = collection.assigned_users;
                task.child.share = true;

                if (!_.isEmpty(collection.urlSlug))
                    collection.urlSlug[0].slug = CONFIG.Local + collection.urlSlug[0].slug;

                task.child.urlSlug = collection.urlSlug;
                task.child.tags = collection.tags;

                // inbox
                if (!task.starred &&
                    !task.priority &&
                    !task.start_date &&
                    !task.end_date &&
                    !task.is_complete)
                    vm.taskgroup.inbox.push(task);

                // starred
                if (!!task.starred)
                    vm.taskgroup.starred.push(task);

                // priorities
                if (!!task.priority)
                    vm.taskgroup.priorities.push(task);

                // due date
                if (!!task.start_date ||
                    !!task.end_date ||
                    !!task.completion_date) {
                    vm.taskgroup.duedate.push(task);
                }

                // completed
                if (!!task.is_complete)
                    vm.taskgroup.completed.push(task);

                //Api2Service.custom('tagsunions', {department: 'tasks', id: task.id}).then(function (response) {
                //    task.child.tags = response;
                //});

                return task;
            },
            load: function() {
                var self = this;

                var onSuccess = function (response) {
                    console.log('all tasks', response);
                    _.each(response, self.regroup);
                    vm.isRequesting = false;
                    console.log(vm.taskgroup);
                    $http
                        .get(CONFIG.APIHost + 'foldersuser')
                        .success(function(response) {
                            console.log(vm.folders);
                            vm.folders = response;
                        })
                        .error(function(error) {
                            console.log(error);
                        });
                };
                var onError = function(error) {
                    console.log('Error: ', angular.toJson(error));
                    vm.isRequesting = false;
                };

                Api2Service.list('tasks').then(onSuccess, onError);
            }
        };
        TaskController.init();

        SocketService.on("server-updates:App\\Events\\ServerUpdated", function(response) {

            console.log(response);

            var resource = response.resource;

            switch (resource) {
                case 'tasks':

                    break;
                case 'comments':
                    if (!!response.data) {

                        if (_.isEmpty(vm.task)) {

                            _.each(vm.taskgroup, function(tasks, group) {
                                _.each(tasks, function(task, idx) {
                                    if (task.id == response.data.task_id) {
                                        //response.data.created_at = moment(response.data.created_at);
                                        response.data.fromNow = moment(response.data.created_at).fromNow();
                                        vm.taskgroup[group][idx].child.comments.push(response.data);
                                    }
                                });
                            });
                            $rootScope.notifications = $rootScope.notifications + 1;
                        } else {
                            FlashService.otherThumbslider('Comment created successfully. . .', '', false, 1500);
                            vm.isRequesting = false;
                            vm.comment = {};

                            vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                                if (task.id == vm.task.id) {
                                    task.child.comments = _.map(task.child.comments, function(comment) {
                                        if (_.isUndefined(comment.id)) {
                                            comment = response.data;
                                            //comment.created_at = moment(comment);
                                            comment.fromNow = moment(comment.created_at).fromNow();
                                        }
                                        return comment;
                                    });
                                }
                                vm.task = {};
                                return task;
                            });
                        }
                    }

                    break;
            }
        });


        $scope.$watch(function() {
            return document.getElementById('toast-container');
        }, function() {
            var notif = document.getElementById('toast-container');
            var scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
            if (notif) {
                if (scrollPos >= 50) {
                    notif.style.setProperty('top', '12px', 'important');
                } else if ($scope.scrollPos < 50) {
                    notif.style.setProperty('top', '65px', 'important');
                }
            }
        });

        $window.onscroll = function() {
            $scope.scrollPos = document.body.scrollTop || document.documentElement.scrollTop || 0;
            var notif = document.getElementById('toast-container');
            if (notif) {
                if ($scope.scrollPos >= 50) {
                    notif.style.setProperty('top', '12px', 'important');
                } else if ($scope.scrollPos < 50) {
                    notif.style.setProperty('top', '65px', 'important');
                }
            }
            $scope.$apply(); //or simply $scope.$digest();
        };


        // tasks events
        $scope.$on('tasks.create', function(event, response) {
            FlashService.otherThumbslider('Task created successfully. . .', '', false, 1500);

            console.log('newly created task', response);

            if (!!response.task) {
                vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                    if (!task.id)
                        task = TaskController.regroup(response);
                    return task;
                });
            }

            vm.isRequesting = false;
            vm.task = {};
            vm.create_task.name = null;
        });
        $scope.$on('tasks.update', function(event, response) {
            FlashService.otherThumbslider('Task updated successfully. . .', '', false, 1500);
            vm.isRequesting = false;

            if (vm.task.property == 'starred') {
                delete vm.task.property;
                vm.taskgroup[vm.activeState] = _.without(vm.taskgroup[vm.activeState], vm.task);
                if (vm.activeState != 'starred')
                    vm.taskgroup.starred.push(vm.task);
                else
                    vm.taskgroup.inbox.push(vm.task);
            }
        });
        $scope.$on('tasks.destroy', function(event, response) {
            FlashService.otherThumbslider('Task deleted successfully. . .', '', false, 1500);

            _.each(vm.taskgroup, function(tasks, group) {
                _.each(tasks, function(task) {
                    if (task.id == vm.task.id) {
                        vm.taskgroup[group] = _.without(vm.taskgroup[group], vm.task);
                    }
                });
            });

            //if (!!vm.task.isSubtask)
            //    vm.taskgroup[vm.activeState].subtasks = _.without(vm.taskgroup[vm.activeState].subtasks, vm.task);
            //else
            //    vm.taskgroup[vm.activeState] = _.without(vm.taskgroup[vm.activeState], vm.task);

            vm.isRequesting = false;
            vm.task = {};
        });
        $scope.$on('tasks.error', function(event, response) {
            FlashService.otherThumbslider('Something went wrong, creating task failed. . .', 'error', false, 1500);

            // if something went wrong then remove pending task
            if (response.broadcast == 'tasks.create')
                vm.taskgroup.inbox = _.without(vm.taskgroup.inbox, vm.task);

            vm.isRequesting = false;
            vm.task = {};
        });



        // subtasks events
        $scope.$on('subtasks.create', function(event, response) {
            console.log(response);
            FlashService.otherThumbslider('Subtask added successfully', '');

            if (!!response.task) {
                vm.taskgroup[vm.activeState][0].child.subtasks = _.map(vm.taskgroup[vm.activeState][0].child.subtasks, function(subtask) {
                    if (!subtask.id)
                        subtask = response.task;
                    return subtask;
                });
            }

            vm.isRequesting = false;
            vm.task = vm.subtask = {};
        });
        $scope.$on('subtasks.destroy', function(event, response) {
            vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {

                _.each(task.child.subtasks, function(subtask) {
                    if (subtask.id == vm.task.id) {
                        task.child.subtasks = _.without(task.child.subtasks, vm.task);
                    }
                });
                return task;
            });
            vm.task = {};
            vm.isRequesting = false;
        });
        $scope.$on('subtasks.error', function(event, response) {
            FlashService.otherThumbslider('Something went wrong, creating task failed. . .', 'error', false, 1500);

            // if something went wrong then remove pending subtasks
            if (response.broadcast == 'subtasks.create') {
                var sliced = _.without(vm.task.child.subtasks, vm.subtask);
                vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                    if (task.id == vm.task.id)
                        task.child.subtasks = sliced;
                    return task;
                });
            }

            vm.isRequesting = false;
            vm.task = vm.subtask = {};
        });



        // notes events
        $scope.$on('notes.create', function(event, response) {
            if (!!response.data) {
                vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                    if (task.id == vm.task.id) {
                        task.child.notes = response.data;
                    }
                    return task;
                });
            }
            vm.task = {};
        });
        $scope.$on('notes.update', function(event, response) {
            vm.isRequesting = false;
        });
        $scope.$on('notes.destroy', function(event, response) {
            FlashService.otherThumbslider(response.message, '', false, 1500);

            vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                if (task.id == vm.task.id) {
                    task.child.notes = _.without(task.child.notes, vm.note);
                }
                return task;
            });

            vm.isAdding = vm.isRequesting = false;
            vm.task = vm.note = {};
        });



        // comments events
        //$scope.$on('comments.create', function (event, response) {
        //    FlashService.otherThumbslider('Comment created successfully. . .','', false, 1500);
        //    vm.isRequesting = false;
        //    vm.comment = {};
        //});

        $scope.$on('comments.destroy', function(event, response) {
            FlashService.otherThumbslider(response.message, '', false, 1500);
            vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {

                if (task.id == vm.task.id)
                    task.child.comments = _.without(task.child.comments, vm.comment);

                return task;
            });
            vm.isRequesting = false;
            vm.task = vm.comment = {};
        });
        $scope.$on('comments.update', function(event, response) {
            console.log(response);
            vm.isRequesting = false;
        });
        $scope.$on('comments.error', function(event, response) {
            FlashService.otherThumbslider('Something went wrong, creating comment failed. . .', 'error', false, 1500);

            if (response.broadcast == 'comments.create') {
                var sliced = _.without(vm.task.child.comments, vm.comment);
                vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {
                    if (task.id == vm.task.id)
                        task.child.comments = sliced;
                    return task;
                });
            }

            vm.comment = vm.task = {};
            vm.isRequesting = false;
        });



        $scope.$on('files.destroy', function(event, response) {

            console.log('files', response);

            FlashService.otherThumbslider(response.message, '', false, 1500);
            vm.taskgroup[vm.activeState] = _.map(vm.taskgroup[vm.activeState], function(task) {

                if (task.id == vm.task.id)
                    task.child.files = _.without(task.child.files, vm.file);

                return task;
            });
            vm.isRequesting = false;
            vm.task = vm.files = {};
        });



        // tags events
        $scope.$on('tagsunions.create', function(event, response) {
            console.log(response);
            vm.isRequesting = false;
        });
        $scope.$on('tagsunions.delete', function(event, response) {
            console.log(response);
            vm.isRequesting = false;
        });
        $scope.$on('tags.delete', function(event, response) {
            console.log(response);
            FlashService.otherThumbslider('Tag deleted successfully. . .', '', false, 1500);
            vm.isRequesting = false;
        });



        // folders events
        $scope.$on('foldersunions.create', function(event, response) {
            console.log(response);

            $http
                .get(CONFIG.APIHost + 'foldersuser')
                .success(function(response) {
                    vm.folders = response;
                })
                .error(function(error) {
                    console.log(error);
                });

            vm.isRequesting = false;
        });



        // tasks crud functions
        function createTask(task) {

            // notify user
            FlashService.otherThumbslider('Task is currently pending. . .', '', false, 1500);

            wait();

            // if task param has a value then user is creating a subtask
            if (!!task) {
                vm.subtask.parent_task_id = task.id;
                Api2Service.save('tasks', vm.subtask, 'subtasks');

                //vm.subtask.created_at = $filter('date')(Date.now(), "dd MMM yy");
                task.child.subtasks.push(vm.subtask);
                vm.task = task;
            } else {
                vm.task = vm.create_task;

                Api2Service.save('tasks', vm.task);
                vm.task.created_at = $filter('date')(Date.now(), "dd MMM yy");
                vm.taskgroup.inbox.push(vm.task);
                vm.activeState = 'inbox';
            }
            // set requesting
            vm.isRequesting = true;
        }

        function updateTask(task, property, option) {
            FlashService.otherThumbslider('Updating task...', '', false, 1500);

            wait();
            // determine if property is starred or status
            switch (property) {
                case 'is_complete':
                    task[property] = !task[property];
                    break;
                case 'starred':
                    task[property] = !task[property];
                    break;
            }

            if (!!option && property === 'priorities')
                task['priority'] = option;

            vm.task = task;
            vm.task.property = property;

            // update task
            Api2Service.save('tasks', task);

            vm.isRequesting = true;
        }

        function deleteTask(task, subtask) {
            vm.task = subtask ? subtask : task;

            console.log(vm.task);

            if (!!subtask)
                vm.task.isSubtask = true;

            Api2Service.destroy('tasks', vm.task.id, vm.task.isSubtask);

            // notify user
            FlashService.otherThumbslider('Deleting task. . .', '', false, 1500);

            vm.isRequesting = true;
        }



        // notes crud functions
        function saveNote(task) {
            if (!task.child.notes.id) {

                task.child.notes.type = 'tasks';
                task.child.notes.associated_id = task.id;
                vm.task = task;

                Api2Service.save('notes', task.child.notes);
            } else // update note
                Api2Service.save('notes', task.child.notes);
        }

        function deleteNote(task) {
            if (!!vm.note.id) {
                vm.task = task;
                Api2Service.destroy('notes', vm.note.id);
            }
            vm.isRequesting = true;
        }

        function noteCommand(action, value) {
            angular.element(document).ready(function() {
                console.log('here');
                document.execCommand(action, false, value);
            });
        }



        // comments crud functions
        function createComment(task) {

            vm.comment.task_id = task.id;
            vm.comment.type = 'tasks';
            vm.comment.user_id = $rootScope.globals.currentUser.user_id;

            Api2Service.save('comments', vm.comment);

            vm.comment.created_at = moment(Date.now()).tz($rootScope.globals.timeZone).format();
            vm.comment.fromNow = moment(Date.now()).fromNow();


            task.child.comments.push(vm.comment);
            vm.task = task;

            vm.isRequesting = true;
        }

        function updateComment(comment) {
            if (!!comment.id) {
                Api2Service.save('comments', comment);
            }
            vm.isRequesting = true;
        }

        function deleteComment(task, comment) {
            vm.task = task;
            vm.comment = comment;
            Api2Service.destroy('comments', comment.id);
            vm.isRequesting = true;
        }



        // folders crud functions
        function saveFolder(task) {

            console.log(task.id);
            if (!vm.folder.id) {
                console.log('foldername', vm.folder.name)
                ApiService
                    .createFolderIfNotExist(vm.folder.name)
                    .then(function(response) {
                        console.log(response.data);
                        task.folder_id = response.data;
                        vm.task = task;
                        updateTask(task);
                        var folderunion = JSON.stringify({ folder_id: response.data, associated_id: task.id, department: 'tasks' });
                        Api2Service.save('foldersunions', folderunion);
                    }, errorHandler);
            } else {
                var folderunion = JSON.stringify({ folder_id: response.data, associated_id: task.id, department: 'tasks' });
                ApiService.create('foldersunions', folderunion);

            }
            vm.isRequesting = true;
        }



        // user task function
        function assignUserTask(task) {
            // TODO: refactor later using own service

            console.log(vm.assign);
            vm.isRequesting = true;
            $http
                .get(CONFIG.APIHost + 'user/search/' + vm.assign)
                .success(function(response) {
                    console.log(response);
                    var userstasks;
                    var user;
                    if (!!response.users && response.users.length > 0) {
                        user = response.users[0];
                        userstasks = { task_id: task.id, assigned_user_id: user.user_id };
                        console.log(userstasks);
                        $http
                            .post(CONFIG.APIHost + 'userstasks', userstasks)
                            .success(function(response) {
                                console.log(response);
                                $http
                                    .get(CONFIG.APIHost + 'userstasks/' + task.id)
                                    .success(function(response) {
                                        console.log(response);
                                        vm.isRequesting = false;
                                        if (!!response && response.length > 0)
                                            task.child.assigned_users = response;
                                    })
                                    .error(function(error) {
                                        console.log(error);
                                        vm.isRequesting = false;
                                    })
                            })
                            .error(function(error) {
                                console.log(error);
                                vm.isRequesting = false;
                            });
                    } else
                        FlashService.otherThumbslider('User does not exists. . .', 'error', false, 3000);
                })
                .error(function(error) {
                    console.log(error);
                });
        }



        function generateLink(data, type) {

            if (data.child.urlSlug.length > 0 || !!vm.slug.task)
                return;

            // TODO: refactor later to its own service

            console.log($location.absUrl());


            var urldata = { urldata: 'youprodev.com/' + type + '/' + data.id };
            $http
                .post(CONFIG.APIHost + 'urls', urldata)
                .success(function(response) {
                    console.log(response);

                    var urlsshorts = {
                        url_id: response,
                        associated_id: data.id,
                        type: type + 's'
                    };
                    $http
                        .post(CONFIG.APIHost + 'urlshorts', urlsshorts)
                        .success(function(response) {

                            console.log(response);
                            vm.slug[type] = CONFIG.Local + response;
                        })
                        .error(function(error) {
                            console.log(error);
                        });
                })
                .error(function(error) {
                    console.log(error);
                });
        }


        function openStatuses() {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'app/components/tasks/modals/status.view.html',
                controller: 'ModalStatusController',
                size: 'md',
                resolve: {
                    items: function() {
                        return $scope.items;
                    }
                }
            });

            modalInstance.result.then(function(selectedItem) {}, function() {});
        }
        // tags functions
        function addTag(tag, task) {
            console.log(tag);
            if (!tag.id) {
                Api2Service
                    .check('tagcheck', tag.name)
                    .then(function(response) {
                        console.log(response);
                        var tagunion = JSON.stringify({ tag_id: response.data, associated_id: task.id, department: 'tasks' });
                        Api2Service.save('tagsunions', tagunion);
                    }, errorHandler);
            } else {
                var tagunion = JSON.stringify({ tag_id: tag.id, associated_id: task.id, department: 'tasks' });
                Api2Service.save('tagsunions', tagunion);
            }
        }

        function deleteTag(tag) {
            if (!!tag.id) {
                vm.isRequesting = true;
                ApiService
                    .customDelete('tags', tag)
                    .then(function(response) {
                        console.log(angular.toJson(response));
                        vm.isRequesting = false;
                    }, function(error) {
                        console.log(angular.toJson(error));
                        vm.isRequesting = false;
                    });
            }
        }

        function loadTags(query) {
            return ApiService.list('tags');
        }



        // other methods
        function wait() {
            // wait
            if (vm.isRequesting) {
                FlashService.barSlideTop('Request is still loading...', '', 100);
                return true;
            }
        }

        function changeState(event, state) {
            vm.activeState = state;
        }

        function changeToTime(date) {
            if (!!date)
                return moment(date).format('LT');
        }

        function changeToDate(date) {
            if (!!date)
                return moment(date).format('LL');
        }

        function dateSelection(task, date, type) {
            switch (type) {
                case 'today':
                    task[date] = moment().format();
                    break;
                case 'tomorrow':
                    task[date] = moment().add(1, 'days').format();
                    break;
                case 'in one week':
                    task[date] = moment().add(7, 'days').format();
                    break;
                case 'in one month':
                    task[date] = moment().add(1, 'months').format();
                    break;
                case 'in one year':
                    task[date] = moment().add(1, 'year').format();
                    break;
            }
            console.log(task);
            if (!!task.id)
                updateTask(task, 'date', false);
        }

        function chatDate(date) {
            return $filter('date')(moment(date).format(), "d MMM") + ' at ' + moment(date).format('LT');
        }

        function downloadFile(downloadPath) {
            window.open(downloadPath, '_blank', '');
        }

        function commentDetails(comment, task, info) {
            var user = "";
            _.each(task.child.assigned_users, function(u) {
                if (u.assigned_user_id == comment.user_id) {
                    user = u;
                }
            });
            return $rootScope.globals.currentUser.user_id == comment.user_id ? $rootScope.globals.currentUser[info] : user[info];
        }

        function hasCreateTaskProperty() {
            var count = 0;

            if (_.size(vm.create_task) != 0) {

                _.each(vm.create_task, function(value, key) {
                    if (key != 'name') {
                        if (!value)
                            count++;
                    } else
                        count++;
                });

                if (count == _.size(vm.create_task))
                    return false;

                return true;
            } else {
                return false;
            }


            if (!_.isEmpty(vm.create_task)) {


            }


            return false;
        }

        function showDatePicker(ev, task, property) {
            $mdpDatePicker(task[property], {
                targetEvent: ev
            }).then(function(selectedDate) {
                task[property] = selectedDate;
                if (!!task.id)
                    updateTask(task, 'date', false);
            })
        }

        function showTimePicker(ev, task, property) {
            $mdpTimePicker(task[property], {
                targetEvent: ev
            }).then(function(selectedDate) {
                task[property] = selectedDate;
                if (!!task.id)
                    updateTask(task, 'date', false);
            })
        }

        function activeSubTab(childState, task) {

            vm.activeChildState = childState;

            task.subMenuLists[task.subActiveIndex].active = false;
            task.subMenuLists[idx].active = true;
            task.subActiveIndex = idx;
        }

        function taskLoadChildSection(task, section) {
            task.activeState = section;
            task.is_collapsed = true;
        }

        // file upload methods
        $scope.currentTask = {};

        $scope.upload = function(files, task) {

            var calls = [];
            if (files && files.length) {
                console.log(files);

                vm.isRequesting = true;
                _.each(files, function(file) {
                    if (!file.$error) {
                        calls.push(uploadFile(file, task));
                    }
                });
                $q.all(calls).then(function(response) {

                    console.log(response);

                    Api2Service.custom2('files', { department: 'tasks', id: task.id }).then(function(response) {
                        FlashService.otherThumbslider('Files uploaded successfully...', '', false, 1500);
                        console.log('custom get', response);
                        task.child.files = response;
                    });

                    vm.isRequesting = false;
                }, function(error) {
                    console.log(angular.toJson(error));
                    vm.isRequesting = false;
                });
            }
        };

        function uploadFile(file, task, callback) {
            var deferred = $q.defer();
            if (!file.$error) {
                Upload.upload({
                    url: CONFIG.APIHost + 'files',
                    data: {
                        filefield: file,
                        type: 'tasks',
                        task_id: task.id
                    }
                }).then(function(response) {
                    console.log('single upload', response.data);
                    if (_.isFunction(callback))
                        callback(response.data);
                    deferred.resolve(response.data);
                }, function(error) {
                    deferred.reject(error);
                }, function(evt) {
                    // evt
                })
            } else {
                deferred.reject();
            }
            return deferred.promise;
        }

        function deleteFile(task, file) {
            vm.task = task;
            vm.file = file;
            Api2Service.destroy('files', file.id);
            vm.isRequesting = true;
        }

        // handlers
        function errorHandler(response) {
            console.log('Error => ' + angular.toJson(response));
            vm.isRequesting = false;
            if (response.data.error == 'token_expired') {
                FlashService.barSlideTop('Your session has expired. Please login again.', 'warning', 100);
                $state.go('login');
            } else {
                FlashService.barSlideTop(response.data.error.message, 'error', 100);
            }
        }

        vm.toggleSubPriority = function(event, open) {
            event.preventDefault();
            event.stopPropagation();
            console.log(open);
        };
    }

    angular.module('youproductiveApp')
        .controller('ModalStatusController', ModalStatusController);

    ModalStatusController.$inject = [];

    function ModalStatusController() {

    }
})();
