var cbControllers = angular.module('cbControllers', ['ngResource', 'ngCookies']);


cbControllers.controller('LoginController', 
    function($scope, $http, $cookies, $location, Player, Match) {
        $scope.login = { player_name: '', color: '#ff5f5f' };
        $scope.submitForm = function() {

            // Post new player to backend service
            if ($scope.login_form.$valid) {
                var player_data = {
                    name: $scope.login.player_name,
                    color: $scope.login.color
                    };
                player = new Player(player_data); 
                player.$save(function(player, response_headers){
                    $cookies.player_name = player.name;
                    $cookies.color = player_data['color'];
                    $cookies.player_id = player.id;
                });

                // Also create new match
                match = new Match();
                match.players = $cookies.player_id;
                match.$save(function(match, response_headers){
                    $cookies.match_id = match.id;
                    $cookies.com_id = match.players[1];
                    $cookies.com_name = 'Mensa Monkey';
                    $cookies.com_color = '#000';
                    goNext();
                });

            } else {
                if ($scope.login_form.player_name.$invalid) {
                    alert('Your provided information is not valid. Please correct and submit again.');
                }
            }
        }
        
        var goNext = function() {
            $location.path('/play');
        }
    });


cbControllers.controller('CheckerBoardController', 
    function($scope, $http, $cookies, Move) {

        $scope.cells = {};
        $scope.last_precheck = null;
        $scope.match_id = $cookies.match_id;
        $scope.player_name = $cookies.player_name; 
        $scope.player_id = $cookies.player_id; 
        $scope.com_id = $cookies.com_id; 
        $scope.com_name = $cookies.com_name; 
        $scope.com_color = $cookies.com_color; 
 

        var init = function() {
            //getFriendlist();
            var board_size = 10;
            $scope.cells = [];
            for (var ri=0; ri<board_size; ri++) {
                for (var ci=0; ci<board_size; ci++) {
                    $scope.cells.push({row: ri, col: ci, check: null, color: null});
                }
            }
            $scope.cells_left = $scope.cells.length; 
            $scope.checkerboard_width = 52*board_size;
        };

        $scope.precheckCell = function(cell, event) {
            if (cell['check'] == null) {
                if (cell['color'] == null) {
                    // Reset the last unsubmitted check
                    if ($scope.last_precheck) {
                        $scope.last_precheck['color'] = null;
                    }
                    cell['color'] = $cookies.color;
                    $scope.last_precheck = cell;
                    var target = event.currentTarget;
                    showSubmitButton(target.offsetLeft, target.offsetTop);
                } else {
                    cell['color'] = null;
                    showSubmitButton(null, null);
                }
            }
        }

        $scope.submitMove = function(event) {
            if ($scope.last_precheck) {
                var move = new Move({matchId: $scope.match_id});
                move.x = $scope.last_precheck.col;
                move.y = $scope.last_precheck.row;
                move.player = $scope.player_id;
                move.$save();
                
                // Reset the precheck status
                $scope.cells_left = $scope.cells_left - 1;
                $scope.last_precheck.check = $scope.player_id;
                $scope.last_precheck = null;
                showSubmitButton(null, null);

                // Get the next move from backend
                try {
                    getComputerMove();
                } catch (err) {
                    console.log('Error from backend');
                }
                if ($scope.cells_left == 0) {
                    $('#match-end-message').fadeIn(); 
                }
            }
        }

        var getComputerMove = function() {
            var params = {matchId: $scope.match_id, moveId: 'autoplay'};
            Move.get(params).$promise.then(function(move, responseHeaders) {
                for (ci=0; ci<$scope.cells.length; ci++) {
                    var cell = $scope.cells[ci];
                    if (cell.col == move.x && cell.row == move.y) {
                        cell.color = $cookies.com_color;
                        cell.check = $cookies.com_id;
                        $scope.cells_left = $scope.cells_left - 1;
                    }
                }
            });
        }

        var showSubmitButton = function(x, y) {
            sbutton = $('#submit-move');
            if (x != null && y != null) {
                sbutton.animate({top: y+4, left: x+sbutton.width()});
                sbutton.fadeIn();
            } else {
                sbutton.fadeOut();
            }
        }

        init();
    });


cbControllers.controller('MatchController', 
    function($scope, $http, $cookies) {
        $scope.player_name = $cookies.player_name;
        $scope.color = $cookies.color;
    });

cbControllers.controller('NavigationController', 
    function($scope, $cookies, $location) {

        $scope.anon = ($location.path() == '/login');

        var backHome = function() {
            $location.path('/');
        };

        $scope.logOut= function() {
            delete $cookies.player_name;
            delete $cookies.color;
            backHome();
        };

        var init = function() {
            if (!$cookies.player_name) {
                backHome();
            };
        };

        init();

    });
