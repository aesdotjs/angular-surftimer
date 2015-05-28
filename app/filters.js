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
app.filter('reverse', function() {
  return function(items) {
    if (!angular.isArray(items)) return false;
    return items.slice().reverse();
  };
});