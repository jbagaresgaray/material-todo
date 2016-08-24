(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.filter('htmlToPlaintext', function() {
				return function(text) {
					return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
				};
			}
		);
})();
