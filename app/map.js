app.controller('mapsCtrl',['$scope','services', function ($scope, services) { 
  $scope.sort="name";
  $scope.max=50;
  $scope.end=false;
  $scope.loadMore = function(){
    if($scope.max < $scope.maps.length)
      $scope.max+=40;
    else
      $scope.end=true;
  }
  services.getMapsTimesPlayers().then(function(data){
    $scope.maps = data.data;
  });
}]);

app.controller('mapCtrl',['$scope','services', '$routeParams', function ($scope, services, $routeParams) {
  var currentid=$routeParams.id;
  $scope.mapmax=50;
  $scope.stagemax=[];
  $scope.bonusmax=[];
  $scope.loadMore = function(type,nb){
    if(type === 0)
      $scope.mapmax+=50;
    else if(type === 1)
      $scope.stagemax[nb]+=50;
    else if (type === 2)
      $scope.bonusmax[nb]+=50;
  }
  services.getMap(currentid).then(function(data){
    $scope.map = data.data;
    services.getMapCompletion(currentid).then(function(data){
      $scope.map.completion=data.data[0].cnt;
    });
    services.getMapRecords(currentid,0).then(function(data){
      $scope.map.times = data.data;
    });

    services.getMapStages(currentid).then(function(data){
      $scope.stages = data.data;
      angular.forEach($scope.stages,function(stage,key){
        services.getMapStageRecords(stage.id).then(function(data){
          stage.times=[];
          stage.times=data.data;
          $scope.stagemax[key]=50;
        });
      });
    });

    services.getMapBonuses(currentid).then(function(data){
      $scope.bonus = data.data;
      angular.forEach($scope.bonus,function(bonus,key){
        $scope.bonusmax[key]=50;
        if(!bonus.times)
          bonus.times=[];
        services.getMapRecords(currentid,bonus.runID).then(function(data){
          if(data.data)
          {
            angular.forEach(data.data, function(data,key){
              bonus.times.push({time:data.duration,playerid:data.id,name:data.name});
            });
          }              
        });
      });
    });
  });
}]);