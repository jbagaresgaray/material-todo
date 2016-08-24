(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.filter('youDate', youDate);
	youDate.$inject = ['$filter'];
	function youDate($filter) {
		return function(text) {
			return  text ? $filter('date')(moment(text).toDate(), "dd MMM yy") : '';
		};
	}
})();