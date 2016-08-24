(function() {
    'use strict';

    angular
        .module('youproductiveApp')
        .factory('FlashService', FlashService);

    FlashService.$inject = ['$timeout', 'toastr', 'ngNotify'];

    function FlashService($timeout, toastr, ngNotify) {
        var service = {};

        ngNotify.config({
            theme: 'pastel',
            position: 'top',
            duration: 1500,
            sticky: false,
            button: true,
            html: false
        });

        service.barSlideTop = barSlideTop;
        service.otherThumbslider = otherThumbslider;

        return service;

        function barSlideTop(message, notiftype, delay) {
            switch (notiftype) {
                case 'success':
                    ngNotify.set(message, 'success');
                    break;
                case 'info':
                    ngNotify.set(message, 'info');
                    break;
                case 'warning':
                    ngNotify.set(message, 'warn');
                    break;
                case 'error':
                    ngNotify.set(message, 'error');
                    break;
                case 'grimace':
                    ngNotify.set(message, 'grimace');
                    break;
                default:
                    ngNotify.set(message, 'default');
                    break;
            }
        }

        function otherThumbslider(message, notiftype, delay, duration) {
            switch (notiftype) {
                case 'success':
                    toastr.success(message, 'Success');
                    break;
                case 'info':
                    toastr.info(message, 'Information');
                    break;
                case 'error':
                    toastr.error(message, 'Error');
                    break;
                case 'warning':
                    toastr.warning(message, 'Warning');
                    break;
                default:
                    toastr.info(message,{
                        iconClass: 'toast-default'
                    });
                    break;
            }
        }
    }
})();
