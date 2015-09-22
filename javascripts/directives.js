
app.directive("syncToModel", [
  function() {
    return {
      restrict: "A",
      link: function(scope, elem, attrs) {
        elem.on('keyup keydown',function(event){
          scope.$apply(function(){
            scope[attrs.syncToModel]=elem.html();
          console.log(scope[attrs.syncToModel]);
          });
          
        });
      }
    }
  }
]);
