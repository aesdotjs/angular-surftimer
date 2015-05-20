app.controller('menuCtrl',['$scope','services','$location', function ($scope, services,$location) {
  $scope.current="";
  $scope.toggleMaps=false;
  $scope.togglePlayers=false;
  $scope.minm=0,$scope.maxm=30;
  $scope.searchtext="";
  $scope.loadMore = function(type){
    if(type==0)
    {
      $scope.maxm+=10;
    }
  };
  $scope.menuClass = function(page) {
    var current = $location.path().split('/')[1];
    return page === current ? "active" : "";
  };
  $scope.showMaps=function(){
   if($scope.current === "Maps")
   {
     $scope.current="";
     $scope.toggleMaps=false;
     return;
   }
   $scope.current="Maps";
   $scope.toggleMaps=true;
   $scope.togglePlayers=false;
  }
  $scope.$watch('searchMap', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
      return 0;
    $scope.toggleMaps=true;
  });
  $scope.$watch('searchtext', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
      return 0;
    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.searchtext)
      {
        services.searchPlayers($scope.searchtext).then(function(data){
          if(data.data)
          {
            $scope.players = data.data;
            $scope.current="Players";
            $scope.togglePlayers=true;
            $scope.toggleMaps=false;
          }

        });
      }
    }, 500);
  });
  services.getMaps().then(function(data){
    $scope.maps = data.data;
  });
  
}]);

app.controller('activityCtrl',['$scope','services','$interval', function ($scope, services, $interval) {
  $scope.activities=[];
  $scope.page=1;
  $scope.end=false;
  $scope.lastid=0;
  $scope.loadMore = function(){
    if(!$scope.end)
    {
      $scope.working=true;
      services.getActivity($scope.page,0,0).then(function(data){
        if(data.data[0])
        {
          if($scope.activities.length == 0)
            $scope.activities=angular.copy(data.data);
          else
            $scope.activities=$scope.activities.concat(data.data);
          $scope.page++;
          $scope.lastid=$scope.activities[0].psid;
        }
        else
          $scope.end=true;
        $scope.working=false;
      });
    }
  };
  var poll = $interval(function(){
      services.getActivity(1,$scope.lastid,1).then(function(data){
        if(data.data.length)
        {
          for(i=data.data.length-1;i>=0;i--)
          {
            $scope.activities.unshift(data.data[i]);
          }          
          $scope.lastid=$scope.activities[0].psid;
        }
      });
    },30000);
  $scope.loadMore();
}]);

app.controller('recentlyBrokenCtrl',['$scope','services','$interval', function ($scope, services, $interval) {
  $scope.brokenRecords=[];
  $scope.page=1;
  $scope.end=false;
  $scope.lastid=0;
  $scope.loadMore = function(){
    if(!$scope.end)
    {
      $scope.working=true;
      services.getRecentlyBroken($scope.page,0,0).then(function(data){
        if(data.data[0])
        {
          if($scope.brokenRecords.length == 0)
            $scope.brokenRecords=angular.copy(data.data);
          else
            $scope.brokenRecords=$scope.brokenRecords.concat(data.data);
          $scope.page++;
          $scope.lastid=$scope.brokenRecords[0].psid;
        }
        else
          $scope.end=true;
        $scope.working=false;
      });
    }
  };
  var poll = $interval(function(){
      services.getRecentlyBroken(1,$scope.lastid,1).then(function(data){
        if(data.data.length)
        {
          for(i=data.data.length-1;i>=0;i--)
          {
            $scope.brokenRecords.unshift(data.data[i]);
          }          
          $scope.lastid=$scope.brokenRecords[0].psid;
        }
      });
    },30000);
  $scope.loadMore();
}]);

app.controller('onlinePlayersCtrl',['$scope','services','$interval', function ($scope, services, $interval) {
  $scope.players=[];
  $scope.checkPlayers = function(){
    services.getOnlinePlayers().then(function(data){
      if(data.data)
      {
        $scope.players=angular.copy(data.data);
      }
    });
  }
  $scope.checkPlayers();
  var poll = $interval(function(){
      $scope.checkPlayers();
    },30000);
}]);