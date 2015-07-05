app.controller('runCtrl',['$scope','$routeParams','services','secondsToDateTimeFilter','dateFilter', function ($scope,$routeParams,services,secondsToDateTimeFilter,dateFilter) {
	$scope.player={};
  $scope.player2={};
	$scope.map={};
  $scope.form={};
  $scope.working=false;
  $scope.runInfo=[];
  $scope.chartObject = {};
  $scope.chartObject.type = "BarChart";
  $scope.chartObject.options=
  {
    "isStacked": "true",
    "fill": 20,
    "displayExactValues": true,
    "tooltip": {
      "isHtml": false
    },
    hAxis: { textPosition: 'none' ,gridlines: {
        color: 'transparent'
    }},
    vAxis: { textStyle: {color: '#eee'},gridlines: {
        color: 'transparent'
    }},
    backgroundColor: 'none',
  };
  $scope.chartObject.data = {};
  $scope.genChartObj = function(){
    var cols=[{id: "p", label: "Player", type: "string"}];
    angular.forEach($scope.runInfo, function(time,key){
      cols.push({id : "t"+(key+1), label : "CP"+(key+1), type : "number"});
    });
    $scope.chartObject.data.cols=cols;
    var rows=[];
    var vals=[{v : $scope.player.info.name}];
    angular.forEach($scope.runInfo, function(time,key){
      var timestr = secondsToDateTimeFilter(time.duration);
      timestr = dateFilter(timestr,'mm:ss.sss')
      vals.push({v : time.duration-(key>0?$scope.runInfo[key-1].duration:0), f : timestr});
    });
    var row = {c : vals}
    rows.push(row);
    if($scope.player2.playerid >0)
    {
      var vals=[{v : $scope.player2.info.name}];
      angular.forEach($scope.runInfo2, function(time,key){
        var timestr = secondsToDateTimeFilter(time.duration);
        timestr = dateFilter(timestr,'mm:ss.sss')
        vals.push({v : time.duration-(key>0?$scope.runInfo2[key-1].duration:0), f : timestr});
      });
      var row = {c : vals}
      rows.push(row);
    }
    $scope.chartObject.data.rows=rows;
  };
	$scope.getRunInfo = function(type){
    if(type===0)
    {
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
          services.getRunInfo($scope.player.playerid,$scope.map.mapid).then(function(data){
            if(data.data)
            {
              $scope.runInfo=data.data;
              $scope.genChartObj();
            }
          });
  			});
  		}
    }
    else
    {
      if($scope.player.playerid >0)
      {
        services.getPlayer($scope.player2.playerid).then(function(data){
          if(data.data)
          {
            $scope.player2.info=angular.copy(data.data);
          }
          services.getRunInfo($scope.player2.playerid,$scope.map.mapid).then(function(data){
            if(data.data)
            {
              $scope.runInfo2=data.data;
              $scope.genChartObj();
            }
          });
        });
      }
    }
	}
 
	$scope.mapClass = function(mapid){
		if($scope.map.mapid===mapid)
			return 'valid';
	}
	$scope.playerClass = function(playerid){
		if($scope.player.playerid===playerid)
			return 'valid';
	}
  $scope.player2Class = function(playerid){
    if($scope.player2.playerid===playerid)
      return 'valid';
  }
	$scope.setMap = function(mapid){
		$scope.map.mapid = mapid;
		$scope.getRunInfo(0);
	}
	$scope.setPlayer = function(playerid){
		$scope.player.playerid = playerid;
		$scope.getRunInfo(0);
	}
  $scope.setPlayer2 = function(playerid){
    $scope.player2.playerid = playerid;
    $scope.getRunInfo(1);
  }
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
  $scope.$watch('form.addPlayer', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
    {
      $scope.addplayers=[];
      return 0;
    }
    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.form.addPlayer)
      {
        services.searchPlayers($scope.form.addPlayer).then(function(data){
          if(data.data && !data.data.error)
          {
            $scope.addplayers = angular.copy(data.data);
          }
        });
      }
    }, 500);
  });
  $scope.player.playerid=$routeParams.playerid;
  $scope.map.mapid=$routeParams.mapid;
  $scope.getRunInfo(0);
}]);