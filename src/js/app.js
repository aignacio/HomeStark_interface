var hero = angular.module('superhero', ['ui.bootstrap',
                                        'ngRoute',
                                        'homeStarkControllers']);
hero.config(['$controllerProvider',
  function($controllerProvider) {
    $controllerProvider.allowGlobals();
  }
]);

hero.config(['$routeProvider',function($routeProvider) {
  $routeProvider.
    when('/dash', {
      templateUrl: '/pages/dash.ejs',
      controller: ''
    }).
    when('/devices', {
      templateUrl: '/pages/windows/devices.ejs',
      controller: ''
    }).
    when('/about', {
      templateUrl: '/pages/windows/about.ejs',
      controller: ''
    }).
    otherwise({
      redirectTo: '/about',
      controller: ''
    });
}]);
