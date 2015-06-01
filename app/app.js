
var app = angular.module('surftimer', ['ngRoute','ngProgress','ngAnimate','ngSanitize','btford.markdown','ui.comments','angularMoment','xeditable','matchMedia','angular-carousel'], function ($compileProvider) {
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|steam):/);
});

app.controller('mainCtrl',['$scope','services','ngProgress','screenSize', function ($scope, services, ngProgress, screenSize) {
  ngProgress.start();
  ngProgress.height('3px');
  ngProgress.color('#12709F');
  $scope.desktop = screenSize.on('sm, md, lg', function(match){
    $scope.desktop = match;
  });
  $scope.mobile = screenSize.on('xs', function(match){
    $scope.mobile = match;
  });
}]);


app.controller('rulesCtrl',['$scope','services', function ($scope, services) {

}]);

app.controller('commandsCtrl',['$scope','services','$routeParams', function ($scope, services,$routeParams) {
  services.getCommands().then(function(data){
      $scope.commands = data.data.commands;
      $scope.searchCommand=$routeParams.search || '';
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
      .when('/commands/:search', {
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
      .when('/news/', {
        title: 'Nightmare surf statitics - News ',
        templateUrl: 'partials/newspage.html',
        controller: 'newsPageCtrl'
      })
      .when('/news/:id', {
        title: 'Nightmare surf statitics - News ',
        templateUrl: 'partials/news.html',
        controller: 'newsCtrl'
      })
      .when('/report/', {
        title: 'Nightmare surf statitics - Record Reports ',
        templateUrl: 'partials/reportspage.html',
        controller: 'reportsPageCtrl'
      })
      .when('/report/:id', {
        title: 'Nightmare surf statitics - Record Report ',
        templateUrl: 'partials/report.html',
        controller: 'reportCtrl'
      })
      .when('/pr/:mapid/:playerid', {
        title: 'Nightmare surf statitics - Personal Records',
        templateUrl: 'partials/prinfo.html',
        controller: 'prinfoCtrl'
      })
      .when('/pr/', {
        title: 'Nightmare surf statitics - Personal Records',
        templateUrl: 'partials/prinfo.html',
        controller: 'prinfoCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
}]);
app.run(function(editableOptions) {
  editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
});
