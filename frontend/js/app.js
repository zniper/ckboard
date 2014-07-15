var checkerboard = angular.module('checkerboard', [
    'ngResource',
    'ngRoute',
    'cbControllers'
]);

checkerboard.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/login', {
                templateUrl: 'partials/login.html',
                controller: 'LoginController'
            }).
            when('/play', {
                templateUrl: 'partials/playground.html',
                controller: 'CheckerBoardController'
            }).
            otherwise({
                redirectTo: '/login'
            });
    }]);

checkerboard.config(['$resourceProvider', function ($resourceProvider) {
    // Don't strip trailing slashes from calculated URLs
    $resourceProvider.defaults.stripTrailingSlashes = false;
}]);


API_URL = 'http://localhost:8000/cb/';

checkerboard.factory('Players', ['$resource', function($resource) {
    return $resource(API_URL + 'players/:playerId',
        { playerId: '@playerId' }, {
            edit: {
                method: 'PUT',
                params: { playerId: '@playerId' },
                isArray: false
            }
        });
}]);
