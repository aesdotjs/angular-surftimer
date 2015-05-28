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
