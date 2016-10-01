var homeStarkController = angular.module('homeStarkControllers', ['ui.bootstrap',
                                                                  'ngRoute']);

homeStarkController.controller('loginCtrl',['$scope',function ($scope) {
  $scope.loadLogin = function(){
    $scope.class = "loading";
  };

}]);
