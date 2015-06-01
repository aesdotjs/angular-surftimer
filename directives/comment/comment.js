(function() {
  'use strict';

  app.directive('commentArea', commentArea);

  function commentArea() {

    var directive = {
      restrict: 'EA',
      templateUrl: 'directives/comment/comment.html',
      replace: true,
      scope: true,
      link: link,
      controller: cmtCtrl,
      controllerAs: 'vm'
    };
    function link(scope) {
    
    }

    return directive;
  }

  cmtCtrl.$inject = ['$scope','comment','user','$interval'];

  function cmtCtrl($scope,comment,user,$interval) {
    $scope.comments=[];
    $scope.sending=false;
    $scope.maxcomment=5;
    $scope.form={};
    $scope.playerid=user.user.playerid;
    $scope.canComment=$scope.playerid>0;
    $scope.lastid=0;
    $scope.$on('user:updated', function(event,data) {
       $scope.playerid = user.user.playerid;
       $scope.canComment=$scope.playerid>0;
    });
    $scope.$on('user:logout', function(event,data) {
       $scope.playerid = 0;
       $scope.canComment=false;
    });
    $scope.$on('comment:new', function(event,data) {
        $scope.lastid=data;
    });
    $scope.fetchComments = function(){
      function setMaxId(id){
        $scope.lastid= id > $scope.lastid?id:$scope.lastid;
      }
      function childrenMaxId(comment){
        if(angular.isArray(comment.children))
        {
          angular.forEach(comment.children,function(commentl,key){
            childrenMaxId(commentl);
          });        
        }
        else
          setMaxId(comment.comment_id);
      }
      comment.getComments().then(function(data){
        $scope.comments=angular.copy(data.data);
        angular.forEach($scope.comments,function(commentl,key){
          childrenMaxId(commentl);
        });
      });
    };
    
    $scope.sendComment = function(){
      if($scope.sending===false && $scope.form.newcomment && $scope.form.newcomment.length>3)
      {
        $scope.sending=true;
        comment.addComment($scope.form.newcomment,0).then(function(data){
          $scope.sending=false;
          var row=data.data;
          if(row)
          {          
            if(row.error)
            {
              return;
            }
            if(row.comment_id)
            {
              data.data.comment=$scope.form.newcomment;
              $scope.comments.unshift(data.data);
              $scope.form.newcomment="";
              $scope.lastid=data.data.comment_id;
            }
          }      
        });
      }
    };
    var poll = $interval(function(){
      comment.pollComments($scope.lastid).then(function(data){
        if(data.data === 1)
        {
            $scope.fetchComments();     
        }
      });
    },30000);
    $scope.fetchComments();
  }
})();
