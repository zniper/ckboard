var cbControllers = angular.module('cbControllers', ['ngResource', 'ngCookies']);


cbControllers.controller('LoginController', 
    function($scope, $http, $resource, $cookies, $location, Players) {
        $scope.login = { player_name: '', color: '' };
        $scope.submitForm = function() {
            if ($scope.login_form.$valid) {
                var player_data = {
                    name: $scope.login.player_name,
                    color: $scope.login.color
                    }
                Players.save({}, player_data); 
            } else {
                if ($scope.login_form.player_name.$invalid) {
                    $('#name-message').fadeIn(); 
                }
            }
        }
        
        var setCredentials = function(name, color) {
            $cookies.player_name = name;
            $cookies.color = color;
        }

        var goNext = function() {
            $location.path('/play');
        }

        var init = function() {
            params = $location.search();
            if (params.res=='1' && params.token.length>0) {
                // try to check authentication
                // then move to the friend list editing
                setCredentials($scope.login.player_name, $scope.login.color);
                goNext();
            } else if (params.res=='0') {
                alert('Registration Failed. Please verify your information and try again.');
            }
        };

        init();
    });


cbControllers.controller('CheckerBoardController', 
    function($scope, $http, $cookies) {

        $scope.updateName = function(index) {
            data = $scope.friends[index];
            config = {headers: {'X-CSRFToken': $cookies.csrftoken }};
            $http.put('/contacts/' + data.id, data, config).
                success(function(data, status) {
                    if (status == 200) {
                        alert('Done!');
                    } 
                });
        }

        var getFriendlist = function() {
            $http.get('/users/'+$cookies.uid+'/friends/'+'?token='+$cookies.token).
                success(function(data, status) {
                    if (status == 200) {
                        $scope.friends = data;
                    } else {
                        // nothing
                    }
                });
        }

        var init = function() {
            //getFriendlist();
            var board_size = 10;
            $scope.cell_list = [];//new Array(board_size);
            for (var i=0; i<board_size; i++) {
                $scope.cell_list.push(i);
            }
            $scope.cell_width = 100/board_size;
        };

        init();
    });


cbControllers.controller('MatchController', 
    function($scope, $http, $cookies) {
        var getProfile= function() {
            $http.get('/users/'+$cookies.uid+'?token='+$cookies.token).
                success(function(data, status) {
                    if (status == 200) {
                        $scope.fn = data['first_name'];
                        $scope.ln = data['last_name'];
                        delete data['first_name'];
                        delete data['last_name'];
                        $scope.profile = data;
                    } else {
                        // nothing
                    }
                });
        }
        var init = function() {
            getProfile();
        };

        init();
    });

cbControllers.controller('NavigationController', 
    function($scope, $cookies, $location) {

        $scope.anon = ($location.path() == '/login');

        var backHome = function() {
            $location.path('/');
        };

        $scope.logOut= function() {
            delete $cookies.uid;
            delete $cookies.token;
            delete $cookies.sessionid;
            delete $cookies.csrftoken;
            backHome();
        };

        var init = function() {
            if (!$cookies.token) {
                backHome();
            };
        };

        init();

    });
