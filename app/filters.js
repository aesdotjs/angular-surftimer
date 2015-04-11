app.filter('secondsToDateTime', [function() {
    return function(seconds) {
        return new Date(seconds*1000);
    };
}]);
app.filter('sub1', [function() {
    return function(month) {
        return parseInt(month)-1;
    };
}]);
app.directive("scroll", function ($window) {
    return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
          var max= this.scrollMaxY || Math.max( document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight) - this.innerHeight;;
          var scroll = this.pageYoffset || this.scrollY;
          if(scroll >= max && scope.end===false)
          {
            scope.$apply('loadMore()');
          }
        });
    };
});
app.directive("scrolllist", function ($window) {
    return function(scope, element, attrs) {
        angular.element(element).bind("scroll", function() {
          var elem =angular.element(this)[0];
          var max=elem.scrollTopMax || elem.scrollHeight-elem.offsetHeight;
          if(elem.scrollTop >= max)
            scope.$apply('loadMore('+attrs.scrolllist+')');
        });
    };
});
app.directive('repeatprogress',['Progress', function(Progress) {
  return function(scope, element, attrs) {
    if (scope.$first){
      Progress.start();
    }
    if (scope.$last){
      Progress.complete();
    }
  };
}]);
