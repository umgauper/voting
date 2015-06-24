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

    function getPollData() {
      var paths = $location.path();
      var user_name = paths.match(/[^\/].*(?=\/)/);        //parse out username and path
      var poll_name = paths.match(/.\/.*(?=$)/);
      poll_name = poll_name[0].substr(2, poll_name[0].length);
      $http.get('/api/polls/' + user_name + '/' + poll_name).success(function(data) {
        $scope.votePollName = data[0].poll_name;
        $scope.votePollCreator = data[0].user_name;
        $scope.votePollOptions = data[0].poll_options;
        $scope.votePollResults = data[0].poll_results;
        $scope.votePollUsers = data[0].voted_users;
        console.log(data[0]);

        //for graph
        var arr = [];
        arr.push(data[0].poll_results);
        $scope.labels = data[0].poll_options;
        $scope.data = arr;

        //Load result page or vote page
        console.log(Auth.getCurrentUser().name + ", " + $scope.votePollCreator);
        //if the logged in user is requesting his/her own poll show him/her the results page
        if ($scope.votePollCreator === Auth.getCurrentUser().name) { //ISSUE: this conditional is tested before get request from getPollData is finished
          $scope.page = 'results';
          console.log("Showing " + Auth.getCurrentUser().name + " his/her poll results");
          // if the logged in user has already voted on the requested poll, show him/her the results page
        } else if($scope.votePollUsers.indexOf(Auth.getCurrentUser().name) !== -1) {
          $scope.page = 'results';
          console.log(Auth.getCurrentUser().name + " has already voted on this poll.");
        } else {
          $scope.page = 'vote';
        }
      });
      console.log('Getting poll data for ' + poll_name);
      paths = '/';
    }

    if(/[^\/].*(?=\/)/.test($location.path())) { //What's a better way to get poll data and show poll route when a poll is requested?
      getPollData();
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
    };

    $scope.addVote = function() {
      var val = $("input[type='radio']:checked").val();
      console.log("Submitting " + Auth.getCurrentUser().name + "'s vote");
      val = Number(val);
      $http.put('api/polls/' + $scope.votePollCreator + '/' + $scope.votePollName + '/' + val + '/' + Auth.getCurrentUser().name);
      getPollData();
      $scope.page = 'results';
    };
  });
