app.controller('mapsCtrl',['$scope','services', function ($scope, services) { 
  $scope.sort="name";
  $scope.max=80;
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

app.controller('mapCtrl',['$scope','services', '$routeParams','$location','user', function ($scope, services, $routeParams,$location, user) {
  var currentid=$routeParams.id;
  $scope.mapid=currentid;
  $scope.playerid=$routeParams.playerid || user.user.playerid;
  $scope.mapmax=50;
  $scope.nulldate=new Date(0);
  $scope.stagemax=[];
  $scope.bonusmax=[];
  $scope.$on('user:updated', function(event,data) {
    if($scope.playerid>0)
      return;
    $scope.playerid = user.user.playerid;
  });
  $scope.loadMore = function(type,nb){
    if(type === 0)
      $scope.mapmax+=50;
    else if(type === 1)
      $scope.stagemax[nb]+=50;
    else if (type === 2)
      $scope.bonusmax[nb]+=50;
  }
  services.getMap(currentid).then(function(data){
    if(data.data.id){
      $scope.map = data.data;
      services.getMapCompletion(currentid).then(function(data){
        $scope.map.completion=data.data[0].cnt;
      });
      services.getMapRecords(currentid,0).then(function(data){
        if(data.data){
          var tmpres = data.data;
          for (var i = tmpres.length - 1; i >= 0; i--) {
            tmpres[i].timediff=(tmpres[i].timediff<0.001)?0:tmpres[i].timediff;
            if(tmpres[i].id==$scope.playerid)
            {
              tmpres.unshift(tmpres[i]);
              tmpres.splice(i+1,1);
            }
          }
          $scope.map.times=tmpres;
        }
      });

      services.getMapStages(currentid).then(function(data){
        if(data.data){
          $scope.stages = data.data;
          angular.forEach($scope.stages,function(stage,key){
            services.getMapStageRecords(stage.id).then(function(data){
              if(data.data){
                stage.times=[];
                stage.times=data.data;
                $scope.stagemax[key]=50;
                for (var i = stage.times.length - 1; i >= 0; i--) {
                  stage.times[i].timediff=(stage.times[i].timediff<0.001)?0:stage.times[i].timediff;
                  if(stage.times[i].id==$scope.playerid)
                  {
                    stage.times.unshift(stage.times[i]);
                    stage.times.splice(i+1,1);
                  }
                }
              }
            });
          });
        }
      });

      services.getMapBonuses(currentid).then(function(data){
        if(data.data){
          $scope.bonus = data.data;
          angular.forEach($scope.bonus,function(bonus,key){
            $scope.bonusmax[key]=50;
            if(!bonus.times)
              bonus.times=[];
            services.getMapRecords(currentid,bonus.runID).then(function(data){
              if(data.data)
              {
                angular.forEach(data.data, function(data,keyb){
                  bonus.times.push({time:data.duration,playerid:data.id,name:data.name,rank:data.rank,timediff:data.timediff});
                });
                for (var i = bonus.times.length - 1; i >= 0; i--) {
                  bonus.times[i].timediff=(bonus.times[i].timediff<0.001)?0:bonus.times[i].timediff;
                  if(bonus.times[i].playerid==$scope.playerid)
                  {
                    bonus.times.unshift(bonus.times[i]);
                    bonus.times.splice(i+1,1);
                  }
                }
              }              
            });
          });
        }
      });
    }
    else
    {
      $location.path('/maps/').replace();
    }
  });
}]);