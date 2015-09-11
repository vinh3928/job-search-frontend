
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .when("/sign-up", {
      templateUrl: "partials/signup.html",
      controller: "SignUpController"
    });
}]);
