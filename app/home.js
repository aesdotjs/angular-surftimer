app.controller('homeCtrl',['$scope','services', function ($scope, services) {
	services.getRecentBroken(0).then(function(data){
		$scope.brokenmap=data.data;
	});
	services.getRecentBroken(1).then(function(data){
		$scope.brokenbonus=data.data;
	});
	services.getRecentBroken(2).then(function(data){
		$scope.brokenstage=data.data;
		console.log($scope);
	});
}]);