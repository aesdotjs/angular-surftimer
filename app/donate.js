app.controller('donateCtrl',['$scope','services', function ($scope, services) {
	$scope.steamvalid=1;
	$scope.checktext="";
	$scope.amount=0;
	$scope.plan=0;
	$scope.type=0;
	$scope.checkSteamId = function()
	{
		services.checkSteamId($scope.steamid).then(function(data){
			if (data.data && data.data.response.players.length>0)
			{
				$scope.steamvalid=2;
				$scope.checktext="";
				return;
			}
			$scope.checktext="This user has not yet set up their Steam Community profile. Please check to make sure you have entered the correct SteamID";
			$scope.steamvalid=0;
				 
	  	});
	}
	$scope.isValid = function(){
		switch($scope.steamvalid){
			case 0:
				return "invalid";
				break;
			case 1:
				return "";
				break;
			case 2:
				return "valid";
				break;
		}
	}
	$scope.setPlan = function(choice){
		$scope.plan=choice;
		$scope.calcAmount();
	}
	$scope.planClass= function(plan){
		if($scope.plan===plan)
			return 'valid';
	}
	$scope.setType = function(choice){
		$scope.type=choice;
		$scope.calcAmount();
	}
	$scope.typeClass= function(type){
		if($scope.type===type)
			return 'valid';
	}
	$scope.calcAmount= function(){
		$scope.amount=$scope.type*5*$scope.plan;
	}
	$scope.submit = function(){
		if($scope.steamvalid === 2 && $scope.plan > 0 && $scope.name != "" && $scope.steamid != "")
			return true;
		return false;
	}
}]);