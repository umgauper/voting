'use strict';

angular.module('votingApp')
  .controller('MainCtrl', function ($scope, $http, $location, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.page = 'newPoll';
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollName = {name: ''};
    $scope.pollOptions = [];
    $scope.pollResults = [];

    $scope.addPoll = function() { //TODO: Add error catching/don't submit form if there is no current user!
      console.log('Submitting poll '+ 'for ' + Auth.getCurrentUser().name + '...');
      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name, //TODO: Save user in variable duh.
        poll_name: $scope.pollName.name,
        poll_options: $scope.pollOptions,
        poll_results: $scope.makeArr($scope.pollOptions.length)
      });
      $scope.url = '';
      $scope.url = window.location + Auth.getCurrentUser().name + '/' + $scope.pollName.name;
      $scope.page = 'newPollPosted';
    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };

    if(/[^\/].*(?=\/)/.test($location.path())) {
      var paths = $location.path();                         //TODO: fix issue when one poll's already clicked and you make new poll, new url is tacked on to first poll's url!!
                                                            // clicking new poll clears location?
      var user_name = paths.match(/[^\/].*(?=\/)/);        //parse out username and path!
      var poll_name = paths.match(/.\/.*(?=$)/);
      console.log(poll_name);
      poll_name = poll_name[0].substr(2, poll_name[0].length);
      $http.get('/api/polls/' + user_name + '/' + poll_name).success(function(data) {
        console.log(data);
        $scope.votePollName = data[0].poll_name;
        $scope.votePollCreator = data[0].user_name;
        $scope.votePollOptions = data[0].poll_options;
      });
      $scope.page = 'vote';
      paths = '/';
    }

    $scope.loadNewPoll = function() {
      $scope.page = 'newPoll';
      $location.path('/');
    };

    $scope.makeArr = function(x) {// move into a service ??? like Auth?
      var arr=[];
      for(var i = 0; i < x; i++) {
        arr.push(0);
      }
      return arr;
    }


  });
