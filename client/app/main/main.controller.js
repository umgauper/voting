'use strict';

angular.module('votingApp')
  .controller('MainCtrl', function ($scope, $http, $location, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.page = 'newPoll';
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollName = {name: ''};
    $scope.pollOptions = [];
    $scope.pollResults = [];

    //TODO: when new poll is submitted, clear form input fields.
    //TODO: splice out non-[a-zA-Z0-9]   characters from poll names! bcuz that's what VotePlex does
    $scope.addPoll = function() { //TODO: Add error catching/don't submit form if there is no current user!
      console.log('Submitting poll '+ 'for ' + Auth.getCurrentUser().name + '...');
      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name, //TODO: Save user in variable duh.
        poll_name: $scope.pollName.name,
        poll_options: $scope.pollOptions,
        poll_results: $scope.makeArr($scope.pollOptions.length)
      }).success(function() {
        console.log('new poll posted');
        $scope.page = 'newPollPosted';
      });

      //URL for new poll
      $scope.url = '';
      $scope.url = window.location + Auth.getCurrentUser().name + '/' + $scope.pollName.name;
      //$scope.page = 'newPollPosted';
    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };

    $scope.getPollData = function(user_name, poll_name) { //Put into service, so it's more modular?
      if(arguments.length === 0) {
        var paths = $location.path();
        user_name = paths.match(/[^\/].*(?=\/)/);//parse out username and path
        poll_name = paths.match(/.\/.*(?=$)/);
        poll_name = poll_name[0].substr(2, poll_name[0].length);
      }
      $http.get('/api/polls/' + user_name + '/' + poll_name).success(function(data) { //TODO: error catching for if data[0] undefined; if undefined show poll does not exist page!
        $scope.votePollName = data[0].poll_name;
        $scope.votePollCreator = data[0].user_name;
        $scope.votePollOptions = data[0].poll_options;
        $scope.votePollResults = data[0].poll_results;
        $scope.votePollUsers = data[0].voted_users;
        console.log(data[0]);

        //for graph
          var arr = [];
          arr.push(data[0].poll_results);
          $scope.data = arr;
          $scope.labels = data[0].poll_options;


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
      //console.log('Getting poll data for ' + poll_name);
      paths = '/';
    };
    //TODO: graph not working until page refreshed, not working first time i think do something diff. so page doesn't load until get is finished?
    //BECAUSE get is requesting BEFORE new poll is finished posting!!

    if(/[^\/].*(?=\/)/.test($location.path())) { //What's a better way to get poll data and show poll route when a poll is requested?
      $scope.getPollData();
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
      $scope.getPollData();
      //$scope.page = 'results';
    };

    $scope.loadAllPolls = function() {
      $http.get('api/polls/' + Auth.getCurrentUser().name).success(function(data) {
        $scope.polls = data;
        $scope.page = 'allPolls';
      });
    };

    $scope.delete = function(poll) {
      //var id = poll;
      //id = '#' + id.split(' ')[0];
      //$(id).remove();
      $http.delete('api/polls/' + poll).success($scope.loadAllPolls);
    };
  });
