app.controller('newsPageCtrl',['$scope','news','user', function ($scope, news, user) {
  $scope.news=[];
  $scope.sending=false;
  $scope.form={};
  $scope.page=1;
  $scope.end=false;
  $scope.isAdmin=false;
  user.isAdmin().then(function(data){
    if(data.data===1){
     $scope.isAdmin = true;
    }
  });
  $scope.$on('user:updated', function(event,data) {
  	user.isAdmin().then(function(data){
      if(data.data===1){
      	$scope.isAdmin = true;
      }
    });
  });
  $scope.$on('user:logout', function(event,data) {
     $scope.isAdmin = false;
  });
  $scope.loadMore = function(){
  	news.getNewsPage($scope.page).then(function(data){
  		
  		if(data.data[0])
  		{
  		  if($scope.news.length == 0)
  		  	$scope.news=angular.copy(data.data);
  		  else
  		  	$scope.news=$scope.news.concat(data.data);
  		  $scope.page++;
  		}
  		else
  		  $scope.end=true;
  	});
  }

  $scope.sendNews = function(){
    if($scope.sending===false && $scope.form.newnews 
    	&& $scope.form.newnews.length>3 && $scope.form.newtitle 
    	&& $scope.form.newtitle.length>3 && $scope.isAdmin)
    {
      $scope.sending=true;
      news.addNews($scope.form.newtitle,$scope.form.newnews).then(function(data){
        $scope.sending=false;
        var row=data.data;
        if(row)
        {          
          if(row.error)
          {
            console.log(row.error)
            return;
          }
          if(row.news_id)
          {
            row.body=$scope.form.newnews;
            $scope.news.unshift(row);
            $scope.form.newnews="";
            $scope.form.newtitle="";
          }
        }      
      });
    }
  };
  $scope.loadMore();
}]);
app.controller('newsCtrl',['$scope','news','user','$routeParams','$location', function ($scope, news, user, $routeParams,$location) {
	$scope.post={};
	$scope.newsid=$routeParams.id;
	$scope.isAdmin=false;
  user.isAdmin().then(function(data){
    if(data.data===1){
     $scope.isAdmin = true;
    }
  });
  $scope.$on('user:updated', function(event,data) {
  	user.isAdmin().then(function(data){
      if(data.data===1){
      	$scope.isAdmin = true;
      }
    });
  });
  $scope.$on('user:logout', function(event,data) {
     $scope.isAdmin = false;
  });
  $scope.edit = function(data){
  	if(!$scope.isAdmin) return;
  	news.updateNews($scope.newsid,data).then(function(data){
  		if(data.data===1)
  			return true;
  		return false;
  	});

  }
  $scope.editTitle = function(data){
  	if(!$scope.isAdmin) return;
  	news.updateNewsTitle($scope.newsid,data).then(function(data){
  		if(data.data===1)
  			return true;
  		return false;
  	});
  }
  $scope.delete = function(){
  	if(!$scope.isAdmin) return;
  	if(confirm('Are you sure?'))
  	{
  		news.delNews($scope.newsid).then(function(data){
	  		if(data.data===1)
	  			$location.path('/news').replace();
	  		return false;
	  	});
  	}

  }
  news.getNews($scope.newsid).then(function(data){
		if(data.data)
		{
			$scope.post=angular.copy(data.data);
		}
	});
}]);