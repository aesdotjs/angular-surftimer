(function() {
  'use strict';

  app.directive('alertBar', alertBar);

  function alertBar() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/alertbar/alertbar.html',
      replace: true,
      scope: true,
      link: link,
      controller: alertCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  alertCtrl.$inject = ['$scope','errorService','$timeout'];

  function alertCtrl($scope, errorService, $timeout) {
    $scope.error="";
    $scope.toggle=false;
    $scope.empty = function(){
      $scope.toggle=false;
      $scope.error="";
      errorService.delError();
    }
    $scope.$watch( function () { return errorService.error; }, function ( errorstring ) {
      if(errorstring.length>0 && errorstring != $scope.error)
      {
        $scope.error = errorstring;
        $scope.toggle=true;
        $timeout(function(){$scope.empty();},10000);
      }
    });
  }
})();
