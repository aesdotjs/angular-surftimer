app.controller('reportsPageCtrl',['$scope','report', function ($scope, report) {
  $scope.reports=[];
  $scope.page=1;
  $scope.end=false;
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
  $scope.loadMore();
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