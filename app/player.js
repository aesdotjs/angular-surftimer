app.controller('playersCtrl',['$scope','services','$routeParams', function ($scope, services,$routeParams) { 
  $scope.sort="rank";
  $scope.ccode=$routeParams.ccode || 0;
  $scope.end=false;
  $scope.page=0;
  $scope.players=[];
  $scope.loadMore = function(){
    $scope.page++;
    $scope.fetchPlayers();
  }
  $scope.fetchPlayers = function(){
    if($scope.end) return;
    services.getPlayerListRank($scope.ccode,$scope.sort,$scope.page).then(function(data){
      if(data.data)
      {
        if($scope.players.length == 0)
          $scope.players = angular.copy(data.data);
        else
          $scope.players = $scope.players.concat(data.data);
      }
      else
        $scope.end=true;
    });
  }
  $scope.$watch('sort', function (tmpStr)
  {
    $scope.page=0;
    $scope.end=false;
    $scope.players=[];
    $scope.loadMore();
  });
  $scope.$watch('searchPlayer', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
      return;
    if (tmpStr && tmpStr.length == 0)
    {
      $scope.page=0;
      $scope.end=false;
      $scope.players=[];
      $scope.loadMore();
      return;
    }

    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.searchPlayer)
      {
        services.searchPlayers($scope.searchPlayer).then(function(data){
          if(data.data)
          {
            $scope.page=0;
            $scope.end=false;
            $scope.players = data.data;
          }
        });
      }
    }, 500);
  });
}]);


app.controller('playerCtrl',['$scope','services','$routeParams','$location', function ($scope, services, $routeParams,$location) {
  var currentid=$routeParams.id;
  $scope.max=[50,50,50,50,50,50];
  $scope.loadMore = function(nb){
    if(nb===-1){
      if(!$scope.endSet)
      {
        $scope.working=true;
        services.getPlayerSet(currentid,$scope.player.playerSetPage).then(function(data){
          if(data.data[0])
          {
            if($scope.player.playerSet.length == 0)
              $scope.player.playerSet=angular.copy(data.data);
            else
              $scope.player.playerSet=$scope.player.playerSet.concat(data.data);
            $scope.player.playerSetPage++;
          }
          else
          {
            $scope.endSet=true;
          }
          $scope.working=false;
        });
      }
      return;
    }
    else if(nb===-2){
      if(!$scope.endBroken)
      {
        $scope.working=true;
        services.getPlayerBroken(currentid,$scope.player.playerBrokenPage).then(function(data){
          if(data.data[0])
          {
            if($scope.player.playerBroken.length == 0)
              $scope.player.playerBroken=angular.copy(data.data);
            else
              $scope.player.playerBroken=$scope.player.playerBroken.concat(data.data);
            $scope.player.playerBrokenPage++;
          }
          else
          {
            $scope.endBroken=true;
          }
          $scope.working=false;
        });
      }
      return;
    }
    $scope.max[nb]+=50;
  }
  services.getPlayer(currentid).then(function(data){
    if(data.data.id)
    {
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
        $scope.player.completemap = data.data.complete || 0;
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
        $scope.player.completebonus = data.data.complete || 0;
        $scope.player.totalbonus = data.data.total;
      });
      services.getStageAmount().then(function(data){
        $scope.player.totalstage = data.data.cnt;
        services.getStageFinished(currentid).then(function(data){
          $scope.player.completestage = data.data.cnt || 0;
          $scope.player.completionpercent=((Number($scope.player.completemap) /Number($scope.player.totalmap))*100+(Number($scope.player.completestage) /Number($scope.player.totalstage))*100+(Number($scope.player.completebonus) /Number($scope.player.totalbonus))*100)/3;
        });
      });
      services.getTop10PlaceAmount(currentid).then(function(data){
        $scope.player.totaltop10 = data.data.am;
      });
      services.getPlaceAmount(currentid,0,1,false).then(function(data){
        $scope.player.topmap = data.data.amount||0;
      });
      services.getPlaceAmount(currentid,1,0,false).then(function(data){
        $scope.player.topbonus = data.data.amount||0;
      });
      services.getPlaceAmount(currentid,0,0,true).then(function(data){
        $scope.player.topstage = data.data.amount||0;
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
      services.getBonusWorldRecords(currentid).then(function(data){
        $scope.player.recordsbonuslist = data.data;
      });
      services.getBonusWorldRecords(currentid).then(function(data){
        $scope.player.recordsbonuslist = data.data;
      });
      $scope.player.playerSet=[];
      $scope.player.playerBroken=[];
      $scope.player.playerSetPage=1;
      $scope.player.playerBrokenPage=1;
      $scope.endSet=false;
      $scope.endBroken=false;
      $scope.loadMore(-1);
      $scope.loadMore(-2);
    }
    else
    {
      $location.path('/players/');
    }
  });
}]);