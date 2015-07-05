app.controller('reportsPageCtrl',['$scope','report','user','services', function ($scope, report, user, services) {
  $scope.reports=[];
  $scope.page=1;
  $scope.end=false;
  $scope.canReport=false;
  $scope.working=false;
  $scope.form={};
  $scope.form.item={};
  $scope.items=[];
  $scope.loadMore = function(){
  	report.getReportsPage($scope.page).then(function(data){
  		if(data.data[0])
  		{
  		  if($scope.reports.length == 0)
  		  	$scope.reports=angular.copy(data.data);
  		  else
  		  	$scope.reports=$scope.reports.concat(data.data);
  		  $scope.page++;
  		}
  		else
  		  $scope.end=true;
  	});
  }
  $scope.sendReport = function(){
    if(!$scope.canReport || $scope.working || !$scope.form.item.id || !$scope.form.reason) return;
    var i=$scope.reportIndex;
    $scope.working=true;
    services.addReport($scope.form.reason,($scope.form.type === 'player'?$scope.form.item.id:0),
      ($scope.form.type === 'map'?$scope.form.item.id:0),0,0,0,
      $scope.form.type, $scope.form.screenshot).then(function(data){
      if(data.data.success)
      {
        $scope.form={};
        $scope.form.item={};
        $scope.items=[];
      }
      $scope.working=false;
    });
  }
  $scope.reportRight = function(){
    user.canReport().then(function(data){
      if(data.data===1){
        $scope.canReport = true;
      }
    });
  }
  $scope.itemClass = function(itemid){
    if($scope.form.item.id===itemid)
      return 'valid';
  }
  $scope.setType = function(type){
    $scope.form.type = type;
  }
  $scope.typeClass = function(type){
    if($scope.form.type===type)
      return 'valid';
  }
  $scope.setItem = function(itemid){
    $scope.form.item.id = itemid;
  }
  $scope.$watch('form.searchItem', function (tmpStr)
  {
    if (!tmpStr || tmpStr.length == 0)
    {
      $scope.players=[];
      return 0;
    }
    setTimeout(function() {

      // if searchStr is still the same..
      // go ahead and retrieve the data
      if (tmpStr === $scope.form.searchItem)
      {
        if($scope.form.type === "player")
        {
          services.searchPlayers($scope.form.searchItem).then(function(data){
            if(data.data && !data.data.error)
            {
              $scope.items = angular.copy(data.data);
            }
          });
        }
        else if($scope.form.type === "map")
        {
          services.searchMaps($scope.form.searchItem).then(function(data){
            if(data.data && !data.data.error)
            {
              $scope.items = angular.copy(data.data);
            }
          });
        }
      }
    }, 500);
  });
  $scope.$on('user:updated', function(event,data) {
     $scope.you = user.user.playerid;
     $scope.reportRight();
  });
  $scope.$on('user:logout', function(event,data) {
     $scope.you = 0;
     $scope.canReport=false;
  });
  $scope.loadMore();
  $scope.reportRight();
}]);

app.controller('reportCtrl',['$scope','report','user','$routeParams','$location', function ($scope, report, user,$routeParams,$location) {
	$scope.reportRow={};
	$scope.form={};
	$scope.statuses = [
    {value: 0, text: 'Pending'},
    {value: 1, text: 'Action taken'},
    {value: 2, text: 'No action taken'}
  ]; 
	$scope.reportid=$routeParams.id;
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
  $scope.$watch('form.status', function(newVal, oldVal) {
    if (newVal !== oldVal) {
      $scope.changeStatus(newVal);
    }
  });
  $scope.changeStatus = function(status){
  	report.changeStatus($scope.reportid,status).then(function(data){
  		if(data.data.status)
  			$scope.form.finalstatus=data.data.status;
  	});
  }
  $scope.delete = function(){
  	if(!$scope.isAdmin) return;
  	if(confirm('Are you sure?'))
  	{
  		report.delReport($scope.reportid).then(function(data){
	  		if(data.data===1)
	  			$location.path('/report').replace();
	  		return false;
	  	});
  	}

  }
  report.getReport($scope.reportid).then(function(data){
		if(data.data)
		{
			$scope.reportRow=angular.copy(data.data);
			$scope.form.status=$scope.reportRow.status;
			$scope.form.finalstatus=$scope.reportRow.status;
		}
	});

}]);