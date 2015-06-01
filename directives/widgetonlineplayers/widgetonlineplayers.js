(function() {
  'use strict';

  app.directive('widgetOnlinePlayers', widgetOnlinePlayers);

  function widgetOnlinePlayers() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/widgetonlineplayers/widgetonlineplayers.html',
      replace: true,
      scope: true,
      link: link,
      controller: onlinePlayersCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  onlinePlayersCtrl.$inject = ['$scope','services','$interval'];

  function onlinePlayersCtrl($scope, services, $interval) {
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
  }
})();
