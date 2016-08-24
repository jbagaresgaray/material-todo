(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .controller('UpdateProfileController', UpdateProfileController);

    UpdateProfileController.$inject = ['$http', '$timeout', '$location', 'UserService', 'FlashService', '$state', '$localStorage', 'jwtHelper', 'TokenService', 'Upload', 'CONFIG'];

    function UpdateProfileController($http, $timeout, $location, UserService, FlashService, $state, $localStorage, jwtHelper, TokenService, Upload, CONFIG) {

        var vm = this;
        var isFileChange = false;

        vm.updateprofile = updateprofile;
        vm.getuserprofile = getuserprofile;
        vm.uploadProfilePic = uploadProfilePic;
        vm.isFileChange = false;

        vm.user = {};

        function getuserprofile() {
            var checkAuthorization = TokenService.isAuthenticated();
            if (checkAuthorization) {
                vm.dataLoading = true;
                UserService.GetAll()
                    .then(function(response) {
                        if (response.user_details && response.user_details.length > 0) {
                            vm.user = response.user_details[0];
                            vm.user.user_photo_file_id = vm.user.id;

                            UserService.setCurrentUser(vm.user);

                            vm.dataLoading = false;
                        }
                    });
            } else {
                $location.path('/login');
            }
        }

        function uploadProfilePic(files) {
            console.log('files: ',files);
            if (files) {
                isFileChange = true;
                vm.isFileChange = true;
                console.log('uploadProfilePic: ', isFileChange);
            }
        }

        function updateprofile() {
            vm.dataLoading = true;

            console.log('user not uploaded', vm.user);

            UserService.Update(vm.user)
                .then(function(response) {
                    console.log('first then', response);
                    if (response.message === 'success') {
                        // $state.go('login');
                        $state.go($state.current, null, {
                            reload: true
                        });
                        UserService.setCurrentUser(vm.user);

                        FlashService.barSlideTop('User Profile success updated!');
                    } else {
                        FlashService.barSlideTop(response.message, 'error');
                        vm.dataLoading = false;
                    }
                }).then(function() {
                    var upload = Upload.upload({
                        url: CONFIG.APIHost + 'files?type=user_photo',
                        data: {
                            filefield: vm.user.s3_file_uri_user_photo
                        }
                    });

                    upload.then(function(resp) {
                        console.log('file ', resp, 'is uploaded successfully. Response: ', resp.data);
                    }, function(error) {
                        console.log('error: ', error.data.message);
                        if (error.data.message == 'Can only add one (1) user profile photo.') {
                            if (!_.isNull(vm.user.s3_file_uri_user_photo) || !_.isUndefined(vm.user.s3_file_uri_user_photo)) {
                                UserService.DeleteUserAvatar(vm.user.user_photo_file_id).then(function(response) {
                                    console.log('DeleteUserAvatar response: ', response);
                                });
                                Upload.upload({
                                    url: CONFIG.APIHost + 'files?type=user_photo',
                                    data: {
                                        filefield: vm.user.s3_file_uri_user_photo
                                    }
                                }).then(function() {
                                    $state.go($state.current, null, {
                                        reload: true
                                    });
                                    vm.dataLoading = false;
                                });
                            }
                        } else if (error.data.message == 'File already exist.') {
                            $state.go($state.current, null, {
                                reload: true
                            });
                            vm.dataLoading = false;
                        }
                    });

                }).then(function() {
                    getuserprofile();
                });
        }


        function handleSuccess(resp) {
            $state.reload();
            vm.dataLoading = false;
        }

        function handleError(error) {

            vm.dataLoading = false;
        }

        function handleProgress(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ');
        }
    }

})();
