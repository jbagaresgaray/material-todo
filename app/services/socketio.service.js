(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.factory('SocketService', SocketService);

	SocketService.$inject = ['socketFactory'];
	function SocketService(socketFactory) {
		return socketFactory({
			prefix: 'yp-',
			ioSocket: io.connect('http://api.youprodev.com:3000')
		});
	}
})();
