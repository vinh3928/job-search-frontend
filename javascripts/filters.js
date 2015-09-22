
app.filter('percentage', ['$filter', function ($filter) {
  return function (input, decimals) {
    return $filter('number')(input * 100, decimals) + "%";
  };
}]);

app.filter('abs', function () {
  return function(val) {
    return Math.abs(val);
  };
});

app.filter('shortDate', function () {
  return function(val) {
    val = val.split("").splice(0, 10).join("");
    return val;
  };
});
