var homeStarkController = angular.module('homeStarkControllers', ['ui.bootstrap',
                                                                  'ngRoute']);

homeStarkController.controller('loginCtrl',['$scope',function ($scope) {
  $scope.loadLogin = function(){
    $scope.class = "loading";
  };

}]);

homeStarkController.controller('dashCtrl',['$scope',function ($scope) {
  $scope.isNavCollapsed = true;
  $scope.isCollapsed = false;
  $scope.isCollapsedHorizontal = false;
}]);
