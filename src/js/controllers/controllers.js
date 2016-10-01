var homeStarkController = angular.module('homeStarkControllers', []);

homeStarkController.controller('loginCtrl',['$scope',function ($scope) {
  $scope.loadLogin = function(){
    $scope.class = "loading";
  };
}]);
