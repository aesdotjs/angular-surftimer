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
  obj.getPlayerListRank = function(ccode,sort,page){
    return $http.get(serviceBase + 'playerlistrank?ccode=' + ccode +'&sort='+sort+'&page='+page);
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
  obj.searchMaps = function(searchtext){
    return $http.get(serviceBase + 'searchmaps?search='+searchtext);
  }
  obj.getServerInfo = function(address,port){
    return $http.get(serviceBase + 'serverinfo?server='+address+'&port='+port);
  }
  obj.isLoged = function(){
    return $http.get(serviceBase + 'isloged');
  }
  obj.logout = function(){
    return $http.get(serviceBase + 'logout');
  }
  obj.getWidget = function(type){
    return $http.get(serviceBase + 'widget?type='+type);
  }
  obj.getActivity = function(page,lastid,bar){
    return $http.get(serviceBase + 'activity?page='+page+'&lastid='+lastid+(bar?'&noprogress':''));
  }
   obj.getRecentlyBroken = function(page,lastid,bar){
    return $http.get(serviceBase + 'recentlybroken?page='+page+'&lastid='+lastid+(bar?'&noprogress':''));
  }
  obj.getPlayerSet = function(id,page){
    return $http.get(serviceBase + 'playerset?id='+id+'&page='+page);
  }
  obj.getPlayerBroken = function(id,page){
    return $http.get(serviceBase + 'playerbroken?id='+id+'&page='+page);
  }
  obj.getPrinfo = function(playerid,mapid){
    return $http.get(serviceBase + 'prinfo?playerid='+playerid+'&mapid='+mapid);
  }
  obj.getOnlinePlayers = function(){
    return $http.get(serviceBase + 'onlineplayers');
  }
  obj.addReport = function(body,reportedpid,mapid,runid,stageid,duration){
    return $http.post(serviceBase+'addreport',{
      'report' : body,
      'reported_player_id' : reportedpid,
      'map_id' : mapid,
      'runid' : runid,
      'stage_id' : stageid,
      'duration' : duration
    });
  }
  return obj;   
}]);

app.factory("user", ['$http','$rootScope','ngProgress', function($http,$rootScope,ngProgress) {
  var serviceBase = 'services/';
  var obj = {};
  obj.working=false;
  obj.logged=false;
  obj.user={};
  obj.isLoged = function(){
    if(!obj.working)
    {
      ngProgress.start();
      working=true;
    }
    $http.get(serviceBase + 'isloged?noprogress').then(function(data){
      if(data.data.steamid)
      {
        obj.user=data.data;
        obj.logged=true;
        $rootScope.$broadcast('user:updated',obj.user.playerid);
        ngProgress.complete();
        obj.working=false;
        return true;
      }
      return false;
    });
  }
  obj.logout = function(){
    $http.get(serviceBase + 'logout').then(function(data){
      obj.logged=false;
      obj.user={};
      $rootScope.$broadcast('user:logout','logout');
    });
  }
  obj.isAdmin = function(){
    return $http.get(serviceBase + 'admincheck');
  }
  obj.canReport = function(){
    return $http.get(serviceBase + 'canreport');
  }
  return obj;   
}]);
app.factory("news", ['$http', function($http) {
  var serviceBase = 'services/';
  var obj = {};
  obj.getNews = function(newsid){
    return $http.get(serviceBase + 'news?id='+newsid);
  }
  obj.getNewsPage = function(page){
    return $http.get(serviceBase + 'newspage?page='+page);
  }
  obj.addNews = function(title,body){
    return $http.post(serviceBase+'addnews',{
      'body' : body,
      'title' : title
    });
  };
  obj.delNews = function(id){
    return $http.post(serviceBase+'delnews',{
      'newsid' : id
    });
  };
  obj.updateNews = function(id,body){
    return $http.post(serviceBase+'updatenews',{
      'body' : body,
      'newsid' : id
    });
  };
  obj.updateNewsTitle = function(id,title){
    return $http.post(serviceBase+'updatenewstitle',{
      'title' : title,
      'newsid' : id
    });
  };
  return obj;   
}]);
app.factory("comment", ['$http','$rootScope','$routeParams','$location', function($http,$rootScope,$routeParams,$location) {
  var serviceBase = 'services/';
  var obj = {};
  obj.getTypeId = function(){
    obj.type = $location.path().split('/')[1];
    obj.itemId = $routeParams.id;
  }
  
  obj.getComments = function(){
    obj.getTypeId();
    return $http.get(serviceBase + 'comments?type='+obj.type+'&itemid='+obj.itemId);
  };
  obj.getLatestComments = function(page){
     return $http.get(serviceBase + 'latestcomments?page='+page);
  }
  obj.addComment = function(body,parentid){
    return $http.post(serviceBase+'addcomment',{
      'comment' : body,
      'parentid' : parentid,
      'type' : obj.type,
      'itemid' : obj.itemId
    });
  };
  obj.delComment = function(id){
    return $http.post(serviceBase+'delcomment',{
      commentid : id
    });
  };
  obj.updateComment = function(id,body){
    return $http.post(serviceBase+'updatecomment',{
      comment : body,
      commentid : id
    });
  };
  obj.getTypeId();
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

app.factory("errorService", [ function() {
  var obj = {};
  obj.error="";
  obj.errorlog=[];
  obj.setError = function(errorstring){
    obj.error=errorstring;
  }
  obj.delError = function(){
    obj.errorlog.push(obj.error);
    obj.error="";
  }
  return obj;   
}]);

app.factory('interceptorNgProgress', function ($injector) {
  var complete_progress, getNgProgress, ng_progress, working;
  ng_progress = null;
  errorService = null;
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

  getErrorService = function() {
    errorService = errorService || $injector.get("errorService");
    return errorService;
  };

  updateError = function(errorstring){
    var errorService=getErrorService();
    errorService.setError(errorstring);
  }

  return {
    request: function(request) {
      var ngProgress;
      ngProgress = getNgProgress();
      if (request.url.indexOf('.html') > 0) {
        return request;
      }
      if (request.url.indexOf('noprogress') > 0) {
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
      if(response.data && response.data.error)
        updateError(response.data.error);
      return response;
    }
  }
});