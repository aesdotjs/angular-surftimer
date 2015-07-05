(function() {
  'use strict';

  app.directive('aesChat', Chat);

  function Chat() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/chat/chat.html',
      replace: true,
      scope: true,
      link: link,
      controller: ChatCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  ChatCtrl.$inject = ['$scope','user','chat','$rootScope','$interval','$element'];

  function ChatCtrl($scope,user,chat,$rootScope,$interval,$element) {
    var vm = this;
    vm.playerid = user.user.playerid;
    vm.playername = user.user.personaname;
    vm.canChat = vm.playerid>0;
    vm.page=1;
    vm.newMessage="";
    vm.working=false;
    $scope.$on('user:updated', function(event,data) {
       vm.playerid = user.user.playerid;
       vm.playername = user.user.personaname;
       vm.canChat = true;
    });
    $scope.$on('user:logout', function(event,data) {
       vm.playerid = 0;
       vm.playername = "";
       vm.canChat = false;
    });

    chat.getChatPage(vm.page).then(function(data){
      if(data.data)
      {
        vm.messages = angular.copy(data.data);
        vm.updateLastId();
        vm.page++;
       vm.scrollBottom();
      }
    });
    $scope.loadMore = function(){
      $scope.working=true;
      chat.getChatPage(vm.page).then(function(data){
        if(data.data[0])
        {
          if(vm.messages.length == 0)
            vm.messages=angular.copy(data.data);
          else
            vm.messages=vm.messages.concat(data.data);
          vm.page++;
          $scope.working=false;
          angular.element($element[0].querySelector('.chatcont'))[0].scrollTop = 50;
        }
      });
    }
    vm.scrollBottom = function(){
      var elem=angular.element($element[0].querySelector('.chatcont'))[0];
      setTimeout(function(){elem.scrollTop = elem.scrollHeight},50);
    }
    vm.updateLastId = function(){
      vm.lastid = vm.messages[0].id;
    }
    vm.submitMessage = function(){
      if(vm.working===false)
      {
        vm.working=true;
        chat.addMessage(vm.newMessage).then(function(data){
          if(data.data && !data.data.error)
          {
            vm.messages.unshift(data.data);
            vm.updateLastId();
            vm.newMessage="";
            vm.scrollBottom();
          }
          vm.working=false;
        });
      }
    }
    vm.options = {
      link             : true,      //convert links into anchor tags
      linkTarget       : '_blank',   //_blank|_self|_parent|_top|framename
      pdf              : {
        embed: false                 //to show pdf viewer.
      },
      image            : {
        embed: true                //to allow showing image after the text gif|jpg|jpeg|tiff|png|svg|webp.
      },
      audio            : {
        embed: true                 //to allow embedding audio player if link to
      },
      code             : {
          highlight  : false,        //to allow code highlighting of code written in markdown
      //requires highligh.js (https://highlightjs.org/) as dependency.
          lineNumbers: false        //to show line numbers
      },
      basicVideo       : false,     //to allow embedding of mp4/ogg format videos
      gdevAuth         :'AIzaSyAs83P5Sqo_fxNYjqIB3Sgwm-IpctUnmEA', // Google developer auth key for youtube data api
      video            : {
          embed           : true,    //to allow youtube/vimeo video embedding
          width           : null,     //width of embedded player
          height          : null,     //height of embedded player
          ytTheme         : 'dark',   //youtube player theme (light/dark)
          details         : false,    //to show video details (like title, description etc.)
      },
      tweetEmbed       : false,
      tweetOptions     : {
          //The maximum width of a rendered Tweet in whole pixels. Must be between 220 and 550 inclusive.
          maxWidth  : 400,
          //When set to true or 1 links in a Tweet are not expanded to photo, video, or link previews.
          hideMedia : false,
          //When set to true or 1 a collapsed version of the previous Tweet in a conversation thread
          //will not be displayed when the requested Tweet is in reply to another Tweet.
          hideThread: false,
          //Specifies whether the embedded Tweet should be floated left, right, or center in
          //the page relative to the parent element.Valid values are left, right, center, and none.
          //Defaults to none, meaning no alignment styles are specified for the Tweet.
          align     : 'none',
          //Request returned HTML and a rendered Tweet in the specified.
          //Supported Languages listed here (https://dev.twitter.com/web/overview/languages)
          lang      : 'en'
      },
      twitchtvEmbed    : true,
      dailymotionEmbed : true,
      tedEmbed         : true,
      dotsubEmbed      : true,
      liveleakEmbed    : true,
      soundCloudEmbed  : true,
      soundCloudOptions: {
          height      : 160, themeColor: 'f50000',   //Hex Code of the player theme color
          autoPlay    : false,
          hideRelated : false,
          showComments: true,
          showUser    : true,
          showReposts : false,
          visual      : false,         //Show/hide the big preview image
          download    : false          //Show/Hide download buttons
      },
      spotifyEmbed     : true,
      codepenEmbed     : true,        //set to true to embed codepen
      codepenHeight    : 300,
      jsfiddleEmbed    : true,        //set to true to embed jsfiddle
      jsfiddleHeight   : 300,
      jsbinEmbed       : true,        //set to true to embed jsbin
      jsbinHeight      : 300,
      plunkerEmbed     : true,        //set to true to embed plunker
      githubgistEmbed  : true,
      ideoneEmbed      : true,        //set to true to embed ideone
      ideoneHeight:300
    };
    var poll = $interval(function(){
      chat.pollChat(vm.lastid).then(function(data){
        if(angular.isArray(data.data))
        {
          for(var i=0;i<data.data.length;i++)
          {
            vm.messages.unshift(data.data[i]);
          }          
          vm.updateLastId();
          vm.scrollBottom();
        }
      });
    },5000);

  }
  app.directive('serverString', function() {
    return {
      restrict: 'E',
      scope: {
        server: '='
      },
      replace:true,
      template: '<span>{{servername}}</span',
      link : function(scope){
        switch(scope.server){
          case -1:
            scope.servername="*WEB*";
            break;
          case 0:
            scope.servername="*PUBLIC*";
            break;
          case 1:
            scope.servername="*VETERAN*";
            break;
        }
      }
    };
  });

})();
