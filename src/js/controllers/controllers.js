var homeStarkController = angular.module('homeStarkControllers', ['ui.bootstrap',
                                                                  'ngRoute']);

homeStarkController.controller('loginCtrl',['$scope',function ($scope) {
  $scope.loadLogin = function(){
    $scope.class = "loading";
  };

}]);

homeStarkController.controller('devicesCtrl',['$scope','$http',function ($scope,$http) {
  $scope.rowCollection = [
    {firstName: 'Laurent', lastName: 'Renard', birthDate: new Date('1987-05-21'), balance: 102, email: 'whatever@gmail.com'},
    {firstName: 'Blandine', lastName: 'Faivre', birthDate: new Date('1987-04-25'), balance: -2323.22, email: 'oufblandou@gmail.com'},
    {firstName: 'Francoise', lastName: 'Frere', birthDate: new Date('1955-08-27'), balance: 42343, email: 'raymondef@gmail.com'}
  ];
  // $scope.rowCollection = [];
  // $scope.displayedCollection = [];
  // $scope.displayedCollection = [].concat($scope.rowCollection);

  // $http({method: 'GET', url: '/devices/list'}).
  //   then(function(response) {
  //     for(var i=0;i<response.data.length;i++) {
  //       if(response.data[i].status.status == '1')
  //         response.data[i].status.status = 'OK';
  //       else
  //         response.data[i].status.status = 'Alerta';
  //
  //       if(response.data[i].status.dimmer == '0')
  //         response.data[i].status.dimmer = 'Desligada';
  //       else
  //         response.data[i].status.dimmer = response.data[i].status.dimmer+'%';
  //     }
  //     $scope.rowCollection = response.data;
  //     // console.log($scope.users);
  //   }, function(response) {
  //     $scope.data = response.data || "Request failed";
  //     $scope.status = response.status;
  //     console.log($scope.status);
  // });
}]);
