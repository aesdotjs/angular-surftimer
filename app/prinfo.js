app.controller('prinfoCtrl',['$scope','user','$routeParams','services', function ($scope, user,$routeParams,services,location) {
	$scope.player={};
	$scope.map={};
  $scope.form={};
	$scope.you=user.user.playerid;
  $scope.canReport=false;
  $scope.reportIndex=0;
  $scope.toggleReport=false;
  $scope.working=false;
  $scope.reason="";
	$scope.getPrinfo = function(){
		if($scope.map.mapid>0 && $scope.player.playerid >0)
		{
			services.getMap($scope.map.mapid).then(function(data){
				if(data.data)
				{
					$scope.map.info=angular.copy(data.data);
				}
			});
			services.getPlayer($scope.player.playerid).then(function(data){
				if(data.data)
				{
					$scope.player.info=angular.copy(data.data);
				}
			});
			services.getPrinfo($scope.player.playerid,$scope.map.mapid).then(function(data){
				if(data.data)
				{
					$scope.prinfo=angular.copy(data.data);
				}
			});
		}
	}
  $scope.report = function(index){
    if(!$scope.canReport) return;
    $scope.reportIndex=index;
    $scope.toggleReport=true;
  }
  $scope.sendReport = function(){
    if(!$scope.canReport || $scope.working) return;
    var i=$scope.reportIndex;
    $scope.working=true;
    services.addReport($scope.form.reason,$scope.player.playerid,
    $scope.map.mapid,$scope.prinfo[i].runID,$scope.prinfo[i].stageid,
    $scope.prinfo[i].timeinfo.duration,'time', null).then(function(data){
      if(data.data.success)
      {
        $scope.toggleReport=false;
        $scope.reason="";
      }
      $scope.working=false;
    });
  }
  $scope.reportRight = function(){
    user.canReport().then(function(data){
      if(data.data===1){
        $scope.canReport = true;
      }
    });
  }
	$scope.mapClass = function(mapid){
		if($scope.map.mapid===mapid)
			return 'valid';
	}
	$scope.playerClass = function(playerid){
		if($scope.player.playerid===playerid)
			return 'valid';
	}
	$scope.setMap = function(mapid){
		$scope.map.mapid = mapid;
		$scope.getPrinfo();
	}
	$scope.setPlayer = function(playerid){
		$scope.player.playerid = playerid;
		$scope.getPrinfo();
	}
  $scope.$on('user:updated', function(event,data) {
     $scope.you = user.user.playerid;
     $scope.reportRight();
  });
  $scope.$on('user:logout', function(event,data) {
     $scope.you = 0;
     $scope.canReport=false;
  });
  $scope.$watch('searchMap', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
    {
    	$scope.maps=[];
    	return 0;
    }
    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.searchMap)
      {
        services.searchMaps($scope.searchMap).then(function(data){
          if(data.data)
          {
            $scope.maps = angular.copy(data.data);
          }
        });
      }
    }, 500);
  });

  $scope.$watch('searchPlayer', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
    {
    	$scope.players=[];
    	return 0;
    }
    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.searchPlayer)
      {
        services.searchPlayers($scope.searchPlayer).then(function(data){
          if(data.data && !data.data.error)
          {
            $scope.players = angular.copy(data.data);
          }
        });
      }
    }, 500);
  });
  $scope.player.playerid=$routeParams.playerid;
  $scope.map.mapid=$routeParams.mapid;
  $scope.reportRight();
  $scope.getPrinfo();
}]);