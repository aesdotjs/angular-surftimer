app.controller('menuCtrl',['$scope','services','$location', function ($scope, services,$location) {
    $scope.current="";
    $scope.toggleMaps=false;
    $scope.togglePlayers=false;
    $scope.minm=0,$scope.maxm=30;
    $scope.searchtext="";
    $scope.loadMore = function(type){
      if(type==0)
        $scope.maxm+=10;
    };
    services.getMaps().then(function(data){
        $scope.maps = data.data;
    });
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
}]);