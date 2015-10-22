angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    var accessPermissions = {
        loginRequired: true,
        rolesAllowed: ["admin", "user"],
        type: ["User"]
    }

	$routeProvider
		.when('/', {
            templateUrl: 'views/general.html',
            controller: 'Controller'
		})

        .when('/splash', {
            templateUrl: 'views/splash.html',
            controller: 'SplashController'
        })

        .when('/general', {
            templateUrl: 'views/general.html',
            controller: 'Controller'
        })
        .otherwise({
            redirectTo: function () {
                window.location = '/';
            }
        });


	$locationProvider.html5Mode(true);

}]);