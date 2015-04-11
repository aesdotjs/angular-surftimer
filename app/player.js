app.controller('playersCtrl',['$scope','services','$routeParams', function ($scope, services,$routeParams) { 
  $scope.sort="rank";
  $scope.ccode=$routeParams.ccode || 0;
  $scope.max=32;
  $scope.end=false;
  $scope.loadMore = function(){
    if($scope.max < $scope.players.length)
      $scope.max+=40;
    else
      $scope.end=true;
  }
  services.getPlayerListRank($scope.ccode).then(function(data){
    $scope.players = data.data;
  });
}]);
app.controller('playerCtrl',['$scope','services','$routeParams', function ($scope, services, $routeParams) {
  var currentid=$routeParams.id;
  $scope.max=[50,50,50,50,50,50];
  $scope.loadMore = function(nb){
    $scope.max[nb]+=50;
  }
  services.getPlayer(currentid).then(function(data){
    $scope.player = data.data;
    $scope.player.totalmappoints=Number($scope.player.mappoints)+Number($scope.player.bonuspoints)+Number($scope.player.stagepoints);
    services.getScoreRank(currentid,0).then(function(data){
      $scope.player.rank = data.data[0].cnt;
      $scope.player.timeontheserver = data.data[0].timeontheserver;
    });
    services.getScoreRank(currentid,$scope.player.countrycode).then(function(data){
      $scope.player.crank = data.data[0].cnt;
    });
    services.getTotalPlayers(0).then(function(data){
      $scope.player.totalplayers = data.data.cnt;
    });
    services.getTotalPlayers($scope.player.countrycode).then(function(data){
      $scope.player.totalcplayers = data.data.cnt;
    });
    services.getPlayerComplete(currentid,0).then(function(data){
      $scope.player.completemap = data.data.complete;
      $scope.player.totalmap = data.data.total;
    });
    services.getRecords(currentid,0).then(function(data){
      $scope.player.completemaplist = data.data;
    });
    services.getStageRecords(currentid).then(function(data){
      $scope.player.completestagelist = data.data;
    });
    services.getRecords(currentid,1).then(function(data){
      $scope.player.completebonuslist = data.data;
    });
    services.getPlayerComplete(currentid,1).then(function(data){
      $scope.player.completebonus = data.data.complete;
      $scope.player.totalbonus = data.data.total;
    });
    services.getStageAmount().then(function(data){
      $scope.player.totalstage = data.data.cnt;
      services.getStageFinished(currentid).then(function(data){
        $scope.player.completestage = data.data.cnt;
        $scope.player.completionpercent=((Number($scope.player.completemap) /Number($scope.player.totalmap))*100+(Number($scope.player.completestage) /Number($scope.player.totalstage))*100+(Number($scope.player.completebonus) /Number($scope.player.totalbonus))*100)/3;
      });
    });
    services.getTop10PlaceAmount(currentid).then(function(data){
      $scope.player.totaltop10 = data.data.am;
    });
    services.getPlaceAmount(currentid,0,1,false).then(function(data){
      $scope.player.topmap = data.data.amount;
    });
    services.getPlaceAmount(currentid,1,0,false).then(function(data){
      $scope.player.topbonus = data.data.amount;
    });
    services.getPlaceAmount(currentid,0,0,true).then(function(data){
      $scope.player.topstage = data.data.amount;
    });
    services.getMapWorldRecords(currentid).then(function(data){
      $scope.player.recordsmaplist = data.data;
    });
    services.getStageWorldRecords(currentid).then(function(data){
      $scope.player.recordsstagelist = data.data;
    });
    services.getBonusWorldRecords(currentid).then(function(data){
      $scope.player.recordsbonuslist = data.data;
    });
  });
}]);