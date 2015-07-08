'use strict';

angular.module('votingApp')

  //need separate user_names for logged in user vs. poll creator!!
  // logged in user = $scope.currentUser ... use camelCase for any $scope variables
  //poll creator should be user_name...but sometimes we have to store that ... riiight?


  .controller('MainCtrl', function ($scope, $http, $location, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.page = 'newPoll';
    $scope.placeholders = ['Coke','Pepsi'];
    $scope.pollName = {name: ''}; //doesn't work if just string...
    $scope.pollOptions = [];
    $scope.pollResults = [];
    $scope.currentUser = Auth.getCurrentUser().name;
    $scope.data = [[100, 100, 100]];
    $scope.labels = ['this', 'is', 'a', 'test'];
    //TODO: when new poll is submitted, clear form input fields.
    //TODO: splice out non-[a-zA-Z0-9]   characters from poll names! bcuz that's what VotePlex does
    $scope.addPoll = function() { //TODO: Add error catching/don't submit form if there is no current user!
      console.log('Submitting poll for ' + Auth.getCurrentUser().name + '...');

      // Remove all non alphanumeric characters (excluding white space) from poll-name.
      $scope.pollName = $scope.pollName.name.split('').map(function(el) {
        if( /[\w\s]/.test(el) ) {
          return el
        }
      }).join('');

      $http.post('/api/polls', {
        user_name: Auth.getCurrentUser().name,
        poll_name: $scope.pollName,
        poll_options: $scope.pollOptions,
        poll_results: $scope.makeArr($scope.pollOptions.length)
      }).success(function() {
        console.log('New poll posted');
        $scope.page = 'newPollPosted';
      }); //TODO: Add error catching.

      //URL for new poll
      $scope.url = '';
      $scope.url = window.location + Auth.getCurrentUser().name + '/' + $scope.pollName;
    };
    $scope.addOption = function() {
      $scope.placeholders.push('New Option');
    };

    $scope.loadPoll = function(user_name, poll_name, page) {
      ////Load result page or vote page
      $scope.page = page;

      $http.get('/api/polls/' + user_name + '/' + poll_name).success(function(data, status) { //TODO: error catching for if data[0] undefined; if undefined show poll does not exist page!

        if(data[0]) {
        //for graph
          var arr = [];
          arr.push(data[0].poll_results);
          $scope.data = arr;
          $scope.labels = data[0].poll_options;

        //for voting
          $scope.pollName = data[0].poll_name;
          $scope.pollCreator = data[0].user_name;
          $scope.pollOptions = data[0].poll_options;
          $scope._id = data[0]._id;
          console.log('This poll id is ' + $scope._id);
        }
      })
        .error(function(data, status) {
          console.log(status);
        });
      //console.log('Getting poll data for ' + poll_name);
      //paths = '/';
    };
    //TODO: graph not working until page refreshed, not working first time i think do something diff. so page doesn't load until get is finished?
    //BECAUSE get is requesting BEFORE new poll is finished posting!!
 //possible to watch when something is typed into search bar?
    if(/[^\/].*(?=\/)/.test($location.path())) { //What's a better way to get poll data and show poll route when a poll is requested?
      var paths = $location.path();
      var user_name = paths.match(/[^\/].*(?=\/)/);        //parse out username and path
      var poll_name = paths.match(/.\/.*(?=$)/);
      poll_name = poll_name[0].substr(2, poll_name[0].length);
      $scope.loadPoll(user_name, poll_name, 'vote');
      }

    $scope.loadNewPoll = function() {
      $scope.page = 'newPoll';
      $location.path('/');
    };

    $scope.makeArr = function(x) {
      var arr=[];
      for(var i = 0; i < x; i++) {
        arr.push(0);
      }
      return arr;
    };

    $scope.addVote = function() {
      var val = $("input[type='radio']:checked").val();
      console.log("Submitting " + Auth.getCurrentUser().name + "'s vote for poll id: " + $scope._id);
      val = Number(val);
      $http.put('api/polls/' + $scope._id +'/' + val).success
      (function(result) {
          console.log('Vote submitted');
          $scope.loadPoll($scope.pollCreator, $scope.pollName, 'results');
        }
      );
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
      $http.delete('api/polls/' + poll).success($scope.loadAllPolls());
    };
  });
