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
    when('/about', {
      templateUrl: '/pages/about.ejs',
      controller: ''
    }).
    otherwise({
      redirectTo: '/control',
      controller: ''
    });
}]);
