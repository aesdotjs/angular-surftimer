(function() {
  'use strict';

  app.directive('widgetRecentlyBroken', widgetRecentlyBroken);

  function widgetRecentlyBroken() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/widgetrecentlybroken/widgetrecentlybroken.html',
      replace: true,
      scope: true,
      link: link,
      controller: recentlyBrokenCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  recentlyBrokenCtrl.$inject = ['$scope','services','$interval'];

  function recentlyBrokenCtrl($scope, services, $interval) {
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
  }
})();
