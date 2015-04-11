var app = angular.module('surftimer', ['ngRoute','ngProgress','ngAnimate']);

app.controller('mainCtrl',['$scope','services','ngProgress', function ($scope, services, ngProgress) {
  ngProgress.start();
  ngProgress.height('4px');
}]);
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
            $scope.players = data.data;
            $scope.current="Players";
            $scope.togglePlayers=true;
            $scope.toggleMaps=false;
          });
        }
      }, 1000);
    });
    /*$scope.searchPlayers=function(){
     if($scope.searchtext === "")
     {
       $scope.current="";
       $scope.togglePlayers=false;
       return;
     }
     if($scope.searchtext.length>2)
     {
       services.searchPlayers($scope.searchtext).then(function(data){
          $scope.players = data.data;
          $scope.current="Players";
          $scope.togglePlayers=true;
          $scope.toggleMaps=false;
        });
      }
   }*/
}]);

app.controller('rulesCtrl',['$scope','services', function ($scope, services) {

}]);

app.controller('commandsCtrl',['$scope','services', function ($scope, services) {
  services.getCommands().then(function(data){
      $scope.commands = data.data.commands;
  });
}]);



app.config(function ($httpProvider) {
  $httpProvider.interceptors.push('interceptorNgProgress');
});

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/', {
        title: 'Nightmare surf statitics - Home',
        templateUrl: 'partials/home.html',
        controller: 'homeCtrl'
      })
      .when('/player/:id', {
        title: 'Nightmare surf statitics - Player ',
        templateUrl: 'partials/player.html',
        controller: 'playerCtrl'
      })
       .when('/map/:id/', {
        title: 'Nightmare surf statitics - Map ',
        templateUrl: 'partials/map.html',
        controller: 'mapCtrl'
      })
      .when('/map/:id/:playerid', {
        title: 'Nightmare surf statitics - Map ',
        templateUrl: 'partials/map.html',
        controller: 'mapCtrl'
      })
      .when('/maps/', {
        title: 'Nightmare surf statitics - Maps ',
        templateUrl: 'partials/maps.html',
        controller: 'mapsCtrl'
      })
      .when('/players/:ccode', {
        title: 'Nightmare surf statitics - Players ',
        templateUrl: 'partials/players.html',
        controller: 'playersCtrl'
      })
      .when('/players/', {
        title: 'Nightmare surf statitics - Players ',
        templateUrl: 'partials/players.html',
        controller: 'playersCtrl'
      })
      .when('/rules/', {
        title: 'Nightmare surf statitics - Rules ',
        templateUrl: 'partials/rules.html',
        controller: 'rulesCtrl'
      })
      .when('/commands/', {
        title: 'Nightmare surf statitics - Commands ',
        templateUrl: 'partials/commands.html',
        controller: 'commandsCtrl'
      })
      .when('/donate/', {
        title: 'Nightmare surf statitics - Donate ',
        templateUrl: 'partials/donate.html',
        controller: 'donateCtrl'
      })
      .when('/server/', {
        title: 'Nightmare surf statitics - Server ',
        templateUrl: 'partials/server.html',
        controller: 'serverCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
/*app.run(['$location', '$rootScope','Progress', function($location, $rootScope,Progress) {
  $rootScope.$on('$locationChangeSuccess', function (event, current, previous) {
      Progress.start();
  });
}]);
app.run(['$location', '$rootScope','Progress', function($location, $rootScope,Progress) {
  $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
      $rootScope.title = current.$$route.title;
      Progress.complete();
  });
}]);*/