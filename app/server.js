app.controller('serverCtrl',['$scope','services', function ($scope, services) {
	services.getServerInfo().then(function(data){
  	    $scope.info=data.data.info;
  	    $scope.players=data.data.players;
  	    $scope.rules=data.data.rules;
  	    services.searchMap($scope.info.Map).then(function(data){
	    	$scope.mapid=data.data.id;
	    });
	    services.searchMap($scope.rules.sm_nextmap).then(function(data){
	    	$scope.nextmapid=data.data.id;
	    });
	    angular.forEach($scope.players,function(player,key){
	    	services.searchPlayers(player.Name).then(function(data){
	    		if(data.data[0])
	    			player.id=data.data[0].id;
	    	});
	    });
    });
}]);