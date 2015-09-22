app.controller("HomeController", ["$scope", "$route", "$firebaseAuth", "$location", function($scope, $route, $firebaseAuth, $location) {
  $scope.message = "This is HomeController";
  var authRef = new Firebase("https://dazzling-inferno-3947.firebaseio.com");
  var authObj = $firebaseAuth(authRef);
  $scope.register = function() {
    authObj.$createUser($scope.user).then(function() {
      $scope.login();
    });
  };
  $scope.login = function() {
    authObj.$authWithPassword($scope.user).then(function() {
      $location.path('/jobs');
    }, function() {
      $scope.error = "Email and password doesn't match"
    });
  };
}]);

app.controller("SignUpController", ["$scope", "$route", function($scope, $route) {
  $scope.message = "This is SignUpController";
}]);

app.controller("DashboardController", ["$scope", "$route", "$firebaseArray", function($scope, $route, $firebaseArray) {
  $scope.message = "This is DashboardController";
  var saveJobs = new Firebase("https://dazzling-inferno-3947.firebaseio.com/jobs");
  $scope.jobs = $firebaseArray(saveJobs);
}]);

app.controller("JobSearchController", ["$scope", "$route", "$firebaseArray", "$http", function($scope, $route, $firebaseArray, $http) {
  $scope.message = "This is JobSearchController";
  $http.get("https://authenticjobs.com/api/?api_key=4534ad692cb05a0ef1c7e7b07f722cd0&method=aj.jobs.search&perpage=100&format=json")
    .then(function(response) {
      console.log(response);
      $scope.jobList = response.data.listings.listing;
    });
  $scope.searchJob = function(search) {
    $http.get("https://authenticjobs.com/api/?api_key=4534ad692cb05a0ef1c7e7b07f722cd0&method=aj.jobs.search&keywords=" +search+ "&perpage=100&format=json")
      .then(function(response) {
        console.log(response);
        $scope.jobList = response.data.listings.listing;

      });
  };
}]);

app.controller("JobShowController", ["$scope", "$route", "$firebaseArray", "$http", "$routeParams", "$firebaseAuth", "$location", "user", function($scope, $route, $firebaseArray, $http, $routeParams, $firebaseAuth, $location, user) {
  user.data = {foo: "bar"};
  console.log(user);
  var authRef = new Firebase("https://dazzling-inferno-3947.firebaseio.com");
  var authObj = $firebaseAuth(authRef);
  $scope.message = "This is JobShowController";
  $http.get("https://job-search-backend.herokuapp.com/jobs/" + $routeParams.id)
  .then(function(response) {
    $scope.job = response.data.data;
    console.log($scope.job);
        var jobDescript = document.getElementById("job-descript");
        var howApply = document.getElementById("how-apply");
        jobDescript.innerHTML = response.data.data.listing.description;
        howApply.innerHTML = response.data.data.listing.howto_apply;
  });
  $scope.logout = function() {
    authObj.$unauth();
    $location.path('/');
  };
}]);

app.controller("CoverLetterController", ["$scope", "$route", "$http", function($scope, $route, $http) {
  $scope.message = "This is CoverLetterController";
  $scope.CLMessage = "Hello";
  $scope.JDMessage = "World";
  $scope.getDataCL = function (input) {
    $scope.CLMessage = input;
    $http.post("https://job-search-backend.herokuapp.com/", {text: input})
      .then(function(response) {
        console.log(response);
        $scope.CLReturn = response.data.tree.children;
      }, function (response) {
        console.log("error");
      });
  };
  $scope.getDataJD = function (input) {
    $scope.JDMessage = input;
    $http.post("https://job-search-backend.herokuapp.com/", {text: input})
      .then(function(response) {
        console.log(response);
        $scope.JDReturn = response.data.tree.children;
      }, function (response) {
        console.log("error");
      });
  };
  $scope.getVerbs = function (input) {
    $http.post("https://job-search-backend.herokuapp.com/verbs", {text: input})
      .then(function(response) {
        console.log(response);
        var array = response.data.relations;
        $scope.verbsObj = {};
        array.forEach(function(item, index) {
          $scope.verbsObj[item.action.verb.text] = 1;
        });
        $scope.verbs = [];
        $scope.verbsSyn = {};
        for (var verb in $scope.verbsObj) {
          $scope.verbs.push(verb);
        }
      }, function(response) {
        console.log("error verbs");
      }).then(function(response) {
        $scope.verbs.forEach(function(item, index) {
          $http.post("http://words.bighugelabs.com/api/2/7c68e37641d493ff68e2d20f05132c78/" + item + "/json")
            .then(function(response) {
              console.log(response.data);
              $scope.verbsSyn[item] = response.data.verb;
            });

        });

      });
  };
    $scope.switchVerbs = function () {
      var paragraph = $scope.CLMessage;
      for (var verb in $scope.verbsSyn) {
        if ($scope.verbsSyn[verb]) {
          for (var j = 1; j < $scope.verbsSyn[verb].syn.length; j ++) {
            if (paragraph.match(" " + $scope.verbsSyn[verb].syn[j] + " ")) {
              paragraph = paragraph.replace(" " + $scope.verbsSyn[verb].syn[j] + " ", " " + $scope.verbsSyn[verb].syn[0] + " ");
            } else if (paragraph.match(" " + $scope.verbsSyn[verb].syn[j] + ".")) {
              paragraph = paragraph.replace(" " + $scope.verbsSyn[verb].syn[j] + ".", " " + $scope.verbsSyn[verb].syn[0] + ".");
            } else if (paragraph.match(" " + $scope.verbsSyn[verb].syn[j] + ",")) {
              paragraph = paragraph.replace(" " + $scope.verbsSyn[verb].syn[j] + ",", " " + $scope.verbsSyn[verb].syn[0] + ",");
            } else if (paragraph.match(" " + $scope.verbsSyn[verb].syn[j] + ":")) {
              paragraph = paragraph.replace(" " + $scope.verbsSyn[verb].syn[j] + ":", " " + $scope.verbsSyn[verb].syn[0] + ":");
            } else if (paragraph.match(" " + $scope.verbsSyn[verb].syn[j] + ";")) {
              paragraph = paragraph.replace(" " + $scope.verbsSyn[verb].syn[j] + ";", " " + $scope.verbsSyn[verb].syn[0] + ";");
            }
          }
        }
      }
      console.log(paragraph);
      $scope.CLMessageModified = paragraph;
    };
}]);
