(function() {
    'use strict';

    var app = angular.module('youproductiveApp');

    app.config(config);
    config.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider', 'toastrConfig'];

    function config($httpProvider, $stateProvider, $urlRouterProvider, toastrConfig) {
        $httpProvider.defaults.headers.common["X-Requested-With"] = 'XMLHttpRequest';
        $httpProvider.defaults.headers.common['Timezone'] = moment.tz.guess();

        angular.extend(toastrConfig, {
            autoDismiss: false,
            containerId: 'toast-container',
            maxOpened: 0,
            newestOnTop: false,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            preventOpenDuplicates: false,
            target: 'body'
        });
        $stateProvider
            .state('masterpage', {
                abstract: true,
                views: {
                    layout: {
                        templateUrl: 'app/components/layouts/masterpage.view.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('fullpage', {
                abstract: true,
                views: {
                    layout: {
                        templateUrl: 'app/components/layouts/fullpage.view.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('publicpage', {
                abstract: true,
                views: {
                    layout: {
                        templateUrl: 'app/components/layouts/publicpage.view.html',
                        controller: 'HomeController'
                    }
                }
            })
            .state('home', {
                url: '/',
                templateUrl: 'app/components/home/home.view.html',
                controller: 'HomeController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Overview'
                },
                cache: false
            })
            .state('task/:id', {
                url: '/task/:id',
                templateUrl: 'app/components/tasks/task/task.view.html',
                controller: 'TaskController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Task'
                },
                cache: false
            })
            .state('tasks', {
                url: '/tasks',
                templateUrl: 'app/components/tasks/tasks.view.html',
                controller: 'TasksController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Tasks'
                },
                cache: false
            })
            .state('public', {
                url: '/public/:link',
                templateUrl: 'app/components/tasks/public/tasks.public.view.html',
                controller: 'PublicController',
                controllerAs: 'vm',
                parent: 'publicpage',
                cache: false
            })
            .state('projects', {
                url: '/projects',
                templateUrl: 'app/components/project/project.view.html',
                controller: 'ProjectsController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Projects'
                },
                cache: false
            })
            .state('folders', {
                url: '/folders',
                templateUrl: 'app/components/folder/folder.view.html',
                controller: 'FoldersController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login'
                },
                cache: false
            })
            .state('tags', {
                url: '/tags',
                templateUrl: 'app/components/tag/tag.view.html',
                controller: 'TagsController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login'
                },
                cache: false
            })
            .state('logs', {
                url: '/logs',
                templateUrl: 'app/components/log/log.view.html',
                controller: 'LogsController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login'
                },
                cache: false
            })
            .state('notifications', {
                url: '/notifications',
                templateUrl: 'app/components/notification/notification.view.html',
                controller: 'NotificationsController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login'
                },
                cache: false
            })
            .state('organizations', {
                url: '/organizations',
                templateUrl: 'app/components/organization/organization.view.html',
                controller: 'OrganizationsController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login'
                },
                cache: false
            })
            .state('register', {
                url: '/register',
                templateUrl: 'app/components/register/register.view.html',
                controller: 'RegisterController',
                controllerAs: 'vm',
                parent: 'fullpage',
                cache: false
            })
            .state('login', {
                url: '/login',
                templateUrl: 'app/components/login/login.view.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                parent: 'fullpage',
                cache: false
            })
            .state('logout', {
                url: '/logout',
                templateUrl: 'app/components/logout/logout.view.html',
                controller: 'LogoutController',
                controllerAs: 'vm',
                parent: 'fullpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    memory: true
                },
                cache: false
            })
            .state('userverify', {
                url: '/userverify/:evc',
                templateUrl: 'app/components/userverify/userverify.view.html',
                controller: 'UserVerifyController',
                controllerAs: 'vm',
                parent: 'fullpage',
                cache: false
            })
            .state('verifypassword', {
                url: '/verifypassword/:evc',
                templateUrl: 'app/components/verifypassword/verifypassword.view.html',
                controller: 'VerifyPasswordController',
                controllerAs: 'vm',
                parent: 'fullpage',
                cache: false
            })
            .state('setpassword', {
                url: '/setpassword',
                templateUrl: 'app/components/setpassword/setpassword.view.html',
                controller: 'SetPasswordController',
                controllerAs: 'vm',
                parent: 'fullpage',
                cache: false
            })
            .state('updateprofile', {
                url: '/updateprofile',
                templateUrl: 'app/components/updateprofile/updateprofile.view.html',
                controller: 'UpdateProfileController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Account'
                },
                cache: false
            })
            .state('editprofile', {
                url: '/editprofile',
                templateUrl: 'app/components/editprofile/editprofile.view.html',
                controller: 'UpdateProfileController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Account'
                },
                cache: false
            })
            .state('account', {
                url: '/account',
                templateUrl: 'app/components/account/account.view.html',
                controller: 'AccountOverviewController',
                controllerAs: 'vm',
                parent: 'masterpage',
                data: {
                    authorization: true,
                    redirectTo: 'login',
                    appTitle: 'Account'
                },
                cache: false
            });
        $urlRouterProvider.otherwise('/login');
        $httpProvider.interceptors.push('AuthInterceptor');

        //check browser support
        if (window.history && window.history.pushState) {
            //$locationProvider.html5Mode(true); will cause an error $location in HTML5 mode requires a  tag to be present! Unless you set baseUrl tag after head tag like so: <head> <base href="/">

            // to know more about setting base URL visit: https://docs.angularjs.org/error/$location/nobase

            // if you don't wish to set base URL then use this
            /*$locationProvider.html5Mode({
             enabled: true,
             requireBase: false
             });*/
        }
    }

    app.run(run);
    run.$inject = ['$filter', '$rootScope', '$state', 'AuthorizationService', '$location', 'TokenService', 'jwtHelper', '$localStorage', '$q', 'UserService', '$http'];

    function run($filter, $rootScope, $state, AuthorizationService, $location, TokenService, jwtHelper, $localStorage, $q, UserService, $http) {
        $rootScope.globals = {};
        $rootScope.globals.currentUser = {};
        $rootScope.globals.timeZone = window.moment.tz.guess();
        $rootScope.globals.timeZoneNum = moment.tz(new Date(), window.moment.tz.guess()).format('Z');
        $rootScope.tasksMenuOpen = true;
        $http.defaults.headers.common['Timezone'] = moment.tz.guess();

        console.log('$rootScope.globals.timeZone : ', $rootScope.globals.timeZone);
        console.log('$rootScope.globals.timeZoneNum : ', $rootScope.globals.timeZoneNum);
        $rootScope.state = $state;

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            console.log('====================================: ');
            console.log('$stateChangeStart fromState: ' + fromState.name + ' toState: ', toState.name);
            console.log('====================================: ');

            $rootScope.checkAuthorization = TokenService.isAuthenticated();
            $rootScope.checkUsername = TokenService.isAuthenticated();
            $rootScope.localUser = UserService.getCurrentUser();

            console.log('$rootScope.checkAuthorization: ', $rootScope.checkAuthorization);
            console.log('$rootScope.checkUsername: ', $rootScope.checkUsername);
            console.log('rootScope.localUser: ', $rootScope.localUser);

            if (!_.isUndefined($rootScope.localUser)) {
                $rootScope.globals.currentUser = JSON.parse($rootScope.localUser);
            } else {
                $rootScope.globals.currentUser = {};
            }

            if ($rootScope.checkAuthorization) {
                var token = TokenService.getToken();
                console.log('jwtHelper.isTokenExpired(token): ', jwtHelper.isTokenExpired(token));

                if (jwtHelper.isTokenExpired(token)) {
                    
                    // event.preventDefault();
                    // delete $localStorage.userToken;
                    // delete $localStorage.currentUser;

                    $localStorage.$reset();
                    // window.location.reload();
                    // $location.path('/login');
                    // $state.go('login');
                    // return $q.defer().reject({
                    //     error: 'Token Expired',
                    //     success: false
                    // });
                } else if (toState.name == 'login') {
                    event.preventDefault();
                    console.log('toState.name == "login" event.preventDefault();');
                    $state.go('tasks', null, {
                        reload: true
                    });
                }
            }
        });

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            console.log('====================================: ');
            console.log('$stateChangeSuccess fromState: ' + fromState.name + ' toState: ', toState.name);
            console.log('====================================: ');

            $rootScope.showLeftColumn = 0;

            console.log('AuthorizationService.memorizedState: ', AuthorizationService.memorizedState);
            console.log('fromState.data: ', fromState.data);
            console.log('toState.name: ', toState.name);
            console.log('toState.data: ', toState.data);


            //if (!AuthorizationService.authorized) {
            if (!$rootScope.checkAuthorization) {
                if (AuthorizationService.memorizedState && (!fromState.data || !fromState.data.redirectTo || toState.name !== fromState.data.redirectTo)) {
                    AuthorizationService.clear();
                }
                if (toState.data && toState.data.authorization && toState.data.redirectTo) {
                    if (toState.data.memory) {
                        AuthorizationService.memorizedState = toState.name;
                    }
                    console.log('$state.go(toState.data.redirectTo): ', toState.data.redirectTo);
                    $state.go(toState.data.redirectTo);
                }
            }

            //refresh header navigation
            if (!$rootScope.checkUsername) {
                $rootScope.navigationBlock = null;
                $rootScope.navigationBlock = 'app/components/core/navigation/logout.view.html';
                $rootScope.showLeftColumn = 0;

                $rootScope.headerBlock = null;
                $rootScope.footerBlock = null;
            } else {
                $rootScope.navigationBlock = null;
                $rootScope.navigationBlock = 'app/components/core/navigation/login.view.html';
                $rootScope.showLeftColumn = 1;

                //left column
                $rootScope.leftColumnBlock = null;
                $rootScope.leftColumnBlock = 'app/components/core/leftcolumn/leftcolumn.view.html';

                //header and footer
                $rootScope.headerBlock = null;
                $rootScope.headerBlock = 'app/components/core/header/header.view.html';
                $rootScope.headerPublicBlock = null;
                $rootScope.headerPublicBlock = 'app/components/core/header/public/header.public.view.html';
                $rootScope.footerBlock = null;
                $rootScope.footerBlock = 'app/components/core/footer/footer.view.html';
            }

            $rootScope.isActive = function(viewLocation) {
                return (viewLocation === $location.path());
            };
        });

        $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {
            console.log('====================================: ');
            console.log('$stateChangeError fromState: ' + fromState.name + ' toState: ', toState.name);
            console.log('$stateChangeError error: ', error);
            console.log('====================================: ');
            if (!!error) {
                console.log('$stateChangeError redirect: ');
                // $location.path('/login');

            }
        });
    }
})();
