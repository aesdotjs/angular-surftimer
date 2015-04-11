app.factory("services", ['$http', function($http) {
  var serviceBase = 'services/';
  var obj = {};
  obj.getPlayers = function(){
    return $http.get(serviceBase + 'players');
  }
  obj.getPlayer = function(playerID){
    return $http.get(serviceBase + 'player?id=' + playerID);
  }
  obj.getScoreRank = function(playerID,ccode){
    return $http.get(serviceBase + 'scorerank?id=' + playerID+'&ccode='+ccode);
  }
  obj.getTotalPlayers = function(ccode){
    return $http.get(serviceBase + 'totalplayers?ccode='+ccode);
  }
  obj.getPoints = function(playerID){
    return $http.get(serviceBase + 'points?id=' + playerID);
  }
  obj.getPlayerComplete = function(playerID, runID){
    return $http.get(serviceBase + 'playercomplete?id=' + playerID+'&runid='+runID);
  }
  obj.getStageAmount = function(){
    return $http.get(serviceBase + 'stageamount');
  }
  obj.getStageFinished = function(playerID){
    return $http.get(serviceBase + 'stagefinished?id=' + playerID);
  }
  obj.getTop10PlaceAmount = function(playerID){
    return $http.get(serviceBase + 'top10placeamount?id=' + playerID);
  }
  obj.getPlaceAmount = function(playerID,runID,place,stage){
    return $http.get(serviceBase + 'placeamount?id=' + playerID+'&runid='+runID+'&place='+place+'&stage='+stage);
  }
  obj.getRecords = function(playerID,runID){
    return $http.get(serviceBase + 'records?id=' + playerID+'&runid='+runID);
  }
  obj.getStageRecords = function(playerID){
    return $http.get(serviceBase + 'stagerecords?id='+playerID);
  }
  obj.getMapWorldRecords = function(playerID){
    return $http.get(serviceBase + 'mapworldrecords?id='+playerID);
  }
  obj.getStageWorldRecords = function(playerID){
    return $http.get(serviceBase + 'stageworldrecords?id='+playerID);
  }
  obj.getBonusWorldRecords = function(playerID){
    return $http.get(serviceBase + 'bonusworldrecords?id='+playerID);
  }
  obj.getMaps = function(){
    return $http.get(serviceBase + 'maps');
  }
  obj.getMapsTimesPlayers = function(){
    return $http.get(serviceBase + 'mapstimesplayers');
  }
  obj.getMap = function(mapID){
    return $http.get(serviceBase + 'map?mapid=' + mapID);
  }  
  obj.getMapCompletion = function(mapID){
    return $http.get(serviceBase + 'completion?mapid=' + mapID);
  } 
  obj.getMapStages = function(mapID){
    return $http.get(serviceBase + 'mapstages?mapid=' + mapID);
  }
  obj.getMapBonuses = function(mapID){
    return $http.get(serviceBase + 'mapbonuses?mapid=' + mapID);
  }
  obj.getMapStageRecords = function(stageID){
    return $http.get(serviceBase + 'mapstagerecords?stageid=' + stageID);
  }
  obj.getMapRecords = function(mapID,runID){
    return $http.get(serviceBase + 'maprecords?mapid=' + mapID+'&runid='+runID);
  }
  obj.getPlayerListRank = function(ccode){
    return $http.get(serviceBase + 'playerlistrank?ccode=' + ccode);
  }
  obj.getCommands = function(){
    return $http.get('app/commands.json');
  }
  obj.getRecentBroken = function(type){
    return $http.get(serviceBase + 'recentbroken?type='+type);
  }
  obj.checkSteamId = function(steamID){
    return $http.get(serviceBase + 'checksteamid?steamid='+steamID);
  }
  obj.searchPlayers = function(searchtext){
    return $http.get(serviceBase + 'searchplayers?search='+searchtext);
  }
  obj.searchMap = function(searchtext){
    return $http.get(serviceBase + 'searchmap?search='+searchtext);
  }
  obj.getServerInfo = function(){
    return $http.get(serviceBase + 'serverinfo');
  }
  obj.isLoged = function(){
    return $http.get(serviceBase + 'isloged');
  }
  obj.logout = function(){
    return $http.get(serviceBase + 'logout');
  }
  return obj;   
}]);

app.factory("user", ['$http', function($http) {
  var serviceBase = 'services/';
  var obj = {};
  obj.logged=false;
  obj.user={};
  obj.isLoged = function(){
    $http.get(serviceBase + 'isloged').then(function(data){
      if(data.data.steamid)
      {
        obj.user=data.data;
        obj.logged=true;
        return true;
      }
      return false;
    });
  }
  obj.logout = function(){
    $http.get(serviceBase + 'logout').then(function(data){
      obj.logged=false;
      obj.user={};
    });
  }
  return obj;   
}]);

app.factory('Progress', function (ngProgress) {
    var timer;
    return {
        start: function () {
            var me = this;
            // reset the status of the progress bar
            me.reset();
            // if the `complete` method is not called
            // complete the progress of the bar after 5 seconds
            timer = setTimeout(function () {
                me.complete();
            }, 5000);
        },
        complete: function () {
            ngProgress.complete();
            if (timer) {
                // remove the 5 second timer
                clearTimeout(timer);
                timer = null;
            }
        },
        reset: function () {             
            if (timer) {
                // remove the 5 second timer
                clearTimeout(timer);
                // reset the progress bar
                ngProgress.reset();
            }
            // start the progress bar
            ngProgress.start();
        }
    };
});

app.factory('interceptorNgProgress', function ($injector) {
  var complete_progress, getNgProgress, ng_progress, working;
  ng_progress = null;
  working = false;

  getNgProgress = function() {
    ng_progress = ng_progress || $injector.get("ngProgress");
    //ng_progress.color("rgb(207,181,150)");
    return ng_progress;
  };

  complete_progress = function() {
    var ngProgress;
    if (working) {
      ngProgress = getNgProgress();
      ngProgress.complete();
      return working = false;
    }
  };

  return {
    request: function(request) {
      var ngProgress;
      ngProgress = getNgProgress();
      if (request.url.indexOf('.html') > 0) {
        return request;
      }
      if (!working) {
        ngProgress.reset();
        ngProgress.start();
        working = true;
      }
      return request;
    },
    requestError: function(request) {
      complete_progress();
      return request;
    },
    response: function(response) {
      complete_progress();
      return response;
    },
    responseError: function(response) {
      complete_progress();
      return response;
    }
  }
});