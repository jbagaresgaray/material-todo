(function () {
	'use strict';

	var app = angular.module('youproductiveApp');

	app.directive('hoverLink', function () {

		function wrapElement(el) {
			return angular.element(el);
		}

		return {
			restrict: 'A',
			link: function (scope, element) {

				var el = element[0];
				var i = wrapElement(el.querySelector('.material-icons'));
				var anchor = wrapElement(el.querySelector('.youlink'));

				element.bind('mouseover', function () {
					i.addClass('link-active');
					anchor.addClass('link-active');
				});

				element.bind('mouseout', function () {
					i.removeClass('link-active');
					anchor.removeClass('link-active');
				});
			}
		}
	});

	app.directive('linkSelect', function ($timeout) {
		return {
			restrict: 'A',
			link: function (scope, element) {
				$timeout(function () {
					element.bind('click', function () {
						var range = document.createRange();
						range.selectNodeContents(element[0]);
						var sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					});
				}, 0);
			}
		}
	});

	app.directive('starColor', function ($timeout) {
		return {
			restrict: 'A',
			scope: {
				starred: '='
			},
			link: function (scope, element) {
				console.log(scope.starred);
				scope.$watch('starred', function (n) {
					$timeout(function () {
						if (!!n) {
							console.log('here here');
							element.css('color', '#ffc600');
						} else {
							element.css('color', '#aaa');
						}
					}, 0);
				});
			}
		}
	});

	app.directive('fileColor', function (_) {
		return {
			restrict: 'A',
			scope: {
				type: '='
			},
			link: function (scope, element) {

				var file_types = {
					image: [
						'image/gif',
						'image/jpeg',
						'image/png',
						'application/x-shockwave-flash',
						'image/psd',
						'image/bmp',
						'image/tiff',
						'image/tiff',
						'image/jp2',
						'image/iff',
						'image/vnd.wap.wbmp',
						'image/xbm',
						'image/vnd.microsoft.icon'
					],
					word: [
						'application/msword',
						'application/msword',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
						'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
						'application/vnd.ms-word.document.macroEnabled.12',
						'application/vnd.ms-word.template.macroEnabled.12'
					],
					excel: [
						'application/octet-stream',
						'application/vnd.ms-excel',
						'application/vnd.ms-excel',
						'application/vnd.ms-excel',
						'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
						'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
						'application/vnd.ms-excel.sheet.macroEnabled.12',
						'application/vnd.ms-excel.template.macroEnabled.12',
						'application/vnd.ms-excel.addin.macroEnabled.12',
						'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
					],
					ppt: [
						'application/vnd.ms-powerpoint',
						'application/vnd.ms-powerpoint',
						'application/vnd.ms-powerpoint',
						'application/vnd.ms-powerpoint',
						'application/vnd.openxmlformats-officedocument.presentationml.presentation',
						'application/vnd.openxmlformats-officedocument.presentationml.template',
						'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
						'application/vnd.ms-powerpoint.addin.macroEnabled.12',
						'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
						'application/vnd.ms-powerpoint.template.macroEnabled.12',
						'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
					],
					pdf: [
						'application/pdf',
						'application/x-pdf'
					]
				};

				if (!!scope.type) {
					var isLoop = true;
					_.each(file_types, function (types, idx) {
						_.each(types, function (type) {
							if (type == scope.type) {
								if (idx == 'word')
									element.addClass('fa-file-word-o word');
								else if (idx == 'excel')
									element.addClass('fa-file-excel-o excel');
								else if (idx == 'ppt')
									element.addClass('fa-file-powerpoint-o ppt');
								else if (idx == 'image')
									element.addClass('fa-file-image-o image');
								else if (idx == 'pdf')
									element.addClass('fa-file-pdf-o pdf');
								isLoop = false;
								return false;
							}
						});
						if (!isLoop)
							return false;
					});
				}
			}
		}
	});
})();