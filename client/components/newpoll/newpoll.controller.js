'use strict';

angular.module('votingApp')
  .controller('NewpollCtrl', function($scope, $http, $location, Auth) {
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollOptions = [];

    $scope.addPoll = function() { //TODO: Add error catching/don't submit form if there is no current user!
      console.log('Submitting poll '+ 'for ' + Auth.getCurrentUser().name);
      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name, //TODO: Save user in variable duh.
        poll_name: $scope.pollName,
        poll_options: $scope.pollOptions
      });
      //TODO: create route for new poll...google dynamically creating routes in Angular??
        var url = '';
        url = $location.path() + Auth.getCurrentUser().name + '/' + $scope.pollName;
        console.log(url);

    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };
  });
