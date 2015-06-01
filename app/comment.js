app.controller('commentCtrl',['$scope','comment','user','$rootScope', function ($scope, comment, user, $rootScope) {
  $scope.toggleRespond=false;
  $scope.form={};
  $scope.sending=false;
  $scope.playerid=user.user.playerid;
  $scope.canModify=($scope.comment.poster_id===$scope.playerid);
  $scope.canComment=$scope.$parent.$parent.$parent.canComment;
  $scope.$on('user:updated', function(event,data) {
     $scope.playerid = user.user.playerid;
     $scope.canModify=($scope.comment.poster_id===$scope.playerid);
     $scope.canComment=$scope.playerid>0;
  });
  $scope.$on('user:logout', function(event,data) {
     $scope.playerid = 0;
     $scope.canModify=false;
     $scope.canComment=false;
  });
  $scope.sendResponse = function(){
    if($scope.sending===false && $scope.form.newresponse && $scope.form.newresponse.length>3)
    {
      $scope.sending=true;
      comment.addComment($scope.form.newresponse,$scope.comment.comment_id).then(function(data){
        $scope.sending=false;
        var row=data.data;
        if($scope.comment.children===null || !angular.isDefined($scope.comment.children))
          $scope.comment.children = [];
        if(row)
        {          
          if(row.error)
          {
            console.log(row.error)
            return;
          }
          if(row.comment_id)
          {
            data.data.comment=$scope.form.newresponse;
            $scope.comment.children.unshift(data.data);
            $scope.toggleRespond=false;
            $scope.form.newresponse="";
            $rootScope.$broadcast('comment:new',row.comment_id);
          }
        }      
      });
    }
  };

  $scope.edit = function(data){
    if($scope.playerid === $scope.comment.poster_id){
      comment.updateComment($scope.comment.comment_id,data).then(function(data){
         return true;
      });
    }
  }
  $scope.delete = function(index){
    if($scope.playerid === $scope.comment.poster_id){
      if(confirm('Are you sure? (it will delete the child comments too)'))
      {
        comment.delComment($scope.comment.comment_id).then(function(data){
          if($scope.$parent.$parent.comments)
            $scope.$parent.$parent.comments.splice(index,1);
        });
      }
    }
  }
  $scope.checkDepth = function(){
    return ($scope.commentDepth < 6 && $scope.canComment);
  }
}]);