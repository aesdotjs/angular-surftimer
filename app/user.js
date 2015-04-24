app.controller('userCtrl',['$scope','$interval','services','user', function ($scope, $interval, services,user) {
  $scope.user={};
  $scope.logged=false;
  var login;
  var cnt=0;
  var stop = function(){
    $interval.cancel(login);
    login=undefined;
    ctn=0;
  }
  $scope.$watch( function () { return user.user; }, function ( user ) {
    $scope.user = angular.copy(user);
  });
  $scope.$watch( function () { return user.logged; }, function ( logged ) {
    $scope.logged = logged;
    if(logged===true)
      stop();
  });
  $scope.login = function(){
    if(angular.isDefined(login)) return;
    login = $interval(function(){
      if(cnt>9)
        stop();        
      user.isLoged();
      cnt++;
    },3000);
  }
  $scope.logout = function(){
    user.logout();
  }
  user.isLoged();
}]);
