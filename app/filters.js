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
app.directive('scrollIf', function () {
    var getScrollingParent = function(element) {
        element = element.parentElement;
        while (element) {
            if (element.scrollHeight !== element.clientHeight) {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    };
    return function (scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function(value) {
            if (value) {
                var sp = getScrollingParent(element[0]);
                var topMargin = parseInt(attrs.scrollMarginTop) || 0;
                var bottomMargin = parseInt(attrs.scrollMarginBottom) || 0;
                var elemOffset = element[0].offsetTop;
                var elemHeight = element[0].clientHeight;
                angular.element(element[0]).addClass('match');
                if (elemOffset - topMargin < sp.scrollTop) {
                    sp.scrollTop = elemOffset - topMargin;
                } else if (elemOffset + elemHeight + bottomMargin > sp.scrollTop + sp.clientHeight) {
                    sp.scrollTop = elemOffset + elemHeight + bottomMargin - sp.clientHeight;
                }
            }
        });
    }
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
