(function() {
  'use strict';

  app.directive('widgetLiveActivity', widgetLiveActivity);

  function widgetLiveActivity() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/widgetliveactivity/widgetliveactivity.html',
      replace: true,
      scope: true,
      link: link,
      controller: activityCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  activityCtrl.$inject = ['$scope','services','$interval'];

  function activityCtrl($scope, services, $interval) {
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
            for(var i=data.data.length-1;i>=0;i--)
            {
              $scope.activities.unshift(data.data[i]);
            }          
            $scope.lastid=$scope.activities[0].psid;
          }
        });
      },30000);
    $scope.loadMore();
  }
})();
