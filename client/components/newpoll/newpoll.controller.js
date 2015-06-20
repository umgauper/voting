'use strict';

angular.module('votingApp')
  .controller('NewpollCtrl', function($scope, $http, $location, Auth) {
    if(Auth.isLoggedIn()) {
      $scope.page = 'newPoll';
    }
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollOptions = [];

    $scope.addPoll = function() { //TODO: Add error catching/don't submit form if there is no current user!
      console.log('Submitting poll '+ 'for ' + Auth.getCurrentUser().name + '...');
      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name, //TODO: Save user in variable duh.
        poll_name: $scope.pollName,
        poll_options: $scope.pollOptions
      });
      //TODO: create route for new poll...google dynamically creating routes in Angular??
        $scope.url = '';
        $scope.url = window.location + Auth.getCurrentUser().name + '/' + $scope.pollName;
        $scope.page = 'newPollPosted';
    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };

    // Try new idea...keep route for api/polls the same as before, but with the front-end just force the url to change then parse the url
    // change url w/o app redirecting to index? see what 's going on when I click that link!!


  });
