(function () {
	'use strict';

	angular
		.module('youproductiveApp')
		.directive('autoOpen', function () {

		function compile(tElement) {
			tElement.find('input').attr('ng-focus', 'ctrl.onFocus($event)');

			return function (scope, element, attrs, datePicker) {
				var focused = false;

				datePicker.onFocus = function (event) {
					focused = !focused;

					// The datepicker is going to return focus to the input when
					// the calendar pane is closed. We don't want to reopen the
					// the calendar pane after it is closed.
					if (focused) {
						datePicker.openCalendarPane(event);
					}
				};
			};
		}

		return {
			compile: compile,
			priority: -1,
			require: 'mdDatepicker',
			restrict: 'A'
		};
	});
})();

