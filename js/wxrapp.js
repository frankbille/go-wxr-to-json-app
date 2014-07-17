wxrApp = angular.module('wxrapp', [
	'angularFileUpload'
]);

wxrApp.controller('ConvertCtrl', function($scope, $http, $upload, $location, $anchorScroll) {
	$anchorScroll();

	$location.hash('');

	$scope.Convert = function($files) {
		delete $scope.error;
		delete $scope.wxrJson;

		$location.hash('');

		if ($files.length != 1) {
			$scope.error = 'Can only convert one file at a time';
		} else {
			var file = $files[0];

			if (file.type.indexOf('xml') < 0) {
				$scope.error = 'Can only convert XML files.';
			} else {
				$upload.upload({
					url: '/convert',
					file: file
				}).progress(function(evt) {
					if (evt.loaded < evt.total) {
						$scope.convertProgress = {
							value: evt.loaded,
							total: evt.total,
							pctDone: parseInt(100.0 * evt.loaded / evt.total)
						};
					} else {
						delete $scope.convertProgress;
					}
				}).success(function(data) {
					delete $scope.convertProgress;

					$scope.wxrJson = angular.toJson(data, true);

					$location.hash('json');
				});
			}
		}
	};

	$scope.ConvertExample = function(fileUrl) {
		delete $scope.error;
		delete $scope.wxrJson;
		delete $scope.convertProgress;

		$location.hash('');

		$http.get(fileUrl).success(function(xml) {
			$http.post('/convert', xml, {
				headers: {
					'Content-Type': 'application/xml'
				}
			}).success(function(json) {
				$scope.wxrJson = angular.toJson(json, true);

				$location.hash('json');
			});
		});
	};

	$scope.getDropClass = function($event) {
		var items = $event.dataTransfer.items;
		if (items.length !== 1) {
			return "drop-panel-error";
		}

		if (items[0].kind !== 'file') {
			return "drop-panel-error";
		}

		return "drop-panel-active";
	};
});
