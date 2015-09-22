
app.config(["$routeProvider", function($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "partials/home.html",
      controller: "HomeController"
    })
    .when("/sign-up", {
      templateUrl: "partials/signup.html",
      controller: "SignUpController"
    })
    .when("/dashboard", {
      templateUrl: "partials/dashboard.html",
      controller: "DashboardController"
    })
    .when("/jobs", {
      templateUrl: "partials/jobs.html",
      controller: "JobSearchController",
      resolve: {user: resolveUser}
    })
    .when("/jobs/:id", {
      templateUrl: "partials/jobShow.html",
      controller: "JobShowController",
      resolve: {user: resolveUser}
    })
    .when("/cover-letter", {
      templateUrl: "partials/cover-letter.html",
      controller: "CoverLetterController"
    });
}]);

app.run(function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function (event, next, prev, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
});

function resolveUser($firebaseAuth){
  var authRef = new Firebase("https://dazzling-inferno-3947.firebaseio.com");
  var authObj = $firebaseAuth(authRef);
  return authObj.$requireAuth();

}
